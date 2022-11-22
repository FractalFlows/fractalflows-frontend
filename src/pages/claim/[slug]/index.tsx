import { useEffect } from "react";
import { Stack } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { map, get } from "lodash-es";

import {
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
import { useKnowledgeBits } from "modules/claims/hooks/useKnowledgeBits";
import { useKnowledgeBitsVotes } from "modules/claims/hooks/useKnowledgeBitVotes";
import { useClaims } from "modules/claims/hooks/useClaims";
import { Spinner } from "common/components/Spinner";
import { Container } from "@mui/material";

interface ClaimPageProps {
  claim: ClaimProps;
  relatedClaims: ClaimProps[];
  knowledgeBits: KnowledgeBitProps[];
  userKnowledgeBitVotes: KnowledgeBitVoteProps[];
}

interface ClaimParamsProps {
  slug: string;
}

const Claim: NextPage<ClaimPageProps> = (serverProps) => {
  const { setUserOpinion, setOpinions, getUserOpinion } = useOpinions();
  const { setKnowledgeBits } = useKnowledgeBits();
  const { getUserKnowledgeBitVotes } = useKnowledgeBitsVotes();
  const { setClaim, claim } = useClaims();
  const { setArguments } = useArguments();
  const { isSignedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { slug }: ClaimParamsProps = router.query;

  useEffect(() => {
    setClaim(get(serverProps, "claim"));
    setKnowledgeBits(get(serverProps, "knowledgeBits", []));
    setArguments(get(serverProps, "claim.arguments", []));
    setOpinions(get(serverProps, "claim.opinions", []));
    setUserOpinion({
      acceptance: 0.5,
      arguments: [],
      claim: {
        id: get(serverProps, "claim.id", ""),
      },
    });
  }, [serverProps]);

  useEffect(() => {
    if (isSignedIn && slug) {
      getUserOpinion({ claimSlug: slug }).catch((e: any) =>
        enqueueSnackbar(e?.message, { variant: "error" })
      );
      getUserKnowledgeBitVotes({ claimSlug: slug }).catch((e: any) =>
        enqueueSnackbar(e?.message, { variant: "error" })
      );
    }
  }, [isSignedIn, slug]);

  return (
    <Container className="page">
      <Head>
        <title>{claim?.title}</title>
        <meta property="og:title" content={claim?.title} />
      </Head>

      {router.isFallback ? (
        <Spinner />
      ) : (
        <Stack spacing={14}>
          <ClaimSummary />
          <KnowledgeBits />
          <SocialOpinions />
          <RelatedClaims relatedClaims={get(serverProps, "relatedClaims")} />
        </Stack>
      )}
    </Container>
  );
};

export async function getStaticProps({ params }: { params: ClaimParamsProps }) {
  try {
    const { slug } = params;

    const data = await ClaimsService.getClaim({
      slug,
    });

    return {
      props: data,
      revalidate: 5,
    };
  } catch (e) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const trendingClaims = await ClaimsService.getTrendingClaims({
    offset: 0,
    limit: 10,
  });

  return {
    paths: map(get(trendingClaims, "data"), ({ slug }: ClaimProps) => ({
      params: { slug },
    })),
    fallback: true,
  };
}

export default Claim;
