import Home from "./pages/Home";
import { useTriaConnector, useAccount } from "@tria-sdk/connect";
import { TriaConnectProvider } from "@tria-sdk/authenticate-staging";
import Application from "@tria-sdk/authenticate-staging";

import { useEffect,useState } from "react";
import Wallet from "./pages/Wallet";

function App() {
  const { globalData } = useTriaConnector({
    authUrl: "https://auth-tria.vercel.app",
    walletUrl: "https://reliable-semifreddo-e8e93e.netlify.app",
  });
  const { account } = useAccount();

  console.log(account);
const [darkMode,setDarkMode]=useState(true);
  return (
    <div className="bg-black h-[100vh] w-[100vw]">
      <TriaConnectProvider />
      {account ? <Home /> : null}

      <Application
        dappName={"Empire"}
        logo={"https://www.empireofsight.com/assets/images/logo-icon.svg"}
        dappDomain={window.parent.origin}
        primaryColor="#70CA00"
        darkMode={darkMode}
        triaStaging={true}
      />

      {/* <Wallet /> */}
    </div>
  );
}

export default App;
