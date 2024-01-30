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
  readContract,
} from "@tria-sdk/connect-staging";
import axios from "axios";
import ReactGA from "react-ga";
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
  const { setWalletColor, walletColor, setReloadFlag, reloadFlag, setLaunchTria, launchTria, clicked, setClicked } = useContext(Context)

  const [openLogout, setOpenLogout] = useState(false)

  const [clickedTap, setClickedTap] = useState(false)

  const [contractDetails, setContractDetails] = useState({
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
    args: [1, "0x7Ae1bBCe3557D46313a960C0982637967eF5c1f7"],
    // value: 1,
  });

  const [chainName, setChainName] = useState("MUMBAI");
  const [tokenAddress, setTokenAddress] = useState("");

  const [nftData, setNftData] = useState({});

  //const { disconnect } = useDisconnect()

  useEffect(() => {
    const item = localStorage.getItem("tria.wallet.store");
    console.log(item);
    ReactGA.pageview("/dashboard");
    getUserWallet();
    //callReadContract();
  }, []);

  const getUserWallet = async () => {
    const user = await getAccount();
    setUserWalletAddress(user.evm.address);
  };

  const callReadContract = async () => {
    const tokenId = "2"
    const readContractRes = await readContract({
      chainName: "MUMBAI",
      contractDetails: {
        contractAddress: "0x9f5033463b31D213462Ce03A81610364aa80Ba14",
        abi: [
          {
            inputs: [
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "uri",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "uri",
        args: [tokenId],
      },
    });
    console.log("resContract", readContractRes);
    const readJson = await axios.get(readContractRes);
    console.log("jsonresponse --> ", readJson?.data);
    setNftData(readJson?.data);
  };

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
  } = useSignMessage(
    {
      message,
      chainName,
    },
    undefined,
    "https://auth-tria.vercel.app"
  );

  const { data, sendTransaction } = useSendTransaction(
    {
      amount,
      senderAddress,
      recepientAddress,
      chainName,
      tokenAddress,
    },
    undefined,
    "https://auth-tria.vercel.app"
  );

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
          name: "claimCoupon",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: "claimCoupon",
      args: [1, "0x7Ae1bBCe3557D46313a960C0982637967eF5c1f7"],
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

  const logged_user = JSON.parse(
    localStorage.getItem("tria.wallet.store")
  )?.triaName;

  const [bg, setBg] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const logged_user = JSON.parse(
      localStorage.getItem("tria.wallet.store")
    )?.triaName;
    getTriaImage(logged_user);
  }, []);

  const getTriaImage = async (item) => {
    const resp = await fetch(
      `https://staging.tria.so/api/v2/user/getAvatarByTriaName?triaNames=${item}`,
      {
        method: "GET",
      }
    );
    const res = await resp.json();
    console.log("resp", res.response[item]?.[0]);
    setBg(res?.response[item]?.[0]?.background);
    setAvatar(res?.response[item]?.[0]?.avatar);
  };

  const sign_message = "Sign in with Tria";

  const callSign = async () => {
    const data = await signMessage(
      { sign_message, chainName },
      undefined,
      "https://auth-tria.vercel.app"
    );
    console.log("function returned data", data);
  };

  const callWriteContract = async () => {
    ReactGA.event({
      category: "Mint",
      action: "Clicked on Mint",
      label: "Dashboard Page",
    });
    const userAddress = await getAccount();
    console.log("useAddress", userAddress);
    const data = await writeContract(
      {
        chainName: "MUMBAI",
        contractDetails: {
          contractAddress: "0x9f5033463b31D213462Ce03A81610364aa80Ba14",
          abi: [
            {
              inputs: [
                { internalType: "uint256", name: "_tokenId", type: "uint256" },
                { internalType: "uint256", name: "_amount", type: "uint256" },
                { internalType: "address", name: "_claimer", type: "address" },
              ],
              name: "airdropCoupon",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "airdropCoupon",
          args: [2, 1, userAddress.evm.address],
        },
      },
      undefined,
      "https://auth-tria.vercel.app",
      "wss://staging.tria.so"
    );
    console.log("function returned data", data);
  };

  const callSendTransaction = async () => {
    const data = await sendTransaction(
      {
        chainName,
        contractDetails,
      },
      undefined,
      "https://auth-tria.vercel.app",
      "wss://staging.tria.so"
    );
    console.log("function returned data", data);
  };

  // const decryptMessageFun = async () => {
  //   const data = decrypt({ chainName, encryptedData: decryptMessage });
  //   console.log("encrypted data-->", data);
  // }

  // const encryptMessageFun = async () => {
  //   const data = encrypt({ chainName, data: encryptMessage });
  //   console.log("encrypted data-->", data);
  // }

  const fundTriaWallet = async () => {
    setLoader(true);
    const userAddress = await getAccount();
    try {
      const call = await axios.post(
        "https://staging.tria.so/api/v2/wallet/fundWallet",
        {
          walletAddress: userAddress?.evm?.address,
          chainName: "MUMBAI",
          origin: "https://demo-tria.vercel.app",
        }
      );
      console.log("fund wallet resp -->", call.data.success);
      if (call?.data?.success === true) {
        setTimeout(() => {
          setLoader(false)
          setSuccess(true)
        }, 2000)

      } else {
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  console.log("amount", amount);

  const Logout = async () => {
    console.log("Logut called");
    await disconnect();
  };

  //Reveal and fade function

  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    console.log("reveal length -->", reveals.length)

    for (var i = 0; i < reveals.length; i++) {
      var windowWidth = window.innerWidth;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 10;
      console.log("ele top-->", elementTop)
      console.log("width-->", windowWidth)
      if (elementTop < windowWidth - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  window.addEventListener("scroll", reveal);

  // var cards = document.querySelectorAll('.flip-card-inner');


  // [...cards].forEach((card) => {
  //   card.addEventListener('click', function () {
  //     console.log("card-classList", card.classList.value)
  //     if (card.classList.value === "flip-card-inner is-flipped") {
  //       card.classList.remove('is-flipped');
  //     } else {
  //       card.classList.add('is-flipped');
  //     }
  //   });
  // });


  const [toggleState, setToggleState] = useState(false)

  const toggleClasslist = () => {
    setToggleState(!toggleState)
  }

  //Mobile carousels
  const [carouselOne, setCarouselOne] = useState(0)
  const [carouselTwo, setCarouselTwo] = useState(0)




  return (
    <>
      <div className="w-full h-screen ">

        {/* Topbar */}
        <div style={{ zIndex: 9999 }} className={`w-full h-20 px-${windowSize.innerWidth < 500 ? "5" : "10"} py-4 ${windowSize.innerWidth < 900 ? "sticky" : "fixed"} top-0 bg-neutral-900 border-b border-stone-950 justify-start items-center gap-4 inline-flex`}>
          <div className="grow shrink basis-0 h-10 justify-between items-center flex">
            <div className=" justify-center items-center gap-2.5 flex">
              <div className="h-7 relative">
                <div className="">
                  {windowSize.innerWidth > 400 ? <img src="/icons/new_logo_demo.svg" alt="tria_logo" /> : <img src="/icons/tria_logo_mobile.svg" alt="tria_logo" />}
                </div>
              </div>
              {/* <div className="px-2 py-1 rounded-[69px] border border-violet-400 justify-center items-center gap-2.5 flex">
                <div className="text-center text-violet-400 text-[10px] font-normal font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">Demo</div>
              </div> */}
            </div>
            {windowSize.innerWidth > 500 ?
              <div onClick={() => setOpenLogout(!openLogout)} className="flex gap-4 cursor-pointer hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] items-center ">
                <div className="text-neutral-50 text-md font-normal font-['Neue Haas Grotesk Display Pro'] ">{logged_user}</div>
                <div style={{ background: bg }} className={`w-10 h-10 justify-center items-center flex rounded-full`}>
                  {avatar && <img alt="avatar" className="w-10 h-10 rounded-[32.73px]" src={avatar} />}
                </div>
              </div> :
              <div onClick={() => setOpenLogout(!openLogout)} className="flex gap-2 items-center">
                <div className="text-neutral-50 text-sm md:text-md font-normal font-['Neue Haas Grotesk Display Pro'] ">{logged_user}</div>
                <div style={{ background: bg }} className={`w-8 h-8  justify-center items-center flex rounded-full`}>
                  {avatar && <img alt="avatar" className="w-8 h-8 rounded-[32.73px]" src={avatar} />}
                </div>
              </div>}
          </div>
        </div>

        {openLogout ?
          <div style={{ zIndex: 9999 }} className="absolute md:right-10 right-4 top-20">
            <div onClick={() => Logout()} className="w-[194px] cursor-pointer relative h-14 px-6 py-3 bg-zinc-500 bg-opacity-10 rounded-xl border-opacity-10 backdrop-blur-[100px] flex-col justify-center items-center gap-[52px] inline-flex">
              <div className="self-stretch py-1 justify-start items-center inline-flex">
                <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                  <div className="grow shrink basis-0 text-red-400 text-base font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Logout</div>
                </div>
                <div className="w-6 h-6 justify-center items-center flex">
                  <div className="w-6 h-6 relative">
                    <img src="/icons/logout.svg" />
                  </div>
                </div>
              </div>
            </div>
          </div> : null}

        {/* Lower Functional Grid */}
        {window.innerWidth > 1000 ?
          <div className={clicked === true ? "blur-background " : ""}>
            <div className="w-[140vw] 3xl:w-[90vw] 4xl:w-[90vw] md:grid md:grid-cols-12 gap-5 mt-20 ">
              <div className="md:col-span-4 mt-10 ml-10">
                <div className="w-full h-[45vh] 3xl:h-[50vh] 4xl:h-[50vh] relative rounded-xl ">
                  <div className="w-full h-full overflow-hidden px-5 py-4 group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] left-0 top-0 absolute bg-transparent rounded-xl border border-neutral-800 backdrop-blur-[100px] flex-col justify-center items-center gap-[34px] inline-flex">

                    {walletColor === "#FF4E17" ? <img className="absolute top-0 rounded-xl left-0 w-[60%] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6  " src="/icons/ellipse.svg" alt="ellipse" /> : null}
                    {walletColor === "#7D40FF" ? <img className="absolute top-0 rounded-xl left-0 w-[60%] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6" src="/icons/ellipse_purple.svg" alt="ellipse" /> : null}
                    {walletColor === "#D7FF01" ? <img className="absolute top-0 rounded-xl left-0 w-[60%] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6" src="/icons/ellipse_green.svg" alt="ellipse" /> : null}
                    {walletColor === "#FF249D" ? <img className="absolute top-0 rounded-xl left-0 w-[60%] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6" src="/icons/ellipse_pink.svg" alt="ellipse" /> : null}

                    <div className="p-[8.83px] flex-col justify-center items-center flex ">
                      <div className="text-white text-opacity-80 text-lg font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Experience Tria’s Personalised</div>
                      <div className="bg-gradient-to-b from-white via-white to-indigo-[rgba(250, 250, 250, 0.46)] inline-block text-transparent bg-clip-text text-5xl font-bold font-['Neue Haas Grotesk Display Pro'] leading-[79.20px] -mt-1">Embedded Wallet</div>
                      <div className="w-full h-12 px-24 text-center text-white text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Personalized, user-focused journeys built with Tria's exclusive SDKs. Elevate beyond social onboarding, smart-accounts, and programmable TXs. </div>
                    </div>
                  </div>
                </div>
                <div className="w-full justify-between items-start gap-5 flex mt-5 ">

                  <div className="w-full h-full relative group rounded-xl hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95]">
                    <div className="w-full h-[35vh] overflow-hidden group p-7 left-0 top-0 absolute rounded-xl border border-stone-800 border-solid backdrop-blur-[100px] flex-col justify-start items-start gap-[52px] inline-flex">
                      {walletColor === "#FF4E17" ? <img className="absolute left-0 w-full right-0 bottom-0 h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-x-6 group-hover:translate-y-6" src="/icons/second_card.svg" alt="ellipse" /> : null}
                      {walletColor === "#7D40FF" ? <img className="absolute left-0 w-full right-0 bottom-0 h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-x-6 group-hover:translate-y-6" src="/icons/second_card_purple.svg" alt="ellipse" /> : null}
                      {walletColor === "#D7FF01" ? <img className="absolute left-0 w-full right-0 bottom-0 h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-x-6 group-hover:translate-y-6" src="/icons/second_card_green.svg" alt="ellipse" /> : null}
                      {walletColor === "#FF249D" ? <img className="absolute left-0 w-full right-0 bottom-0 h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-x-6 group-hover:translate-y-6" src="/icons/second_card_pink.svg" alt="ellipse" /> : null}
                      <div className="text-xl md:text-[28px] grow shrink basis-0">
                        <span className="text-white text-opacity-90  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Explore</span>
                        <span className="text-white t font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] "> </span>
                        {walletColor === "#FF4E17" ? <span className="orange_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Tria’s embedded wallet </span> : null}
                        {walletColor === "#7D40FF" ? <span className="purple_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Tria’s embedded wallet </span> : null}
                        {walletColor === "#D7FF01" ? <span className="green_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Tria’s embedded wallet </span> : null}
                        {walletColor === "#FF249D" ? <span className="pink_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Tria’s embedded wallet </span> : null}
                        <span className="text-white text-opacity-90 relative font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">in real time. Tailor and construct the wallet to match your app.</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "border h-[35vh] group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] rounded-xl  border-stone-800 border-solid p-8 flex flex-col items-center justify-between self-stretch shrink-0 w-1/2 relative overflow-hidden "

                    }
                    style={{
                      background:
                        "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                    }}
                  >
                    <div className="">
                      <div className="">
                        <div className="pt-0 pb-2 flex flex-row gap-4 items-center justify-center self-stretch shrink-0 relative">
                          <div className="text-[#fafafa] flex flex-col gap-3 text-left font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-xl leading-[120%] font-semibold relative flex items-center justify-start">
                            <div>
                              <img className="h-5 w-5" src="/icons/add-square.svg" alt="add-square" />
                            </div>
                            Add Funds{" "}
                          </div>
                        </div>
                        <div className="pt-0 pb-1 flex flex-row gap-0 items-center justify-start self-stretch shrink-0 relative overflow-hidden">
                          <div className="flex flex-row gap-0 items-center justify-start self-stretch flex-1 relative">
                            <div className="text-[rgba(255,255,255,0.40)] text-center font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-[13px] leading-[135%] font-normal relative flex-1 flex items-center justify-center">
                              To start exploring, you would require some funds. Click the
                              button below to receive Matic on Polygon Mumbai testnet.{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!success ?
                      <>
                        {!loader ?
                          <div
                            className="rounded-[78px] bg-white text-black cursor-pointer px-6 py-2 w-[150px] mt-6 flex flex-row gap-0 items-center justify-center shrink-0  relative overflow-hidden"

                            onClick={() => fundTriaWallet()}
                          >
                            <div className="flex flex-row gap-0 items-center justify-center shrink-0 relative">
                              <div className="text-black text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                                Add funds{" "}
                              </div>
                            </div>
                          </div> :
                          <div className={`relative px-[2px] py-[2px] w-[150px] bg-animation-${walletColor === "#FF4E17" ? "orange" : walletColor === "#7D40FF" ? "purple" : walletColor === "#D7FF01" ? "green" : "pink"}`}>
                            <div className=" rounded-[78px] z-50 relative bg-black text-white  p-2">
                              <div>
                                <div className="text-center flex justify-center text-neutral-50 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-[16.80px] ">Loading...</div>
                              </div>
                            </div>
                          </div>}
                      </>
                      :
                      <div>
                        <div className="pt-1 pb-1 flex flex-row gap-0 mt-3   items-center justify-start self-stretch shrink-0 relative overflow-hidden">
                          <div className="flex flex-col gap-0 items-center justify-start self-stretch flex-1 relative">
                            <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[135%] font-normal relative flex-1 flex items-center justify-start">
                              Sent 0.001 MUMBAI MATIC!
                            </div>
                            <div onClick={() => { window.open(`https://mumbai.polygonscan.com/address/${userWalletAddress}`, "_blank"); setSuccess(false) }} className="text-white cursor-pointer underline text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[135%] font-normal relative flex-1 flex items-center justify-start">
                              View details
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>

              </div>
              <div className="col-span-3 mt-10">
                <div className={
                  "rounded-xl group hover:transition duration-[500ms] h-[23vh] hover:duration-[500ms] hover:scale-[0.95] border-solid border-stone-800 border-[0.7px] px-9 py-2 flex flex-col gap-5 items-start justify-start shrink-0 relative w-full "
                }
                  style={{
                    background:
                      "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                  }}
                >
                  <div className="flex flex-col self-stretch shrink-0 relative ">
                    <div className="flex items-center justify-between shrink-0 relative ">
                      <div className="rounded-xl pt-4 pb-4 flex  flex-row gap-4  items-center justify-start shrink-0 relative overflow-hidden">
                        <div className="flex flex-col gap-1 items-start justify-center flex-1 relative">
                          <div className="text-[#ffffff] text-left font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-xl leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Theme{" "}
                          </div>
                          <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Light or dark{" "}
                          </div>
                        </div>
                      </div>
                      <div className="bg-[rgba(48,48,48,0.20)] cursor-not-allowed rounded-[14px] border-solid border-[transparent] border-2 flex flex-row gap-0 items-center justify-center shrink-0 relative">
                        <div className="rounded-2xl pt-2 pr-4 pb-2 pl-4 flex flex-row gap-0 items-center justify-center shrink-0 relative overflow-hidden">
                          <div className="shrink-0 w-6 h-6 relative">
                            <svg
                              className="h-[auto] absolute left-0 top-0 overflow-visible"
                              style={{}}
                              width="24"
                              height="25"
                              viewBox="0 0 24 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 19.5C15.866 19.5 19 16.366 19 12.5C19 8.63401 15.866 5.5 12 5.5C8.13401 5.5 5 8.63401 5 12.5C5 16.366 8.13401 19.5 12 19.5Z"
                                fill="#3C3C3C"
                              />
                              <path
                                d="M12 23.46C11.45 23.46 11 23.05 11 22.5V22.42C11 21.87 11.45 21.42 12 21.42C12.55 21.42 13 21.87 13 22.42C13 22.97 12.55 23.46 12 23.46ZM19.14 20.64C18.88 20.64 18.63 20.54 18.43 20.35L18.3 20.22C17.91 19.83 17.91 19.2 18.3 18.81C18.69 18.42 19.32 18.42 19.71 18.81L19.84 18.94C20.23 19.33 20.23 19.96 19.84 20.35C19.65 20.54 19.4 20.64 19.14 20.64ZM4.86 20.64C4.6 20.64 4.35 20.54 4.15 20.35C3.76 19.96 3.76 19.33 4.15 18.94L4.28 18.81C4.67 18.42 5.3 18.42 5.69 18.81C6.08 19.2 6.08 19.83 5.69 20.22L5.56 20.35C5.37 20.54 5.11 20.64 4.86 20.64ZM22 13.5H21.92C21.37 13.5 20.92 13.05 20.92 12.5C20.92 11.95 21.37 11.5 21.92 11.5C22.47 11.5 22.96 11.95 22.96 12.5C22.96 13.05 22.55 13.5 22 13.5ZM2.08 13.5H2C1.45 13.5 1 13.05 1 12.5C1 11.95 1.45 11.5 2 11.5C2.55 11.5 3.04 11.95 3.04 12.5C3.04 13.05 2.63 13.5 2.08 13.5ZM19.01 6.49C18.75 6.49 18.5 6.39 18.3 6.2C17.91 5.81 17.91 5.18 18.3 4.79L18.43 4.66C18.82 4.27 19.45 4.27 19.84 4.66C20.23 5.05 20.23 5.68 19.84 6.07L19.71 6.2C19.52 6.39 19.27 6.49 19.01 6.49ZM4.99 6.49C4.73 6.49 4.48 6.39 4.28 6.2L4.15 6.06C3.76 5.67 3.76 5.04 4.15 4.65C4.54 4.26 5.17 4.26 5.56 4.65L5.69 4.78C6.08 5.17 6.08 5.8 5.69 6.19C5.5 6.39 5.24 6.49 4.99 6.49ZM12 3.54C11.45 3.54 11 3.13 11 2.58V2.5C11 1.95 11.45 1.5 12 1.5C12.55 1.5 13 1.95 13 2.5C13 3.05 12.55 3.54 12 3.54Z"
                                fill="#3C3C3C"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          className="rounded-[14px] pt-2 pr-4 pb-2 pl-4 flex flex-row gap-0 items-center justify-center shrink-0 relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(117.03deg, rgba(28, 30, 79, 1.00) 0%,rgba(17, 25, 52, 1.00) 100%)",
                          }}
                        >
                          <div className="shrink-0 w-6 h-6 relative">
                            <svg
                              className="h-[auto] absolute left-0 top-0 overflow-visible"
                              style={{}}
                              width="24"
                              height="25"
                              viewBox="0 0 24 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21.5307 16.4304C21.3707 16.1604 20.9207 15.7404 19.8007 15.9404C19.1807 16.0504 18.5507 16.1004 17.9207 16.0704C15.5907 15.9704 13.4807 14.9004 12.0107 13.2504C10.7107 11.8004 9.91068 9.91036 9.90068 7.87036C9.90068 6.73036 10.1207 5.63036 10.5707 4.59036C11.0107 3.58036 10.7007 3.05036 10.4807 2.83036C10.2507 2.60036 9.71068 2.28036 8.65068 2.72036C4.56068 4.44036 2.03068 8.54036 2.33068 12.9304C2.63068 17.0604 5.53068 20.5904 9.37068 21.9204C10.2907 22.2404 11.2607 22.4304 12.2607 22.4704C12.4207 22.4804 12.5807 22.4904 12.7407 22.4904C16.0907 22.4904 19.2307 20.9104 21.2107 18.2204C21.8807 17.2904 21.7007 16.7004 21.5307 16.4304Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between relative shrink-0 ">
                      <div className="rounded-xl pt-4 pb-4 flex flex-row gap-4 items-center justify-start shrink-0  relative overflow-hidden">
                        <div className="flex flex-col gap-1 items-start justify-center flex-1 relative">
                          <div className="text-[#ffffff] text-left font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-xl leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Wallet card{" "}
                          </div>
                          <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Customizable in SDK{" "}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-7">
                        <div onClick={() => {
                          setWalletColor("#7D40FF");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#7D40FF] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#7D40FF" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#7D40FF] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                        <div onClick={() => {
                          setWalletColor("#FF4E17");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#FF4E17] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#FF4E17" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#FF4E17] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                        <div onClick={() => {
                          setWalletColor("#D7FF01");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#D7FF01] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#D7FF01" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#D7FF01] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                        <div onClick={() => {
                          setWalletColor("#FF249D");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#FF249D] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#FF249D" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#FF249D] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 w-full h-[27vh]">
                  <div className="grid grid-cols-6 gap-4 w-full h-full  ">
                    <div className="flex flex-col gap-5 col-span-4 ">
                      <div onClick={() => window.open("https://www.youtube.com/watch?v=kPqTHt9v48A", "_blank")} className="w-full cursor-pointer h-1/2 relative rounded-xl group overflow-hidden hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95]">
                        <div className="w-full h-full group flex items-center py-4 left-0 top-0 absolute rounded-xl border border-stone-800 border-solid  ">
                          {walletColor === "#FF4E17" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6" src="/icons/ring_orange.svg" alt="ellipse" /> : null}
                          {walletColor === "#7D40FF" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6" src="/icons/ring_purple.svg" alt="ellipse" /> : null}
                          {walletColor === "#D7FF01" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6" src="/icons/ring_green.svg" alt="ellipse" /> : null}
                          {walletColor === "#FF249D" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-x-6 group-hover:-translate-y-6" src="/icons/ring_pink.svg" alt="ellipse" /> : null}
                          <div className="text-xl md:text-3xl ml-[2vw] grow shrink basis-0">
                            <span className="text-white text-opacity-90 relative font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">One name,<br></br></span>
                            <span className="text-white relative font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">all things </span>
                            {walletColor === "#FF4E17" ? <span className="orange_gradient_text font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3</span> : null}
                            {walletColor === "#7D40FF" ? <span className="purple_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3 </span> : null}
                            {walletColor === "#D7FF01" ? <span className="green_gradient_text   font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3 </span> : null}
                            {walletColor === "#FF249D" ? <span className="pink_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3 </span> : null}

                          </div>
                        </div>
                      </div>
                      <div style={{
                        background:
                          "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                      }} className="w-full h-1/2 group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] p-4 bg-opacity-70 rounded-xl border border-stone-800 flex-col justify-between items-center inline-flex">
                        <div className="w-full h-full flex justify-center items-center">
                          <div className="flex gap-2 items-start">
                            <img src="/icons/danger.svg" />
                            <div className=" text-white text-opacity-80 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] ">This demo is on Polygon Mumbai testnet, some features might be restricted.</div>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="w-full col-span-2">

                      <div className="w-full h-full relative group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] rounded-xl border border-stone-800 overflow-hidden ">
                        {walletColor === "#FF4E17" ? <img className=" absolute w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms]  group-hover:-translate-y-6" src="/icons/person_card_orange.svg" alt="person" /> : null}
                        {walletColor === "#7D40FF" ? <img className=" absolute w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms]  group-hover:-translate-y-6 " src="/icons/person_card_purple.svg" alt="person" /> : null}
                        {walletColor === "#D7FF01" ? <img className=" absolute w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms]  group-hover:-translate-y-6" src="/icons/person_card_green.svg" alt="person" /> : null}
                        {walletColor === "#FF249D" ? <img className=" absolute w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms]  group-hover:-translate-y-6" src="/icons/person_card_pink.svg" alt="person" /> : null}
                        {/* <div className="w-[298.50px] h-[387.84px] left-[20px] top-[33.38px] absolute origin-top-left rotate-[-64.04deg] opacity-80 bg-orange-600 rounded-full blur-[37.67px]" /> */}
                        <img className="w-[64.95px] h-[64.95px] left-[1vw] top-[1vh] absolute rounded-full group-hover:transition duration-[500ms] group-hover:duration-[500ms]  group-hover:translate-x-2" src="/icons/person_2.svg" alt="person" />
                        <div className="h-[123.79px] left-[-16px] top-[18px] absolute">
                          <div className="w-[137.59px] h-[33.83px] left-[2.92px] top-[7vh] absolute  origin-top-left rotate-[4.96deg]  flex-col justify-center items-start gap-[3.15px] inline-flex">
                            <div className="px-[15.74px] py-[9.44px] bg-sky-300 bg-opacity-50 rounded-[9.44px] justify-start items-center inline-flex">
                              <div className="justify-start items-center flex">
                                <div className="text-neutral-50 text-xs font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[15.11px] tracking-tight">papabera@tria</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-[79.72px] h-[98.38px] left-[5vw] top-[17vh] absolute">
                          <img className="w-[55.95px] h-[55.95px] left-[1.73px] top-[1vh] absolute rounded-full " src="/icons/person.svg" alt="person" />
                          <div className="w-[77.30px] h-[27.93px] left-0 top-[70.59px] absolute origin-top-left rotate-[-5.79deg] backdrop-blur-[7.79px] flex-col justify-center items-start gap-[2.60px] inline-flex">
                            <div className="px-[12.99px] py-[7.79px] bg-orange-300 bg-opacity-70 rounded-lg justify-start items-center inline-flex">
                              <div className="justify-start items-center flex">
                                <div className="text-neutral-50 text-[10.39px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-3 tracking-tight">katie@tria</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-[40.74px] h-[40.74px] pl-[12.67px] pr-[12.21px] pt-[7.50px] pb-[7.44px] left-[110.03px] top-[90px] absolute origin-top-left rotate-[9.90deg] bg-indigo-500 rounded-[55.86px] backdrop-blur-[4.97px] justify-center items-center inline-flex">
                          <div className="grow shrink basis-0 self-stretch pl-[0.57px] pr-[1.77px] flex-col justify-center items-center inline-flex">
                            <img src="/icons/eth.svg" alt="eth" />
                          </div>
                        </div>
                        <div className="w-[36.77px] h-[36.77px] -left-[1vw] bottom-[1vh] absolute origin-top-left rotate-[-17.48deg] bg-red-600 rounded-[45.28px] backdrop-blur-[4.60px] justify-center items-center flex">
                          <img className="w-[44.12px] h-[45.12px] pl-2" src="/icons/optimism.svg" />
                        </div>
                        <div className="w-[45.76px] h-[45.76px] left-[1vw] top-[15vh] group-hover:transition duration-[500ms] group-hover:duration-[500ms]  group-hover:translate-y-1 absolute bg-violet-600 rounded-[33.84px] backdrop-blur-[6.34px] flex-col justify-center items-center inline-flex">
                          <img className="h-8 w-8" src="/icons/Polygon.svg" alt="polygon_logo" />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                  }}
                  className="w-full mt-5 p-2 3xl:h-[33vh] h-[28vh] group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] bg-opacity-70 rounded-xl border border-stone-800 backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
                  <div className="">
                    <div className="">
                      <div className="flex justify-center">
                        <div className="self-stretch pt-4 flex flex-col gap-2 items-center">
                          <div><img className="h-5 w-5" src="/icons/pen-add.svg" alt="pen" /></div>
                          <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] tracking-wide">Sign Message</div>
                        </div>
                      </div>
                      <div className="py-0 px-10 justify-start items-center mt-1">
                        <div className=" justify-center items-center flex  ">
                          <div className="text-white text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight text-center">Sample wallet interaction of a message signature. To test a transaction signature, mint a Tria Concept NFT from the right.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => callSign()}
                    className="rounded-[78px] cursor-pointer px-6 py-2 w-[150px] flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative overflow-hidden"

                  >
                    <div className="flex flex-row gap-0 items-center justify-center shrink-0 relative ">
                      <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                        Sign Message
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-span-3 mt-10 w-full  ">
                <div style={{
                  background:
                    "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                }} className="w-full overflow-hidden group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] h-[50vh] 3xl:h-[53vh] p-4 bg-opacity-70 rounded-xl border border-stone-800  backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
                  <div className="">
                    <div className="">
                      <div className="flex justify-center">
                        <div className="self-stretch pt-4 flex flex-col gap-2 items-center">
                          <div><img className="h-5 w-5" src="/icons/send-2.svg" alt="pen" /></div>
                          <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] tracking-wide">Send Token</div>
                        </div>
                      </div>
                      <div className="self-stretch py-1 px-20 ">
                        <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                          <div className="grow shrink basis-0 text-center text-white text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">
                            A send token interaction – transfer to a blockchain wallet, or a @tria name.
                          </div>
                        </div>
                        {/* <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                          <div className="grow shrink basis-0 text-center text-white text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">
                            Token transfers to email, social accounts and mobile numbers are disabled in the demo.
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <div className="self-stretch flex-col mt-5 justify-start items-center gap-3 flex">
                      <div className="w-full h-[2vh] p-5 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center gap-3 inline-flex">
                        <div className="w-6 h-6 p-[2.40px] bg-violet-600 rounded-2xl backdrop-blur-[3px] flex-col justify-center items-center inline-flex">
                          <div className="w-[19.20px] h-[19.20px] relative flex-col justify-start items-start flex" />
                          <img src="/icons/Polygon.svg" alt="polygon" />
                        </div>
                        <div className="grow shrink basis-0 h-[19px] justify-start items-center flex">
                          <div className="text-center text-neutral-50 text-[14px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">MATIC</div>
                        </div>

                      </div>
                      <div className="w-full h-[2vh] p-5 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                        <div className="justify-start items-center flex">
                          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full text-white text-opacity-90 text-[14px] focus:outline-none font-medium font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-[transparent]" placeholder="Token value" />
                        </div>
                      </div>
                      <div className="w-full h-[2vh] p-5 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                        <div className="justify-start items-center flex w-full">
                          <input value={recepientAddress} onChange={(e) => setrecepientAddress(e.target.value)} className="w-full text-white text-opacity-90 text-[14px] focus:outline-none font-medium font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-[transparent]" placeholder="Recipient wallet or @tria address" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`rounded-[78px] relative cursor-${recepientAddress.length > 0 ? "pointer" : "not-allowed"} px-6 py-2 w-[150px] mt-6 mb-3 flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative`}
                    onClick={() => {
                      if (recepientAddress.length > 0) {
                        sendTransaction()
                      }
                    }}
                  >
                    <div className="flex flex-row gap-0 items-center justify-center shrink-0  ">
                      <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                        Send Token
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-5 4xl:mt-8">
                  <div onClick={() => toggleClasslist()} className="flip-card cursor-pointer h-[30vh]">
                    <div className={`flip-card-inner ${toggleState ? "flip-card-flip" : ""}`}>
                      <div className={walletColor === "#FF4E17" ? "flip-card-front h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-orange" : walletColor === "#7D40FF" ? "flip-card-front h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-purple" : walletColor === "#D7FF01" ? "flip-card-front h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-green" : "flip-card-front h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-pink"}>
                        {/* {walletColor === "#FF4E17" ? <img src="/icons/card.svg" className="h-[100%] w-full absolute" /> : null}
                        {walletColor === "#7D40FF" ? <img src="/icons/card_purple.svg" className="h-[100%] w-full absolute" /> : null}
                        {walletColor === "#D7FF01" ? <img src="/icons/card_green.svg" className="h-[100%] w-full absolute" /> : null}
                        {walletColor === "#FF249D" ? <img src="/icons/card_pink.svg" className="h-[100%] w-full absolute" /> : null} */}
                        <div className="absolute top-4 right-1">
                          <img src="/icons/tria_name_card_logo.svg" alt="tria-logo" />
                        </div>
                        <div className="w-full flex justify-center h-full items-center ">
                          <div className={`w-20 h-20 relative  bg-neutral-50 bg-opacity-20 justify-center items-center flex rounded-full`}>
                            {avatar && <img alt="avatar" className="w-20 h-20 rounded-[32.73px]" src={avatar} />}
                          </div>
                        </div>
                        <div className="w-full flex h-full absolute text-white  ">
                          <div className="flex flex-col ml-4 absolute bottom-4">
                            <div className="text-white text-lg font-semibold  font-['Neue Haas Grotesk Display Pro'] leading-[33.60px]">{logged_user}</div>
                            <div className="text-white text-sm font-light font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] flex justify-start">Tap to rotate</div>
                          </div>
                        </div>
                      </div>
                      <div className="flip-card-back h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-back">
                        <img src="/icons/grey_rotate.svg" className="h-[100%] w-full absolute" />
                        <div className="w-full flex justify-end absolute top-0  text-white ">
                          <div className="flex flex-col mr-8 mt-4 items-end">
                            <div className="text-white text-base  font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">{logged_user}</div>
                            <div className="text-white text-base font-light font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">Tap to rotate</div>
                          </div>
                        </div>
                        <div className="w-full flex justify-end absolute bottom-4  text-white ">
                          <div className="flex flex-col mr-8 mt-4 items-end">
                            <div className="text-white text-lg flex items-center gap-0 font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">
                              <img src="/icons/tria_card.svg" alt="tria_card" />
                              tria
                            </div>
                            <div className="text-white text-xs font-light font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">one name all things web3</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[30vh] overflow-hidden group relative w-1/2 border border-stone-800 rounded-xl group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] ">

                    <div className="w-full h-full relative rounded-xl">
                      {walletColor === "#FF4E17" ? <img className="absolute top-0 w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-y-5" src="/icons/top_orange.svg" /> : null}
                      {walletColor === "#FF4E17" ? <img className="absolute bottom-0 w-full rotate-[180deg] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-y-5" src="/icons/top_orange.svg" /> : null}

                      {walletColor === "#7D40FF" ? <img className="absolute top-0 w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-y-5" src="/icons/top_purple.svg" /> : null}
                      {walletColor === "#7D40FF" ? <img className="absolute bottom-0 w-full rotate-[180deg] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-y-5" src="/icons/top_purple.svg" /> : null}

                      {walletColor === "#D7FF01" ? <img className="absolute top-0 w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-y-5" src="/icons/top_green.svg" /> : null}
                      {walletColor === "#D7FF01" ? <img className="absolute bottom-0 w-full rotate-[180deg] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-y-5" src="/icons/top_green.svg" /> : null}

                      {walletColor === "#FF249D" ? <img className="absolute top-0 w-full group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:-translate-y-5" src="/icons/top_pink.svg" /> : null}
                      {walletColor === "#FF249D" ? <img className="absolute bottom-0 w-full rotate-[180deg] group-hover:transition duration-[500ms] group-hover:duration-[500ms] group-hover:translate-y-5" src="/icons/top_pink.svg" /> : null}

                      <div className="w-full h-full p-8 left-0 top-0 absolute rounded-xl flex-col justify-center items-center gap-[52px] inline-flex">
                        <div className="text-white text-opacity-90 text-[30px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[34.40px] tracking-wide">All EVMs, and major non-EVMS, supported.</div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              <div className={windowSize.innerWidth < 1800 ? "mt-10 w-[33vw] 4xl:w-[24vw] 3xl:w-[23vw] col-span-2 reveal fade-bottom " : "mt-10 w-[33vw] 4xl:w-[24vw] 3xl:w-[23vw] col-span-2"}>
                <div style={{
                  background:
                    "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                }} className="w-full h-[52vh] p-5 group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] rounded-xl border border-stone-800 backdrop-blur-[100px] flex-col justify-start items-center gap-5 inline-flex">
                  <div className=" h-full flex-col gap-4 items-center flex">
                    <div className="self-stretch gap-4 flex mb-2">
                      <div className="">
                        <div className=" h-[20vh] relative ">
                          <img className="max-w-[180px] rounded-[20.07px]" src="https://coffee-usual-coyote-592.mypinata.cloud/ipfs/QmTntuKccRaU7vedr6AU7pPdEJoCQ9KhwwKt5ZaLZ4a5N3" />
                          {/* <div className="w-[58.47px] h-[58.47px] p-[11.24px] left-[0.11px] top-0 absolute justify-center items-center gap-[12.12px] inline-flex">
                            <div className="w-8 h-8 pl-[5.26px] pr-[5.27px] pt-[5.13px] pb-[5.39px] bg-gradient-to-br from-stone-950 to-stone-950 rounded-[30.94px] border-2 backdrop-blur-[4.50px] justify-center items-center flex">
                              <img src="/icons/polygon_nft.svg" alt="polygon" />
                            </div>
                          </div> */}
                          <img className="absolute top-2 left-2 w-8 h-8" src="/icons/polygon_nft.svg" alt="polygon" />
                        </div>
                      </div>
                      <div className="self-stretch  flex-col justify-start items-start inline-flex  ">
                        <div className="self-stretch flex-col justify-start items-start flex">
                          <div className="self-stretch p-0 justify-start items-center gap-0 inline-flex">
                            <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">Tria NFT</div>
                          </div>
                          <div className="px-0 py-0 rounded-[27.15px] justify-start items-center gap-[13.57px] inline-flex">
                            <div className=" justify-start items-center gap-[13.57px] flex">
                              <div className="text-center text-white text-opacity-80 text-xl font-medium font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Concept #1</div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={() => callWriteContract()}
                          className="rounded-[78px] mt-4 cursor-pointer px-6 py-2 w-[150px] flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative overflow-hidden"
                        >
                          <div className="flex  flex-row gap-0 items-center justify-center shrink-0 relative ">
                            <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                              Mint NFT
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch flex-col justify-start items-center gap-3 flex ">
                      <div className="self-stretch px-1 py-1 justify-start items-center inline-flex">
                        <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                          <div className="grow shrink basis-0 text-white text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">An exclusive NFT commemorating the pioneering testers of Tria’s SDKs. Symbolizing the collaborative spirit of early adopters, marking a new era in onboarding the world to the decentralized internet.</div>
                        </div>
                      </div>
                      <div className="self-stretch px-1 py-1 justify-start items-center inline-flex">
                        <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                          <div className="grow shrink basis-0"><span className="text-white text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Supported Standards:<br /></span><span className="text-white text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">ERC 721, 1155 and 6551<br />SPL<br />ICS-721</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                  }}
                  className="w-full mt-5 p-2 h-[28vh] 3xl:h-[33vh] group hover:transition duration-[500ms] hover:duration-[500ms] hover:scale-[0.95] bg-opacity-70 rounded-xl border border-stone-800 backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
                  <div className="">
                    <div className="">
                      <div className="flex justify-center">
                        <div className="self-stretch pt-4 flex flex-col gap-2 items-center">
                          <div><img className="h-5 w-5" src="/icons/user-tag.svg" alt="tag" /></div>
                          <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] tracking-wide">Get In Touch</div>
                        </div>
                      </div>
                      <div className="self-stretch py-0 px-10 justify-center items-center inline-flex">
                        <div className="grow shrink basis-0 self-stretch justify-center items-center flex">
                          <div className="grow shrink basis-0 text-white text-center text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">We work with discerning founders and visionary companies to elevate their user-experience. Join the collective.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => { window.open("https://www.tria.so/sdk", "_blank") }}
                    className="rounded-[78px] cursor-pointer px-6 py-2 w-[120px] flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative overflow-hidden"

                  >
                    <div className="flex flex-row gap-0 items-center justify-center shrink-0 relative ">
                      <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                        Book a call
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          :


          <div className={clicked === true ? "blur-background " : ""}>
            <div>
              <div className="w-full h-[40vh] relative">
                <div className="w-full h-full px-5 py-4 left-0 top-0 absolute bg-transparent flex-col justify-center items-center gap-[34px] inline-flex">

                  {walletColor === "#FF4E17" ? <img className="absolute top-0 left-0 w-[70%]" src="/icons/ellipse.svg" alt="ellipse" /> : null}
                  {walletColor === "#7D40FF" ? <img className="absolute top-0 left-0 w-[70%]" src="/icons/ellipse_purple.svg" alt="ellipse" /> : null}
                  {walletColor === "#D7FF01" ? <img className="absolute top-0 left-0 w-[70%]" src="/icons/ellipse_green.svg" alt="ellipse" /> : null}
                  {walletColor === "#FF249D" ? <img className="absolute top-0 left-0 w-[70%]" src="/icons/ellipse_pink.svg" alt="ellipse" /> : null}

                  <div className="p-[8.83px] flex-col justify-center items-center gap-0 -mt-12 flex">
                    <div className="text-white text-opacity-80 text-base font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Experience Tria’s Personalised</div>
                    <div className="text-neutral-50 text-4xl font-medium font-['Neue Haas Grotesk Display Pro'] leading-[79.20px]">Embedded Wallet</div>
                    <div className="w-full px-5 h-12 text-center text-white text-opacity-40 text-[13px] font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Personalized, user-focused journeys built with Tria's exclusive SDKs. Elevate beyond social onboarding, smart-accounts, and programmable TXs. </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 -mt-5 px-3 mb-6">

                <div onClick={() => toggleClasslist()} className="flip-card cursor-pointer h-[27vh]">
                  <div className={`flip-card-inner ${toggleState ? "flip-card-flip" : ""}`}>
                    <div className={walletColor === "#FF4E17" ? "flip-card-front  w-1/2 border-stone-800 rounded-xl background-container-orange" : walletColor === "#7D40FF" ? "flip-card-front h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-purple" : walletColor === "#D7FF01" ? "flip-card-front h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-green" : "flip-card-front h-[30vh] w-1/2 border-stone-800 rounded-xl background-container-pink"}>
                      {/* {walletColor === "#FF4E17" ? <img src="/icons/card.svg" className="h-[100%] w-full absolute" /> : null}
                        {walletColor === "#7D40FF" ? <img src="/icons/card_purple.svg" className="h-[100%] w-full absolute" /> : null}
                        {walletColor === "#D7FF01" ? <img src="/icons/card_green.svg" className="h-[100%] w-full absolute" /> : null}
                        {walletColor === "#FF249D" ? <img src="/icons/card_pink.svg" className="h-[100%] w-full absolute" /> : null} */}

                      <div className="w-full flex justify-center h-full items-center ">
                        <div className={`w-16 h-16 relative  bg-neutral-50 bg-opacity-20 justify-center items-center flex rounded-full`}>
                          {avatar && <img alt="avatar" className="w-16 h-16 rounded-[32.73px]" src={avatar} />}
                        </div>
                      </div>
                      <div className="w-full flex h-full absolute text-white  ">
                        <div className="flex flex-col ml-3 absolute bottom-3">
                          <div className="text-white text-sm font-bold  font-['Neue Haas Grotesk Display Pro'] leading-[33.60px]">{logged_user}</div>
                          <div className="text-white text-xs font-light font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] flex justify-start">Tap to rotate</div>
                        </div>
                      </div>
                    </div>
                    <div className="flip-card-back  w-1/2 border-stone-800 rounded-xl background-container-back">
                      <img src="/icons/grey_rotate.svg" className="h-[100%] w-full absolute" />
                      <div className="w-full flex justify-end absolute top-0  text-white ">
                        <div className="flex flex-col mr-3 mt-4 items-end">
                          <div className="text-white text-sm font-bold  font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">{logged_user}</div>
                          <div className="text-white text-xs font-light font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">Tap to rotate</div>
                        </div>
                      </div>
                      <div className="w-full flex justify-end absolute bottom-4  text-white ">
                        <div className="flex flex-col mr-3 mt-4 items-end">
                          <div className="text-white text-lg flex items-center gap-0 font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">
                            <img src="/icons/tria_card.svg" alt="tria_card" />
                            tria
                          </div>
                          <div className="text-white text-xs font-light font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">one name all things web3</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="h-[27vh] relative w-1/2 border border-stone-800 rounded-xl  ">

                  <div className="w-full h-full relative rounded-xl">
                    {walletColor === "#FF4E17" ? <img className="absolute top-0 w-full" src="/icons/top_orange.svg" /> : null}
                    {walletColor === "#FF4E17" ? <img className="absolute bottom-0 w-full rotate-[180deg]" src="/icons/top_orange.svg" /> : null}

                    {walletColor === "#7D40FF" ? <img className="absolute top-0 w-full" src="/icons/top_purple.svg" /> : null}
                    {walletColor === "#7D40FF" ? <img className="absolute bottom-0 w-full rotate-[180deg]" src="/icons/top_purple.svg" /> : null}

                    {walletColor === "#D7FF01" ? <img className="absolute top-0 w-full" src="/icons/top_green.svg" /> : null}
                    {walletColor === "#D7FF01" ? <img className="absolute bottom-0 w-full rotate-[180deg]" src="/icons/top_green.svg" /> : null}

                    {walletColor === "#FF249D" ? <img className="absolute top-0 w-full" src="/icons/top_pink.svg" /> : null}
                    {walletColor === "#FF249D" ? <img className="absolute bottom-0 w-full rotate-[180deg]" src="/icons/top_pink.svg" /> : null}

                    <div onClick={() => window.open("https://www.youtube.com/watch?v=kPqTHt9v48A", "_blank")} className="w-full h-full  rounded-xl flex justify-center items-center ">
                      <div className="text-white ml-5 text-opacity-90 text-[27px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[34.40px] tracking-wide">One name, all things
                        {walletColor === "#FF4E17" ? <span className="orange_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[34.40px] "> Web3</span> : null}
                        {walletColor === "#7D40FF" ? <span className="purple_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[34.40px] "> Web3 </span> : null}
                        {walletColor === "#D7FF01" ? <span className="green_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[34.40px] "> Web3 </span> : null}
                        {walletColor === "#FF249D" ? <span className="pink_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[34.40px] "> Web3 </span> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xl grow shrink basis-0 text-center px-7 mb-6">
                <span className="text-white text-opacity-90 font-semibold font-['Neue Haas Grotesk Display Pro'] ">Explore</span>
                <span className="text-white t font-semibold font-['Neue Haas Grotesk Display Pro'] "> </span>
                {walletColor === "#FF4E17" ? <span className="orange_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] ">Tria’s embedded wallet </span> : null}
                {walletColor === "#7D40FF" ? <span className="purple_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] ">Tria’s embedded wallet </span> : null}
                {walletColor === "#D7FF01" ? <span className="green_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] ">Tria’s embedded wallet </span> : null}
                {walletColor === "#FF249D" ? <span className="pink_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] ">Tria’s embedded wallet </span> : null}
                <span className="text-white text-opacity-90 relative font-semibold font-['Neue Haas Grotesk Display Pro']  ">in real time. Tailor and construct the wallet to match your app.</span>
              </div>

              <div className="mx-3">
                <div className={
                  "rounded-xl border-solid  border-stone-800 border-[0.7px] px-4 py-2 flex flex-col gap-5 items-start justify-start shrink-0 relative w-full "
                }
                  style={{
                    background:
                      "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                  }}
                >
                  <div className="flex flex-col self-stretch shrink-0 relative ">
                    <div className="flex items-center justify-between shrink-0 relative ">
                      <div className="rounded-xl pt-4 pb-4 flex  flex-row gap-4  items-center justify-start shrink-0 relative overflow-hidden">
                        <div className="flex flex-col gap-1 items-start justify-center flex-1 relative">
                          <div className="text-[#ffffff] text-left font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Theme{" "}
                          </div>
                          <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-xs leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Light or dark{" "}
                          </div>
                        </div>
                      </div>
                      <div className="bg-[rgba(48,48,48,0.20)] cursor-not-allowed rounded-[14px] border-solid border-[transparent] border-2 flex flex-row gap-0 items-center justify-center shrink-0 relative">
                        <div className="rounded-2xl pt-2 pr-4 pb-2 pl-4 flex flex-row gap-0 items-center justify-center shrink-0 relative overflow-hidden">
                          <div className="shrink-0 w-4 h-4 relative">
                            <svg
                              className="h-[auto] absolute left-0 top-0 overflow-visible"
                              style={{}}
                              width="18"
                              height="19"
                              viewBox="0 0 24 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 19.5C15.866 19.5 19 16.366 19 12.5C19 8.63401 15.866 5.5 12 5.5C8.13401 5.5 5 8.63401 5 12.5C5 16.366 8.13401 19.5 12 19.5Z"
                                fill="#3C3C3C"
                              />
                              <path
                                d="M12 23.46C11.45 23.46 11 23.05 11 22.5V22.42C11 21.87 11.45 21.42 12 21.42C12.55 21.42 13 21.87 13 22.42C13 22.97 12.55 23.46 12 23.46ZM19.14 20.64C18.88 20.64 18.63 20.54 18.43 20.35L18.3 20.22C17.91 19.83 17.91 19.2 18.3 18.81C18.69 18.42 19.32 18.42 19.71 18.81L19.84 18.94C20.23 19.33 20.23 19.96 19.84 20.35C19.65 20.54 19.4 20.64 19.14 20.64ZM4.86 20.64C4.6 20.64 4.35 20.54 4.15 20.35C3.76 19.96 3.76 19.33 4.15 18.94L4.28 18.81C4.67 18.42 5.3 18.42 5.69 18.81C6.08 19.2 6.08 19.83 5.69 20.22L5.56 20.35C5.37 20.54 5.11 20.64 4.86 20.64ZM22 13.5H21.92C21.37 13.5 20.92 13.05 20.92 12.5C20.92 11.95 21.37 11.5 21.92 11.5C22.47 11.5 22.96 11.95 22.96 12.5C22.96 13.05 22.55 13.5 22 13.5ZM2.08 13.5H2C1.45 13.5 1 13.05 1 12.5C1 11.95 1.45 11.5 2 11.5C2.55 11.5 3.04 11.95 3.04 12.5C3.04 13.05 2.63 13.5 2.08 13.5ZM19.01 6.49C18.75 6.49 18.5 6.39 18.3 6.2C17.91 5.81 17.91 5.18 18.3 4.79L18.43 4.66C18.82 4.27 19.45 4.27 19.84 4.66C20.23 5.05 20.23 5.68 19.84 6.07L19.71 6.2C19.52 6.39 19.27 6.49 19.01 6.49ZM4.99 6.49C4.73 6.49 4.48 6.39 4.28 6.2L4.15 6.06C3.76 5.67 3.76 5.04 4.15 4.65C4.54 4.26 5.17 4.26 5.56 4.65L5.69 4.78C6.08 5.17 6.08 5.8 5.69 6.19C5.5 6.39 5.24 6.49 4.99 6.49ZM12 3.54C11.45 3.54 11 3.13 11 2.58V2.5C11 1.95 11.45 1.5 12 1.5C12.55 1.5 13 1.95 13 2.5C13 3.05 12.55 3.54 12 3.54Z"
                                fill="#3C3C3C"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          className="rounded-[14px] pt-2 pr-4 pb-2 pl-4 flex flex-row gap-0 items-center justify-center shrink-0 relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(117.03deg, rgba(28, 30, 79, 1.00) 0%,rgba(17, 25, 52, 1.00) 100%)",
                          }}
                        >
                          <div className="shrink-0 w-4 h-4 relative">
                            <svg
                              className="h-[auto] absolute left-0 top-0 overflow-visible"
                              style={{}}
                              width="18"
                              height="19"
                              viewBox="0 0 24 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21.5307 16.4304C21.3707 16.1604 20.9207 15.7404 19.8007 15.9404C19.1807 16.0504 18.5507 16.1004 17.9207 16.0704C15.5907 15.9704 13.4807 14.9004 12.0107 13.2504C10.7107 11.8004 9.91068 9.91036 9.90068 7.87036C9.90068 6.73036 10.1207 5.63036 10.5707 4.59036C11.0107 3.58036 10.7007 3.05036 10.4807 2.83036C10.2507 2.60036 9.71068 2.28036 8.65068 2.72036C4.56068 4.44036 2.03068 8.54036 2.33068 12.9304C2.63068 17.0604 5.53068 20.5904 9.37068 21.9204C10.2907 22.2404 11.2607 22.4304 12.2607 22.4704C12.4207 22.4804 12.5807 22.4904 12.7407 22.4904C16.0907 22.4904 19.2307 20.9104 21.2107 18.2204C21.8807 17.2904 21.7007 16.7004 21.5307 16.4304Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between relative shrink-0 ">
                      <div className="rounded-xl pt-4 pb-4 flex flex-row gap-4 items-center justify-start shrink-0  relative overflow-hidden">
                        <div className="flex flex-col gap-1 items-start justify-center flex-1 relative">
                          <div className="text-[#ffffff] text-left font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Wallet card{" "}
                          </div>
                          <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-xs leading-[120%] font-normal relative self-stretch flex items-center justify-start">
                            Customizable in SDK{" "}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div onClick={() => {
                          setWalletColor("#7D40FF");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#7D40FF] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#7D40FF" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#7D40FF] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                        <div onClick={() => {
                          setWalletColor("#FF4E17");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#FF4E17] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#FF4E17" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#FF4E17] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                        <div onClick={() => {
                          setWalletColor("#D7FF01");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#D7FF01] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#D7FF01" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#D7FF01] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                        <div onClick={() => {
                          setWalletColor("#FF249D");
                          setReloadFlag(!reloadFlag);
                        }} className="bg-[#FF249D] h-5 w-5 rounded-full cursor-pointer flex justify-center items-center">
                          {walletColor === "#FF249D" ? <div className="h-3 w-3 rounded-full bg-white flex justify-center items-center">
                            <div className="bg-[#FF249D] h-2 w-2 rounded-full"></div>
                          </div> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-3 mt-5">
                <div className="grid grid-cols-6 gap-3 w-full h-full  ">
                  <div className="flex flex-col gap-3 col-span-4 ">
                    <div className="w-full h-[14vh] relative rounded-xl">
                      <div className="w-full h-full flex justify-center items-center py-4 left-0 top-0 absolute rounded-xl border border-stone-800 border-solid  flex-col justify-start items-start gap-[52px] inline-flex">
                        {walletColor === "#FF4E17" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full" src="/icons/ring_orange.svg" alt="ellipse" /> : null}
                        {walletColor === "#7D40FF" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full" src="/icons/ring_purple.svg" alt="ellipse" /> : null}
                        {walletColor === "#D7FF01" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full" src="/icons/ring_green.svg" alt="ellipse" /> : null}
                        {walletColor === "#FF249D" ? <img className="absolute left-0 w-full right-0 top-0 h-3/4  rounded-xl h-full" src="/icons/ring_pink.svg" alt="ellipse" /> : null}
                        <div className="text-2xl md:text-3xl grow shrink basis-0">
                          <span className="text-white text-opacity-90 relative font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">One name,<br></br></span>
                          <span className="text-white relative font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">all things </span>
                          {walletColor === "#FF4E17" ? <span className="orange_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3</span> : null}
                          {walletColor === "#7D40FF" ? <span className="purple_gradient_text font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3 </span> : null}
                          {walletColor === "#D7FF01" ? <span className="green_gradient_text  font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3 </span> : null}
                          {walletColor === "#FF249D" ? <span className="pink_gradient_text font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[38.40px] ">Web3 </span> : null}

                        </div>
                      </div>
                    </div>
                    <div style={{
                      background:
                        "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                    }} className="w-full h-[14vh] p-4 bg-opacity-70 rounded-xl border border-stone-800 flex-col justify-between items-center inline-flex">
                      <div className="w-full h-full flex justify-center items-center">
                        <div className="flex gap-2 items-start">
                          <img src="/icons/danger.svg" />
                          <div className=" text-white text-opacity-40 text-xs font-medium font-['Neue Haas Grotesk Display Pro'] ">This demo is on Polygon Mumbai testnet, some features might be restricted.</div>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="w-full col-span-2">

                    <div className="w-full h-full relative rounded-xl border border-stone-800 overflow-hidden ">
                      {walletColor === "#FF4E17" ? <img className=" absolute w-full " src="/icons/person_card_orange.svg" alt="person" /> : null}
                      {walletColor === "#7D40FF" ? <img className=" absolute w-full " src="/icons/person_card_purple.svg" alt="person" /> : null}
                      {walletColor === "#D7FF01" ? <img className=" absolute w-full " src="/icons/person_card_green.svg" alt="person" /> : null}
                      {walletColor === "#FF249D" ? <img className=" absolute w-full " src="/icons/person_card_pink.svg" alt="person" /> : null}
                      {/* <div className="w-[298.50px] h-[387.84px] left-[20px] top-[33.38px] absolute origin-top-left rotate-[-64.04deg] opacity-80 bg-orange-600 rounded-full blur-[37.67px]" /> */}
                      <img className="w-[64.95px] h-[64.95px] left-[1vw] top-[1vh] absolute rounded-full" src="/icons/person_2.svg" alt="person" />
                      <div className="h-[123.79px] left-[-16px] top-[18px] absolute">
                        <div className="w-[137.59px] h-[33.83px] left-[2.92px] top-[7vh] absolute origin-top-left rotate-[4.96deg] backdrop-blur-[9.44px] flex-col justify-center items-start gap-[3.15px] inline-flex">
                          <div className="px-[15.74px] py-[9.44px] bg-sky-300 bg-opacity-50 rounded-[9.44px] justify-start items-center inline-flex">
                            <div className="justify-start items-center flex">
                              <div className="text-neutral-50 text-xs font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[15.11px] tracking-tight">papabera@tria</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-[79.72px] h-[98.38px] left-[14vw] top-[17vh] absolute">
                        <img className="w-[55.95px] h-[55.95px] left-[1.73px] top-[1vh] absolute rounded-full" src="/icons/person.svg" alt="person" />
                        <div className="w-[77.30px] h-[27.93px] left-0 top-[70.59px] absolute origin-top-left rotate-[-5.79deg] backdrop-blur-[7.79px] flex-col justify-center items-start gap-[2.60px] inline-flex">
                          <div className="px-[12.99px] py-[7.79px] bg-orange-300 bg-opacity-70 rounded-lg justify-start items-center inline-flex">
                            <div className="justify-start items-center flex">
                              <div className="text-neutral-50 text-[10.39px] font-semibold font-['Neue Haas Grotesk Display Pro'] leading-3 tracking-tight">katie@tria</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-[46.74px] h-[46.74px] pl-[12.67px] pr-[12.21px] pt-[7.50px] pb-[7.44px] left-[151.03px] top-[107px] absolute origin-top-left rotate-[9.90deg] bg-indigo-500 rounded-[55.86px] backdrop-blur-[4.97px] justify-center items-center inline-flex">
                        <div className="grow shrink basis-0 self-stretch pl-[0.57px] pr-[1.77px] flex-col justify-center items-center inline-flex">
                          <img src="/icons/eth.svg" alt="eth" />
                        </div>
                      </div>
                      <div className="w-[36.77px] h-[36.77px] -left-[4vw] bottom-[1vh] absolute origin-top-left rotate-[-17.48deg] bg-red-600 rounded-[45.28px] backdrop-blur-[4.60px] justify-center items-center flex">
                        <img className="w-[44.12px] h-[45.12px] pl-2" src="/icons/optimism.svg" />
                      </div>
                      <div className="w-[50.76px] h-[50.76px] left-[1vw] top-[15vh] absolute bg-violet-600 rounded-[33.84px] backdrop-blur-[6.34px] flex-col justify-center items-center inline-flex">
                        <img src="/icons/Polygon.svg" alt="polygon_logo" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="mx-3 mt-10 mb-10">
                <div className="w-full text-center">

                  <span className={`${walletColor === "#FF4E17" ? "orange_gradient_text" : walletColor === "#7D40FF" ? "purple_gradient_text" : walletColor === "#D7FF01" ? "green_gradient_text" : "pink_gradient_text"} text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px]`}>Add</span>
                  <span className="text-white text-opacity-90 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px]"> funds and sign messages.</span></div>
              </div>

              <div className="mt-5 mx-3">
                {carouselOne === 0 ?
                  <div
                    className={
                      " border rounded-xl md:h-[280px] border-stone-800 border-solid py-8 px-4 flex flex-col items-center justify-between self-stretch shrink-0 w-full relative overflow-hidden "

                    }
                    style={{
                      background:
                        "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 40%)",
                    }}
                  >
                    <div className="flex flex-col gap-7 items-center justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-col gap-5 items-center justify-start self-stretch shrink-0 relative">
                        <div className="pt-2 pb-2 flex flex-row gap-0 -mt-3 items-center justify-center self-stretch shrink-0 relative">
                          <div className="text-[#fafafa] text-left font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-[20px] leading-[120%] font-semibold relative flex items-center justify-start">
                            Add Funds{" "}
                          </div>
                        </div>
                        <div className="pt-1 pb-1 flex flex-row gap-0 items-center justify-start self-stretch shrink-0 relative overflow-hidden">
                          <div className="flex flex-row gap-0 items-center justify-start self-stretch flex-1 relative">
                            <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[135%] font-normal relative flex-1 flex items-center justify-start">
                              To start exploring, you would require some funds. Click the
                              button below to receive Matic on Polygon Mumbai testnet.{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!success ?
                      <>
                        {!loader ?
                          <div
                            className="rounded-[78px] bg-white cursor-pointer px-6 py-2 w-[120px] mt-6 flex flex-row gap-0 items-center justify-center shrink-0  relative overflow-hidden"

                            onClick={() => fundTriaWallet()}
                          >
                            <div className="flex flex-row gap-0 items-center justify-center shrink-0 relative">
                              <div className="text-black text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                                Add funds{" "}
                              </div>
                            </div>
                          </div> :
                          <div className={`relative px-[2px] py-[2px] w-[120px] mt-6 bg-animation-${walletColor === "#FF4E17" ? "orange" : walletColor === "#7D40FF" ? "purple" : walletColor === "#D7FF01" ? "green" : "pink"}`}>
                            <div className=" rounded-[78px] z-50 relative bg-black text-white  p-2">
                              <div>
                                <div className="text-center flex justify-center text-neutral-50 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-[16.80px] ">Loading...</div>
                              </div>
                            </div>
                          </div>}
                      </>
                      :
                      <div>
                        <div className="pt-1 pb-1 flex flex-row gap-0 mt-3   items-center justify-start self-stretch shrink-0 relative overflow-hidden">
                          <div className="flex flex-col gap-0 items-center justify-start self-stretch flex-1 relative">
                            <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[135%] font-normal relative flex-1 flex items-center justify-start">
                              Sent 0.001 MUMBAI MATIC!
                            </div>
                            <div onClick={() => { window.open(`https://mumbai.polygonscan.com/address/${userWalletAddress}`, "_blank"); setSuccess(false) }} className="text-white cursor-pointer underline text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[135%] font-normal relative flex-1 flex items-center justify-start">
                              View details
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div> :
                  <div
                    className={
                      " border rounded-xl md:h-[280px] border-stone-800 border-solid py-8 px-4 flex flex-col items-center justify-between self-stretch shrink-0 w-full relative overflow-hidden "

                    }
                    style={{
                      background:
                        "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 40%)",
                    }}
                  >
                    <div className="flex flex-col gap-7 items-center justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-col gap-5 items-center justify-start self-stretch shrink-0 relative">
                        <div className="pt-2 pb-2 flex flex-row gap-0 -mt-3 items-center justify-center self-stretch shrink-0 relative">
                          <div className="text-[#fafafa] text-left font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-[20px] leading-[120%] font-semibold relative flex items-center justify-start">
                            Sign Message{" "}
                          </div>
                        </div>
                        <div className="pt-1 pb-1 flex flex-row gap-0 items-center justify-start self-stretch shrink-0 relative overflow-hidden">
                          <div className="flex flex-row gap-0 items-center justify-start self-stretch flex-1 relative">
                            <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[135%] font-normal relative flex-1 flex items-center justify-start">
                              Sample wallet interaction of a message signature. To test a transaction signature, mint a Tria Concept NFT from the right.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="rounded-[78px] bg-white cursor-pointer px-6 py-2 w-[120px] mt-6 flex flex-row gap-0 items-center justify-center shrink-0  relative overflow-hidden"
                      onClick={() => callSign()}
                    >
                      <div className="flex flex-row gap-0 items-center justify-center shrink-0 relative">
                        <div className="text-black text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                          Sign
                        </div>
                      </div>
                    </div>

                  </div>
                }
                <div className="w-full h-10 justify-center mt-5 items-center gap-3 inline-flex">
                  <div onClick={() => setCarouselOne(0)} className="p-2 bg-zinc-500 bg-opacity-20 rounded-[22px] justify-start items-start gap-2 flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                      <div className="w-5 h-5 relative">
                        <img className="rotate-[180deg]" src="/icons/arrow.svg" alt="arrow" />
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setCarouselOne(1)} className="p-2 bg-zinc-500 bg-opacity-20 rounded-[22px] justify-start items-start gap-2 flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                      <div className="w-5 h-5 relative">
                        <img src="/icons/arrow.svg" alt="arrow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-3 mt-7 mb-10">
                <div className="w-full text-center">

                  <span className={`${walletColor === "#FF4E17" ? "orange_gradient_text" : walletColor === "#7D40FF" ? "purple_gradient_text" : walletColor === "#D7FF01" ? "green_gradient_text" : "pink_gradient_text"} text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px]`}>Send</span>
                  <span className="text-white text-opacity-90 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px]"> token and claim NFTs.</span>
                </div>

              </div>
              <div className="mt-5 mb-7 mx-3">
                {carouselTwo === 0 ?
                  <div style={{
                    background:
                      "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 40%)",
                  }} className="w-full  p-3 bg-opacity-70 rounded-xl border border-stone-800  backdrop-blur-[100px] flex-col justify-between items-center inline-flex">
                    <div className="self-stretch h-[385px] flex-col justify-start items-center gap-9 flex">
                      <div className="self-stretch h-[137px] flex-col justify-start items-center gap-6 flex">
                        <div className="self-stretch py-0 justify-center items-center gap-4 inline-flex">
                          <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] tracking-wide">Send Token</div>
                        </div>
                        <div className="pt-1 pb-1 flex flex-row gap-0 items-center justify-start self-stretch shrink-0 relative overflow-hidden">
                          <div className="flex flex-row gap-0 items-center justify-start self-stretch flex-1 relative">
                            <div className="text-[rgba(255,255,255,0.40)] text-left font-['NeueHaasGroteskDisplayPro-55Roman',_sans-serif] text-sm leading-[135%] font-normal relative flex-1 flex items-center justify-start">
                              A send token interaction – transfer to a blockchain wallet, or a @tria name. Token transfers to email, social accounts and mobile numbers are disabled in the demo.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch flex-col  mt-1 justify-start items-center gap-3 flex">
                        <div className="w-full h-[45px] p-5 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center gap-3 inline-flex">
                          <div className="w-6 h-6 p-[2.40px] bg-violet-600 rounded-2xl backdrop-blur-[3px] flex-col justify-center items-center inline-flex">
                            <div className="w-[19.20px] h-[19.20px] relative flex-col justify-start items-start flex" />
                            <img src="/icons/Polygon.svg" alt="polygon" />
                          </div>
                          <div className="grow shrink basis-0 h-[19px] justify-start items-center flex">
                            <div className="text-center text-neutral-50 text-base font-semibold font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight">MATIC</div>
                          </div>

                        </div>
                        <div className="w-full h-[45px] p-5 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                          <div className="justify-start items-center flex">
                            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full text-white text-opacity-90 text-base focus:outline-none font-medium font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-[transparent]" placeholder="Token value" />
                          </div>
                        </div>
                        <div className="w-full h-[45px] p-5 bg-zinc-500 bg-opacity-10 rounded-xl justify-start items-center inline-flex">
                          <div className="justify-start items-center flex w-full">
                            <input value={recepientAddress} onChange={(e) => setrecepientAddress(e.target.value)} className="w-full text-white text-opacity-90 text-base focus:outline-none font-medium font-['Neue Haas Grotesk Display Pro'] leading-tight tracking-tight bg-[transparent]" placeholder="Recipient wallet or @tria address" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`rounded-[78px] relative cursor-${recepientAddress.length > 0 ? "pointer" : "not-allowed"} px-6 py-2 w-[120px] mt-6 mb-3 flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative`}
                      onClick={() => {
                        if (recepientAddress.length > 0) {
                          sendTransaction()
                        }
                      }}
                    >
                      <div className="flex flex-row gap-0 items-center justify-center shrink-0  ">
                        <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                          Send
                        </div>
                      </div>
                    </div>
                  </div> :
                  <div style={{
                    background:
                      "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 40%)",
                  }} className="w-full  p-4  rounded-xl border border-stone-800 backdrop-blur-[100px] flex-col justify-start items-center gap-5 inline-flex">
                    <div className=" h-[20vh] relative mb-5 mt-2">
                      <img className="max-w-[180px] rounded-[20.07px]" src="https://coffee-usual-coyote-592.mypinata.cloud/ipfs/QmTntuKccRaU7vedr6AU7pPdEJoCQ9KhwwKt5ZaLZ4a5N3" />
                      <div className="w-[58.47px] h-[58.47px] p-[11.24px] left-[0.11px] top-0 absolute justify-center items-center gap-[12.12px] inline-flex">
                        <div className="w-8 h-8 pl-[5.26px] pr-[5.27px] pt-[5.13px] pb-[5.39px] bg-gradient-to-br from-stone-950 to-stone-950 rounded-[30.94px] border-2 backdrop-blur-[4.50px] justify-center items-center flex">
                          <img src="/icons/Polygon.svg" alt="polygon" />
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch  h-full flex-col gap-5 items-center flex">
                      <div className="self-stretch gap-4 flex">

                        <div className="self-stretch  flex justify-between p-1 w-full items-start gap-0 inline-flex  ">
                          <div className="self-stretch flex-col justify-start items-start flex">
                            <div className="self-stretch p-0 justify-start items-center gap-0 inline-flex">
                              <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">Tria NFT</div>
                            </div>
                            <div className="px-0 py-0 rounded-[27.15px] justify-start items-center gap-[13.57px] inline-flex">
                              <div className=" justify-start items-center gap-[13.57px] flex">
                                <div className="text-center text-white text-opacity-80 text-xl font-medium font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">Concept #1</div>
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={() => callWriteContract()}
                            className="rounded-[78px] mt-4 cursor-pointer px-6 py-2 w-[120px] flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative overflow-hidden"
                          >
                            <div className="flex  flex-row gap-0 items-center justify-center shrink-0 relative ">
                              <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                                Mint NFT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch flex-col justify-start items-center gap-3 3xl:-mt-10 flex ">
                        <div className="self-stretch px-1 py-1 justify-start items-center inline-flex">
                          <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                            <div className="grow shrink basis-0 text-white text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">This is an example on Polygon Testnet. Tria supports 100+ blockchains. Speak with the team to discuss more.</div>
                          </div>
                        </div>
                        <div className="self-stretch px-1 py-1 justify-start items-center inline-flex">
                          <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                            <div className="grow shrink basis-0"><span className="text-white text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">Supported Standards:<br /></span><span className="text-white text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal tracking-tight">ERC 721, 1155 and 6551<br />SPL<br />ICS-721</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <div className="w-full h-10 justify-center mt-5 items-center gap-3 inline-flex">
                  <div onClick={() => setCarouselTwo(0)} className="p-2 bg-zinc-500 bg-opacity-20 rounded-[22px] justify-start items-start gap-2 flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                      <div className="w-5 h-5 relative">
                        <img className="rotate-[180deg]" src="/icons/arrow.svg" alt="arrow" />
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setCarouselTwo(1)} className="p-2 bg-zinc-500 bg-opacity-20 rounded-[22px] justify-start items-start gap-2 flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                      <div className="w-5 h-5 relative">
                        <img src="/icons/arrow.svg" alt="arrow" />
                      </div>
                    </div>
                  </div>
                </div>


              </div>
              <div className="mx-3 mb-10 flex justify-center">
                {/* <div style={{
                  background:
                    "linear-gradient(to bottom right,rgba(54, 54, 54, 0.70) 0%,rgba(26, 26, 26, 0.19) 60%)",
                }} className="w-full mt-5 p-4 4xl:h-[270px] 3xl:h-[260px] md:h-[220px] rounded-xl border border-stone-800 backdrop-blur-[100px] flex-col justify-center items-center gap-[52px] inline-flex">
                  <div className="self-stretch  flex-col justify-start items-center gap-0 flex">
                    <div className="self-stretch flex-col justify-start items-center gap-0 flex">
                      <div className="self-stretch py-2 justify-center items-center  inline-flex">
                        <div className="text-neutral-50 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[33.60px] ">Get in touch</div>
                      </div>
                      <div className="self-stretch px-3 py-1 justify-start items-center inline-flex">
                        <div className="grow shrink basis-0 self-stretch justify-start items-center flex">
                          <div className="grow shrink basis-0 text-justify text-white text-opacity-40 text-sm font-medium font-['Neue Haas Grotesk Display Pro'] leading-normal ">We work with discerning founders and visionary companies to elevate their user-experience. Join the collective.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => { window.open("https://www.tria.so/sdk", "_blank") }}
                    className="rounded-[78px] mt-0 cursor-pointer px-6 py-2 w-[120px] flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative overflow-hidden"
                  >
                    <div className="flex  flex-row gap-0 items-center justify-center shrink-0 relative ">
                      <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                        Contact
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="mx-7">
                  <div className="text-white flex justify-center my-6 text-opacity-80 text-lg font-light font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight">Get the SDKs</div>
                  <div className="w-full text-center">
                    <span className="text-white flex justify-center text-opacity-90 text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px] tracking-wide">We work with discerning founders and visionary companies to elevate their UX.<br /></span>
                    <span className={`${walletColor === "#FF4E17" ? "orange_gradient_text" : walletColor === "#7D40FF" ? "purple_gradient_text" : walletColor === "#D7FF01" ? "green_gradient_text" : "pink_gradient_text"} text-xl font-semibold font-['Neue Haas Grotesk Display Pro'] leading-[28.80px]`}>Get in touch and join the collective.</span>
                  </div>
                  <div className="flex justify-center mt-5 mb-5">
                    <div
                      onClick={() => { window.open("https://www.tria.so/sdk", "_blank") }}
                      className="rounded-[78px] mt-0 cursor-pointer px-6 py-2 w-[120px] flex flex-row mb-4 gap-0 bg-white text-black hover:text-stone-950 hover:text-opacity-60 hover:transition duration-200 items-center justify-center shrink-0  relative overflow-hidden"
                    >
                      <div className="flex items-center justify-center shrink-0 relative ">
                        <div className=" text-center font-['NeueHaasGroteskDisplayPro-65Medium',_sans-serif] text-sm leading-[120%] font-semibold relative flex items-center justify-center">
                          Contact
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        }

        {/* Launch Tria Mobile */}
        {windowSize.innerWidth < 500 ?
          <div onClick={() => { setLaunchTria(!launchTria); setClicked(!clicked) }} className="mx-4 sticky bottom-4">
            <div className={`relative px-[2px] py-[2px] w-full backdrop-blur-[11.33px] bg-opacity-20 bg-animation-${walletColor === "#FF4E17" ? "orange" : walletColor === "#7D40FF" ? "purple" : walletColor === "#D7FF01" ? "green" : "pink"}`}>
              <div className=" rounded-[78px] z-50 relative bg-black backdrop-blur-[11.33px]  text-white  p-4">
                <div>
                  <div className="text-center text-white text-lg font-semibold font-['Neue Haas Grotesk Display Pro'] leading-snug tracking-tight ">Launch</div>
                </div>
              </div>
            </div>
          </div> : null}
      </div>
    </>
  );
};

export default Home;
