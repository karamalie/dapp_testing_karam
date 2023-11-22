import Home from "./pages/Home";
import { useTriaConnector } from "@tria-sdk/connect";
import {TriaConnectProvider} from '@tria-sdk/authenticate'
import { useEffect } from "react";
import Wallet from "./pages/Wallet";

function App() {
 const { globalData } = useTriaConnector({ authUrl: "https://auth-tria.vercel.app", walletUrl:"https://reliable-semifreddo-e8e93e.netlify.app" });
  return (
    <div className="bg-black h-[100vh] w-[100vw]">
      <TriaConnectProvider/>
      <Home/>
      {/* <Wallet/> */}
    </div>
  );
}

export default App;
