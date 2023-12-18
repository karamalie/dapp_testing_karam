import Home from "./pages/Home";
import { useTriaConnector, useAccount } from "@tria-sdk/connect";
import { TriaConnectProvider } from "@tria-sdk/authenticate-staging";
import Application from "@tria-sdk/authenticate-staging";
import { useEffect } from "react";
import Wallet from "./pages/Wallet";

function App() {
  const { globalData } = useTriaConnector({
    authUrl: "https://auth-tria.vercel.app",
    walletUrl: "https://reliable-semifreddo-e8e93e.netlify.app",
  });
  const { account } = useAccount();

  console.log(account);

  return (
    <div className="bg-black h-[100vh] w-[100vw]">
      <TriaConnectProvider />
      {account ? <Home /> : null}

      <Application
        dappName={"Tria Demo"}
        logo={"https://svgshare.com/i/10zF.svg"}
        dappDomain={window.parent.origin}
        primaryColor="#9A86FF"
        // defaultChain="FUSE"
        // supportedChains={["FUSE", "POLYGON"]}
      />

      {/* <Wallet /> */}
    </div>
  );
}

export default App;
