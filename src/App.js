import Home from "./pages/Home";
import { useTriaConnector, useDisconnect } from "@tria-sdk/connect";
import { TriaConnectProvider } from "@tria-sdk/authenticate";
import Application from "@tria-sdk/authenticate";
import { useEffect } from "react";
import Wallet from "./pages/Wallet";
import TriaLogin from "./components/TriaLogin";
import { useAccount } from "wagmi";
import ReactGA from 'react-ga';
// Initialize React Ga with your tracking ID
ReactGA.initialize('G-8B9M5DSMB4',{
  debug: true
});


function App() {
  const { globalData } = useTriaConnector({
    authUrl: "https://auth.tria.so",
    walletUrl: "https:wallet.tria.so",
  });

  const { account } = useAccount()

  // console.log(account);

  useEffect(() => {
    console.log("wagmi account", account)
  }, [account])


  return (
    <>
      <div className="bg-black h-[100vh] w-[100vw]">
        {localStorage.getItem('tria.wallet.store') === null && localStorage.getItem("wagmi.connected") === null ? <div className="w-full h-20 px-10 py-4 bg-neutral-900 border-b border-stone-950 justify-start items-center gap-4 inline-flex">
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
        {localStorage.getItem('tria.wallet.store') || localStorage.getItem("wagmi.connected") ? <Home /> : null}
        <TriaLogin />
      </div>
    </>
  );
}

export default App;
