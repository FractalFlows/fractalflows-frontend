import { useCallback, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, Chip, Stack, Box, Typography } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";
import { connectEthereumWallet } from "common/utils/connectEthereumWallet";
import ClaimContractABI from "../../../../artifacts/contracts/Claim.sol/Claim.json";
import { useClaims } from "../hooks/useClaims";
import { ClaimNFTStatuses } from "../interfaces";
import { get, isEmpty } from "lodash-es";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";

export const ClaimNFTStatusBar = () => {
  const { claim, saveClaimMetadataOnIPFS } = useClaims();
  const { session, requireSignIn } = useAuth();
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const canMintNFT =
    isEmpty(get(session, "user")) ||
    (isEmpty(get(session, "user.ethAddress")) === false &&
      get(claim, "user.id") === get(session, "user.id"));

  const handleMintNFT = async () => {
    setIsMintingNFT(true);
    enqueueSnackbar("Saving metadata on IPFS...", {
      variant: "info",
    });

    try {
      const metadataURI = await saveClaimMetadataOnIPFS({ id: claim?.id });
      const tokenURI = metadataURI.replace(/^ipfs:\/\//, "");

      console.log(tokenURI);
      const { ethersProvider } = await connectEthereumWallet();
      const signer = ethersProvider.getSigner();
      const ClaimContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ID as string,
        ClaimContractABI.abi,
        signer
      );

      const claimTxn = await ClaimContract.mintToken(tokenURI);

      enqueueSnackbar("Minting claim NFT...", {
        variant: "info",
      });

      console.log(claimTxn);
      const claimTxnResult = await claimTxn.wait();
      console.log(claimTxnResult);

      // const tokenId = claimTxnResult.events[0].args.tokenId.toString()
    } catch (e) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsMintingNFT(false);
    }
  };

  const NFTStatusChip = useCallback(() => {
    switch (claim.nftStatus) {
      case ClaimNFTStatuses.NOTMINTED:
        return <Chip color="warning" label="Not minted" />;
      case ClaimNFTStatuses.MINTING:
        return <Chip color="info" label="Minting" />;
      case ClaimNFTStatuses.MINTED:
        return <Chip color="success" label="Minted" />;
      default:
        return <></>;
    }
  }, [claim.nftStatus]);

  return (
    <Stack direction="row">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body1">NFT Status:</Typography>
        <NFTStatusChip />
      </Stack>
      <Box flexGrow="1" />
      {claim?.nftStatus === ClaimNFTStatuses.NOTMINTED ? (
        <LoadingButton
          variant="contained"
          // sx={{ marginLeft: 2 }}
          loading={isMintingNFT}
          onClick={requireSignIn(handleMintNFT)}
          disabled={canMintNFT === false}
        >
          Mint NFT
        </LoadingButton>
      ) : null}
    </Stack>
  );
};
