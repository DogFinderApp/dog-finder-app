import { useEffect, useState } from "react";
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
import { AppTexts } from "../../../consts/texts";
import {
  DogType,
  ReportDogPayload,
  DogResult,
} from "../../../types/payload.types";
import { useGetServerApi } from "../../../facades/ServerApi";
import { checkForMatchingDogs } from "../../../utils/checkForMatchingDogs";
import { cleanImage } from "../../../utils/imageUtils";
import { dateToString } from "../../../utils/datesFormatter";
import { createStyleHook } from "../../../hooks/styleHooks";
import usePageTitle from "../../../hooks/usePageTitle";
import { useAuthContext } from "../../../context/useAuthContext";
import { useImageSelection } from "../../../hooks/useImageSelection";
import { PageContainer } from "../../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../../components/pageComponents/PageTitle/PageTitle";
import { DogPhoto } from "../../../components/reportComponents/DogPhoto/DogPhoto";
import { RTLTextField } from "../../../components/pageComponents/RTLTextInput/RTLTextField";
import DatePicker from "../../../components/DatePicker/DatePicker";
import { SelectInputField } from "../../../components/pageComponents/SelectInput/SelectInput";
import MatchingReportModal from "../../../components/Modals/MatchingReportModal";
import ReportSubmittedModal from "../../../components/Modals/ReportSubmittedModal";
import { useReportDogInputs } from "./useFormInputs";

const useReportDogPageStyles = createStyleHook(
  (theme, props: { isError: boolean }) => ({
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
    alert: {
      width: "100%",
      fontSize: { sm: 22, xs: 20 },
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "right",
      ".MuiAlert-action": { ml: "unset" },
      ".MuiAlert-icon": { fontSize: 24 },
    },
  }),
);

interface ReportDogPageProps {
  dogType: DogType;
}

export const ReportDogPage = withAuthenticationRequired(
  ({ dogType }: ReportDogPageProps) => {
    const { dispatch } = useAuthContext();
    const { inputs, getInputsData } = useReportDogInputs();
    const getServerApi = useGetServerApi();

    const [isMissingImage, setIsMissingImage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState<string>("");
    const [newReportId, setNewReportId] = useState<number | null>(null);
    const [matchingReportModalOpen, setMatchingReportModalOpen] =
      useState(false);
    const [reportSubmittedModalOpen, setReportSubmittedModalOpen] =
      useState(false);
    const [matchingReports, setMatchingReports] = useState<DogResult[]>([]);

    const { onSelectImage, selectedImageUrl, clearSelection } =
      useImageSelection(
        dogType,
        setMatchingReports,
        setMatchingReportModalOpen,
      );

    useEffect(() => {
      window.scroll({ top: 0 });
      // ? we take the image we memorized in the search and then delete it from localStorage. the image should be used once.
      setTimeout(() => localStorage.removeItem("searchedDogImage"), 1000);
      if (selectedImageUrl) {
        const payload = {
          base64Image: cleanImage(selectedImageUrl),
          type: dogType,
        };
        checkForMatchingDogs(
          payload,
          getServerApi,
          setMatchingReports,
          setMatchingReportModalOpen,
        );
      }
    }, [selectedImageUrl, dogType, getServerApi]);

    const { request, submitText, errorText } = AppTexts.reportPage;

    const title =
      dogType === DogType.LOST
        ? AppTexts.navigation.reportLost
        : AppTexts.navigation.reportFound;

    usePageTitle(title);
    const theme = useTheme();
    const styles = useReportDogPageStyles({ isError: showErrorMessage });

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
      const noSelectedImage = !selectedImageUrl;
      setIsMissingImage(noSelectedImage);

      // Validate all mandatory fields were filled
      const inputValidation = Object.values(inputs).map((input) =>
        input.validateInput(),
      );
      const hasInvalidInputs = inputValidation.some((res) => !res);
      const showError = hasInvalidInputs || noSelectedImage;
      setShowErrorMessage(showError);
      if (showError) return;

      const base64Image = cleanImage(selectedImageUrl);
      const payload: ReportDogPayload = {
        type: dogType,
        contactName: inputs.contactName.value,
        contactAddress: inputs.contactAddress.value,
        contactPhone: inputs.contactPhone.value,
        contactEmail: inputs.contactEmail.value,
        location: inputs.location.value,
        dogFoundOn: inputs.date.dateInput
          ? dateToString(inputs.date.dateInput)
          : null,
        breed: inputs.dogBreed.value,
        color: inputs.dogColor.value,
        size: inputs.dogSize.value,
        chipNumber: inputs.chipNumber.value.length
          ? inputs.chipNumber.value
          : "לא ידוע",
        extraDetails: inputs.extraDetails.value,
        sex: inputs.dogSex.value.length ? inputs.dogSex.value : null,
        ageGroup: inputs.ageGroup.value,
        base64Images: [base64Image],
      };

      setIsLoading(true);
      try {
        const response = await serverApi.report_dog(payload);
        const json = await response.json();
        if (json.status_code === 200 && json?.data?.id) {
          setIsLoading(false);
          clearInputs();
          dispatch({ type: "ADD_NEW_REPORT", payload: json.data });
          setNewReportId(json.data.id);
          setReportSubmittedModalOpen(true);
        } else {
          setRequestStatus("error");
          setIsLoading(false);
        }
      } catch (error) {
        setRequestStatus("error");
        setIsLoading(false);
        console.error(error); // eslint-disable-line
      }
    };

    const successMessage =
      dogType === DogType.LOST
        ? request.success.reportedLost
        : request.success.reportedFound;

    const alertText =
      requestStatus === "error" ? request.error : successMessage;

    return (
      <>
        <MatchingReportModal
          matchingReports={matchingReports}
          isModalOpen={matchingReportModalOpen}
          setIsModalOpen={setMatchingReportModalOpen}
          dogType={dogType}
        />
        <ReportSubmittedModal
          isModalOpen={reportSubmittedModalOpen}
          setIsModalOpen={setReportSubmittedModalOpen}
          dogType={dogType}
          newReportId={newReportId}
        />
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
                sx={styles.alert}
              >
                {alertText}
                <br />
                {alertText === successMessage && request.success.redirect}
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
                  const isSelectType = [
                    // represents inputs with type="select"
                    "dogSize",
                    "dogSex",
                    "ageGroup",
                  ].includes(inputField.name);

                  return (
                    <div key={inputField.name} style={{ width: "100%" }}>
                      {isSelectType ? (
                        <SelectInputField
                          options={inputField.options!}
                          label={inputField.label}
                          onChange={inputField.onChange}
                          error={inputField.error}
                          // @ts-expect-error
                          value={selectedInput?.value!}
                        />
                      ) : inputField.name === "date" ? (
                        <DatePicker
                          label={inputField.label}
                          date={inputField.date!}
                          handleDateChange={inputField.onChange!}
                          error={inputField.error!}
                        />
                      ) : (
                        <RTLTextField
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
                          error={
                            // @ts-expect-error
                            inputField.error ?? !selectedInput?.isTextValid
                          }
                          helperText={inputField.helperText}
                          placeholder={inputField.placeholder}
                          required={inputField.required}
                        />
                      )}
                    </div>
                  );
                })}
                <Typography
                  variant="subtitle1"
                  color={theme.palette.error.main}
                  sx={styles.error}
                >
                  {errorText}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={styles.button}
                  onClick={handleSubmitForm}
                >
                  <IconSend style={{ marginRight: "8px" }} />
                  {submitText}
                </Button>
              </>
            )}
          </Box>
        </PageContainer>
      </>
    );
  },
);
