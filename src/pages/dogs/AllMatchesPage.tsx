import { useState } from "react";
import { Box, Grid } from "@mui/material";
import useSWR from "swr";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogResult, MatchingReports } from "./../../types/payload.types";
import { createStyleHook } from "../../hooks/styleHooks";
import usePageTitle from "../../hooks/usePageTitle";
import { AppTexts } from "../../consts/texts";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { LoadingSpinnerWithText } from "../../components/common/LoadingSpinnerWithText";
import { DogCard } from "../../components/resultsComponents/DogCard/DogCard";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";

const usePageStyles = createStyleHook(() => ({
  pageWrapper: {
    height: "100%",
    width: "90%",
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: { sm: 4 },
    mt: 10,
    mb: 4,
  },
  responseContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    width: "100%",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: 1,
    width: "100%",
    mb: { xs: 4, sm: "unset" },
  },
}));

export const AllMatchesPage = () => {
  const title = AppTexts.navigation.allMatches;
  const { loadingText } = AppTexts.allMatchesPage;
  usePageTitle(title);
  const styles = usePageStyles();
  const getServerApi = useGetServerApi();

  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const [page, setPage] = useState<number>(1);
  const page_size = 12;

  const fetcher = async () => {
    const serverApi = await getServerApi();
    try {
      const response = await serverApi.getPossibleMatches({ page, page_size });

      if (response.status === 403) return setUnauthorizedError(true);
      if (response.status === 200) {
        const json = await response.json();
        return {
          results: (json?.data?.results || []) as MatchingReports[],
          pagination: json?.data?.pagination,
        };
      }
    } catch (error) {
      console.error(error); // eslint-disable-line
      throw new Error("Failed to fetch reports");
    }
  };

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR([`all matches page ${page}`], fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const fixReportData = (dog: DogResult) => {
    // @ts-expect-error
    const { images, id } = dog;
    const imageBase64 = images[0]?.base64Image;
    const dogId = id;
    const modifiedDog = { ...dog, imageBase64, dogId };
    return modifiedDog;
  };

  return (
    <Box sx={styles.pageWrapper}>
      <PageTitle text={title} />
      {isLoading && <LoadingSpinnerWithText title={loadingText} />}
      {!isLoading && error && !unauthorizedError && (
        <ErrorLoadingDogs refresh={mutate} />
      )}
      {unauthorizedError && (
        <ErrorLoadingDogs text={AppTexts.allReportsPage.unauthorized} />
      )}
      {!isLoading && !error && (
        <Box sx={styles.responseContainer}>
          <Grid container spacing={4} dir="rtl">
            {response?.results?.map((reportsPair) => {
              const { dog, dogId, possibleMatch, possibleMatchId } =
                reportsPair;
              return (
                <Grid item xs={12} lg={6} key={`${dogId} ${possibleMatchId}`}>
                  <Box sx={styles.cardsContainer}>
                    <DogCard
                      dog={fixReportData(dog)}
                      dogType={dog.type!}
                      matchingReportCard
                    />
                    <DogCard
                      dog={fixReportData(possibleMatch)}
                      dogType={possibleMatch.type!}
                      matchingReportCard
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};
