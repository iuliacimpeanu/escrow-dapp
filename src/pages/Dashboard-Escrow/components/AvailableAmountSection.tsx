import { useState } from "react";

export const AvailableAmountSection = ({wallet_address, tokenOptions, checkAvailableAmount}: {wallet_address: string, tokenOptions: { identifier: string, balance: string }[], checkAvailableAmount: (token: string) => string}) => {
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState<string | undefined>('');

    // update selected token and its available amount
    const handleTokenSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setToken(event.target.value)
      setAmount(checkAvailableAmount(event.target.value))
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