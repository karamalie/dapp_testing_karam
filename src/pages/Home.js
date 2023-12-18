import { useEffect, useState } from "react";
import "@tria-sdk/authenticate-staging/dist/index.css";
import {
  useSignMessage,
  useSendTransaction,
  useContractWrite,
  useContractRead,
  useDisconnect,
  writeContract
} from "@tria-sdk/connect";

const Home = () => {
  const [showWallet, setShowWallet] = useState(false);
  const [message, setMessage] = useState("Sign in with Tria");
  const [amount, setAmount] = useState(0.00001);
  const [senderAddress, setSenderAddress] = useState("");
  const [recepientAddress, setrecepientAddress] = useState("");
  const [contractDetails, setContractDetails] = useState();
  const [chainName, setChainName] = useState("FUSE");
  const [tokenAddress, setTokenAddress] = useState("");

  const { disconnect } = useDisconnect()

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
    contractDetails: {
      contractAddress: "0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91",
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "_tokenID", type: "uint256" },
            { internalType: "address", name: "_claimer", type: "address" },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: "mint",
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

  const logged_user = JSON.parse(localStorage.getItem('tria.wallet.store'))?.triaName


  const [bg, setBg] = useState("")
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    const logged_user = JSON.parse(localStorage.getItem('tria.wallet.store'))?.triaName
    getTriaImage(logged_user)
  }, [])

  const getTriaImage = async (item) => {
    const resp = await fetch(`https://prod.tria.so/api/v2/user/getAvatarByTriaName?triaNames=${item}`, {
      method: "GET"
    })
    const res = await resp.json()
    console.log("resp", res.response[item][0])
    setBg(res?.response[item][0]?.background)
    setAvatar(res?.response[item][0]?.avatar)
  }

  const sign_message = "Sign in with Tria"

  const callSign = async () => {
    const data = await signMessage({ sign_message, chainName }, undefined, "https://auth.tria.so")
    console.log('function returned data', data)
  }

  const callWriteContract = async () => {

    const data = await writeContract({
      chainName, contractDetails
    }, undefined, "https://auth.tria.so", "wss://prod.tria.so")
    console.log('function returned data', data)

  }

  const callSendTransaction = async () => {

    const data = await sendTransaction({
      chainName, contractDetails
    }, undefined, "https://auth-tria.vercel.app", "wss://prod.tria.so")
    console.log('function returned data', data)

  }

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);


  return (
    <>
      <div className="w-full h-screen set_img">
        {/* Topbar */}
        <div className="w-full h-20 px-10 py-4 bg-neutral-900 border-b border-stone-950 justify-start items-center gap-4 inline-flex">
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
            <div className="bg-neutral-800 rounded-[49px] border-2 border-neutral-800 justify-center items-center flex">
              <div className="px-6 py-3 bg-neutral-700 rounded-[58px] justify-center items-center flex">
                <div className="justify-center items-center flex">
                  <div className="text-center text-neutral-50 text-sm font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Web3 App</div>
                </div>
              </div>
              <div className="px-6 py-3 cursor-not-allowed rounded-[58px] justify-center items-center flex">
                <div className="justify-center items-center flex">
                  <div className="text-center text-neutral-50 text-sm text-opacity-60 font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Testing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navbar */}
        <div className="w-full h-[82px] pl-[63px] pr-20 py-[9px] bg-zinc-500 bg-opacity-10 justify-start items-center justify-between inline-flex">
          <div className=" rounded-xl justify-center items-center gap-2 inline-flex">
            <div className="w-10 h-10 relative">
              <img src="/icons/sky.svg" alt="sky_icon" />
            </div>
            <div className="text-neutral-50 text-lg font-normal font-['Neue Haas Grotesk Display Pro'] ">{logged_user}</div>
          </div>
          <div className="p-2 rounded-[79px] justify-end items-center gap-3 inline-flex">
            <div className="justify-end items-center flex">
              <div className="pr-2 justify-end items-center gap-2 flex">
                <div onClick={() => { localStorage.removeItem("tria.wallet.store"); window.location.reload() }} className="w-14 hover:text-red-700 cursor-pointer hover:transition duration-200 text-red-500 text-base font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Logout</div>
              </div>
            </div>
            <div style={{ background: bg }} className={`w-12 h-12 justify-center items-center flex rounded-full`}>
              {avatar && <img alt="avatar" className="w-12 h-12 rounded-[32.73px]" src={avatar} />}
            </div>
          </div>
        </div>

        {/* Lower Functional Grid */}

        {windowSize.innerWidth > 1000 ?
        <div className="w-full grid grid-cols-9 gap-5">
          <div className="col-span-2 ml-10 mt-4">
            <div className="w-full h-3/4 px-5 pt-4 pb-6 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
              <div className="py-2 justify-center items-center gap-4 inline-flex">
                <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Mint NFT</div>
              </div>
              <div className="rounded-[16.97px] flex-col justify-center items-center flex">
                <div className="w-[100%] relative">
                  <img className="h-auto max-w-full rounded-[22.48px]" src="https://s3-alpha-sig.figma.com/img/a4a4/1cbd/6ed770a47f0dad046e76f9e83b2af41b?Expires=1704067200&Signature=P7rOVqfRoebDT5si5092CUUWeDTIBOtxjrT4ZKkuEG-dcdBVBQO11~ZBtPwQM7LHowha-kJpFdNpEqdFZpNvDn0GGDbh2FCHYJEP5t80HhzIiMVGvOWO2u8RZsz3Yb7-1d4XGDM4cz10ZjYvibfvptkQ~94gwiMtkE2vIHdLZrwelPkdDw1T47hK9pq4OLFdiJGhQ~HinCn6pdckQydmvcjpQt~OsL~Ae5waywqbi9Hinu98XD9v7VdOhxZe1RHF3mYVNFc2bzHj2hPY6Gpp2-JoIAYCM8-8NlU0F3USmg6zIN52IuIj-5ahVpoonjgJpbX0HY3-b89w~J-Fz3AX1A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" />
                  <div className="w-[65.49px] h-[65.49px] p-[12.59px] left-[0.13px] top-[-0px] absolute justify-center items-center gap-[13.57px] inline-flex">
                    <div className="w-[40.30px] h-[40.30px] pl-[5.89px] pr-[5.90px] pt-[5.75px] pb-1.5 bg-gradient-to-br from-stone-950 to-stone-950 rounded-[34.66px] backdrop-blur-[5.04px] justify-center items-center inline-flex">
                      <div className="w-[28.51px] h-[28.51px] relative flex-col justify-start items-start flex" />
                      <img src="/icons/Polygon.svg" alt="polygon" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch  px-[8.43px] py-[16.86px] rounded-[27.15px] justify-center items-center inline-flex">
                  <div className=" justify-center items-center flex">
                    <div className="text-center text-neutral-50 text-opacity-90 text-xl  font-light font-['Neue Haas Grotesk Display Pro'] leading-[30.23px] tracking-wide">#10 EVOL Fanny</div>
                  </div>
                </div>
              </div>
              <div onClick={()=>callWriteContract()} className="w-3/4 cursor-pointer hover:bg-neutral-700 hover:transition duration-300 px-2 py-2 bg-neutral-800 rounded-[78px] justify-center items-center inline-flex">
                <div className="justify-center items-center flex">
                  <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Mint</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 mt-4">
            <div className="w-full h-64 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 inline-flex">
              <div className="self-stretch h-56 px-3 flex-col justify-center items-center gap-[22px] flex">
                <div onClick={() => callSign()} className="self-stretch cursor-pointer hover:bg-zinc-600 hover:bg-opacity-40 hover:transition duration-200 h-[60px] px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl justify-start items-center gap-2 inline-flex">
                  <div className="grow shrink basis-0 h-[22px] justify-start items-center flex">
                    <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Sign our T&Cs</div>
                  </div>
                </div>
                <div className="self-stretch h-[60px] cursor-pointer hover:bg-zinc-600 hover:bg-opacity-40 hover:transition duration-200 px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl justify-start items-center gap-2 inline-flex">
                  <div className="grow shrink basis-0 h-[22px] justify-start items-center flex">
                    <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Increase Transaction Limit</div>
                  </div>
                </div>
                <div className="self-stretch h-[60px] cursor-pointer hover:bg-zinc-600 hover:bg-opacity-40 hover:transition duration-200 px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl justify-start items-center gap-2 inline-flex">
                  <div className="grow shrink basis-0 h-[26px] justify-start items-center gap-2 flex">
                    <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Receive Goodluck!</div>
                    <div className="text-center text-neutral-50 text-[22px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-relaxed tracking-wide">✨🍀</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-3 h-1/2 px-5 py-4 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-center gap-5 inline-flex">
              <div className="p-[8.83px] flex-col justify-center items-center gap-2 flex">
                <div className="text-neutral-50 text-xl font-normal font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Experience the ease of</div>
                <div className="text-neutral-50 text-[56px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-[67.20px] tracking-wide">Web3 Wallet</div>
              </div>
            </div>

          </div>
          <div className="mt-4 col-span-2">
            <div className="w-full h-64 px-5 py-4 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px]" />
            <div className="w-full mt-3 h-1/2 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 inline-flex">
              <div className="self-stretch py-2 justify-center items-center gap-4 inline-flex">
                <div className="text-neutral-50 text-lg mt-3 font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Send Token</div>
              </div>
              <div className="self-stretch flex-col mb-5 justify-center items-center gap-4 flex">
                <div className="self-stretch h-12 justify-start items-center gap-5 inline-flex">
                  <div className="grow shrink basis-0 self-stretch px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center gap-3 flex">
                  <div className="w-6 h-6 p-[2.40px] bg-black rounded-2xl backdrop-blur-[3px] flex-col justify-center items-center inline-flex">
                    <img src="https://static.tria.so/chain-logo-w/Fuse.svg" alt="fuse_icon" />
                  </div>
                    <div className="grow shrink basis-0 h-[19px] justify-start items-center flex">
                      <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">FUSE</div>
                    </div>
                    <div className="w-[18px] h-[18px] justify-center items-center flex">
                      <div className="w-[18px] h-[18px] relative">
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-12 justify-start items-center gap-3 inline-flex">
                  <div className="grow shrink basis-0 h-[51px] px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center flex">
                    <div className="justify-start items-center flex">
                      <input type="number" className="w-full text-white focus:outline-none text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-transparent w-full" placeholder="Token Value" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-12 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                  <div className="justify-start items-center flex">
                    <input className="w-full text-white focus:outline-none bg-transparent text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight" placeholder="Recipient Address" />
                  </div>
                </div>
                <div className="w-1/2 h-[34px] cursor-pointer hover:bg-neutral-700 hover:transition duration-300 p-5 bg-neutral-800 rounded-[78px] justify-center items-center inline-flex">
                  <div className="justify-center items-center flex">
                    <div className="text-center text-white text-lg  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Send</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : 
        <div className="w-full grid grid-cols-6 gap-5">
        <div className="col-span-2 ml-10 mt-4">
          <div className="w-full h-full px-5 pt-4 pb-6 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
            <div className="self-stretch py-2 justify-center items-center gap-4 inline-flex">
              <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Mint NFT</div>
            </div>
            <div className="p-[10.08px] rounded-[16.97px] flex-col justify-center items-center flex">
              <div className="w-full h-[250.90px] relative">
                <img className="left-0 top-0 absolute rounded-[22.48px]" src="https://s3-alpha-sig.figma.com/img/a4a4/1cbd/6ed770a47f0dad046e76f9e83b2af41b?Expires=1704067200&Signature=P7rOVqfRoebDT5si5092CUUWeDTIBOtxjrT4ZKkuEG-dcdBVBQO11~ZBtPwQM7LHowha-kJpFdNpEqdFZpNvDn0GGDbh2FCHYJEP5t80HhzIiMVGvOWO2u8RZsz3Yb7-1d4XGDM4cz10ZjYvibfvptkQ~94gwiMtkE2vIHdLZrwelPkdDw1T47hK9pq4OLFdiJGhQ~HinCn6pdckQydmvcjpQt~OsL~Ae5waywqbi9Hinu98XD9v7VdOhxZe1RHF3mYVNFc2bzHj2hPY6Gpp2-JoIAYCM8-8NlU0F3USmg6zIN52IuIj-5ahVpoonjgJpbX0HY3-b89w~J-Fz3AX1A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" />
                <div className="w-[65.49px] h-[65.49px] p-[12.59px] left-[0.13px] top-[-0px] absolute justify-center items-center gap-[13.57px] inline-flex">
                  <div className="w-[40.30px] h-[40.30px] pl-[5.89px] pr-[5.90px] pt-[5.75px] pb-1.5 bg-gradient-to-br from-stone-950 to-stone-950 rounded-[34.66px] backdrop-blur-[5.04px] justify-center items-center inline-flex">
                    <div className="w-[28.51px] h-[28.51px] relative flex-col justify-start items-start flex" />
                    <img src="/icons/Polygon.svg" alt="polygon" />
                  </div>
                </div>
              </div>
              <div className="self-stretch px-[8.43px] py-[16.86px] rounded-[27.15px] justify-center items-center inline-flex">
                <div className="h-[30px] justify-center items-center flex">
                  <div className="text-center text-neutral-50 text-opacity-90 text-2xl font-light font-['Neue Haas Grotesk Display Pro'] leading-[30.23px] tracking-wide">#10 EVOL Fanny</div>
                </div>
              </div>
            </div>
            <div onClick={()=>callWriteContract()} className="w-3/4 h-[54px] cursor-pointer hover:bg-neutral-700 hover:transition duration-300 p-5 bg-neutral-800 rounded-[78px] justify-center items-center inline-flex">
              <div className="justify-center items-center flex">
                <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Mint</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 mt-4">
          <div className="w-full h-64 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 inline-flex">
            <div className="self-stretch h-56 px-3 flex-col justify-center items-center gap-[22px] flex">
              <div onClick={() => callSign()} className="self-stretch cursor-pointer hover:bg-zinc-600 hover:bg-opacity-40 hover:transition duration-200 h-[60px] px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 h-[22px] justify-start items-center flex">
                  <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Sign our T&Cs</div>
                </div>
              </div>
              <div className="self-stretch h-[60px] cursor-pointer hover:bg-zinc-600 hover:bg-opacity-40 hover:transition duration-200 px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 h-[22px] justify-start items-center flex">
                  <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Increase Transaction Limit</div>
                </div>
              </div>
              <div className="self-stretch h-[60px] cursor-pointer hover:bg-zinc-600 hover:bg-opacity-40 hover:transition duration-200 px-4 py-3 bg-zinc-500 bg-opacity-5 rounded-xl justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 h-[26px] justify-start items-center gap-2 flex">
                  <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Receive Goodluck!</div>
                  <div className="text-center text-neutral-50 text-[22px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-relaxed tracking-wide">✨🍀</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-3 h-1/2 px-5 py-4 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-center gap-5 inline-flex">
            <div className="p-[8.83px] flex-col justify-center items-center gap-2 flex">
              <div className="text-neutral-50 text-xl font-normal font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Experience the ease of</div>
              <div className="text-neutral-50 text-[56px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-[67.20px] tracking-wide">Web3 Wallet</div>
            </div>
          </div>
        </div>
        <div className="mt-4 col-span-2 ml-10">  
          <div className="w-full mt-3 h-full px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 inline-flex">
            <div className="self-stretch py-2 justify-center items-center gap-4 inline-flex">
              <div className="text-neutral-50 text-lg mt-3 font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Send Token</div>
            </div>
            <div className="self-stretch flex-col mb-5 justify-center items-center gap-4 flex">
              <div className="self-stretch h-12 justify-start items-center gap-5 inline-flex">
                <div className="grow shrink basis-0 self-stretch px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center gap-3 flex">
                  <div className="w-6 h-6 p-[2.40px] bg-black rounded-2xl backdrop-blur-[3px] flex-col justify-center items-center inline-flex">
                    <img src="https://static.tria.so/chain-logo-w/Fuse.svg" alt="fuse_icon" />
                  </div>
                  <div className="grow shrink basis-0 h-[19px] justify-start items-center flex">
                    <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">FUSE</div>
                  </div>
                  <div className="w-[18px] h-[18px] justify-center items-center flex">
                    <div className="w-[18px] h-[18px] relative">
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-12 justify-start items-center gap-3 inline-flex">
                <div className="grow shrink basis-0 h-[51px] px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center flex">
                  <div className="justify-start items-center flex">
                    <input type="number" className="w-full text-white focus:outline-none text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-transparent w-full" placeholder="Token Value" />
                  </div>
                </div>
              </div>
              <div className="self-stretch h-12 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                <div className="justify-start items-center flex">
                  <input className="w-full text-white focus:outline-none bg-transparent text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight" placeholder="Recipient Address" />
                </div>
              </div>
              <div className="w-1/2 h-[34px] cursor-pointer hover:bg-neutral-700 hover:transition duration-300 p-5 bg-neutral-800 rounded-[78px] justify-center items-center inline-flex">
                <div className="justify-center items-center flex">
                  <div className="text-center text-white text-lg  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Send</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        }
      </div>
    </>
  );
};

export default Home;
