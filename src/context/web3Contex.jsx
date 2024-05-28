import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import ABI from "../abi/BettingDapp.json";
import LoadingSpinner from "../components/LoadingSpinner";
const web3Context = createContext({
  contract: null,
  connected: false,
  provider: null,
  getContract: () => Promise.reject(),
  connectWallet: () => Promise.reject(),
});

export function UserWeb3ContextProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const connectWallet = async () => {
    if (connected) return;
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      await provider.send("eth_requestAccounts");
      setProvider(provider);
      setConnected(true);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ABI.abi,
        signer
      );
      console.log(contract);
      setContract(contract);
    } else {
      console.error("Please install a wallet to interact with the blockchain.");
    }
  };

  //  useEffect(()=>{
  //  })
  const getContract = async () => {
    await connectWallet();
    if (connected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ABI.abi,
        provider
      );
      return contract;
    }
  };

  return (
    <web3Context.Provider
      value={{ contract, connected, provider, getContract, connectWallet }}
    >
      {children}
    </web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(web3Context);
}
