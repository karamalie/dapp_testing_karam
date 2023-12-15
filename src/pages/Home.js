import { useEffect, useState } from "react";
import LoginButton from "../components/LoginButton";
import HomeBackgroundVector from "./HomeBackgroundVector";
import "@tria-sdk/authenticate-staging/dist/index.css";
import {
  useSignMessage,
  useSendTransaction,
  useContractWrite,
  useContractRead,
} from "@tria-sdk/connect";

const Home = () => {
  const [showWallet, setShowWallet] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(0.00001);
  const [senderAddress, setSenderAddress] = useState("");
  const [recepientAddress, setrecepientAddress] = useState("");
  const [contractDetails, setContractDetails] = useState();
  const [chainName, setChainName] = useState("POLYGON");
  const [tokenAddress, setTokenAddress] = useState("");
  useEffect(() => {
    const item = localStorage.getItem("tria.wallet.store");
    console.log(item);
  }, []);

  console.log("data------------------>", {
    message,
    amount,
    senderAddress,
    recepientAddress,
    contractDetails,
    chainName,
    tokenAddress,
  });
  if (contractDetails) console.log("contractDetails", contractDetails);

  const {
    data: signature,
    isError,
    isLoading,
    isSuccess,
    signMessage,
  } = useSignMessage({
    message,
    chainName,
  });

  const { data, sendTransaction } = useSendTransaction({
    amount,
    senderAddress,
    recepientAddress,
    chainName,
    tokenAddress,
  });

  const { data: contractwrite, write } = useContractWrite({
    chainName,
    payToken: { tokenAddress, amount },
    contractDetails: contractDetails || {
      contractAddress: "0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91",
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "_tokenID", type: "uint256" },
            { internalType: "address", name: "_claimer", type: "address" },
          ],
          name: "claimCoupon",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: "claimCoupon",
      args: [1, "0x5B0C3aD51E0C52A0F072Ba278f957E3Ac422513f"],
      // value: 1,
    },
  });

  const { data: contractread } = useContractRead({
    chainName,
    baseUrl: "https://staging.tria.so",
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

  if (data) console.log("send data----------------->", data);
  if (signature) console.log("sign data----------------->", signature);
  if (contractwrite)
    console.log("contract write---------------->", contractwrite);
  // if (contractread) console.log("contract read---------------->", contractread);

  const handleButtonClick = () => {
    const data = { triaName: "testName", evmAddress: "sample" };
    localStorage.setItem("tria.wallet.store", JSON.stringify(data));
  };


  const [darkMode,setDarkMode]=useState(true);


  return (
    <div className="">
    <div className="w-[1920px] h-[1080px] relative bg-stone-950">
  <div className="w-[1924px] h-[1000px] left-0 top-[79px] absolute">
    {/* <img className="w-[2484px] h-[1397px] left-[-560px] top-[-317px] absolute" src="https://via.placeholder.com/2484x1397" /> */}
    {/* <div className="w-16 h-16 left-[1782px] top-[873px] absolute">
      <div className="w-16 h-16 left-0 top-0 absolute bg-gradient-to-r from-white to-indigo-200 rounded-[100px] shadow" />
      <div className="w-[58.98px] h-[58.98px] left-[2.51px] top-[2.51px] absolute bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[100px] shadow border border-violet-400">
        <div className="w-7 h-7 left-[15.49px] top-[15.49px] absolute rounded-md" />
      </div>
    </div> */}
    <div className="w-[1924px] h-[82px] left-0 top-0 absolute bg-zinc-500 bg-opacity-10">
      <div className="p-2 left-[1682px] top-[9px] absolute rounded-[79px] justify-end items-center gap-3 inline-flex">
        <div className="justify-end items-center flex">
          <div className="pr-2 justify-end items-center gap-2 flex">
            <div className="w-14 text-red-500 text-lg font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Logout</div>
          </div>
        </div>
        <div className="w-12 h-12 relative">
          <img className="w-12 h-12 left-0 top-0 absolute rounded-[32.73px]" src="https://via.placeholder.com/48x48" />
        </div>
      </div>
      <div className="h-[48.50px] left-[63px] top-[17px] absolute rounded-xl justify-center items-center gap-2 inline-flex">
        <div className="w-[33.95px] h-[38.80px] relative">
          <img src="/icons/sky.svg"></img>
        </div>
        <div className="text-neutral-50 text-2xl font-normal font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">sky5</div>
      </div>
    </div>
    <div className="left-[433px] top-[98px] absolute flex-col justify-start items-start gap-4 inline-flex">
      <div className="h-64 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 flex">
        <div className="self-stretch h-56 px-3 flex-col justify-center items-center gap-[22px] flex">
          <div className="self-stretch h-[60px] px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl border-2 justify-start items-center gap-2 inline-flex">
            <div className="grow shrink basis-0 h-[22px] justify-start items-center flex">
              <div className="text-center text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Sign our T&Cs</div>
            </div>
          </div>
          <div className="self-stretch h-[60px] px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl border-2 justify-start items-center gap-2 inline-flex">
            <div className="grow shrink basis-0 h-[22px] justify-start items-center flex">
              <div className="text-center text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Increase Transaction Limit</div>
            </div>
          </div>
          <div className="self-stretch h-[60px] px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl border-2 justify-start items-center gap-2 inline-flex">
            <div className="grow shrink basis-0 h-[26px] justify-start items-center gap-2 flex">
              <div className="text-center text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Receive Goodluck!</div>
              <div className="text-center text-neutral-50 text-[22px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-relaxed tracking-wide">✨🍀</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[534px] h-[343px] px-5 py-4 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-center gap-5 flex">
        <div className="p-[8.83px] flex-col justify-center items-center gap-2 flex">
          <div className="text-neutral-50 text-xl font-normal font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Experience the ease of</div>
          <div className="text-neutral-50 text-[56px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-[67.20px] tracking-wide">Web3 Wallet</div>
        </div>
      </div>
      <div className="h-[241px] p-4 bg-zinc-500 bg-opacity-10 rounded-[22px] border-r-2 flex-col justify-start items-start gap-5 flex">
        <div className="self-stretch h-[209px] py-3 flex-col justify-center items-start flex">
          <div className="self-stretch h-[185px] flex-col justify-center items-start gap-2 flex">
            <div className="px-2 justify-center items-center inline-flex">
              <div className="text-center text-white text-opacity-40 text-base font-medium font-['Neue Haas Grotesk Display Pro'] uppercase leading-tight tracking-tight">Customizations</div>
            </div>
            <div className="self-stretch justify-start items-center gap-5 inline-flex">
              <div className="grow shrink basis-0 h-[75px] px-5 py-4 rounded-xl justify-start items-center gap-4 flex">
                <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
                  <div className="self-stretch text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Theme</div>
                  <div className="self-stretch text-neutral-50 text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-[16.80px] tracking-tight">Choose Light or Dark mode</div>
                </div>
              </div>
              <div className="bg-neutral-800 rounded-[14px] border-2 justify-center items-center flex">
                <div className="px-4 py-2 rounded-2xl justify-center items-center flex">
                  <div className="w-6 h-6 relative">
                    <div className="w-6 h-6 left-0 top-0 absolute">
                      <img src="/icons/sun.svg"></img>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gradient-to-br from-indigo-950 to-slate-900 rounded-[14px] justify-center items-center flex">
                  <div className="w-6 h-6 relative">
                    <div className="w-6 h-6 left-0 top-0 absolute">
                    <img src="/icons/moon.svg"></img>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch justify-start items-center gap-5 inline-flex">
              <div className="grow shrink basis-0 h-[75px] px-5 py-4 rounded-xl justify-start items-center gap-4 flex">
                <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
                  <div className="self-stretch text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Wallet color card</div>
                  <div className="self-stretch text-neutral-50 text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-[16.80px] tracking-tight">Choose your card color</div>
                </div>
              </div>
              <div className="rounded-[29.40px] border justify-center items-center gap-[14.40px] flex">
                <div className="p-[9.60px] rounded-[34.80px] justify-center items-center flex">
                  <div className="w-[19.20px] h-[19.20px] bg-blue-800 rounded-xl" />
                </div>
                <div className="p-[9.60px] rounded-[34.80px] border border-neutral-800 justify-center items-center flex">
                  <div className="w-[19.20px] h-[19.20px] bg-amber-500 rounded-xl" />
                </div>
                <div className="p-[9.60px] rounded-[34.80px] justify-center items-center flex">
                  <div className="w-[19.20px] h-[19.20px] bg-pink-700 rounded-xl" />
                </div>
                <div className="p-[9.60px] rounded-[34.80px] border justify-center items-center flex">
                  <div className="w-[19.20px] h-[19.20px] bg-green-400 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="left-[983px] top-[98px] absolute flex-col justify-start items-start gap-4 inline-flex">
      <div className="w-[377px] h-[303px] px-5 py-4 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px]" />
      <div className="h-[343px] px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 flex">
        <div className="self-stretch py-2 justify-center items-center gap-4 inline-flex">
          <div className="text-neutral-50 text-2xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Send Token</div>
        </div>
        <div className="self-stretch h-[246px] flex-col justify-center items-center gap-4 flex">
          <div className="self-stretch h-12 justify-start items-center gap-5 inline-flex">
            <div className="grow shrink basis-0 self-stretch px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center gap-3 flex">
              <div className="w-6 h-6 relative bg-violet-600 rounded-2xl border-2 backdrop-blur-[3px]">
                <div className="w-[19.20px] h-[19.20px] left-[2.40px] top-[2.40px] absolute" />
              </div>
              <div className="grow shrink basis-0 h-[19px] justify-start items-center flex">
                <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">MATIC</div>
              </div>
              <div className="w-[18px] h-[18px] relative">
                <div className="w-[18px] h-[18px] left-0 top-0 absolute">
                  <img src="/icons/arrow-down.svg"></img>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-12 justify-start items-center gap-3 inline-flex">
            <div className="grow shrink basis-0 h-[51px] px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center flex">
              <div className="justify-start items-center flex">
                <div className="w-[403px] text-neutral-50 text-opacity-30 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Token Value</div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-12 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
            <div className="justify-start items-center flex">
              <div className="w-[403px] text-neutral-50 text-opacity-30 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Recipient Address</div>
            </div>
          </div>
          <div className="w-[197px] h-[54px] p-5 bg-neutral-800 rounded-[78px] justify-center items-center inline-flex">
            <div className="justify-center items-center flex">
              <div className="text-center text-white text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Send</div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-[377px] h-[194px] px-5 py-4 bg-zinc-500 bg-opacity-0 rounded-[22px] backdrop-blur-[100px]" /> */}
    </div>
    <div className="left-[40px] top-[98px] absolute flex-col justify-start items-start gap-4 inline-flex">
      <div className="w-[377px] h-[576px] px-5 pt-4 pb-6 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-between items-center flex">
        <div className="self-stretch py-2 justify-center items-center gap-4 inline-flex">
          <div className="text-neutral-50 text-2xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Mint NFT</div>
        </div>
        <div className="p-[10.08px] rounded-[16.97px] border-4 flex-col justify-center items-center flex">
          <div className="w-[284.60px] h-[315.90px] relative">
            <img className="w-[284.60px] h-[315.90px] left-0 top-0 absolute rounded-[22.48px]" src="https://via.placeholder.com/285x316" />
            <div className="w-[65.49px] h-[65.49px] p-[12.59px] left-[0.13px] top-[-0px] absolute justify-center items-center gap-[13.57px] inline-flex">
              <div className="w-[40.30px] h-[40.30px] relative bg-gradient-to-br from-stone-950 to-stone-950 rounded-[34.66px] border-4 backdrop-blur-[5.04px]">
                <div className="w-[28.51px] h-[28.51px] left-[5.89px] top-[5.75px] absolute" />
              </div>
            </div>
          </div>
          <div className="self-stretch px-[8.43px] py-[16.86px] rounded-[27.15px] justify-center items-center gap-[13.57px] inline-flex">
            <div className="h-[30px] justify-center items-center gap-[13.57px] flex">
              <div className="text-center text-neutral-50 text-opacity-90 text-[25.19px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-[30.23px] tracking-wide">#10 EVOL Fanny</div>
            </div>
          </div>
        </div>
        <div className="w-[197px] h-[54px] p-5 bg-neutral-800 rounded-[78px] justify-center items-center inline-flex">
          <div className="justify-center items-center flex">
            <div className="text-center text-white text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Mint</div>
          </div>
        </div>
      </div>
      <div className="w-[377px] h-[280px] px-5 py-4 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px]" />
    </div>
  </div>
  <div className="w-[1924px] px-10 py-4 left-0 top-[-1px] absolute bg-neutral-900 border-b border-stone-950 justify-start items-center gap-4 inline-flex">
    <div className="grow shrink basis-0 h-12 justify-between items-center flex">
      <div className="w-[150.28px] justify-center items-center gap-2.5 flex">
        <div className="w-[83.28px] h-7 relative">
          <img src="/icons/logoName.svg"></img>
          <div className="w-7 h-7 left-0 top-0 absolute">
            {/* <div className="w-[20.85px] h-[21.88px] left-[4.81px] top-[3.06px] absolute bg-stone-950" /> */}
          </div>
        </div>
        <div className="px-2 py-1 rounded-[69px] border border-violet-400 justify-center items-center gap-2.5 flex">
          <div className="text-center text-violet-400 text-base font-normal font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Demo</div>
        </div>
      </div>
      <div className="bg-neutral-800 rounded-[49px] border-2 border-neutral-800 justify-center items-center flex">
        <div className="px-6 py-3 bg-neutral-700 rounded-[58px] justify-center items-center flex">
          <div className="justify-center items-center flex">
            <div className="text-center text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Web3 App</div>
          </div>
        </div>
        <div className="px-6 py-3 rounded-[58px] justify-center items-center flex">
          <div className="justify-center items-center flex">
            <div className="text-center text-neutral-50 text-opacity-60 text-lg font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Testing</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default Home;
