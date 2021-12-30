import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box } from "@mui/material";
import type { NextPage } from "next";

import { useClaims } from "modules/claims/hooks/useClaims";

const Claim: NextPage = () => {
  const { loadClaim } = useClaims();
  const [claim, setClaim] = useState<Claim>({});
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      loadClaim({ slug }).then((claim) => setClaim(claim));
    }
  }, [slug]);

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
