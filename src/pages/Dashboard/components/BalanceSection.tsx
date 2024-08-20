import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { FormatAmount } from "@multiversx/sdk-dapp/UI";
// import { getAccountBalance } from "../../../utils/getAccountBalance";

export const Balance = () => {
    const { balance } = useGetAccount();
    // const { balance } = getAccountBalance('erd1mcu0nwa7tufcgtz26p6wavrslsvnpalggkkw8yxg9l3nqapedk2sfq0dxc');
  
    return (
      <div className="w-1/2 flex flex-col p-6 rounded-xl m-2 bg-white justify-center">
        <h2 className="flex font-medium group text-sm">Balance</h2>
        <FormatAmount
          value={balance}
          showLabel={true}
          egldLabel={"xEGLD"}
          className="text-sm flex justify-start"
        />
      </div>
    );
  };