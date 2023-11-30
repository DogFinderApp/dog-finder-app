import { Grid, Typography, useTheme } from "@mui/material";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogResult } from "../../types/payload.types";
import { AppTexts } from "../../consts/texts";
import { DogCard } from "./DogCard";

const useResultsStyles = createStyleHook(() => ({
  topTextStyle: {
    width: "100%",
    fontSize: 20,
    lineHeight: "25px",
    mb: 4,
    direction: "rtl",
  },
}));

interface ResultsGridProps {
  results: DogResult[] | undefined;
  allReportsPage?: boolean;
  getUpdatedReports?: Function; // refetch after deleting a report
}

export const ResultsGrid = ({
  results,
  allReportsPage,
  getUpdatedReports,
}: ResultsGridProps) => {
  const styles = useResultsStyles();
  const theme = useTheme();

  return (
    <>
      {!allReportsPage && (
        <Typography color={theme.palette.text.primary} sx={styles.topTextStyle}>
          {AppTexts.resultsPage.topText}
        </Typography>
      )}
      <Grid container spacing={4} dir="rtl">
        {results?.map((dog) => (
          <Grid item xs={12} sm={6} md={4} key={dog.dogId}>
            <DogCard
              dog={dog}
              dogType={dog.type!}
              getUpdatedReports={getUpdatedReports}
            />
          </Grid>
        ))}
      </Grid>
      {!allReportsPage && (
        <Typography
          color={theme.palette.text.primary}
          sx={{ ...styles.topTextStyle, my: 4 }}
        >
          {AppTexts.resultsPage.bottomText}
        </Typography>
      )}
    </>
  );
};
