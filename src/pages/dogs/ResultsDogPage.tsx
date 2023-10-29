import useSWR from "swr";
import { Box } from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { AppTexts } from "../../consts/texts";
import { ResultsGrid } from "../../components/resultsComponents/ResultsGrid";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";
import { LoadingDogs } from "../../components/resultsComponents/LoadingDogs";
import { NoDogs } from "../../components/resultsComponents/NoDogs";
import { useLocation, useParams } from "react-router-dom";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogType } from "../../facades/payload.types";

const fetcher = async (
  payload: { img: Blob; type: DogType },
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
  usePageTitle(AppTexts.resultsPage.title);
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
  return (
    <PageContainer>
      <Box
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        px={4}
      >
        <PageTitle text={AppTexts.resultsPage.title} />
        {isLoading && <LoadingDogs />}
        {!isLoading && isEmpty && !error && <NoDogs dogType={dogType as DogType}/>}
        {!isLoading && error && <ErrorLoadingDogs refresh={mutate} />}
        {!isLoading && !error && !isEmpty && <ResultsGrid results={results} dogType={dogType as DogType} />}
      </Box>
    </PageContainer>
  );
};
