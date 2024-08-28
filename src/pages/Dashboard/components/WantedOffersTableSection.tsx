import { formatAmount, parseAmount } from "@multiversx/sdk-dapp/utils/operations";
import { ContractAddressEnum } from "../../../utils/enums";
import { useEffect, useRef, useState } from "react";
import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks";
import { AbiRegistry, Address, SmartContractQueriesController, SmartContractTransactionsFactory, Token, TokenTransfer } from "@multiversx/sdk-core/out";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

interface IWantedOffer{
    id: string,
    offeredToken: string,
    offeredAmount: string,
    acceptedToken: string,
    acceptedAmount: string,
    acceptedAddress: string
}

export const WantedOffersTableSection = ({ wallet_address, escrow_abi, escrow_factory, escrow_controller, checkAvailableAmount }: {  wallet_address: string, escrow_abi: AbiRegistry, escrow_factory: SmartContractTransactionsFactory, escrow_controller: SmartContractQueriesController, checkAvailableAmount: (token: string) => string}) => {
    
    const [wantedOffers, setWantedOffers] = useState([]);
    const { success } = useGetActiveTransactionsStatus();
    const hasRunWantedRef = useRef(false); //to run only at first render

    useEffect(() => {
        const initializeWantedTable = async () => {
            if (escrow_abi && !hasRunWantedRef.current) {
                await updateWantedOffersTable();
                hasRunWantedRef.current = true;
            }
        };

        initializeWantedTable();
    }, [escrow_abi]); 

    //update wanted offers
    const updateWantedOffersTable = async () => {

        // query
        const query = escrow_controller.createQuery({
            contract: ContractAddressEnum.escrowContract,
            function: "getWantedOffers",
            arguments: [wallet_address],
        });

        const queryResponse = await escrow_controller.runQuery(query);
        const [offers] = escrow_controller.parseQueryResponse(queryResponse);

        // parse response
        const parsedOffers = offers.map((offer: any) => ({
            id: offer[0],
            offeredToken: offer[1].offered_payment.token_identifier,
            offeredAmount: formatAmount({input: offer[1].offered_payment.amount.toString()}),
            acceptedToken: offer[1].accepted_payment.token_identifier,
            acceptedAmount: formatAmount({input: offer[1].accepted_payment.amount.toString()}),
            acceptedAddress: offer[1].accepted_address
        }))

        setWantedOffers(parsedOffers)
    }

    // accept offer transaction
    const acceptOffer = async (offer_id: string, accepted_token: string, accepted_amount: string) => {

        const availableAmount: string = checkAvailableAmount(accepted_token)
        if(Number(accepted_amount) > Number(availableAmount)){
            alert('Insufficient funds! You can\'t accept the offer!\nTransaction is cancelled!')
            return;
        }
        
        let _accepted_amount: bigint = BigInt(parseAmount(accepted_amount));

        let args = [parseInt(offer_id)]
        const tx = escrow_factory.createTransactionForExecute({
            sender: Address.fromBech32(wallet_address),
            contract: Address.fromBech32(ContractAddressEnum.escrowContract),
            function: "acceptOffer",
            gasLimit: 30000000n,
            arguments: args,
            tokenTransfers: [
                            new TokenTransfer({
                                token: new Token({ identifier: accepted_token }),
                                amount: _accepted_amount
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

    //refresh table
    useEffect(() => {
        if (success) {
          updateWantedOffersTable()
        }
      }, [success]);
      
    return (
       <div className="flex flex-col p-6 px-10 rounded-xl m-2 bg-mvx-bg-gray justify-center">
            <h2 className="flex font-medium group text-sm text-gray-300">Wanted Offers</h2>
            <div className="my-5">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-500">
                    <thead className="bg-mvx-button-bg-gray rounded-t-lg">
                    <tr>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-300">Token Identifier</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-300">Amount</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-300">Accepted Address</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-300">Accept Offer</th>
                    </tr>
                    </thead>
                    <tbody className="bg-mvx-bg-gray divide-y divide-gray-500">
                        {wantedOffers.map((offer: IWantedOffer) => (
                    <tr 
                    key={offer.id}
                    className="divide-x divide-gray-500"
                    >
                        <td className="px-6 py-4 text-sm text-mvx-blue font-normal">{offer.offeredToken.toString()}</td>
                        <td className="px-6 py-4 text-sm text-mvx-blue font-normal">{offer.offeredAmount.toString()}</td>
                        <td className="px-6 py-4 text-sm text-mvx-blue font-normal">{offer.acceptedAddress.toString()}</td>
                        <td className="px-6 py-4 text-sm text-mvx-blue font-normal">
                            <button 
                            onClick={() => acceptOffer(offer.id, offer.acceptedToken, offer.acceptedAmount)} 
                            className="bg-mvx-blue text-mvx-button-text hover:scale-105 rounded-lg px-4 py-1"
                            >
                            Accept      
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