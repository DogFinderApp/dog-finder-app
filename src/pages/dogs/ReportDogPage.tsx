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
import { DogSex, DogType, ReportDogPayload } from "../../facades/payload.types";
import { useGetServerApi } from "../../facades/ServerApi";
import { cleanImage } from "../../utils/imageUtils";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { DogPhoto } from "../../components/reportComponents/DogPhoto/DogPhoto";
import { RTLTextField } from "../../components/pageComponents/RTLTextInput/RTLTextField";
import DatePicker from "../../components/DatePicker/DatePicker";
import { SelectInputField } from "../../components/pageComponents/SelectInput/SelectInput";
import { useImageSelection } from "../../hooks/useImageSelection";
import usePageTitle from "../../hooks/usePageTitle";
import { useTextInput } from "../../hooks/useTextInput";
import { createStyleHook } from "../../hooks/styleHooks";
import { usePhoneNumberInput } from "../../hooks/usePhoneNumberInput";
import { useEmailInput } from "../../hooks/useEmailInput";
import { useSelectInput } from "../../hooks/useSelectInput";
import { useDateInput } from "../../hooks/useDateInput";

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
        isMandatoryInput: true,
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

    const locationText =
      dogType === DogType.LOST
        ? AppTexts.reportPage.locationDetails.locationDescriptionLost
        : AppTexts.reportPage.locationDetails.locationDescriptionFound;

    interface InputData {
      name: keyof typeof inputs;
      label: string;
      onChange?: (event: any) => void;
      error?: boolean;
      multiline?: boolean;
      rows?: number;
    }

    const inputsData: InputData[] = [
      {
        name: "dogBreed",
        label: AppTexts.reportPage.dogDetails.dogRace,
      },
      {
        name: "dogSize",
        label: AppTexts.reportPage.dogDetails.dogSize,
      },
      {
        name: "dogColor",
        label: AppTexts.reportPage.dogDetails.dogColor,
      },
      {
        name: "chipNumber",
        label: AppTexts.reportPage.dogDetails.chipNumber,
      },
      {
        name: "location",
        label: locationText,
      },
      {
        name: "contactName",
        label: AppTexts.reportPage.extraDetails.contactName,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactPhone",
        label: AppTexts.reportPage.extraDetails.contactPhone,
        onChange: inputs.contactPhone.onPhoneChange,
        error: !inputs.contactPhone.isPhoneValid,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactEmail",
        label: AppTexts.reportPage.extraDetails.contactEmail,
        onChange: inputs.contactEmail.onEmailChange,
        error: !inputs.contactEmail.isEmailValid,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactAddress",
        label: AppTexts.reportPage.extraDetails.contactAddress,
        multiline: true,
        rows: 2,
      },
      {
        name: "extraDetails",
        label: AppTexts.reportPage.extraDetails.extraDetails,
        multiline: true,
        rows: 5,
      },
    ];

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
              {inputsData.map((inputField) => {
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
