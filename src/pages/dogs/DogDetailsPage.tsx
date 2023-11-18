import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
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
import { DogType } from "../../facades/payload.types";
import { useGetServerApi } from "../../facades/ServerApi";
import usePageTitle from "../../hooks/usePageTitle";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { AppTexts } from "../../consts/texts";
import WhatsappIcon from "../../assets/svg/whatsapp.svg";

const backdropStyles = {
  width: "inherit",
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
  chipNumber: number;
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
  payload: { dogId: number },
  getServerApi: Function,
  setError: Dispatch<SetStateAction<string | null>>,
): Promise<DogDetailsReturnType | void> => {
  const serverApi = await getServerApi();
  try {
    const response = await serverApi.getDogDetails(payload.dogId);
    const json = await response.json();
    return json?.data?.results?.id ? json?.data?.results : null;
  } catch (error) {
    console.error(error); // eslint-disable-line
    setError(JSON.stringify(error));
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
    return console.error("No memorized dog id in both URL and localStorage");

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
  usePageTitle(AppTexts.dogDetails.title);
  const { state: payload } = useLocation();
  const getServerApi = useGetServerApi();
  const { dog_id, lastReportedId } = useParams(); // eslint-disable-line
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth0();

  const [isHamalUser, setIsHamalUser] = useState<boolean | null>(null);
  const [data, setData] = useState<DogDetailsReturnType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  useEffect(() => {
    const getDogData = async () => {
      setIsLoading(true);
      const data = await fetcher(
        { dogId: Number(dog_id) },
        getServerApi,
        setError,
      );
      if (data) setData(data);
      setIsLoading(false);
    };
    getDogData();
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      const serverApi = await getServerApi();
      setIsHamalUser(serverApi.isHamalUser());
    };

    if (isAuthenticated && isHamalUser === null) {
      checkUserRole();
    }
  }, [isAuthenticated, isHamalUser, getServerApi]);

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
  const googleFormsLink = "https://forms.gle/tgTNG5UJUUGi1ViZ7";

  const { hamalButton, normalUserButton } = AppTexts.dogDetails;
  const ctaButtonText = isHamalUser ? hamalButton : normalUserButton;
  const ctaButtonLink = isHamalUser ? googleFormsLink : whatsappLink;

  if (isLoading) {
    return (
      <BackdropComp>
        <span>{AppTexts.dogDetails.loading}</span>
      </BackdropComp>
    );
  }
  if (error) {
    return (
      <BackdropComp>
        <span>{error.toString()}</span>
      </BackdropComp>
    );
  }
  if (!data) {
    return (
      <BackdropComp>
        <span>לא קיים מידע</span>
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
              {AppTexts.dogDetails.title}
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
              {AppTexts.dogDetails.backButton}
            </Button>
            <Link to={ctaButtonLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="large"
                variant="contained"
                sx={contactBtnStyle(theme)}
                onClick={() =>
                  reportPossibleMatch(
                    { lastReportedId, possibleMatchId: data.id },
                    getServerApi,
                  )
                }
              >
                <img
                  src={WhatsappIcon}
                  alt="Chat on Whatsapp"
                  style={{ marginRight: "4px" }}
                />
                {ctaButtonText}
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
              {data.extraDetails && (
                <Box sx={advancedDetailsRowStyle}>
                  <span style={boldText}>פרטים נוספים: </span>
                  <span style={thinText}>{data.extraDetails || ""}</span>
                </Box>
              )}
              <Box sx={detailRowStyle}>
                <span style={boldText}>סטטוס: </span>
                <span style={thinText}>
                  {DogTypeTranslateEnum[data.type] ?? ""}
                </span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={boldText}>מין: </span>
                <span style={thinText}>
                  {DogGenderEnum[data.sex] ?? "לא ידוע"}
                </span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={boldText}>איזור גיל: </span>
                <span style={thinText}>
                  {AppTexts.reportPage.dogAge[data.ageGroup] ?? ""}
                </span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={boldText}>
                  {data.type === DogType.FOUND ? "נמצא באיזור:" : "אבד באיזור:"}
                </span>
                <span style={thinText}>{data.location ?? ""}</span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={boldText}>
                  {" "}
                  {data.type === DogType.FOUND ? "נמצא בתאריך:" : "אבד בתאריך:"}
                </span>
                <span style={thinText}>
                  {formatDateString(data?.dogFoundOn ?? "")}
                </span>
              </Box>
              {data.breed && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>גזע: </span>
                  <span style={thinText}>{data.breed ?? ""}</span>
                </Box>
              )}
              <Box sx={detailRowStyle}>
                <span style={boldText}>צבע: </span>
                <span style={thinText}>{data.color ?? ""}</span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={boldText}>מספר שבב: </span>
                <span style={thinText}>{data.chipNumber ?? "לא ידוע"}</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};
