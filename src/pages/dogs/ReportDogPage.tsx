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
import { cleanImage } from "../../utils/imageUtils";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { DogPhoto } from "../../components/reportComponents/DogPhoto/DogPhoto";
import { RTLTextField } from "../../components/pageComponents/RTLTextInput/RTLTextField";
import DatePicker from "../../components/DatePicker/DatePicker";
import { SelectInputField } from "../../components/pageComponents/SelectInput/SelectInput";
import { useImageSelection } from "../../hooks/useImageSelection";
import { useReportDogInputs } from "../../hooks/useReportDogInputs";
import usePageTitle from "../../hooks/usePageTitle";
import { createStyleHook } from "../../hooks/styleHooks";

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
    const { inputs, getInputsData, dogSexOptions } = useReportDogInputs();
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
        return `${$y}-${withZero($M)}-${withZero($D)}`;
      };

      const imageInput = cleanImage(selectedImageUrl);

      const payload: ReportDogPayload = {
        type: dogType,
        contactName: inputs.contactName.value,
        contactAddress: inputs.contactAddress.value,
        contactPhone: inputs.contactPhone.value,
        contactEmail: inputs.contactEmail.value,
        foundAtLocation: inputs.location.value,
        date: getFormattedDate(),
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
        if (dogType === DogType.FOUND) {
          navigate(AppRoutes.dogs.results.replace(":dogType", dogType), {
            state: { type: dogType, img: imageInput },
          });
        }
      }, 2000);

      clearInputs();
      setIsLoading(false);
    };

    const successMessage =
      dogType === DogType.LOST
        ? AppTexts.reportPage.request.success.reportedLost
        : AppTexts.reportPage.request.success.reportedFound;

    const alertText =
      requestStatus === "error"
        ? AppTexts.reportPage.request.error
        : successMessage;

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
              {getInputsData(dogType).map((inputField) => {
                const selectedInput = inputs[inputField.name];
                return (
                  <>
                    <RTLTextField
                      key={inputField.name}
                      label={inputField.label}
                      type="text"
                      margin="normal"
                      fullWidth
                      multiline={inputField.multiline}
                      rows={inputField.rows}
                      // @ts-expect-error
                      value={selectedInput?.value}
                      onChange={
                        // @ts-expect-error
                        inputField.onChange ?? selectedInput?.onTextChange
                      }
                      // @ts-expect-error
                      error={inputField.error ?? !selectedInput?.isTextValid}
                    />

                    {/* We need to render the "dogSex" input RIGHT AFTER "dogSize", and "date" input after "location" */}
                    {inputField.name === "dogSize" && (
                      <SelectInputField
                        options={dogSexOptions}
                        label={AppTexts.reportPage.dogDetails.dogSex}
                        onChange={inputs.dogSex.onSelectChange}
                      />
                    )}
                    {inputField.name === "location" && (
                      <DatePicker
                        reportType={dogType}
                        date={inputs.date.dateInput}
                        handleDateChange={inputs.date.handleDateChange}
                        error={!inputs.date.isInputValid}
                      />
                    )}
                  </>
                );
              })}
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
