import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { SmartContractTransactionsFactory} from "@multiversx/sdk-core"
import { Address, TokenTransfer, Token } from "@multiversx/sdk-core/out";
import { ContractAddressEnum  } from "../../../utils";
import { parseAmount } from "@multiversx/sdk-dapp/utils";
import { useState } from "react";

export const CreateOfferSection = ({ wallet_address, tokenOptions, checkAvailableAmount, escrow_factory }: { wallet_address: string, tokenOptions: { identifier: string, balance: string }[], checkAvailableAmount: (token: string) => string, escrow_factory: SmartContractTransactionsFactory }) => {

    const [acceptedToken, setAcceptedToken] = useState<string>('');
    const [acceptedAmount, setAcceptedAmount] = useState<string>('');
    const [acceptedAddress, setAcceptedAddress] = useState<string>('');
    const [offeredToken, setOfferedToken] = useState<string>('');
    const [offeredAmount, setOfferedAmount] = useState<string>('');
    const [availableAmount, setAvailableAmount] = useState('');
  
    const handleAcceptedTokenInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptedToken(event.target.value);
    }

    const handleAcceptedAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptedAmount(event.target.value);
    }

    const handleAcceptedAddressInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptedAddress(event.target.value);
    }

    const handleOfferedTokenInput = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setOfferedToken(event.target.value);
      setAvailableAmount(checkAvailableAmount(event.target.value))
    }

    const handleOfferedAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setOfferedAmount(event.target.value);
    }

    //create offer transaction
    const createOffer = async () => {

      if(Number(offeredAmount) > Number(availableAmount)){
        alert('Insufficient funds! Check available amount!\nTransaction is cancelled!')
        return;
      }

      let _acceptedAmount: bigint = BigInt(parseAmount(acceptedAmount));
      let _offeredAmount: bigint = BigInt(parseAmount(offeredAmount));

      let args = [acceptedToken, 0, _acceptedAmount, acceptedAddress]

      const tx = escrow_factory.createTransactionForExecute({
          sender: Address.fromBech32(wallet_address),
          contract: Address.fromBech32(ContractAddressEnum.escrowContract),
          function: "createOffer",
          gasLimit: 30000000n,
          arguments: args,
          tokenTransfers: [
              new TokenTransfer({
                  token: new Token({ identifier: offeredToken }),
                  amount: _offeredAmount
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
    
    <div className="flex flex-col p-4 px-10 rounded-xl m-2 justify-center bg-mvx-bg-gray">
        <h2 className="flex font-medium group text-sm text-gray-300">Create Offer</h2>
        <div className="flex flex-col items-center my-5 font-normal">
          <div className="w-full flex flex-col gap-5">
            <div className="flex items-center gap-5 w-full">
              <div className="flex flex-col items-start gap-1 w-1/2">
                <label htmlFor="offered_token" className="text-xs text-mvx-lighter-gray">Offered Token</label>
                <select 
                  id="select-token" 
                  value={offeredToken} 
                  onChange={handleOfferedTokenInput}
                  className="px-6 py-3 rounded-lg text-sm font-medium bg-mvx-button-bg-gray text-mvx-text-gray w-full"
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
              </div>
              <div className="flex flex-col items-start gap-1 w-1/2">
                <label htmlFor="offered_amount" className="text-xs text-mvx-lighter-gray">Offered Amount</label>
                <input id="offered_amount" type="text" onChange={handleOfferedAmountInput} className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"/>
              </div>
            </div>

            <div className="flex items-center gap-5 w-full">
              <div className="flex flex-col items-start gap-1 w-1/2">
                <label htmlFor="accepted_token" className="text-xs text-mvx-lighter-gray">Accepted Token</label>
                <input id="accepted_token" type="text" onChange={handleAcceptedTokenInput} className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"/>
              </div>

              <div className="flex flex-col items-start gap-1 w-1/2">
                <label htmlFor="accepted_amount" className="text-xs text-mvx-lighter-gray">Accepted Amount</label>
                <input id="accepted_amount" type="text" onChange={handleAcceptedAmountInput} className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"/>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1 w-full">
              <label htmlFor="accepted_address" className="text-xs text-mvx-lighter-gray">Accepted Address</label>
              <input id="accepted_address" type="text" onChange={handleAcceptedAddressInput} className="rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray text-gray-300 w-full"/>
            </div>
          </div>
          <button
          onClick={createOffer}
          className="bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 mt-5 rounded-lg text-sm"
          >
          Create offer
          </button>
        </div>
    </div>

    

  );
};
