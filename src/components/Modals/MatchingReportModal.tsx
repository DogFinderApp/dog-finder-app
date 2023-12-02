import { Dispatch, SetStateAction, forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Fade, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogType, DogResult } from "../../types/payload.types";
import { AppRoutes } from "../../consts/routes";
import { AppTexts } from "../../consts/texts";

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
  content: { fontSize: { sm: 20, xs: 16 } },
  imageContainer: {
    position: "relative",
    width: "90%",
    maxWidth: "500px",
    margin: "2rem auto",
    padding: 0,
  },
  linkText: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "8px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.85)",
    },
  },
  buttonsContainer: { display: "flex", justifyContent: "center", gap: 8 },
  cancelButton: {
    textDecoration: "underline",
    color: "white",
    fontSize: "16px",
  },
  continueButton: { color: "white", fontSize: "16px", margin: "0 !important" },
}));

const linkStyles = {
  position: "absolute" as const,
  bottom: "1rem",
  left: "1rem",
  textDecoration: "none",
  margin: 0,
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade in ref={ref} timeout={300} {...props} />;
});

interface AlertModalProps {
  matchingReports: DogResult[];
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  dogType: DogType;
}

export default function MatchingReportModal({
  matchingReports,
  isModalOpen,
  setIsModalOpen,
  dogType,
}: AlertModalProps) {
  const styles = useAlertModalStyles();
  const navigate = useNavigate();
  const { title, alertTexts, watchProfile, cancelText, continueText } =
    AppTexts.modals.matchingReport;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
    navigate(AppRoutes.root);
  };

  const mostMatchingReport = matchingReports ? matchingReports[0] : null;
  const image = `data:${mostMatchingReport?.imageContentType};base64, ${mostMatchingReport?.imageBase64}`;

  return (
    <Dialog
      fullScreen
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={styles.dialog}
      TransitionComponent={Transition}
      dir="rtl"
    >
      <DialogTitle sx={styles.title}>{title}</DialogTitle>
      <DialogContent sx={{ flex: "unset" }}>
        <DialogContentText sx={styles.content}>
          {alertTexts[dogType]}
        </DialogContentText>
      </DialogContent>
      {mostMatchingReport && (
        <DialogActions sx={styles.imageContainer}>
          <img
            src={image}
            alt=""
            style={{ width: "100%", maxHeight: "400px" }}
          />
          <a
            href={AppRoutes.dogs.dogPage.replace(
              ":dog_id",
              mostMatchingReport.dogId,
            )}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
          >
            <Typography sx={styles.linkText}>{watchProfile}</Typography>
          </a>
        </DialogActions>
      )}
      <DialogActions sx={styles.buttonsContainer}>
        <Button autoFocus onClick={handleCancelButton} sx={styles.cancelButton}>
          {cancelText}
        </Button>
        <Button onClick={handleClose} sx={styles.continueButton}>
          {continueText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
