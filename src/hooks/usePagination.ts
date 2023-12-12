import { useState } from "react";
import { DogResult, MatchingReports } from "../types/payload.types";

export const usePagination = (
  data: DogResult[] | MatchingReports[],
  itemsPerPage: number,
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  };

  const next = () => {
    setCurrentPage(Math.min(currentPage + 1, maxPage));
  };

  const prev = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const jump = (page: number) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  };

  return {
    next,
    prev,
    jump,
    currentData,
    currentPage,
    maxPage,
  };
};
