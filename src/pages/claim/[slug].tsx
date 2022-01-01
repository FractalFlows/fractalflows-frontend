import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box } from "@mui/material";
import type { NextPage } from "next";

import { useClaims } from "modules/claims/hooks/useClaims";
import { Claim } from "modules/claims/interfaces";

const Claim: NextPage = () => {
  const { getClaim } = useClaims();
  const [claim, setClaim] = useState<Claim>({} as Claim);
  const router = useRouter();
  const { slug }: { slug?: string } = router.query;

  useEffect(() => {
    if (slug) {
      getClaim({ slug }).then((claim) => setClaim(claim));
    }
  }, [slug, getClaim]);

  return (
    <Box className="container page">
      <Typography variant="h3" component="h1">
        {claim.title}
      </Typography>
      <Typography variant="body1">{claim.summary}</Typography>
    </Box>
  );
};

export default Claim;
