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

const { data:sign, isError, isLoading, isSuccess,signMessage  } = useSignMessage({
  message:"lalit this side ",
  chainName:"POLYGON"
});

const { data,sendTransaction } = useSendTransaction({
  amount: 0.00001,
  senderAddress: "lalitthreely@tria",
  recepientAddress: "dev@tria",
  chainName: "POLYGON",
  tokenAddress:""
});

const { data :contractwrite,  write }=useContractWrite({
    chainName: "POLYGON",
    tokenAddress: undefined,
    contractDetails:  {
      contractAddress: '0x5927Aa58fb36691A4be262c63955b47b67c6e641',
            abi: [
                {
          inputs: [
                        { internalType: 'uint256', name: 'id', type: 'uint256' },
                        { internalType: 'uint256', name: 'amount', type: 'uint256' },
                    ],
                    name: 'mint',
                    outputs: [],
                    stateMutability: 'payable',
                    type: 'function',
                },
            ],
            functionName: 'mint',
            //@ts-ignore
            args: [100, 1],
            value :8
  }});

console.log("send data----------------->",data);
console.log("sign data----------------->",sign);
console.log("contract write---------------->",contractwrite);

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
 <Application dappName={"Empire"} logo={"https://www.empireofsight.com/assets/images/logo-icon.svg"} dappDomain={window.parent.origin} />
 <button className="text-white bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={()=>signMessage()}>Sign Message</button>
 <button className="text-white bg-green-500 text-white px-4 py-2 rounded-md" onClick={()=>sendTransaction()}>send Transaction</button>
 <button className="text-white bg-black-500 text-white px-4 py-2 rounded-md" onClick={()=>write()}>call contract</button>
      </div>
  )
}

export default Home