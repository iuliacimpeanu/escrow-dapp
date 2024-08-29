import { formatAmount, parseAmount } from "@multiversx/sdk-dapp/utils";
import { ContractAddressEnum } from "../../../utils/enums";
import { useEffect, useRef, useState } from "react";
import { AbiRegistry, Address, SmartContractQueriesController, SmartContractTransactionsFactory } from "@multiversx/sdk-core/out";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks";

interface IUnlockedTokenAmount{
    token_identifier: string,
    amount: string,
    unbond_epoch: string
  }

export const UnbondTokensSection = ({wallet_address, abi, factory, controller}: {wallet_address: string, abi:AbiRegistry, factory: SmartContractTransactionsFactory, controller: SmartContractQueriesController}) => {

    const [unlockedTokensAmounts, setUnlockedTokensAmounts] = useState([]);
    const { success } = useGetActiveTransactionsStatus();

    const hasRunUnlockRef = useRef(false); //to run only at first render
    useEffect(() => {
      const initializeUnlockedTable = async () => {
          if (abi && !hasRunUnlockRef.current) {
              await viewUnlockedTokensAmounts();
              hasRunUnlockRef.current = true;
          }
      };

      initializeUnlockedTable();
    }, [abi]); 

    const viewUnlockedTokensAmounts = async () => {

        let args = [wallet_address]
        // query
        const query = controller.createQuery({
            contract: ContractAddressEnum.liquidLockingContract,
            function: "unlockedTokenAmounts",
            arguments: args,
        });

        const queryResponse = await controller.runQuery(query);
        const [tokensAmounts] = controller.parseQueryResponse(queryResponse);

        const parsedTokensAmounts = tokensAmounts.map((tokenAmount: any) => ({
            token_identifier: tokenAmount.token.token_identifier,
            amount: formatAmount({input: tokenAmount.token.amount.toString()}),
            unbond_epoch: parseAmount(formatAmount({input: tokenAmount.unbond_epoch.toString()}))
        }))

        setUnlockedTokensAmounts(parsedTokensAmounts)
    }

    const unbondTransaction = async (token_identifier: string) => {

        // if()

        let args =[[token_identifier]]
        const tx = factory.createTransactionForExecute({
            sender: Address.fromBech32(wallet_address),
            contract: Address.fromBech32(ContractAddressEnum.liquidLockingContract),
            function: "unbond",
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

    useEffect(() => {
        if (success) {
            viewUnlockedTokensAmounts()
        }
    }, [success]);

    return (
        <div className="flex flex-col p-6 px-10 rounded-xl m-2 bg-mvx-bg-gray justify-center">
            <h2 className="flex font-medium group text-sm text-gray-300">Unbond Tokens</h2>
            <div className="mt-5">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-500 rounded-lg">
                <thead className="bg-mvx-button-bg-gray rounded-t-lg">
                <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Token Identifier</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Amount</th>
                    {/* <th className="px-6 py-3 text-sm font-semibold text-gray-300">Unbond Epoch</th> */}
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Unbond Token</th>
                </tr>
                </thead>
                <tbody className="bg-mvx-bg-gray divide-y divide-gray-500">
                    {unlockedTokensAmounts.map((tokenAmount: IUnlockedTokenAmount) => (
                <tr 
                key={tokenAmount.token_identifier}
                className="divide-x divide-gray-500"
                >
                    <td className="px-6 py-3 text-sm text-mvx-blue font-normal">{tokenAmount.token_identifier.toString()}</td>
                    <td className="px-6 py-3 text-sm text-mvx-blue font-normal">{tokenAmount.amount.toString()}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-mvx-blue font-normal">{tokenAmount.unbond_epoch.toString()}</td> */}
                    <td className="px-6 py-3 text-sm text-mvx-blue font-normal">
                        <button 
                        onClick={() => unbondTransaction(tokenAmount.token_identifier.toString())} 
                        className="bg-mvx-blue text-mvx-button-text hover:bg-gray-300 rounded-lg px-4 py-1"
                        >
                        Unbond     
                        </button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            {/* <button className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm font-normal" onClick={viewUnlockedTokensAmounts}>View unlocked tokens</button> */}
            </div>
        </div>     
    )
}
