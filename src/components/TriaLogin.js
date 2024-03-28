import Application from "@tria-sdk/authenticate"
import { useEffect, useRef, useState } from "react"

const TriaLogin = ({
  walletColor,
  reloadFlag,
  launchTria,
  setLaunchTria,
  clicked,
  setClicked,
}) => {
  const walletRef = useRef()
  const [loadAgain, setloadAgain] = useState(false)

  useEffect(() => {
    setloadAgain(true)
    setTimeout(() => {
      setloadAgain(false)
    }, 10)
  }, [reloadFlag])

  function getWindowSize() {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }

  const [windowSize, setWindowSize] = useState(getWindowSize())

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize())
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])
  useEffect(() => {
    function handleClickOutside(event) {
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setLaunchTria(false)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [walletRef])

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
          defaultChain='MUMBAI'
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
            "FUSESPARK",
            "ZKLINK-NOVA",
            "ZKLINK-NOVA-TESTNET",
            "BITLAYER-TESTNET",
          ]}
          uiType='yes'
          litStaging={true}
          triaEnvironment='staging'
          walletEnvironment='staging'
          darkMode={true}
          buttonPosition={{ x: "0vw", y: "0vh" }}
          walletButtonDraggable={false}
          customWalletVisible={launchTria}
          customWalletButton={windowSize.innerWidth > 500 ? false : true}
          analyticsKeys={{
            clientId: "397f3be4-c28f-4ce0-9c05-1afc1f8fa959",
            projectId: "f2ba4e6a-314e-4280-a221-2efe049e5fe1",
          }}
        />
      ) : null}
    </div>
  )
}

export default TriaLogin
