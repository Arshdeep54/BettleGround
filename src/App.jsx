import {
  BrowserRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./Pages/ProtectedRoutes";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import UserProfile from "./Pages/UserProfile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Notify from "./Pages/Notify";
import Events from "./Pages/Events";
import { UserWeb3ContextProvider } from "./context/web3Contex";
import EventPage from "./Pages/EventPage";
import ABI from './abi/BettingDapp.json'
import { ethers } from "ethers";
import { useEffect, useState } from "react";
function App() {
    const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  // Replace with your actual contract ABI and address
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = ABI.abi

  useEffect(() => {
    const initialize = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const contract = new ethers.Contract(contractAddress, abi, provider);
      setContract(contract);
    };

    if (window.ethereum) {
      initialize();
    } else {
      console.error("MetaMask not detected");
    }
  }, []);

  const contextValue = {
    provider,
    contract,
  };

  
  return (
    <>
      <UserAuthContextProvider>
        <UserWeb3ContextProvider value={contextValue}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/notify" element={<Notify />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:eventID" element={<EventPage />} />
              <Route path="/auth/profile" element={<UserProfile />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </BrowserRouter>{" "}
        </UserWeb3ContextProvider>
      </UserAuthContextProvider>
    </>
  );
}

export default App;
