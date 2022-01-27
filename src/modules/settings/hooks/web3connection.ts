import { connectEthereumWallet as connectEthereumWalletHelper } from "common/utils/connectEthereumWallet";
import { SettingsService } from "../services/settings";
import { reloadSession } from "modules/auth/hooks/useAuth";

export const connectEthereumWallet = async () => {
  const { address, ens, avatar } = await connectEthereumWalletHelper();

  await SettingsService.connectEthereumWallet({
    address,
    ens,
    avatar,
  });

  reloadSession();
};
