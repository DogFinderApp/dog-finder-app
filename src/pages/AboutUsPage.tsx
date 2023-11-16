import { Box, Typography } from "@mui/material";
import { createStyleHook } from "../hooks/styleHooks";
import usePageTitle from "../hooks/usePageTitle";
import { PageContainer } from "../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../components/pageComponents/PageTitle/PageTitle";
import { StartFlowButtons } from "../components/StartFlowButtons/StartFlowButtons";
import { AppTexts } from "../consts/texts";

const useAboutUsStyles = createStyleHook(() => {
  return {
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
  };
});

export const AboutUsPage = () => {
  const styles = useAboutUsStyles();
  const pageTitle = AppTexts.navigation.aboutUs;
  usePageTitle(pageTitle);
  const texts = [
    "החל מ-7 באוקטובר 2023, עשרות כלבים וחתולי בית ברחבי הארץ, בעיקר באזור הדרום והצפון, אזורים שתושביהם נאלצו לנטוש בחיפזון עקב המצב הביטחוני, אבדו או ננטשו בבהלה שנוצרה מאזעקות.",
    'בעקבות המצב, התגייסו אזרחים רבים בניסיון לסייע לבעלי החיים שאבדו. הוקמו חמ"לים מאולתרים בפייסבוק ובקבוצות וואטסאפ לאיתור חיות המחמד. זוהי יוזמה מבורכת, אולם התצורה הזו אינה יעילה ודורשת משאבי זמן וכוח אדם רבים.',
    "לאור המצב, הקמנו את מיזם Dog Finder. מטרתנו היא לאפשר איתור יעיל ומהיר של כלבים אבודים והשבתם לבעליהם המצפים להם.",
    "המערכת שפיתחנו מבוססת על אלגוריתמי בינה מלאכותית המסוגלים לזהות דמיון בין תמונות של כלבים אבודים לבין אלה של כלבים שדווחו כנעדרים. המערכת יעילה גם כאשר התמונות מזוויות שונות או כשמראה הכלב השתנה.",
    "אם איבדתם את הכלב שלכם או מצאתם כלב תועה, נא פנו אלינו ונסייע באיתור הבעלים או הכלב הנעדר. נשמח לסייע לכם להתאחד מחדש 🙂",
  ];
  const moreInfoText = "למידע נוסף או שאלות על המיזם אנא פנו אלינו במייל";
  const mail = "dogfinderinitiative@gmail.com";

  return (
    <PageContainer>
      <Box maxWidth={1000} margin="0 auto" paddingX={{ sm: 4, xs: 0 }}>
        <PageTitle text={pageTitle} fontWeight={500} notCentered />
        <Box sx={styles.textContainer}>
          {texts.map((sentence) => (
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
            {moreInfoText}{" "}
            <a href={`mailto:${mail}`} style={{ color: "white" }}>
              {mail}
            </a>
          </Typography>
        </Box>
      </Box>
    </PageContainer>
  );
};
