import { Box, Stack } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";

import type { ClaimProps } from "modules/claims/interfaces";
import { ClaimsService } from "modules/claims/services/claims";
import { KnowledgeBits } from "modules/claims/components/KnowledgeBits";
import { ClaimSummary } from "modules/claims/components/Summary";
import { ConsiderIt } from "modules/claims/components/ConsiderIt";
import { RelatedClaims } from "modules/claims/components/RelatedClaims";

interface ClaimPageProps {
  data: { claim: ClaimProps; relatedClaims: ClaimProps[] };
}

const Claim: NextPage<ClaimPageProps> = ({
  data: { claim, relatedClaims },
}) => {
  return (
    <Box className="container page">
      <Head>
        <title>{claim?.title}</title>
        <meta property="og:title" content={claim?.title} />
      </Head>

      <Stack spacing={14}>
        <ClaimSummary claim={claim} />
        <KnowledgeBits knowledgeBits={claim?.knowledgeBits} />
        <ConsiderIt />
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

  return {
    props: {
      data,
    },
  };
}

export default Claim;
