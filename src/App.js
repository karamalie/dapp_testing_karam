import Home from "./pages/Home";
import { useTriaConnector, useAccount } from "@tria-sdk/connect";
import { TriaConnectProvider } from "@tria-sdk/authenticate";
import Application from "@tria-sdk/authenticate";
import { useEffect } from "react";
import Wallet from "./pages/Wallet";

function App() {
  const { globalData } = useTriaConnector({
    authUrl: "https://auth.tria.so",
    walletUrl: "https:wallet.tria.so",
  });
  const { account } = useAccount();

  console.log(account);

  return (
    <>

      <div className="bg-black h-[100vh] w-[100vw]">
        {!account ? <div className="w-full h-20 px-10 py-4 bg-neutral-900 border-b border-stone-950 justify-start items-center gap-4 inline-flex">
          <div className="grow shrink basis-0 h-12 justify-between items-center flex">
            <div className=" justify-center items-center gap-2.5 flex">
              <div className=" h-7 relative">
                <div className="">
                  <img src="/icons/logoName.svg" alt="tria_logo" />
                </div>
              </div>
              <div className="px-2 py-1 rounded-[69px] border border-violet-400 justify-center items-center gap-2.5 flex">
                <div className="text-center text-violet-400 text-base font-normal font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Demo</div>
              </div>
            </div>
          </div>
        </div> : null}
        <TriaConnectProvider />
        {account ? <Home /> : null}
        <Application
          dappName={"Tria Demo"}
          logo={"https://svgshare.com/i/10zF.svg"}
          dappDomain={window.parent.origin}
          primaryColor="#9A86FF"
          defaultChain="FUSE"
          supportedChains={["FUSE", "POLYGON"]}
        />
      </div>
    </>
  );
}

export default App;
