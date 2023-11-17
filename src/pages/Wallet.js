import { useState } from "react";
import WalletCloseButton from "../components/WalletCloseButton";

const Wallet = () => {
 const [showWallet, setShowWallet] = useState(true);
 return(
  <>
     {showWallet &&<div id="triaWallet" className="bg flex  justify-between bg-transparent absolute bottom-4 right-2  ">
                <div className="mb-4 mr-2 relative rounded-[20px]">
                  <div className="absolute w-[312px] h-[40px] rounded-[20px] top-[-38px] flex items-end justify-center" >
                    {/* <img src='./WalletCloseButton.svg' alt='' className="cursor-pointer"  onClick={() => {setShowWallet(false)}}/> */}
                    <div className="cursor-pointer" onClick={()=>{setShowWallet(false)}}>
                    <WalletCloseButton/>
                    </div>
                  </div>
                  <div className="h-[586px] w-[312px] rounded-[20px] overflow-hidden">
                  <iframe width="312" height="586" src="https://reliable-semifreddo-e8e93e.netlify.app/eyJ0cmlhTmFtZSI6Im5ha3VsQHRyaWEiLCJ1c2VyQWRkcmVzcyI6IjB4M2JDRjgxM0JEQkUwRGIzRURDQTdjOTAyRUQ4YzFGNzREMDE4NDYyMSIsImFwcERvbWFpbiI6Imh0dHBzOi8vZGFwcC10ZXN0aW5nLW5pbmUudmVyY2VsLmFwcCIsImRhcmtNb2RlIjp0cnVlLCJsb2dvIjoiaHR0cHM6Ly93d3cuZW1waXJlb2ZzaWdodC5jb20vYXNzZXRzL2ltYWdlcy9sb2dvLWljb24uc3ZnIiwiYWNjZXNzVG9rZW4iOm51bGx9" allow="publickey-credentials-get" />
                  </div>
                </div>
              </div>}
              </>
 )
}
export default Wallet