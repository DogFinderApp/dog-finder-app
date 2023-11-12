import { Grid, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogResult, DogType } from "../../facades/payload.types";
import { AppTexts } from "../../consts/texts";
import { DogCard } from "./DogCard";

const useResultsStyles = createStyleHook(() => {
  return {
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
    </>
  );
};
