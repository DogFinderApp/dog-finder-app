import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { useHamalContext } from "../../../context/useHamalContext";
import { AppTexts } from "../../../consts/texts";

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const { dispatch } = useHamalContext();

  return (
    <Button
      onClick={() => {
        logout({ logoutParams: { returnTo: window.location.origin } });
        dispatch({ type: "REMOVE_HAMAL_USER" });
      }}
    >
      {AppTexts.authPage.logoutCta}
    </Button>
  );
};
