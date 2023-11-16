import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography } from "@mui/material";
import { LoginButton } from "../LoginButton/LoginButton";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { createStyleHook } from "../../../hooks/styleHooks";
import { PageImage } from "../PageImage/PageImage";

const useUserComponentStyles = createStyleHook(() => {
  return {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      columnGap: "20px",
      position: "absolute",
      right: 20,
    },
  };
});

const UserComponent = () => {
  const { user, isAuthenticated } = useAuth0();
  const styles = useUserComponentStyles();

  if (!isAuthenticated) {
    return (
      <Box sx={styles.root}>
        <LoginButton />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={styles.root}>
      {user.picture && (
        <PageImage src={user.picture} alt={user?.name ?? "user-photo"} />
      )}
      <Typography variant="body2">{user.name}</Typography>
      <LogoutButton />
    </Box>
  );
};

export default UserComponent;
