import axios from "axios";
import { useState } from "react";
import { nominateValue } from "../../../utils/nominateValue";


export const AvailableAmountSection = () => {
    const [amount, setAmount] = useState('');
    
    const getAmount = async () => {
        const tx = await axios.get('https://devnet-api.multiversx.com/accounts/erd1mcu0nwa7tufcgtz26p6wavrslsvnpalggkkw8yxg9l3nqapedk2sfq0dxc/tokens');
        const data = tx.data;
        let availableAmount: number = 0;

        for(const obj of data) {
            if(obj.identifier.substring(0, 5) === 'WEGLD'){
                availableAmount = nominateValue(obj.balance);
                setAmount(availableAmount.toString());
                break;
            }
        }
    
    }

    return (
    <div className="w-1/2 flex flex-col p-6 rounded-xl m-1 bg-white justify-center">
      <h2 className="flex font-medium group text-sm">Available Amount</h2>
      <div className="flex items-center gap-5">
        <button
        onClick={getAmount}
        className="w-1/2 bg-mvx-blue hover:shadow-lg  text-black  py-2 px-2 my-2 rounded-lg text-base"
        >
        Check WEGLD
        </button>
        <input type="text" placeholder="available wegld" className="w-1/2 border border-gray-300 rounded-lg text-xl px-4" value={amount} readOnly/>
      </div>
    </div>
    )
}