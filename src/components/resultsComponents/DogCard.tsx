import { Card, CardActions, CardMedia, Link } from "@mui/material";
import { AppTexts } from "../../consts/texts";
import { IconPhone, IconMail, IconUser } from "@tabler/icons-react";
import { DogResult } from "../../facades/payload.types";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../consts/routes";

const linkStyle = { display: "flex", alignItems: "center", gap: "8px" };

export const DogCard = ({ dog }: { dog: DogResult }) => {
  const navigate = useNavigate();
  const image = `data:${dog.imageContentType};base64,${dog.imageBase64}`;
  return (
    <Card dir="rtl">
      <CardMedia
        image={image}
        component="img"
        style={{ objectFit: "contain" }}
        title="Dog Image"
        sx={{ height: 400 }}
        onClick={() => navigate(AppRoutes.dogs.dogPage.replace(":dog_id", dog.dogId))}
      />
      <CardActions
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        <Link
          underline="none"
          href="#"
          style={{
            ...linkStyle,
            cursor: "default",
            pointerEvents: "none"
          }}
        >
          <IconUser />
          {dog.contactName}
        </Link>
      </CardActions>
      <CardActions
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        <Link
          underline="none"
          href={`tel:${dog.contactPhone}`}
          style={linkStyle}
        >
          <IconPhone /> {AppTexts.resultsPage.call}
        </Link>

        <Link
          underline="none"
          href={`mailto:${dog.contactEmail}`}
          style={linkStyle}
        >
          <IconMail />
          {AppTexts.resultsPage.email}
        </Link>
      </CardActions>
    </Card>
  );
};
