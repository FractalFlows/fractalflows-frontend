import { merge } from "lodash-es";

import { AuthCache } from "../../auth/cache";
import { connectEthereumWallet as connectEthereumWalletHelper } from "common/utils/connectEthereumWallet";
import { SettingsService } from "../services/settings";

export const connectEthereumWallet = async () => {
  const { address, ens, avatar } = await connectEthereumWalletHelper();

  await SettingsService.connectEthereumWallet({
    address,
    ens,
    avatar,
  });

  const sessionVar = merge({}, AuthCache.sessionVar(), {
    user: { ethAddress: address },
  });
  AuthCache.sessionVar(sessionVar);
};
