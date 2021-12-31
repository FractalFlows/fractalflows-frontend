import { useSnackbar } from "notistack";

import { TabPanel } from "./TabPanel";

export const Web3Connection = () => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <TabPanel
      title="Web3 Connection"
      description="Use your Ethereum wallet to sign in and access token-based features"
    ></TabPanel>
  );
};
