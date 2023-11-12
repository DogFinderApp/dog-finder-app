import dayjs, { Dayjs } from "dayjs";

// format dates to match "yyyy-mm-dd"
export const dateToString = (date: Dayjs): string => date.format("YYYY-MM-DD");

// format dates from the backend format "yyyy-mm-dd" to "dd/mm/yyyy"
export const formatDateString = (dateString: string): string => {
  const parsedDate = dayjs(dateString, { format: "YYYY-MM-DD" });
  return parsedDate.format("DD/MM/YYYY");
};
