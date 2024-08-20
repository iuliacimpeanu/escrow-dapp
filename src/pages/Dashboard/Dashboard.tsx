import { AuthRedirectWrapper } from "../../wrappers/AuthRedirectWrapper"
import { AvailableAmountSection } from "./components/AvailableAmountSection"
import { TransactionSection } from "./components/TransactionSection"

export const Dashboard = () => {
    return (
        <AuthRedirectWrapper>
        <div className="h-screen bg-neutral-100 text-3xl font-bold text-center flex flex-col items-center py-4">
            <h2 className="mb-4">Dashboard</h2>
                <AvailableAmountSection />
                <TransactionSection />
        </div>
        </AuthRedirectWrapper>
    )
}