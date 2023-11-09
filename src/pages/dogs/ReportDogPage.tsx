import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { IconSend } from "@tabler/icons-react";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";
import { DogType, ReportDogPayload } from "../../facades/payload.types";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogSex } from "../../facades/payload.types";
import { cleanImage } from "../../utils/imageUtils";
import { createStyleHook } from "../../hooks/styleHooks";
import usePageTitle from "../../hooks/usePageTitle";
import { useImageSelection } from "../../hooks/useImageSelection";
import { useTextInput } from "../../hooks/useTextInput";
import { useSelectInput } from "../../hooks/useSelectInput";
import { useDateInput } from "../../hooks/useDateInput";
import { usePhoneNumberInput } from "../../hooks/usePhoneNumberInput";
import { useEmailInput } from "../../hooks/useEmailInput";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { DogPhoto } from "../../components/reportComponents/DogPhoto/DogPhoto";
import { RTLTextField } from "../../components/pageComponents/RTLTextInput/RTLTextField";
import DatePicker from "../../components/DatePicker/DatePicker";
import { SelectInputField } from "../../components/pageComponents/SelectInput/SelectInput";

const useReportDogPageStyles = createStyleHook(
  (theme, props: { isError: boolean }) => {
    return {
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
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
  dogType: DogType;
}

export const ReportDogPage = withAuthenticationRequired(
  ({ dogType }: ReportDogPageProps) => {
    const { onSelectImage, selectedImageUrl, clearSelection } =
      useImageSelection();
    const [isMissingImage, setIsMissingImage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState<string>("");

    const title =
      dogType === DogType.LOST
        ? AppTexts.reportPage.title.lost
        : AppTexts.reportPage.title.found;

    usePageTitle(title);
    const theme = useTheme();
    const navigate = useNavigate();
    const styles = useReportDogPageStyles({ isError: showErrorMessage });
    const getServerApi = useGetServerApi();

    const dogSexOptions = {
      [DogSex.FEMALE]: AppTexts.reportPage.dogSex.female,
      [DogSex.MALE]: AppTexts.reportPage.dogSex.male,
    };

    const inputs = {
      dogBreed: useTextInput({ isMandatoryInput: false }),
      dogSize: useTextInput({ isMandatoryInput: false }),
      dogColor: useTextInput({ isMandatoryInput: false }),
      dogSex: useSelectInput({
        isMandatoryInput: false,
        possibleValues: Object.keys(dogSexOptions),
      }),
      chipNumber: useTextInput({ isMandatoryInput: false }),
      location: useTextInput({ isMandatoryInput: true }),
      date: useDateInput({ isMandatoryInput: true }),
      contactName: useTextInput({ isMandatoryInput: true }),
      contactPhone: usePhoneNumberInput({ isMandatoryInput: true }),
      contactEmail: useEmailInput({ isMandatoryInput: true }),
      contactAddress: useTextInput({ isMandatoryInput: false }),
      extraDetails: useTextInput({ isMandatoryInput: false }),
    };

    const clearInputs = () => {
      Object.values(inputs).forEach((input) => {
        input.clearInput();
      });
      clearSelection();
    };

    const handleCloseError = () => setRequestStatus("");

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
      if (showError) return;

      const getFormattedDate = () => {
        const withZero = (number: number) =>
          `${number}`.length === 2 ? number : `0${number}`;

        const { dateInput } = inputs.date;
        // @ts-expect-error
        const { $D, $M, $y } = dateInput;
        // format the selected date to match yyyy-mm-dd
        // the $M parameter starts from 0, so we need to add 1 to it
        return `${$y}-${withZero($M + 1)}-${withZero($D)}`;
      };

      const imageInput = cleanImage(selectedImageUrl);
      const payload: ReportDogPayload = {
        type: dogType,
        contactName: inputs.contactName.value,
        contactAddress: inputs.contactAddress.value,
        contactPhone: inputs.contactPhone.value,
        contactEmail: inputs.contactEmail.value,
        location: inputs.location.value,
        dogFoundOn: getFormattedDate(),
        breed: inputs.dogBreed.value,
        color: inputs.dogColor.value,
        size: inputs.dogSize.value,
        chipNumber: inputs.chipNumber.value,
        extraDetails: inputs.extraDetails.value,
        sex: inputs.dogSex.value,
        base64Images: [imageInput],
      };

      setIsLoading(true);
      const response = await serverApi.report_dog(payload);
      if (response.status !== 200) {
        setRequestStatus("error");
        setIsLoading(false);
        return;
      }

      setRequestStatus("success");
      setIsLoading(false);
      clearInputs();
      setTimeout(() => {
        // wait before navigating to results page in order to show the success/error toast
        const dogTypeToSearch = dogType === "found" ? "lost" : "found";
        navigate(AppRoutes.dogs.results.replace(":dogType", dogTypeToSearch), {
          state: { type: dogTypeToSearch, base64Image: imageInput },
        });
      }, 2000);
    };

    const successMessage =
      dogType === DogType.LOST
        ? AppTexts.reportPage.request.success.reportedLost
        : AppTexts.reportPage.request.success.reportedFound;

    const alertText =
      requestStatus === "error"
        ? AppTexts.reportPage.request.error
        : successMessage;

    const locationText =
      dogType === DogType.LOST
        ? AppTexts.reportPage.locationDetails.locationDescriptionLost
        : AppTexts.reportPage.locationDetails.locationDescriptionFound;

    return (
      <PageContainer>
        <Box sx={styles.root}>
          <PageTitle text={title} />
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
              {alertText}
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
              <SelectInputField
                options={dogSexOptions}
                label={AppTexts.reportPage.dogDetails.dogSex}
                onChange={inputs.dogSex.onSelectChange}
                error={!inputs.dogSex.isValueValid}
                value={inputs.dogSex.value}
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
              <RTLTextField
                label={AppTexts.reportPage.dogDetails.chipNumber}
                type="text"
                fullWidth
                margin="normal"
                value={inputs.chipNumber.value}
                onChange={inputs.chipNumber.onTextChange}
                error={!inputs.chipNumber.isTextValid}
              />
              <RTLTextField
                label={locationText}
                fullWidth
                type="text"
                margin="normal"
                value={inputs.location.value}
                onChange={inputs.location.onTextChange}
                error={!inputs.location.isTextValid}
              />
              <DatePicker
                reportType={dogType}
                date={inputs.date.dateInput}
                handleDateChange={inputs.date.handleDateChange}
                error={!inputs.date.isInputValid}
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
  }
);
