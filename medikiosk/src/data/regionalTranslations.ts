/**
 * Comprehensive Localization & Regional Language Dictionary
 * Supports 10 Major Indian Regional Languages + English:
 * Hindi (hi), Bengali (bn), Telugu (te), Marathi (mr), Tamil (ta),
 * Gujarati (gu), Kannada (kn), Malayalam (ml), Punjabi (pa), Odia (or), English (en).
 */

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
  bcp47: string;
  whisperCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Pan-India', bcp47: 'en-IN', whisperCode: 'en' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'North / Central', bcp47: 'hi-IN', whisperCode: 'hi' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal, Tripura', bcp47: 'bn-IN', whisperCode: 'bn' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra, Telangana', bcp47: 'te-IN', whisperCode: 'te' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra, Goa', bcp47: 'mr-IN', whisperCode: 'mr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu, Puducherry', bcp47: 'ta-IN', whisperCode: 'ta' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat', bcp47: 'gu-IN', whisperCode: 'gu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka', bcp47: 'kn-IN', whisperCode: 'kn' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala', bcp47: 'ml-IN', whisperCode: 'ml' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab, Chandigarh', bcp47: 'pa-IN', whisperCode: 'pa' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha', bcp47: 'or-IN', whisperCode: 'or' },
];

export const getLanguageInfo = (code: SupportedLanguage): LanguageInfo => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
};

export interface StepPromptTranslation {
  title: string;
  sub: string;
  tts: string;
  placeholder?: string;
}

export interface DomainPrompts {
  general: StepPromptTranslation;
  fever: StepPromptTranslation;
  respiratory: StepPromptTranslation;
  gastrointestinal: StepPromptTranslation;
}

export interface RegionalTranslation {
  listen: string;
  speak: string;
  stopVoice: string;
  next: string;
  back: string;
  complete: string;
  submit: string;
  searchHospital: string;
  selectHospital: string;
  clear: string;
  changeLanguage: string;
  orSpeakBelow: string;

  chiefComplaint: {
    title: string;
    sub: string;
    tts: string;
    placeholder: string;
    orChoosePreset: string;
  };

  stepDuration: DomainPrompts;
  stepCharacter: DomainPrompts;
  stepSiteRadiation: DomainPrompts;

  stepSeverity: {
    title: string;
    sub: string;
    tts: string;
    mild: string;
    moderate: string;
    severe: string;
  };

  stepAssociated: {
    title: string;
    sub: string;
    tts: string;
    addCustom: string;
  };

  stepAggravating: {
    title: string;
    sub: string;
    tts: string;
    placeholder: string;
  };

  stepRelieving: {
    title: string;
    sub: string;
    tts: string;
    placeholder: string;
  };

  stepFollowUp: {
    title: string;
    sub: string;
    tts: string;
  };

  presets: {
    chestTitle: string;
    chestDesc: string;
    giTitle: string;
    giDesc: string;
    feverTitle: string;
    feverDesc: string;
    orthoTitle: string;
    orthoDesc: string;
  };

  login: {
    portalTitle: string;
    portalSub: string;
    phoneOrAbha: string;
    continueBtn: string;
    registerBtn: string;
    createRecord: string;
    noRecordFound: string;
    loginDesc: string;
    fullName: string;
    age: string;
    gender: string;
    male: string;
    female: string;
    other: string;
  };

  summary: {
    completeTitle: string;
    completeSub: string;
    assignedStation: string;
    openDashboard: string;
    fastTrack: string;
    standardCare: string;
    careReview: string;
  };
}

export const REGIONAL_TRANSLATIONS: Record<SupportedLanguage, RegionalTranslation> = {
  en: {
    listen: 'Listen',
    speak: 'Speak',
    stopVoice: 'Stop Recording',
    next: 'Next',
    back: 'Back',
    complete: 'Complete Consultation',
    submit: 'Submit & Route OPD',
    searchHospital: 'Search hospital name or city...',
    selectHospital: 'Select Hospital',
    clear: 'Clear',
    changeLanguage: 'Language',
    orSpeakBelow: 'Or speak directly into the microphone below',

    chiefComplaint: {
      title: 'What is your primary health concern today?',
      sub: 'Please describe in your own words or choose a common category below.',
      tts: 'Please describe your main health concern today, or select one below.',
      placeholder: 'e.g. Chest pain with sweating since 1 hour, or severe cough and fever...',
      orChoosePreset: 'Or select a common condition:',
    },

    stepDuration: {
      general: {
        title: 'When did these symptoms first start?',
        sub: 'Select how long you have been feeling unwell.',
        tts: 'When did these symptoms first start?',
      },
      fever: {
        title: 'When did the fever first begin?',
        sub: 'Tell us how many hours or days you have had fever.',
        tts: 'When did the fever first start?',
      },
      respiratory: {
        title: 'When did the cough or breathing difficulty start?',
        sub: 'Indicate the onset of your respiratory symptoms.',
        tts: 'When did the cough or breathing trouble start?',
      },
      gastrointestinal: {
        title: 'When did the stomach or digestive discomfort begin?',
        sub: 'Tell us how long you have had this digestive issue.',
        tts: 'When did the digestive or stomach discomfort start?',
      },
    },

    stepCharacter: {
      general: {
        title: 'How would you describe the feeling of discomfort?',
        sub: 'Select the description that best fits your symptom.',
        tts: 'What does the discomfort feel like?',
      },
      fever: {
        title: 'What is the pattern and feeling of the fever?',
        sub: 'Are you experiencing chills, shivering, or continuous heat?',
        tts: 'How does the fever feel? Is there any shivering?',
      },
      respiratory: {
        title: 'What is the nature of your cough or breathing?',
        sub: 'Is your cough dry, productive with phlegm, or wheezing?',
        tts: 'What is the character of your cough or sputum?',
      },
      gastrointestinal: {
        title: 'What type of stomach distress do you feel?',
        sub: 'Is it burning, cramping, sharp pain, or bloating?',
        tts: 'What does the digestive discomfort feel like?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'Where is the discomfort, and does it spread anywhere?',
        sub: 'Specify the location and any spreading of the sensation.',
        tts: 'Where is the discomfort, and does the pain spread anywhere else?',
      },
      fever: {
        title: 'Which parts of your body are most affected?',
        sub: 'Specify if you have body ache, headache, or joint stiffness.',
        tts: 'Which parts of your body are most affected by the fever?',
      },
      respiratory: {
        title: 'Where do you feel the chest tightness or throat congestion?',
        sub: 'Select the primary area of breathing difficulty.',
        tts: 'Which areas of your chest and throat are affected?',
      },
      gastrointestinal: {
        title: 'Where in your abdomen is the discomfort located?',
        sub: 'Is it upper abdomen, lower abdomen, or all over?',
        tts: 'Where in your abdomen is the discomfort located?',
      },
    },

    stepSeverity: {
      title: 'How intense or severe is your discomfort?',
      sub: 'Rate on a scale from 1 (mild) to 10 (unbearable).',
      tts: 'On a scale from 1 to 10, how severe is your discomfort?',
      mild: 'Mild (1 - 3)',
      moderate: 'Moderate (4 - 6)',
      severe: 'Severe (7 - 10)',
    },

    stepAssociated: {
      title: 'Are you experiencing any other associated symptoms?',
      sub: 'Select all symptoms that you are currently noticing.',
      tts: 'Are you experiencing any other associated symptoms?',
      addCustom: 'Add any other symptom...',
    },

    stepAggravating: {
      title: 'What makes your symptoms worse?',
      sub: 'For example: exertion, coughing, eating, lying down, cold air.',
      tts: 'What makes your symptoms worse?',
      placeholder: 'e.g. Walking up stairs, eating spicy food, lying flat...',
    },

    stepRelieving: {
      title: 'What brings you comfort or relief?',
      sub: 'For example: resting, warm water, sitting up, medication.',
      tts: 'What provides relief?',
      placeholder: 'e.g. Complete rest, drinking warm fluids, taking antacids...',
    },

    stepFollowUp: {
      title: 'Quick clinical questions for your doctor',
      sub: 'These targeted questions ensure your doctor has exact details ready.',
      tts: 'Please answer these quick follow-up questions to help your doctor.',
    },

    presets: {
      chestTitle: 'Chest & Breathing',
      chestDesc: 'Chest pain, tightness, shortness of breath, palpitations',
      giTitle: 'Digestion & Stomach',
      giDesc: 'Abdominal pain, acidity, gas, nausea, vomiting, loose stools',
      feverTitle: 'Fever & Infection',
      feverDesc: 'High fever, chills, body ache, sore throat, weakness',
      orthoTitle: 'Joints & Spine',
      orthoDesc: 'Knee pain, lower back ache, shoulder stiffness, swelling',
    },

    login: {
      portalTitle: 'Patient OPD Portal',
      portalSub: 'ABDM & Clinical Intake Services',
      phoneOrAbha: 'Enter Phone Number or ABHA ID',
      continueBtn: 'Continue / Next',
      registerBtn: 'Create Record & Register',
      createRecord: 'New Patient Registration',
      noRecordFound: 'No prior OPD record found. Please enter details below.',
      loginDesc: 'Sign in to access your OPD token, clinical summary, and digital prescriptions.',
      fullName: 'Full Name',
      age: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
    },

    summary: {
      completeTitle: 'OPD Registration Complete',
      completeSub: 'Your symptoms and clinical intake have been transferred to the attending physician.',
      assignedStation: 'Assigned OPD Station',
      openDashboard: 'Open Patient Dashboard',
      fastTrack: 'Fast-Track Check-In',
      standardCare: 'Standard Care',
      careReview: 'Care Review',
    },
  },

  hi: {
    listen: 'सुनें',
    speak: 'बोलें',
    stopVoice: 'रोकें',
    next: 'आगे बढ़ें',
    back: 'पीछे जाएं',
    complete: 'परामर्श पूर्ण करें',
    submit: 'ओपीडी टोकन प्राप्त करें',
    searchHospital: 'अस्पताल का नाम या शहर खोजें...',
    selectHospital: 'अस्पताल चुनें',
    clear: 'हटाएं',
    changeLanguage: 'भाषा बदलें',
    orSpeakBelow: 'या नीचे माइक दबाकर अपनी भाषा में बोलें',

    chiefComplaint: {
      title: 'आज आपको क्या मुख्य स्वास्थ्य परेशानी है?',
      sub: 'कृपया अपने शब्दों में बताएं या नीचे दी गई श्रेणियों में से चुनें।',
      tts: 'कृपया अपनी मुख्य परेशानी बताएं या बोलें।',
      placeholder: 'जैसे: 1 घंटे से सीने में दर्द और पसीना, या तेज खांसी और बुखार...',
      orChoosePreset: 'या सामान्य समस्या चुनें:',
    },

    stepDuration: {
      general: {
        title: 'यह तकलीफ कब से शुरू हुई है?',
        sub: 'बताएं कि आप कितने समय से अस्वस्थ महसूस कर रहे हैं।',
        tts: 'यह तकलीफ कब से शुरू हुई?',
      },
      fever: {
        title: 'बुखार कब से शुरू हुआ है?',
        sub: 'बताएं कि आपको कितने घंटे या दिनों से बुखार है।',
        tts: 'बुखार कब से शुरू हुआ है?',
      },
      respiratory: {
        title: 'खांसी या सांस की तकलीफ कब से शुरू हुई?',
        sub: 'सांस संबंधी समस्या का समय बताएं।',
        tts: 'खांसी या सांस की तकलीफ कब से शुरू हुई?',
      },
      gastrointestinal: {
        title: 'पेट या पाचन की परेशानी कब से शुरू हुई?',
        sub: 'बताएं कि पेट में यह समस्या कब से है।',
        tts: 'पेट या पाचन की परेशानी कब से शुरू हुई?',
      },
    },

    stepCharacter: {
      general: {
        title: 'तकलीफ का अहसास कैसा है?',
        sub: 'जो आपकी परेशानी से सबसे सटीक मेल खाए, उसे चुनें।',
        tts: 'तकलीफ का अहसास कैसा है?',
      },
      fever: {
        title: 'बुखार कैसा महसूस हो रहा है? क्या कंपकंपी है?',
        sub: 'क्या आपको ठंड लगकर कंपकंपी आ रही है या लगातार तेज गर्मी है?',
        tts: 'बुखार कैसा महसूस हो रहा है? क्या कंपकंपी है?',
      },
      respiratory: {
        title: 'खांसी और बलगम का स्वरूप कैसा है?',
        sub: 'क्या खांसी सूखी है, बलगम वाली है, या सांस में सीटी की आवाज आ रही है?',
        tts: 'खांसी और बलगम का स्वरूप कैसा है?',
      },
      gastrointestinal: {
        title: 'पेट या शौच का स्वरूप कैसा है?',
        sub: 'क्या जलन, मरोड़, भारीपन या गैस की समस्या है?',
        tts: 'पेट या शौच का स्वरूप कैसा है?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'तकलीफ किस जगह है, और क्या यह कहीं फैलती है?',
        sub: 'परेशानी का मुख्य स्थान और क्या दर्द अन्य अंगों में जा रहा है, बताएं।',
        tts: 'क्या यह दर्द शरीर में कहीं और भी फैलता है?',
      },
      fever: {
        title: 'बुखार का असर शरीर के किन अंगों में ज्यादा है?',
        sub: 'क्या सिर में दर्द, बदन दर्द या जोड़ों में जकड़न है?',
        tts: 'बुखार का असर शरीर के किन हिस्सों में ज्यादा है?',
      },
      respiratory: {
        title: 'सांस या जकड़न का असर सीने में कहां महसूस हो रहा है?',
        sub: 'सीने के किस हिस्से में भारीपन महसूस हो रहा है?',
        tts: 'सांस या जकड़न का असर सीने में कहां महसूस हो रहा है?',
      },
      gastrointestinal: {
        title: 'पेट में तकलीफ किस जगह है, क्या यह कहीं और फैलती है?',
        sub: 'ऊपरी पेट में, नाभि के पास या पूरे पेट में?',
        tts: 'पेट में तकलीफ किस जगह है, क्या यह कहीं और फैलती है?',
      },
    },

    stepSeverity: {
      title: 'तकलीफ की तीव्रता कितनी अधिक है?',
      sub: '1 (हल्का) से 10 (असहनीय दर्द) के पैमाने पर चुनें।',
      tts: 'तकलीफ की तीव्रता एक से दस के पैमाने पर कितनी है?',
      mild: 'हल्का (1 - 3)',
      moderate: 'मध्यम (4 - 6)',
      severe: 'गंभीर (7 - 10)',
    },

    stepAssociated: {
      title: 'क्या साथ में कोई अन्य लक्षण भी हैं?',
      sub: 'जो भी अन्य लक्षण महसूस हो रहे हैं, उन्हें चुनें।',
      tts: 'क्या साथ में कोई अन्य लक्षण भी हैं?',
      addCustom: 'कोई अन्य लक्षण जोड़ें...',
    },

    stepAggravating: {
      title: 'तकलीफ किस चीज से बढ़ती है?',
      sub: 'उदाहरण: चलने से, खाने से, लेटने से, या ठंडी हवा से।',
      tts: 'तकलीफ किस चीज से बढ़ती है?',
      placeholder: 'जैसे: सीढ़ियां चढ़ने से, तीखा खाने से, सीधे लेटने पर...',
    },

    stepRelieving: {
      title: 'किस चीज से आराम मिलता है?',
      sub: 'उदाहरण: विश्राम करने से, गर्म पानी से, बैठने से, दवा से।',
      tts: 'किस चीज से आराम मिलता है?',
      placeholder: 'जैसे: पूरी तरह आराम करने से, गुनगुना पानी पीने से...',
    },

    stepFollowUp: {
      title: 'डॉक्टर के लिए कुछ संक्षिप्त प्रश्न',
      sub: 'इन उत्तरों से आपके चिकित्सक को सटीक जानकारी तुरंत मिलेगी।',
      tts: 'डॉक्टर के परामर्श के लिए कृपया इन कुछ संक्षिप्त सवालों के जवाब दें।',
    },

    presets: {
      chestTitle: 'सीना और सांस',
      chestDesc: 'सीने में दर्द, दबाव, सांस फूलना, दिल की धड़कन तेज होना',
      giTitle: 'पाचन और पेट',
      giDesc: 'पेट दर्द, गैस, एसिडिटी, उल्टी, दस्त, खट्टी डकारें',
      feverTitle: 'बुखार और संक्रमण',
      feverDesc: 'तेज बुखार, कंपकंपी, बदन दर्द, गले में खराश, कमजोरी',
      orthoTitle: 'जोड़ और कमर',
      orthoDesc: 'घुटनों में दर्द, कमर दर्द, कंधों में जकड़न, सूजन',
    },

    login: {
      portalTitle: 'रोगी पोर्टल',
      portalSub: 'आभा और ओपीडी सहायता',
      phoneOrAbha: 'फ़ोन नंबर या आभा आईडी दर्ज करें',
      continueBtn: 'आगे बढ़ें',
      registerBtn: 'रजिस्टर करें',
      createRecord: 'नया पंजीकरण',
      noRecordFound: 'खाता नहीं मिला। कृपया नीचे विवरण दर्ज करके रजिस्टर करें।',
      loginDesc: 'स्वास्थ्य रिकॉर्ड, ई-पर्चे और ओपीडी टोकन के लिए लॉगिन करें।',
      fullName: 'पूरा नाम',
      age: 'उम्र',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
    },

    summary: {
      completeTitle: 'पंजीकरण सफलतापूर्वक संपन्न',
      completeSub: 'आपकी जानकारी ओपीडी परामर्श कक्ष को प्रेषित कर दी गई है।',
      assignedStation: 'निर्धारित ओपीडी कक्ष',
      openDashboard: 'रोगी डैशबोर्ड खोलें',
      fastTrack: 'शीघ्र सहायता',
      standardCare: 'सामान्य परामर्श',
      careReview: 'परामर्श क्रम',
    },
  },

  bn: {
    listen: 'শুনুন',
    speak: 'বলুন',
    stopVoice: 'থামান',
    next: 'পরবর্তী',
    back: 'পূর্ববর্তী',
    complete: 'পরামর্শ সম্পন্ন করুন',
    submit: 'ওপিডি টোকেন নিন',
    searchHospital: 'হাসপাতালের নাম বা শহর খুঁজুন...',
    selectHospital: 'হাসপাতাল নির্বাচন করুন',
    clear: 'মুছুন',
    changeLanguage: 'ভাষা পরিবর্তন',
    orSpeakBelow: 'অথবা নিচে মাইক্রোফোনে সরাসরি বলুন',

    chiefComplaint: {
      title: 'আজ আপনার প্রধান শারীরিক সমস্যা কী?',
      sub: 'অনুগ্রহ করে নিজের ভাষায় বলুন বা নিচের তালিকা থেকে বেছে নিন।',
      tts: 'আজ আপনার প্রধান শারীরিক সমস্যা কী, অনুগ্রহ করে বলুন।',
      placeholder: 'যেমন: ১ ঘণ্টা ধরে বুকে ব্যথা ও ঘাম, অথবা তীব্র কাশি ও জ্বর...',
      orChoosePreset: 'অথবা সাধারণ সমস্যা বেছে নিন:',
    },

    stepDuration: {
      general: {
        title: 'এই সমস্যাটি কবে থেকে শুরু হয়েছে?',
        sub: 'আপনি কতক্ষণ বা কয়দিন ধরে অসুস্থ বোধ করছেন জানান।',
        tts: 'এই সমস্যাটি কবে থেকে শুরু হয়েছে?',
      },
      fever: {
        title: 'জ্বর কবে থেকে শুরু হয়েছে?',
        sub: 'কত ঘণ্টা বা দিন ধরে জ্বর রয়েছে জানান।',
        tts: 'জ্বর কবে থেকে শুরু হয়েছে?',
      },
      respiratory: {
        title: 'কাশি বা শ্বাসকষ্ট কবে থেকে শুরু হয়েছে?',
        sub: 'শ্বাসকষ্টের সময়কাল নির্বাচন করুন।',
        tts: 'কাশি বা শ্বাসকষ্ট কবে থেকে শুরু হয়েছে?',
      },
      gastrointestinal: {
        title: 'পেটের বা হজমের সমস্যা কবে থেকে শুরু হয়েছে?',
        sub: 'পেটের সমস্যা কতদিন ধরে চলছে জানান।',
        tts: 'পেটের বা হজমের সমস্যা কবে থেকে শুরু হয়েছে?',
      },
    },

    stepCharacter: {
      general: {
        title: 'অসুস্থতার অনুভূতি কেমন?',
        sub: 'যা আপনার কষ্টের সাথে সবচেয়ে বেশি মিলে তা বেছে নিন।',
        tts: 'অসুস্থতার অনুভূতি কেমন?',
      },
      fever: {
        title: 'জ্বরের ধরন কেমন? কাঁপুনি দিচ্ছে কি?',
        sub: 'ঠান্ডা লেগে কাঁপুনি হচ্ছে নাকি ক্রমাগত শরীর গরম থাকছে?',
        tts: 'জ্বরের অনুভূতি কেমন? কাঁপুনি হচ্ছে কি?',
      },
      respiratory: {
        title: 'কাশি বা শ্বাসের ধরন কেমন?',
        sub: 'শুকনো কাশি, কফ বের হচ্ছে নাকি বুকের ভেতর সাঁই সাঁই শব্দ হচ্ছে?',
        tts: 'কাশি বা কফের ধরন কেমন?',
      },
      gastrointestinal: {
        title: 'পেটে কী ধরণের অস্বস্তি হচ্ছে?',
        sub: 'জ্বলুনি, কামড়ানো ব্যথা, ভার বা পেট ফাঁপা?',
        tts: 'পেটে কী ধরণের অস্বস্তি হচ্ছে?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'কষ্ট শরীরের কোন জায়গায় এবং তা কি কোথাও ছড়ায়?',
        sub: 'ব্যথার স্থান ও তা অন্য কোথাও ছড়িয়ে পড়ছে কিনা তা জানান।',
        tts: 'কষ্ট শরীরের কোন জায়গায় এবং ব্যথা কি কোথাও ছড়ায়?',
      },
      fever: {
        title: 'জ্বরের প্রভাব শরীরের কোন অংশে সবচেয়ে বেশি?',
        sub: 'মাথা ব্যথা, শরীর ব্যথা বা গাঁটে ব্যথা আছে কি?',
        tts: 'জ্বরের প্রভাব শরীরের কোন অংশে সবচেয়ে বেশি?',
      },
      respiratory: {
        title: 'বুকে বা গলায় অস্বস্তি কোথায় অনুভব করছেন?',
        sub: 'বুকে চাপ বা শ্বাসকষ্টের সঠিক জায়গাটি বেছে নিন।',
        tts: 'বুকে বা গলায় অস্বস্তি কোথায় অনুভব করছেন?',
      },
      gastrointestinal: {
        title: 'পেটের কোন অংশে সমস্যা হচ্ছে?',
        sub: 'উপরের পেটে, নাভির চারপাশে নাকি সমস্ত পেটে?',
        tts: 'পেটের কোন অংশে সমস্যা হচ্ছে?',
      },
    },

    stepSeverity: {
      title: 'কষ্টের তীব্রতা কতটা বেশি?',
      sub: '১ (সামান্য) থেকে ১০ (অসহ্য যন্ত্রণা) এর মধ্যে বেছে নিন।',
      tts: 'এক থেকে দশের মধ্যে আপনার কষ্ট কতটা তীব্র?',
      mild: 'সামান্য (১ - ৩)',
      moderate: 'মাঝারি (৪ - ৬)',
      severe: 'তীব্র (৭ - ১০)',
    },

    stepAssociated: {
      title: 'সাথে কি অন্য কোনো উপসর্গ রয়েছে?',
      sub: 'যে উপসর্গগুলো আপনার হচ্ছে তা বেছে নিন।',
      tts: 'সাথে কি অন্য কোনো উপসর্গ রয়েছে?',
      addCustom: 'অন্য কোনো উপসর্গ যোগ করুন...',
    },

    stepAggravating: {
      title: 'কীসে আপনার কষ্ট বৃদ্ধি পায়?',
      sub: 'যেমন: হাঁটলে, খাবার খেলে, শুয়ে থাকলে, ঠান্ডায়।',
      tts: 'কীসে আপনার কষ্ট বৃদ্ধি পায়?',
      placeholder: 'যেমন: সিঁড়ি উঠলে, মশলাদার খাবার খেলে, শুয়ে থাকলে...',
    },

    stepRelieving: {
      title: 'কীসে আপনি আরাম বা স্বস্তি পান?',
      sub: 'যেমন: বিশ্রাম নিলে, গরম জলে, বসলে, ওষুধে।',
      tts: 'কীসে আপনি আরাম বা স্বস্তি পান?',
      placeholder: 'যেমন: সম্পূর্ণ বিশ্রাম নিলে, ঈষদুষ্ণ জল পান করলে...',
    },

    stepFollowUp: {
      title: 'চিকিৎসকের জন্য কিছু সংক্ষিপ্ত প্রশ্ন',
      sub: 'এই উত্তরগুলি আপনার চিকিৎসককে সঠিক সিদ্ধান্ত নিতে সাহায্য করবে।',
      tts: 'ডাক্তারবাবুর জন্য এই সংক্ষিপ্ত প্রশ্নগুলির উত্তর দিন।',
    },

    presets: {
      chestTitle: 'বুক ও শ্বাসপ্রশ্বাস',
      chestDesc: 'বুকে ব্যথা, চাপ, শ্বাসকষ্ট, বুক ধড়ফড়ানি',
      giTitle: 'হজম ও পেট',
      giDesc: 'পেট ব্যথা, গ্যাস, অ্যাসিডিটি, বমি, পাতলা পায়খানা',
      feverTitle: 'জ্বর ও সংক্রমণ',
      feverDesc: 'তীব্র জ্বর, কাঁপুনি, শরীর ব্যথা, গলা ব্যথা, দুর্বলতা',
      orthoTitle: 'হাড়ের জোড় ও কোমর',
      orthoDesc: 'হাঁটু ব্যথা, কোমর ব্যথা, কাঁধের জড়তা, ফোলাভাব',
    },

    login: {
      portalTitle: 'রোগী পোর্টাল',
      portalSub: 'আভা এবং ওপিডি পরিষেবা',
      phoneOrAbha: 'ফোন নম্বর বা আভা আইডি দিন',
      continueBtn: 'এগিয়ে যান',
      registerBtn: 'নিবন্ধন করুন',
      createRecord: 'নতুন রোগী নিবন্ধন',
      noRecordFound: 'কোন রেকর্ড পাওয়া যায়নি। নিচে তথ্য দিয়ে নিবন্ধন করুন।',
      loginDesc: 'প্রেসক্রিপশন, ওপিডি টোকেন এবং স্বাস্থ্য রেকর্ডের জন্য লগইন করুন।',
      fullName: 'পুরো নাম',
      age: 'বয়স',
      gender: 'লিঙ্গ',
      male: 'পুরুষ',
      female: 'মহিলা',
      other: 'অন্যান্য',
    },

    summary: {
      completeTitle: 'ওপিডি নিবন্ধন সফল হয়েছে',
      completeSub: 'আপনার উপসর্গের বিবরণ চিকিৎসকের কাছে পাঠানো হয়েছে।',
      assignedStation: 'নির্ধারিত ওপিডি কক্ষ',
      openDashboard: 'রোগী ড্যাশবোর্ড খুলুন',
      fastTrack: 'জরুরি সহায়তা',
      standardCare: 'সাধারণ পরামর্শ',
      careReview: 'পরামর্শ ক্রম',
    },
  },

  te: {
    listen: 'వినండి',
    speak: 'మాట్లాడండి',
    stopVoice: 'ఆపండి',
    next: 'తరువాత',
    back: 'వెనుకకు',
    complete: 'పూర్తి చేయండి',
    submit: 'ఓపీడీ టోకెన్ పొందండి',
    searchHospital: 'ఆసుపత్రి పేరు లేదా నగరాన్ని వెతకండి...',
    selectHospital: 'ఆసుపత్రిని ఎంచుకోండి',
    clear: 'తొలగించు',
    changeLanguage: 'భాషను మార్చండి',
    orSpeakBelow: 'లేదా క్రింద మైక్‌లో నేరుగా మాట్లాడండి',

    chiefComplaint: {
      title: 'ఈరోజు మీ ప్రధాన ఆరోగ్య సమస్య ఏమిటి?',
      sub: 'దయచేసి మీ మాటల్లో వివరించండి లేదా క్రింది వర్గాల నుండి ఎంచుకోండి.',
      tts: 'ఈరోజు మీ ప్రధాన ఆరోగ్య సమస్య ఏమిటో చెప్పండి.',
      placeholder: 'ఉదాహరణ: 1 గంట నుండి గుండెలో నొప్పి మరియు చెమటలు, లేదా తీవ్రమైన దగ్గు మరియు జ్వరం...',
      orChoosePreset: 'లేదా సాధారణ సమస్యను ఎంచుకోండి:',
    },

    stepDuration: {
      general: {
        title: 'ఈ సమస్య ఎప్పుడు ప్రారంభమైంది?',
        sub: 'మీరు ఎంత కాలం నుండి అనారోగ్యంగా ఉన్నారో తెలపండి.',
        tts: 'ఈ లక్షణాలు ఎప్పుడు ప్రారంభమయ్యాయి?',
      },
      fever: {
        title: 'జ్వరం ఎప్పటి నుండి వస్తోంది?',
        sub: 'ఎన్ని గంటలు లేదా రోజుల నుండి జ్వరం ఉందో తెలపండి.',
        tts: 'జ్వరం ఎప్పుడు ప్రారంభమైంది?',
      },
      respiratory: {
        title: 'దగ్గు లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది ఎప్పుడు ప్రారంభమైంది?',
        sub: 'శ్వాసకోశ సమస్య ఎప్పటి నుండి ఉందో ఎంచుకోండి.',
        tts: 'దగ్గు లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది ఎప్పుడు ప్రారంభమైంది?',
      },
      gastrointestinal: {
        title: 'కడుపు లేదా జీర్ణ సమస్య ఎప్పుడు ప్రారంభమైంది?',
        sub: 'కడుపులో అసౌకర్యం ఎంతకాలంగా ఉందో తెలపండి.',
        tts: 'కడుపు లేదా జీర్ణ సమస్య ఎప్పుడు ప్రారంభమైంది?',
      },
    },

    stepCharacter: {
      general: {
        title: 'మీకు ఎలా అనిపిస్తోంది?',
        sub: 'మీ అసౌకర్యానికి సరిపోయే వివరణను ఎంచుకోండి.',
        tts: 'మీకు నొప్పి లేదా అసౌకర్యం ఎలా అనిపిస్తోంది?',
      },
      fever: {
        title: 'జ్వరం ఎలా ఉంది? చలి లేదా వణుకు ఉందా?',
        sub: 'వణుకుతో కూడిన చలి ఉందా లేదా నిరంతర వేడి ఉందా?',
        tts: 'జ్వరం ఎలా అనిపిస్తోంది? వణుకు ఉందా?',
      },
      respiratory: {
        title: 'దగ్గు మరియు శ్వాస స్వభావం ఎలా ఉంది?',
        sub: 'పొడి దగ్గు, కఫంతో కూడినదా లేదా పిల్లికూతలు వస్తున్నాయా?',
        tts: 'దగ్గు స్వభావం ఎలా ఉంది?',
      },
      gastrointestinal: {
        title: 'కడుపులో ఎలాంటి బాధ ఉంది?',
        sub: 'మంట, పిసికినట్లు నొప్పి లేదా కడుపుబ్బరమా?',
        tts: 'కడుపులో అసౌకర్యం ఎలా అనిపిస్తోంది?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'నొప్పి ఎక్కడ ఉంది, అది ఎక్కడికైనా పాకుతుందా?',
        sub: 'నొప్పి ఉన్న ప్రదేశం మరియు అది ఇతర శరీర భాగాలకు వ్యాపిస్తుందో తెలపండి.',
        tts: 'నొప్పి ఎక్కడ ఉంది, అది ఇతర శరీర భాగాలకు వ్యాపిస్తుందా?',
      },
      fever: {
        title: 'జ్వరం ప్రభావం శరీరంలో ఎక్కడ ఎక్కువగా ఉంది?',
        sub: 'తలనొప్పి, ఒళ్లు నొప్పులు లేదా కీళ్ల నొప్పులు ఉన్నాయా?',
        tts: 'జ్వరం ప్రభావం శరీరంలో ఎక్కడ ఎక్కువగా ఉంది?',
      },
      respiratory: {
        title: 'ఛాతీలో బిగుతు లేదా గొంతులో ఇబ్బంది ఎక్కడ ఉంది?',
        sub: 'శ్వాస తీసుకోవడంలో ఇబ్బంది ఉన్న ప్రాంతాన్ని ఎంచుకోండి.',
        tts: 'ఛాతీలో బిగుతు ఎక్కడ అనిపిస్తోంది?',
      },
      gastrointestinal: {
        title: 'కడుపులో అసౌకర్యం ఏ భాగంలో ఉంది?',
        sub: 'పై కడుపులోనా, నాభి చుట్టూనా లేదా మొత్తం కడుపా?',
        tts: 'కడుపులో నొప్పి ఏ భాగంలో ఉంది?',
      },
    },

    stepSeverity: {
      title: 'నొప్పి తీవ్రత ఎంతవరకు ఉంది?',
      sub: '1 (తేలికపాటి) నుండి 10 (భరించలేనిది) స్కేలుపై ఎంచుకోండి.',
      tts: 'ఒకటి నుండి పది స్కేలుపై మీ నొప్పి తీవ్రత ఎంత?',
      mild: 'తేలికపాటి (1 - 3)',
      moderate: 'మధ్యస్థం (4 - 6)',
      severe: 'తీవ్రమైనది (7 - 10)',
    },

    stepAssociated: {
      title: 'వీటితో పాటు ఇతర లక్షణాలు ఏవైనా ఉన్నాయా?',
      sub: 'మీరు ప్రస్తుతం గమనిస్తున్న ఇతర లక్షణాలను ఎంచుకోండి.',
      tts: 'వీటితో పాటు ఇతర లక్షణాలు ఏవైనా ఉన్నాయా?',
      addCustom: 'ఇతర లక్షణాన్ని జోడించండి...',
    },

    stepAggravating: {
      title: 'దేనివల్ల మీ సమస్య పెరుగుతుంది?',
      sub: 'ఉదాహరణకు: నడవడం, తినడం, పడుకోవడం లేదా చల్లని గాలి వల్ల.',
      tts: 'దేనివల్ల మీ లక్షణాలు పెరుగుతాయి?',
      placeholder: 'ఉదాహరణ: మెట్లు ఎక్కడం వల్ల, కారం తిన్నప్పుడు, పడుకున్నప్పుడు...',
    },

    stepRelieving: {
      title: 'దేనివల్ల ఉపశమనం లేదా సులభంగా అనిపిస్తుంది?',
      sub: 'ఉదాహరణకు: విశ్రాంతి, గోరువెచ్చని నీరు, కూర్చోవడం, మందులు.',
      tts: 'దేనివల్ల మీకు ఉపశమనం లభిస్తుంది?',
      placeholder: 'ఉదాహరణ: పూర్తిగా విశ్రాంతి తీసుకోవడం, గోరువెచ్చని నీరు తాగడం...',
    },

    stepFollowUp: {
      title: 'డాక్టర్‌కు అవసరమైన కొన్ని ముఖ్యమైన ప్రశ్నలు',
      sub: 'ఈ సమాధానాలు మీ డాక్టర్ వెంటనే సరైన చికిత్స ప్రారంభించడానికి సహాయపడతాయి.',
      tts: 'డాక్టర్ గారి కోసం దయచేసి ఈ ప్రశ్నలకు సమాధానం ఇవ్వండి.',
    },

    presets: {
      chestTitle: 'ఛాతీ మరియు శ్వాస',
      chestDesc: 'ఛాతీ నొప్పి, బరువుగా ఉండటం, శ్వాస అందకపోవడం, గుండె దడ',
      giTitle: 'జీర్ణక్రియ మరియు కడుపు',
      giDesc: 'కడుపు నొప్పి, ఎసిడిటీ, గ్యాస్, వాంతులు, విరేచనాలు',
      feverTitle: 'జ్వరం మరియు ఇన్ఫెక్షన్',
      feverDesc: 'తీవ్రమైన జ్వరం, చలి, ఒళ్లు నొప్పులు, గొంతు నొప్పి, నీరసం',
      orthoTitle: 'కీళ్లు మరియు నడుము',
      orthoDesc: 'మోకాళ్ల నొప్పులు, నడుము నొప్పి, భుజాల బిగుతు, వాపు',
    },

    login: {
      portalTitle: 'రోగి పోర్టల్',
      portalSub: 'ఆభా మరియు ఓపీడీ సేవలు',
      phoneOrAbha: 'ఫోన్ నంబర్ లేదా ఆభా ఐడీ నమోదు చేయండి',
      continueBtn: 'కొనసాగించండి',
      registerBtn: 'నమోదు చేయండి',
      createRecord: 'కొత్త రోగి నమోదు',
      noRecordFound: 'పూర్వ రికార్డు కనుగొనబడలేదు. దయచేసి క్రింద వివరాలు నమోదు చేయండి.',
      loginDesc: 'ఓపీడీ టోకెన్, డిజిటల్ ప్రిస్క్రిప్షన్లు మరియు ఆరోగ్య రికార్డుల కోసం లాగిన్ అవ్వండి.',
      fullName: 'పూర్తి పేరు',
      age: 'వయస్సు',
      gender: 'లింగం',
      male: 'పురుషుడు',
      female: 'స్త్రీ',
      other: 'ఇతర',
    },

    summary: {
      completeTitle: 'ఓపీడీ నమోదు పూర్తయింది',
      completeSub: 'మీ లక్షణాలు మరియు వివరాలు వైద్యుడికి చేరవేయబడ్డాయి.',
      assignedStation: 'కేటాయించిన ఓపీడీ గది',
      openDashboard: 'రోగి డ్యాష్‌బోర్డ్ తెరవండి',
      fastTrack: 'త్వరిత సహాయం',
      standardCare: 'సాధారణ సంరక్షణ',
      careReview: 'సమీక్ష',
    },
  },

  mr: {
    listen: 'ऐका',
    speak: 'बोला',
    stopVoice: 'थांबवा',
    next: 'पुढे जा',
    back: 'मागे या',
    complete: 'सल्ला पूर्ण करा',
    submit: 'ओपीडी टोकन मिळवा',
    searchHospital: 'रुग्णालयाचे नाव किंवा शहर शोधा...',
    selectHospital: 'रुग्णालय निवडा',
    clear: 'साफ करा',
    changeLanguage: 'भाषा बदला',
    orSpeakBelow: 'किंवा खाली माईक दाबून थेट बोला',

    chiefComplaint: {
      title: 'आज तुम्हाला आरोग्याची मुख्य तक्रार काय आहे?',
      sub: 'कृपया स्वतःच्या शब्दांत सांगा किंवा खालील पर्यायांमधून निवडा.',
      tts: 'कृपया तुमचा मुख्य त्रास सांगा किंवा बोला.',
      placeholder: 'उदा: १ तासापासून छातीत दुखणे व घाम, किंवा तीव्र खोकला व ताप...',
      orChoosePreset: 'किंवा सामान्य समस्या निवडा:',
    },

    stepDuration: {
      general: {
        title: 'हा त्रास कधीपासून सुरू झाला आहे?',
        sub: 'तुम्हाला किती दिवसांपासून किंवा तासांपासून त्रास होत आहे ते सांगा.',
        tts: 'हा त्रास कधीपासून सुरू झाला आहे?',
      },
      fever: {
        title: 'ताप कधीपासून येत आहे?',
        sub: 'ताप किती तास किंवा दिवसांपासून आहे ते सांगा.',
        tts: 'ताप कधीपासून सुरू झाला आहे?',
      },
      respiratory: {
        title: 'खोकला किंवा दम लागणे कधी सुरू झाले?',
        sub: 'श्वसनाच्या त्रासाचा कालावधी सांगा.',
        tts: 'खोकला किंवा दम लागणे कधी सुरू झाले?',
      },
      gastrointestinal: {
        title: 'पोट किंवा पचनाचा त्रास कधीपासून सुरू झाला?',
        sub: 'हा त्रास किती काळापासून आहे ते सांगा.',
        tts: 'पोट किंवा पचनाचा त्रास कधीपासून सुरू झाला?',
      },
    },

    stepCharacter: {
      general: {
        title: 'त्रासाचे स्वरूप कसे आहे?',
        sub: 'तुमच्या त्रासाशी जुळणारा पर्याय निवडा.',
        tts: 'त्रासाचे स्वरूप कसे आहे?',
      },
      fever: {
        title: 'ताप कसा वाटत आहे? थंडी वाजून येत आहे का?',
        sub: 'थंडी वाजून हुडहुडी भरत आहे की सतत अंग गरम आहे?',
        tts: 'ताप कसा जाणवत आहे? थंडी वाजत आहे का?',
      },
      respiratory: {
        title: 'खोकल्याचे आणि श्वसनाचे स्वरूप कसे आहे?',
        sub: 'कोरडा खोकला, कफ पडत आहे की छातीत शिटीसारखा आवाज येत आहे?',
        tts: 'खोकल्याचे स्वरूप कसे आहे?',
      },
      gastrointestinal: {
        title: 'पोटात नक्की कसा त्रास होत आहे?',
        sub: 'जळजळ, मुरडा, जडपणा की पोट फुगले आहे?',
        tts: 'पोटात कसा त्रास जाणवत आहे?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'वेदना नेमकी कुठे आहे आणि ती इतरत्र पसरते का?',
        sub: 'दुखण्याचे ठिकाण आणि वेदना इतर भागात पसरते का ते सांगा.',
        tts: 'वेदना नेमकी कुठे आहे आणि ती शरीरात इतरत्र पसरते का?',
      },
      fever: {
        title: 'तापाचा परिणाम शरीराच्या कोणत्या भागात जास्त जाणवतो?',
        sub: 'डोकेदुखी, अंगदुखी किंवा सांधेदुखी आहे का?',
        tts: 'तापाचा परिणाम शरीराच्या कोणत्या भागात जास्त आहे?',
      },
      respiratory: {
        title: 'छातीत आवळल्यासारखे किंवा घशात कुठे त्रास होतो?',
        sub: 'दम लागण्याचा मुख्य भाग निवडा.',
        tts: 'छातीत नक्की कुठे त्रास जाणवत आहे?',
      },
      gastrointestinal: {
        title: 'पोटात त्रास कोणत्या भागात आहे?',
        sub: 'वरच्या पोटात, बेंबीजवळ की संपूर्ण पोटात?',
        tts: 'पोटात दुखणे कोणत्या भागात आहे?',
      },
    },

    stepSeverity: {
      title: 'त्रासाची तीव्रता किती आहे?',
      sub: '१ (कमी) ते १० (असह्य वेदना) या प्रमाणावर निवडा.',
      tts: '१ ते १० या प्रमाणावर त्रासाची तीव्रता किती आहे?',
      mild: 'कमी (१ - ३)',
      moderate: 'मध्यम (४ - ६)',
      severe: 'गंभीर (७ - १०)',
    },

    stepAssociated: {
      title: 'सोबत इतर काही लक्षणे आहेत का?',
      sub: 'जाणवणारी इतर लक्षणे निवडा.',
      tts: 'सोबत इतर काही लक्षणे आहेत का?',
      addCustom: 'इतर लक्षण जोडा...',
    },

    stepAggravating: {
      title: 'कोणत्या गोष्टीने त्रास वाढतो?',
      sub: 'उदा: चालल्याने, खाल्ल्यावर, झोपल्यावर, किंवा थंड हवेने.',
      tts: 'कोणत्या गोष्टीने त्रास वाढतो?',
      placeholder: 'उदा: पायऱ्या चढल्याने, तिखट खाल्ल्यावर, झोपल्यावर...',
    },

    stepRelieving: {
      title: 'कशाने आराम किंवा बरे वाटते?',
      sub: 'उदा: विश्रांतीने, गरम पाण्याने, बसल्यावर, औषधाने.',
      tts: 'कशाने आराम मिळतो?',
      placeholder: 'उदा: पूर्ण विश्रांती घेतल्याने, कोमट पाणी पिल्यावर...',
    },

    stepFollowUp: {
      title: 'डॉक्टरांसाठी काही संक्षिप्त प्रश्न',
      sub: 'या उत्तरांमुळे डॉक्टरांना अचूक उपचार पटकन सुरू करण्यास मदत होईल.',
      tts: 'डॉक्टरांच्या सल्ल्यासाठी कृपया या प्रश्नांची उत्तरे द्या.',
    },

    presets: {
      chestTitle: 'छाती आणि श्वसन',
      chestDesc: 'छातीत दुखणे, दाब, दम लागणे, धडधड वाढणे',
      giTitle: 'पचन आणि पोट',
      giDesc: 'पोटदुखी, गॅस, ॲसिडिटी, उलटी, जुलाब',
      feverTitle: 'ताप आणि संसर्ग',
      feverDesc: 'तीव्र ताप, थंडी, अंगदुखी, घसा दुखणे, अशक्तपणा',
      orthoTitle: 'सांधे आणि कंबर',
      orthoDesc: 'गुडघेदुखी, कंबरदुखी, खांदे आखडणे, सूज',
    },

    login: {
      portalTitle: 'रुग्ण पोर्टल',
      portalSub: 'आभा व ओपीडी सेवा',
      phoneOrAbha: 'फोन नंबर किंवा आभा आयडी टाका',
      continueBtn: 'पुढे जा',
      registerBtn: 'नोंदणी करा',
      createRecord: 'नवीन रुग्ण नोंदणी',
      noRecordFound: 'मागील नोंद आढळली नाही. कृपया खाली माहिती भरून नोंदणी करा.',
      loginDesc: 'ओपीडी टोकन, ई-प्रिस्क्रिप्शन आणि आरोग्य नोंदींसाठी लॉगिन करा.',
      fullName: 'पूर्ण नाव',
      age: 'वय',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'स्त्री',
      other: 'इतर',
    },

    summary: {
      completeTitle: 'नोंदणी यशस्वीरित्या पूर्ण झाली',
      completeSub: 'तुमची माहिती डॉक्टरांच्या ओपीडी कक्षाकडे पाठवण्यात आली आहे.',
      assignedStation: 'नेमून दिलेला ओपीडी कक्ष',
      openDashboard: 'रुग्ण डॅशबोर्ड उघडा',
      fastTrack: 'तात्काळ सेवा',
      standardCare: 'सामान्य तपासणी',
      careReview: 'तपासणी क्रम',
    },
  },

  ta: {
    listen: 'கேளுங்கள்',
    speak: 'பேசுங்கள்',
    stopVoice: 'நிறுத்து',
    next: 'அடுத்து',
    back: 'பின்னால்',
    complete: 'முடிந்தது',
    submit: 'ஓபிடி டோக்கன் பெறுக',
    searchHospital: 'மருத்துவமனை பெயர் அல்லது ஊரைத் தேடுங்கள்...',
    selectHospital: 'மருத்துவமனையைத் தேர்வுசெய்க',
    clear: 'அழி',
    changeLanguage: 'மொழியை மாற்றுக',
    orSpeakBelow: 'அல்லது கீழே மைக் அழுத்தி நேரடியாகப் பேசுங்கள்',

    chiefComplaint: {
      title: 'இன்று உங்கள் முதன்மையான உடல்நலக் குறைபாடு என்ன?',
      sub: 'தயவுசெய்து உங்கள் சொந்த வார்த்தைகளில் விவரிக்கவும் அல்லது கீழே தேர்வு செய்யவும்.',
      tts: 'இன்று உங்கள் முக்கிய பிரச்சனை என்ன என்பதை தயவுசெய்து சொல்லுங்கள்.',
      placeholder: 'எ.கா: 1 மணி நேரமாக நெஞ்சு வலி மற்றும் வியர்வை, அல்லது தீவிர இருமல் மற்றும் காய்ச்சல்...',
      orChoosePreset: 'அல்லது பொதுவான பிரச்சனையைத் தேர்ந்தெடுக்கவும்:',
    },

    stepDuration: {
      general: {
        title: 'இந்த பிரச்சனை எப்போது தொடங்கியது?',
        sub: 'எத்தனை நாட்களாக அல்லது மணிநேரமாக உடல்நிலை சரியில்லை எனக் குறிப்பிடவும்.',
        tts: 'இந்த அறிகுறிகள் எப்போது தொடங்கின?',
      },
      fever: {
        title: 'காய்ச்சல் எப்போது தொடங்கியது?',
        sub: 'எத்தனை மணிநேரம் அல்லது நாட்களாக காய்ச்சல் உள்ளது எனத் தெரிவிக்கவும்.',
        tts: 'காய்ச்சல் எப்போது தொடங்கியது?',
      },
      respiratory: {
        title: 'இருமல் அல்லது மூச்சுத் திணறல் எப்போது தொடங்கியது?',
        sub: 'மூச்சுப் பிரச்சனை தொடங்கிய காலத்தைக் குறிப்பிடவும்.',
        tts: 'இருமல் அல்லது மூச்சுத் திணறல் எப்போது தொடங்கியது?',
      },
      gastrointestinal: {
        title: 'வயிறு அல்லது செரிமானப் பிரச்சனை எப்போது தொடங்கியது?',
        sub: 'வயிற்று உபாதை எவ்வளவு காலமாக உள்ளது எனத் தெரிவிக்கவும்.',
        tts: 'வயிறு அல்லது செரிமானப் பிரச்சனை எப்போது தொடங்கியது?',
      },
    },

    stepCharacter: {
      general: {
        title: 'உங்களுக்கு வலி அல்லது உபாதை எவ்வாறு உணர்கிறது?',
        sub: 'உங்கள் நிலைக்கு மிகவும் பொருத்தமானதை தேர்வு செய்யவும்.',
        tts: 'உபாதை எவ்வாறு உணர்கிறது?',
      },
      fever: {
        title: 'காய்ச்சலின் தன்மை எப்படி உள்ளது? நடுக்கம் உள்ளதா?',
        sub: 'குளிருடன் கூடிய நடுக்கமா அல்லது தொடர்ச்சியான சூடா?',
        tts: 'காய்ச்சல் எப்படி இருக்கிறது? நடுக்கம் உள்ளதா?',
      },
      respiratory: {
        title: 'இருமல் மற்றும் சுவாசத்தின் தன்மை எப்படி உள்ளது?',
        sub: 'வறட்டு இருமலா, சளி வெளியேறுகிறதா அல்லது மூச்சிரைக்கிறதா?',
        tts: 'இருமல் அல்லது சளியின் தன்மை எப்படி உள்ளது?',
      },
      gastrointestinal: {
        title: 'வயிற்றில் என்ன வகையான அசௌகரியம் உள்ளது?',
        sub: 'எரிச்சல், பிடிப்பு, கனமான உணர்வு அல்லது உப்புசமா?',
        tts: 'வயிற்றில் என்ன மாதிரியான அசௌகரியம் உள்ளது?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'வலி எங்கே உள்ளது, அது உடலின் வேறு பகுதிக்கு பரவுகிறதா?',
        sub: 'வலி உள்ள இடம் மற்றும் அது பிற இடங்களுக்குப் பரவுகிறதா எனக் குறிப்பிடவும்.',
        tts: 'வலி எங்கே உள்ளது, அது உடலின் வேறு பகுதிக்கு பரவுகிறதா?',
      },
      fever: {
        title: 'காய்ச்சலின் தாக்கம் உடலில் எங்கு அதிகமாக உள்ளது?',
        sub: 'தலைவலி, உடல் வலி அல்லது மூட்டு வலிகள் உள்ளனவா?',
        tts: 'காய்ச்சலின் தாக்கம் உடலில் எங்கு அதிகமாக உள்ளது?',
      },
      respiratory: {
        title: 'மார்பு இறுக்கம் அல்லது தொண்டை அடைப்பு எங்கு உணரப்படுகிறது?',
        sub: 'மூச்சுத் திணறலின் முக்கியப் பகுதியைத் தேர்ந்தெடுக்கவும்.',
        tts: 'மார்பில் எங்கு இறுக்கம் உணரப்படுகிறது?',
      },
      gastrointestinal: {
        title: 'வயிற்றில் வலி எந்தப் பகுதியில் உள்ளது?',
        sub: 'மேல் வயிறா, தொப்புளைச் சுற்றியா அல்லது அடிவயிறா?',
        tts: 'வயிற்றில் வலி எந்தப் பகுதியில் உள்ளது?',
      },
    },

    stepSeverity: {
      title: 'வலியின் தீவிரம் எந்த அளவு உள்ளது?',
      sub: '1 (லேசானது) முதல் 10 (தாங்க முடியாதது) வரை அளவிடவும்.',
      tts: 'ஒன்று முதல் பத்து அளவில் உங்கள் வலி எவ்வளவு தீவிரமாக உள்ளது?',
      mild: 'லேசானது (1 - 3)',
      moderate: 'நடுத்தரமானது (4 - 6)',
      severe: 'தீவிரமானது (7 - 10)',
    },

    stepAssociated: {
      title: 'இதனுடன் வேறு ஏதேனும் அறிகுறிகள் உள்ளனவா?',
      sub: 'தற்போது நீங்கள் உணரும் பிற அறிகுறிகளைத் தேர்ந்தெடுக்கவும்.',
      tts: 'இதனுடன் வேறு ஏதேனும் அறிகுறிகள் உள்ளனவா?',
      addCustom: 'பிற அறிகுறிகளைச் சேர்க்கவும்...',
    },

    stepAggravating: {
      title: 'எந்த செயலால் உங்கள் பிரச்சனை அதிகமாகிறது?',
      sub: 'எடுத்துக்காட்டு: நடப்பது, சாப்பிடுவது, படுப்பது, அல்லது குளிர்ந்த காற்று.',
      tts: 'எதனால் உங்கள் பிரச்சனை அதிகமாகிறது?',
      placeholder: 'எ.கா: படிக்கட்டுகளில் ஏறுவது, காரமான உணவு உண்பது, படுப்பது...',
    },

    stepRelieving: {
      title: 'எதனால் உங்களுக்கு நிவாரணம் அல்லது அமைதி கிடைக்கிறது?',
      sub: 'எடுத்துக்காட்டு: ஓய்வு, வெந்நீர், அமர்வது, மருந்து.',
      tts: 'எதனால் உங்களுக்கு நிவாரணம் கிடைக்கிறது?',
      placeholder: 'எ.கா: முழு ஓய்வு எடுப்பது, வெதுவெதுப்பான நீர் அருந்துவது...',
    },

    stepFollowUp: {
      title: 'மருத்துவருக்கான சில முக்கியக் கேள்விகள்',
      sub: 'இந்த பதில்கள் உங்கள் மருத்துவருக்கு உடனடியாக சிகிச்சையளிக்க உதவும்.',
      tts: 'மருத்துவருக்காக தயவுசெய்து இந்த கேள்விகளுக்கு பதிலளிக்கவும்.',
    },

    presets: {
      chestTitle: 'மார்பு மற்றும் சுவாசம்',
      chestDesc: 'மார்பு வலி, அழுத்தம், மூச்சுத் திணறல், படபடப்பு',
      giTitle: 'செரிமானம் மற்றும் வயிறு',
      giDesc: 'வயிற்று வலி, நெஞ்செரிச்சல், வாயு, வாந்தி, பேதி',
      feverTitle: 'காய்ச்சல் மற்றும் தொற்று',
      feverDesc: 'அதிக காய்ச்சல், நடுக்கம், உடல் வலி, தொண்டை வலி, சோர்வு',
      orthoTitle: 'மூட்டுகள் மற்றும் முதுகு',
      orthoDesc: 'மூட்டு வலி, முதுகு வலி, தோள்பட்டை பிடிப்பு, வீக்கம்',
    },

    login: {
      portalTitle: 'நோயாளி போர்டல்',
      portalSub: 'ஆபா மற்றும் ஓபிடி சேவைகள்',
      phoneOrAbha: 'தொலைபேசி எண் அல்லது ஆபா ஐடி உள்ளிடவும்',
      continueBtn: 'தொடரவும்',
      registerBtn: 'பதிவு செய்யவும்',
      createRecord: 'புதிய நோயாளி பதிவு',
      noRecordFound: 'முந்தைய பதிவுகள் இல்லை. கீழே விபரங்களைப் பூர்த்தி செய்து பதிவு செய்யவும்.',
      loginDesc: 'ஓபிடி டோக்கன், டிஜிட்டல் மருந்துச் சீட்டு மற்றும் மருத்துவப் பதிவுகளுக்கு உள்நுழையவும்.',
      fullName: 'முழுப் பெயர்',
      age: 'வயது',
      gender: 'பாலினம்',
      male: 'ஆண்',
      female: 'பெண்',
      other: 'மற்றவை',
    },

    summary: {
      completeTitle: 'ஓபிடி பதிவு வெற்றிகரமாக முடிந்தது',
      completeSub: 'உங்கள் விபரங்கள் மருத்துவருக்கு அனுப்பப்பட்டுள்ளன.',
      assignedStation: 'ஒதுக்கப்பட்ட ஓபிடி அறை',
      openDashboard: 'நோயாளி டாஷ்போர்டைத் திறக்கவும்',
      fastTrack: 'முன்னுரிமை உதவி',
      standardCare: 'வழக்கமான பரிசோதனை',
      careReview: 'மதிப்பாய்வு',
    },
  },

  gu: {
    listen: 'સાંભળો',
    speak: 'બોલો',
    stopVoice: 'બંધ કરો',
    next: 'આગળ',
    back: 'પાછળ',
    complete: 'પરામર્શ પૂર્ણ કરો',
    submit: 'ઓપીડી ટોકન મેળવો',
    searchHospital: 'હોસ્પિટલનું નામ કે શહેર શોધો...',
    selectHospital: 'હોસ્પિટલ પસંદ કરો',
    clear: 'સાફ કરો',
    changeLanguage: 'ભાષા બદલો',
    orSpeakBelow: 'અથવા નીચે માઇક દબાવીને સીધું બોલો',

    chiefComplaint: {
      title: 'આજે તમને કઈ મુખ્ય શારીરિક તકલીફ છે?',
      sub: 'કૃપા કરીને તમારા શબ્દોમાં જણાવો અથવા નીચેના વિકલ્પોમાંથી પસંદ કરો.',
      tts: 'કૃપા કરીને તમારી મુખ્ય તકલીફ જણાવો અથવા બોલો.',
      placeholder: 'જેમ કે: ૧ કલાકથી છાતીમાં દુખાવો અને પરસેવો, અથવા તીવ્ર ઉધરસ અને તાવ...',
      orChoosePreset: 'અથવા સામાન્ય સમસ્યા પસંદ કરો:',
    },

    stepDuration: {
      general: {
        title: 'આ તકલીફ ક્યારથી શરૂ થઈ છે?',
        sub: 'તમે કેટલા સમયથી અસ્વસ્થ છો તે જણાવો.',
        tts: 'આ તકલીફ ક્યારથી શરૂ થઈ છે?',
      },
      fever: {
        title: 'તાવ ક્યારથી શરૂ થયો છે?',
        sub: 'કેટલા કલાક કે દિવસથી તાવ છે તે જણાવો.',
        tts: 'તાવ ક્યારથી શરૂ થયો છે?',
      },
      respiratory: {
        title: 'ઉધરસ કે શ્વાસની તકલીફ ક્યારથી શરૂ થઈ?',
        sub: 'શ્વાસ સંબંધિત તકલીફનો સમય જણાવો.',
        tts: 'ઉધરસ કે શ્વાસની તકલીફ ક્યારથી શરૂ થઈ?',
      },
      gastrointestinal: {
        title: 'પેટ કે પાચનની સમસ્યા ક્યારથી શરૂ થઈ?',
        sub: 'પેટમાં આ સમસ્યા કેટલા સમયથી છે તે જણાવો.',
        tts: 'પેટ કે પાચનની સમસ્યા ક્યારથી શરૂ થઈ?',
      },
    },

    stepCharacter: {
      general: {
        title: 'તકલીફનો અહેસાસ કેવો છે?',
        sub: 'તમારી તકલીફ સાથે જે સૌથી વધુ મેળ ખાતો હોય તે પસંદ કરો.',
        tts: 'તકલીફનો અહેસાસ કેવો છે?',
      },
      fever: {
        title: 'તાવ કેવો અનુભવાય છે? ધ્રુજારી આવે છે?',
        sub: 'ઠંડી લાગીને ધ્રુજારી આવે છે કે સતત શરીર ગરમ રહે છે?',
        tts: 'તાવ કેવો અનુભવાય છે? ધ્રુજારી આવે છે?',
      },
      respiratory: {
        title: 'ઉધરસ અને કફનું સ્વરૂપ કેવું છે?',
        sub: 'સૂકી ઉધરસ છે, કફ નીકળે છે કે શ્વાસમાં સીટી જેવો અવાજ આવે છે?',
        tts: 'ઉધરસનું સ્વરૂપ કેવું છે?',
      },
      gastrointestinal: {
        title: 'પેટમાં કેવા પ્રકારની તકલીફ થાય છે?',
        sub: 'બળતરા, ચૂંક, ભારેપણું કે ગેસ ચઢી ગયો છે?',
        tts: 'પેટમાં કેવા પ્રકારની તકલીફ થાય છે?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'દુખાવો ક્યાં છે અને તે ક્યાંય ફેલાય છે?',
        sub: 'દુખાવાની ચોક્કસ જગ્યા અને તે બીજા અંગોમાં ફેલાય છે કે નહીં તે જણાવો.',
        tts: 'દુખાવો ક્યાં છે અને તે ક્યાંય ફેલાય છે?',
      },
      fever: {
        title: 'તાવની અસર શરીરના કયા ભાગમાં વધુ છે?',
        sub: 'માથાનો દુખાવો, અંગનો દુખાવો કે સાંધાનો દુખાવો છે?',
        tts: 'તાવની અસર શરીરના કયા ભાગમાં વધુ છે?',
      },
      respiratory: {
        title: 'છાતીમાં ભીંસ કે ગળામાં ક્યાં તકલીફ જણાય છે?',
        sub: 'શ્વાસ લેવાની તકલીફની મુખ્ય જગ્યા પસંદ કરો.',
        tts: 'છાતીમાં ક્યાં તકલીફ જણાય છે?',
      },
      gastrointestinal: {
        title: 'પેટમાં કયા ભાગમાં તકલીફ છે?',
        sub: 'ઉપરના પેટમાં, ડૂંટી પાસે કે આખા પેટમાં?',
        tts: 'પેટમાં કયા ભાગમાં તકલીફ છે?',
      },
    },

    stepSeverity: {
      title: 'તકલીફની તીવ્રતા કેટલી વધારે છે?',
      sub: '૧ (હળવું) થી ૧૦ (અસહ્ય દુખાવો) ના સ્કેલ પર પસંદ કરો.',
      tts: 'એકથી દસના સ્કેલ પર તમારી તકલીફ કેટલી તીવ્ર છે?',
      mild: 'હળવું (૧ - ૩)',
      moderate: 'મધ્યમ (૪ - ૬)',
      severe: 'ગંભીર (૭ - ૧૦)',
    },

    stepAssociated: {
      title: 'સાથે કોઈ અન્ય લક્ષણો પણ છે?',
      sub: 'તમે હાલમાં અનુભવતા અન્ય લક્ષણો પસંદ કરો.',
      tts: 'સાથે કોઈ અન્ય લક્ષણો પણ છે?',
      addCustom: 'અન્ય લક્ષણ ઉમેરો...',
    },

    stepAggravating: {
      title: 'કઈ બાબતથી તકલીફ વધે છે?',
      sub: 'ઉદાહરણ તરીકે: ચાલવાથી, ખાવાથી, સૂવાથી, કે ઠંડી હવાથી.',
      tts: 'કઈ બાબતથી તકલીફ વધે છે?',
      placeholder: 'જેમ કે: પગથિયાં ચડવાથી, તીખું ખાવાથી, સૂઈ જવાથી...',
    },

    stepRelieving: {
      title: 'શેનાથી આરામ કે રાહત મળે છે?',
      sub: 'ઉદાહરણ તરીકે: આરામ કરવાથી, ગરમ પાણીથી, બેસવાથી, દવાથી.',
      tts: 'શેનાથી તમને રાહત મળે છે?',
      placeholder: 'જેમ કે: સંપૂર્ણ આરામ કરવાથી, નવશેકું પાણી પીવાથી...',
    },

    stepFollowUp: {
      title: 'ડૉક્ટર માટે કેટલાક સંક્ષિપ્ત પ્રશ્નો',
      sub: 'આ જવાબોથી તમારા ડૉક્ટરને તાત્કાલિક યોગ્ય સારવાર શરૂ કરવામાં મદદ મળશે.',
      tts: 'ડૉક્ટરની સલાહ માટે કૃપા કરીને આ પ્રશ્નોના જવાબ આપો.',
    },

    presets: {
      chestTitle: 'છાતી અને શ્વાસ',
      chestDesc: 'છાતીમાં દુખાવો, દબાણ, શ્વાસ ચઢવો, ધબકારા વધવા',
      giTitle: 'પાચન અને પેટ',
      giDesc: 'પેટનો દુખાવો, ગેસ, એસિડિટી, ઉલટી, ઝાડા',
      feverTitle: 'તાવ અને ચેપ',
      feverDesc: 'તીવ્ર તાવ, ધ્રુજારી, અંગનો દુખાવો, ગળામાં બળતરા, નબળાઈ',
      orthoTitle: 'સાંધા અને કમર',
      orthoDesc: 'ઘૂંટણનો દુખાવો, કમરનો દુખાવો, ખભા જકડાઈ જવા, સોજો',
    },

    login: {
      portalTitle: 'દર્દી પોર્ટલ',
      portalSub: 'આભા અને ઓપીડી સેવાઓ',
      phoneOrAbha: 'ફોન નંબર અથવા આભા આઈડી દાખલ કરો',
      continueBtn: 'આગળ વધો',
      registerBtn: 'નોંધણી કરો',
      createRecord: 'નવી નોંધણી',
      noRecordFound: 'કોઈ રેકોર્ડ મળ્યો નથી. કૃપા કરીને નીચે વિગતો ભરીને નોંધણી કરો.',
      loginDesc: 'ઓપીડી ટોકન, ઈ-પ્રિસ્ક્રિપ્શન અને આરોગ્ય રેકોર્ડ માટે લૉગિન કરો.',
      fullName: 'પૂરું નામ',
      age: 'ઉંમર',
      gender: 'જાતિ',
      male: 'પુરુષ',
      female: 'સ્ત્રી',
      other: 'અન્ય',
    },

    summary: {
      completeTitle: 'ઓપીડી નોંધણી સફળતાપૂર્વક પૂર્ણ થઈ',
      completeSub: 'તમારી વિગતો તબીબી અધિકારીને મોકલી દેવામાં આવી છે.',
      assignedStation: 'નિયુક્ત ઓપીડી રૂમ',
      openDashboard: 'દર્દી ડેશબોર્ડ ખોલો',
      fastTrack: 'ઝડપી સહાય',
      standardCare: 'સામાન્ય સારવાર',
      careReview: 'સમીક્ષા',
    },
  },

  kn: {
    listen: 'ಕೇಳಿ',
    speak: 'ಮಾತನಾಡಿ',
    stopVoice: 'ನಿಲ್ಲಿಸಿ',
    next: 'ಮುಂದೆ',
    back: 'ಹಿಂದೆ',
    complete: 'ಪೂರ್ಣಗೊಳಿಸಿ',
    submit: 'ಓಪಿಡಿ ಟೋಕನ್ ಪಡೆಯಿರಿ',
    searchHospital: 'ಆಸ್ಪತ್ರೆಯ ಹೆಸರು ಅಥವಾ ಊರನ್ನು ಹುಡುಕಿ...',
    selectHospital: 'ಆಸ್ಪತ್ರೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    clear: 'ಅಳಿಸಿ',
    changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    orSpeakBelow: 'ಅಥವಾ ಕೆಳಗೆ ಮೈಕ್ ಒತ್ತಿ ನೇರವಾಗಿ ಮಾತನಾಡಿ',

    chiefComplaint: {
      title: 'ಇಂದು ನಿಮ್ಮ ಪ್ರಮುಖ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಏನು?',
      sub: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ವರ್ಗಗಳಿಂದ ಆಯ್ಕೆಮಾಡಿ.',
      tts: 'ಇಂದು ನಿಮ್ಮ ಮುಖ್ಯ ಸಮಸ್ಯೆ ಏನು ಎಂಬುದನ್ನು ದಯವಿಟ್ಟು ಹೇಳಿ.',
      placeholder: 'ಉದಾ: 1 ಗಂಟೆಯಿಂದ ಎದೆ ನೋವು ಮತ್ತು ಬೆವರು, ಅಥವಾ ತೀವ್ರ ಕೆಮ್ಮು ಮತ್ತು ಜ್ವರ...',
      orChoosePreset: 'ಅಥವಾ ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    },

    stepDuration: {
      general: {
        title: 'ಈ ಸಮಸ್ಯೆ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?',
        sub: 'ನೀವು ಎಷ್ಟು ಸಮಯದಿಂದ ಅಸ್ವಸ್ಥರಾಗಿದ್ದೀರಿ ಎಂಬುದನ್ನು ತಿಳಿಸಿ.',
        tts: 'ಈ ಲಕ್ಷಣಗಳು ಯಾವಾಗ ಪ್ರಾರಂಭವಾದವು?',
      },
      fever: {
        title: 'ಜ್ವರ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?',
        sub: 'ಎಷ್ಟು ಗಂಟೆ ಅಥವಾ ದಿನಗಳಿಂದ ಜ್ವರ ಇದೆ ಎಂದು ತಿಳಿಸಿ.',
        tts: 'ಜ್ವರ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?',
      },
      respiratory: {
        title: 'ಕೆಮ್ಮು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಯಾವಾಗ ಶುರುವಾಯಿತು?',
        sub: 'ಉಸಿರಾಟದ ಸಮಸ್ಯೆಯ ಅವಧಿಯನ್ನು ತಿಳಿಸಿ.',
        tts: 'ಕೆಮ್ಮು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಯಾವಾಗ ಶುರುವಾಯಿತು?',
      },
      gastrointestinal: {
        title: 'ಹೊಟ್ಟೆ ಅಥವಾ ಜೀರ್ಣಕ್ರಿಯೆಯ ಸಮಸ್ಯೆ ಯಾವಾಗ ಶುರುವಾಯಿತು?',
        sub: 'ಹೊಟ್ಟೆಯ ತೊಂದರೆ ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ ಎಂದು ತಿಳಿಸಿ.',
        tts: 'ಹೊಟ್ಟೆ ಅಥವಾ ಜೀರ್ಣಕ್ರಿಯೆಯ ಸಮಸ್ಯೆ ಯಾವಾಗ ಶುರುವಾಯಿತು?',
      },
    },

    stepCharacter: {
      general: {
        title: 'ನಿಮಗೆ ನೋವು ಅಥವಾ ಅಸ್ವಸ್ಥತೆ ಹೇಗೆ ಅನ್ನಿಸುತ್ತಿದೆ?',
        sub: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಗೆ ಹೆಚ್ಚು ಸೂಕ್ತವಾದ ವಿವರಣೆಯನ್ನು ಆರಿಸಿ.',
        tts: 'ನಿಮಗೆ ತೊಂದರೆ ಹೇಗೆ ಅನ್ನಿಸುತ್ತಿದೆ?',
      },
      fever: {
        title: 'ಜ್ವರದ ತೀವ್ರತೆ ಹೇಗಿದೆ? ಚಳಿ ಅಥವಾ ನಡುಕ ಇದೆಯೇ?',
        sub: 'ಚಳಿಯೊಂದಿಗೆ ನಡುಕ ಇದೆಯೇ ಅಥವಾ ನಿರಂತರ ತಾಪಮಾನವಿದೆಯೇ?',
        tts: 'ಜ್ವರ ಹೇಗಿದೆ? ನಡುಕ ಇದೆಯೇ?',
      },
      respiratory: {
        title: 'ಕೆಮ್ಮು ಮತ್ತು ಉಸಿರಾಟದ ಲಕ್ಷಣ ಹೇಗಿದೆ?',
        sub: 'ಒಣ ಕೆಮ್ಮು, ಕಫ ಬರುತ್ತಿದೆಯೇ ಅಥವಾ ಉಸಿರಾಡುವಾಗ ಸಿಳ್ಳೆ ಶಬ್ದ ಬರುತ್ತಿದೆಯೇ?',
        tts: 'ಕೆಮ್ಮಿನ ಲಕ್ಷಣ ಹೇಗಿದೆ?',
      },
      gastrointestinal: {
        title: 'ಹೊಟ್ಟೆಯಲ್ಲಿ ಯಾವ ರೀತಿಯ ತೊಂದರೆ ಇದೆ?',
        sub: 'ಉರಿ, ಸೆಳೆತ, ಭಾರ ಅನ್ನಿಸುವುದು ಅಥವಾ ಹೊಟ್ಟೆ ಉಬ್ಬರವೇ?',
        tts: 'ಹೊಟ್ಟೆಯಲ್ಲಿ ಯಾವ ರೀತಿಯ ತೊಂದರೆ ಇದೆ?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'ನೋವು ಎಲ್ಲಿದೆ ಮತ್ತು ಅದು ಬೇರೆ ಭಾಗಗಳಿಗೆ ಹರಡುತ್ತದೆಯೇ?',
        sub: 'ನೋವಿರುವ ಸ್ಥಳ ಮತ್ತು ಅದು ಇತರ ಭಾಗಗಳಿಗೆ ಹರಡುತ್ತಿದೆಯೇ ಎಂದು ತಿಳಿಸಿ.',
        tts: 'ನೋವು ಎಲ್ಲಿದೆ ಮತ್ತು ಅದು ಬೇರೆ ಭಾಗಗಳಿಗೆ ಹರಡುತ್ತದೆಯೇ?',
      },
      fever: {
        title: 'ಜ್ವರದ ಪರಿಣಾಮ ದೇಹದ ಯಾವ ಭಾಗದಲ್ಲಿ ಹೆಚ್ಚಾಗಿದೆ?',
        sub: 'ತಲೆನೋವು, ಮೈಕೈ ನೋವು ಅಥವಾ ಕೀಲು ನೋವುಗಳಿವೆಯೇ?',
        tts: 'ಜ್ವರದ ಪರಿಣಾಮ ದೇಹದ ಯಾವ ಭಾಗದಲ್ಲಿ ಹೆಚ್ಚಾಗಿದೆ?',
      },
      respiratory: {
        title: 'ಎದೆಯಲ್ಲಿ ಬಿಗಿತ ಅಥವಾ ಗಂಟಲಿನಲ್ಲಿ ತೊಂದರೆ ಎಲ್ಲಿ ಅನ್ನಿಸುತ್ತಿದೆ?',
        sub: 'ಉಸಿರಾಟದ ತೊಂದರೆಯ ಮುಖ್ಯ ಜಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        tts: 'ಎದೆಯಲ್ಲಿ ಬಿಗಿತ ಎಲ್ಲಿ ಅನ್ನಿಸುತ್ತಿದೆ?',
      },
      gastrointestinal: {
        title: 'ಹೊಟ್ಟೆಯಲ್ಲಿ ನೋವು ಯಾವ ಭಾಗದಲ್ಲಿದೆ?',
        sub: 'ಮೇಲ್ಭಾಗದ ಹೊಟ್ಟೆಯಲ್ಲೋ, ಹೊಕ್ಕಳ ಬಳಿಯೋ ಅಥವಾ ಇಡೀ ಹೊಟ್ಟೆಯಲ್ಲೋ?',
        tts: 'ಹೊಟ್ಟೆಯಲ್ಲಿ ನೋವು ಯಾವ ಭಾಗದಲ್ಲಿದೆ?',
      },
    },

    stepSeverity: {
      title: 'ನೋವಿನ ತೀವ್ರತೆ ಎಷ್ಟು ಹೆಚ್ಚಾಗಿದೆ?',
      sub: '1 (ಸ್ವಲ್ಪ) ದಿಂದ 10 (ತಡೆಯಲಾಗದಷ್ಟು) ರ ವರೆಗೆ ಆರಿಸಿ.',
      tts: 'ಒಂದರಿಂದ ಹತ್ತರ ಪ್ರಮಾಣದಲ್ಲಿ ನಿಮ್ಮ ನೋವಿನ ತೀವ್ರತೆ ಎಷ್ಟಿದೆ?',
      mild: 'ಸ್ವಲ್ಪ (1 - 3)',
      moderate: 'ಮಧ್ಯಮ (4 - 6)',
      severe: 'ತೀವ್ರ (7 - 10)',
    },

    stepAssociated: {
      title: 'ಇದರೊಂದಿಗೆ ಬೇರೆ ಯಾವುದೇ ಲಕ್ಷಣಗಳಿವೆಯೇ?',
      sub: 'ನೀವು ಪ್ರಸ್ತುತ ಗಮನಿಸುತ್ತಿರುವ ಇತರ ಲಕ್ಷಣಗಳನ್ನು ಆರಿಸಿ.',
      tts: 'ಇದರೊಂದಿಗೆ ಬೇರೆ ಯಾವುದೇ ಲಕ್ಷಣಗಳಿವೆಯೇ?',
      addCustom: 'ಬೇರೆ ಲಕ್ಷಣವನ್ನು ಸೇರಿಸಿ...',
    },

    stepAggravating: {
      title: 'ಯಾವ ಕಾರಣದಿಂದ ತೊಂದರೆ ಹೆಚ್ಚಾಗುತ್ತದೆ?',
      sub: 'ಉದಾಹರಣೆಗೆ: ನಡೆಯುವುದರಿಂದ, ಊಟ ಮಾಡಿದಾಗ, ಮಲಗಿದಾಗ, ಅಥವಾ ತಣ್ಣನೆಯ ಗಾಳಿಯಿಂದ.',
      tts: 'ಯಾವ ಕಾರಣದಿಂದ ತೊಂದರೆ ಹೆಚ್ಚಾಗುತ್ತದೆ?',
      placeholder: 'ಉದಾ: ಮೆಟ್ಟಿಲು ಹತ್ತಿದಾಗ, ಖಾರ ತಿಂದಾಗ, ಮಲಗಿದಾಗ...',
    },

    stepRelieving: {
      title: 'ಯಾವುದರಿಂದ ಆರಾಮ ಅಥವಾ ಶಮನ ಸಿಗುತ್ತದೆ?',
      sub: 'ಉದಾಹರಣೆಗೆ: ವಿಶ್ರಾಂತಿ, ಬಿಸಿ ನೀರು, ಕುಳಿತುಕೊಳ್ಳುವುದು, ಔಷಧ.',
      tts: 'ಯಾವುದರಿಂದ ಆರಾಮ ಸಿಗುತ್ತದೆ?',
      placeholder: 'ಉದಾ: ಪೂರ್ಣ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳುವುದರಿಂದ, ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯುವುದರಿಂದ...',
    },

    stepFollowUp: {
      title: 'ವೈದ್ಯರಿಗಾಗಿ ಕೆಲವು ಸಂಕ್ಷಿಪ್ತ ಪ್ರಶ್ನೆಗಳು',
      sub: 'ಈ ಉತ್ತರಗಳು ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ತ್ವರಿತವಾಗಿ ಚಿಕಿತ್ಸೆ ನೀಡಲು ನೆರವಾಗುತ್ತವೆ.',
      tts: 'ವೈದ್ಯರಿಗಾಗಿ ದಯವಿಟ್ಟು ಈ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.',
    },

    presets: {
      chestTitle: 'ಎದೆ ಮತ್ತು ಉಸಿರಾಟ',
      chestDesc: 'ಎದೆ ನೋವು, ಒತ್ತಡ, ಉಸಿರಾಟದ ತೊಂದರೆ, ಎದೆಬಡಿತ ಹೆಚ್ಚಳ',
      giTitle: 'ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಹೊಟ್ಟೆ',
      giDesc: 'ಹೊಟ್ಟೆ ನೋವು, ಗ್ಯಾಸ್, ಅಸಿಡಿಟಿ, ವಾಂತಿ, ಬೇಧಿ',
      feverTitle: 'ಜ್ವರ ಮತ್ತು ಸೋಂಕು',
      feverDesc: 'ತೀವ್ರ ಜ್ವರ, ಚಳಿ, ಮೈಕೈ ನೋವು, ಗಂಟಲು ನೋವು, ನಿಶ್ಯಕ್ತಿ',
      orthoTitle: 'ಕೀಲುಗಳು ಮತ್ತು ಬೆನ್ನು',
      orthoDesc: 'ಮೊಣಕಾಲು ನೋವು, ಬೆನ್ನು ನೋವು, ಭುಜದ ಸೆಳೆತ, ಊತ',
    },

    login: {
      portalTitle: 'ರೋಗಿ ಪೋರ್ಟಲ್',
      portalSub: 'ಆಭಾ ಮತ್ತು ಓಪಿಡಿ ಸೇವೆಗಳು',
      phoneOrAbha: 'ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ಆಭಾ ಐಡಿ ನಮೂದಿಸಿ',
      continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
      registerBtn: 'ನೋಂದಾಯಿಸಿ',
      createRecord: 'ಹೊಸ ರೋಗಿ ನೋಂದಣಿ',
      noRecordFound: 'ಹಿಂದಿನ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ನೋಂದಾಯಿಸಿ.',
      loginDesc: 'ಓಪಿಡಿ ಟೋಕನ್, ಡಿಜಿಟಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಆರೋಗ್ಯ ದಾಖಲೆಗಳಿಗಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ.',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      age: 'ವಯಸ್ಸು',
      gender: 'ಲಿಂಗ',
      male: 'ಪುರುಷ',
      female: 'ಮಹಿಳೆ',
      other: 'ಇತರ',
    },

    summary: {
      completeTitle: 'ಓಪಿಡಿ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
      completeSub: 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳ ವಿವರವನ್ನು ವೈದ್ಯರಿಗೆ ರವಾನಿಸಲಾಗಿದೆ.',
      assignedStation: 'ನಿಗದಿಪಡಿಸಿದ ಓಪಿಡಿ ಕೊಠಡಿ',
      openDashboard: 'ರೋಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
      fastTrack: 'ತುರ್ತು ನೆರವು',
      standardCare: 'ಸಾಮಾನ್ಯ ತಪಾಸಣೆ',
      careReview: 'ಪರಿಶೀಲನೆ',
    },
  },

  ml: {
    listen: 'കേൾക്കുക',
    speak: 'സംസാരിക്കുക',
    stopVoice: 'നിർത്തുക',
    next: 'അടുത്തത്',
    back: 'പിന്നോട്ട്',
    complete: 'പൂർത്തിയാക്കുക',
    submit: 'ഒപിഡി ടോക്കൺ എടുക്കുക',
    searchHospital: 'ആശുപത്രിയുടെ പേര് അല്ലെങ്കിൽ നഗരം തിരയുക...',
    selectHospital: 'ആശുപത്രി തിരഞ്ഞെടുക്കുക',
    clear: 'മായ്ക്കുക',
    changeLanguage: 'ഭാഷ മാറ്റുക',
    orSpeakBelow: 'അല്ലെങ്കിൽ താഴെയുള്ള മൈക്കിൽ നേരിട്ട് സംസാരിക്കുക',

    chiefComplaint: {
      title: 'ഇന്ന് താങ്കളുടെ പ്രധാന ആരോഗ്യപ്രശ്നം എന്താണ്?',
      sub: 'ദയവായി സ്വന്തം വാക്കുകളിൽ വിവരിക്കുക അല്ലെങ്കിൽ താഴെനിന്ന് തിരഞ്ഞെടുക്കുക.',
      tts: 'ഇന്ന് നിങ്ങളുടെ പ്രധാന ബുദ്ധിമുട്ട് എന്താണെന്ന് പറയുക.',
      placeholder: 'ഉദാ: 1 മണിക്കൂറായി നെഞ്ചുവേദനയും വിയർപ്പും, അല്ലെങ്കിൽ കടുത്ത ചുമയും പനിയും...',
      orChoosePreset: 'അല്ലെങ്കിൽ പൊതുവായ ബുദ്ധിമുട്ട് തിരഞ്ഞെടുക്കുക:',
    },

    stepDuration: {
      general: {
        title: 'ഈ ബുദ്ധിമുട്ട് എപ്പോഴാണ് തുടങ്ങിയത്?',
        sub: 'എത്ര ദിവസമായി അല്ലെങ്കിൽ മണിക്കൂറായി അസുഖം അനുഭവപ്പെടുന്നു എന്ന് വ്യക്തമാക്കുക.',
        tts: 'ഈ ലക്ഷണങ്ങൾ എപ്പോഴാണ് തുടങ്ങിയത്?',
      },
      fever: {
        title: 'പനി എപ്പോഴാണ് തുടങ്ങിയത്?',
        sub: 'എത്ര മണിക്കൂറോ ദിവസങ്ങളോ ആയി പനിയുണ്ടെന്ന് പറയുക.',
        tts: 'പനി എപ്പോഴാണ് തുടങ്ങിയത്?',
      },
      respiratory: {
        title: 'ചുമയോ ശ്വാസംമുട്ടലോ തുടങ്ങിയത് എപ്പോഴാണ്?',
        sub: 'ശ്വാസതടസ്സത്തിന്റെ കാലയളവ് രേഖപ്പെടുത്തുക.',
        tts: 'ചുമയോ ശ്വാസംമുട്ടലോ തുടങ്ങിയത് എപ്പോഴാണ്?',
      },
      gastrointestinal: {
        title: 'വയറിളക്കമോ ദഹനപ്രശ്നമോ തുടങ്ങിയത് എപ്പോഴാണ്?',
        sub: 'ഈ അസ്വസ്ഥത എത്ര കാലമായി ഉണ്ടെന്ന് പറയുക.',
        tts: 'വയറിളക്കമോ ദഹനപ്രശ്നമോ തുടങ്ങിയത് എപ്പോഴാണ്?',
      },
    },

    stepCharacter: {
      general: {
        title: 'വേദന അല്ലെങ്കിൽ അസ്വസ്ഥത എങ്ങനെ അനുഭവപ്പെടുന്നു?',
        sub: 'നിങ്ങളുടെ അവസ്ഥയ്ക്ക് ഏറ്റവും അനുയോജ്യമായ വിവരണം തിരഞ്ഞെടുക്കുക.',
        tts: 'ബുദ്ധിമുട്ട് എങ്ങനെ അനുഭവപ്പെടുന്നു?',
      },
      fever: {
        title: 'പനി എങ്ങനെ അനുഭവപ്പെടുന്നു? വിറയലുണ്ടോ?',
        sub: 'വിറയലോടെയുള്ള തണുപ്പാണോ അതോ തുടർച്ചയായ ചൂടാണോ?',
        tts: 'പനി എങ്ങനെ അനുഭവപ്പെടുന്നു? വിറയലുണ്ടോ?',
      },
      respiratory: {
        title: 'ചുമയും ശ്വാസോച്ഛ്വാസവും എങ്ങനെയാണ്?',
        sub: 'വരണ്ട ചുമയോ, കഫത്തോടെയുള്ളതോ, അതോ ശ്വാസമെടുക്കുമ്പോൾ ചൂളംവിളി ശബ്ദമോ?',
        tts: 'ചുമയുടെ സ്വഭാവം എങ്ങനെയാണ്?',
      },
      gastrointestinal: {
        title: 'വയറ്റിൽ എങ്ങനെയുള്ള അസ്വസ്ഥതയാണ്?',
        sub: 'എരിച്ചിൽ, കൊളുത്തിപ്പിടുത്തം, കനംതോന്നൽ അതോ ഗ്യാസ് കയറിയതോ?',
        tts: 'വയറ്റിൽ എങ്ങനെയുള്ള അസ്വസ്ഥതയാണ്?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'വേദന എവിടെയാണ്, അത് മറ്റ് ഭാഗങ്ങളിലേക്ക് വ്യാപിക്കുന്നുണ്ടോ?',
        sub: 'വേദനയുള്ള സ്ഥലവും അത് പടരുന്നുണ്ടോ എന്നും സൂചിപ്പിക്കുക.',
        tts: 'വേദന എവിടെയാണ്, അത് മറ്റ് ഭാഗങ്ങളിലേക്ക് വ്യാപിക്കുന്നുണ്ടോ?',
      },
      fever: {
        title: 'പനിയുടെ കാഠിന്യം ശരീരത്തിന്റെ ഏത് ഭാഗത്താണ് കൂടുതൽ?',
        sub: 'തലവേദനയോ, ശരീരവേദനയോ, സന്ധിവേദനയോ ഉണ്ടോ?',
        tts: 'പനിയുടെ കാഠിന്യം ശരീരത്തിന്റെ ഏത് ഭാഗത്താണ് കൂടുതൽ?',
      },
      respiratory: {
        title: 'നെഞ്ചിൽ ഭാരമോ തൊണ്ടയിൽ തടസ്സമോ എവിടെയാണ് അനുഭവപ്പെടുന്നത്?',
        sub: 'ശ്വാസതടസ്സമുള്ള പ്രധാന ഭാഗം തിരഞ്ഞെടുക്കുക.',
        tts: 'നെഞ്ചിൽ ഭാരം എവിടെയാണ് അനുഭവപ്പെടുന്നത്?',
      },
      gastrointestinal: {
        title: 'വയറ്റിൽ ഏത് ഭാഗത്താണ് അസ്വസ്ഥത?',
        sub: 'മേൽവയറ്റിലോ, പൊക്കിളിന് ചുറ്റുമോ, അതോ മുഴുവൻ വയറിലോ?',
        tts: 'വയറ്റിൽ ഏത് ഭാഗത്താണ് അസ്വസ്ഥത?',
      },
    },

    stepSeverity: {
      title: 'വേദനയുടെ തീവ്രത എത്രത്തോളമുണ്ട്?',
      sub: '1 (നേരിയത്) മുതൽ 10 (സഹിക്കാനാവാത്തത്) വരെയുള്ള അളവിൽ തിരഞ്ഞെടുക്കുക.',
      tts: 'ഒന്ന് മുതൽ പത്ത് വരെയുള്ള അളവിൽ വേദന എത്രത്തോളമുണ്ട്?',
      mild: 'നേരിയത് (1 - 3)',
      moderate: 'ഇടത്തരം (4 - 6)',
      severe: 'ഗുരുതരം (7 - 10)',
    },

    stepAssociated: {
      title: 'ഇതോടൊപ്പം മറ്റ് ലക്ഷണങ്ങൾ വല്ലതും ഉണ്ടോ?',
      sub: 'നിങ്ങൾ അനുഭവിക്കുന്ന മറ്റ് ലക്ഷണങ്ങൾ തിരഞ്ഞെടുക്കുക.',
      tts: 'ഇതോടൊപ്പം മറ്റ് ലക്ഷണങ്ങൾ വല്ലതും ഉണ്ടോ?',
      addCustom: 'മറ്റൊരു ലക്ഷണം ചേർക്കുക...',
    },

    stepAggravating: {
      title: 'എന്ത് ചെയ്യുമ്പോഴാണ് ബുദ്ധിമുട്ട് കൂടുന്നത്?',
      sub: 'ഉദാഹരണത്തിന്: നടക്കുമ്പോൾ, ഭക്ഷണം കഴിക്കുമ്പോൾ, കിടക്കുമ്പോൾ, തണുത്ത കാറ്റടിക്കുമ്പോൾ.',
      tts: 'എന്ത് ചെയ്യുമ്പോഴാണ് ബുദ്ധിമുട്ട് കൂടുന്നത്?',
      placeholder: 'ഉദാ: പടികൾ കയറുമ്പോൾ, എരിവുള്ള ഭക്ഷണം കഴിക്കുമ്പോൾ, കിടക്കുമ്പോൾ...',
    },

    stepRelieving: {
      title: 'എന്താണ് നിങ്ങൾക്ക് ആശ്വാസം തരുന്നത്?',
      sub: 'ഉദാഹരണത്തിന്: വിശ്രമം, ചൂടുവെള്ളം, ഇരിക്കുമ്പോൾ, മരുന്ന്.',
      tts: 'എന്താണ് നിങ്ങൾക്ക് ആശ്വാസം തരുന്നത്?',
      placeholder: 'ഉദാ: പൂർണ്ണ വിശ്രമം, ചെറുചൂടുവെള്ളം കുടിക്കുന്നത്...',
    },

    stepFollowUp: {
      title: 'ഡോക്ടർക്കുള്ള ചില പ്രധാന ചോദ്യങ്ങൾ',
      sub: 'ഈ ഉത്തരങ്ങൾ നിങ്ങളുടെ ഡോക്ടർക്ക് കൃത്യമായ ചികിത്സ വേഗത്തിൽ നൽകാൻ സഹായിക്കും.',
      tts: 'ഡോക്ടർക്കായി ദയവായി ഈ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക.',
    },

    presets: {
      chestTitle: 'നെഞ്ചും ശ്വാസകോശവും',
      chestDesc: 'നെഞ്ചുവേദന, ഭാരം, ശ്വാസംമുട്ടൽ, നെഞ്ചിടിപ്പ് കൂടൽ',
      giTitle: 'ദഹനവും വയറും',
      giDesc: 'വയറുവേദന, ഗ്യാസ്, അസിഡിറ്റി, ഛർദ്ദി, വയറിളക്കം',
      feverTitle: 'പനിയും അണുബാധയും',
      feverDesc: 'കടുത്ത പനി, വിറയൽ, ശരീരവേദന, തൊണ്ടവേദന, ക്ഷീണം',
      orthoTitle: 'സന്ധികളും നടുവും',
      orthoDesc: 'മുട്ടുവേദന, നടുവേദന, തോൾ വേദന, വീക്കം',
    },

    login: {
      portalTitle: 'രോഗി പോർട്ടൽ',
      portalSub: 'ആഭയും ഒപിഡി സേവനങ്ങളും',
      phoneOrAbha: 'ഫോൺ നമ്പർ അല്ലെങ്കിൽ ആഭ ഐഡി നൽകുക',
      continueBtn: 'തുടരുക',
      registerBtn: 'രജിസ്റ്റർ ചെയ്യുക',
      createRecord: 'പുതിയ രജിസ്ട്രേഷൻ',
      noRecordFound: 'മുൻകാല വിവരങ്ങൾ ലഭ്യമല്ല. ദയവായി താഴെ വിവരങ്ങൾ നൽകി രജിസ്റ്റർ ചെയ്യുക.',
      loginDesc: 'ഒപിഡി ടോക്കൺ, ഡിജിറ്റൽ കുറിപ്പടി, മെഡിക്കൽ രേഖകൾ എന്നിവയ്ക്കായി ലോഗിൻ ചെയ്യുക.',
      fullName: 'പൂർണ്ണ പേര്',
      age: 'പ്രായം',
      gender: 'ലിംഗഭേദം',
      male: 'പുരുഷൻ',
      female: 'സ്ത്രീ',
      other: 'മറ്റുള്ളവ',
    },

    summary: {
      completeTitle: 'ഒപിഡി രജിസ്ട്രേഷൻ പൂർത്തിയായി',
      completeSub: 'നിങ്ങളുടെ വിവരങ്ങൾ ഡോക്ടർക്ക് കൈമാറി.',
      assignedStation: 'നിയുക്ത ഒപിഡി മുറി',
      openDashboard: 'രോഗി ഡാഷ്‌ബോർഡ് തുറക്കുക',
      fastTrack: 'മുൻഗണനാ സഹായം',
      standardCare: 'സാധാരണ പരിശോധന',
      careReview: 'പരിശോധനാ ക്രമം',
    },
  },

  pa: {
    listen: 'ਸੁਣੋ',
    speak: 'ਬੋਲੋ',
    stopVoice: 'ਰੋਕੋ',
    next: 'ਅੱਗੇ ਵਧੋ',
    back: 'ਪਿੱਛੇ ਜਾਓ',
    complete: 'ਸਲਾਹ ਪੂਰੀ ਕਰੋ',
    submit: 'ਓਪੀਡੀ ਟੋਕਨ ਲਵੋ',
    searchHospital: 'ਹਸਪਤਾਲ ਦਾ ਨਾਮ ਜਾਂ ਸ਼ਹਿਰ ਲੱਭੋ...',
    selectHospital: 'ਹਸਪਤਾਲ ਚੁਣੋ',
    clear: 'ਸਾਫ਼ ਕਰੋ',
    changeLanguage: 'ਭਾਸ਼ਾ ਬਦਲੋ',
    orSpeakBelow: 'ਜਾਂ ਹੇਠਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਸਿੱਧਾ ਬੋਲੋ',

    chiefComplaint: {
      title: 'ਅੱਜ ਤੁਹਾਨੂੰ ਸਿਹਤ ਸੰਬੰਧੀ ਮੁੱਖ ਤਕਲੀਫ਼ ਕੀ ਹੈ?',
      sub: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਦੱਸੋ ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚੋਂ ਚੁਣੋ।',
      tts: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਮੁੱਖ ਤਕਲੀਫ਼ ਦੱਸੋ ਜਾਂ ਬੋਲੋ।',
      placeholder: 'ਜਿਵੇਂ: 1 ਘੰਟੇ ਤੋਂ ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਅਤੇ ਪਸੀਨਾ, ਜਾਂ ਤੇਜ਼ ਖੰਘ ਅਤੇ ਬੁਖਾਰ...',
      orChoosePreset: 'ਜਾਂ ਆਮ ਸਮੱਸਿਆ ਚੁਣੋ:',
    },

    stepDuration: {
      general: {
        title: 'ਇਹ ਤਕਲੀਫ਼ ਕਦੋਂ ਤੋਂ ਸ਼ੁਰੂ ਹੋਈ ਹੈ?',
        sub: 'ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕਿੰਨੇ ਸਮੇਂ ਤੋਂ ਬਿਮਾਰ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ।',
        tts: 'ਇਹ ਤਕਲੀਫ਼ ਕਦੋਂ ਤੋਂ ਸ਼ੁਰੂ ਹੋਈ ਹੈ?',
      },
      fever: {
        title: 'ਬੁਖਾਰ ਕਦੋਂ ਤੋਂ ਚੜ੍ਹਿਆ ਹੈ?',
        sub: 'ਦੱਸੋ ਕਿ ਤੁਹਾਨੂੰ ਕਿੰਨੇ ਘੰਟਿਆਂ ਜਾਂ ਦਿਨਾਂ ਤੋਂ ਬੁਖਾਰ ਹੈ।',
        tts: 'ਬੁਖਾਰ ਕਦੋਂ ਤੋਂ ਸ਼ੁਰੂ ਹੋਇਆ ਹੈ?',
      },
      respiratory: {
        title: 'ਖੰਘ ਜਾਂ ਸਾਹ ਦੀ ਤਕਲੀਫ਼ ਕਦੋਂ ਤੋਂ ਹੈ?',
        sub: 'ਸਾਹ ਦੀ ਸਮੱਸਿਆ ਦਾ ਸਮਾਂ ਦੱਸੋ।',
        tts: 'ਖੰਘ ਜਾਂ ਸਾਹ ਦੀ ਤਕਲੀਫ਼ ਕਦੋਂ ਤੋਂ ਸ਼ੁਰੂ ਹੋਈ?',
      },
      gastrointestinal: {
        title: 'ਪੇਟ ਜਾਂ ਹਾਜ਼ਮੇ ਦੀ ਤਕਲੀਫ਼ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਈ?',
        sub: 'ਦੱਸੋ ਕਿ ਪੇਟ ਵਿੱਚ ਇਹ ਸਮੱਸਿਆ ਕਿੰਨੇ ਚਿਰ ਤੋਂ ਹੈ।',
        tts: 'ਪੇਟ ਜਾਂ ਹਾਜ਼ਮੇ ਦੀ ਤਕਲੀਫ਼ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਈ?',
      },
    },

    stepCharacter: {
      general: {
        title: 'ਦਰਦ ਜਾਂ ਤਕਲੀਫ਼ ਦਾ ਅਹਿਸਾਸ ਕਿਹੋ ਜਿਹਾ ਹੈ?',
        sub: 'ਜੋ ਤੁਹਾਡੀ ਸਮੱਸਿਆ ਨਾਲ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ, ਉਸਨੂੰ ਚੁਣੋ।',
        tts: 'ਤਕਲੀਫ਼ ਕਿਹੋ ਜਿਹੀ ਮਹਿਸੂਸ ਹੁੰਦੀ ਹੈ?',
      },
      fever: {
        title: 'ਬੁਖਾਰ ਕਿਵੇਂ ਮਹਿਸੂਸ ਹੋ ਰਿਹਾ ਹੈ? ਕੀ ਕੰਬਣੀ ਛਿੜਦੀ ਹੈ?',
        sub: 'ਕੀ ਠੰਢ ਲੱਗ ਕੇ ਕੰਬਣੀ ਛਿੜਦੀ ਹੈ ਜਾਂ ਲਗਾਤਾਰ ਤੇਜ਼ ਤਪਸ਼ ਰਹਿੰਦੀ ਹੈ?',
        tts: 'ਬੁਖਾਰ ਕਿਹੋ ਜਿਹਾ ਹੈ? ਕੀ ਕੰਬਣੀ ਛਿੜਦੀ ਹੈ?',
      },
      respiratory: {
        title: 'ਖੰਘ ਅਤੇ ਬਲਗਮ ਦਾ ਸਰੂਪ ਕਿਹੋ ਜਿਹਾ ਹੈ?',
        sub: 'ਸੁੱਕੀ ਖੰਘ ਹੈ, ਬਲਗਮ ਆਉਂਦੀ ਹੈ ਜਾਂ ਸਾਹ ਵਿੱਚ ਸੀਟੀ ਦੀ ਆਵਾਜ਼ ਆਉਂਦੀ ਹੈ?',
        tts: 'ਖੰਘ ਦਾ ਸਰੂਪ ਕਿਹੋ ਜਿਹਾ ਹੈ?',
      },
      gastrointestinal: {
        title: 'ਪੇਟ ਵਿੱਚ ਕਿਹੋ ਜਿਹੀ ਤਕਲੀਫ਼ ਹੈ?',
        sub: 'ਸੜਨ, ਮਰੋੜ, ਭਾਰੀਪਨ ਜਾਂ ਗੈਸ ਦਾ ਗੋਲਾ ਬਣ ਰਿਹਾ ਹੈ?',
        tts: 'ਪੇਟ ਵਿੱਚ ਕਿਹੋ ਜਿਹੀ ਤਕਲੀਫ਼ ਮਹਿਸੂਸ ਹੁੰਦੀ ਹੈ?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'ਦਰਦ ਕਿਹੜੀ ਥਾਂ ਤੇ ਹੈ, ਅਤੇ ਕੀ ਇਹ ਕਿਤੇ ਫੈਲਦਾ ਹੈ?',
        sub: 'ਦਰਦ ਦੀ ਮੁੱਖ ਥਾਂ ਅਤੇ ਕੀ ਦਰਦ ਹੋਰ ਅੰਗਾਂ ਵਿੱਚ ਜਾ ਰਿਹਾ ਹੈ, ਦੱਸੋ।',
        tts: 'ਦਰਦ ਕਿਹੜੀ ਥਾਂ ਤੇ ਹੈ ਅਤੇ ਕੀ ਇਹ ਕਿਤੇ ਫੈਲਦਾ ਹੈ?',
      },
      fever: {
        title: 'ਬੁਖਾਰ ਦਾ ਅਸਰ ਸਰੀਰ ਦੇ ਕਿਹੜੇ ਹਿੱਸੇ ਵਿੱਚ ਜ਼ਿਆਦਾ ਹੈ?',
        sub: 'ਸਿਰਦਰਦ, ਸਰੀਰ ਟੁੱਟਣਾ ਜਾਂ ਜੋੜਾਂ ਦਾ ਦਰਦ ਹੈ?',
        tts: 'ਬੁਖਾਰ ਦਾ ਅਸਰ ਸਰੀਰ ਦੇ ਕਿਹੜੇ ਹਿੱਸੇ ਵਿੱਚ ਜ਼ਿਆਦਾ ਹੈ?',
      },
      respiratory: {
        title: 'ਛਾਤੀ ਵਿੱਚ ਜਕੜਨ ਜਾਂ ਗਲੇ ਵਿੱਚ ਤਕਲੀਫ਼ ਕਿੱਥੇ ਮਹਿਸੂਸ ਹੁੰਦੀ ਹੈ?',
        sub: 'ਸਾਹ ਦੀ ਤਕਲੀਫ਼ ਦਾ ਮੁੱਖ ਹਿੱਸਾ ਚੁਣੋ।',
        tts: 'ਛਾਤੀ ਵਿੱਚ ਜਕੜਨ ਕਿੱਥੇ ਮਹਿਸੂਸ ਹੁੰਦੀ ਹੈ?',
      },
      gastrointestinal: {
        title: 'ਪੇਟ ਵਿੱਚ ਤਕਲੀਫ਼ ਕਿਸ ਹਿੱਸੇ ਵਿੱਚ ਹੈ?',
        sub: 'ਉੱਪਰਲੇ ਪੇਟ ਵਿੱਚ, ਧੁੰਨੀ ਦੇ ਕੋਲ ਜਾਂ ਸਾਰੇ ਪੇਟ ਵਿੱਚ?',
        tts: 'ਪੇਟ ਵਿੱਚ ਤਕਲੀਫ਼ ਕਿਸ ਹਿੱਸੇ ਵਿੱਚ ਹੈ?',
      },
    },

    stepSeverity: {
      title: 'ਤਕਲੀਫ਼ ਦੀ ਤੀਬਰਤਾ ਕਿੰਨੀ ਕੁ ਹੈ?',
      sub: '1 (ਹਲਕਾ) ਤੋਂ 10 (ਅਸਹਿ ਦਰਦ) ਦੇ ਪੈਮਾਨੇ ਤੇ ਚੁਣੋ।',
      tts: 'ਇੱਕ ਤੋਂ ਦੱਸ ਦੇ ਪੈਮਾਨੇ ਤੇ ਤੁਹਾਡੀ ਤਕਲੀਫ਼ ਕਿੰਨੀ ਜ਼ਿਆਦਾ ਹੈ?',
      mild: 'ਹਲਕਾ (1 - 3)',
      moderate: 'ਦਰਮਿਆਨਾ (4 - 6)',
      severe: 'ਗੰਭੀਰ (7 - 10)',
    },

    stepAssociated: {
      title: 'ਕੀ ਨਾਲ ਕੋਈ ਹੋਰ ਲੱਛਣ ਵੀ ਹਨ?',
      sub: 'ਜੋ ਵੀ ਹੋਰ ਲੱਛਣ ਮਹਿਸੂਸ ਹੋ ਰਹੇ ਹਨ, ਉਹਨਾਂ ਨੂੰ ਚੁਣੋ।',
      tts: 'ਕੀ ਨਾਲ ਕੋਈ ਹੋਰ ਲੱਛਣ ਵੀ ਹਨ?',
      addCustom: 'ਕੋਈ ਹੋਰ ਲੱਛਣ ਸ਼ਾਮਲ ਕਰੋ...',
    },

    stepAggravating: {
      title: 'ਕਿਸ ਚੀਜ਼ ਨਾਲ ਤਕਲੀਫ਼ ਵਧਦੀ ਹੈ?',
      sub: 'ਉਦਾਹਰਨ: ਤੁਰਨ ਨਾਲ, ਖਾਣ ਨਾਲ, ਲੇਟਣ ਨਾਲ, ਜਾਂ ਠੰਢੀ ਹਵਾ ਨਾਲ।',
      tts: 'ਕਿਸ ਚੀਜ਼ ਨਾਲ ਤਕਲੀਫ਼ ਵਧਦੀ ਹੈ?',
      placeholder: 'ਜਿਵੇਂ: ਪੌੜੀਆਂ ਚੜ੍ਹਨ ਨਾਲ, ਤਿੱਖਾ ਖਾਣ ਨਾਲ, ਲੇਟਣ ਤੇ...',
    },

    stepRelieving: {
      title: 'ਕਿਸ ਚੀਜ਼ ਨਾਲ ਆਰਾਮ ਜਾਂ ਸੁੱਖ ਮਿਲਦਾ ਹੈ?',
      sub: 'ਉਦਾਹਰਨ: ਆਰਾਮ ਕਰਨ ਨਾਲ, ਗਰਮ ਪਾਣੀ ਨਾਲ, ਬੈਠਣ ਨਾਲ, ਦਵਾਈ ਨਾਲ।',
      tts: 'ਕਿਸ ਚੀਜ਼ ਨਾਲ ਆਰਾਮ ਮਿਲਦਾ ਹੈ?',
      placeholder: 'ਜਿਵੇਂ: ਪੂਰਾ ਆਰਾਮ ਕਰਨ ਨਾਲ, ਕੋਸਾ ਪਾਣੀ ਪੀਣ ਨਾਲ...',
    },

    stepFollowUp: {
      title: 'ਡਾਕਟਰ ਸਾਹਿਬ ਲਈ ਕੁਝ ਸੰਖੇਪ ਸਵਾਲ',
      sub: 'ਇਹਨਾਂ ਜਵਾਬਾਂ ਨਾਲ ਤੁਹਾਡੇ ਡਾਕਟਰ ਨੂੰ ਸਹੀ ਇਲਾਜ ਤੁਰੰਤ ਸ਼ੁਰੂ ਕਰਨ ਵਿੱਚ ਮਦਦ ਮਿਲੇਗੀ।',
      tts: 'ਡਾਕਟਰ ਸਾਹਿਬ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਇਹਨਾਂ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।',
    },

    presets: {
      chestTitle: 'ਛਾਤੀ ਅਤੇ ਸਾਹ',
      chestDesc: 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ, ਦਬਾਅ, ਸਾਹ ਫੁੱਲਣਾ, ਦਿਲ ਦੀ ਧੜਕਣ ਤੇਜ਼ ਹੋਣਾ',
      giTitle: 'ਹਾਜ਼ਮਾ ਅਤੇ ਪੇਟ',
      giDesc: 'ਪੇਟ ਦਰਦ, ਗੈਸ, ਐਸਿਡਿਟੀ, ਉਲਟੀ, ਦਸਤ',
      feverTitle: 'ਬੁਖਾਰ ਅਤੇ ਲਾਗ',
      feverDesc: 'ਤੇਜ਼ ਬੁਖਾਰ, ਕੰਬਣੀ, ਸਰੀਰ ਦਰਦ, ਗਲੇ ਵਿੱਚ ਖਰਾਸ਼, ਕਮਜ਼ੋਰੀ',
      orthoTitle: 'ਜੋੜ ਅਤੇ ਕਮਰ',
      orthoDesc: 'ਗੋਡਿਆਂ ਦਾ ਦਰਦ, ਕਮਰ ਦਰਦ, ਮੋਢੇ ਜਕੜਨਾ, ਸੋਜ',
    },

    login: {
      portalTitle: 'ਮਰੀਜ਼ ਪੋਰਟਲ',
      portalSub: 'ਆਭਾ ਅਤੇ ਓਪੀਡੀ ਸੇਵਾਵਾਂ',
      phoneOrAbha: 'ਫ਼ੋਨ ਨੰਬਰ ਜਾਂ ਆਭਾ ਆਈਡੀ ਦਰਜ ਕਰੋ',
      continueBtn: 'ਅੱਗੇ ਵਧੋ',
      registerBtn: 'ਰਜਿਸਟਰ ਕਰੋ',
      createRecord: 'ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
      noRecordFound: 'ਪੁਰਾਣਾ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਵੇਰਵੇ ਭਰ ਕੇ ਰਜਿਸਟਰ ਕਰੋ।',
      loginDesc: 'ਓਪੀਡੀ ਟੋਕਨ, ਪਰਚੀ ਅਤੇ ਸਿਹਤ ਰਿਕਾਰਡ ਲਈ ਲੌਗਇਨ ਕਰੋ।',
      fullName: 'ਪੂਰਾ ਨਾਮ',
      age: 'ਉਮਰ',
      gender: 'ਲਿੰਗ',
      male: 'ਪੁਰਸ਼',
      female: 'ਔਰਤ',
      other: 'ਹੋਰ',
    },

    summary: {
      completeTitle: 'ਓਪੀਡੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਫ਼ਲਤਾਪੂਰਵਕ ਮੁਕੰਮਲ ਹੋਈ',
      completeSub: 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਓਪੀਡੀ ਡਾਕਟਰ ਨੂੰ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ।',
      assignedStation: 'ਨਿਰਧਾਰਤ ਓਪੀਡੀ ਕਮਰਾ',
      openDashboard: 'ਮਰੀਜ਼ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ',
      fastTrack: 'ਜ਼ਰੂਰੀ ਸਹਾਇਤਾ',
      standardCare: 'ਆਮ ਜਾਂਚ',
      careReview: 'ਜਾਂਚ ਕ੍ਰਮ',
    },
  },

  or: {
    listen: 'ଶୁଣନ୍ତୁ',
    speak: 'କୁହନ୍ତୁ',
    stopVoice: 'ବନ୍ଦ କରନ୍ତୁ',
    next: 'ପରବର୍ତ୍ତୀ',
    back: 'ପଛକୁ',
    complete: 'ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ',
    submit: 'ଓପିଡି ଟୋକନ ନିଅନ୍ତୁ',
    searchHospital: 'ଡାକ୍ତରଖାନା ନାମ ବା ସହର ଖୋଜନ୍ତୁ...',
    selectHospital: 'ଡାକ୍ତରଖାନା ବାଛନ୍ତୁ',
    clear: 'ସଫା କରନ୍ତୁ',
    changeLanguage: 'ଭାଷା ବଦଳାନ୍ତୁ',
    orSpeakBelow: 'କିମ୍ବା ତଳେ ମାଇକ୍ ଦବାଇ ସିଧା କୁହନ୍ତୁ',

    chiefComplaint: {
      title: 'ଆଜି ଆପଣଙ୍କର ମୁଖ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା କ’ଣ?',
      sub: 'ଦୟାକରି ନିଜ ଭାଷାରେ କୁହନ୍ତୁ କିମ୍ବା ତଳ ତାଲିକାରୁ ବାଛନ୍ତୁ।',
      tts: 'ଆଜି ଆପଣଙ୍କର ମୁଖ୍ୟ ସମସ୍ୟା କ’ଣ ଦୟାକରି କୁହନ୍ତୁ।',
      placeholder: 'ଯେପରି: ୧ ଘଣ୍ଟା ଧରି ଛାତିରେ ଯନ୍ତ୍ରଣା ଏବଂ ଝାଳ, କିମ୍ବା ପ୍ରବଳ କାଶ ଓ ଜ୍ୱର...',
      orChoosePreset: 'କିମ୍ବା ସାଧାରଣ ସମସ୍ୟା ବାଛନ୍ତୁ:',
    },

    stepDuration: {
      general: {
        title: 'ଏହି ସମସ୍ୟା କେବେଠାରୁ ଆରମ୍ଭ ହୋଇଛି?',
        sub: 'ଆପଣ କେତେ ସମୟ କିମ୍ବା ଦିନରୁ ଅସୁସ୍ଥ ଅଛନ୍ତି ଜଣାନ୍ତୁ।',
        tts: 'ଏହି ସମସ୍ୟା କେବେଠାରୁ ଆରମ୍ଭ ହୋଇଛି?',
      },
      fever: {
        title: 'ଜ୍ୱର କେବେଠାରୁ ଆରମ୍ଭ ହୋଇଛି?',
        sub: 'କେତେ ଘଣ୍ଟା ବା ଦିନ ଧରି ଜ୍ୱର ଅଛି ଜଣାନ୍ତୁ।',
        tts: 'ଜ୍ୱର କେବେଠାରୁ ଆରମ୍ଭ ହୋଇଛି?',
      },
      respiratory: {
        title: 'କାଶ କିମ୍ବା ଶ୍ୱାସକଷ୍ଟ କେବେଠାରୁ ଆରମ୍ଭ ହେଲା?',
        sub: 'ଶ୍ୱାସକଷ୍ଟର ସମୟସୀମା ଜଣାନ୍ତୁ।',
        tts: 'କାଶ କିମ୍ବା ଶ୍ୱାସକଷ୍ଟ କେବେଠାରୁ ଆରମ୍ଭ ହେଲା?',
      },
      gastrointestinal: {
        title: 'ପେଟ କିମ୍ବା ହଜମ ସମସ୍ୟା କେବେଠାରୁ ଆରମ୍ଭ ହେଲା?',
        sub: 'ପେଟର ଏହି ସମସ୍ୟା କେତେ ଦିନ ଧରି ଅଛି ଜଣାନ୍ତୁ।',
        tts: 'ପେଟ କିମ୍ବା ହଜମ ସମସ୍ୟା କେବେଠାରୁ ଆରମ୍ଭ ହେଲା?',
      },
    },

    stepCharacter: {
      general: {
        title: 'କଷ୍ଟ ବା ଯନ୍ତ୍ରଣାର ଅନୁଭୂତି କିପରି?',
        sub: 'ଆପଣଙ୍କ ସମସ୍ୟା ସହିତ ମେଳ ଖାଉଥିବା ବିବରଣୀ ବାଛନ୍ତୁ।',
        tts: 'କଷ୍ଟର ଅନୁଭୂତି କିପରି?',
      },
      fever: {
        title: 'ଜ୍ୱର କିପରି ଲାଗୁଛି? କମ୍ପ ହେଉଛି କି?',
        sub: 'ଶୀତ ଲାଗି କମ୍ପ ହେଉଛି ନା କ୍ରମାଗତ ଶରୀର ଗରମ ରହୁଛି?',
        tts: 'ଜ୍ୱର କିପରି ଲାଗୁଛି? କମ୍ପ ହେଉଛି କି?',
      },
      respiratory: {
        title: 'କାଶ ଏବଂ କଫର ସ୍ୱରୂପ କିପରି?',
        sub: 'ଶୁଖିଲା କାଶ, କଫ ବାହାରୁଛି ନା ଶ୍ୱାସ ନେଲାବେଳେ ସଁ ସଁ ଶବ୍ଦ ହେଉଛି?',
        tts: 'କାଶର ସ୍ୱରୂପ କିପରି?',
      },
      gastrointestinal: {
        title: 'ପେଟରେ କି ପ୍ରକାରର ଅସୁବିଧା ହେଉଛି?',
        sub: 'ଜଳାପୋଡ଼ା, ମୋଡ଼ି ହେବା, ଭାରୀ ଲାଗିବା ନା ଗ୍ୟାସ ହୋଇଛି?',
        tts: 'ପେଟରେ କି ପ୍ରକାରର ଅସୁବିଧା ହେଉଛି?',
      },
    },

    stepSiteRadiation: {
      general: {
        title: 'ଯନ୍ତ୍ରଣା କେଉଁ ସ୍ଥାନରେ ହେଉଛି ଏବଂ ଏହା ଅନ୍ୟ କୁଆଡ଼େ ବ୍ୟାପୁଛି କି?',
        sub: 'ଯନ୍ତ୍ରଣାର ମୁଖ୍ୟ ସ୍ଥାନ ଏବଂ ଏହା ଅନ୍ୟ ଅଙ୍ଗକୁ ଯାଉଛି କି ଜଣାନ୍ତୁ।',
        tts: 'ଯନ୍ତ୍ରଣା କେଉଁ ସ୍ଥାନରେ ହେଉଛି ଏବଂ ଏହା ଅନ୍ୟ କୁଆଡ଼େ ବ୍ୟାପୁଛି କି?',
      },
      fever: {
        title: 'ଜ୍ୱରର ପ୍ରଭାବ ଶରୀରର କେଉଁ ଅଂଶରେ ଅଧିକ ଅନୁଭୂତ ହେଉଛି?',
        sub: 'ମୁଣ୍ଡବିନ୍ଧା, ଦେହବିନ୍ଧା ବା ଗଣ୍ଠି ଯନ୍ତ୍ରଣା ଅଛି କି?',
        tts: 'ଜ୍ୱରର ପ୍ରଭାବ ଶରୀରର କେଉଁ ଅଂଶରେ ଅଧିକ?',
      },
      respiratory: {
        title: 'ଛାତିରେ ଚାପ କିମ୍ବା ଗଳାରେ କଷ୍ଟ କେଉଁଠି ଲାଗୁଛି?',
        sub: 'ଶ୍ୱାସକଷ୍ଟର ମୁଖ୍ୟ ସ୍ଥାନ ବାଛନ୍ତୁ।',
        tts: 'ଛାତିରେ ଚାପ କେଉଁଠି ଲାଗୁଛି?',
      },
      gastrointestinal: {
        title: 'ପେଟର କେଉଁ ଅଂଶରେ ଯନ୍ତ୍ରଣା ହେଉଛି?',
        sub: 'ଉପର ପେଟରେ, ନାଭି ଚାରିପାଖରେ ନା ସମ୍ପୂର୍ଣ୍ଣ ପେଟରେ?',
        tts: 'ପେଟର କେଉଁ ଅଂଶରେ ଯନ୍ତ୍ରଣା ହେଉଛି?',
      },
    },

    stepSeverity: {
      title: 'ଯନ୍ତ୍ରଣାର ତୀବ୍ରତା କେତେ ଅଧିକ?',
      sub: '୧ (ସାମାନ୍ୟ) ରୁ ୧୦ (ଅସହ୍ୟ ଯନ୍ତ୍ରଣା) ମଧ୍ୟରେ ବାଛନ୍ତୁ।',
      tts: 'ଏକରୁ ଦଶ ମଧ୍ୟରେ ଆପଣଙ୍କ ଯନ୍ତ୍ରଣା କେତେ ତୀବ୍ର?',
      mild: 'ସାମାନ୍ୟ (୧ - ୩)',
      moderate: 'ମଧ୍ୟମ (୪ - ୬)',
      severe: 'ଗମ୍ଭୀର (୭ - ୧୦)',
    },

    stepAssociated: {
      title: 'ଏହା ସହିତ ଅନ୍ୟ କୌଣସି ଲକ୍ଷଣ ଅଛି କି?',
      sub: 'ଆପଣ ଅନୁଭବ କରୁଥିବା ଅନ୍ୟ ଲକ୍ଷଣଗୁଡ଼ିକୁ ବାଛନ୍ତୁ।',
      tts: 'ଏହା ସହିତ ଅନ୍ୟ କୌଣସି ଲକ୍ଷଣ ଅଛି କି?',
      addCustom: 'ଅନ୍ୟ ଲକ୍ଷଣ ଯୋଡନ୍ତୁ...',
    },

    stepAggravating: {
      title: 'କେଉଁ କାରଣରୁ କଷ୍ଟ ବଢ଼ିଯାଏ?',
      sub: 'ଯଥା: ଚାଲିବା ଦ୍ୱାରା, ଖାଇବା ଦ୍ୱାରା, ଶୋଇବା ଦ୍ୱାରା, ଥଣ୍ଡା ପବନରେ।',
      tts: 'କେଉଁ କାରଣରୁ କଷ୍ଟ ବଢ଼ିଯାଏ?',
      placeholder: 'ଯେପରି: ସିଡ଼ି ଚଢ଼ିବା ଦ୍ୱାରା, ରାଗ ଖାଇଲେ, ଶୋଇବା ଦ୍ୱାରା...',
    },

    stepRelieving: {
      title: 'କେଉଁଥିରେ ଆରାମ କିମ୍ବା ଉପଶମ ମିଳେ?',
      sub: 'ଯଥା: ବିଶ୍ରାମ, ଉଷୁମ ପାଣି, ବସିବା ଦ୍ୱାରା, ଔଷଧ ଦ୍ୱାରା।',
      tts: 'କେଉଁଥିରେ ଆପଣଙ୍କୁ ଉପଶମ ମିଳେ?',
      placeholder: 'ଯେପରି: ସମ୍ପୂର୍ଣ୍ଣ ବିଶ୍ରାମ ନେବା ଦ୍ୱାରା, ଉଷୁମ ପାଣି ପିଇବା ଦ୍ୱାରା...',
    },

    stepFollowUp: {
      title: 'ଡାକ୍ତରଙ୍କ ପାଇଁ କିଛି ସଂକ୍ଷିପ୍ତ ପ୍ରଶ୍ନ',
      sub: 'ଏହି ଉତ୍ତରଗୁଡ଼ିକ ଆପଣଙ୍କ ଡାକ୍ତରଙ୍କୁ ତୁରନ୍ତ ସଠିକ ଚିକିତ୍ସା ଆରମ୍ଭ କରିବାରେ ସାହାଯ୍ୟ କରିବ।',
      tts: 'ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ପାଇଁ ଦୟାକରି ଏହି ପ୍ରଶ୍ନଗୁଡ଼ିକର ଉତ୍ତର ଦିଅନ୍ତୁ।',
    },

    presets: {
      chestTitle: 'ଛାତି ଏବଂ ଶ୍ୱାସକ୍ରିୟା',
      chestDesc: 'ଛାତି ଯନ୍ତ୍ରଣା, ଚାପ, ଶ୍ୱାସକଷ୍ଟ, ହୃଦସ୍ପନ୍ଦନ ବଢ଼ିବା',
      giTitle: 'ହଜମ ଏବଂ ପେଟ',
      giDesc: 'ପେଟ ଯନ୍ତ୍ରଣା, ଗ୍ୟାସ, ଏସିଡିଟି, ବାନ୍ତି, ଝାଡ଼ା',
      feverTitle: 'ଜ୍ୱର ଏବଂ ସଂକ୍ରମଣ',
      feverDesc: 'ପ୍ରବଳ ଜ୍ୱର, କମ୍ପ, ଦେହବିନ୍ଧା, ଗଳା ଯନ୍ତ୍ରଣା, ଦୁର୍ବଳତା',
      orthoTitle: 'ଗଣ୍ଠି ଏବଂ ଅଣ୍ଟା',
      orthoDesc: 'ଆଣ୍ଠୁ ଯନ୍ତ୍ରଣା, ଅଣ୍ଟା ଯନ୍ତ୍ରଣା, କାନ୍ଧ ଜକଡ଼ିବା, ଫୁଲିବା',
    },

    login: {
      portalTitle: 'ରୋଗୀ ପୋର୍ଟାଲ',
      portalSub: 'ଆଭା ଏବଂ ଓପିଡି ସେବା',
      phoneOrAbha: 'ଫୋନ୍ ନମ୍ବର ବା ଆଭା ଆଇଡି ଦିଅନ୍ତୁ',
      continueBtn: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
      registerBtn: 'ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
      createRecord: 'ନୂତନ ପଞ୍ଜୀକରଣ',
      noRecordFound: 'ପୂର୍ବ ରେକର୍ଡ ମିଳିଲା ନାହିଁ। ଦୟାକରି ତଳେ ବିବରଣୀ ଦେଇ ପଞ୍ଜୀକରଣ କରନ୍ତୁ।',
      loginDesc: 'ଓପିଡି ଟୋକନ, ଇ-ପ୍ରେସକ୍ରିପସନ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ପାଇଁ ଲଗଇନ୍ କରନ୍ତୁ।',
      fullName: 'ସମ୍ପୂର୍ଣ୍ଣ ନାମ',
      age: 'ବୟସ',
      gender: 'ଲିଙ୍ଗ',
      male: 'ପୁରୁଷ',
      female: 'ମହିଳା',
      other: 'ଅନ୍ୟାନ୍ୟ',
    },

    summary: {
      completeTitle: 'ଓପିଡି ପଞ୍ଜୀକରଣ ସଫଳତାର ସହ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା',
      completeSub: 'ଆପଣଙ୍କ ତଥ୍ୟ ଓପିଡି ଡାକ୍ତରଙ୍କ ନିକଟକୁ ପଠାଯାଇଛି।',
      assignedStation: 'ନିର୍ଦ୍ଧାରିତ ଓପିଡି କୋଠରୀ',
      openDashboard: 'ରୋଗୀ ଡ୍ୟାସବୋର୍ଡ ଖୋଲନ୍ତୁ',
      fastTrack: 'ଜରୁରୀ ସହାୟତା',
      standardCare: 'ସାଧାରଣ ଯାଞ୍ଚ',
      careReview: 'ଯାଞ୍ଚ କ୍ରମ',
    },
  },
};

/**
 * Returns translation object for a given language code (with English fallback)
 */
export function getTranslations(lang: SupportedLanguage = 'en'): RegionalTranslation {
  return REGIONAL_TRANSLATIONS[lang] || REGIONAL_TRANSLATIONS.en;
}
