import { useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box, Grid } from "@mui/material";
import useSWR from "swr";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogResult, MatchingReports } from "../../types/payload.types";
import { useAuthContext } from "../../context/useAuthContext";
import { createStyleHook } from "../../hooks/styleHooks";
import usePageTitle from "../../hooks/usePageTitle";
import { usePagination } from "../../hooks/usePagination";
import { AppTexts } from "../../consts/texts";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { LoadingSpinnerWithText } from "../../components/common/LoadingSpinnerWithText";
import { DogCard } from "../../components/resultsComponents/DogCard/DogCard";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";
import { Pagination } from "../../components/pageComponents/Pagination/Pagination";
import { NoDogs } from "../../components/resultsComponents/NoDogs";

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

export const AllMatchesPage = withAuthenticationRequired(() => {
  const title = AppTexts.navigation.allMatches;
  const { loadingText } = AppTexts.allMatchesPage;
  usePageTitle(title);
  const styles = usePageStyles();
  const getServerApi = useGetServerApi();
  const {
    state: { role },
  } = useAuthContext();

  const [unauthorizedError, setUnauthorizedError] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const page_size = 6; // eslint-disable-line

  const fetcher = async () => {
    const serverApi = await getServerApi();
    // ? only hamal and admin users are allowed to fetch this data
    // we must check both `role` and `serverApi.getUserRole()` because there could be a chance
    // the user has reloaded the page and we invoke this function before the browser has updated
    // the user role in context
    if (!role && !serverApi.getUserRole()) return;
    try {
      const response = await serverApi.getPossibleMatches({ page, page_size });
      if (response.status === 403) return setUnauthorizedError(true);
      if (response.status === 200) {
        const json = await response.json();
        if (json?.data?.results?.length === 0) setIsEmpty(true);
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

  const paginatedReports = usePagination(response?.results ?? [], page_size);
  const pagesCount: number =
    Math.ceil((response?.pagination?.total as number) / page_size) ?? 0;
  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number | string,
  ) => {
    const newValue = typeof value === "number" ? value : 1;
    setPage(newValue);
    paginatedReports.jump(newValue);
    window.scroll({ top: 0 });
  };

  return (
    <PageContainer>
      <Box sx={styles.pageWrapper}>
        <PageTitle text={title} />
        {isLoading && <LoadingSpinnerWithText title={loadingText} />}
        {!isLoading && error && !unauthorizedError && (
          <ErrorLoadingDogs refresh={mutate} />
        )}
        {(!role || unauthorizedError) && (
          <ErrorLoadingDogs text={AppTexts.allReportsPage.unauthorized} />
        )}
        {isEmpty && <NoDogs />}
        {!isLoading && !error && (
          <Box sx={styles.responseContainer}>
            <Grid container spacing={4} dir="rtl">
              {paginatedReports.currentData()?.map((reportsPair) => {
                const { dog, dogId, possibleMatch, possibleMatchId } =
                  reportsPair as MatchingReports;
                return (
                  <Grid item xs={12} lg={6} key={`${dogId} ${possibleMatchId}`}>
                    <Box sx={styles.cardsContainer}>
                      {[dog, possibleMatch].map((dogResult, index) => (
                        <DogCard
                          key={index ? possibleMatchId : dogId}
                          matchingReportCard
                          dog={fixReportData(dogResult)}
                          dogId={dogId}
                          possibleMatchId={possibleMatchId}
                          getUpdatedPossibleMatches={mutate}
                        />
                      ))}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            {!!response?.results.length && (
              <Pagination
                count={pagesCount}
                page={page}
                onChange={handlePagination}
              />
            )}
          </Box>
        )}
      </Box>
    </PageContainer>
  );
});
