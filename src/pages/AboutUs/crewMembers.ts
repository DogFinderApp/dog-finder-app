import AnonymousMaleSVG from "../../assets/crewMembers/AnonymousMale.jpg";
import AnonymousMaleSVGLow from "../../assets/crewMembers/reduced/AnonymousMale.jpg";
import AnonymousFemaleSVG from "../../assets/crewMembers/AnonymousFemale.jpg";
import AnonymousFemaleSVGLow from "../../assets/crewMembers/reduced/AnonymousFemale.jpg";
import GalSchwarts from "../../assets/crewMembers/Gal_Schwarts.jpg";
import GalSchwartsLow from "../../assets/crewMembers/reduced/Gal_Schwarts.jpg";
import GalZohar from "../../assets/crewMembers/Gal_Zohar.jpg";
import GalZoharLow from "../../assets/crewMembers/reduced/Gal_Zohar.jpg";
import EdenGotlib from "../../assets/crewMembers/Eden_Gotlib.jpg";
import EdenGotlibLow from "../../assets/crewMembers/reduced/Eden_Gotlib.jpg";
import MaryDaniel from "../../assets/crewMembers/Mary_Daniel.jpg";
import MaryDanielLow from "../../assets/crewMembers/reduced/Mary_Daniel.jpg";
import NirDiamant from "../../assets/crewMembers/Nir_Diamant.jpg";
import NirDiamantLow from "../../assets/crewMembers/reduced/Nir_Diamant.jpg";
import OrtalFeldman from "../../assets/crewMembers/Ortal_Feldman.jpg";
import OrtalFeldmanLow from "../../assets/crewMembers/reduced/Ortal_Feldman.jpg";
import SapirGershov from "../../assets/crewMembers/Sapir_Gershov.jpg";
import SapirGershovLow from "../../assets/crewMembers/reduced/Sapir_Gershov.jpg";
import TzlilShani from "../../assets/crewMembers/Tzlil_Shani.jpeg";
import TzlilShaniLow from "../../assets/crewMembers/reduced/Tzlil_Shani.jpeg";
import YanivDavid from "../../assets/crewMembers/Yaniv_David.jpg";
import YanivDavidLow from "../../assets/crewMembers/reduced/Yaniv_David.jpg";
import YanivWein from "../../assets/crewMembers/Yaniv_Weinshtein.jpg";
import YanivWeinLow from "../../assets/crewMembers/reduced/Yaniv_Weinshtein.jpg";
import ZlilMalchi from "../../assets/crewMembers/Zlil_Malchi.jpeg";
import ZlilMalchiLow from "../../assets/crewMembers/reduced/Zlil_Malchi.jpeg";

export interface CrewMemberType {
  name: string;
  image: string;
  imageLowQuality: string;
  role: string;
  links?: string[];
}

export const crewMembers: CrewMemberType[] = [
  {
    name: "ניר דיאמנט",
    image: NirDiamant,
    imageLowQuality: NirDiamantLow,
    role: "Founder, CEO And Head Of AI",
    links: ["https://www.linkedin.com/in/nir-diamant-759323134/"],
  },
  {
    name: "יניב דוד",
    image: YanivDavid,
    imageLowQuality: YanivDavidLow,
    role: "AI And Backend Leader",
    links: ["https://www.linkedin.com/in/yanivdavid"],
  },
  {
    name: "צליל שני",
    image: TzlilShani,
    imageLowQuality: TzlilShaniLow,
    role: "Full Stack Developer",
    links: ["https://www.linkedin.com/in/tslil-shani-2b9695188"],
  },
  {
    name: "יניב ויינשטיין",
    image: YanivWein,
    imageLowQuality: YanivWeinLow,
    role: "Full Stack Developer",
    links: [
      "https://www.linkedin.com/in/yaniv-weinshtein",
      "https://github.com/YanivWein24",
    ],
  },
  {
    name: "אסף בלומנטל",
    image: AnonymousMaleSVG,
    imageLowQuality: AnonymousMaleSVGLow,
    role: "Full Stack Developer",
  },
  {
    name: "גל זוהר",
    image: GalZohar,
    imageLowQuality: GalZoharLow,
    role: "Front End Developer",
    links: ["https://www.linkedin.com/in/galzo", "https://github.com/galzo"],
  },
  {
    name: "עדן גוטליב",
    image: EdenGotlib,
    imageLowQuality: EdenGotlibLow,
    role: "Full Stack Developer",
  },
  {
    name: "ליאור הבר",
    image: AnonymousMaleSVG,
    imageLowQuality: AnonymousMaleSVGLow,
    role: "Front End Developer",
  },
  {
    name: "ספיר גרשוב",
    image: SapirGershov,
    imageLowQuality: SapirGershovLow,
    role: "Algorithms Researcher",
    links: ["https://scalpel.group/team/"],
  },
  {
    name: "טל רייזפלד",
    image: AnonymousFemaleSVG,
    imageLowQuality: AnonymousFemaleSVGLow,
    role: "Algorithms Engineer",
  },
  {
    name: "גלעד גורביץ",
    image: AnonymousMaleSVG,
    imageLowQuality: AnonymousMaleSVGLow,
    role: "Devops Engineer",
  },
  {
    name: "זיו גוסטינסקי",
    image: AnonymousMaleSVG,
    imageLowQuality: AnonymousMaleSVGLow,
    role: "Data Analyst",
    links: ["https://www.linkedin.com/in/ziv-gostinski"],
  },
  {
    name: "מרי דניאל",
    image: MaryDaniel,
    imageLowQuality: MaryDanielLow,
    role: "UI/UX Designer",
    links: [
      "https://www.linkedin.com/in/mary-daniel-%F0%9F%87%AE%F0%9F%87%B1-676b161b1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    ],
  },
  {
    name: "אורטל פלדמן",
    image: OrtalFeldman,
    imageLowQuality: OrtalFeldmanLow,
    role: "QA Engineer",
    links: ["https://www.linkedin.com/in/ortal-feldman-159508a4/"],
  },
  {
    name: "גל שוורץ",
    image: GalSchwarts,
    imageLowQuality: GalSchwartsLow,
    role: "QA Engineer",
    links: ["http://linkedin.com/in/galrtz"],
  },
  {
    name: "צליל מלכי",
    image: ZlilMalchi,
    imageLowQuality: ZlilMalchiLow,
    role: "Marketing Advisor",
    links: [
      "https://www.linkedin.com/in/zlil-malchi-b5453046/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    ],
  },
];
