import { Dispatch, SetStateAction } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { encryptData } from "../../utils/encryptionUtils";
import { AppTexts } from "../../consts/texts";

type ModalType = "newReport" | "sendWhatsapp";

interface RedirectToAuth0ModalProps {
  type: ModalType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  redirectUri: string;
  dogIdFromUrl?: number;
}

export const RedirectToAuth0Modal = ({
  type,
  open,
  setOpen,
  redirectUri,
  dogIdFromUrl,
}: RedirectToAuth0ModalProps) => {
  const { loginWithRedirect } = useAuth0();

  const { title, description, continueText, cancelText } =
    AppTexts.modals.redirectToAuth0;

  const handleClose = () => {
    setOpen(false);
  };

  const redirectToAuth0 = () => {
    if (dogIdFromUrl) encryptData("dog_id_to_redirect", `${dogIdFromUrl}`);
    loginWithRedirect({ authorizationParams: { redirect_uri: redirectUri } });
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
          {description[type]}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={redirectToAuth0}
          autoFocus
          sx={{ textDecoration: "underline" }}
        >
          {continueText}
        </Button>
        <Button onClick={handleClose}>{cancelText}</Button>
      </DialogActions>
    </Dialog>
  );
};
