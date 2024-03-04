import Application from "@tria-sdk/authenticate";
import { useEffect, useRef, useState } from "react";

const TriaLogin = ({
  walletColor,
  reloadFlag,
  launchTria,
  setLaunchTria,
  clicked,
  setClicked,
}) => {
  const walletRef = useRef();
  const [loadAgain, setloadAgain] = useState(false);

  useEffect(() => {
    setloadAgain(true);
    setTimeout(() => {
      setloadAgain(false);
    }, 10);
  }, [reloadFlag]);

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
  useEffect(() => {
    function handleClickOutside(event) {
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setLaunchTria(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [walletRef]);

  return (
    <div
      onClick={() => setClicked(!clicked)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 89, // can update this to 9999 as well
        height: 0,
        width: 0,
      }}
      ref={walletRef}
    >
      {!loadAgain ? (
        <Application
          dappName={"Tria Demo"}
          logo={"https://svgshare.com/i/11sN.svg"}
          dappDomain={window.parent.origin}
          primaryColor={walletColor}
          defaultChain="MUMBAI"
          supportedChains={[
            "MUMBAI",
            "POLYGON",
            "METIS",
            "METIS-TESTNET",
            "MANTLE",
            "MANTA-TESTNET",
            "MANTA",
            "MANTLE-TESTNET",
            "FUSE",
            "ETH",
            "BINANCE",
            "OPTIMISM",
            "ARBITRUM",
            "AVALANCHE",
            "FANTOM",
            "SOLANA",
          ]}
          uiType="yes"
          litStaging={true}
          darkMode={true}
          buttonPosition={{ x: "0vw", y: "0vh" }}
          walletButtonDraggable={false}
          customWalletVisible={launchTria}
          customWalletButton={windowSize.innerWidth > 500 ? false : true}
          clientId="fca5dd50-97af-4296-8fef-781199467c3c"
          AnalyticsKeys = {{
            clientId: "1c0fd605-f945-4514-90a5-1a722556a928",
            projectId: "6ea5eb88-394a-4f05-8272-892f9a020652"
          }}
        />
      ) : null}
    </div>
  );
};

export default TriaLogin;
