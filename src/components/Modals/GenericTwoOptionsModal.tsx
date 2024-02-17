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

type TextType = "newReport" | "sendWhatsapp";
type ModalType = "redirectToAuth0" | "useExistingReportOrCreateNew";

interface GenericTwoOptionsModalProps {
  open: true | false | "stale";
  setOpen:
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<true | false | "stale">>;
  type: ModalType;
  primaryButtonClick?: () => void;
  secondaryButtonClick?: () => void;
  redirectUri?: string;
  textType?: TextType;
  dogIdFromUrl?: number;
}

export const GenericTwoOptionsModal = ({
  open,
  setOpen,
  type,
  primaryButtonClick,
  secondaryButtonClick,
  redirectUri,
  textType,
  dogIdFromUrl,
}: GenericTwoOptionsModalProps) => {
  const { loginWithRedirect } = useAuth0();
  const redirectToAuth0Type = type === "redirectToAuth0";

  const modalTexts = redirectToAuth0Type
    ? AppTexts.modals.redirectToAuth0
    : AppTexts.modals.useExistingReportOrCreateNew;

  const handleClose = () => {
    setOpen(false);
  };

  const redirectToAuth0 = () => {
    if (dogIdFromUrl) encryptData("dog_id_to_redirect", `${dogIdFromUrl}`);
    if (redirectUri)
      loginWithRedirect({ authorizationParams: { redirect_uri: redirectUri } });
  };

  return (
    <Dialog
      open={open === true}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">{modalTexts.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {redirectToAuth0Type && !!textType
            ? // @ts-expect-error
              modalTexts.description[textType!]
            : modalTexts.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={primaryButtonClick ?? redirectToAuth0}
          autoFocus={redirectToAuth0Type}
          sx={{ textDecoration: redirectToAuth0Type ? "underline" : "none" }}
        >
          {modalTexts.continueText}
        </Button>
        <Button onClick={secondaryButtonClick ?? handleClose}>
          {modalTexts.cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
