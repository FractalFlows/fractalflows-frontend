import type { NextPage } from "next";
import { isEmpty } from "lodash-es";
import { Container, Box } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";
import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";

const NewClaim: NextPage = () => {
  const { session } = useAuth();

  return (
    <Container className="page">
      <ClaimUpsertForm operation={ClaimUpsertFormOperation.CREATE} />
    </Container>
  );
};

export default NewClaim;
