import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { SmartContractTransactionsFactory} from "@multiversx/sdk-core"
import { Address, TokenTransfer, Token } from "@multiversx/sdk-core/out";
import { ContractAddressEnum,  } from "../../../utils";
import { parseAmount } from "@multiversx/sdk-dapp/utils";
import { useState } from "react";

export const CreateOfferSection = ({ wallet_address, escrow_factory }: { wallet_address: string, escrow_factory: SmartContractTransactionsFactory }) => {

    const [acceptedToken, setAcceptedToken] = useState<string>('');
    const [acceptedAmount, setAcceptedAmount] = useState<string>('');
    const [acceptedAddress, setAcceptedAddress] = useState<string>('');
    const [offeredToken, setOfferedToken] = useState<string>('');
    const [offeredAmount, setOfferedAmount] = useState<string>('');
  
    const handleAcceptedTokenInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptedToken(event.target.value);
    }

    const handleAcceptedAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptedAmount(event.target.value);
    }

    const handleAcceptedAddressInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptedAddress(event.target.value);
    }

    const handleOfferedTokenInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setOfferedToken(event.target.value);
    }

    const handleOfferedAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setOfferedAmount(event.target.value);
    }

    //create offer transaction
    const createOffer = async () => {

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
    
    <div className=" flex flex-col p-4 rounded-xl m-1 bg-white justify-center">
        <h2 className="flex font-medium group text-sm">Create Offer</h2>
        <div className="flex gap-5 items-center">
          <div className="w-1/2 flex flex-col gap-y-2 my-3">
            <input type="text" placeholder="accepted token" onChange={handleAcceptedTokenInput} className="border border-gray-300 rounded-lg text-base px-4"/>
            <input type="text" placeholder="accepted amount" onChange={handleAcceptedAmountInput} className="border border-gray-300 rounded-lg text-base px-4"/>
            <input type="text" placeholder="accepted address" onChange={handleAcceptedAddressInput} className="border border-gray-300 rounded-lg text-base px-4"/>
          </div>
          <div className="w-1/2 flex flex-col gap-y-2 my-3">
            <input type="text" placeholder="offered token" onChange={handleOfferedTokenInput} className="border border-gray-300 rounded-lg text-base px-4"/>
            <input type="text" placeholder="offered amount" onChange={handleOfferedAmountInput} className="border border-gray-300 rounded-lg text-base px-4"/>
          </div>
          <button
          onClick={createOffer}
          className="w-1/2 bg-mvx-blue hover:shadow-lg  text-black  py-2 px-2 my-2 rounded-lg text-base"
          >
          Create offer
          </button>
        </div>
    </div>
  );
};
