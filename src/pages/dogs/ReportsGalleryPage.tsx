import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, SelectChangeEvent } from "@mui/material";
import useSWR from "swr";
import usePageTitle from "../../hooks/usePageTitle";
import { usePagination } from "../../hooks/usePagination";
import { AppTexts } from "../../consts/texts";
import { DogResult, DogType } from "../../types/payload.types";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { ResultsGrid } from "../../components/resultsComponents/ResultsGrid";
import { SelectInputField } from "../../components/pageComponents/SelectInput/SelectInput";
import { ErrorLoadingDogs } from "../../components/resultsComponents/ErrorLoadingDogs";
import { LoadingSpinnerWithText } from "../../components/common/LoadingSpinnerWithText";
import { Pagination } from "../../components/pageComponents/Pagination/Pagination";
import { useAllReportsPageStyles } from "./AllReportsPage";

export const ReportsGalleryPage = () => {
  const { title, loadingText, selectLabel, selectOptions } =
    AppTexts.allReportsPage;

  usePageTitle(title);
  const styles = useAllReportsPageStyles();
  const navigate = useNavigate();
  const { dogType } = useParams();

  const [selectedType, setSelectedType] = useState<DogType>(
    (dogType as DogType) ?? "found",
  );
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  // eslint-disable-next-line consistent-return
  const fetcher = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "";
      // we can't invoke serverApi.getAllReportedDogs() here because this page is also
      // available for unauthorized users, and we can't use `serverApi` without being logged in
      const url = `${API_URL}/dogfinder/dogs?type=${selectedType}&page=${page}&page_size=${pageSize}`;
      const response = await fetch(url);
      if (response?.ok) {
        const json = await response.json();
        return {
          results: json?.data?.results || [],
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
  } = useSWR([`${selectedType}-reports-page-${page}`], fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

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

  const changeSelectedReports = (event: SelectChangeEvent<any>) => {
    const { value } = event.target;
    if (selectedType !== value) {
      setSelectedType(value);
      navigate(`/all-reports/${value}`);
      handlePagination(event, value);
    }
  };

  useEffect(() => {
    // update the selected type and refetch when a user switches between the 2 pages in the header menu
    if (dogType && ["found", "lost"].includes(dogType)) {
      setSelectedType(dogType as DogType);
    }
  }, [dogType]);

  return (
    <PageContainer>
      <Box sx={styles.pageWrapper}>
        <PageTitle text={title} />
        {isLoading && <LoadingSpinnerWithText title={loadingText} />}
        {!isLoading && error && <ErrorLoadingDogs refresh={mutate} />}
        {!isLoading && !error && (
          <Box sx={styles.responseContainer}>
            <SelectInputField
              options={selectOptions}
              label={selectLabel}
              onChange={changeSelectedReports}
              value={selectedType}
              notCentered
            />
            <ResultsGrid
              results={paginatedReports.currentData() as DogResult[]}
              allReportsPage
              // @ts-expect-error
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
};
