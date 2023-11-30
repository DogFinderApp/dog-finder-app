import { FC, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CardMedia, Typography, useTheme } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { formatDateString } from "../../../utils/datesFormatter";
import { useGetServerApi } from "../../../facades/ServerApi";
import { AppTexts } from "../../../consts/texts";
import { useAuthContext } from "../../../context/useAuthContext";
import { DogType } from "../../../types/payload.types";
import { UserRole } from "../../../types/UserRole";
import { DogDetailsReturnType } from "../../../types/DogDetailsTypes";
import usePageTitle from "../../../hooks/usePageTitle";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { PageContainer } from "../../../components/pageComponents/PageContainer/PageContainer";
import { LoadingSpinnerWithText } from "../../../components/common/LoadingSpinnerWithText";
import { DogDetailsButtons } from "./DogDetailsButtons";

const backdropStyles = {
  width: "100%",
  height: "inherit",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontSize: { xs: "2rem", md: "4rem" },
};

const pageContainer = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mb: 8,
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

const fetchedDataContainer = {
  display: "flex",
  flexDirection: { md: "row", xs: "column" },
  alignItems: "center",
  gap: "3rem",
  marginTop: { md: "5rem", xs: "3rem" },
  height: { sm: "40vh", xs: "100%" },
  width: "85vw",
};

const cardMediaStyle = { height: "inherit", width: { xs: "100%", md: "auto" } };

const detailsListStyle = {
  maxWidth: { xs: "85vw", md: "45vw" },
  direction: "rtl",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "1.5rem",
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
  gap: "12px",
  marginTop: "8px",
};

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
  payload: { dogId: number; role: UserRole },
  getServerApi: Function,
  // eslint-disable-next-line
): Promise<DogDetailsReturnType | void> => {
  const { dogId, role } = payload;
  try {
    // we can't place this fetch request inside ServerApi because this page should be
    // accessible to everyone, and ServerApi requires to be authenticated
    const API_URL = process.env.REACT_APP_API_URL || "";
    const urlByUserRole = !!role
      ? "get_dog_by_id_full_details"
      : "get_dog_by_id";
    const url = `${API_URL}/dogfinder/${urlByUserRole}?dogId=${dogId}`;

    let headers = {};
    if (!!role) {
      const serverApi = await getServerApi();
      headers = {
        Authorization: `Bearer ${await serverApi.getUndecodedUserData()}`,
      };
    }
    const response = await fetch(url, { headers });
    const json = await response.json();
    return json?.data?.results?.id ? json?.data?.results : null;
  } catch (error) {
    console.error(error); // eslint-disable-line
  }
};

export const DogDetailsPage = () => {
  const { title, loading, error, unknown } = AppTexts.dogDetails;
  usePageTitle(title);

  const theme = useTheme();
  const { isLoading } = useAuth0();
  const getServerApi = useGetServerApi();
  const { dog_id } = useParams(); // eslint-disable-line
  const { isMobile } = useWindowSize();

  const {
    state: { role },
  } = useAuthContext();

  const [data, setData] = useState<DogDetailsReturnType | null>(null);
  const [isFetching, setIsFetching] = useState<boolean | null>(null);

  useEffect(() => {
    const getDogData = async () => {
      setIsFetching(true);
      const response = await fetcher(
        { dogId: Number(dog_id), role },
        getServerApi,
      );
      if (response) setData(response);
      setIsFetching(false);
    };
    if (!isLoading) getDogData();
  }, [isLoading, role]); // eslint-disable-line

  const image = data?.images
    ? `data:${data?.images[0].imageContentType};base64, ${data?.images[0].base64Image}`
    : "";

  if (isFetching || isLoading) {
    return (
      <LoadingSpinnerWithText
        title={loading}
        fontSize={isMobile ? 26 : 48}
        marginTop={10}
      />
    );
  }

  if (!data && !isFetching && !isLoading) {
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
          <DogDetailsButtons data={data} />
        </Box>
        <Box sx={fetchedDataContainer}>
          <CardMedia
            image={image}
            component="img"
            style={{ objectFit: "contain" }}
            sx={cardMediaStyle}
          />
          <Box component="div" sx={detailsStyle}>
            <Box sx={detailsListStyle}>
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
                    {AppTexts.reportPage.dogDetails.dogAgeFound}:
                  </span>
                  <span style={thinText}>
                    {AppTexts.reportPage.dogAge[data.ageGroup] ?? ""}
                  </span>
                </Box>
              )}
              {data?.breed && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>גזע: </span>
                  <span style={thinText}>{data?.breed ?? ""}</span>
                </Box>
              )}
              {data?.color && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>צבע: </span>
                  <span style={thinText}>{data?.color ?? ""}</span>
                </Box>
              )}
              {data?.size && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>גודל: </span>
                  <span style={thinText}>{data?.size ?? ""}</span>
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
              {data?.color && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>צבע: </span>
                  <span style={thinText}>{data?.color ?? ""}</span>
                </Box>
              )}
              {data?.chipNumber && role && (
                <Box sx={detailRowStyle}>
                  <span style={boldText}>מספר שבב: </span>
                  <span style={thinText}>{data.chipNumber}</span>
                </Box>
              )}
              {data?.extraDetails && (
                <Box sx={advancedDetailsRowStyle}>
                  <span style={boldText}>פרטים נוספים: </span>
                  <span style={thinText}>{data?.extraDetails || ""}</span>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};
