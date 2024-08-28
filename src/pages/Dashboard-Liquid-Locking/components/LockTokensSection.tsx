import { AbiRegistry, Address, SmartContractQueriesController, SmartContractTransactionsFactory, Token, TokenTransfer } from "@multiversx/sdk-core/out";
import { useEffect, useRef, useState } from "react";
import { ContractAddressEnum } from "../../../utils/enums";
import { parseAmount } from "@multiversx/sdk-dapp/utils/operations";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

export const LockTokensSection = ({wallet_address, abi, factory, controller, tokenOptions, checkAvailableAmount}: {wallet_address: string, abi:AbiRegistry, factory: SmartContractTransactionsFactory, controller: SmartContractQueriesController, tokenOptions: { identifier: string, balance: string }[], checkAvailableAmount: (token: string) => string}) => {

    const [token, setToken] = useState<string>('');
    const [lockAmount, setLockAmount] = useState<string>('');
    const [lockedTokens, setLockedTokens] = useState([]);
    const hasRunLockRef = useRef(false); //to run only at first render

    // update selected token and its available amount
    const handleTokenSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setToken(event.target.value)
    }

    const handleLockAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLockAmount(event.target.value)
    }

    useEffect(() => {
        const initializeLockedTable = async () => {
            if (abi && !hasRunLockRef.current) {
                await viewLockedTokens();
                hasRunLockRef.current = true;
            }
        };
  
        initializeLockedTable();
    }, [abi]); 

    const lockTransaction = async () => {

        let availableAmount: string = checkAvailableAmount(token)

        if(Number(lockAmount) > Number(availableAmount)){
          alert('Insufficient funds! Transaction is cancelled!')
          return;
        }

        let _lockAmount: bigint = BigInt(parseAmount(lockAmount));

        const tx = factory.createTransactionForExecute({
            sender: Address.fromBech32(wallet_address),
            contract: Address.fromBech32(ContractAddressEnum.liquidLockingContract),
            function: "lock",
            gasLimit: 30000000n,
            arguments: [],
            tokenTransfers: [
                new TokenTransfer({
                    token: new Token({ identifier: token }),
                    amount: _lockAmount
                })
            ]
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

      const viewLockedTokens = async () => {

        let args = [wallet_address]
        // query
        const query = controller.createQuery({
            contract: ContractAddressEnum.liquidLockingContract,
            function: "lockedTokens",
            arguments: args,
        });

        const queryResponse = await controller.runQuery(query);
        const [tokens] = controller.parseQueryResponse(queryResponse);

        setLockedTokens(tokens)
    }

    return (
        <div>

          <div className="flex flex-col py-5 px-10 rounded-xl m-1 bg-mvx-bg-gray justify-center">
            <h2 className="flex font-medium group text-sm text-gray-300">Lock Token</h2>
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
                <input id="offered_amount" type="text" placeholder="Amount" onChange={handleLockAmount} className="w-1/2 rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300"/>
              </div>
              <button className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm font-normal" onClick={lockTransaction}>Lock</button>

            </div>
          </div>

        
          <div className="flex flex-col py-5 px-10 rounded-xl my-3 bg-mvx-bg-gray justify-center">
            <h2 className="flex font-medium group text-sm text-gray-300">Locked Tokens</h2>
            <div className="mt-5">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-500 rounded-lg">
                <thead className="bg-mvx-button-bg-gray rounded-t-lg">
                <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Token Identifier</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Unlock Token</th>
                </tr>
                </thead>
                <tbody className="bg-mvx-bg-gray divide-y divide-gray-500">
                    {lockedTokens.map((token) => (
                <tr 
                className="divide-x divide-gray-500"
                >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mvx-blue font-normal">{token}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mvx-blue font-normal">
                        <button 
                        // onClick={() => blacklistToken(token)} 
                        className="bg-mvx-blue text-mvx-button-text hover:scale-105 rounded-lg px-4 py-1"
                        >
                        Unlock     
                        </button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            {/* <button className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm font-normal" onClick={viewLockedTokens}>View locked tokens</button> */}
            </div>
          </div>     
        </div>
    )
}