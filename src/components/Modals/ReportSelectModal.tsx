import { Dispatch, SetStateAction, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { matchGender } from "../../utils/matchGenderText";
import { decryptData } from "../../utils/encryptionUtils";
import { useGetServerApi } from "../../facades/ServerApi";
import { AppTexts } from "../../consts/texts";
import { useAuthContext } from "../../context/useAuthContext";
import { DogDetailsReturnType } from "../../types/DogDetailsTypes";
import { createStyleHook } from "../../hooks/styleHooks";
import { usePagination } from "../../hooks/usePagination";
import { Pagination } from "../pageComponents/Pagination/Pagination";
import { Transition } from "./Transition";

const useReportSelectStyles = createStyleHook(
  (theme, props: { selectedReportId: number | null }) => ({
    dialog: {
      direction: { xs: "ltr", sm: "rtl" },
      margin: "0 auto",
      width: { md: "100%", xs: "90%" },
      maxWidth: "1000px",
      textAlign: "center",
      ".MuiDialog-paper": {
        backgroundColor: "rgba(37, 37, 37, 0.85)",
        backdropFilter: "blur(4px)",
        height: { xs: "90%", sm: "unset" },
        paddingY: "1rem",
        borderRadius: "8px",
      },
    },
    title: { fontSize: { sm: 36, xs: 26 }, fontWeight: 600, lineHeight: 1.1 },
    topTextContainer: { overflowY: "visible", py: 0 },
    topText: {
      fontSize: { sm: 20, xs: 16 },
      maxWidth: "90%",
      marginX: "auto",
      textWrap: "balance",
    },
    gridContainer: {
      width: "90%",
      maxWidth: "800px",
      margin: "2rem auto",
      padding: 0,
    },
    DogCardContainer: {
      height: "315px",
      backgroundColor: "white",
      transition: "0.1s ease",
    },
    DogCardTextContainer: {
      mt: 2,
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    buttonsContainer: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "center",
      gap: { xs: 1, sm: 8 },
    },
    cancelButton: {
      color: "white",
      fontSize: "16px",
    },
    continueButton: {
      textDecoration: "underline",
      color: "white",
      fontSize: "16px",
      margin: "0 !important",
      opacity: props.selectedReportId ? 1 : 0.5,
      transition: "0.2s ease",
    },
  }),
);

interface ReportSelectProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedReportId: number | null;
  setSelectedReportId: Dispatch<SetStateAction<number | null>>;
  confirmFunction: Function;
  getWhatsappMessage: (revereDogType: boolean) => string;
  possibleMatch: DogDetailsReturnType | null;
  contactNumber: string;
  useExistingReportModal: true | false | "stale";
  setUseExistingReportModal: Dispatch<SetStateAction<true | false | "stale">>;
}

export default function ReportSelectModal({
  isModalOpen,
  setIsModalOpen,
  selectedReportId,
  setSelectedReportId,
  confirmFunction,
  getWhatsappMessage,
  possibleMatch,
  contactNumber,
  useExistingReportModal,
  setUseExistingReportModal,
}: ReportSelectProps) {
  const styles = useReportSelectStyles({ selectedReportId });
  const getServerApi = useGetServerApi();
  const topElementRef = useRef(null);
  const {
    state: { reports },
  } = useAuthContext();

  const updatedWhatsappLink = `https://wa.me/${contactNumber}/?text=${getWhatsappMessage(
    true,
  )}`;
  // we need to store the whatsapp link in state in order to modify it when the user selects a report.
  // each time we use `updatedWhatsappLink` we call getWhatsappMessage() to get the latest version of the text
  const [whatsappLink, setWhatsappLink] = useState<string>(updatedWhatsappLink);
  const [page, setPage] = useState<number>(1);

  const { title, description, cancelText, continueText, status, toolTipText } =
    AppTexts.modals.selectReport;

  const pageSize = 3;
  const userOppositeReports =
    reports?.filter((report) => report.type !== possibleMatch?.type) ?? [];
  const paginatedReports = usePagination(userOppositeReports ?? [], pageSize);
  const pagesCount: number = Math.ceil(
    (userOppositeReports?.length ?? 0) / pageSize,
  );

  const handleClose = () => {
    setSelectedReportId(null);
    setWhatsappLink(updatedWhatsappLink); // get the updated link and save it in state
    setIsModalOpen(false);
    setTimeout(() => {
      // we want to reset the page only after the fade-out animation is completely over
      setPage(1);
      paginatedReports.jump(1);
    }, 500);
  };

  const handleGoBack = () => {
    handleClose();
    if (decryptData("searchedDogImage") && useExistingReportModal === "stale") {
      setUseExistingReportModal(true);
    }
  };

  const handleConfirm = () => {
    if (!selectedReportId) return;
    const payload = {
      lastReportedId: null,
      possibleMatchId: possibleMatch?.id,
      selectedReportId,
    };
    confirmFunction(payload, getServerApi);
    handleClose();
  };

  const handleReportClick = (report: DogDetailsReturnType) => {
    setSelectedReportId(selectedReportId === report.id ? null : report.id);
    setWhatsappLink(updatedWhatsappLink); // get the updated link and save it in state
  };

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number | string,
  ) => {
    const newValue = typeof value === "number" ? value : 1;
    setPage(newValue);
    paginatedReports.jump(newValue);
    // @ts-expect-error
    topElementRef?.current?.scrollIntoView({ block: "end" });
  };

  const dogDetailsTexts = (report: DogDetailsReturnType) => [
    matchGender(status[report.type], report.sex),
    report.location,
    report.dogFoundOn,
  ];

  const boxBorderStyle = (report: DogDetailsReturnType) => ({
    outline: selectedReportId === report.id ? "3px solid #5F95C9" : "none",
  });

  return (
    <Dialog
      fullScreen
      open={isModalOpen}
      onClose={handleClose}
      sx={styles.dialog}
      TransitionComponent={Transition}
    >
      <DialogTitle sx={styles.title} ref={topElementRef}>
        {title}
      </DialogTitle>
      <DialogContent sx={styles.topTextContainer}>
        <DialogContentText sx={styles.topText}>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.gridContainer}>
        {!!userOppositeReports && (
          <Grid container spacing={2} dir="rtl">
            {paginatedReports
              .currentData()
              .map((report: DogDetailsReturnType) => {
                const dogImage = report.images[0];
                const validDogImage = `data:${dogImage?.imageContentType};base64, ${dogImage?.base64Image}`;
                return (
                  <Grid item xs={12} sm={4} md={4} key={report.id}>
                    <Box
                      onClick={() => handleReportClick(report)}
                      sx={{
                        ...styles.DogCardContainer,
                        ...boxBorderStyle(report),
                      }}
                    >
                      <img
                        src={validDogImage}
                        alt=""
                        style={{ height: "200px", width: "100%" }}
                      />
                      <Box sx={styles.DogCardTextContainer}>
                        {dogDetailsTexts(report).map((text) => (
                          <Typography
                            key={text}
                            color="#343842"
                            fontWeight={600}
                          >
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
      {userOppositeReports && userOppositeReports.length > pageSize && (
        <Pagination
          count={pagesCount}
          page={page}
          onChange={handlePagination}
          mb="1rem"
        />
      )}
      <DialogActions sx={styles.buttonsContainer}>
        <Tooltip followCursor title={!selectedReportId ? toolTipText : ""}>
          <Link
            to={whatsappLink}
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
        <Button onClick={handleGoBack} sx={styles.cancelButton}>
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
