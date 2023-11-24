import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { IconArrowLeft, TablerIconsProps } from "@tabler/icons-react";
import { decryptData, encryptData } from "../../../utils/encryptionUtils";
import { DogDetailsReturnType } from "../../../types/DogDetailsTypes";
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
  payload: { lastReportedId: string | undefined; possibleMatchId: number },
  getServerApi: Function,
  // eslint-disable-next-line
): Promise<void> => {
  const { lastReportedId, possibleMatchId } = payload;
  const memorizedDogId: string | null = decryptData("lastReportedDogId");
  // eslint-disable-next-line
  if (!lastReportedId && !memorizedDogId)
    return console.error("No memorized dog id in both URL and localStorage"); // eslint-disable-line

  if (
    lastReportedId &&
    (!memorizedDogId || (memorizedDogId && lastReportedId !== memorizedDogId))
  ) {
    encryptData("lastReportedDogId", lastReportedId);
  }

  const serverApi = await getServerApi();
  const response = await serverApi.addPossibleDogMatch({
    dogId: Number(lastReportedId ?? memorizedDogId),
    possibleMatchId,
  });
  // eslint-disable-next-line
  if (!response?.ok) console.error("Failed to report possible match");
};

interface DogDetailsButtonsProps {
  lastReportedId: string | undefined;
  data: DogDetailsReturnType | null;
}

export const DogDetailsButtons = ({
  lastReportedId,
  data,
}: DogDetailsButtonsProps) => {
  const { whatsappButton, disabledButtonText, backButton } =
    AppTexts.dogDetails;

  const getServerApi = useGetServerApi();
  const navigate = useNavigate();
  const { innerWidth } = useWindowSize();
  const isTablet = innerWidth < 900;
  const memorizedDogId: string | null = decryptData("lastReportedDogId");
  const noUserReports: boolean = !lastReportedId && !memorizedDogId;
  const styles = useDogDetailsButtonsStyles({ isTablet, noUserReports });

  const handleCTAButton = (possibleMatchId: number) =>
    reportPossibleMatch({ lastReportedId, possibleMatchId }, getServerApi);

  const getWhatsappMessage = (status: "lost" | "found") => {
    const lastReportedDogId = lastReportedId ?? memorizedDogId; // get id from param or localStorage
    // Split the URL and keep only the IDs
    const dogIds = window.location.href
      .split("/")
      .filter((segment) => segment !== "" && Number(segment));
    const dogPage: string = `${window.location.origin}/dogs/${dogIds[0]}`;
    const lastReportedDogPage: string | null =
      dogIds[1] || lastReportedDogId
        ? `${window.location.origin}/dogs/${dogIds[1] ?? lastReportedDogId}`
        : null;

    const whatsappTexts = AppTexts.dogDetails.whatsappLinks;
    const { lost, lost2, lost3, found, found2, found3 } = whatsappTexts;

    const messages = {
      lost: `${lost}${
        lastReportedDogPage ? `%0A%0A${lost2}%0A${lastReportedDogPage}` : ""
      }%0A%0A${lost3}%0A${dogPage}`,
      found: `${found}%0A%0A${found2}%0A${dogPage}${
        lastReportedDogPage ? `%0A%0A${found3}%0A${lastReportedDogPage}` : ""
      }`,
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
