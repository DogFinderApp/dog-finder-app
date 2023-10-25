const homePageButtons = {
  lostDog: "אני מחפש את הכלב שלי",
  foundDog: "אני מצאתי כלב",
};

export const AppTexts = {
  authPage: {
    loginCta: "התחבר",
    logoutCta: "התנתק",
  },
  searchPage: {
    title: "חיפוש אחר כלב",
    beforeReportingLost:
      "שנייה לפני שמדווחים, בואו נבדוק אם מישהו כבר דיווח על הכלב כנעדר",
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
    locationDetails: {
      locationDescription: "המיקום בו נמצא",
    },
    dateDetails: {
      foundDate: "תאריך בו נמצא",
      lostDate: "תאריך בו אבד",
    },
    dogDetails: {
      dogRace: "גזע הכלב",
      dogSize: "גודל הכלב",
      dogColor: "צבע הפרווה",
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
  },
  resultsPage: {
    title: "תוצאות חיפוש",
    call: "טלפון",
    email: "מייל",
    error: "תקלה בטעינת התוצאות",
    noResults: {
      title: "לא נמצאו תוצאות",
      reportMissingDog: "דווח על הכלב כנעדר",
      reportDogFound: "דווח על כלב כנמצא",
    },
    notFound: {
      lostDogNotFound: "הכלב שלי לא נמצא כאן",
      foundDogNotFound: "הכלב שמצאתי לא כאן",
    },
    refresh: "רענן",
    loading: "...טוען תוצאות",
  },
  navigation: {
    home: "בית",
    report: "דיווח על כלב",
    reportFound: "דיווח על כלב שנמצא",
    searchLostDog: homePageButtons.lostDog,
    searchFoundDog: homePageButtons.foundDog,
  },
};
