import { Dispatch, SetStateAction } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AppTexts } from "../../consts/texts";

interface DeleteReportModalProps {
  open: boolean;
  isDeleting: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deleteFunction: () => Promise<void>;
}

export const DeleteReportModal = ({
  open,
  setOpen,
  deleteFunction,
  isDeleting,
}: DeleteReportModalProps) => {
  const { title, text, text2, cancelText, continueText, deletingText } =
    AppTexts.modals.deleteReport;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
          <br />
          <span style={{ fontWeight: 600, textAlign: "center" }}>{text2}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          autoFocus
          sx={{ textDecoration: "underline" }}
        >
          {cancelText}
        </Button>
        <Button onClick={deleteFunction} color="error">
          {isDeleting ? deletingText : continueText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
