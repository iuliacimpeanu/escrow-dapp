import { EnvironmentsEnum } from "@multiversx/sdk-dapp/types";
import { Link } from "react-router-dom";
import { useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks";
import { logout } from "@multiversx/sdk-dapp/utils";

const callbackUrl = `${window.location.origin}/unlock`;

export const Nav = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    sessionStorage.clear();
    logout(callbackUrl, undefined, false);
  };

  return (
    <header className="bg-mvx-nav-gray flex flex-row align-center justify-between pl-6 pr-6 pt-6">
      {/* <nav className="h-full w-full text-sm sm:relative left-auto right-0 sm:top-auto sm:flex sm:w-auto sm:flex-row sm:justify-end sm:bg-transparent"> */}
      <nav className="h-full w-full text-sm flex justify-between items-center sm:bg-transparent">
      <div className="flex justify-start container mx-auto items-center gap-6 text-base font-medium ">
        <Link to="/dashboard" className="text-gray-400 hover:text-mvx-blue">Escrow</Link>
        <Link to="/dashboard-liquid-locking" className="text-gray-400 hover:text-mvx-blue">Liquid Locking</Link>
      </div>


        <div className="flex justify-end container mx-auto items-center gap-2">
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <Link to="/">
              <p className="text-gray-400">{EnvironmentsEnum.devnet}</p>
            </Link>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-gray-400 hover:text-white mx-0"
            >
              Close
            </button>
          ) : (
            <Link to="/unlock" className="text-gray-400 hover:text-white">Connect</Link>
          )}
        </div>
      </nav>
    </header>

//     <header className="bg-mvx-nav-gray flex flex-row align-center justify-between pl-6 pr-6 pt-6">
//   <nav className="h-full w-full text-sm flex justify-between items-center sm:bg-transparent">
    
//     <div className="flex items-center gap-2">
//       <div className="text-white">Home</div>
//     </div>

//     <div className="flex items-center gap-2">
//       <div className="flex gap-1 items-center">
//         <div className="w-2 h-2 rounded-full bg-green-500" />
//         <Link to="/">
//           <p className="text-gray-400">{EnvironmentsEnum.devnet}</p>
//         </Link>
//       </div>

//       {isLoggedIn ? (
//         <button
//           onClick={handleLogout}
//           className="inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-gray-400 hover:text-white mx-0"
//         >
//           Close
//         </button>
//       ) : (
//         <Link to="/unlock" className="text-gray-400 hover:text-white">Connect</Link>
//       )}
//     </div>
//   </nav>
// </header>
  );
};
