import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { AppTexts } from "../../consts/texts";
import { cleanImage } from "../../utils/imageUtils";
import { decryptData } from "../../utils/encryptionUtils";
import { useGetServerApi } from "../../facades/ServerApi";
import { useAuthContext } from "../../context/useAuthContext";
import { createStyleHook } from "../../hooks/styleHooks";
import { usePhoneNumberInput } from "../../hooks/usePhoneNumberInput";
import { useWindowSize } from "../../hooks/useWindowSize";
import { DogType, QuickReportPayload } from "../../types/payload.types";
import { DogDetailsReturnType } from "../../types/DogDetailsTypes";
import { RTLTextField } from "../pageComponents/RTLTextInput/RTLTextField";

const useReportModalStyles = createStyleHook(() => ({
  title: {
    fontSize: { sm: 36, xs: 26 },
    fontWeight: 600,
    lineHeight: 1.1,
    textAlign: "center",
  },
  content: {
    fontSize: { sm: 20, xs: 16 },
    maxWidth: "90%",
    marginX: "auto",
    textWrap: { sm: "balance" },
    textAlign: "center",
  },
  inputContainer: { width: "90%", marginX: "auto" },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    pb: 1.5,
  },
  cancelButton: {
    color: "white",
    fontSize: "16px",
  },
  continueButton: {
    color: "white",
    fontSize: "16px",
    margin: "0 !important",
  },
  CircularProgress: { mr: { sm: 1.5, xs: 0 } },
}));

interface QuickReportModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  dogType: DogType;
  dogImage: string;
  reportPossibleMatch: Function;
  possibleMatch: DogDetailsReturnType | null; // current dog in DogDetailsPage
  getWhatsappMessage: (
    revereDogType: boolean,
    quickReportDogId: number,
  ) => string;
  contactNumber: string;
  useExistingReportModal: true | false | "stale";
  setUseExistingReportModal: Dispatch<SetStateAction<true | false | "stale">>;
}

export const QuickReportModal = ({
  open,
  setOpen,
  dogType,
  dogImage,
  reportPossibleMatch,
  possibleMatch,
  getWhatsappMessage,
  contactNumber,
  useExistingReportModal,
  setUseExistingReportModal,
}: QuickReportModalProps) => {
  const getServerApi = useGetServerApi();
  const { dispatch } = useAuthContext();
  const styles = useReportModalStyles();
  const { isMobile } = useWindowSize();
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [newReportId, setNewReportId] = useState<number | undefined>(undefined);

  const {
    title,
    description,
    goBackText,
    submitText,
    submittingText,
    contactReporter,
    submittedTitle,
  } = AppTexts.modals.quickReport;
  const { helperTexts } = AppTexts.reportPage;

  const { value, onPhoneChange, isPhoneValid, validateInput, clearInput } =
    usePhoneNumberInput({ isMandatoryInput: true });

  const fetcher = async () => {
    const oppositeDogType =
      dogType === DogType.FOUND ? DogType.LOST : DogType.FOUND;
    const payload: QuickReportPayload = {
      type: oppositeDogType,
      contactPhone: value,
      base64Images: [cleanImage(dogImage)],
    };
    try {
      const serverApi = await getServerApi();
      const response = await serverApi.report_dog(payload);
      const json = await response.json();
      if (json.status_code === 200 && json?.data?.id) {
        clearInput();
        localStorage.removeItem("searchedDogImage");
        dispatch({
          type: "ADD_NEW_REPORT",
          payload: json.data,
        });
        const newPayload = {
          lastReportedId: null,
          possibleMatchId: possibleMatch?.id,
          selectedReportId: json.data.id,
        };
        setReadyToSubmit(false);
        reportPossibleMatch(newPayload, getServerApi);
        setNewReportId(json.data.id);
        setSubmitted(true);
        return;
      }
      setReadyToSubmit(false);
    } catch (error) {
      setReadyToSubmit(false);
      setOpen(false);
      console.error(error); // eslint-disable-line
    }
  };

  // ? using null as a key to disable the fetch request up until the submit button is clicked
  const { isLoading } = useSWR(readyToSubmit ? "quick report" : null, fetcher);

  const handleSubmitForm = () => {
    if (validateInput()) setReadyToSubmit(true); // trigger the fetcher function
  };

  const inputHelperText = !isPhoneValid ? helperTexts.phone : "";
  const handleClose = () => setOpen(false);

  const goBackClick = () => {
    handleClose();
    if (decryptData("searchedDogImage") && useExistingReportModal === "stale")
      setUseExistingReportModal(true);
  };

  const whatsappLink = `https://wa.me/${contactNumber}/?text=${getWhatsappMessage(
    true,
    newReportId as number,
  )}`;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
      fullWidth
    >
      <DialogTitle sx={styles.title}>
        {submitted ? submittedTitle : title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={styles.content}>
          {/* eslint-disable-next-line */}
          {submitted ? description["submitted"] : description[dogType]}
        </DialogContentText>
      </DialogContent>
      {!submitted && (
        <DialogActions sx={styles.inputContainer}>
          <RTLTextField
            required
            fullWidth
            label="מספר טלפון"
            type="text"
            margin="normal"
            value={value}
            onChange={onPhoneChange}
            error={!isPhoneValid}
            helperText={inputHelperText}
            placeholder={helperTexts.phonePlaceholder}
          />
        </DialogActions>
      )}
      <DialogActions sx={styles.buttonsContainer}>
        {submitted ? (
          <Link to={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button sx={styles.continueButton}>{contactReporter}</Button>
          </Link>
        ) : (
          <Button onClick={handleSubmitForm} sx={styles.continueButton}>
            {!isLoading ? (
              submitText
            ) : (
              <>
                {!isMobile && (
                  <Typography
                    sx={{ textDecoration: !isLoading ? "none" : "underline" }}
                  >
                    {submittingText}
                  </Typography>
                )}
                <CircularProgress
                  size={isMobile ? 24 : 20}
                  sx={styles.CircularProgress}
                />
              </>
            )}
          </Button>
        )}
        <Button
          onClick={submitted ? handleClose : goBackClick}
          sx={styles.cancelButton}
        >
          {goBackText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
