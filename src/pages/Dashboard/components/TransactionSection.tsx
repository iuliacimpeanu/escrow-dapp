import { useState } from "react";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { AbiRegistry, SmartContractTransactionsFactory, TransactionsFactoryConfig } from "@multiversx/sdk-core"
import { Address } from "@multiversx/sdk-core/out";
import { TokenTransfer } from "@multiversx/sdk-core/out";
import { Token } from "@multiversx/sdk-core/out";
import { ContractAddressEnum, denominateValue, WalletAddressEnum } from "../../../utils";

const WEGLD_TOKEN: string = 'WEGLD-a28c59';
// interface ITransactionProps {
//   escrow_factory: SmartContractTransactionsFactory | any
// }

// export const TransactionSection : React.FC<ITransactionProps> = ({escrow_factory}) => {
export const TransactionSection = () => {

    const [userInput, setUserInput] = useState<string>('');
    
    const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    }

    const createOffer = async () => {
      //abi
      const response = await fetch("escrow.abi.json");
      const abiJson = await response.text();
      let abiObj = JSON.parse(abiJson);
      let abi = AbiRegistry.create(abiObj);
  
      //factory
      const factoryConfig = new TransactionsFactoryConfig({ chainID: "D" });
      let factory = new SmartContractTransactionsFactory({
          config: factoryConfig,
          abi: abi
      });

      let userAmount: bigint = (denominateValue(userInput));
      let args = [WEGLD_TOKEN, 0, userAmount, WalletAddressEnum.myWallet]

      const transaction = factory.createTransactionForExecute({
          sender: Address.fromBech32(WalletAddressEnum.myWallet),
          contract: Address.fromBech32(ContractAddressEnum.escrowContract),
          function: "createOffer",
          gasLimit: 30000000n,
          arguments: args,
          tokenTransfers: [
              new TokenTransfer({
                  token: new Token({ identifier: WEGLD_TOKEN }),
                  amount: userAmount
              })
          ]
          
      });

      if (transaction == null) {
        console.error("Transaction not found");
        return;
      }
  
      await sendTransactions({
        transactions: [transaction],
        transactionsDisplayInfo: {
          processingMessage: "Processing transaction",
          errorMessage: "An error has occured",
          successMessage: "Transaction successful",
        },
        signWithoutSending: false,
      });
    }

  return (
    
    <div className="w-1/2 flex flex-col p-6 rounded-xl m-1 bg-white justify-center">
        <h2 className="flex font-medium group text-sm">Create Offer</h2>
        <div className="flex gap-5 items-center">
          <input type="text" placeholder="insert amount" onChange={handleUserInput} className="w-1/2 border border-gray-300 rounded-lg text-xl px-4"/>
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
