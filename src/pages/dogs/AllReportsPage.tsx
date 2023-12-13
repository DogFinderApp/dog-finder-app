import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Box,
  CircularProgress,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { useAuthContext } from "../../context/useAuthContext";
import usePageTitle from "../../hooks/usePageTitle";
import { usePagination } from "../../hooks/usePagination";
import { createStyleHook } from "../../hooks/styleHooks";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogResult } from "../../types/payload.types";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { ResultsGrid } from "../../components/resultsComponents/ResultsGrid";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";
import { LoadingSpinnerWithText } from "../../components/common/LoadingSpinnerWithText";
import { Pagination } from "../../components/pageComponents/Pagination/Pagination";

export const useAllReportsPageStyles = createStyleHook(() => ({
  pageWrapper: {
    height: "100%",
    width: "90%",
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: { sm: 4 },
  },
  responseContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    width: "100%",
  },
  topTextsFlex: { display: "flex", flexDirection: "column", gap: 1 },
  typography: {
    direction: "rtl",
    color: "white",
    width: "max-content",
    mr: "auto",
    fontSize: 18,
  },
}));

const allMatchesLinkStyles = {
  textDecoration: "none",
  width: "max-content",
  marginLeft: "auto",
};

export const AllReportsPage = withAuthenticationRequired(() => {
  const { title, loadingText, unauthorized, numberOfReports, numberOfMatches } =
    AppTexts.allReportsPage;
  usePageTitle(title);
  const getServerApi = useGetServerApi();
  const styles = useAllReportsPageStyles();
  const {
    state: { role },
  } = useAuthContext();

  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [possibleMatchesCount, setPossibleMatchesCount] = useState<
    number | null
  >(null);
  const pageSize = 12;

  const fetcher = async () => {
    const serverApi = await getServerApi();
    // ? only hamal and admin users are allowed to fetch this data
    // we must check both `role` and `serverApi.getUserRole()` because there could be a chance
    // the user has reloaded the page and we invoke this function before the browser has updated
    // the user role in context
    if (!role && !serverApi.getUserRole()) return;
    // we don`t send a `type` in the payload in order to fetch all types of reports
    const payload = { page, page_size: pageSize };
    try {
      const response = await serverApi.getAllReportedDogs(payload);
      // eslint-disable-next-line consistent-return
      if (response.status === 403) return setUnauthorizedError(true);
      const json = await response.json();
      // eslint-disable-next-line consistent-return
      return {
        results: json?.data?.results || [],
        pagination: json?.data?.pagination,
      };
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
  } = useSWR([`all-reports-page-${page}`], fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    const fetchPossibleMatchesCount = async () => {
      const serverApi = await getServerApi();
      try {
        const MatchesResponse = await serverApi.getPossibleMatchesCount();
        if (MatchesResponse.status === 200) {
          const json = await MatchesResponse.json();
          setPossibleMatchesCount(json);
        }
      } catch (err) {
        console.error(err); // eslint-disable-line
      }
    };

    if (role && possibleMatchesCount === null) fetchPossibleMatchesCount();
  }, [role, possibleMatchesCount, getServerApi]);

  // modify the reports from result to match `DogResult` type
  const allReports: DogResult[] = response?.results?.map((dog: DogResult) => {
    // @ts-expect-error
    const { images, id } = dog;
    const imageBase64 = images[0]?.base64Image;
    const dogId = id;
    return { ...dog, imageBase64, dogId };
  });
  const itemsPerPage = response?.pagination?.page_size ?? pageSize;
  const paginatedReports = usePagination(allReports ?? [], itemsPerPage);
  const pagesCount: number =
    Math.ceil((response?.pagination?.total as number) / itemsPerPage) ?? 0;

  const handlePagination = (
    event: React.ChangeEvent<unknown> | SelectChangeEvent<any>,
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
          <ErrorLoadingDogs text={unauthorized} />
        )}
        {role && !isLoading && !error && !unauthorizedError && (
          <Box sx={styles.responseContainer}>
            <Box sx={styles.topTextsFlex}>
              {response?.pagination && (
                <Typography sx={styles.typography}>
                  <span style={{ textDecoration: "underline" }}>
                    {numberOfReports}
                  </span>{" "}
                  {`${response?.pagination?.total}`}
                </Typography>
              )}
              <Tooltip placement="bottom" title="מעבר לעמוד כל ההתאמות">
                <Link
                  to={AppRoutes.dogs.allMatches}
                  style={allMatchesLinkStyles}
                >
                  <Typography sx={styles.typography}>
                    <span style={{ textDecoration: "underline" }}>
                      {numberOfMatches}
                    </span>{" "}
                    {possibleMatchesCount ?? (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    )}
                  </Typography>
                </Link>
              </Tooltip>
            </Box>
            <ResultsGrid
              results={paginatedReports.currentData() as DogResult[]}
              allReportsPage
              getUpdatedReports={mutate}
            />
            {allReports?.length && (
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
