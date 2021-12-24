import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import { SignatureType, SiweMessage } from "siwe";

import { AuthService } from "../services/auth";

export const signin = async () => {
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
    // cacheProvider: true,
    providerOptions,
  });

  const provider = await web3Modal.connect();
  const ethersProvider = new ethers.providers.Web3Provider(provider);

  const [address] = await ethersProvider.listAccounts();
  if (!address) {
    throw new Error("Ethereum address not found.");
  }

  const {
    data: { nonce },
  } = await AuthService.getNonce();

  const message = new SiweMessage({
    domain: document.location.host,
    address,
    chainId: `${await ethersProvider
      .getNetwork()
      .then(({ chainId }) => chainId)}`,
    uri: document.location.origin,
    version: "1",
    statement: `I accept the Fractal Flows Terms of Service: ${window.location.origin}/tos`,
    type: SignatureType.PERSONAL_SIGNATURE,
    nonce,
  });

  const signature = await ethersProvider
    .getSigner()
    .signMessage(message.signMessage());
  message.signature = signature;

  await AuthService.signin();

  console.log(ethersProvider);
  console.log(nonce);
  console.log(message);
};
