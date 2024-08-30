import { AuthRedirectWrapper } from "../../wrappers/AuthRedirectWrapper"

export const HomePage = () => {
    return (
        <AuthRedirectWrapper requireAuth={false}>
            <div className="h-screen bg-black text-mvx-blue text-3xl font-semibold text-center flex justify-center items-center">
            Please connect your wallet
            </div>
        </AuthRedirectWrapper>
    )
}