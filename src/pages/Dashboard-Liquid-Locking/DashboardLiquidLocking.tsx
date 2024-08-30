import axios from "axios";
import { AbiRegistry, QueryRunnerAdapter, SmartContractQueriesController, SmartContractTransactionsFactory, TransactionsFactoryConfig } from "@multiversx/sdk-core/out";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { useEffect, useState } from "react";
import { AuthRedirectWrapper } from "../../wrappers/AuthRedirectWrapper";
import { WhitelistTokensSection } from "./components/WhitelistTokensSection";
import { LockTokensSection } from "./components/LockTokensSection";
import { formatAmount } from "@multiversx/sdk-dapp/utils";
import { UnbondTokensSection } from "./components/UnbondTokensSection";
import { UnlockTokensSection } from "./components/UnlockTokensSection";

export const DashboardLiquidLocking = () => {

    const { address } = useGetAccount();
    const [abi, setAbi] = useState<AbiRegistry>();
    const [factory, setFactory] = useState<SmartContractTransactionsFactory>()
    const [controller, setController] = useState<SmartContractQueriesController>();
    const [tokenOptions, setTokenOptions] = useState<{ identifier: string, balance: string }[]>([]);

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
      const response = await fetch("liquid-locking.abi.json");
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
            <h4 className="mb-4 text-gray-300 text-xl">Dashboard</h4>
            <h1 className="mb-4 text-gray-300">Liquid Locking SC</h1>
            <div className="w-1/2">
              { abi && factory && controller && <WhitelistTokensSection wallet_address={address} abi={abi} factory={factory} controller={controller} tokenOptions={tokenOptions}/>}
              { abi && factory && controller && <LockTokensSection wallet_address={address} factory={factory} tokenOptions={tokenOptions} checkAvailableAmount={checkAvailableAmount}/>}
              { abi && factory && controller && <UnlockTokensSection wallet_address={address} abi={abi} factory={factory} controller={controller}/>}
              { abi && factory && controller && <UnbondTokensSection wallet_address={address} abi={abi} factory={factory} controller={controller}/>}
            </div>
          </div>
      </AuthRedirectWrapper>
    )
}