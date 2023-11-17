import { Box, Typography } from "@mui/material";
import { createStyleHook } from "../../hooks/styleHooks";
import usePageTitle from "../../hooks/usePageTitle";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { privacyPolicyText } from "./privacyPolicyText";

const usePrivacyPolicyStyles = createStyleHook(() => ({
  sectionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    my: 4,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  typography: {
    color: "white",
    textAlign: "right",
    direction: "rtl",
    fontSize: { sm: 18, xs: 16 },
  },
}));

export const PrivacyPolicy = () => {
  const { description, lastUpdate, tabTitle, pageTitle, sections } =
    privacyPolicyText;

  usePageTitle(tabTitle);
  const styles = usePrivacyPolicyStyles();

  return (
    <PageContainer>
      <Box maxWidth={1000} margin="0 auto" paddingX={{ sm: 4, xs: 0 }}>
        <PageTitle text={pageTitle} fontSize={{ md: 48, sm: 40, xs: 32 }} />
        <Typography sx={{ ...styles.typography, my: { sm: 6, xs: 5 } }}>
          {description}
        </Typography>

        <Box sx={styles.sectionsContainer}>
          {sections.map((section) => (
            <Box key={section.title} sx={styles.section}>
              <Typography
                variant="h4"
                sx={{ ...styles.typography, fontSize: { sm: 34, xs: 26 } }}
              >
                {section.title}
              </Typography>
              <Typography sx={styles.typography}>{section.text}</Typography>
            </Box>
          ))}
          <Typography sx={{ ...styles.typography, fontSize: 16, my: 2 }}>
            {lastUpdate}
          </Typography>
        </Box>
      </Box>
    </PageContainer>
  );
};
