import type { NextPage } from "next";
import { Container } from "@mui/material";

import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";
import { RequireSignIn } from "common/components/RequireSignIn";

const NewClaim: NextPage = RequireSignIn(() => {
  return (
    <Container className="page">
      <ClaimUpsertForm operation={ClaimUpsertFormOperation.CREATE} />
    </Container>
  );
});

export default NewClaim;
