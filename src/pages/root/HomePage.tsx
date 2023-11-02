import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, ButtonOwnProps, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { IconPaw, IconSearch, TablerIconsProps } from "@tabler/icons-react";
import { Player } from "@lottiefiles/react-lottie-player";
import { useWindowSize } from "../../hooks/useWindowSize";
import usePageTitle from "../../hooks/usePageTitle";
import { createStyleHook } from "../../hooks/styleHooks";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";
import dogAnim from "../../assets/animations/dogAnim.json";

const useHomePageStyles = createStyleHook((theme) => {
  return {
    root: {
      display: "flex",
      height: "100%",
      alignItems: "center",
      justifyContent: { xs: "center", sm: "flex-start" },
      flexDirection: "column",
    },
    content: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },
    noUser: {
      // the svg container is taking a lot of space (twice the size of the actual svg),
      // so we display this section with absolute position and overlap the container
      position: "absolute",
      top: { sm: "25rem", xs: "20rem" },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    },
    pushRight: {
      marginRight: 3,
    },
    pushLeft: {
      marginLeft: 3,
    },
    button: {
      width: 240,
      height: 45,
    },
    typography: {
      color: "white",
      textAlign: "center",
    },
    footer: {
      position: "absolute",
      bottom: "2rem",
      width: "90%",
      direction: "rtl",
      color: "white",
      opacity: 0.7,
      textAlign: "center",
      fontSize: 14,
      textWrap: "balance",
    },
  };
});

export const HomePage = () => {
  const styles = useHomePageStyles();
  const windowSize = useWindowSize();
  const { innerWidth } = windowSize;
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  usePageTitle(isAuthenticated ? "Dog Finder" : AppTexts.homePage.noUser.title);

  const commonButtonProps: ButtonOwnProps = {
    size: "large",
    variant: "contained",
    sx: styles.button,
  };

  const commonIconProps: TablerIconsProps = {
    style: { marginRight: innerWidth < 600 ? "auto" : "8px" },
    stroke: 1.5,
  };

  const linkStyles = {
    width: innerWidth < 600 ? "100%" : "max-content",
    color: "white",
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <PageContainer>
      <Box sx={styles.root}>
        <Player
          autoplay={true}
          src={dogAnim}
          loop={true}
          style={{ width: innerWidth >= 800 ? "400px" : "300px" }}
        />
        {isLoading || isAuthenticated ? (
          <Box sx={styles.content}>
            <Link to={AppRoutes.dogs.searchLostDog} style={linkStyles}>
              <Button {...commonButtonProps}>
                <IconSearch {...commonIconProps} />
                {AppTexts.homePage.cta.lostDog}
              </Button>
            </Link>
            <Link to={AppRoutes.dogs.reportFound} style={linkStyles}>
              <Button {...commonButtonProps}>
                <IconPaw {...commonIconProps} />
                {AppTexts.homePage.cta.foundDog}
              </Button>
            </Link>
          </Box>
        ) : (
          <>
            <Box sx={styles.noUser}>
              <Typography variant="h5" sx={styles.typography}>
                {AppTexts.homePage.noUser.welcomeMessage1} <br />
                {AppTexts.homePage.noUser.welcomeMessage2}
              </Typography>
              <Button
                {...commonButtonProps}
                onClick={() => loginWithRedirect()}
              >
                {AppTexts.homePage.noUser.cta}
              </Button>
            </Box>
            <Typography sx={styles.footer}>
              {AppTexts.homePage.noUser.footer1}{" "}
              <Link
                to={AppRoutes.privacyPolicy}
                style={{ color: "white" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {AppTexts.homePage.noUser.footer2}
              </Link>{" "}
              {AppTexts.homePage.noUser.footer3}
            </Typography>
          </>
        )}
      </Box>
    </PageContainer>
  );
};
