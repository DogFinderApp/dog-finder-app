const homePageButtons = {
  lostDog: "דיווח על כלב נעדר",
  foundDog: "מצאתי כלב",
};

export const AppTexts = {
  authPage: {
    loginCta: "התחבר",
    logoutCta: "התנתק",
  },
  searchPage: {
    title: "חיפוש אחר כלב",
    beforeReportingLost:
      "העלו תמונה של כלב שמצאתם ונראה אם מישהו דיווח עליו כנמצא",
    submit: "חיפוש",
  },
  reportPage: {
    title: {
      lost: "דיווח על כלב נעדר",
      found: "דיווח על כלב שנמצא",
    },
    photo: {
      cta: "העלו תמונה ברורה ככל האפשר של הכלב",
      ctaError: "חסרה תמונה של הכלב. העלו תמונה ברורה ככל האפשר",
    },
    dogType: {
      label: "סוג הדיווח - אבוד/נמצא",
      lost: "אבוד",
      found: "נמצא",
    },
    dogSex: {
      female: "נקבה",
      male: "זכר",
    },
    locationDetails: {
      locationDescriptionFound: "המיקום בו נמצא",
      locationDescriptionLost: "המיקום בו נאבד",
    },
    dateDetails: {
      foundDate: "תאריך בו נמצא",
      lostDate: "תאריך בו אבד",
    },
    dogDetails: {
      dogRace: "גזע הכלב/ה",
      dogSize: "גודל הכלב/ה",
      dogColor: "צבע הפרווה",
      dogSex: "מין הכלב/ה",
      chipNumber: "מספר שבב",
    },
    extraDetails: {
      extraDetails: "מידע נוסף שיעזור לזיהוי הכלב",
      contactDetails: "פרטים ליצירת קשר",
      contactName: "שם איש קשר",
      contactPhone: "מספר טלפון איש קשר",
      contactEmail: "אימייל איש קשר",
      contactAddress: "כתובת איש קשר",
    },
    helperTexts: {
      phone: "מספר הטלפון אינו תקין",
      email: "כתובת המייל אינה חוקית",
    },
    cta: "שלח דיווח",
    error: "אנא מלאו את כל השדות המסומנים באדום",
    request: {
      error: "שליחת הטופס נכשלה",
      success: {
        reportedFound: "הכלב דווח בהצלחה כנמצא",
        reportedLost: "הכלב דווח בהצלחה כנעדר",
      },
    },
  },
  homePage: {
    cta: {
      ...homePageButtons,
      searchPage: "חיפוש אחר כלב",
      reportPage: "דיווח על כלב",
    },
    noUser: {
      title: "ברוך הבא אל Dog Finder",
      welcomeMessage1: "כדי להשתמש בשירות יש להרשם",
      welcomeMessage2: "או לחלופין להתחבר עם חשבון גוגל",
      cta: "התחל עכשיו",
      footer1: "בעת הרשמה אתה מאשר את",
      footer2: "תנאי השימוש ומדיניות הפרטיות",
      footer3: "של Dog Finder",
    },
  },
  resultsPage: {
    title: "תוצאות חיפוש",
    topText:
      "הנה רשימה של התאמות פוטנציאליות לכלב שהעלאת. עיין בתמונות, ובמידע הנוסף וצור קשר עם הבעלים אם אתה מזהה התאמה.",
    bottomText: `במידה והכלב/ה שלך לא נמצאים ברשימה, אנא המתן ליצירת קשר ע"י האדם שימצא אותו.`,
    moreDetails: "לחצו לעוד פרטים",
    call: "טלפון",
    email: "מייל",
    loading: "מאתר כלבים דומים במאגר שלנו",
    error: "תקלה בטעינת התוצאות",
    noResults: {
      title: "לא נמצאו תוצאות",
      infoText1: "ייתכן שהתמונה הראשונה לא הייתה ברורה מספיק,",
      infoText2:
        "נסה להעלות תמונה אחרת או מלא את פרטי הכלב על מנת שנמצא התאמה בעתיד",
      tryAgain: "נסה שוב עם תמונה אחרת",
      reportMissingDog: "דווח על הכלב כנעדר",
      reportDogFound: "דווח על הכלב כנמצא",
    },
    notFound: {
      lostDogNotFound: "הכלב שלי לא נמצא כאן",
      foundDogNotFound: "הכלב שמצאתי לא כאן",
    },
    refresh: "רענן",
  },
  allReportsPage: {
    title: "כל הדיווחים",
    loading: "טוען את מאגר הדיווחים",
    selectLabel: "מיין לפי:",
    select: {
      found: "הצג כלבים שנמצאו",
      lost: "הצג כלבים נעדרים",
      all: "הצג את כל הכלבים שדווחו",
    },
  },
  navigation: {
    home: "בית",
    report: "דיווח על כלב",
    reportFound: homePageButtons.foundDog,
    searchLostDog: homePageButtons.lostDog,
    searchFoundDog: "חיפוש כלב במאגר הנעדרים",
  },
  dogDetails: {
    title: "פרטי הכלב",
    hamalButton: "שלח הודעת וואטסאפ",
    backButton: "חזרה אחורה",
    markAsReturndButton: "סמן כהושב לבעליו",
    loading: "...דף בטעינה",
  },
  dogCard: {
    lostLocation: "אבד באיזור",
    foundLocation: "נמצא באיזור",
    sexText: "מין",
    foundDate: "נמצא בתאריך",
    lostDate: "אבד בתאריך",
  },
  privacyPolicyTitle: "תנאי השימוש",
  aboutUsTitle: "אודות",
};
