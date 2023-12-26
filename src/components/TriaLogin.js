import Application from "@tria-sdk/authenticate";

const TriaLogin = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                // left: 0,
                zIndex: 89, // can update this to 9999 as well
                height: 0,
                width: 0,
            }}
        >
            <Application
                dappName={"Tria Demo"}
                logo={"https://svgshare.com/i/10zF.svg"}
                dappDomain={window.parent.origin}
                primaryColor="#9A86FF"
                defaultChain="MUMBAI"
                supportedChains={["MUMBAI", "POLYGON"]}
                uiType="yes"
                buttonPosition={{ x: 200, y: 200 }}
                darkMode={true}
            />
        </div>
    );
};

export default TriaLogin;