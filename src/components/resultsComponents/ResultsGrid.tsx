import { useEffect, useState } from "react";
import { Box, Fade, Grid, Slide, Typography, useTheme } from "@mui/material";
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
    fontSize: { md: 20, xs: 18 },
    lineHeight: "25px",
    mb: 4,
    direction: "rtl",
    textWrap: "balance",
    textAlign: { sm: "right", xs: "center" },
  },
  floatingSection: {
    position: "fixed",
    bottom: 20,
    left: 0,
    right: 0,
    width: { md: "max-content", xs: "80%" },
    zIndex: 20,
    backgroundColor: "rgba(25,25,25,0.85)",
    margin: "0 auto",
    padding: "0 1rem",
    borderRadius: "4px",
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
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    // slide in animation delay
    setTimeout(() => setSlideIn(true), 900);
  }, []);

  const { topText1, topText2, dogNotFoundText } = AppTexts.resultsPage;

  return (
    <Fade in timeout={500}>
      <Box sx={{ width: "100%" }}>
        {!allReportsPage && (
          <Typography
            color={theme.palette.text.primary}
            sx={styles.topTextStyle}
          >
            {topText1}
            {isMobile ? " " : <br />}
            {topText2}
          </Typography>
        )}
        <Grid container spacing={4} dir="rtl" mb={!allReportsPage ? 20 : 0}>
          {results?.map((dog) => (
            <Grid item xs={12} sm={6} md={4} key={dog.dogId}>
              <DogCard dog={dog} getUpdatedReports={getUpdatedReports} />
            </Grid>
          ))}
        </Grid>
        {!allReportsPage && (
          <Slide direction="up" timeout={500} in={slideIn}>
            <Box sx={styles.floatingSection}>
              <Typography
                color={theme.palette.text.primary}
                sx={{ ...styles.topTextStyle, my: 3, textAlign: "center" }}
              >
                {dogNotFoundText}
              </Typography>
              <NoDogs dogType={dogType} onlyNewReportButton />
            </Box>
          </Slide>
        )}
      </Box>
    </Fade>
  );
};
