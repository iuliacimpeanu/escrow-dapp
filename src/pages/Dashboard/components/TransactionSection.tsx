import { Transaction } from "@multiversx/sdk-core/out";
import { useEffect, useState } from "react";
import { useGetAccount, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { SmartContractTransactionsFactory, TransactionsFactoryConfig } from "@multiversx/sdk-core"
import { AbiRegistry } from "@multiversx/sdk-core";
import { Address } from "@multiversx/sdk-core/out";
import { TokenTransfer } from "@multiversx/sdk-core/out";
import { Token } from "@multiversx/sdk-core/out";
import { ContractAddressEnum, WalletAddressEnum } from "../../../utils";

const WEGLD_TOKEN: string = 'WEGLD-a28c59';

export const TransactionSection = () => {

    const [tx, setTx] = useState<Transaction>();
    const { address } = useGetAccount();
    const [userInput, setUserInput] = useState<string>('');

    const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    }

    const denominateValue = (input: string) : bigint => {
        return BigInt(parseFloat(input) * 10**18)
    }

    const { pendingTransactionsArray } = useGetPendingTransactions();

    const createOffer = async () => {

        // abi
        const response = await fetch("escrow.abi.json");
        const abiJson = await response.text();
        let abiObj = JSON.parse(abiJson);
        let abi = AbiRegistry.create(abiObj);

        // factory
        const factoryConfig = new TransactionsFactoryConfig({ chainID: "D" });
        let factory = new SmartContractTransactionsFactory({
            config: factoryConfig,
            abi: abi
        });

        let userAmount: bigint = (denominateValue(userInput));
        let args = [WEGLD_TOKEN, 0, userAmount, ContractAddressEnum.escrowContract]

        const tx = factory.createTransactionForExecute({
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
        setTx(tx);
    }

    const sendOffer = async () => {
        if (!address || !tx) {
          console.error("Address or transaction not found");
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
      };

    useEffect(() => {
    console.log("tx", tx);
    }, [tx]);

  return (
    
    <div className="w-1/2 flex flex-col p-6 rounded-xl bg-white">

        <h2 className="flex font-medium group text-sm">
            Create offer
        </h2>
        <input type="text" placeholder="amount" onChange={handleUserInput} className="w-1/2 border border-gray-300 rounded text-xl"/>
        <button
        onClick={createOffer}
        className="w-1/2 bg-mvx-blue hover:scale-105  text-black  py-1 px-2 my-2 rounded-lg text-base"
        >
        Create offer
        </button>
        <pre className="text-sm text-left">
        <code>{JSON.stringify(tx?.toPlainObject(), null, 2)}</code>
        </pre>
        <button
        onClick={sendOffer}
        className="w-1/2 bg-mvx-blue hover:scale-105  text-black  py-1 px-2 my-2 rounded-lg text-base"
        disabled={pendingTransactionsArray.length > 0}
      >
        {pendingTransactionsArray.length > 0 ? (
          <span>Sending...</span>
        ) : (
          <span>Send offer</span>
        )}
        </button>
    </div>
  );
};
