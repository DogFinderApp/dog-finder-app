import { MouseEvent } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link, To } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
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

const useNoResultsStyles = createStyleHook(
  (theme, { onlyNewReportButton }: { onlyNewReportButton?: boolean }) => ({
    content: {
      height: "100%",
      width: { sm: "100%", xs: "90%" },
      mt: onlyNewReportButton ? 0 : 3,
      mb: onlyNewReportButton ? 3 : 0,
      mx: "auto",
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
    authRequiredText: {
      position: "absolute",
      bottom: -25,
      color: "white",
      opacity: 0.9,
      width: "100%",
      textAlign: "center",
      fontSize: 13,
    },
  }),
);

export const NoDogs = ({
  dogType,
  onlyNewReportButton,
}: {
  dogType?: DogType;
  onlyNewReportButton?: boolean;
}) => {
  // if `dogType` arg is undefined, it means we use it inside "all-matches" page which doesn't need a dogType

  const { user, loginWithRedirect } = useAuth0();
  const theme = useTheme();
  const styles = useNoResultsStyles({ onlyNewReportButton });
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

  const onLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    navigationRoute: string | number,
  ) => {
    if (!user && navigationRoute === newReportRoute) {
      event.preventDefault();
      // Prevent the link navigation and perform the login with redirect to report page
      loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin + newReportRoute,
        },
      });
    }
  };

  return (
    <Box sx={styles.content}>
      {!onlyNewReportButton && (
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
      )}
      <Box sx={styles.buttonsWrapper}>
        {buttonsData.map(
          (button) =>
            (!onlyNewReportButton ||
              (onlyNewReportButton && button.text === newReportText)) && (
              <Box sx={{ position: "relative" }} key={button.text}>
                <Link
                  to={button.navigationRoute as To}
                  style={{ textDecoration: "none" }}
                  onClick={(event) =>
                    onLinkClick(event, button.navigationRoute)
                  }
                >
                  <Button size="large" variant="contained" sx={styles.button}>
                    <button.icon size={20} />
                    {button.text}
                  </Button>
                </Link>
                {button.text === newReportText && !user && (
                  <Typography sx={styles.authRequiredText}>
                    {noResults.authRequired}
                  </Typography>
                )}
              </Box>
            ),
        )}
      </Box>
    </Box>
  );
};
