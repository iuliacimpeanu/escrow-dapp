import { AuthRedirectWrapper } from "../../wrappers/AuthRedirectWrapper"
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    
    return (
        <AuthRedirectWrapper>
        <div className="h-screen bg-black text-mvx-blue text-3xl font-semibold text-center flex justify-center items-center">
            <div className="w-1/4 flex flex-col gap-7">
                <p className="text-mvx-lighter-gray font-medium text-2xl">Choose a smart contract</p>
                <div className="w-full flex items-center gap-7">
                    <Link to="/dashboard-escrow" className="inline-block w-1/2">
                        <button className="w-full bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 rounded-lg text-base font-medium">Escrow</button>
                    </Link>
                    <Link to="/dashboard-liquid-locking" className="inline-block w-1/2">
                        <button className="w-full bg-mvx-blue hover:scale-110  text-mvx-button-text  py-3 px-6 rounded-lg text-base font-medium">Liquid Locking</button>
                    </Link>
                </div>
            </div>
        </div>
        </AuthRedirectWrapper>
    )
}