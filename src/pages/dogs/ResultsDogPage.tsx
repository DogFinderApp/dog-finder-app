import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import useSWR from "swr";
import { useLocation, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import { createStyleHook } from "../../hooks/styleHooks";
import { AppTexts } from "../../consts/texts";
import { DogType, QueryPayload } from "../../types/payload.types";
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

export const ResultsDogPage = () => {
  const styles = usePageStyles();
  const { dogType } = useParams();
  const { state: payload } = useLocation();
  const { base64Image, type } = payload as QueryPayload;

  const { resultsPage } = AppTexts;
  const loadingTextOptions = Object.values(resultsPage.loadingTexts);
  const [loadingText, setLoadingText] = useState(loadingTextOptions[0]);

  // eslint-disable-next-line
  const fetcher = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "";
      // we can't invoke serverApi.getAllReportedDogs() here because this page is also
      // available for unauthorized users, and we can't use `serverApi` without being logged in
      const url = `${API_URL}/dogfinder/search_in_${type}_dogs`;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ base64Image }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response?.ok) {
        const json = await response.json();
        return json?.data?.results || [];
      }
      return [];
    } catch (err) {
      console.error(err); // eslint-disable-line
    }
  };

  const {
    data: results,
    error,
    isLoading,
    mutate,
  } = useSWR([payload], async () => fetcher(), {
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
        {!isLoading && !error && !isEmpty && (
          <ResultsGrid results={results} dogType={dogType as DogType} />
        )}
      </Box>
    </PageContainer>
  );
};
