import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { DogType } from "../../facades/payload.types";
import { AppRoutes } from "../../consts/routes";
import { AppTexts } from "../../consts/texts";

const useNoResultsStyles = createStyleHook(() => ({
  content: {
    height: "100%",
    width: { sm: "100%", xs: "90%" },
    position: "absolute",
    top: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 1,
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    mt: 4,
  },
  text: { direction: "rtl", textAlign: "center" },
  buttonsWrapper: {
    display: "flex",
    flexDirection: { sm: "row", xs: "column-reverse" },
    gap: { sm: 4, xs: 2.5 },
  },
  button: {
    display: "flex",
    gap: 2,
  },
}));

export const NoDogs = ({ dogType }: { dogType: DogType }) => {
  const theme = useTheme();
  const styles = useNoResultsStyles();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const newReportText =
    dogType === DogType.FOUND
      ? AppTexts.resultsPage.noResults.reportDogFound
      : AppTexts.resultsPage.noResults.reportMissingDog;

  const newReportRoute =
    dogType === DogType.FOUND
      ? AppRoutes.dogs.reportFound
      : AppRoutes.dogs.reportLost;

  const tryAgainRoute =
    dogType === DogType.FOUND
      ? AppRoutes.dogs.searchFoundDog
      : AppRoutes.dogs.searchLostDog;

  const buttonsData = [
    {
      text: newReportText,
      navigationRoute: newReportRoute,
      icon: IconPlus,
    },
    {
      text: AppTexts.resultsPage.noResults.tryAgain,
      navigationRoute: tryAgainRoute,
      icon: IconSearch,
    },
  ];

  return (
    <Box sx={styles.content}>
      <Box sx={styles.textWrapper}>
        <Typography
          variant="h3"
          color={theme.palette.text.primary}
          fontSize={40}
        >
          {AppTexts.resultsPage.noResults.title}
        </Typography>
        <Typography
          variant="h5"
          color={theme.palette.text.primary}
          sx={styles.text}
        >
          {AppTexts.resultsPage.noResults.infoText1}
          {!isMobile && <br />}
          {AppTexts.resultsPage.noResults.infoText2}
        </Typography>
      </Box>
      <Box sx={styles.buttonsWrapper}>
        {buttonsData.map((button) => (
          <Button
            key={button.text}
            size="large"
            variant="contained"
            sx={styles.button}
            onClick={() => navigate(button.navigationRoute)}
          >
            <button.icon size={20} />
            {button.text}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
