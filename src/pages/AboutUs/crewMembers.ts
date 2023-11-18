import AnonymousSVG from "../../assets/crewMembers/anonymous.jpeg";
import EdenGotlib from "../../assets/crewMembers/Eden_Gotlib.jpg";
import MaryDaniel from "../../assets/crewMembers/Mary_Daniel.jpg";
import NirDiamant from "../../assets/crewMembers/Nir_Diamant.jpg";
import TzlilShani from "../../assets/crewMembers/Tzlil_Shani.jpeg";
import YanivDavid from "../../assets/crewMembers/Yaniv_David.jpg";
import YanivWein from "../../assets/crewMembers/Yaniv_Weinshtein.jpg";

export interface CrewMemberType {
  name: string;
  image: string;
  role: string;
  links?: string[];
}

export const crewMembers: CrewMemberType[] = [
  {
    name: "ניר דיאמנט",
    image: NirDiamant,
    role: "Founder And Project Manager, AI Team Leader",
    links: ["https://www.linkedin.com/in/nir-diamant-759323134/"],
  },
  {
    name: "יניב דוד",
    image: YanivDavid,
    role: "Backend Leader",
    links: ["https://www.linkedin.com/in/yanivdavid"],
  },
  {
    name: "צליל שני",
    image: TzlilShani,
    role: "Backend Developer",
    links: ["https://www.linkedin.com/in/tslil-shani-2b9695188"],
  },
  {
    name: "יניב ויינשטיין",
    image: YanivWein,
    role: "Full Stack Developer",
    links: [
      "https://www.linkedin.com/in/yaniv-weinshtein",
      "https://github.com/YanivWein24",
    ],
  },
  {
    name: "אסף בלומנטל",
    image: "",
    role: "Full Stack Developer",
  },
  {
    name: "עדן גוטליב",
    image: EdenGotlib,
    role: "Full Stack Developer",
  },
  {
    name: "גלעד גורביץ'",
    image: AnonymousSVG,
    role: "Devops Engineer",
  },
  {
    name: "זיו גוסטינסקי",
    image: AnonymousSVG,
    role: "Data Analyst",
    links: ["https://www.linkedin.com/in/ziv-gostinski"],
  },
  {
    name: "מרי דניאל",
    image: MaryDaniel,
    role: "UI/UX Designer",
    links: [
      "https://www.linkedin.com/in/mary-daniel-%F0%9F%87%AE%F0%9F%87%B1-676b161b1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    ],
  },
  {
    name: "גל שוורץ",
    image: "",
    role: "QA Engineer",
  },
];
