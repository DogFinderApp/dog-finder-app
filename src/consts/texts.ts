export const AppTexts = {
  authPage: {
    loginCta: "התחברות",
    logoutCta: "התנתקות",
  },
  searchPage: {
    title: "חיפוש אחר כלב",
    searchLost: "העלו תמונה של כלב שמצאתם ונראה אם מישהו דיווח עליו כנעדר",
    searchFound: "העלו תמונה של כלב שמצאתם ונראה אם מישהו דיווח עליו כנמצא",
    submit: "חיפוש",
  },
  reportPage: {
    photo: {
      cta: "העלו תמונה ברורה ככל האפשר של הכלב",
      ctaNote: "(שרק הכלב יהיה בתמונה)",
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
    dogAge: {
      puppy: "גור",
      adult: "בוגר",
      senior: "מבוגר",
    },
    locationDetails: {
      locationDescriptionFound: "המיקום בו נמצא/ה",
      locationDescriptionLost: "המיקום בו נאבד/ה",
    },
    dateDetails: {
      foundDate: "תאריך בו נמצא/ה",
      lostDate: "תאריך בו אבד/ה",
    },
    dogDetails: {
      dogRace: "גזע הכלב/ה",
      dogSize: "גודל הכלב/ה",
      dogColor: "צבע הפרווה",
      dogSex: "מין הכלב/ה",
      chipNumber: "מספר שבב",
      dogAgeFound: "גיל משוער",
      dogAgeLost: "גיל הכלב/ה",
    },
    dogSizeOptions: {
      קטן: "קטן",
      בינוני: "בינוני",
      גדול: "גדול",
    },
    extraDetails: {
      extraDetails: "מידע נוסף שיעזור לזיהוי הכלב/ה",
      contactDetails: "פרטים ליצירת קשר",
      contactName: "שם איש/ת קשר",
      contactPhone: "מספר טלפון איש/ת קשר",
      contactEmail: "אימייל איש/ת קשר",
      contactAddress: "כתובת איש/ת קשר",
    },
    helperTexts: {
      phone: "מספר הטלפון אינו תקין",
      phonePlaceholder: "נא להכניס מספר בן 10 ספרות ללא מקפים",
      email: "כתובת המייל אינה חוקית",
    },
    cta: "שלח דיווח",
    error: "אנא מלאו את כל השדות המסומנים באדום",
    request: {
      error: "שליחת הטופס נכשלה",
      success: {
        reportedFound: "הכלב דווח בהצלחה כנמצא",
        reportedLost: "הכלב דווח בהצלחה כנעדר",
        redirect: "מיד תועברו לחיפוש במאגר",
      },
    },
  },
  homePage: {
    cta: {
      searchPage: "חיפוש אחר כלב",
      reportPage: "דיווח על כלב",
    },
    noUser: {
      title: "ברוך הבא אל Fluffy Finder",
      welcomeMessage1: "כדי להשתמש בשירות יש להרשם",
      welcomeMessage2: "או לחלופין להתחבר עם חשבון גוגל",
      cta: "התחלה",
      footer1: "הרשמה לאתר מהווה אישור",
      footer2: "לתנאי השימוש ומדיניות הפרטיות",
      footer3: "של Fluffy Finder",
    },
  },
  resultsPage: {
    title: "תוצאות חיפוש",
    topText:
      "הנה רשימה של התאמות פוטנציאליות לכלב שהעלאת. עיין בתמונות, ובמידע הנוסף וצור קשר עם הבעלים אם אתה מזהה התאמה.",
    bottomText:
      'במידה והכלב/ה שלך לא נמצאים ברשימה, אנא המתן ליצירת קשר ע"י האדם שימצא אותו.',
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
    unauthorized: "אין למשתמש זה גישה למאגר הכלבים המלא",
    selectLabel: "מיין לפי:",
    select: {
      found: "הצג כלבים שנמצאו",
      lost: "הצג כלבים נעדרים",
      all: "הצג את כל הכלבים שדווחו",
    },
    numberOfReports: "מספר הדיווחים:",
  },
  navigation: {
    home: "בית",
    aboutUs: "אודות",
    reportFound: "דיווח - מצאתי כלב",
    reportLost: "דיווח - איבדתי כלב",
    searchLost: "חיפוש כלב במאגר הנעדרים",
    searchFound: "חיפוש כלב במאגר הנמצאים",
    privacyPolicy: "תנאי השימוש",
    allFound: "כל הכלבים שנמצאו",
    allLost: "כל הכלבים שנאבדו",
  },
  dogDetails: {
    title: "פרטי הכלב",
    whatsappButton: "שליחת הודעת וואטסאפ",
    disabledButtonText: "יש לדווח קודם על כלב שנמצא/נעדר",
    backButton: "חזרה אחורה",
    loading: "טוען את פרטי הכלב",
    error: "לא קיים מידע",
    unknown: "לא ידוע",
    whatsappLinks: {
      lost: "היי, הגעתי אליך דרך פלטפורמת Fluffy Finder. ייתכן והכלב/ה שלי נמצא אצלך?",
      lost2: "זה הדיווח של הכלב שאיבדתי:",
      lost3: "זה הדיווח של הכלב שמצאת שאולי יכול להתאים:",
      found:
        "היי, הגעתי אליך דרך פלטפורמת Fluffy Finder. מצאתי כלב/ה שדומה לשלך, שנבדוק? :)",
      found2: "זה הדיווח של הכלב שאיבדת:",
      found3: "זה הדיווח של הכלב שמצאתי שאולי יכול להתאים:",
    },
  },
  dogCard: {
    lostLocation: "אבד באיזור",
    foundLocation: "נמצא באיזור",
    sexText: "מין",
    foundDate: "נמצא בתאריך",
    lostDate: "אבד בתאריך",
    toolTipLost: "חיפוש כלבים דומים שנעדרים",
    toolTipFound: "חיפוש כלבים דומים שנמצאו",
    tooltipDelete: "מחיקת דיווח",
  },
  aboutPage: {
    texts: {
      text1:
        "Fluffy Finder הינו מיזם חברתי טכנולוגי אשר מטרתו היא לאפשר איתור יעיל ומהיר של כלבים אבודים והשבתם לבעליהם המצפים להם.",
      text2:
        'המערכת שפיתחנו מבוססת על אלגוריתמי בינה מלאכותית המסוגלים לזהות דמיון בין תמונות של כלבים וכלבות שנמצאו בשטח ע"י גורמים שונים בין תמונות של אלו שדווחו שאבדו. המערכת יעילה גם כאשר התמונות מזוויות שונות או כשמראה הכלב/ה השתנה.',
      text3:
        "אם איבדתם את הכלב/ה שלכם או מצאת כלב/ה תועה, כל שתצטרכו הוא להעלות תמונה של הכלב/ה ולהוסיף כמה פרטים ונשמח לסייע לכם להתאחד מחדש 🙂.",
    },
    moreInfo: "למידע נוסף או שאלות על המיזם אנא פנו אלינו במייל",
    mail: "fluffyfinderinitiative@gmail.com",
    ourPeople: "האנשים מאחורי המיזם",
  },
  modals: {
    matchingReport: {
      title: "מצאנו דיווח שנראה תואם לתמונה שהעלאת",
      alertTexts: {
        found:
          "המערכת שלנו זיהתה מבין הדיווחים על הכלבים שנמצאו את הפרופיל הבא",
        lost: "המערכת שלנו זיהתה מבין הדיווחים על הכלבים האבודים את הפרופיל הבא",
      },
      watchProfile: "צפה בפרופיל",
      cancelText: "ביטול דיווח",
      continueText: "המשך למילוי דיווח",
      bottomText: {
        part1: "אם כבר העלת בעבר דיווח על כלבך, ניתן לחפש דיווחים דומים ",
        linkText: "בעמוד החיפוש",
        part2: "אם זהו לא הכלב/ה שלך, ניתן להמשיך במילוי הדיווח",
      },
    },
    deleteReport: {
      title: "מחיקת דיווח מהמאגר",
      text: "האם אתה בטוח שברצונך למחוק את הדיווח?",
      text2: "פעולה זו הינה בלתי הפיכה",
      cancelText: "ביטול",
      continueText: "מחיקה לצמיתות",
      deletingText: "מוחק...",
    },
  },
};
