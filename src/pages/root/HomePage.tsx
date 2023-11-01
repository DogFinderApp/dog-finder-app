import { Box, Button, ButtonOwnProps } from "@mui/material";
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
  };
});

export const HomePage = () => {
  usePageTitle("Dog Finder");
  const styles = useHomePageStyles();
  const windowSize = useWindowSize();
  const { innerWidth } = windowSize;

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
          style={{ width: innerWidth >= 800 ? "450px" : "300px" }}
        />
        <Box sx={styles.content}>
          <Button {...commonButtonProps}>
            <Link to={AppRoutes.dogs.searchLostDog} style={linkStyles}>
              <IconSearch {...commonIconProps} />
              {AppTexts.homePage.cta.lostDog}
            </Link>
          </Button>
          <Button {...commonButtonProps}>
            <Link to={AppRoutes.dogs.reportFound} style={linkStyles}>
              <IconPaw {...commonIconProps} />
              {AppTexts.homePage.cta.foundDog}
            </Link>
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};
