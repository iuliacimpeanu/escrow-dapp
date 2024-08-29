import { AbiRegistry, Address, SmartContractQueriesController, SmartContractTransactionsFactory } from "@multiversx/sdk-core/out";
import { useEffect, useRef, useState } from "react";
import { ContractAddressEnum } from "../../../utils/enums";
import { formatAmount, parseAmount } from "@multiversx/sdk-dapp/utils/operations";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks";

interface ILockedTokenAmount{
  token_identifier: string,
  amount: string
}

export const UnlockTokensSection = ({wallet_address, abi, factory, controller}: {wallet_address: string, abi:AbiRegistry, factory: SmartContractTransactionsFactory, controller: SmartContractQueriesController}) => {

  const [lockedTokensAmounts, setLockedTokensAmounts] = useState([]);
  const { success } = useGetActiveTransactionsStatus();

  const hasRunLockRef = useRef(false); //to run only at first render
  useEffect(() => {
      const initializeLockedTable = async () => {
          if (abi && !hasRunLockRef.current) {
              await viewLockedTokensAmounts();
              hasRunLockRef.current = true;
          }
      };

      initializeLockedTable();
  }, [abi]); 

  const viewLockedTokensAmounts = async () => {

    let args = [wallet_address]
    // query
    const query = controller.createQuery({
        contract: ContractAddressEnum.liquidLockingContract,
        function: "lockedTokenAmounts",
        arguments: args,
    });

    const queryResponse = await controller.runQuery(query);
    const [tokensAmounts] = controller.parseQueryResponse(queryResponse);

    const parsedTokensAmounts = tokensAmounts.map((tokenAmount: any) => ({
      token_identifier: tokenAmount.token_identifier,
      amount: formatAmount({input: tokenAmount.amount.toString()}),
    }))

    setLockedTokensAmounts(parsedTokensAmounts)
  }

  const unlockTransaction = async (token_identifier: string, _amount: string) => {

    let amount: bigint = BigInt(parseAmount(_amount));
    let token_nonce = 0
    let args =[[{token_identifier, token_nonce, amount}]]

    const tx = factory.createTransactionForExecute({
        sender: Address.fromBech32(wallet_address),
        contract: Address.fromBech32(ContractAddressEnum.liquidLockingContract),
        function: "unlock",
        gasLimit: 30000000n,
        arguments: args,
        
    });

    if (tx == null) {
      console.error("Transaction not found");
      return;
    }

    await sendTransactions({
      transactions: [tx],
      transactionsDisplayInfo: {
        processingMessage: "Processing transaction",
        errorMessage: "An error has occured",
        successMessage: "Transaction successful",
      },
      signWithoutSending: false,
    });
  }

  // refresh table
  useEffect(() => {
    if (success) {
      viewLockedTokensAmounts()
    }
  }, [success]);

  return (
      <div>
        <div className="flex flex-col p-6 px-10 rounded-xl m-2 bg-mvx-bg-gray justify-center">
          <h2 className="flex font-medium group text-sm text-gray-300">Unlock Tokens</h2>
          <div className="mt-5">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-500 rounded-lg">
              <thead className="bg-mvx-button-bg-gray rounded-t-lg">
              <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-300">Token Identifier</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-300">Unlock Token</th>
              </tr>
              </thead>
              <tbody className="bg-mvx-bg-gray divide-y divide-gray-500">
                  {lockedTokensAmounts.map((tokenAmount: ILockedTokenAmount) => (
              <tr 
              key={tokenAmount.token_identifier}
              className="divide-x divide-gray-500"
              >
                  <td className="px-6 py-3 text-sm text-mvx-blue font-normal">{tokenAmount.token_identifier.toString()}</td>
                  <td className="px-6 py-3 text-sm text-mvx-blue font-normal">{tokenAmount.amount.toString()}</td>
                  <td className="px-6 py-3 text-sm text-mvx-blue font-normal">
                      <button 
                      onClick={() => unlockTransaction(tokenAmount.token_identifier.toString(), tokenAmount.amount)} 
                      className="bg-mvx-blue text-mvx-button-text hover:bg-gray-300 rounded-lg px-4 py-1"
                      >
                      Unlock     
                      </button>
                  </td>
              </tr>
              ))}
              </tbody>
          </table>
          {/* <button className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm font-normal" onClick={viewLockedTokensAmounts}>View locked tokens</button> */}
          </div>
        </div>
      </div>
  )
}