import { useCallback, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Chip, Stack, Typography } from "@mui/material";
import { get, isEmpty } from "lodash-es";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";

import { useAuth } from "modules/auth/hooks/useAuth";
import { connectEthereumWallet } from "common/utils/connectEthereumWallet";
import ClaimContractABI from "../../../../artifacts/contracts/Claim.sol/Claim.json";
import { useClaims } from "../hooks/useClaims";
import { ClaimNFTStatuses } from "../interfaces";
import { Link } from "common/components/Link";

export const ClaimNFTStatusBar = () => {
  const {
    claim,
    saveClaimMetadataOnIPFS,
    saveClaimTxId,
    setClaimNFTAsMinted,
  } = useClaims();
  const { session, requireSignIn } = useAuth();
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleMintNFT = async () => {
    setIsMintingNFT(true);
    enqueueSnackbar("Saving metadata on IPFS...", {
      variant: "info",
    });

    try {
      const metadataURI = await saveClaimMetadataOnIPFS({ id: claim?.id });
      const tokenURI = metadataURI.replace(/^ipfs:\/\//, "");

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

      saveClaimTxId({ id: claim?.id, txId: claimTxn.hash });

      const claimTxnResult = await claimTxn.wait();

      const transferEvent = claimTxnResult.events.find(
        ({ event }: any) => event === "Transfer"
      );

      const tokenId = transferEvent.args[2].toString();
      const fractionalizationContractAddress = transferEvent.args[1];

      setClaimNFTAsMinted({ tokenId, fractionalizationContractAddress });
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
    <Stack direction="row" spacing={{ xs: 8, md: 3 }} alignItems="center">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body1">NFT Status:</Typography>
        <NFTStatusChip />
      </Stack>

      {claim?.nftStatus === ClaimNFTStatuses.MINTING ||
      claim?.nftStatus === ClaimNFTStatuses.MINTED ? (
        <Stack direction="row">
          <Typography variant="body1">TxId:</Typography>
          &nbsp;
          <Typography variant="body1" noWrap sx={{ maxWidth: 120 }}>
            <Link
              href={`${process.env.NEXT_PUBLIC_ETH_EXPLORER_URL}/tx/${claim?.nftTxId}`}
              text
              blank
            >
              {claim?.nftTxId}
            </Link>
          </Typography>
        </Stack>
      ) : null}

      {claim?.nftStatus === ClaimNFTStatuses.MINTED ? (
        <Stack direction="row">
          <Typography variant="body1" sx={{ display: "flex" }}>
            Token ID:
          </Typography>
          &nbsp;
          <Typography variant="body1" noWrap sx={{ maxWidth: 120 }}>
            <Link
              href={`${process.env.NEXT_PUBLIC_ETH_EXPLORER_URL}/token/${process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ID}?a=${claim?.nftTokenId}`}
              text
              blank
            >
              {claim?.nftTokenId}
            </Link>
          </Typography>
        </Stack>
      ) : null}

      {claim?.nftStatus === ClaimNFTStatuses.MINTED ? (
        <Stack direction="row">
          <Typography variant="body1" sx={{ display: "flex" }}>
            Fractionalization Contract:
          </Typography>
          &nbsp;
          <Typography variant="body1" noWrap sx={{ maxWidth: 120 }}>
            <Link
              href={`${process.env.NEXT_PUBLIC_ETH_EXPLORER_URL}/address/${claim?.nftFractionalizationContractAddress}`}
              text
              blank
            >
              {claim?.nftFractionalizationContractAddress}
            </Link>
          </Typography>
        </Stack>
      ) : null}
      {claim?.nftStatus === ClaimNFTStatuses.NOTMINTED ? (
        <LoadingButton
          variant="contained"
          loading={isMintingNFT}
          onClick={requireSignIn(handleMintNFT)}
        >
          Mint NFT
        </LoadingButton>
      ) : null}
    </Stack>
  );
};
