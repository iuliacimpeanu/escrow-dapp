import axios from "axios";
import { useEffect, useState } from "react";
import { formatAmount } from "@multiversx/sdk-dapp/utils";

export const AvailableAmountSection = ({wallet_address}: {wallet_address: string}) => {
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState<string | undefined>('');
    const [tokenOptions, setTokenOptions] = useState<{ identifier: string, balance: string }[]>([]);

    // get token options from wallet
    useEffect(() => {
      const fetchTokens = async () => {
        try {
          const tx = await axios.get(`https://devnet-api.multiversx.com/accounts/${wallet_address}/tokens`);
          const options = tx.data.map((option: { identifier: string, balance: string }) => ({
            identifier: option.identifier,
            balance: option.balance
          }));
          setTokenOptions(options);
        } catch (error) {
          console.error('Error fetching token options:', error);
        }
      };
  
      fetchTokens();
    }, [wallet_address]);

    // update selected token and its available amount
    const handleTokenSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const tokenIdentifier = event.target.value;
      setToken(tokenIdentifier)
      const selectedToken = tokenOptions.find((option) => option.identifier === tokenIdentifier)
      if(selectedToken != null){
        const availableAmount = formatAmount({input: selectedToken.balance});
        setAmount(availableAmount)
      }
    }

    return (
    <div className="flex flex-col p-6 rounded-xl m-1 bg-white justify-center">
      <h2 className="flex font-medium group text-sm">Available Amount</h2>
      <div className="flex items-center gap-5 my-4">
        <select 
        id="select-token" 
        value={token} 
        onChange={handleTokenSelection}
        className="w-1/2 p-2 border rounded-md text-base font-medium"
        >
          <option value="" disabled>
            Select token
          </option>
          {tokenOptions.map((tokenOption, index) => (
            <option key={index} value={tokenOption.identifier}>
              {tokenOption.identifier}
            </option>
          ))}
        </select>
        <input type="text" placeholder="available amount" className="w-1/2 border border-gray-300 rounded-lg text-base px-4 py-2 font-medium" value={amount} readOnly/>
      </div>
    </div>
    )
}