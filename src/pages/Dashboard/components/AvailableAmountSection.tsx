import axios from "axios";
import { useEffect, useState } from "react";
import { formatAmount } from "@multiversx/sdk-dapp/utils";

export const AvailableAmountSection = ({wallet_address}: {wallet_address: string}) => {
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState<string | undefined>('');
    const [tokenOptions, setTokenOptions] = useState<string[]>([]);

    // get token options from wallet
    useEffect(() => {
      const fetchTokens = async () => {
        try {
          const tx = await axios.get('https://devnet-api.multiversx.com/accounts/' + wallet_address+ '/tokens');
          // console.log(tx.data)
          const options = tx.data.map((option: { identifier: string }) => option.identifier);
          setTokenOptions(options);
        } catch (error) {
          console.error('Error fetching token options:', error);
        }
      };
  
      fetchTokens();
    }, []);

    //check amount of the selected token
    const getAmount = async () => {

      const tx = await axios.get('https://devnet-api.multiversx.com/accounts/' + wallet_address+ '/tokens');
      for(const obj of tx.data){
        if(obj.identifier === token){
          let availableAmount = formatAmount({input: obj.balance});
          setAmount(availableAmount);
        }
      }
    }

    return (
    <div className="flex flex-col p-6 rounded-xl m-1 bg-white justify-center">
      <h2 className="flex font-medium group text-sm">Available Amount</h2>
      <div className="flex items-center gap-5">
        <select 
        id="select-token" 
        value={token} 
        onChange={(e) => {setToken(e.target.value)}}
        className="p-2 border rounded-md text-sm font-medium"
        >
          <option value="" disabled>
            Select token
          </option>
          {tokenOptions.map((tokenOption, index) => (
            <option key={index} value={tokenOption}>
              {tokenOption}
            </option>
          ))}
        </select>
        <button
        onClick={getAmount}
        className="bg-mvx-blue hover:shadow-lg  text-black  py-2 px-2 my-2 rounded-lg text-base"
        >
        Check available amount
        </button>
        <input type="text" placeholder="amount" className="border border-gray-300 rounded-lg text-xl px-4" value={amount} readOnly/>
      </div>
    </div>
    )
}