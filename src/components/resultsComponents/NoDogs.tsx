import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link, To } from "react-router-dom";
import {
  IconArrowLeft,
  IconPlus,
  IconSearch,
  TablerIconsProps,
} from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { DogType } from "../../types/payload.types";
import { AppRoutes } from "../../consts/routes";
import { AppTexts } from "../../consts/texts";

const useNoResultsStyles = createStyleHook(() => ({
  content: {
    height: "100%",
    width: { sm: "100%", xs: "90%" },
    mt: 4,
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
    width: "100%",
  },
}));

export const NoDogs = ({ dogType }: { dogType?: DogType }) => {
  // if `dogType` arg is undefined, it means we use it inside "all-matches" page which doesn't need a dogType

  const theme = useTheme();
  const styles = useNoResultsStyles();
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
      ? noResults.reportMissingDog
      : noResults.reportDogFound;

  const newReportRoute =
    dogType === DogType.FOUND
      ? AppRoutes.dogs.reportLost
      : AppRoutes.dogs.reportFound;

  const tryAgainRoute =
    dogType === DogType.FOUND
      ? AppRoutes.dogs.searchFoundDog
      : AppRoutes.dogs.searchLostDog;

  interface ButtonData {
    text: string;
    icon: (props: TablerIconsProps) => JSX.Element;
    navigationRoute: string | number;
  }

  const buttonsData: ButtonData[] = dogType
    ? [
        // search page + all report page
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
      ]
    : [
        // all matches page
        {
          text: AppTexts.dogDetails.backButton,
          navigationRoute: -1,
          icon: IconArrowLeft,
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
      <Box sx={styles.buttonsWrapper}>
        {buttonsData.map((button) => (
          <Link
            key={button.text}
            to={button.navigationRoute as To}
            style={{ textDecoration: "none" }}
          >
            <Button size="large" variant="contained" sx={styles.button}>
              <button.icon size={20} />
              {button.text}
            </Button>
          </Link>
        ))}
      </Box>
    </Box>
  );
};
