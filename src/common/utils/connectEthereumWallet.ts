interface ConnectEthereumWalletResultProps {
  address: string;
  ens?: string;
  avatar?: string;
  ethersProvider: any;
}

export const connectEthereumWallet = async (): Promise<ConnectEthereumWalletResultProps> => {
  const { ethers } = await import("ethers");
  const Web3Modal = (await import("web3modal")).default;
  const WalletConnect = (await import("@walletconnect/web3-provider")).default;

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

  // if (process.env.NODE_ENV === "production") {
  //   if (
  //     ethersProvider.connection.url === "metamask" &&
  //     ethersProvider.provider.request
  //   ) {
  //     await ethersProvider.provider.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [
  //         {
  //           chainId: "0x1",
  //         },
  //       ],
  //     });
  //   } else if (chainId !== 1) {
  //     const closeWallet = (ethersProvider.provider as any).close();
  //     if (closeWallet) await closeWallet();

  //     throw new Error(
  //       "Unsupported network. Please, switch to Ethereum mainnet and try again."
  //     );
  //   }
  // }

  const [address] = await ethersProvider.listAccounts();
  if (!address) {
    throw new Error("Ethereum address not found.");
  }

  try {
    const ens = (await ethersProvider.lookupAddress(address)) ?? undefined;
    const avatar = (await ethersProvider.getAvatar(address)) ?? undefined;

    return {
      address,
      ens,
      avatar,
      ethersProvider,
    };
  } catch (error) {
    return {
      address,
      ethersProvider,
    };
  }
};
