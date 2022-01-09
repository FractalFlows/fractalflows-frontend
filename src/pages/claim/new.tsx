import type { NextPage } from "next";
import { isEmpty } from "lodash-es";

import { useAuth } from "modules/auth/hooks/useAuth";
import { AuthWall } from "common/components/AuthWall";
import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";

const NewClaim: NextPage = () => {
  const { session } = useAuth();

  if (isEmpty(session)) return <AuthWall />;

  return <ClaimUpsertForm operation={ClaimUpsertFormOperation.CREATE} />;
};

export default NewClaim;
