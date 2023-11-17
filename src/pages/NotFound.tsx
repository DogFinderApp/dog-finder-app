import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createStyleHook } from "../hooks/styleHooks";
import usePageTitle from "../hooks/usePageTitle";
import { useWindowSize } from "../hooks/useWindowSize";
import { PageTitle } from "../components/pageComponents/PageTitle/PageTitle";
import NotFoundImage from "../assets/svg/404.svg";

const useNotFoundStyles = createStyleHook(() => ({
  pageContainer: {
    height: "100vh",
    width: { sm: "100vw", xs: "90vw" },
    position: "absolute",
    inset: 0,
    mx: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  button: { width: 150, fontSize: 18, my: 2.5 },
}));

export const NotFound = () => {
  const styles = useNotFoundStyles();

  const title = "העמוד אינו קיים";
  usePageTitle(title);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { innerWidth } = useWindowSize();
  const isMobile = innerWidth < 600;

  return (
    <Box sx={styles.pageContainer}>
      <PageTitle text={title} fontSize={40} fontWeight={500} />
      <img
        src={NotFoundImage}
        alt="Not Found"
        style={{ maxWidth: isMobile ? 350 : 400 }}
      />
      <Button variant="contained" onClick={goBack} sx={styles.button}>
        חזור אחורה
      </Button>
    </Box>
  );
};
