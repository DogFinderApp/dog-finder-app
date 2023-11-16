import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Box,
  CircularProgress,
  Pagination,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import usePageTitle from "../../hooks/usePageTitle";
import usePagination from "../../hooks/usePagination";
import { createStyleHook } from "../../hooks/styleHooks";
import { AppTexts } from "../../consts/texts";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogResult } from "../../facades/payload.types";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { ResultsGrid } from "../../components/resultsComponents/ResultsGrid";
import { SelectInputField } from "../../components/pageComponents/SelectInput/SelectInput";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";

const usePageStyles = createStyleHook(() => {
  return {
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
    },
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
    responseContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
      width: "100%",
    },
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

export const AllReportsPage = withAuthenticationRequired(() => {
  usePageTitle(AppTexts.allReportsPage.title);
  const getServerApi = useGetServerApi();
  const styles = usePageStyles();
  const navigate = useNavigate();
  const { dogType } = useParams();

  type SelectOptions = "found" | "lost" | "all";
  const [selectedType, setSelectedType] = useState<SelectOptions>(
    (dogType as SelectOptions) ?? "all"
  );
  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const [page, setPage] = useState<number>(1);

  const fetcher = async () => {
    const serverApi = await getServerApi();
    const type = ["found", "lost"].includes(selectedType) ? selectedType : "";
    // we need to send the payload without the type in order to fetch all reports
    const payload = type
      ? { type, page, page_size: 12 }
      : { page, page_size: 12 };
    const response = await serverApi.getAllReportedDogs(payload);
    if (response.status === 403) return setUnauthorizedError(true);
    if (!response?.ok) throw new Error("Failed to fetch reports");
    const json = await response.json();
    return {
      results: json?.data?.results || [],
      pagination: json?.data?.pagination,
    };
  };

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(["get-all-reports"], fetcher, { revalidateOnFocus: false });

  const sortResults = () => {
    const initValue = { foundDogs: [], lostDogs: [] };
    if (!response?.results) return initValue;
    return response?.results.reduce(
      (
        result: { foundDogs: DogResult[]; lostDogs: DogResult[] },
        dog: DogResult
      ) => {
        // @ts-expect-error
        const { images, id, type } = dog;
        const imageBase64 = images[0]?.base64Image;
        const dogId = id;
        const modifiedDog = { ...dog, imageBase64, dogId };
        if (type === "found") {
          result.foundDogs.push(modifiedDog);
        } else if (type === "lost") {
          result.lostDogs.push(modifiedDog);
        }
        return result;
      },
      initValue
    );
  };

  const { foundDogs, lostDogs } = sortResults();

  const getFilteredReports = () => {
    const reportsArrays = {
      lost: lostDogs,
      found: foundDogs,
      all: [...foundDogs, ...lostDogs],
    };
    return reportsArrays[selectedType];
  };

  const filteredReports: DogResult[] = getFilteredReports();
  const itemsPerPage = response?.pagination?.page_size ?? 12;
  const paginatedReports = usePagination(filteredReports, itemsPerPage);
  const count: number =
    Math.ceil(response?.pagination?.total / itemsPerPage) ?? 0;

  const handlePagination = (
    event: React.ChangeEvent<unknown> | SelectChangeEvent<any>,
    value: number | string
  ) => {
    const newValue = typeof value === "number" ? value : 1;
    setPage(newValue);
    paginatedReports.jump(newValue);
    window.scroll({ top: 0 });
    setTimeout(() => {
      mutate();
    }, 0);
  };

  const changeSelectedReports = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;
    if (selectedType !== value) {
      setSelectedType(value);
      navigate(`/all-reports/${value}`);
      handlePagination(event, value);
    }
  };

  return (
    <Box sx={styles.pageWrapper}>
      <PageTitle text={AppTexts.allReportsPage.title} />
      {isLoading && (
        <Box sx={styles.loadingContainer}>
          <Typography sx={styles.loadingText}>
            {AppTexts.allReportsPage.loading}
          </Typography>
          <CircularProgress size={60} sx={{ my: 2 }} />
        </Box>
      )}
      {!isLoading && error && !unauthorizedError && (
        <ErrorLoadingDogs refresh={mutate} />
      )}
      {unauthorizedError && (
        <ErrorLoadingDogs text={AppTexts.allReportsPage.unauthorized} />
      )}
      {!isLoading && !error && !unauthorizedError && (
        <Box sx={styles.responseContainer}>
          <SelectInputField
            options={AppTexts.allReportsPage.select}
            label={AppTexts.allReportsPage.selectLabel}
            onChange={changeSelectedReports}
            value={selectedType}
            notCentered
          />
          <ResultsGrid results={paginatedReports.currentData()} noTexts />
          {filteredReports.length && (
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
          )}
        </Box>
      )}
    </Box>
  );
});
