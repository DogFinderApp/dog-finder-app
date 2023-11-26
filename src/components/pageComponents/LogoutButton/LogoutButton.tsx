import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { useAuthContext } from "../../../context/useAuthContext";
import { AppTexts } from "../../../consts/texts";

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const { dispatch } = useAuthContext();

  return (
    <Button
      onClick={() => {
        logout({ logoutParams: { returnTo: window.location.origin } });
        dispatch({ type: "LOGOUT" });
      }}
    >
      {AppTexts.authPage.logoutCta}
    </Button>
  );
};
