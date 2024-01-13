import { Box } from "@mui/material";
import { Player } from "@lottiefiles/react-lottie-player";
import { useWindowSize } from "../../hooks/useWindowSize";
import usePageTitle from "../../hooks/usePageTitle";
import { createStyleHook } from "../../hooks/styleHooks";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { StartFlowButtons } from "../../components/StartFlowButtons/StartFlowButtons";
import dogAnim from "../../assets/animations/dogAnim.json";

const useHomePageStyles = createStyleHook(() => ({
  root: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: { xs: "center", sm: "flex-start" },
    flexDirection: "column",
  },
}));

export const HomePage = () => {
  const styles = useHomePageStyles();
  const { innerWidth } = useWindowSize();
  usePageTitle("Fluffy Finder");

  return (
    <PageContainer>
      <Box sx={styles.root}>
        <Player
          autoplay
          src={dogAnim}
          loop
          style={{ width: innerWidth >= 800 ? "400px" : "300px" }}
        />
        <StartFlowButtons />
      </Box>
    </PageContainer>
  );
};
