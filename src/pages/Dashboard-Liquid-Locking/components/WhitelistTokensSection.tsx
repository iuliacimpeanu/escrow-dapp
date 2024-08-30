import { AbiRegistry, Address, SmartContractQueriesController, SmartContractTransactionsFactory } from "@multiversx/sdk-core/out";
import { ContractAddressEnum } from "../../../utils/enums";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { useEffect, useRef, useState } from "react";
import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks";

export const WhitelistTokensSection = ({wallet_address, abi, factory, controller, tokenOptions}: {wallet_address: string, abi:AbiRegistry, factory: SmartContractTransactionsFactory, controller: SmartContractQueriesController, tokenOptions: { identifier: string, balance: string }[]}) => {

  const [whitelistedTokens, setWhitelistedTokens] = useState([]);
  const [token, setToken] = useState<string>('');
  const { success } = useGetActiveTransactionsStatus();
  
  // update selected token and its available amount
  const handleTokenSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToken(event.target.value)
  }

  const hasRunWhitelistRef = useRef(false); //to run only at first render
    useEffect(() => {
      const initializeWhitelistTable = async () => {
          if (abi && !hasRunWhitelistRef.current) {
              await viewWhitlestedTokens();
              hasRunWhitelistRef.current = true;
          }
      };
      initializeWhitelistTable();
  }, [abi]); 

  const whitelistToken = async (token: string) => {
      
    let args = [token]
    const tx = factory.createTransactionForExecute({
        sender: Address.fromBech32(wallet_address),
        contract: Address.fromBech32(ContractAddressEnum.liquidLockingContract),
        function: "whitelist_token",
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

    const blacklistToken = async (token: string) => {
      
      let args = [token]
      const tx = factory.createTransactionForExecute({
          sender: Address.fromBech32(wallet_address),
          contract: Address.fromBech32(ContractAddressEnum.liquidLockingContract),
          function: "blacklist_token",
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

    const viewWhitlestedTokens = async () => {

      // query
      const query = controller.createQuery({
          contract: ContractAddressEnum.liquidLockingContract,
          function: "whitelistedTokens",
          arguments: [],
      });

      const queryResponse = await controller.runQuery(query);
      const [tokens] = controller.parseQueryResponse(queryResponse);

      setWhitelistedTokens(tokens)
    }

    // refresh table
    useEffect(() => {
      if (success) {
        viewWhitlestedTokens()
      }
    }, [success]);

    return (
      <div>
        <div className="flex flex-col p-6 px-10 rounded-xl m-2 bg-mvx-bg-gray justify-center">
          <h2 className="flex font-medium group text-sm text-gray-300">Whitelist Tokens</h2>
          <div className="mt-5">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-500 rounded-lg">
              <thead className="bg-mvx-button-bg-gray rounded-t-lg">
              <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-300">Whitelisted Tokens</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-300">Blacklist Token</th>
              </tr>
              </thead>
              <tbody className="bg-mvx-bg-gray divide-y divide-gray-500">
                  {whitelistedTokens.map((token, index) => (
                    <tr key={index} className="divide-x divide-gray-500">
                      <td className="px-6 py-3 text-sm text-mvx-blue font-normal">{token}</td>
                      <td className="px-6 py-3 text-sm text-mvx-blue font-normal">
                        <button 
                        onClick={() => blacklistToken(token)} 
                        className="bg-mvx-blue text-mvx-button-text hover:bg-gray-300 rounded-lg px-4 py-1"
                        >
                        Blacklist      
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
          </table>
          {/* <button className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm font-normal" onClick={viewWhitlestedTokens}>View whitelisted tokens</button> */}
          </div>
          <div className="mt-5">
            <div className="flex items-center gap-5">
              <select 
              id="select-token" 
              value={token} 
              onChange={handleTokenSelection}
              className="w-1/2 px-6 py-3 rounded-md text-sm font-medium bg-mvx-button-bg-gray text-mvx-text-gray"
              >
                <option value="" disabled>
                  Select token
                </option>
                {tokenOptions.map((tokenOption, index) => (
                  <option key={index} value={tokenOption.identifier}>
                    {tokenOption.identifier}
                  </option>
                ))}
              </select>
              <button className="w-1/2 bg-mvx-blue hover:bg-gray-300 text-mvx-button-text  py-3 px-6 rounded-lg text-sm font-normal" onClick={() => whitelistToken(token)}>Whitelist Token</button>
            </div>
          </div>
        </div>
      </div>
    )
}