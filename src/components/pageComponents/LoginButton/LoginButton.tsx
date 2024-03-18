import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { AppTexts } from "../../../consts/texts";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const onClick = () =>
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    });

  return <Button onClick={onClick}>{AppTexts.authPage.loginCta}</Button>;
};
