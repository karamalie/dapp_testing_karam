import Application from "@tria-sdk/authenticate";
import { useEffect, useState } from "react";

const TriaLogin = ({ walletColor, reloadFlag }) => {

    const [loadAgain, setloadAgain] = useState(false)

    useEffect(() => {
        setloadAgain(true)
        setTimeout(() => {
            setloadAgain(false)
        }, 10)
    }, [reloadFlag]);


    return (
        <div
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
                triaStaging={true}
                buttonPosition={{ x: "5vw", y: "5vh" }}
                walletButtonDraggable={false}
                clientId="fca5dd50-97af-4296-8fef-781199467c3c"
            /> : null}
        </div>
    );
};

export default TriaLogin;
