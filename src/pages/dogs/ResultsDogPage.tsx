import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import useSWR from "swr";
import { useLocation, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import { createStyleHook } from "../../hooks/styleHooks";
import { AppTexts } from "../../consts/texts";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogType } from "../../types/payload.types";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { ResultsGrid } from "../../components/resultsComponents/ResultsGrid";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";
import { NoDogs } from "../../components/resultsComponents/NoDogs";

const usePageStyles = createStyleHook(() => ({
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    textWrap: "balance",
  },
  loadingText: {
    color: "white",
    textAlign: "center",
    fontSize: { xs: 18, sm: 22 },
    direction: "rtl",
  },
}));

const fetcher = async (
  payload: { base64Image: string; type: DogType },
  getServerApi: Function,
) => {
  const serverApi = await getServerApi();
  try {
    const response = await serverApi.searchDog({
      ...payload,
      dogType: payload.type,
    });
    const json = await response.json();
    setTimeout(() => {}, 6000);
    return json?.data?.results || [];
  } catch (error) {
    console.error(error); // eslint-disable-line
    throw new Error("Failed to fetch results");
  }
};

export const ResultsDogPage = () => {
  const { state: payload } = useLocation();
  const getServerApi = useGetServerApi();
  const { dogType } = useParams();
  const styles = usePageStyles();

  const { resultsPage } = AppTexts;
  const loadingTextOptions = Object.values(resultsPage.loadingTexts);
  const [loadingText, setLoadingText] = useState(loadingTextOptions[0]);

  const {
    data: results,
    error,
    isLoading,
    mutate,
  } = useSWR([payload], async () => fetcher(payload, getServerApi), {
    keepPreviousData: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    setTimeout(() => {
      if (isLoading && loadingText === loadingTextOptions[0])
        return setLoadingText(loadingTextOptions[1]);
      if (isLoading && loadingText === loadingTextOptions[1])
        return setLoadingText(loadingTextOptions[2]);
    }, 2500);
  }, [isLoading, loadingText, setLoadingText, loadingTextOptions]);

  const isEmpty = results?.length === 0;
  const noResults = !isLoading && isEmpty && !error;

  usePageTitle(noResults ? resultsPage.noResults.title : resultsPage.title);

  return (
    <PageContainer>
      <Box
        height="100%"
        maxWidth={1400}
        margin="0 auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
        px={{ sm: 4, xs: 0 }}
      >
        <PageTitle text={resultsPage.title} />
        {isLoading && (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} sx={{ my: 2 }} />
            <Typography sx={styles.loadingText}>{loadingText}</Typography>
          </Box>
        )}
        {noResults && <NoDogs dogType={dogType as DogType} />}
        {!isLoading && error && <ErrorLoadingDogs refresh={mutate} />}
        {!isLoading && !error && !isEmpty && <ResultsGrid results={results} />}
      </Box>
    </PageContainer>
  );
};
