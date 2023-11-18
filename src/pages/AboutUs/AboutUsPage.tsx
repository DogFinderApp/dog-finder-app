import { Box, Grid, Typography } from "@mui/material";
import { createStyleHook } from "../../hooks/styleHooks";
import usePageTitle from "../../hooks/usePageTitle";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { StartFlowButtons } from "../../components/StartFlowButtons/StartFlowButtons";
import { AppTexts } from "../../consts/texts";
import { crewMembers } from "./crewMembers";
import { CrewMember } from "./CrewMember";

const useAboutUsStyles = createStyleHook(() => ({
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    my: 4,
  },
  typography: {
    color: "white",
    textAlign: "right",
    direction: "rtl",
    fontSize: 20,
  },
}));

export const AboutUsPage = () => {
  const styles = useAboutUsStyles();
  const pageTitle = AppTexts.navigation.aboutUs;
  usePageTitle(pageTitle);
  const { texts, moreInfo, mail, ourPeople } = AppTexts.aboutPage;

  return (
    <PageContainer>
      <Box maxWidth={1000} margin="0 auto" paddingX={{ sm: 4, xs: 0 }}>
        <PageTitle text={pageTitle} fontWeight={500} notCentered />
        <Box sx={styles.textContainer}>
          {Object.values(texts).map((sentence) => (
            <Box key={sentence}>
              <Typography variant="h4" sx={styles.typography}>
                {sentence}
              </Typography>
            </Box>
          ))}
          <Box sx={{ my: 2 }}>
            <StartFlowButtons alignRight />
          </Box>
          <Typography sx={{ ...styles.typography, my: 2 }}>
            {moreInfo}{" "}
            <a href={`mailto:${mail}`} style={{ color: "white" }}>
              {mail}
            </a>
          </Typography>
        </Box>

        <PageTitle text={ourPeople} fontWeight={500} notCentered />
        <Grid container spacing={4} dir="rtl" sx={{ marginY: 2.5 }}>
          {crewMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={member.name}>
              <CrewMember member={member} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageContainer>
  );
};
