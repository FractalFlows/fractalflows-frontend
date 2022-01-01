import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import { SignatureType, SiweMessage } from "siwe";

import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";

export const signInWithEthereum = async (callback: () => any) => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: "mainnet",
    providerOptions,
  });

  const provider = await web3Modal.connect();
  const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

  const chainId = await ethersProvider
    .getNetwork()
    .then(({ chainId }) => chainId);

  if (
    ethersProvider.connection.url === "metamask" &&
    ethersProvider.provider.request
  ) {
    await ethersProvider.provider.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x1",
        },
      ],
    });
  } else if (chainId !== 1) {
    const closeWallet = (ethersProvider.provider as any).close();
    if (closeWallet) await closeWallet();

    return alert(
      "Unsupported network. Please, switch to Ethereum mainnet and try again."
    );
  }

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

  await AuthService.signInWithEthereum({ siweMessage, ens });

  AuthCache.sessionVar({
    siweMessage,
    ens,
    avatar,
  });
  AuthCache.isSignedInVar(true);

  callback();
};
