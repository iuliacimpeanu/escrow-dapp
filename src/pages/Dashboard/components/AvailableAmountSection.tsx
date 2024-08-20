import axios from "axios";
import { useState } from "react";


export const AvailableAmountSection = () => {
    const [amount, setAmount] = useState<string>('0');
    const nominateValue = (input: string) : bigint => {
        return BigInt(input) / BigInt(10**18)
    }
    
    const getAmount = async () => {
        const tx = await axios.get('https://devnet-api.multiversx.com/accounts/erd1mcu0nwa7tufcgtz26p6wavrslsvnpalggkkw8yxg9l3nqapedk2sfq0dxc/tokens');
        const data = tx.data;
        let availableAmount: bigint = BigInt(0);

        for(const obj of data) {
            if(obj.identifier.substring(0,5) === 'WEGLD'){
                availableAmount = nominateValue(obj.balance);
                setAmount(availableAmount.toString());
                console.log(availableAmount.toString());
                break;
            }
        }

        return availableAmount.toString()
    
    }

    return (
    <div className="w-1/2 flex flex-col p-6 rounded-xl bg-white justify-center">
      <h2 className="flex font-medium group text-sm">Available Amount</h2>
      <div className="flex items-center gap-5">
        <button
            onClick={getAmount}
            className="bg-mvx-blue hover:scale-105  text-black font-medium py-1 px-2 my-2 rounded-lg text-base"
        >
            WEGLD
        </button>
        <span>{amount}</span>
      </div>
    </div>
    )
}