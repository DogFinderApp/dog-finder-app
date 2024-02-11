import { useState, MouseEvent, useEffect, useMemo, useCallback } from "react";
import { Link, To, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Typography } from "@mui/material";
import { IconArrowLeft, TablerIconsProps } from "@tabler/icons-react";
import { AppTexts } from "../../../consts/texts";
import { AppRoutes } from "../../../consts/routes";
import { useGetServerApi } from "../../../facades/ServerApi";
import { encryptData } from "../../../utils/encryptionUtils";
import { DogDetailsReturnType } from "../../../types/DogDetailsTypes";
import { DogType } from "../../../types/payload.types";
import { useAuthContext } from "../../../context/useAuthContext";
import { createStyleHook } from "../../../hooks/styleHooks";
import { useWindowSize } from "../../../hooks/useWindowSize";
import ReportSelectModal from "../../../components/Modals/ReportSelectModal";
import { QuickReportModal } from "../../../components/Modals/QuickReportModal";
import WhatsappIcon from "../../../assets/svg/whatsapp.svg";

interface DogDetailsButtonsStyle {
  isTablet: boolean;
  buttonDisabled: boolean;
}

const useDogDetailsButtonsStyles = createStyleHook(
  (theme, { isTablet, buttonDisabled }: DogDetailsButtonsStyle) => ({
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
      cursor: buttonDisabled ? "not-allowed" : "pointer",
      opacity: buttonDisabled ? 0.6 : 1,
      "&:hover": { backgroundColor: "#cad6e4 !important" },
    },
  }),
);

const reportPossibleMatch = async (
  payload: {
    lastReportedId: number | null;
    possibleMatchId: number;
    selectedReportId?: number | null;
  },
  getServerApi: Function,
  // eslint-disable-next-line
): Promise<void> => {
  const { lastReportedId, possibleMatchId, selectedReportId } = payload;
  // `selectedReportId` is being passed in ReportSelectModal.tsx
  if (!lastReportedId && !selectedReportId)
    return console.error("User has no previous reports"); // eslint-disable-line

  const serverApi = await getServerApi();
  const response = await serverApi.addPossibleDogMatch({
    dogId: selectedReportId ?? lastReportedId,
    possibleMatchId,
  });
  // eslint-disable-next-line
  if (!response?.ok) console.error("Failed to report possible match");
};

interface DogDetailsButtonsProps {
  dogData: DogDetailsReturnType | null;
  dogType: DogType;
  dogImage: string;
}

export const DogDetailsButtons = ({
  dogData,
  dogType,
  dogImage,
}: DogDetailsButtonsProps) => {
  const { whatsappButton, disabledButtonText, backButton, whatsappTexts } =
    AppTexts.dogDetails;

  const {
    state: { reports, isFetchingReports },
  } = useAuthContext();
  const { user, loginWithRedirect } = useAuth0();
  const getServerApi = useGetServerApi();
  const navigate = useNavigate();
  const { isTablet } = useWindowSize();

  const userOppositeReports = useMemo(
    () => reports?.filter((report) => report.type !== dogData?.type) ?? [],
    [dogData, reports],
  );

  const userReportsIds: number[] = !reports
    ? []
    : reports.map((report) => report.id);

  const dogIdFromUrl = Number(window.location.pathname.split("/dogs/")[1]);
  const reporterIsCurrentUser: boolean = userReportsIds.includes(dogIdFromUrl);

  // we must make sure to NOT disable the button when there's no user, because we use that button
  // to authenticateWithRedirect in that case
  const buttonDisabled = !!user && reporterIsCurrentUser;

  const styles = useDogDetailsButtonsStyles({ isTablet, buttonDisabled });
  const [selectReportModalOpen, setSelectReportModalOpen] =
    useState<boolean>(false);
  const [quickModalOpen, setQuickModalOpen] = useState<boolean>(false);
  // if the user clicked the whatsapp button and got redirected to this page after authenticating,
  // check if we can open the quick report modal / select report modal and update this state so that
  // it won't open again automatically
  const [modalOpenedAfterAuth, setModalOpenedAfterAuth] =
    useState<boolean>(false);
  // if a user has multiple reports, they should choose the one that matches with the dog page
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const backButtonRedirectsToHome = window.location.href.includes("no-return");

  const lastReportedId: number | null = userOppositeReports
    ? userOppositeReports[userOppositeReports.length - 1]?.id
    : null;

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) =>
    (!user ||
      buttonDisabled ||
      !userOppositeReports ||
      !userOppositeReports?.length ||
      userOppositeReports.length > 1) &&
    event.preventDefault();

  const handleCTAButton = (possibleMatchId: number | undefined) => {
    if (!user) {
      encryptData("dog_id_to_redirect", `${dogIdFromUrl}`);
      loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/dogs/redirect`,
        },
      });
      return;
    }
    if (!reports || !userOppositeReports.length) {
      setQuickModalOpen(true);
      return;
    }
    if (userOppositeReports?.length > 1) {
      setSelectReportModalOpen(true);
      return;
    }
    if (possibleMatchId && !reporterIsCurrentUser)
      reportPossibleMatch({ lastReportedId, possibleMatchId }, getServerApi);
  };

  const getWhatsappMessage = useCallback(
    (revereDogType?: boolean, quickReportDogId?: number) => {
      // Split the URL and keep only the IDs
      const dogIds = window.location.href
        .split("/")
        .filter((segment) => segment !== "" && Number(segment));
      const dogPage: string = `${window.location.origin}/dogs/${dogIds[0]}`;
      const userReportedDogPage: string | null =
        selectedReportId || lastReportedId || quickReportDogId
          ? `${window.location.origin}/dogs/${
              quickReportDogId ?? selectedReportId ?? lastReportedId
            }`
          : null;

      const { lost, lost2, lost3, found, found2, found3 } = whatsappTexts;

      const messages = {
        lost: `${lost}${`%0A%0A${lost2}%0A${userReportedDogPage}`}%0A%0A${lost3}%0A${dogPage}`,
        found: `${found}%0A%0A${found2}%0A${dogPage}%0A%0A${found3}%0A${userReportedDogPage}`,
      };
      const messageType = dogData?.type ?? DogType.FOUND;
      const reversedMessageType =
        messageType === DogType.FOUND ? DogType.LOST : DogType.FOUND;
      return messages[revereDogType ? reversedMessageType : messageType];
    },
    [dogData, selectedReportId, lastReportedId, whatsappTexts],
  );

  const contactNumber = dogData?.contactPhone
    ? `${
        dogData?.contactPhone[0] === "0"
          ? `+972${dogData?.contactPhone.slice(1)}`
          : dogData?.contactPhone
      }`.replace(/-/g, "")
    : "";

  const whatsappLink = `https://wa.me/${contactNumber}/?text=${getWhatsappMessage()}`;

  const buttonDisabledText =
    disabledButtonText[!user ? "noUser" : "reporterIsCurrentUser"];

  const commonIconProps: TablerIconsProps = {
    style: { marginRight: "0.5rem" },
    stroke: 1.5,
  };

  // ? simulate a "whatsapp button" click if the user was redirected from Auth0,
  // ? because it means they already pressed the button previously.
  useEffect(() => {
    const isRedirectedAfterAuth =
      window.location.href.includes("authenticated");

    if (
      isRedirectedAfterAuth &&
      user &&
      !isFetchingReports && // make sure we already checked if the user has reports
      !modalOpenedAfterAuth // make sure this only happens once
    ) {
      if (!userOppositeReports.length) setQuickModalOpen(true);
      if (userOppositeReports.length > 1) setSelectReportModalOpen(true);
      if (userOppositeReports.length === 1 && dogData) {
        reportPossibleMatch(
          { lastReportedId, possibleMatchId: dogData?.id },
          getServerApi,
        );
        const updatedWhatsappLink = `https://wa.me/${contactNumber}/?text=${getWhatsappMessage(
          true,
        )}`;
        window.open(updatedWhatsappLink, "_blank", "rel=noopener noreferrer");
      }

      setModalOpenedAfterAuth(true);
    }
  }, [
    user,
    userOppositeReports,
    modalOpenedAfterAuth,
    isFetchingReports,
    whatsappLink,
    contactNumber,
    getWhatsappMessage,
    lastReportedId,
    dogData,
    getServerApi,
  ]);

  return (
    <Box sx={styles.actionBtnWrapper}>
      <QuickReportModal
        open={quickModalOpen}
        setOpen={setQuickModalOpen}
        dogType={dogType}
        dogImage={dogImage}
        reportPossibleMatch={reportPossibleMatch}
        possibleMatch={dogData}
        getWhatsappMessage={getWhatsappMessage}
        contactNumber={contactNumber}
      />
      <ReportSelectModal
        isModalOpen={selectReportModalOpen}
        setIsModalOpen={setSelectReportModalOpen}
        selectedReportId={selectedReportId}
        setSelectedReportId={setSelectedReportId}
        confirmFunction={reportPossibleMatch}
        getWhatsappMessage={getWhatsappMessage}
        possibleMatch={dogData}
        contactNumber={contactNumber}
      />
      <Button
        size="large"
        variant="contained"
        sx={styles.actionBtnStyle}
        onClick={() =>
          navigate(backButtonRedirectsToHome ? AppRoutes.root : (-1 as To))
        }
      >
        <IconArrowLeft {...commonIconProps} />
        {backButton}
      </Button>
      <Box position="relative">
        {(!user || buttonDisabled) && (
          <Typography sx={styles.buttonDisabledText}>
            {buttonDisabledText}
          </Typography>
        )}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link
          to={
            !user || buttonDisabled || !userOppositeReports?.length
              ? "#"
              : whatsappLink
          }
          onClick={handleLinkClick}
          aria-disabled={buttonDisabled}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="large"
            variant="contained"
            sx={styles.contactBtnStyle}
            disableRipple={buttonDisabled}
            disableFocusRipple={buttonDisabled}
            disableTouchRipple={buttonDisabled}
            onClick={() => handleCTAButton(dogData?.id)}
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
