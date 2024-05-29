import { ethers } from 'ethers';
import { createContext, useState, useContext } from 'react';

const web3Context = createContext({
  provider: null,
  contract: null,
});

export function UserWeb3ContextProvider ({ children })  {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // Functions to initialize provider and contract (replace with your logic)
  const initializeProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  };

  const initializeContract = async (abi, contractAddress) => {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    setContract(contract);
  };

  
  return (
    <web3Context.Provider
      value={{ provider, contract, initializeProvider, initializeContract }}
    >
      {children}
    </web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(web3Context);
}



