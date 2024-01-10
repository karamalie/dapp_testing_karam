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
                logo={"https://svgshare.com/i/10zF.svg"}
                dappDomain={window.parent.origin}
                primaryColor={walletColor}
                defaultChain="MUMBAI"
                supportedChains={["MUMBAI", "POLYGON"]}
                uiType="yes"
                buttonPosition={{ x: 200, y: 200 }}
                darkMode={true}
            /> : null}
        </div>
    );
};

export default TriaLogin;