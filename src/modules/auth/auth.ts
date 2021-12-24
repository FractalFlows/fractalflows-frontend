import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";

export const connectWallet = async () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
  });

  const provider = await web3Modal.connect();

  const ethersProvider = new ethers.providers.Web3Provider(provider);

  console.log(ethersProvider);
};
