import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { isEmpty } from "lodash-es";

import { useAuth } from "modules/auth/hooks/useAuth";
import { AuthWall } from "common/components/AuthWall";
import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";
import { ClaimProps } from "modules/claims/interfaces";
import { useClaims } from "modules/claims/hooks/useClaims";
import { Spinner } from "common/components/Spinner";

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
        .catch((e) =>
          enqueueSnackbar(e.message, {
            variant: "error",
          })
        );
    }
  }, [slug]);

  if (isEmpty(session)) return <AuthWall />;

  return claim ? (
    <ClaimUpsertForm
      claim={claim}
      operation={ClaimUpsertFormOperation.UPDATE}
    />
  ) : (
    <Spinner />
  );
};

export default EditClaim;
