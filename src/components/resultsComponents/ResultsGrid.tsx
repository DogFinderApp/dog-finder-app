import { Box, Grid, Typography, useTheme } from "@mui/material";
import { KeyedMutator } from "swr";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { DogResult, DogType } from "../../types/payload.types";
import { AppTexts } from "../../consts/texts";
import { DogCard } from "./DogCard/DogCard";
import { NoDogs } from "./NoDogs";

const useResultsStyles = createStyleHook(() => ({
  topTextStyle: {
    width: "100%",
    fontSize: 20,
    lineHeight: "25px",
    mb: 4,
    direction: "rtl",
    textWrap: "balance",
    textAlign: { sm: "right", xs: "center" },
  },
}));

interface ResultsGridProps {
  results: DogResult[] | undefined;
  dogType?: DogType;
  allReportsPage?: boolean;
  // mutate function: refetch reports after deleting a report
  getUpdatedReports?: KeyedMutator<void | {
    results: DogResult[];
    pagination: any;
  }>;
}

export const ResultsGrid = ({
  results,
  dogType,
  allReportsPage,
  getUpdatedReports,
}: ResultsGridProps) => {
  const styles = useResultsStyles();
  const { isMobile } = useWindowSize();
  const theme = useTheme();
  const { topText1, topText2, dogNotFoundText } = AppTexts.resultsPage;

  return (
    <Box width="100%">
      {!allReportsPage && (
        <Typography color={theme.palette.text.primary} sx={styles.topTextStyle}>
          {topText1}
          {isMobile ? " " : <br />}
          {topText2}
        </Typography>
      )}
      <Grid container spacing={4} dir="rtl">
        {results?.map((dog) => (
          <Grid item xs={12} sm={6} md={4} key={dog.dogId}>
            <DogCard dog={dog} getUpdatedReports={getUpdatedReports} />
          </Grid>
        ))}
      </Grid>
      {!allReportsPage && (
        <>
          <Typography
            color={theme.palette.text.primary}
            sx={{ ...styles.topTextStyle, my: 4 }}
          >
            {dogNotFoundText}
          </Typography>
          <NoDogs dogType={dogType} onlyNewReportButton />
        </>
      )}
    </Box>
  );
};
