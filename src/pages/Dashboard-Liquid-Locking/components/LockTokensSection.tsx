import { Address, SmartContractTransactionsFactory, Token, TokenTransfer } from "@multiversx/sdk-core/out";
import { useState } from "react";
import { ContractAddressEnum } from "../../../utils/enums";
import { parseAmount } from "@multiversx/sdk-dapp/utils/operations";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

export const LockTokensSection = ({wallet_address, factory, tokenOptions, checkAvailableAmount}: {wallet_address: string, factory: SmartContractTransactionsFactory, tokenOptions: { identifier: string, balance: string }[], checkAvailableAmount: (token: string) => string}) => {

  const [token, setToken] = useState<string>('');
  const [lockAmount, setLockAmount] = useState<string>('');
  
  // update selected token and its available amount
  const handleTokenSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setToken(event.target.value)
  }

  const handleLockAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLockAmount(event.target.value)
  }

  const lockTransaction = async () => {

    if(token === ''){
      alert('Select token first!')
      return
    } else if (lockAmount === '') {
      alert('Insert amount for lock!')
      return
    }

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

  return (
      <div>
        <div className="flex flex-col p-6 px-10 rounded-xl m-2 bg-mvx-bg-gray justify-center">
          <h2 className="flex font-medium group text-sm text-gray-300">Lock Tokens</h2>
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
            <button className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm font-normal" onClick={lockTransaction}>Lock Token</button>
          </div>
        </div>
      </div>
  )
}