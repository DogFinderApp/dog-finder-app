import { FC, ReactNode } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import useSWR from "swr";
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

const detailRowStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "1rem",
};

const detailHeaderStyle = {
  fontWeight: "600",
};

const detailContentStyle = {
  fontWeight: "400",
};

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
): Promise<DogDetailsReturnType> => {
  const serverApi = await getServerApi();
  const response = await serverApi.getDogDetails(payload.dogId);
  if (!response?.ok) throw new Error("Failed to fetch results");
  const json = await response.json();
  return json?.data?.results || [];
};

const reportPossibleMatch = async (
  payload: { lastReportedId: string | undefined; possibleMatchId: number },
  getServerApi: Function,
): Promise<void> => { // eslint-disable-line
  const { lastReportedId, possibleMatchId } = payload;
  const memorizedDogId: string | null = decryptData("lastReportedDogId");
  // eslint-disable-next-line
  if (!lastReportedId && !memorizedDogId) return console.error("No memorized dog id in both URL and localStorage");

  if (
    lastReportedId &&
    (!memorizedDogId || (memorizedDogId && lastReportedId !== memorizedDogId))
  )
    encryptData("lastReportedDogId", lastReportedId);

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

  const { data, error, isLoading } = useSWR(
    [payload],
    async () => fetcher({ dogId: Number(dog_id) }, getServerApi),
    {
      keepPreviousData: false,
      revalidateOnFocus: false,
    },
  );

  const image = `data:${data?.images[0].imageContentType};base64, ${data?.images[0].base64Image}`;

  const contactNumber = `${
    data?.contactPhone[0] === "0"
      ? `+972${data?.contactPhone.slice(1)}`
      : data?.contactPhone
  }`.replace(/-/g, "");

  const getWhatsappMessage = (status: "lost" | "found") => {
    const messages = {
      lost: `${AppTexts.dogDetails.whatsappLinks.lost}%0A%0A${window.location.href}`,
      found: `${AppTexts.dogDetails.whatsappLinks.found}%0A%0A${window.location.href}`,
    };
    return messages[status];
  };

  const whatsappLink = `https://wa.me/${contactNumber}/?text=${getWhatsappMessage(
    data?.type ?? "found",
  )}`;

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
            <Link to={whatsappLink} target="_blank" rel="noopener noreferrer">
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
                {AppTexts.dogDetails.hamalButton}
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
            sx={{ height: "inherit", width: { xs: "100%", md: "auto" } }}
          />
          <Box component="div" sx={detailsStyle}>
            <Box sx={detailsListStyle}>
              {data.extraDetails && (
                <Box sx={advancedDetailsRowStyle}>
                  <span style={detailHeaderStyle}>פרטים נוספים: </span>
                  <span style={detailContentStyle}>
                    {data.extraDetails || ""}
                  </span>
                </Box>
              )}
              <Box sx={detailRowStyle}>
                <span style={detailHeaderStyle}>מין: </span>
                <span style={detailContentStyle}>
                  {DogGenderEnum[data.sex] || ""}
                </span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={detailHeaderStyle}>איזור גיל: </span>
                <span style={detailContentStyle}>
                  {AppTexts.reportPage.dogAge[data.ageGroup] || ""}
                </span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={detailHeaderStyle}>סטטוס: </span>
                <span style={detailContentStyle}>
                  {DogTypeTranslateEnum[data.type] || ""}
                </span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={detailHeaderStyle}>
                  {data.type === DogType.FOUND ? "נמצא באיזור:" : "אבד באיזור:"}
                </span>
                <span style={detailContentStyle}>{data.location || ""}</span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={detailHeaderStyle}>
                  {" "}
                  {data.type === DogType.FOUND ? "נמצא בתאריך:" : "אבד בתאריך:"}
                </span>
                <span style={detailContentStyle}>
                  {formatDateString(data?.dogFoundOn ?? "")}
                </span>
              </Box>
              {data.breed && (
                <Box sx={detailRowStyle}>
                  <span style={detailHeaderStyle}>גזע: </span>
                  <span style={detailContentStyle}>{data.breed || ""}</span>
                </Box>
              )}
              <Box sx={detailRowStyle}>
                <span style={detailHeaderStyle}>צבע: </span>
                <span style={detailContentStyle}>{data.color || ""}</span>
              </Box>
              <Box sx={detailRowStyle}>
                <span style={detailHeaderStyle}>מספר שבב: </span>
                <span style={detailContentStyle}>
                  {data.chipNumber || "לא ידוע"}
                </span>
              </Box>
              <Box
                sx={{ display: { xs: "block", md: "none" }, height: "5vh" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};
