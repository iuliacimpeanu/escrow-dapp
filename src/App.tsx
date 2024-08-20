import './App.css'
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { DappProvider } from "@multiversx/sdk-dapp/wrappers";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { UnlockPage } from './pages/Unlock';
import { Dashboard } from './pages/Dashboard';
import { Nav } from './components/Nav';
import { NotificationModal, SignTransactionsModals, TransactionsToastList } from '@multiversx/sdk-dapp/UI';



function App() {


  return (
    <DappProvider
    environment={EnvironmentsEnum.devnet}
    customNetworkConfig={{
      name: 'customConfig',
      walletConnectV2ProjectId: '9b1a9564f91cb659ffe21b73d5c4e2d8',
    }}
    dappConfig={{
      logoutRoute: "/unlock"
    }}
    >
      <Router>
        <Nav />
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals />
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/unlock" element={<UnlockPage />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
          </Routes>

      </Router>
    </DappProvider>
  )
}

export default App
