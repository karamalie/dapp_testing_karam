import { useContext, useEffect, useState } from "react";
import "@tria-sdk/authenticate/dist/index.css";
import {
  // encrypt,
  // decrypt,
  useSignMessage,
  useSendTransaction,
  useContractWrite,
  useContractRead,
  writeContract,
  disconnect,
  getAccount,
  readContract
} from "@tria-sdk/connect-staging";
import axios from "axios"
import ReactGA from 'react-ga';
import Context from "../Context";

const Home = () => {
  const [showWallet, setShowWallet] = useState(false);
  const [message, setMessage] = useState("Sign in with Tria");
  const [amount, setAmount] = useState(0.00001);
  const [senderAddress, setSenderAddress] = useState("");
  const [recepientAddress, setrecepientAddress] = useState("");
  const [encryptMessage, setEncryptMessage] = useState("");
  const [decryptMessage, setDecryptMessage] = useState("");
  const [userWalletAddress, setUserWalletAddress] = useState("")
  const [loader, setLoader] = useState(false)
  const [success, setSuccess] = useState(false)
  const { setWalletColor, walletColor, setReloadFlag, reloadFlag } = useContext(Context)
  const [contractDetails, setContractDetails] = useState({
    contractAddress: '0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91',
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: '_tokenID', type: 'uint256' },
          { internalType: 'address', name: '_claimer', type: 'address' },
        ],
        name: 'claimCoupon',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'claimCoupon',
    args: [1, '0x7Ae1bBCe3557D46313a960C0982637967eF5c1f7'],
    // value: 1,
  });
  const [chainName, setChainName] = useState("MUMBAI");
  const [tokenAddress, setTokenAddress] = useState("");

  const [nftData, setNftData] = useState({})



  //const { disconnect } = useDisconnect()

  useEffect(() => {
    const item = localStorage.getItem("tria.wallet.store");
    console.log(item);
    ReactGA.pageview("/dashboard");
    getUserWallet()
    callReadContract()
  }, []);

  const getUserWallet = async () => {
    const user = await getAccount();
    setUserWalletAddress(user.evm.address)
  }

  const callReadContract = async () => {
    const tokenId = "1"
    const readContractRes = await readContract({
      chainName: "MUMBAI", contractDetails: {
        contractAddress: "0x9f5033463b31D213462Ce03A81610364aa80Ba14",
        abi: [{ "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }],
        functionName: "uri",
        args: [tokenId],
      }
    })
    console.log("resContract", readContractRes)
    const readJson = await axios.get(readContractRes)
    console.log("jsonresponse --> ", readJson?.data)
    setNftData(readJson?.data)
  }

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
  }, undefined, "https://auth-tria.vercel.app");

  const { data, sendTransaction } = useSendTransaction({
    amount,
    senderAddress,
    recepientAddress,
    chainName,
    tokenAddress,
  },undefined, "https://auth-tria.vercel.app");

  const { data: contractwrite, write } = useContractWrite({
    chainName,
    payToken: { tokenAddress, amount },
    contractDetails: {
      contractAddress: '0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91',
      abi: [
        {
          inputs: [
            { internalType: 'uint256', name: '_tokenID', type: 'uint256' },
            { internalType: 'address', name: '_claimer', type: 'address' },
          ],
          name: 'claimCoupon',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'claimCoupon',
      args: [1, '0x7Ae1bBCe3557D46313a960C0982637967eF5c1f7'],
      // value: 1,
    }
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
    const resp = await fetch(`https://staging.tria.so/api/v2/user/getAvatarByTriaName?triaNames=${item}`, {
      method: "GET"
    })
    const res = await resp.json()
    console.log("resp", res.response[item]?.[0])
    setBg(res?.response[item]?.[0]?.background)
    setAvatar(res?.response[item]?.[0]?.avatar)
  }

  const sign_message = "Sign in with Tria"

  const callSign = async () => {
    const data = await signMessage({ sign_message, chainName }, undefined, "https://auth-tria.vercel.app")
    console.log('function returned data', data)
  }

  const callWriteContract = async () => {
    ReactGA.event({
      category: 'Mint',
      action: 'Clicked on Mint',
      label: 'Dashboard Page',
    });
    const userAddress = await getAccount();
    console.log("useAddress", userAddress);
    const data = await writeContract({
      chainName: "MUMBAI", contractDetails: {
        contractAddress: '0x9f5033463b31D213462Ce03A81610364aa80Ba14',
        abi: [
          { "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "address", "name": "_claimer", "type": "address" }], "name": "airdropCoupon", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
        ],
        functionName: 'airdropCoupon',
        args: [1, 1, userAddress.evm.address],
      }
    }, undefined, "https://auth-tria.vercel.app", "wss://staging.tria.so")
    console.log('function returned data', data)
  }

  const callSendTransaction = async () => {

    const data = await sendTransaction({
      chainName, contractDetails
    }, undefined, "https://auth-tria.vercel.app", "wss://staging.tria.so")
    console.log('function returned data', data)
  }

  // const decryptMessageFun = async () => {
  //   const data = decrypt({ chainName, encryptedData: decryptMessage });
  //   console.log("encrypted data-->", data);
  // }

  // const encryptMessageFun = async () => {
  //   const data = encrypt({ chainName, data: encryptMessage });
  //   console.log("encrypted data-->", data);
  // }

  const fundTriaWallet = async () => {
    setLoader(true)
    const userAddress = await getAccount();
    try {
      const call = await axios.post('https://staging.tria.so/api/v2/wallet/fundWallet', {
        walletAddress: userAddress?.evm?.address,
        chainName: "MUMBAI",
        origin: "https://demo-tria.vercel.app"
      })
      console.log("fund wallet resp -->", call.data.success)
      if (call?.data?.success === true) {
        setLoader(false)
        setSuccess(true)
      } else {
        setLoader(false)
      }
    } catch (err) {
      console.log(err)
    }
  }


  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
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

  console.log("amount", amount)

  const Logout = async () => {
    console.log("Logut called")
    await disconnect()
    window.location.reload()
  }


  return (
    <>
      <div className="w-full h-screen ">
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
            {/* {windowSize.innerWidth > 400 && <div className="bg-neutral-800 rounded-[49px] border-2 border-neutral-800 justify-center items-center flex">
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
            </div>} */}
          </div>
        </div>
        <img style={{ zIndex: 0 }} className="w-full h-full absolute" src="/icons/528.png" />

        {/* Navbar */}
        <div className={windowSize.innerWidth > 400 ? "relative w-full h-[82px] pl-[63px] pr-20 py-[9px] bg-zinc-500 bg-opacity-10 justify-start items-center justify-between inline-flex" : "w-full relative h-[82px] pl-8 pr-4 py-[9px] bg-zinc-500 bg-opacity-10 justify-start items-center justify-between inline-flex"}>
          <div className=" rounded-xl justify-center items-center gap-2 inline-flex">
            <div className="w-10 h-10 relative">
              <img src="/icons/sky.svg" alt="sky_icon" />
            </div>
            <div className="text-neutral-50 text-lg font-normal font-['Neue Haas Grotesk Display Pro'] ">{logged_user}</div>
          </div>
          <div className={windowSize.innerWidth > 400 ? "p-2 rounded-[79px] justify-end items-center gap-3 inline-flex" : "p-2 rounded-[79px] justify-end items-center gap-0 inline-flex"}>
            <div className="justify-end items-center flex">
              <div className="pr-2 justify-end items-center gap-2 flex">
                {localStorage.getItem('tria.wallet.store') !== null ?
                  <div onClick={() => { localStorage.removeItem("tria.wallet.store"); window.location.reload(); }} className="w-14 hover:text-red-700 cursor-pointer hover:transition duration-200 text-red-500 text-base font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Logout</div>
                  :
                  <div onClick={() => Logout()} className="w-14 hover:text-red-700 cursor-pointer hover:transition duration-200 text-red-500 text-base font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Logout</div>
                }
              </div>
            </div>
            <div style={{ background: bg }} className={`w-12 h-12 justify-center items-center flex rounded-full`}>
              {avatar && <img alt="avatar" className="w-12 h-12 rounded-[32.73px]" src={avatar} />}
            </div>
          </div>
        </div>

        {/* Lower Functional Grid */}

        {windowSize.innerWidth > 1200 ?
          <div className={windowSize.innerWidth > 2000 ? "w-[70vw] grid grid-cols-11 gap-5 " : "w-[100vw] grid grid-cols-11 gap-5 "}>
            <div className="col-span-4 mt-4 ml-10 h-full ">
              <div className="w-full h-[35%] px-5 py-0 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-center gap-5 inline-flex">
                {success === false ? <div className="p-[8.83px] flex-col justify-center items-center gap-2 flex">
                  <div className="text-neutral-50 text-xl font-normal font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight mt-7">Experience Tria's Personalised</div>
                  <div className="text-neutral-50 text-5xl font-medium font-['Neue Haas Grotesk Display Pro'] leading-[67.20px] tracking-wide">Embedded Wallet</div>
                  <div onClick={() => fundTriaWallet()} className="w-1/2 mt-3 mb-10 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                    <div className="justify-center items-center flex">

                      <div className="text-center text-white text-lg  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">
                        {loader === false ?
                          <span>Add Funds</span> :
                          <div class='flex space-x-2 justify-center items-center '>
                            <div class='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                            <div class='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                            <div class='h-2 w-2 bg-white rounded-full animate-bounce'></div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div> :
                  <div>
                    <div className="self-stretch h-[73.67px] p-[8.83px] flex-col justify-center items-center gap-2 flex">
                      <div className="self-stretch text-center mt-10"><span className="text-neutral-50 text-[22px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-relaxed tracking-wide">0.001 MATIC</span><span className="text-neutral-50 text-[22px] font-normal font-['Neue Haas Grotesk Display Pro'] leading-relaxed tracking-wide"> has been sent to your wallet </span></div>
                      <div className="self-stretch text-center text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">{logged_user}</div>
                    </div>
                    <div className="w-full flex justify-center mt-10">
                      <div onClick={() => window.open(`https://mumbai.polygonscan.com/address/${userWalletAddress}`, "_blank")} className="w-1/3 mb-10 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                        <div className="justify-center items-center flex">
                          <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">View Details</div>
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>
              {localStorage.getItem("wagmi.connected") === null ? <div className="w-full mt-3 relative h-[26%] p-4 bg-zinc-500 bg-opacity-10 rounded-[22px] flex-col justify-start items-start gap-5 inline-flex">
                <div className="self-stretch  py-3 flex-col justify-center items-start flex">
                  <div className="self-stretch flex-col justify-center items-start gap-2 flex">
                    <div className="px-2 justify-center items-center inline-flex">
                      <div className="text-center text-white text-opacity-40 text-base font-medium font-['Neue Haas Grotesk Display Pro'] uppercase leading-tight tracking-tight">Customizations</div>
                    </div>
                    <div className="self-stretch justify-start items-center gap-5 inline-flex">
                      <div className="grow shrink basis-0 h-[75px] px-5 py-4 rounded-xl justify-start items-center gap-4 flex">
                        <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
                          <div className="self-stretch text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Wallet color card</div>
                          <div className="self-stretch text-neutral-50 text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-[16.80px] tracking-tight">Choose your card color</div>
                        </div>
                      </div>
                      <div className="rounded-[29.40px] justify-center items-center gap-[14.40px] flex">
                        <div onClick={() => { setWalletColor("#0F52BA"); setReloadFlag(!reloadFlag); }} className={walletColor === "#0F52BA" ? "p-[9.60px] cursor-pointer border rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                          <div className="w-[19.20px] h-[19.20px] bg-blue-800 rounded-xl" />
                        </div>
                        <div onClick={() => { setWalletColor("#FFA800"); setReloadFlag(!reloadFlag); }} className={walletColor === "#FFA800" ? "p-[9.60px] border cursor-pointer rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                          <div className="w-[19.20px] h-[19.20px] bg-amber-500 rounded-xl" />
                        </div>
                        <div onClick={() => { setWalletColor("#B43757"); setReloadFlag(!reloadFlag); }} className={walletColor === "#B43757" ? "p-[9.60px] border cursor-pointer rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                          <div className="w-[19.20px] h-[19.20px] bg-pink-700 rounded-xl" />
                        </div>
                        <div onClick={() => { setWalletColor("#51C878"); setReloadFlag(!reloadFlag); }} className={walletColor === "#51C878" ? "p-[9.60px] border cursor-pointer rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                          <div className="w-[19.20px] h-[19.20px] bg-green-400 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> : null}
              <div className="w-full h-[32%] mt-3 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-center gap-1 inline-flex">
                <div className="self-stretch py-2 justify-center items-center gap-4 inline-flex">
                  <div className="text-neutral-50 text-2xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Terms & Conditions</div>
                </div>
                <div className="self-stretch grow shrink basis-0 px-5 py-3 rounded-[78px] justify-start items-center inline-flex">
                  <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                    {/* <div className="grow shrink basis-0 text-white text-opacity-40 text-base font-medium font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">By approving the sign request, you agree with our <a target="_blank" href="https://www.notion.so/triahq/Tria-Beta-Terms-of-Use-1d7dfaf5a58f4038beecd1a67f963425?pvs=4">Terms & Conditions</a>. See firsthand how our T&C redefine the user experience.</div> */}
                    <div className="grow shrink basis-0 text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">This is a sample message for you to check how the sign message will be displayed in the embedded wallet.</div>
                  </div>
                </div>
                <div onClick={() => callSign()} className="w-1/3 mb-3 mt-2 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                  <div className="justify-center items-center flex">
                    <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Sign</div>
                  </div>
                </div>
              </div>

            </div>
            <div className="col-span-2 h-full mt-4">
              <div className="w-full h-[97%] px-5 pt-4 pb-6 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
                <div className="py-2 justify-center items-center gap-4 inline-flex">
                  <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Mint NFT</div>
                </div>
                <div className="w-full text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">This is an example on Polygon Testnet. Tria supports 100+ blockchains. Speak with the team to discuss more.</div>
                <div className="w-full mt-4 mb-5"><span className="text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Supported NFTs:<br /></span><span className="text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">ERC 721<br />ERC 1155<br />ERC 6551</span></div>
                <div className="rounded-[16.97px] flex-col justify-center items-center flex">
                  <div className="w-[100%] relative">
                    <img className="h-auto max-w-[200px] rounded-[22.48px]" src="https://coffee-usual-coyote-592.mypinata.cloud/ipfs/QmTntuKccRaU7vedr6AU7pPdEJoCQ9KhwwKt5ZaLZ4a5N3" alt="nft_image" />
                    <div className="w-[65.49px] h-[65.49px] p-[10.59px] left-[0px] top-[-0px] absolute justify-center items-center gap-[13.57px] inline-flex">
                      <div className="w-[30.30px] h-[30.30px] pl-[5.89px] pr-[5.90px] pt-[5.75px] pb-1.5 bg-gradient-to-br from-stone-950 to-stone-950 rounded-[34.66px] backdrop-blur-[5.04px] justify-center items-center inline-flex">
                        <div className="w-[20.51px] h-[20.51px] relative flex-col justify-start items-start flex" />
                        <img src="/icons/Polygon.svg" alt="polygon" />
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch  px-[8.43px] py-[16.86px] rounded-[27.15px] justify-center items-center inline-flex">
                    <div className=" justify-center items-center flex">
                      <div className="text-center text-neutral-50 text-opacity-90 text-xl  font-light font-['Neue Haas Grotesk Display Pro'] leading-[30.23px] tracking-wide">Concept #1</div>
                    </div>
                  </div>
                </div>
                <div onClick={() => callWriteContract()} className="w-2/3 mt-6 mb-2 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                  <div className="justify-center items-center flex">
                    <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Mint</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-1 col-span-2">
              <div className="w-full mt-3 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 inline-flex">
                <div className="self-stretch py-0 justify-center items-center gap-4 inline-flex">
                  <div className="text-neutral-50 mt-1 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Send Token</div>
                </div>
                <div className="w-full -mt-2 text-white text-opacity-40 text-sm mb-3 font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Transfer token to any wallet. To test this, you can transfer your Polygon Testnet token to a different existing address.</div>
                <div className="self-stretch flex-col mb-5 justify-center items-center gap-4 flex">
                  <div className="self-stretch h-12 justify-start items-center gap-5 inline-flex">
                    <div className="grow shrink basis-0 self-stretch px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center gap-3 flex">
                      <div className="w-6 h-6 p-[2.40px] bg-violet-600 rounded-2xl backdrop-blur-[3px] flex-col justify-center items-center inline-flex">
                        <img src="/icons/Polygon.svg" alt="fuse_icon" />
                      </div>
                      <div className="grow shrink basis-0 h-[19px] justify-start items-center flex">
                        <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">MUMBAI</div>
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
                        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full text-white focus:outline-none text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-transparent w-full" placeholder="Token Value" />
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch h-12 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                    <div className="justify-start items-center flex">
                      <input value={recepientAddress} onChange={(e) => setrecepientAddress(e.target.value)} className="w-full text-white focus:outline-none bg-transparent text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight" placeholder="Recipient Address" />
                    </div>
                  </div>
                  <div onClick={() => {
                    if (recepientAddress.length > 0) {
                      sendTransaction()
                    }
                  }} className={`cursor-${recepientAddress.length > 0 ? "pointer" : "not-allowed"} w-2/3 mt-6 h-[44px] bg-gradient-to-r from-${recepientAddress.length > 0 ? "violet-400" : "gray-100"} to-indigo-500 rounded-[78px] backdrop-blur-[20px] text-white justify-center items-center inline-flex`}>
                    <div className="justify-center items-center flex">
                      <div className={`text-center text-${recepientAddress.length > 0 ? "white" : "gray-400"} text-lg  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight`}>Send</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="mx-4 mt-3">
            <div className="w-full  px-5 py-0 bg-zinc-500 bg-opacity-5 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-center gap-5 inline-flex">
              {success === false ? <div className="p-[8.83px] flex-col justify-center items-center gap-2 flex">
                <div className="text-neutral-50 text-xl font-normal font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight mt-5">Experience Tria's Personalised</div>
                <div className="text-neutral-50 text-5xl font-medium font-['Neue Haas Grotesk Display Pro'] leading-[67.20px] tracking-wide text-center">Embedded Wallet</div>
                <div onClick={() => fundTriaWallet()} className="w-1/2 mt-3 mb-10 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                  <div className="justify-center items-center flex">

                    <div className="text-center text-white text-lg  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">
                      {loader === false ?
                        <span>Add Funds</span> :
                        <div class='flex space-x-2 justify-center items-center '>
                          <div class='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                          <div class='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                          <div class='h-2 w-2 bg-white rounded-full animate-bounce'></div>
                        </div>
                      }
                    </div>

                  </div>
                </div>
              </div> :
                <div>
                  <div className="self-stretch h-[73.67px] p-[8.83px] flex-col justify-center items-center gap-2 flex">
                    <div className="self-stretch text-center mt-10"><span className="text-neutral-50 text-[22px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-relaxed tracking-wide">0.001 MATIC</span><span className="text-neutral-50 text-[22px] font-normal font-['Neue Haas Grotesk Display Pro'] leading-relaxed tracking-wide"> has been sent to your wallet </span></div>
                    <div className="self-stretch text-center text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">{logged_user}</div>
                  </div>
                  <div className="w-full flex justify-center mt-10">
                    <div onClick={() => window.open(`https://mumbai.polygonscan.com/address/${userWalletAddress}`, "_blank")} className="w-1/2 mt-3 mb-10 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                      <div className="justify-center items-center flex">
                        <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">View Details</div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>

            {localStorage.getItem("wagmi.connected") === null ? <div className="w-full mt-3 relative p-4 bg-zinc-500 bg-opacity-10 rounded-[22px] flex-col justify-start items-start gap-5 inline-flex">
              <div className="self-stretch  py-3 flex-col justify-center items-start flex">
                <div className="self-stretch flex-col justify-center items-start gap-2 flex">
                  <div className="px-2 justify-center items-center inline-flex">
                    <div className="text-center text-white text-opacity-40 text-base font-medium font-['Neue Haas Grotesk Display Pro'] uppercase leading-tight tracking-tight">Customizations</div>
                  </div>
                  <div className="self-stretch justify-start items-center ">
                    <div className="grow shrink basis-0 h-[75px] px-5 py-4 rounded-xl justify-start items-center gap-4 flex">
                      <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
                        <div className="self-stretch text-neutral-50 text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Wallet color card</div>
                        <div className="self-stretch text-neutral-50 text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-[16.80px] tracking-tight">Choose your card color</div>
                      </div>
                    </div>
                    <div className="rounded-[29.40px] justify-center items-center gap-[14.40px] flex">
                      <div onClick={() => { setWalletColor("#0F52BA"); setReloadFlag(!reloadFlag); }} className={walletColor === "#0F52BA" ? "p-[9.60px] cursor-pointer border rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                        <div className="w-[19.20px] h-[19.20px] bg-blue-800 rounded-xl" />
                      </div>
                      <div onClick={() => { setWalletColor("#FFA800"); setReloadFlag(!reloadFlag); }} className={walletColor === "#FFA800" ? "p-[9.60px] border cursor-pointer rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                        <div className="w-[19.20px] h-[19.20px] bg-amber-500 rounded-xl" />
                      </div>
                      <div onClick={() => { setWalletColor("#B43757"); setReloadFlag(!reloadFlag); }} className={walletColor === "#B43757" ? "p-[9.60px] border cursor-pointer rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                        <div className="w-[19.20px] h-[19.20px] bg-pink-700 rounded-xl" />
                      </div>
                      <div onClick={() => { setWalletColor("#51C878"); setReloadFlag(!reloadFlag); }} className={walletColor === "#51C878" ? "p-[9.60px] border cursor-pointer rounded-[34.80px] justify-center items-center flex" : "p-[9.60px] cursor-pointer rounded-[34.80px] justify-center items-center flex"}>
                        <div className="w-[19.20px] h-[19.20px] bg-green-400 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> : null}

            <div className="w-full mt-3 mb-3 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-start gap-5 inline-flex">
              <div className="self-stretch py-0 justify-center items-center gap-4 inline-flex">
                <div className="text-neutral-50 mt-1 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Send Token</div>
              </div>
              <div className="w-full -mt-2 text-white text-opacity-40 text-sm mb-3 font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Transfer token to any wallet. To test this, you can transfer your Polygon Testnet token to a different existing address.</div>
              <div className="self-stretch flex-col mb-5 justify-center items-center gap-4 flex">
                <div className="self-stretch h-12 justify-start items-center gap-5 inline-flex">
                  <div className="grow shrink basis-0 self-stretch px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center gap-3 flex">
                    <div className="w-6 h-6 p-[2.40px] bg-violet-600 rounded-2xl backdrop-blur-[3px] flex-col justify-center items-center inline-flex">
                      <img src="/icons/Polygon.svg" alt="fuse_icon" />
                    </div>
                    <div className="grow shrink basis-0 h-[19px] justify-start items-center flex">
                      <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">MUMBAI</div>
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
                      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full text-white focus:outline-none text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-transparent w-full" placeholder="Token Value" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-12 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                  <div className="justify-start items-center flex">
                    <input value={recepientAddress} onChange={(e) => setrecepientAddress(e.target.value)} className="w-full text-white focus:outline-none bg-transparent text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight" placeholder="Recipient Address" />
                  </div>
                </div>
                <div onClick={() => {
                  if (recepientAddress.length > 0) {
                    sendTransaction()
                  }
                }} className={`cursor-${recepientAddress.length > 0 ? "pointer" : "not-allowed"} w-2/3 mt-6 h-[44px] bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] text-white justify-center items-center inline-flex`}>
                  <div className="justify-center items-center flex">
                    <div className={`text-center text-${recepientAddress.length > 0 ? "white" : "gray-400"} text-lg  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight`}>Send</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mb-3 px-5 pt-4 pb-6 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
              <div className="py-2 justify-center items-center gap-4 inline-flex">
                <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Mint NFT</div>
              </div>
              <div className="w-full text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">This is an example on Polygon Testnet. Tria supports 100+ blockchains. Speak with the team to discuss more.</div>
              <div className="w-full mt-4 mb-5"><span className="text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Supported NFTs:<br /></span><span className="text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">ERC 721<br />ERC 1155<br />ERC 6551</span></div>
              <div className="rounded-[16.97px] flex-col justify-center items-center flex">
                <div className="w-[100%] relative">
                  <img className="h-auto max-w-[200px] rounded-[22.48px]" src="https://coffee-usual-coyote-592.mypinata.cloud/ipfs/QmTntuKccRaU7vedr6AU7pPdEJoCQ9KhwwKt5ZaLZ4a5N3" alt="nft_image" />
                  <div className="w-[65.49px] h-[65.49px] p-[10.59px] left-[0px] top-[-0px] absolute justify-center items-center gap-[13.57px] inline-flex">
                    <div className="w-[30.30px] h-[30.30px] pl-[5.89px] pr-[5.90px] pt-[5.75px] pb-1.5 bg-gradient-to-br from-stone-950 to-stone-950 rounded-[34.66px] backdrop-blur-[5.04px] justify-center items-center inline-flex">
                      <div className="w-[20.51px] h-[20.51px] relative flex-col justify-start items-start flex" />
                      <img src="/icons/Polygon.svg" alt="polygon" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch  px-[8.43px] py-[16.86px] rounded-[27.15px] justify-center items-center inline-flex">
                  <div className=" justify-center items-center flex">
                    <div className="text-center text-neutral-50 text-opacity-90 text-xl  font-light font-['Neue Haas Grotesk Display Pro'] leading-[30.23px] tracking-wide">Concept #1</div>
                  </div>
                </div>
              </div>
              <div onClick={() => callWriteContract()} className="w-2/3 mt-6 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                <div className="justify-center items-center flex">
                  <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Mint</div>
                </div>
              </div>
            </div>
            <div className="w-full mt-3 px-5 py-4 bg-zinc-500 bg-opacity-10 rounded-[22px] backdrop-blur-[100px] flex-col justify-center items-center gap-1 inline-flex">
              <div className="self-stretch py-2 justify-center items-center gap-4 inline-flex">
                <div className="text-neutral-50 text-2xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Terms & Conditions</div>
              </div>
              <div className="self-stretch grow shrink basis-0 px-5 py-3 rounded-[78px] justify-start items-center inline-flex">
                <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                  {/* <div className="grow shrink basis-0 text-white text-opacity-40 text-base font-medium font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">By approving the sign request, you agree with our <a target="_blank" href="https://www.notion.so/triahq/Tria-Beta-Terms-of-Use-1d7dfaf5a58f4038beecd1a67f963425?pvs=4">Terms & Conditions</a>. See firsthand how our T&C redefine the user experience.</div> */}
                  <div className="grow shrink basis-0 text-white text-opacity-40 text-sm font-base font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">This is a sample message for you to check how the sign message will be displayed in the embedded wallet.</div>
                </div>
              </div>
              <div onClick={() => callSign()} className="w-1/3 mt-6 h-[44px] cursor-pointer bg-gradient-to-r from-violet-400 to-indigo-500 rounded-[78px] backdrop-blur-[20px] justify-center items-center inline-flex">
                <div className="justify-center items-center flex">
                  <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Sign</div>
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
