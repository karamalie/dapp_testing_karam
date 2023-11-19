import { useEffect, useState } from "react";
import LoginButton from "../components/LoginButton"
import HomeBackgroundVector from "./HomeBackgroundVector";
import Application from "@tria-sdk/authenticate"
import "@tria-sdk/authenticate/dist/index.css";
import {useSignMessage,useSendTransaction,useContractWrite } from "@tria-sdk/authenticate";


const Home = () => {

  const [showWallet, setShowWallet] = useState(false)
useEffect(() => {
  const item = localStorage.getItem("tria.wallet.store");
  console.log(item);
}, []);

const { account, isError, isLoading, isSuccess, signMessage } = useSignMessage({
  message:"lalit this side ",  
  triaName:"lalitt@tria",
  chainName:"POLYGON"
});

console.log("sign data----------------->",account);

 const handleButtonClick = () => {
  const data = {triaName:'testName', evmAddress:'sample'};
  localStorage.setItem("tria.wallet.store", JSON.stringify(data));
}

  return (
    <div className="">
      {/* <div className="absolute top-20 left-20 "><HomeBackgroundVector/></div>
      <div
              className="wallet_icon fixed w-[80px] bottom-4 right-8 cursor-pointer"
              onClick={() => {
                setShowWallet(!showWallet);
              }}
            >
              <div className="relative ">
                <div className="left-[15.49px] top-[15.49px]">
                  {" "}
                  <img
                    className="wallet_icon "
                    src="/icons/wallet.png"
                    alt="wallet"
                  />
                </div>
              </div>
              {showWallet && (
              <div className="bg flex  justify-between bg-black">
                <div className="mr-2 fixed right-2 bottom-16 rounded-[20px] overflow-hidden">
                    <iframe width="314" height="588" className="" src="http://localhost:3000"/> 

                   

                </div>
              </div>
            )}
            
            </div>

      */}

      {/* <button className="absolute top-[50px] left-[50px] w-[80px] bg-pink-500" onClick={handleButtonClick}>click here</button> */}
 <Application dappName={"Empire"} logo={"https://www.empireofsight.com/assets/images/logo-icon.svg"} />
 <button className="text-white" onClick={()=>signMessage()}>Sign Message</button>
      </div>
  )
}

export default Home