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
    <div className="flex flex-col p-6 px-10 rounded-xl m-1 bg-mvx-bg-gray justify-center">
      <h2 className="flex font-medium group text-sm text-gray-300">Available Amount</h2>
      <div className="flex flex-col gap-3 my-5">
        <div className="flex justify-start items-center gap-3 w-full">
          <label htmlFor="address" className="text-xs text-mvx-lighter-gray font-medium">Address</label>
          <span id="address" className="text-sm font-medium text-mvx-blue">{wallet_address}</span>
        </div>
        <div className="flex items-center gap-5">
          <select 
          id="select-token" 
          value={token} 
          onChange={handleTokenSelection}
          className="w-1/2 px-6 py-3 rounded-md text-sm font-medium bg-mvx-button-bg-gray text-mvx-text-gray"
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
          <input type="text" placeholder="Available amount" className="w-1/2 rounded-lg text-sm px-6 py-3 font-medium bg-mvx-button-bg-gray placeholder-mvx-text-gray text-gray-300" value={amount} readOnly/>
        </div>
      </div>
    </div>
    )
}