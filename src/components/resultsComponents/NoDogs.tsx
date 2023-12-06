import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { DogType } from "../../types/payload.types";
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
  text: { direction: "rtl", textAlign: "center", textWrap: "balance" },
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

export const NoDogs = ({ dogType }: { dogType?: DogType }) => {
  // if `dogType` arg is undefined, it means we use it inside "all-matches" page which doesn't need a dogType

  const theme = useTheme();
  const styles = useNoResultsStyles();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const { noResults } = AppTexts.resultsPage;
  const { noMatches } = AppTexts.allMatchesPage;

  const title = dogType ? noResults.title : noMatches.title;
  const infoText = dogType ? (
    <>
      {noResults.infoText1}
      {!isMobile && <br />}
      {noResults.infoText2}
    </>
  ) : (
    <>
      {noMatches.infoText1} <br />
      {noMatches.infoText2}
    </>
  );
  const newReportText =
    dogType === DogType.FOUND
      ? noResults.reportDogFound
      : noResults.reportMissingDog;

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
      text: noResults.tryAgain,
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
          sx={styles.text}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          color={theme.palette.text.primary}
          sx={styles.text}
        >
          {infoText}
        </Typography>
      </Box>

      {/* these buttons are only needed in "results" page, if !dogType it means we're in "all-matches" page */}
      {dogType && (
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
      )}
    </Box>
  );
};
