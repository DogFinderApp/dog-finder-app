import { Dispatch, SetStateAction } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { matchGender } from "../../utils/matchGenderText";
import { useGetServerApi } from "../../facades/ServerApi";
import { AppTexts } from "../../consts/texts";
import { useAuthContext } from "../../context/useAuthContext";
import { DogDetailsReturnType } from "../../types/DogDetailsTypes";
import { createStyleHook } from "../../hooks/styleHooks";
import { Transition } from "./Transition";

const useReportSelectStyles = createStyleHook(
  (theme, props: { selectedReportId: number | null }) => ({
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
    imageContainer: {
      position: "relative",
      width: "90%",
      maxWidth: "500px",
      margin: "2rem auto",
      padding: 0,
    },
    DogCardContainer: { height: 230, backgroundColor: "white" },
    DogCardTextContainer: {
      mt: 2,
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    buttonsContainer: { display: "flex", justifyContent: "center", gap: 8 },
    cancelButton: {
      color: "white",
      fontSize: "16px",
    },
    continueButton: {
      color: "white",
      fontSize: "16px",
      margin: "0 !important",
      opacity: !!props.selectedReportId ? 1 : 0.5,
      transition: "0.3s ease",
    },
  }),
);

interface ReportSelectProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedReportId: number | null;
  setSelectedReportId: Dispatch<SetStateAction<number | null>>;
  confirmFunction: Function;
  whatsappLink: string;
  possibleMatchId: number;
}

export default function ReportSelectModal({
  isModalOpen,
  setIsModalOpen,
  selectedReportId,
  setSelectedReportId,
  confirmFunction,
  whatsappLink,
  possibleMatchId,
}: ReportSelectProps) {
  const styles = useReportSelectStyles({ selectedReportId });
  const getServerApi = useGetServerApi();
  const {
    state: { reports },
  } = useAuthContext();

  const {
    title,
    cancelText,
    text1,
    text2,
    bottomText,
    continueText,
    status,
    toolTipText,
  } = AppTexts.modals.selectReport;

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedReportId(null);
  };

  const handleConfirm = () => {
    if (!selectedReportId) return;
    const payload = { lastReportedId: null, possibleMatchId, selectedReportId };
    confirmFunction(payload, getServerApi);
    handleClose();
  };

  const handleReportClick = (report: DogDetailsReturnType) =>
    selectedReportId !== report.id
      ? setSelectedReportId(report.id)
      : setSelectedReportId(null);

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
          {text1}
          <br />
          {text2}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.imageContainer}>
        {!!reports && (
          <Grid container spacing={2} dir="rtl">
            {reports.map((report) => {
              const dogImage = report.images[0];
              const imageInValidFormat = `data:${dogImage?.imageContentType};base64, ${dogImage?.base64Image}`;
              const dogDetailsTexts: string[] = [
                matchGender(status[report.type], report.sex),
                report.location,
                report.dogFoundOn,
              ];

              return (
                <Grid item xs={12} sm={6} md={4} key={report.id}>
                  <Box
                    onClick={() => handleReportClick(report)}
                    sx={{
                      ...styles.DogCardContainer,
                      outline:
                        selectedReportId === report.id
                          ? "3px solid #5F95C9"
                          : "none",
                    }}
                  >
                    <img
                      src={imageInValidFormat}
                      alt=""
                      style={{ width: "100%", maxHeight: "400px" }}
                    />
                    <Box sx={styles.DogCardTextContainer}>
                      {dogDetailsTexts.map((text) => (
                        <Typography key={text} color="#343842" fontWeight={600}>
                          {text}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogActions>

      <DialogContentText
        sx={{ ...styles.content, mb: 2, fontSize: 16, maxWidth: 500 }}
      >
        {bottomText}
      </DialogContentText>
      <DialogActions sx={styles.buttonsContainer}>
        <Button autoFocus onClick={handleClose} sx={styles.cancelButton}>
          {cancelText}
        </Button>
        <Tooltip followCursor title={!selectedReportId ? toolTipText : ""}>
          <Link
            to={!selectedReportId ? "#" : whatsappLink}
            onClick={(event) => !selectedReportId && event.preventDefault()}
            aria-disabled={!selectedReportId}
            style={{ cursor: selectedReportId ? "pointer" : "not-allowed" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              disabled={!selectedReportId}
              onClick={handleConfirm}
              sx={styles.continueButton}
            >
              {continueText}
            </Button>
          </Link>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
