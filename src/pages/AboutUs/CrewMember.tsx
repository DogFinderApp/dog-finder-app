import { Box, Divider, Typography } from "@mui/material";
import { CrewMemberType } from "./crewMembers";
import { createStyleHook } from "../../hooks/styleHooks";
import { useProgressiveImg } from "../../hooks/useProgressiveImg";
import LinkedinSVG from "../../assets/svg/linkedin.svg";
import GithubSVG from "../../assets/svg/github.svg";

const useCrewMemberStyles = createStyleHook(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    mb: 4,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  typography: {
    color: "white",
    textAlign: "center",
    direction: "rtl",
    fontSize: 18,
  },
  divider: {
    marginY: 0.5,
    width: 120,
    opacity: 0.3,
  },
  linksContainer: { display: "flex", justifyContent: "center", gap: "6px" },
}));

interface CrewMemberProps {
  member: CrewMemberType;
}
export const CrewMember = ({ member }: CrewMemberProps) => {
  const styles = useCrewMemberStyles();
  const { name, image, imageLowQuality, role, links } = member;
  const { src, blur } = useProgressiveImg(image, imageLowQuality);

  const imageStyles = {
    width: "170px",
    height: "170px",
    borderRadius: "100%",
    boxShadow: "0 0 15px 8px rgba(255,255,255,0.1)",
    filter: blur ? "blur(10px)" : "none",
  };

  return (
    <Box sx={styles.container}>
      <img
        src={src}
        alt={name}
        style={{ ...imageStyles, objectFit: "cover" }}
      />
      <Box sx={styles.textContainer}>
        <Typography
          sx={{
            ...styles.typography,
            fontWeight: 700,
            color: "#5F95C9",
          }}
        >
          {name}
        </Typography>
        <Typography sx={{ ...styles.typography, fontSize: 16 }}>
          {role}
        </Typography>
        {links && (
          <>
            <center>
              <Divider variant="middle" sx={styles.divider} />
            </center>
            <Box sx={styles.linksContainer}>
              {links.map((link) => {
                const selectedImage = link.includes("linkedin")
                  ? LinkedinSVG
                  : GithubSVG;
                return (
                  <div key={link}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      <img
                        width={30}
                        src={selectedImage}
                        alt="Link to website"
                        style={{
                          filter:
                            "drop-shadow(0px 0px 5px rgba(255,255,255,0.25))",
                        }}
                      />
                    </a>
                  </div>
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
