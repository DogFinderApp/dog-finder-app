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
import { DogType, ReportDogPayload, DogSex } from "../../types/payload.types";
import { useGetServerApi } from "../../facades/ServerApi";
import { cleanImage } from "../../utils/imageUtils";
import { dateToString } from "../../utils/datesFormatter";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogDetailsReturnType } from "../../types/DogDetailsTypes";
import usePageTitle from "../../hooks/usePageTitle";
import { useAuthContext } from "../../context/useAuthContext";
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
import MatchingReportModal from "../../components/pageComponents/Modal/MatchingReportModal";

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
    const [isMissingImage, setIsMissingImage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [matchingReports, setMatchingReports] = useState<
      DogDetailsReturnType[]
    >([]);
    const { onSelectImage, selectedImageUrl, clearSelection } =
      useImageSelection(dogType, setMatchingReports, setIsModalOpen);

    const title =
      dogType === DogType.LOST
        ? AppTexts.navigation.reportLost
        : AppTexts.navigation.reportFound;

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
      ageGroup: useSelectInput({
        isMandatoryInput: false,
        possibleValues: Object.keys(AppTexts.reportPage.dogAge),
      }),
      dogColor: useTextInput({ isMandatoryInput: false }),
      dogSex: useSelectInput({
        isMandatoryInput: false,
        possibleValues: Object.keys(dogSexOptions),
      }),
      chipNumber: useTextInput({ isMandatoryInput: false }),
      location: useTextInput({ isMandatoryInput: true }),
      date: useDateInput({ isMandatoryInput: false }),
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

    const navigateToResultsPage = ({
      base64Image,
    }: {
      base64Image: string;
    }) => {
      const dogTypeToSearch = dogType === "found" ? "lost" : "found";
      const url = AppRoutes.dogs.results.replace(":dogType", dogTypeToSearch);
      navigate(url, { state: { type: dogTypeToSearch, base64Image } });
    };

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
        if (json.status_code === 200) {
          setRequestStatus("success");
          setIsLoading(false);
          clearInputs();
          dispatch({ type: "ADD_NEW_REPORT", payload: json.data });
          setTimeout(() => {
            // wait before navigating to results page in order to show the success/error toast
            navigateToResultsPage({ base64Image });
          }, 2000);
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

    const phoneInputHelperText = !inputs.contactPhone.isPhoneValid
      ? AppTexts.reportPage.helperTexts.phone
      : "";

    const emailInputHelperText = !inputs.contactEmail.isEmailValid
      ? AppTexts.reportPage.helperTexts.email
      : "";

    return (
      <>
        <MatchingReportModal
          matchingReports={matchingReports}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          dogType={dogType}
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
                {alertText === successMessage &&
                  AppTexts.reportPage.request.success.redirect}
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
                <SelectInputField
                  options={AppTexts.reportPage.dogAge}
                  label={AppTexts.reportPage.dogDetails.dogAge}
                  onChange={inputs.ageGroup.onSelectChange}
                  error={!inputs.ageGroup.isValueValid}
                  value={inputs.ageGroup.value}
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
                <DatePicker
                  reportType={dogType}
                  date={inputs.date.dateInput}
                  handleDateChange={inputs.date.handleDateChange}
                  error={!inputs.date.isInputValid}
                />
                <RTLTextField
                  label={locationText}
                  fullWidth
                  required
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
                  required
                  multiline
                  type="text"
                  margin="normal"
                  value={inputs.contactName.value}
                  onChange={inputs.contactName.onTextChange}
                  error={!inputs.contactName.isTextValid}
                />
                <RTLTextField
                  rows={2}
                  label={AppTexts.reportPage.extraDetails.contactPhone}
                  fullWidth
                  required
                  multiline
                  type="tel"
                  margin="normal"
                  value={inputs.contactPhone.value}
                  onChange={inputs.contactPhone.onPhoneChange}
                  error={!inputs.contactPhone.isPhoneValid}
                  helperText={phoneInputHelperText}
                  placeholder={AppTexts.reportPage.helperTexts.phonePlaceholder}
                />
                <RTLTextField
                  rows={2}
                  label={AppTexts.reportPage.extraDetails.contactEmail}
                  fullWidth
                  required
                  multiline
                  type="text"
                  margin="normal"
                  value={inputs.contactEmail.value}
                  onChange={inputs.contactEmail.onEmailChange}
                  error={!inputs.contactEmail.isEmailValid}
                  helperText={emailInputHelperText}
                />
                <RTLTextField
                  rows={2}
                  label={AppTexts.reportPage.extraDetails.contactAddress}
                  fullWidth
                  multiline
                  type="text"
                  margin="normal"
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
                  margin="normal"
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
      </>
    );
  },
);
