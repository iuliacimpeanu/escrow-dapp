import axios from "axios";
import { useEffect, useState } from "react"
import { AuthRedirectWrapper } from "../../wrappers/AuthRedirectWrapper"
import { AvailableAmountSection } from "./components/AvailableAmountSection"
import { CreatedOffersTableSection } from "./components/CreatedOffersTableSection"
import { CreateOfferSection } from "./components/CreateOfferSection"
import { AbiRegistry, QueryRunnerAdapter, SmartContractQueriesController, SmartContractTransactionsFactory, TransactionsFactoryConfig } from "@multiversx/sdk-core/out"
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out"
import { useGetAccount } from "@multiversx/sdk-dapp/hooks"
import { WantedOffersTableSection } from "./components/WantedOffersTableSection"
import { formatAmount } from "@multiversx/sdk-dapp/utils";


export const Dashboard = () => {
    
    const { address } = useGetAccount();
    const [abi, setAbi] = useState<AbiRegistry>();
    const [factory, setFactory] = useState<SmartContractTransactionsFactory>()
    const [controller, setController] = useState<SmartContractQueriesController>();
    const [tokenOptions, setTokenOptions] = useState<{ identifier: string, balance: string }[]>([]);
  
    // get token options from wallet
    useEffect(() => {
      const fetchTokens = async () => {
        try {
          const tx = await axios.get(`https://devnet-api.multiversx.com/accounts/${address}/tokens`);
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
    }, [address]);

    const checkAvailableAmount = (token: string) => {
        const selectedToken = tokenOptions.find((option) => option.identifier === token)
        let availableAmount: string = '0'
        if(selectedToken != null){
          availableAmount = formatAmount({input: selectedToken.balance});
        }
        return availableAmount;
    }

    const generateTransactionProps = async () => {

        //abi
        const response = await fetch("escrow.abi.json");
        const abiJson = await response.text();
        let abiObj = JSON.parse(abiJson);
        let _abi = AbiRegistry.create(abiObj);
        setAbi(_abi);
    
        //factory
        const factoryConfig = new TransactionsFactoryConfig({ chainID: "D" });
        let _factory = new SmartContractTransactionsFactory({
            config: factoryConfig,
            abi: abi
        });
        setFactory(_factory)

        // queryRunner & networkProvider
        const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

        const queryRunner = new QueryRunnerAdapter({
            networkProvider: apiNetworkProvider
        });
        
        let _controller = new SmartContractQueriesController({
            queryRunner: queryRunner
        });

        _controller = new SmartContractQueriesController({
            queryRunner: queryRunner,
            abi: abi
        });
        setController(_controller)
    }

    useEffect(() => {  
        generateTransactionProps();
    })  

    return (
        <AuthRedirectWrapper>
        <div className="bg-black text-3xl font-bold text-center flex flex-col items-center py-4">
            <h2 className="mb-4 text-gray-300">Dashboard</h2>
            <div className="w-2/3">
                <AvailableAmountSection wallet_address={address} tokenOptions={tokenOptions} checkAvailableAmount={checkAvailableAmount}/>
                { abi && factory && <CreateOfferSection wallet_address={address} tokenOptions={tokenOptions} checkAvailableAmount={checkAvailableAmount} escrow_factory={factory} />}
                { abi && factory && controller && <CreatedOffersTableSection wallet_address={address}escrow_abi={abi} escrow_factory={factory} escrow_controller={controller}/>}
                {abi && factory && controller && <WantedOffersTableSection wallet_address={address} escrow_abi={abi} escrow_factory={factory} escrow_controller={controller}/>}
            </div>
        </div>
        </AuthRedirectWrapper>
    )
}