import { FC } from "react";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

import { useTwitter } from "modules/twitter/useTwitter";
import { useRouter } from "next/router";

interface ConnectTwitterProps {
  callbackOperation?: string;
}

export const ConnectTwitter: FC<ConnectTwitterProps> = ({
  callbackOperation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { requestOAuthUrl } = useTwitter();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleConnectTwitterClick = async () => {
    setIsLoading(true);

    try {
      const oauthUrl = await requestOAuthUrl({
        callbackUrl: encodeURI(
          `${
            window.location.hostname === "localhost"
              ? window.location.origin.replace("localhost", "127.0.0.1")
              : window.location.origin
          }/twitter/connect/callback/?callbackPathname=${
            window.location.pathname
          }${
            callbackOperation ? `?callbackOperation=${callbackOperation}` : ""
          }`
        ),
      });
      window.location.href = oauthUrl;
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      variant="contained"
      size="large"
      loading={isLoading}
      onClick={handleConnectTwitterClick}
    >
      Connect Twitter account
    </LoadingButton>
  );
};
