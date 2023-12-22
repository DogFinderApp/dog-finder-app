import { Box, Pagination as MaterialPagination } from "@mui/material";
import { createStyleHook } from "../../../hooks/styleHooks";

const usePaginationStyles = createStyleHook(
  (theme, props: { mb?: string | number }) => ({
    paginationContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      mb: props.mb ?? "2rem",
      position: "sticky",
      direction: "ltr",
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
  }),
);

interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number | string) => void;
  mb?: string | number; // margin-bottom
}

export const Pagination = ({ count, page, onChange, mb }: PaginationProps) => {
  const styles = usePaginationStyles({ mb });

  return (
    <Box sx={styles.paginationContainer}>
      <MaterialPagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        size="large"
        sx={styles.pagination}
      />
    </Box>
  );
};
