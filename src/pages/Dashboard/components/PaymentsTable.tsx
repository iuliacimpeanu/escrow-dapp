import { useEffect, useState } from "react";
import { AbiRegistry, Address, QueryRunnerAdapter, SmartContractQueriesController, SmartContractTransactionsFactory, TransactionsFactoryConfig } from "@multiversx/sdk-core";
import { ContractAddressEnum, nominateValue, WalletAddressEnum } from "../../../utils";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";

interface IOffer{
    id: string,
    token_identifier: string,
    amount: string,
    acceptedAddress: string
}
// interface ITransactionProps {
//     escrow_factory: SmartContractTransactionsFactory | any
//     escrow_controller: SmartContractQueriesController | any
// }

// export const PaymentsTable: React.FC<ITransactionProps> = ({escrow_factory, escrow_controller}) => {
export const PaymentsTable = () => {
    
    const [createdOffers, setCreatedOffers] = useState([]);
    const [showTable, setShowTable] = useState(false)
    const { success } = useGetActiveTransactionsStatus();

    const updateOffersTable = async () => {

        //abi
        const response = await fetch("escrow.abi.json");
        const abiJson = await response.text();
        let abiObj = JSON.parse(abiJson);
        let abi = AbiRegistry.create(abiObj);

        // queryRunner & networkProvider
        const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

        const queryRunner = new QueryRunnerAdapter({
            networkProvider: apiNetworkProvider
        });
        
        let controller = new SmartContractQueriesController({
            queryRunner: queryRunner
        });

        controller = new SmartContractQueriesController({
            queryRunner: queryRunner,
            abi: abi
        });

        // query
        const query = controller.createQuery({
            contract: ContractAddressEnum.escrowContract,
            function: "getCreatedOffers",
            arguments: [WalletAddressEnum.myWallet],
        });

        const queryResponse = await controller.runQuery(query);
        const [offers] = controller.parseQueryResponse(queryResponse);

        // parse response
        const parsedOffers = offers.map((offer: any) => ({
            id: offer[0],
            token_identifier: offer[1].offered_payment.token_identifier,
            amount: nominateValue(offer[1].offered_payment.amount.toString()),
            acceptedAddress: offer[1].accepted_address
        }))

        setCreatedOffers(parsedOffers)
        setShowTable(true)
    }

    const cancelOffer = async (id: string) => {

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

        // cancelOffer transaction
        let args = [parseInt(id)]
        const transaction = factory.createTransactionForExecute({
            sender: Address.fromBech32(WalletAddressEnum.myWallet),
            contract: Address.fromBech32(ContractAddressEnum.escrowContract),
            function: "cancelOffer",
            gasLimit: 30000000n,
            arguments: args,
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

    //refresh table
    useEffect(() => {
        if (success) {
          updateOffersTable()
        }
      }, [success]);

    
    return (
        <div className="flex flex-col p-6 rounded-xl m-1 bg-white justify-center">
            <h2 className="flex font-medium group text-sm">Offers</h2>
            <button className="bg-mvx-blue hover:shadow-lg  text-black  py-2 px-2 my-2 rounded-lg text-base" onClick={updateOffersTable}
            >Show Offers
            </button>
            {showTable &&
            <table className="min-w-full divide-y divide-gray-200 my-4">
                <thead className="bg-mvx-blue rounded-t-lg">
                <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-black uppercase">Token Identifier</th>
                    <th className="px-6 py-3 text-xs font-semibold text-black uppercase">Amount</th>
                    <th className="px-6 py-3 text-xs font-semibold text-black uppercase">Accepted Address</th>
                    <th className="px-6 py-3 text-xs font-semibold text-black uppercase">Cancel Offer</th>
                </tr>
                </thead>
                <tbody className="bg-gray-100 divide-y divide-gray-300">
                    {createdOffers.map((offer: IOffer) => (
                <tr 
                key={offer.id}
                >
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-black font-medium">{offer.token_identifier.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-black font-medium">{offer.amount.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-black font-medium">{offer.acceptedAddress.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-black font-medium">
                        <button onClick={() => cancelOffer(offer.id)} 
                                className="bg-black text-white hover:scale-105 rounded-lg px-4 py-1"
                        >
                        Cancel      
                        </button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
                }
        </div>
    )


 

  
}