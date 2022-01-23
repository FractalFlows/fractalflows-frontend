import { SignatureType, SiweMessage } from "siwe";

import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";
import { connectEthereumWallet } from "common/utils/connectEthereumWallet";
import { reloadSession } from "./session";

export const signInWithEthereum = async (callback: () => any) => {
  const { address, ens, avatar, ethersProvider } =
    await connectEthereumWallet();
  const nonce = await AuthService.getNonce();

  const siweMessage = new SiweMessage({
    domain: document.location.host,
    address,
    chainId: `${await ethersProvider
      .getNetwork()
      .then(({ chainId }) => chainId)}`,
    uri: document.location.origin,
    version: "1",
    statement: "Fractal Flows sign in",
    type: SignatureType.PERSONAL_SIGNATURE,
    nonce,
  });

  const signature = await ethersProvider
    .getSigner()
    .signMessage(siweMessage.signMessage());
  siweMessage.signature = signature;

  await AuthService.signInWithEthereum({
    siweMessage,
    ens,
    avatar,
  });
  await reloadSession();

  callback();
};
