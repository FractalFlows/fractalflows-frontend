import { merge } from "lodash-es";

import { AuthCache } from "../../auth/cache";
import { connectEthereumWallet as connectEthereumWalletHelper } from "common/utils/connectEthereumWallet";
import { SettingsService } from "../services/settings";
import { reloadSession } from "modules/auth/hooks/session";

export const connectEthereumWallet = async () => {
  const { address, ens, avatar } = await connectEthereumWalletHelper();

  await SettingsService.connectEthereumWallet({
    address,
    ens,
    avatar,
  });

  reloadSession();
};
