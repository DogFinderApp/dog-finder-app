import { Dispatch, SetStateAction } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogType } from "../../types/payload.types";
import { AppRoutes } from "../../consts/routes";
import { AppTexts } from "../../consts/texts";
import { Transition } from "./Transition";

const useAlertModalStyles = createStyleHook(() => ({
  dialog: {
    margin: "0 auto",
    width: { md: "100%", xs: "90%" },
    maxWidth: "800px",
    textAlign: "center",
    ".MuiDialog-paper": {
      backgroundColor: "rgba(37, 37, 37, 0.85)",
      backdropFilter: "blur(4px)",
      height: "unset",
      paddingY: "1rem",
      borderRadius: "8px",
    },
  },
  title: { fontSize: { sm: 36, xs: 26 }, fontWeight: 600, lineHeight: 1.1 },
  content: {
    fontSize: { sm: 20, xs: 16 },
    maxWidth: "90%",
    marginX: "auto",
    textWrap: "balance",
  },
  buttonsContainer: { display: "flex", justifyContent: "center", gap: 8 },
  doneButton: { color: "white", fontSize: "16px", margin: "0 !important" },
}));

const linkStyles = {
  textDecoration: "underline",
  color: "white",
  fontSize: "16px",
};

interface AlertModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  dogType: DogType;
  newReportId: number | null;
}

export default function ReportSubmittedModal({
  isModalOpen,
  setIsModalOpen,
  dogType,
  newReportId,
}: AlertModalProps) {
  const styles = useAlertModalStyles();
  const navigate = useNavigate();

  const { title, preText, text, done, navigateToReport } =
    AppTexts.modals.reportSubmitted;
  const linkToNewReport = newReportId ? `/dogs/${newReportId}` : "/";

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleDone = () => {
    handleClose();
    navigate(AppRoutes.root);
  };

  return (
    <Dialog
      fullScreen
      open={isModalOpen}
      onClose={handleClose}
      sx={styles.dialog}
      TransitionComponent={Transition}
      dir="rtl"
    >
      <DialogTitle sx={styles.title}>{title}</DialogTitle>
      {dogType === DogType.LOST && (
        <DialogContentText sx={styles.content}>{preText}</DialogContentText>
      )}
      <DialogContentText sx={{ ...styles.content, mb: 2 }}>
        {text[dogType]}
      </DialogContentText>
      <DialogActions sx={styles.buttonsContainer}>
        <Button autoFocus>
          <Link to={linkToNewReport} style={linkStyles}>
            {navigateToReport}
          </Link>
        </Button>
        <Button onClick={handleDone} sx={styles.doneButton}>
          {done}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
