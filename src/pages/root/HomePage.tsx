import { Box, Button, ButtonOwnProps } from "@mui/material";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { createStyleHook } from "../../hooks/styleHooks";
import { AppTexts } from "../../consts/texts";
import { IconPaw, IconSearch, TablerIconsProps } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../consts/routes";
import { Player } from "@lottiefiles/react-lottie-player";
import dogAnim from "../../assets/animations/dogAnim.json";
import { useWindowSize } from "../../hooks/useWindowSize";
import usePageTitle from "../../hooks/usePageTitle";

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
      gap: "24px",
    },
    pushRight: {
      marginRight: "24px",
    },
    pushLeft: {
      marginLeft: "24px",
    },
    button: {
      width: "240px",
    },
  };
});

export const HomePage = () => {
  usePageTitle("Dog Finder");
  const styles = useHomePageStyles();
  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const commonButtonProps: ButtonOwnProps = {
    size: "large",
    variant: "contained",
    sx: styles.button,
  };

  const commonIconProps: TablerIconsProps = {
    style: { marginRight: "8px" },
    stroke: 1.5,
  };

  return (
    <PageContainer>
      <Box sx={styles.root}>
        <Player
          autoplay={true}
          src={dogAnim}
          loop={true}
          style={{
            width: windowSize.innerWidth >= 800 ? "450px" : "300px",
          }}
        />
        <Box sx={styles.content}>
          <Button
            {...commonButtonProps}
            onClick={() => navigate(AppRoutes.dogs.searchLostDog)}
          >
            <IconSearch {...commonIconProps} />
            {AppTexts.homePage.cta.lostDog}
          </Button>
          <Button
            {...commonButtonProps}
            onClick={() => navigate(AppRoutes.dogs.reportFound)}
          >
            <IconPaw {...commonIconProps} />
            {AppTexts.homePage.cta.foundDog}
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};
