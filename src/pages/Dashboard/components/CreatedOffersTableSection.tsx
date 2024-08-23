import { useEffect, useState } from "react";
import { Address, SmartContractQueriesController, SmartContractTransactionsFactory } from "@multiversx/sdk-core";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks";
import { formatAmount } from "@multiversx/sdk-dapp/utils/operations";
import { ContractAddressEnum } from "../../../utils/enums";

interface ICreatedOffer{
    id: string,
    offeredToken: string,
    offeredAmount: string,
    acceptedAddress: string
}

export const CreatedOffersTableSection = ({wallet_address, escrow_factory, escrow_controller}: {wallet_address: string, escrow_factory: SmartContractTransactionsFactory, escrow_controller: SmartContractQueriesController}) => {
    
    const [createdOffers, setCreatedOffers] = useState([]);
    const [showTable, setShowTable] = useState(false)
    const { success } = useGetActiveTransactionsStatus();
    const [toggle, setToggle] = useState(true);

    const handleToggle = () => {
        setToggle(!toggle)
        setShowTable(!showTable)
        if(toggle){
            updateOffersTable();
        } 
    }
    
    // useEffect(() => {
    //     if(toggle){
    //         setShowTable(false);
    //     } else {
    //         setShowTable(true);
    //         updateOffersTable();
    //     }
    //   }, []);

    // update offers
    const updateOffersTable = async () => {

        // query
        const query = escrow_controller.createQuery({
            contract: ContractAddressEnum.escrowContract,
            function: "getCreatedOffers",
            arguments: [wallet_address],
        });

        const queryResponse = await escrow_controller.runQuery(query);
        const [offers] = escrow_controller.parseQueryResponse(queryResponse);

        // parse response
        const parsedOffers = offers.map((offer: any) => ({
            id: offer[0],
            offeredToken: offer[1].offered_payment.token_identifier,
            offeredAmount: formatAmount({input: offer[1].offered_payment.amount.toString()}),
            acceptedAddress: offer[1].accepted_address
        }))

        setCreatedOffers(parsedOffers)
        setShowTable(true)
    }

    // cancelOffer transaction
    const cancelOffer = async (id: string) => {

        let args = [parseInt(id)]
        const tx = escrow_factory.createTransactionForExecute({
            sender: Address.fromBech32(wallet_address),
            contract: Address.fromBech32(ContractAddressEnum.escrowContract),
            function: "cancelOffer",
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

    //refresh table
    useEffect(() => {
        if (success) {
          updateOffersTable()
        }
      }, [success]);
    
    return (
        <div className="flex flex-col p-6 rounded-xl m-2 bg-white justify-center">
            <h2 className="flex font-medium group text-sm">Created Offers</h2>
            {showTable &&
            <table className="min-w-full divide-y divide-gray-200 my-4">
                <thead className="bg-mvx-blue rounded-t-lg">
                <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-black uppercase">Token Identifier</th>
                    <th className="px-6 py-3 text-sm font-semibold text-black uppercase">Amount</th>
                    <th className="px-6 py-3 text-sm font-semibold text-black uppercase">Accepted Address</th>
                    <th className="px-6 py-3 text-sm font-semibold text-black uppercase">Cancel Offer</th>
                </tr>
                </thead>
                <tbody className="bg-gray-100 divide-y divide-gray-300">
                    {createdOffers.map((offer: ICreatedOffer) => (
                <tr 
                key={offer.id}
                >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">{offer.offeredToken.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">{offer.offeredAmount.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">{offer.acceptedAddress.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">
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
            <button 
            className={`text-black py-2 px-2 my-2 rounded-lg text-base hover:shadow-lg ${toggle ? 'bg-mvx-blue' : 'bg-gray-200'} `}
            onClick={handleToggle}
            >Show Created Offers
            </button>
        </div>
    )
}