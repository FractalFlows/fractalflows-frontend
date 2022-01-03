import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";

interface ConnectEthereumWalletResultProps {
  address: string;
  ens?: string;
  avatar?: string;
  ethersProvider: ethers.providers.Web3Provider;
}

export const connectEthereumWallet =
  async (): Promise<ConnectEthereumWalletResultProps> => {
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

      throw new Error(
        "Unsupported network. Please, switch to Ethereum mainnet and try again."
      );
    }

    const [address] = await ethersProvider.listAccounts();
    if (!address) {
      throw new Error("Ethereum address not found.");
    }

    const ens = (await ethersProvider.lookupAddress(address)) ?? undefined;
    const avatar = (await ethersProvider.getAvatar(address)) ?? undefined;

    return {
      address,
      ens,
      avatar,
      ethersProvider,
    };
  };
