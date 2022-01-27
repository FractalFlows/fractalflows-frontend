import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import type { NextPage } from "next";

import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";
import { ClaimProps } from "modules/claims/interfaces";
import { useClaims } from "modules/claims/hooks/useClaims";
import { RequireSignIn } from "common/components/RequireSignIn";
import { Container } from "@mui/material";
import { Spinner } from "common/components/Spinner";

const EditClaim: NextPage = RequireSignIn(() => {
  const { getPartialClaim } = useClaims();
  const [claim, setClaim] = useState<ClaimProps>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { slug }: { slug?: string } = router.query;

  useEffect(() => {
    if (slug) {
      getPartialClaim({ slug })
        .then((data) => setClaim(data))
        .catch((e: any) =>
          enqueueSnackbar(e?.message, {
            variant: "error",
          })
        );
    }
  }, [slug]);

  return (
    <Container className="page">
      {claim ? (
        <ClaimUpsertForm
          claim={claim}
          operation={ClaimUpsertFormOperation.UPDATE}
        />
      ) : (
        <Spinner p={0} />
      )}
    </Container>
  );
});

export default EditClaim;
