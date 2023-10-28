import React from "react";
import { Alert, Button, Typography } from "@mui/material";
import { AppTexts } from "../../consts/texts";
import { KeyedMutator } from "swr";
import { DogResult } from "../../facades/payload.types";

export const ErrorLoadingDogs = ({
  refresh,
}: {
  refresh: KeyedMutator<DogResult[]>;
}) => {
  return (
    <Alert
      dir="rtl"
      variant="filled"
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={() => refresh(undefined)}>
          {AppTexts.resultsPage.refresh}
        </Button>
      }
    >
      <Typography px={6}>{AppTexts.resultsPage.error}</Typography>
    </Alert>
  );
};
