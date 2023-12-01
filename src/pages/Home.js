import { useEffect, useState } from "react";
import LoginButton from "../components/LoginButton"
import HomeBackgroundVector from "./HomeBackgroundVector";
import Application from "@tria-sdk/authenticate"
import "@tria-sdk/authenticate/dist/index.css";
// import { } from "@tria-sdk/authenticate";
import {useSignMessage,useSendTransaction,useContractWrite,useSendNft,send,sendNft as sendnftfun,readContract,writeContract} from '@tria-sdk/connect';


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
  recepientAddress: "jatinhacker@tria",
  chainName: "POLYGON",
  tokenAddress:""
});

// const { data :contractwrite,  write }=useContractWrite({
//     chainName: "POLYGON",
//     payToken:{
//     tokenAddress:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
//     amount:1
//   },
//     contractDetails:  {
//       contractAddress: '0x5927Aa58fb36691A4be262c63955b47b67c6e641',
//       abi: [
//         {
//           inputs: [
//             { internalType: 'uint256', name: 'id', type: 'uint256' },
//             { internalType: 'uint256', name: 'amount', type: 'uint256' },
//           ],
//           name: 'mint',
//           outputs: [],
//           stateMutability: 'payable',
//           type: 'function',
//         },
//       ],
//       functionName: 'mint',
//       //@ts-ignore
//       args: [1, 1],
//       value: 0,
//     }});


const { data :contractwrite,  write }=useContractWrite({
  chainName: "FUSE",
  // payToken: {
  //   tokenAddress: "0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd",
  //   amount: 1
  //   },
  contractDetails:  {
    contractAddress: '0xFfC6F3186985e963821D3E30Cdb2ec4c0bE110e5',
    abi: [
      {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_claimer",
                "type": "address"
            }
        ],
        "name": "airdropCoupon",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
    ],
    functionName: 'airdropCoupon',
    //@ts-ignore
    args:["1", "1", "0xD243090e67788bc26968a7339680Fd0AE2b0b6A4"],
    // value: 0,
  }});

    const {data:sendNftResp,sendNft}=useSendNft({
      chainName: "FUSE",
      fromTriaName: "lalit731@tria",
      recipientTriaName: "admin@tria",
      nftDetails: {
          type: "ERC1155",
          tokenAddress: "0xFfC6F3186985e963821D3E30Cdb2ec4c0bE110e5",
          tokenId: "1",
          amount: 1,
      }
  })

// ....................................................................
const sendFunction=async()=>{
const sendFunctionResp = await send({
  amount: 0.00001,
  recepientAddress: "admin@tria",
  chainName: "POLYGON",
  tokenAddress:""
});
}

const sendNftFunction=async()=>{
  const sendFunctionResp = await sendnftfun({
    chainName: "FUSE",
    fromTriaName: "lalit731@tria",
    recipientTriaName: "admin@tria",
    nftDetails: {
        type: "ERC1155",
        tokenAddress: "0xFfC6F3186985e963821D3E30Cdb2ec4c0bE110e5",
        tokenId: "1",
        amount: 1,
    }
});
console.log("sendFunctionResp---->",sendFunctionResp);
  }

  const readContractFunction=async()=>{
    const readContractFunctionResp = await readContract({
      chainName:"POLYGON",
      contractDetails: {
        contractAddress: "0x5927Aa58fb36691A4be262c63955b47b67c6e641",
        abi: [
          {
            inputs: [
              { internalType: "uint256", name: "id", type: "uint256" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "getItemsNativePrice",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getItemsNativePrice",
        args: [1, 1],
        // value: 0,
      },
    });
  console.log("readContractFunction---->",readContractFunctionResp);
    }

    const writeContractFunction=async()=>{
      const writeContractFunctionResp = await writeContract({
        chainName: "FUSE",
        payToken: {
          tokenAddress: "0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd",
          amount: 3
          },
        contractDetails:  {
          contractAddress: '0xFfC6F3186985e963821D3E30Cdb2ec4c0bE110e5',
          abi: [
            {
              "inputs": [
                  {
                      "internalType": "uint256",
                      "name": "_tokenId",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "_amount",
                      "type": "uint256"
                  },
                  {
                      "internalType": "address",
                      "name": "_claimer",
                      "type": "address"
                  }
              ],
              "name": "airdropCoupon",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
          }
          ],
          functionName: 'airdropCoupon',
          //@ts-ignore
          args:["1", "1", "0xD243090e67788bc26968a7339680Fd0AE2b0b6A4"],
          value: 3,
        }});
    console.log("readContractFunction---->",writeContractFunctionResp);
      }


    // const writeContractFunction=async()=>{
    //   const readContractFunctionResp = await writeContract({
    //     chainName: "POLYGON",
    //     // payToken: {
    //     //   tokenAddress: "0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd",
    //     //   amount: 3
    //     //   },
    //     contractDetails:  {
    //       contractAddress: '0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91',
    //       abi: [
    //         {
    //           inputs: [
    //             { internalType: 'uint256', name: '_tokenID', type: 'uint256' },
    //             { internalType: 'address', name: '_claimer', type: 'address' },
    //           ],
    //           name: 'claimCoupon',
    //           outputs: [],
    //           stateMutability: 'nonpayable',
    //           type: 'function',
    //         },
    //       ],
    //       functionName: 'claimCoupon',
    //       args: [1, '0xD243090e67788bc26968a7339680Fd0AE2b0b6A4'],
    //       // value: 1,
    //     }});
    // console.log("readContractFunction---->",readContractFunctionResp);
    //   }



console.log("send data----------------->",data);
console.log("sign data----------------->",sign);
console.log("contract write---------------->",contractwrite);
console.log("send NFT------->",sendNftResp);

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
 <Application dappName={"Empire"} logo={"https://www.empireofsight.com/assets/images/logo-icon.svg"} dappDomain={window.parent.origin} primaryColor = "#70CA00" />
 <button className="text-white bg-blue-500  px-4 py-2 rounded-md mr-2" onClick={()=>signMessage()}>Sign Message</button>
 <button className="text-white bg-blue-500  px-4 py-2 rounded-md" onClick={()=>sendTransaction()}>send Transaction</button>
 <button className="text-white bg-blue-500  px-4 py-2 rounded-md" onClick={()=>write()}>call contract</button>
 <button className="text-white bg-blue-500  px-4 py-2 rounded-md" onClick={()=>sendNft()}>send nft</button>
 <div className="mt-4 ">
 <button className="text-white bg-green-500  px-4 py-2 rounded-md" onClick={()=>sendFunction()}>send function</button>
 <button className="text-white bg-green-500 px-4 py-2 rounded-md" onClick={()=>sendNftFunction()}>send nft function</button>
 <button className="text-white bg-green-500  px-4 py-2 rounded-md" onClick={()=>readContractFunction()}>read contract function</button>
 <button className="text-white bg-green-500  px-4 py-2 rounded-md" onClick={()=>writeContractFunction()}>write contract function</button>
 </div>
      </div>
  )
}

export default Home
