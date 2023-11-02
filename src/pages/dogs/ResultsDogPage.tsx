import { Box, CircularProgress } from "@mui/material";
import useSWR from "swr";
import { useLocation, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import { AppTexts } from "../../consts/texts";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogType } from "../../facades/payload.types";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { ResultsGrid } from "../../components/resultsComponents/ResultsGrid";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";
import { NoDogs } from "../../components/resultsComponents/NoDogs";

const fetcher = async (
  payload: { base64Image: string; type: DogType },
  getServerApi: Function
) => {
  const serverApi = await getServerApi();
  const response = await serverApi.searchDog(payload);
  if (response?.ok) {
    const json = await response.json();
    return json?.data?.results || [];
  } else {
    throw new Error("Failed to fetch results");
  }
};

export const ResultsDogPage = () => {
  const { state: payload } = useLocation();
  const getServerApi = useGetServerApi();
  const { dogType } = useParams();

  const {
    data: results,
    error,
    isLoading,
    mutate,
  } = useSWR([payload], async () => await fetcher(payload, getServerApi), {
    keepPreviousData: false,
    revalidateOnFocus: false,
  });

  const isEmpty = results?.length === 0;
  const noResults = !isLoading && isEmpty && !error;

  usePageTitle(
    noResults
      ? AppTexts.resultsPage.noResults.title
      : AppTexts.resultsPage.title
  );

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
        <PageTitle text={AppTexts.resultsPage.title} />
        {isLoading && <CircularProgress size={60} sx={{ my: 2 }} />}
        {noResults && <NoDogs dogType={dogType as DogType} />}
        {!isLoading && error && <ErrorLoadingDogs refresh={mutate} />}
        {!isLoading && !error && !isEmpty && (
          <ResultsGrid results={results} dogType={dogType as DogType} />
        )}
      </Box>
    </PageContainer>
  );
};
