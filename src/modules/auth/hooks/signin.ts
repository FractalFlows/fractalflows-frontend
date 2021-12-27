import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import { SignatureType, SiweMessage } from "siwe";

import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";

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

  const ens = (await ethersProvider.lookupAddress(address)) ?? undefined;
  const avatar = (await ethersProvider.getAvatar(address)) ?? undefined;
  const nonce = await AuthService.getNonce();

  const siweMessage = new SiweMessage({
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
    .signMessage(siweMessage.signMessage());
  siweMessage.signature = signature;

  await AuthService.signin({ siweMessage, ens });

  AuthCache.sessionVar({
    siweMessage,
    ens,
    avatar,
  });
  AuthCache.isSignedInVar(true);
};
