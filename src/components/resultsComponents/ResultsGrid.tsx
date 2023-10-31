import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogResult, DogType } from "../../facades/payload.types";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";
import { DogCard } from "./DogCard";

const useResultsStyles = createStyleHook(() => {
  return {
    buttonContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pb: 4,
    },
    button: { display: "flex", gap: 1 },
    topTextStyle: {
      width: "100%",
      fontSize: 20,
      lineHeight: "25px",
      mb: 4,
      direction: "rtl",
    },
  };
});

export const ResultsGrid = ({
  results,
  dogType,
}: {
  results: DogResult[] | undefined;
  dogType: DogType;
}) => {
  const navigate = useNavigate();
  const styles = useResultsStyles();
  const theme = useTheme();

  const navigateToReportPage = () =>
    navigate(
      dogType === DogType.FOUND
        ? AppRoutes.dogs.reportFound
        : AppRoutes.dogs.reportLost
    );

  return (
    <>
      <Typography color={theme.palette.text.primary} sx={styles.topTextStyle}>
        {AppTexts.resultsPage.topText}
      </Typography>
      <Grid container spacing={4} dir="rtl">
        {results?.map((dog) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={dog.dogId}>
              <DogCard dog={dog} dogType={dogType} />
            </Grid>
          );
        })}
      </Grid>
      <Typography
        color={theme.palette.text.primary}
        sx={{ ...styles.topTextStyle, my: 4 }}
      >
        {AppTexts.resultsPage.bottomText}
      </Typography>

      <Box sx={styles.buttonContainer}>
        <Button
          size="large"
          variant="contained"
          onClick={navigateToReportPage}
          sx={styles.button}
        >
          <IconPlus size={20} /> {AppTexts.resultsPage.addReport}
        </Button>
      </Box>
    </>
  );
};
