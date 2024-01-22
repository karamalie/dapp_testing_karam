import Application from "@tria-sdk/authenticate";
import { useEffect, useState } from "react";

const TriaLogin = ({ walletColor, reloadFlag, launchTria, clicked, setClicked }) => {

    const [loadAgain, setloadAgain] = useState(false)

    useEffect(() => {
        setloadAgain(true)
        setTimeout(() => {
            setloadAgain(false)
        }, 10)
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

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    return (
        <div
            onClick={() => setClicked(!clicked)}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 89, // can update this to 9999 as well
                height: 0,
                width: 0,
            }}
        >
            {!loadAgain ? <Application
                dappName={"Tria Demo"}
                logo={"https://svgshare.com/i/11sN.svg"}
                dappDomain={window.parent.origin}
                primaryColor={walletColor}
                defaultChain="MUMBAI"
                supportedChains={["MUMBAI", "POLYGON", "METIS", "METIS-TESTNET", "MANTLE", "MANTA-TESTNET", "MANTA", "MANTLE-TESTNET", "FUSE", "ETH", "BINANCE", "OPTIMISM", "ARBITRUM", "AVALANCHE", "FANTOM"]}
                uiType="yes"
                darkMode={true}
                buttonPosition={{ x: "0vw", y: "0vh" }}
                walletButtonDraggable={false}
                triaStaging={true}
                customWalletVisible={launchTria}
                customWalletButton={windowSize.innerWidth > 500 ? false : true}
            /> : null}
        </div>
    );
};

export default TriaLogin;
