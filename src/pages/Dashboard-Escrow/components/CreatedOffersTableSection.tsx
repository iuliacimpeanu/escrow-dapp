import { useEffect, useRef, useState } from "react";
import { AbiRegistry, Address, SmartContractQueriesController, SmartContractTransactionsFactory } from "@multiversx/sdk-core";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { useGetActiveTransactionsStatus} from "@multiversx/sdk-dapp/hooks";
import { formatAmount } from "@multiversx/sdk-dapp/utils/operations";
import { ContractAddressEnum } from "../../../utils/enums";

interface ICreatedOffer{
    id: string,
    offeredToken: string,
    offeredAmount: string,
    acceptedAddress: string
}

export const CreatedOffersTableSection = ({wallet_address, escrow_abi, escrow_factory, escrow_controller}: {wallet_address: string, escrow_abi: AbiRegistry, escrow_factory: SmartContractTransactionsFactory, escrow_controller: SmartContractQueriesController}) => {

    const [createdOffers, setCreatedOffers] = useState([]);
    const { success } = useGetActiveTransactionsStatus();
    const hasRunRef = useRef(false); //to run only at first render

    useEffect(() => {
        const initializeTable = async () => {
            if (escrow_abi && !hasRunRef.current) {
                await updateOffersTable();
                hasRunRef.current = true;
            }
        };

        initializeTable();
    }, [escrow_abi]); 

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

    // refresh table
    useEffect(() => {
        if (success) {
          updateOffersTable()
        }
      }, [success]);
    
    return (
        <div className="flex flex-col p-6 px-10 rounded-xl m-2 bg-mvx-bg-gray justify-center">
            <h2 className="flex font-medium group text-sm text-gray-300">Created Offers</h2>
            <div className="my-5">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-500 rounded-lg">
                <thead className="bg-mvx-button-bg-gray rounded-t-lg">
                <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Token Identifier</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Accepted Address</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Cancel Offer</th>
                </tr>
                </thead>
                <tbody className="bg-mvx-bg-gray divide-y divide-gray-500">
                    {createdOffers.map((offer: ICreatedOffer) => (
                <tr 
                key={offer.id}
                className="divide-x divide-gray-500"
                >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mvx-blue font-normal">{offer.offeredToken.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mvx-blue font-normal">{offer.offeredAmount.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mvx-blue font-normal">{offer.acceptedAddress.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mvx-blue font-normal">
                        <button onClick={() => cancelOffer(offer.id)} 
                                className="bg-mvx-blue text-mvx-button-text hover:scale-105 rounded-lg px-4 py-1"
                        >
                        Cancel      
                        </button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}