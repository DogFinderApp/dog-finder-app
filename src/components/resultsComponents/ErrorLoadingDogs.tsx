import { Alert, Button, Typography } from "@mui/material";
import { AppTexts } from "../../consts/texts";
import { KeyedMutator } from "swr";
import { DogResult } from "../../facades/payload.types";

interface ErrorLoadingProps {
  refresh?: KeyedMutator<DogResult[]>;
  text?: string;
}
export const ErrorLoadingDogs = ({ refresh, text }: ErrorLoadingProps) => {
  const alertStyles = {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    mb: 2,
    ".MuiAlert-action": { p: 0 },
  };

  return (
    <Alert
      dir="rtl"
      variant="filled"
      severity="error"
      sx={alertStyles}
      action={
        refresh && (
          <Button
            color="inherit"
            size="small"
            onClick={() => refresh && refresh(undefined)}
          >
            {AppTexts.resultsPage.refresh}
          </Button>
        )
      }
    >
      <Typography px={6}>{text ?? AppTexts.resultsPage.error}</Typography>
    </Alert>
  );
};
