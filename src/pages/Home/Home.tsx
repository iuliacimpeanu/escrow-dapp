import { AuthRedirectWrapper } from "../../wrappers/AuthRedirectWrapper"

export const HomePage = () => {
    return (
        <AuthRedirectWrapper requireAuth={false}>
            <div className="h-screen bg-neutral-100 text-3xl font-bold text-center flex justify-center items-center">
            Please connect your wallet
            </div>
        </AuthRedirectWrapper>
    )
}