import Home from "./pages/Home";
import { useTriaConnector } from "@tria-sdk/connect";

function App() {
  
  const { globalData } = useTriaConnector({ walletUrl: "https://auth-7rin.vercel.app" });
  return (
    <div className="bg-black h-[100vh] w-[100vw]">
      <Home/>
    </div>
  );
}

export default App;
