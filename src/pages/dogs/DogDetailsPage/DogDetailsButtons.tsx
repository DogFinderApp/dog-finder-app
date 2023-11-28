import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { IconArrowLeft, TablerIconsProps } from "@tabler/icons-react";
import { DogDetailsReturnType } from "../../../types/DogDetailsTypes";
import { useAuthContext } from "../../../context/useAuthContext";
import { createStyleHook } from "../../../hooks/styleHooks";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { useGetServerApi } from "../../../facades/ServerApi";
import { AppTexts } from "../../../consts/texts";
import WhatsappIcon from "../../../assets/svg/whatsapp.svg";

interface DogDetailsButtonsStyle {
  isTablet: boolean;
  noUserReports: boolean;
}

const useDogDetailsButtonsStyles = createStyleHook(
  (theme, { isTablet, noUserReports }: DogDetailsButtonsStyle) => ({
    actionBtnWrapper: {
      display: "flex",
      flexDirection: {
        xs: "column-reverse",
        md: "row",
      },
      gap: { md: "2rem", xs: "12px" },
    },
    actionBtnStyle: {
      width: { xs: "85vw", md: "15rem" },
      maxWidth: "480px",
      height: { xs: "5vh", md: "5vh" },
    },
    buttonDisabledText: {
      color: "white",
      position: "absolute",
      bottom: isTablet ? "unset" : -23,
      top: isTablet ? -23 : "unset",
      fontSize: 14,
      width: "100%",
      textAlign: "center",
    },
    contactBtnStyle: {
      width: { xs: "85vw", md: "15rem" },
      maxWidth: "480px",
      height: { xs: "5vh", md: "5vh" },
      backgroundColor: "#E3F0FF",
      color: theme.palette.primary.main,
      cursor: noUserReports ? "not-allowed" : "pointer",
      opacity: noUserReports ? 0.6 : 1,
      "&:hover": { backgroundColor: "#cad6e4 !important" },
    },
  }),
);

const reportPossibleMatch = async (
  payload: { lastReportedId: number | null; possibleMatchId: number },
  getServerApi: Function,
  // eslint-disable-next-line
): Promise<void> => {
  const { lastReportedId, possibleMatchId } = payload;
  if (!lastReportedId) return console.error("User has no previous reports"); // eslint-disable-line

  const serverApi = await getServerApi();
  const response = await serverApi.addPossibleDogMatch({
    dogId: lastReportedId,
    possibleMatchId,
  });
  // eslint-disable-next-line
  if (!response?.ok) console.error("Failed to report possible match");
};

interface DogDetailsButtonsProps {
  data: DogDetailsReturnType | null;
}

export const DogDetailsButtons = ({ data }: DogDetailsButtonsProps) => {
  const { whatsappButton, disabledButtonText, backButton } =
    AppTexts.dogDetails;

  const {
    state: { reports },
  } = useAuthContext();
  const noUserReports: boolean = !reports || !reports.length;

  const getServerApi = useGetServerApi();
  const navigate = useNavigate();
  const { isTablet } = useWindowSize();
  const styles = useDogDetailsButtonsStyles({ isTablet, noUserReports });

  const lastReportedId: number | null = reports
    ? reports[reports.length - 1].id
    : null;

  const handleCTAButton = (possibleMatchId: number) =>
    reportPossibleMatch({ lastReportedId, possibleMatchId }, getServerApi);

  const getWhatsappMessage = (status: "lost" | "found") => {
    // Split the URL and keep only the IDs
    const dogIds = window.location.href
      .split("/")
      .filter((segment) => segment !== "" && Number(segment));
    const dogPage: string = `${window.location.origin}/dogs/${dogIds[0]}`;
    const lastReportedDogPage: string | null = lastReportedId
      ? `${window.location.origin}/dogs/${lastReportedId}`
      : null;

    const whatsappTexts = AppTexts.dogDetails.whatsappLinks;
    const { lost, lost2, lost3, found, found2, found3 } = whatsappTexts;

    const messages = {
      lost: `${lost}${`%0A%0A${lost2}%0A${lastReportedDogPage}`}%0A%0A${lost3}%0A${dogPage}`,
      found: `${found}%0A%0A${found2}%0A${dogPage}%0A%0A${found3}%0A${lastReportedDogPage}`,
    };
    return messages[status];
  };

  const contactNumber = data?.contactPhone
    ? `${
        data?.contactPhone[0] === "0"
          ? `+972${data?.contactPhone.slice(1)}`
          : data?.contactPhone
      }`.replace(/-/g, "")
    : "";

  const whatsappLink = `https://wa.me/${contactNumber}/?text=${getWhatsappMessage(
    data?.type ?? "found",
  )}`;

  const commonIconProps: TablerIconsProps = {
    style: { marginRight: "0.5rem" },
    stroke: 1.5,
  };

  return (
    <Box sx={styles.actionBtnWrapper}>
      <Button
        size="large"
        variant="contained"
        sx={styles.actionBtnStyle}
        onClick={() => navigate(-1)}
      >
        <IconArrowLeft {...commonIconProps} />
        {backButton}
      </Button>
      <Box position="relative">
        {noUserReports && (
          <Typography sx={styles.buttonDisabledText}>
            {disabledButtonText}
          </Typography>
        )}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link
          to={noUserReports ? "#" : whatsappLink}
          onClick={(event) => noUserReports && event.preventDefault()}
          aria-disabled={noUserReports}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="large"
            variant="contained"
            sx={styles.contactBtnStyle}
            disableRipple={noUserReports}
            disableFocusRipple={noUserReports}
            disableTouchRipple={noUserReports}
            onClick={() =>
              data?.id && !noUserReports && handleCTAButton(data.id)
            }
          >
            <img
              src={WhatsappIcon}
              alt="Whatsapp"
              style={{ marginRight: "4px" }}
            />
            {whatsappButton}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};