import { FC, ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  CardMedia,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { TablerIconsProps, IconArrowLeft } from "@tabler/icons-react";
import { formatDateString } from "../../utils/datesFormatter";
import { decryptData, encryptData } from "../../utils/encryptionUtils";
import { useHamalContext } from "../../context/useHamalContext";
import { DogType } from "../../facades/payload.types";
import { useGetServerApi } from "../../facades/ServerApi";
import { AppTexts } from "../../consts/texts";
import usePageTitle from "../../hooks/usePageTitle";
import { useWindowSize } from "../../hooks/useWindowSize";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { LoadingSpinnerWithText } from "../../components/common/LoadingSpinnerWithText";
import WhatsappIcon from "../../assets/svg/whatsapp.svg";

const backdropStyles = {
  width: "100%",
  height: "inherit",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontSize: { xs: "2rem", md: "4rem" },
};

const commonIconProps: TablerIconsProps = {
  style: { marginRight: "0.5rem" },
  stroke: 1.5,
};

const pageContainer = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const contentWrapper = {
  display: "flex",
  flexDirection: {
    xs: "column",
    md: "row-reverse",
  },
  justifyContent: "space-between",
  alignItems: "center",
  gap: { xs: "2rem", md: "none" },
  width: "85vw",
  marginTop: "2vh",
};

const actionBtnWrapper = {
  display: "flex",
  flexDirection: {
    xs: "column-reverse",
    md: "row",
  },
  gap: { md: "2rem", xs: "1rem" },
};

const actionBtnStyle = {
  width: { xs: "85vw", md: "15rem" },
  maxWidth: "480px",
  height: { xs: "5vh", md: "5vh" },
};

const contactBtnStyle = (theme: Theme) => ({
  ...actionBtnStyle,
  backgroundColor: "#E3F0FF",
  color: theme.palette.primary.main,
  "&:hover": { backgroundColor: "#cad6e4 !important" },
});

const fetchedDataContainer = {
  display: "flex",
  flexDirection: { md: "row", xs: "column" },
  alignItems: "center",
  gap: "3rem",
  marginTop: { md: "5rem", xs: "3rem" },
  height: "45vh",
  width: "85vw",
};

const cardMediaStyle = { height: "inherit", width: { xs: "100%", md: "auto" } };

const detailsListStyle = {
  height: "100%",
  maxWidth: { xs: "85vw", md: "45vw" },
  direction: "rtl",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "1rem",
};

const detailsStyle = {
  width: "inherit",
  height: { xs: "auto", md: "inherit" },
  color: "#ffff",
  fontSize: { xs: "1rem", md: "1.2rem" },
  direction: "rtl",
};

const detailRowStyle = { display: "flex", flexDirection: "row", gap: "1rem" };
const boldText = { fontWeight: "600" };
const thinText = { fontWeight: "400" };

const advancedDetailsRowStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
};

interface DogDetailsReturnType {
  id: number;
  images: [
    {
      base64Image: string;
      imageContentType: string;
      id: number;
    },
  ];
  type: DogType;
  isMatched: boolean;
  isVerified: boolean;
  name: string;
  breed: string;
  color: string;
  size: string;
  sex: "male" | "female";
  ageGroup: "puppy" | "adult" | "senior";
  extraDetails: string;
  chipNumber?: number; // returns only for Hamal users
  location: string;
  dogFoundOn: string;
  contactPhone: string;
}

const BackdropComp: FC<{ children: ReactNode }> = ({ children }) => (
  <PageContainer>
    <Box sx={backdropStyles}>{children}</Box>
  </PageContainer>
);

enum DogGenderEnum {
  male = "זכר",
  female = "נקבה",
}

enum DogTypeTranslateEnum {
  found = "נמצא",
  lost = "אבד",
  resolved = "הושב לבעליו",
}

const fetcher = async (
  payload: { dogId: number; isHamalUser: boolean },
  getServerApi: Function,
  // eslint-disable-next-line
): Promise<DogDetailsReturnType | void> => {
  const serverApi = await getServerApi();
  try {
    const response = await serverApi.getDogDetails(payload);
    const json = await response.json();
    return json?.data?.results?.id ? json?.data?.results : null;
  } catch (error) {
    console.error(error); // eslint-disable-line
  }
};

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

export const DogDetailsPage = () => {
  const { title, whatsappButton, backButton, loading, error, unknown } =
    AppTexts.dogDetails;
  usePageTitle(title);
  const getServerApi = useGetServerApi();
  const { dog_id, lastReportedId } = useParams(); // eslint-disable-line
  const navigate = useNavigate();
  const theme = useTheme();
  const { innerWidth } = useWindowSize();
  const isMobile = innerWidth < 600;
  const {
    state: { isHamalUser },
  } = useHamalContext();

  const [data, setData] = useState<DogDetailsReturnType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  useEffect(() => {
    const getDogData = async () => {
      setIsLoading(true);
      const response = await fetcher(
        { dogId: Number(dog_id), isHamalUser: !!isHamalUser },
        getServerApi,
      );
      if (response) setData(response);
      setIsLoading(false);
    };
    getDogData();
  }, []); // eslint-disable-line

  const image = data?.images
    ? `data:${data?.images[0].imageContentType};base64, ${data?.images[0].base64Image}`
    : "";

  const contactNumber = data?.contactPhone
    ? `${
        data?.contactPhone[0] === "0"
          ? `+972${data?.contactPhone.slice(1)}`
          : data?.contactPhone
      }`.replace(/-/g, "")
    : "";

  const handleCTAButton = (possibleMatchId: number) =>
    reportPossibleMatch({ lastReportedId, possibleMatchId }, getServerApi);

  const getWhatsappMessage = (status: "lost" | "found") => {
    const memorizedDogId: string | null = decryptData("lastReportedDogId");
    const lastReportedDogId = lastReportedId ?? memorizedDogId; // get id from param or localStorage
    // Split the URL and keep only the IDs
    const dogIds = window.location.href
      .split("/")
      .filter((segment) => segment !== "" && Number(segment));
    const dogPage: string = `${window.location.origin}/${dogIds[0]}`;
    const lastReportedDogPage: string | null =
      dogIds[1] || lastReportedDogId
        ? `${window.location.origin}/${dogIds[1] ?? lastReportedDogId}`
        : null;

    const whatsappTexts = AppTexts.dogDetails.whatsappLinks;
    const { lost, lost2, lost3, found, found2, found3 } = whatsappTexts;

    const messages = {
      lost: `${lost}%0A%0A${lost2}%0A${lastReportedDogPage}%0A%0A${lost3}%0A${dogPage}`,
      found: `${found}%0A%0A${found2}%0A${dogPage}%0A%0A${found3}%0A${lastReportedDogPage}`,
    };
    return messages[status];
  };

  const whatsappLink = `https://wa.me/${contactNumber}/?text=${getWhatsappMessage(
    data?.type ?? "found",
  )}`;

  if (isLoading) {
    return (
      <LoadingSpinnerWithText
        title={loading}
        fontSize={isMobile ? 26 : 48}
        marginTop={10}
      />
    );
  }
  if (!data && !isLoading) {
    return (
      <BackdropComp>
        <span>{error}</span>
      </BackdropComp>
    );
  }
  return (
    <PageContainer>
      <Box sx={pageContainer}>
        <Box sx={contentWrapper}>
          <Box>
            <Typography
              sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
              color={theme.palette.text.primary}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={actionBtnWrapper}>
            <Button
              size="large"
              variant="contained"
              sx={actionBtnStyle}
              onClick={() => navigate(-1)}
            >
              <IconArrowLeft {...commonIconProps} />
              {backButton}
            </Button>
            <Link to={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="large"
                variant="contained"
                sx={contactBtnStyle(theme)}
                onClick={() => data?.id && handleCTAButton(data.id)}
              >
                <img
                  src={WhatsappIcon}
                  alt="Chat on Whatsapp"
                  style={{ marginRight: "4px" }}
                />
                {whatsappButton}
              </Button>
            </Link>
          </Box>
        </Box>
        <Box sx={fetchedDataContainer}>
          <CardMedia
            image={image}
            component="img"
            style={{ objectFit: "contain" }}
            title="Dog Image"
            sx={cardMediaStyle}
          />
          <Box component="div" sx={detailsStyle}>
            <Box sx={detailsListStyle}>
              {data?.extraDetails && (
                <Box sx={advancedDetailsRowStyle}>
                  <span style={boldText}>פרטים נוספים: </span>
                  <span style={thinText}>{data?.extraDetails || ""}</span>
                </Box>
              )}
              <Box sx={detailRowStyle}>
                <span style={boldText}>סטטוס: </span>
                <span style={thinText}>
                  {data?.type ? DogTypeTranslateEnum[data.type] : ""}
                </span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={boldText}>מין: </span>
                <span style={thinText}>
                  {data?.sex ? DogGenderEnum[data.sex] : unknown}
                </span>
              </Box>
              {data?.ageGroup && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>
                    {AppTexts.reportPage.dogDetails.dogAge}:
                  </span>
                  <span style={thinText}>
                    {AppTexts.reportPage.dogAge[data.ageGroup] ?? ""}
                  </span>
                </Box>
              )}
              <Box sx={detailRowStyle}>
                <span style={boldText}>
                  {data?.type === DogType.FOUND
                    ? "נמצא באיזור:"
                    : "אבד באיזור:"}
                </span>
                <span style={thinText}>{data?.location ?? ""}</span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={boldText}>
                  {" "}
                  {data?.type === DogType.FOUND
                    ? "נמצא בתאריך:"
                    : "אבד בתאריך:"}
                </span>
                <span style={thinText}>
                  {formatDateString(data?.dogFoundOn ?? "")}
                </span>
              </Box>
              {data?.breed && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>גזע: </span>
                  <span style={thinText}>{data?.breed ?? ""}</span>
                </Box>
              )}
              <Box sx={detailRowStyle}>
                <span style={boldText}>צבע: </span>
                <span style={thinText}>{data?.color ?? ""}</span>
              </Box>
              {data?.chipNumber && isHamalUser && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>מספר שבב: </span>
                  <span style={thinText}>{data.chipNumber}</span>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};
