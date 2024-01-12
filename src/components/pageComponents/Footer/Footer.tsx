import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { createStyleHook } from "../../../hooks/styleHooks";
import { AppTexts } from "../../../consts/texts";
import whatsappImg from "../../../assets/svg/whatsappGreen.svg";
import facebookImg from "../../../assets/svg/facebook.svg";
import instagramImg from "../../../assets/svg/instagram.svg";

const useFooterStyles = createStyleHook(() => ({
  footerWrapper: {
    position: "relative",
    margin: "1.5em 0 1rem",
  },
  typography: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  socialsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    mt: 0.5,
  },
}));

const linkStyles = (isHover: boolean) => ({
  width: "max-content",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  textDecoration: isHover ? "underline white" : "none",
});

export const Footer = () => {
  const styles = useFooterStyles();
  const [isHover, setIsHover] = useState<boolean>(false);
  const { joinUs, followUs } = AppTexts.footer;

  const socialLinks = [
    {
      link: "https://www.instagram.com/fluffy.finder",
      image: instagramImg,
      alt: "Instagram",
    },
    {
      link: "https://www.facebook.com/profile.php?id=61554201680682",
      image: facebookImg,
      alt: "Facebook",
    },
  ];

  return (
    <Box sx={styles.footerWrapper}>
      <a
        href="https://wa.me/+972526101997"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        style={linkStyles(isHover)}
      >
        <img src={whatsappImg} alt="whatsapp" width={24} height={24} />
        <Typography sx={styles.typography}>{joinUs}</Typography>
      </a>
      <Box sx={styles.socialsContainer}>
        {socialLinks.map((social) => (
          <a
            key={social.link}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={social.image} alt={social.alt} width={22} height={22} />
          </a>
        ))}
        <Typography sx={styles.typography}>{followUs}</Typography>
      </Box>
    </Box>
  );
};