import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { AppTexts } from "../../consts/texts";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { useImageSelection } from "../../hooks/useImageSelection";
import { DogPhoto } from "../../components/reportComponents/DogPhoto/DogPhoto";
import { RTLTextField } from "../../components/pageComponents/RTLTextInput/RTLTextField";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useTextInput } from "../../hooks/useTextInput";
import { createStyleHook } from "../../hooks/styleHooks";
import { IconSend } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { usePhoneNumberInput } from "../../hooks/usePhoneNumberInput";
import { useEmailInput } from "../../hooks/useEmailInput";
import { useSelectInput } from "../../hooks/useSelectInput";
import { DogType, ReportDogPayload } from "../../facades/payload.types";
import { SelectInputField } from "../../components/pageComponents/SelectInput/SelectInput";
import { useGetServerApi } from "../../facades/ServerApi";
import { getImageBlob } from "../../utils/imageUtils";

const useReportDogPageStyles = createStyleHook(
  (theme, props: { isError: boolean }) => {
    return {
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        heigt: "100%",
        width: "100%",
      },
      button: {
        marginTop: "24px",
        marginBottom: "24px",
      },
      error: {
        opacity: props.isError ? "100%" : "0%",
      },
    };
  }
);

interface ReportDogPageProps {
  dogType: DogType
}

export const ReportDogPage = withAuthenticationRequired((props: ReportDogPageProps) => {
  const { onSelectImage, selectedImageUrl, clearSelection } =
    useImageSelection();
  const [isMissingImage, setIsMissingImage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string>("");
  const { dogType } = props;

  const theme = useTheme();
  const styles = useReportDogPageStyles({ isError: showErrorMessage });
  const getServerApi = useGetServerApi();

  const inputs = {
    dogBreed: useTextInput({ isMandatoryInput: false }),
    dogSize: useTextInput({ isMandatoryInput: false }),
    dogColor: useTextInput({ isMandatoryInput: false }),
    dogType: useSelectInput({
      isMandatoryInput: true,
      possibleValues: Object.values(DogType),
    }),
    // chipNumber: useTextInput({ isMandatoryInput: false }), TODO: don't think we need that one. Don't we?
    location: useTextInput({ isMandatoryInput: true }),
    contactName: useTextInput({ isMandatoryInput: true }),
    contactPhone: usePhoneNumberInput({ isMandatoryInput: true }),
    contactEmail: useEmailInput({ isMandatoryInput: false }),
    contactAddress: useTextInput({ isMandatoryInput: false }),
    extraDetails: useTextInput({ isMandatoryInput: false }),
  };

  const clearInputs = () => {
    Object.values(inputs).forEach((input) => {
      input.clearInput();
    });
    clearSelection();
  };

  const handleCloseError = () => {
    setRequestStatus("");
  };

  const handleSubmitForm = async () => {
    // get server api
    const serverApi = await getServerApi();
    // Validate image upload
    const isMissingImage = !selectedImageUrl;
    setIsMissingImage(isMissingImage);

    // Validate all mandatory fields were filled
    const inputValidation = Object.values(inputs).map((input) =>
      input.validateInput()
    );
    const hasInvalidInputs = inputValidation.some((res) => !res);

    const showError = hasInvalidInputs || isMissingImage;
    setShowErrorMessage(showError);

    if (showError) {
      return;
    }

    const imageBlob = await getImageBlob(selectedImageUrl);
    const payload: ReportDogPayload = {
      type: dogType,
      contactName: inputs.contactName.value,
      contactAdress: inputs.contactAddress.value,
      contactPhone: inputs.contactPhone.value,
      contactEmail: inputs.contactEmail.value,
      foundAtLocation: inputs.location.value,
      breed: inputs.dogBreed.value, 
      color: inputs.dogColor.value, 
      size: inputs.dogSize.value,
      extraDetails: inputs.extraDetails.value,
      img: imageBlob,
    };
    setIsLoading(true);
    const response = await serverApi.report_dog(payload);
    if (response.status === 200) {
      setRequestStatus("success");
    } else {
      setRequestStatus("error");
    }

    clearInputs();
    setIsLoading(false);
  };
  
  const getTitle = () => {
    if (dogType === DogType.LOST) {
      return AppTexts.reportPage.title.lost;
    }
    return AppTexts.reportPage.title.found;
  };

  const getSuccessMessage = () => {
    if (dogType === DogType.LOST) {
      return AppTexts.reportPage.request.success.reportedLost;
    }
    return AppTexts.reportPage.request.success.reportedFound;
  };

  return (
    <PageContainer>
      <Box sx={styles.root}>
        <PageTitle text={getTitle()} />
        <Snackbar
          open={!!requestStatus}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <Alert
            onClose={handleCloseError}
            severity={requestStatus as AlertColor}
            sx={{ width: "100%" }}
          >
            {
              requestStatus === "error" ? AppTexts.reportPage.request.error : getSuccessMessage()
            }
          </Alert>
        </Snackbar>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <DogPhoto
              onSelectImage={onSelectImage}
              selectedImageUrl={selectedImageUrl}
              clearSelection={clearSelection}
              isError={isMissingImage}
            />
            <RTLTextField
              label={AppTexts.reportPage.dogDetails.dogRace}
              type="text"
              fullWidth
              margin="normal"
              value={inputs.dogBreed.value}
              onChange={inputs.dogBreed.onTextChange}
              error={!inputs.dogBreed.isTextValid}
            />
            <RTLTextField
              label={AppTexts.reportPage.dogDetails.dogSize}
              type="text"
              fullWidth
              margin="normal"
              value={inputs.dogSize.value}
              onChange={inputs.dogSize.onTextChange}
              error={!inputs.dogSize.isTextValid}
            />
            <RTLTextField
              label={AppTexts.reportPage.dogDetails.dogColor}
              type="text"
              fullWidth
              margin="normal"
              value={inputs.dogColor.value}
              onChange={inputs.dogColor.onTextChange}
              error={!inputs.dogColor.isTextValid}
            />
            {/* <RTLTextField
              label={AppTexts.reportPage.dogDetails.chipNumber}
              type="number"
              fullWidth
              margin="normal"
              value={inputs.chipNumber.value}
              onChange={inputs.chipNumber.onTextChange}
              error={!inputs.chipNumber.isTextValid}
            /> */}
            <RTLTextField
              label={AppTexts.reportPage.locationDetails.locationDescription}
              fullWidth
              type="text"
              margin="normal"
              value={inputs.location.value}
              onChange={inputs.location.onTextChange}
              error={!inputs.location.isTextValid}
            />
            <RTLTextField
              rows={2}
              label={AppTexts.reportPage.extraDetails.contactName}
              fullWidth
              multiline
              type="text"
              margin={"normal"}
              value={inputs.contactName.value}
              onChange={inputs.contactName.onTextChange}
              error={!inputs.contactName.isTextValid}
            />
            <RTLTextField
              rows={2}
              label={AppTexts.reportPage.extraDetails.contactPhone}
              fullWidth
              multiline
              type="text"
              margin={"normal"}
              value={inputs.contactPhone.value}
              onChange={inputs.contactPhone.onPhoneChange}
              error={!inputs.contactPhone.isPhoneValid}
            />
            <RTLTextField
              rows={2}
              label={AppTexts.reportPage.extraDetails.contactEmail}
              fullWidth
              multiline
              type="text"
              margin={"normal"}
              value={inputs.contactEmail.value}
              onChange={inputs.contactEmail.onEmailChange}
              error={!inputs.contactEmail.isEmailValid}
            />
            <RTLTextField
              rows={2}
              label={AppTexts.reportPage.extraDetails.contactAddress}
              fullWidth
              multiline
              type="text"
              margin={"normal"}
              value={inputs.contactAddress.value}
              onChange={inputs.contactAddress.onTextChange}
              error={!inputs.contactAddress.isTextValid}
            />
            <RTLTextField
              rows={5}
              label={AppTexts.reportPage.extraDetails.extraDetails}
              fullWidth
              multiline
              type="text"
              margin={"normal"}
              value={inputs.extraDetails.value}
              onChange={inputs.extraDetails.onTextChange}
              error={!inputs.extraDetails.isTextValid}
            />
            <Typography
              variant="subtitle1"
              color={theme.palette.error.main}
              sx={styles.error}
            >
              {AppTexts.reportPage.error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={styles.button}
              onClick={handleSubmitForm}
            >
              <IconSend style={{ marginRight: "8px" }} />
              {AppTexts.reportPage.cta}
            </Button>
          </>
        )}
      </Box>
    </PageContainer>
  );
});
