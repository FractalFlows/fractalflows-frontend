import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { isEmpty } from "lodash-es";

import { useAuth } from "modules/auth/hooks/useAuth";
import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";
import { ClaimProps } from "modules/claims/interfaces";
import { useClaims } from "modules/claims/hooks/useClaims";
import { Spinner } from "common/components/Spinner";
import { Box } from "@mui/material";
import { Container } from "@mui/material";

const EditClaim: NextPage = () => {
  const { session } = useAuth();
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
};

export default EditClaim;
