import { useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Box,
  CircularProgress,
  Pagination,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { useLocation, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import usePagination from "../../hooks/usePagination";
import { createStyleHook } from "../../hooks/styleHooks";
import { AppTexts } from "../../consts/texts";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogResult, DogType } from "../../facades/payload.types";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { ResultsGrid } from "../../components/resultsComponents/ResultsGrid";
import { NoDogs } from "../../components/resultsComponents/NoDogs";
import { SelectInputField } from "../../components/pageComponents/SelectInput/SelectInput";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";

const usePageStyles = createStyleHook(() => {
  return {
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
      fontSize: 26,
    },
    responseContainer: { display: "flex", flexDirection: "column", gap: 5 },
    paginationContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: "2rem",
      position: "sticky",
    },
    pagination: {
      "& .MuiPaginationItem-previousNext": {
        transform: "rotate(180deg) !important",
      },
      "@media (max-width: 600px)": {
        "& .MuiPaginationItem-root": {
          padding: "0 !important",
          margin: "0 !important",
          minWidth: "35px !important",
          height: "35px !important",
        },
      },
    },
  };
});

//!
//! THE RESPONSE CAN BE STATUS 403 IF THE USER IS NOT FROM THE HAMAL!!!
//!
export const AllReportsPage = withAuthenticationRequired(() => {
  const { state: payload } = useLocation();
  const getServerApi = useGetServerApi();
  const { dogType } = useParams();
  const styles = usePageStyles();

  const [page, setPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<"found" | "lost" | "all">(
    "found"
  );

  const fetcher = async () => {
    const serverApi = await getServerApi();
    const response = await serverApi.getAllReportedDogs();
    if (response?.ok) {
      const json = await response.json();
      return json?.data?.results || [];
    } else {
      throw new Error("Failed to fetch reports");
    }
  };

  const {
    data: results,
    error,
    isLoading,
    mutate,
  } = useSWR([payload], fetcher, { revalidateOnFocus: false });

  const isEmpty = results?.length === 0;
  const noResults = !isLoading && isEmpty && !error;

  usePageTitle(
    noResults
      ? AppTexts.resultsPage.noResults.title
      : AppTexts.allReportsPage.title
  );

  const generateMockData = (
    count: number
  ): { foundDogs: DogResult[]; lostDogs: DogResult[] } => {
    const generateDog = (id: number, type: "found" | "lost"): DogResult => ({
      dogId: `${id}`,
      contactName: `contactName${id}`,
      contactPhone: `contactPhone${id}`,
      contactEmail: `qwe${id}@qwe.qwe`,
      contactAddress: `contactAddress${id}`,
      breed: `breed${id}`,
      color: `color${id}`,
      size: `size${id}`,
      sex: `${id % 2 ? "male" : "female"}`,
      location: `תל אביב ${id}`,
      chipNumber: `chipNumber${id}`,
      extraDetails: `extraDetails${id}`,
      imageBase64: `${
        id % 5
          ? "https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg"
          : "data:image/jpeg;base64,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"
      }`,
      imageContentType: `imageContentType${id}`,
      dogFoundOn: "2023-11-13",
      type: type as DogType,
    });

    const foundDogs: DogResult[] = Array.from({ length: count }, (_, index) =>
      generateDog(index + 1, "found")
    );
    const lostDogs: DogResult[] = Array.from({ length: count }, (_, index) =>
      generateDog(index + count + 1, "lost")
    );

    return { foundDogs, lostDogs };
  };

  const { foundDogs, lostDogs } = generateMockData(200);

  const getFilteredReports = () => {
    const reportsArrays = {
      lost: lostDogs,
      found: foundDogs,
      all: [...foundDogs, ...lostDogs],
    };
    return reportsArrays[selectedType];
  };

  const filteredReports: DogResult[] = getFilteredReports();
  const itemsPerPage = 12;
  const paginatedReports = usePagination(filteredReports, itemsPerPage);
  const count = Math.ceil(filteredReports.length / itemsPerPage);

  const handlePagination = (
    event: React.ChangeEvent<unknown> | SelectChangeEvent<any>,
    value: number
  ) => {
    setPage(value);
    paginatedReports.jump(value);
    window.scroll({ top: 0 });
  };

  const changeSelectedReports = (event: SelectChangeEvent<any>) => {
    if (selectedType !== event.target.value) {
      setSelectedType(event.target.value);
      handlePagination(event, 1);
    }
  };

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
        <PageTitle text={AppTexts.allReportsPage.title} />
        {isLoading && (
          <Box sx={styles.loadingContainer}>
            <Typography sx={styles.loadingText}>
              {AppTexts.allReportsPage.loading}
            </Typography>
            <CircularProgress size={60} sx={{ my: 2 }} />
          </Box>
        )}
        {noResults && <NoDogs dogType={dogType as DogType} />}
        {!isLoading && error && <ErrorLoadingDogs refresh={mutate} />}
        {/* {!isLoading && !error && !isEmpty && ( */}
        <Box sx={styles.responseContainer}>
          <SelectInputField
            options={AppTexts.allReportsPage.select}
            label={AppTexts.allReportsPage.selectLabel}
            onChange={changeSelectedReports}
            value={selectedType}
            notCentered
          />
          <ResultsGrid results={paginatedReports.currentData()} noTexts />
          <Box sx={styles.paginationContainer}>
            <Pagination
              count={count}
              page={page}
              onChange={handlePagination}
              color="primary"
              size="large"
              sx={styles.pagination}
            />
          </Box>
        </Box>
        {/* )} */}
      </Box>
    </PageContainer>
  );
});
