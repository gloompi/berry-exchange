import { useContext, createContext } from 'react';
import Web3 from 'web3';

const Web3Context = createContext({});

export const Web3Provider = ({ children }) => {
  if (typeof window.ethereum === 'undefined') {
    window.alert('Please install MetaMask');
    window.location.assign("https://metamask.io/");
    return null;
  }

  const web3 = new Web3(window.ethereum || "ws://localhost:8545");

  return (
    <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>
  )
};

export default () => {
  const store = useContext(Web3Context);

  if (!store) {
    throw new Error('Define `Web3Provider` higher up in the tree');
  }

  return store;
}
