import { useEffect } from "react";
import { Container } from "@mui/material";
import { isEmpty } from "lodash-es";

import { useApp } from "modules/app/useApp";
import { useAuth } from "modules/auth/hooks/useAuth";
import { Spinner } from "./Spinner";

export const RequireSignIn =
  (Component) =>
  (...props) => {
    const { setIsSignInDialogOpen } = useApp();
    const { session, isLoadingSession } = useAuth();

    useEffect(() => {
      if (isLoadingSession === false && isEmpty(session)) {
        setIsSignInDialogOpen(true);
      }
    }, [isLoadingSession, session]);

    if (isLoadingSession) {
      return (
        <Container className="page">
          <Spinner />
        </Container>
      );
    } else if (isEmpty(session)) {
      return <Container className="page" />;
    } else {
      return <Component {...props} />;
    }
  };
