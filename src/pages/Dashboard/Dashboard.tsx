// import { useState } from "react"
import { AuthRedirectWrapper } from "../../wrappers/AuthRedirectWrapper"
import { AvailableAmountSection } from "./components/AvailableAmountSection"
import { PaymentsTable } from "./components/PaymentsTable"
import { TransactionSection } from "./components/TransactionSection"
// import { AbiRegistry, QueryRunnerAdapter, SmartContractQueriesController, SmartContractTransactionsFactory, TransactionsFactoryConfig } from "@multiversx/sdk-core/out"
// import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out"

export const Dashboard = () => {
    // const [abi, setAbi] = useState<AbiRegistry>();
    // const [factory, setFactory] = useState<SmartContractTransactionsFactory>()
    // const [controller, setController] = useState<SmartContractQueriesController>();

    // const generateTransactionProps = async () => {

    //     //abi
    //     const response = await fetch("escrow.abi.json");
    //     const abiJson = await response.text();
    //     let abiObj = JSON.parse(abiJson);
    //     let _abi = AbiRegistry.create(abiObj);
    //     setAbi(_abi);
    
    //     //factory
    //     const factoryConfig = new TransactionsFactoryConfig({ chainID: "D" });
    //     let _factory = new SmartContractTransactionsFactory({
    //         config: factoryConfig,
    //         abi: abi
    //     });
    //     setFactory(_factory)

    //     // queryRunner & networkProvider
    //     const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

    //     const queryRunner = new QueryRunnerAdapter({
    //         networkProvider: apiNetworkProvider
    //     });
        
    //     let _controller = new SmartContractQueriesController({
    //         queryRunner: queryRunner
    //     });

    //     _controller = new SmartContractQueriesController({
    //         queryRunner: queryRunner,
    //         abi: abi
    //     });
    //     setController(_controller)
    // }

    return (
        <AuthRedirectWrapper>
        <div className="h-screen bg-neutral-100 text-3xl font-bold text-center flex flex-col items-center py-4">
            <h2 className="mb-4">Dashboard</h2>
            <div>
                <div className="flex">
                    <AvailableAmountSection />
                    {/* <TransactionSection escrow_factory={factory}/> */}
                    <TransactionSection />
                </div>
                {/* <PaymentsTable escrow_factory={factory} escrow_controller={controller}/> */}
                <PaymentsTable />
            </div>
        </div>
        </AuthRedirectWrapper>
    )
}