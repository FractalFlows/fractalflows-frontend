import { useEffect } from "react";
import { Box, Stack } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";

import {
  ArgumentSides,
  ClaimProps,
  KnowledgeBitProps,
  KnowledgeBitVoteProps,
  OpinionProps,
} from "modules/claims/interfaces";
import { ClaimsService } from "modules/claims/services/claims";
import { KnowledgeBits } from "modules/claims/components/KnowledgeBits";
import { ClaimSummary } from "modules/claims/components/Summary";
import { SocialOpinions } from "modules/claims/components/SocialOpinions";
import { RelatedClaims } from "modules/claims/components/RelatedClaims";
import { useArguments } from "modules/claims/hooks/useArguments";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { useAuth } from "modules/auth/hooks/useAuth";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import {
  setKnowledgeBits,
  useKnowledgeBits,
} from "modules/claims/hooks/useKnowledgeBits";

interface ClaimPageProps {
  data: {
    claim: ClaimProps;
    relatedClaims: ClaimProps[];
    knowledgeBits: KnowledgeBitProps[];
    userKnowledgeBitsVotes: KnowledgeBitVoteProps[];
  };
}

const Claim: NextPage<ClaimPageProps> = ({
  data: { claim, relatedClaims, knowledgeBits, userKnowledgeBitsVotes },
}) => {
  const { setUserOpinion, setOpinions, getUserOpinion } = useOpinions();
  const { setKnowledgeBits } = useKnowledgeBits();
  const { setArguments } = useArguments();
  const { isSignedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { slug }: { slug?: string } = router.query;

  useEffect(() => {
    setKnowledgeBits(knowledgeBits || []);
    setArguments(claim.arguments || []);
    setOpinions(claim.opinions || []);
    setUserOpinion({
      acceptance: 0.5,
      arguments: [],
      claim: {
        id: claim.id,
      },
    });
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      getUserOpinion({ claimSlug: slug as string }).catch((e) =>
        enqueueSnackbar(e.message, { variant: "error" })
      );
    }
  }, [isSignedIn]);

  return (
    <Box className="container page">
      <Head>
        <title>{claim?.title}</title>
        <meta property="og:title" content={claim?.title} />
      </Head>

      <Stack spacing={14}>
        <ClaimSummary claim={claim} />
        <KnowledgeBits userVotes={userKnowledgeBitsVotes} />
        <SocialOpinions />
        <RelatedClaims relatedClaims={relatedClaims} />
      </Stack>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const data = await ClaimsService.getClaim({
    slug,
  });

  // ClaimsService.getKnowledgeBits({
  //   claimSlug: slug,
  // }),
  // ClaimsService.getUserKnowledgeBitsVotes({
  //   claimSlug: slug,
  // }),

  return {
    props: { data },
  };
}

export default Claim;
