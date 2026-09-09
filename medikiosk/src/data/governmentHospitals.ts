export interface GovernmentHospital {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  state: string;
  category: 'Central Apex Institute' | 'Central Govt Hospital' | 'National Apex AYUSH Institute' | 'State Medical College';
  hfrId: string; // Official ABDM Health Facility Registry ID
  address: string;
  defaultRooms: {
    dept: string;
    room: string;
    doctor: string;
    keywords: string[];
  }[];
}

export const TOP_GOVERNMENT_HOSPITALS: GovernmentHospital[] = [
  {
    "id": "aiims-delhi",
    "name": "AIIMS New Delhi (Apex)",
    "shortCode": "AIIMS-DEL",
    "city": "New Delhi",
    "state": "Delhi",
    "category": "Central Apex Institute",
    "hfrId": "IN-DL-001248",
    "address": "Ansari Nagar East, New Delhi - 110029",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. A. Sharma, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-bpl",
    "name": "AIIMS Bhopal",
    "shortCode": "AIIMS-BPL",
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "category": "Central Apex Institute",
    "hfrId": "IN-MP-002951",
    "address": "Saket Nagar, Bhopal, Madhya Pradesh - 462020",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. R. Saxena, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-bbi",
    "name": "AIIMS Bhubaneswar",
    "shortCode": "AIIMS-BBI",
    "city": "Bhubaneswar",
    "state": "Odisha",
    "category": "Central Apex Institute",
    "hfrId": "IN-OR-005118",
    "address": "Sijua, Patrapada, Bhubaneswar, Odisha - 751019",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. B. K. Mohapatra, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-jdp",
    "name": "AIIMS Jodhpur",
    "shortCode": "AIIMS-JDP",
    "city": "Jodhpur",
    "state": "Rajasthan",
    "category": "Central Apex Institute",
    "hfrId": "IN-RJ-004120",
    "address": "Basni Industrial Area Phase-2, Jodhpur, Rajasthan - 342005",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. Bishnoi, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-pat",
    "name": "AIIMS Patna",
    "shortCode": "AIIMS-PAT",
    "city": "Patna",
    "state": "Bihar",
    "category": "Central Apex Institute",
    "hfrId": "IN-BR-003612",
    "address": "Phulwari Sharif, Patna, Bihar - 801507",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. V. K. Singh, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-rpr",
    "name": "AIIMS Raipur",
    "shortCode": "AIIMS-RPR",
    "city": "Raipur",
    "state": "Chhattisgarh",
    "category": "Central Apex Institute",
    "hfrId": "IN-CG-001984",
    "address": "GE Road, Tatibandh, Raipur, Chhattisgarh - 492099",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. N. Agrawal, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-rsh",
    "name": "AIIMS Rishikesh",
    "shortCode": "AIIMS-RSH",
    "city": "Rishikesh",
    "state": "Uttarakhand",
    "category": "Central Apex Institute",
    "hfrId": "IN-UT-003819",
    "address": "Virbhadra Road, Rishikesh, Uttarakhand - 249203",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. V. Singhal, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-rbl",
    "name": "AIIMS Raebareli",
    "shortCode": "AIIMS-RBL",
    "city": "Raebareli",
    "state": "Uttar Pradesh",
    "category": "Central Apex Institute",
    "hfrId": "IN-UP-006240",
    "address": "Munshiganj, Dalmau Road, Raebareli, Uttar Pradesh - 229405",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. M. Mishra, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-mgl",
    "name": "AIIMS Mangalagiri (Vijayawada)",
    "shortCode": "AIIMS-MGL",
    "city": "Mangalagiri (Guntur)",
    "state": "Andhra Pradesh",
    "category": "Central Apex Institute",
    "hfrId": "IN-AP-002781",
    "address": "NH-16, Mangalagiri, Guntur, Andhra Pradesh - 522503",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. K. Rao, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-ngp",
    "name": "AIIMS Nagpur",
    "shortCode": "AIIMS-NGP",
    "city": "Nagpur",
    "state": "Maharashtra",
    "category": "Central Apex Institute",
    "hfrId": "IN-MH-004921",
    "address": "Plot No. 2, Sector 20, MIHAN, Nagpur, Maharashtra - 441108",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. P. Deshmukh, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-gkp",
    "name": "AIIMS Gorakhpur",
    "shortCode": "AIIMS-GKP",
    "city": "Gorakhpur",
    "state": "Uttar Pradesh",
    "category": "Central Apex Institute",
    "hfrId": "IN-UP-005183",
    "address": "Kunraghat, Gorakhpur, Uttar Pradesh - 273008",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. K. Yadav, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-kly",
    "name": "AIIMS Kalyani",
    "shortCode": "AIIMS-KLY",
    "city": "Kalyani",
    "state": "West Bengal",
    "category": "Central Apex Institute",
    "hfrId": "IN-WB-003874",
    "address": "NH-34 Connector, Basantapur, Kalyani, West Bengal - 741245",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. D. Banerjee, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-btd",
    "name": "AIIMS Bathinda",
    "shortCode": "AIIMS-BTD",
    "city": "Bathinda",
    "state": "Punjab",
    "category": "Central Apex Institute",
    "hfrId": "IN-PB-002941",
    "address": "Mandi Dabwali Road, Bathinda, Punjab - 151001",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. G. S. Gill, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-gwt",
    "name": "AIIMS Guwahati",
    "shortCode": "AIIMS-GWT",
    "city": "Guwahati",
    "state": "Assam",
    "category": "Central Apex Institute",
    "hfrId": "IN-AS-001832",
    "address": "Silbharal, Changsari, Kamrup, Guwahati, Assam - 781101",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. H. Barman, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-jmu",
    "name": "AIIMS Vijaypur (Jammu)",
    "shortCode": "AIIMS-JMU",
    "city": "Jammu",
    "state": "Jammu and Kashmir",
    "category": "Central Apex Institute",
    "hfrId": "IN-JK-002491",
    "address": "Vijaypur, Samba District, Jammu, J&K - 184120",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. Y. K. Sharma, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-bls",
    "name": "AIIMS Bilaspur",
    "shortCode": "AIIMS-BLS",
    "city": "Bilaspur",
    "state": "Himachal Pradesh",
    "category": "Central Apex Institute",
    "hfrId": "IN-HP-001742",
    "address": "Kothipura, Bilaspur, Himachal Pradesh - 174001",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. R. K. Thakur, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-mdr",
    "name": "AIIMS Madurai",
    "shortCode": "AIIMS-MDR",
    "city": "Madurai",
    "state": "Tamil Nadu",
    "category": "Central Apex Institute",
    "hfrId": "IN-TN-004128",
    "address": "Thoppur, Madurai, Tamil Nadu - 625008",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. M. Senthil, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-dbg",
    "name": "AIIMS Darbhanga",
    "shortCode": "AIIMS-DBG",
    "city": "Darbhanga",
    "state": "Bihar",
    "category": "Central Apex Institute",
    "hfrId": "IN-BR-005190",
    "address": "Ekmi Shobhan Bypass, Darbhanga, Bihar - 846005",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. R. K. Jha, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-dgh",
    "name": "AIIMS Deoghar",
    "shortCode": "AIIMS-DGH",
    "city": "Deoghar",
    "state": "Jharkhand",
    "category": "Central Apex Institute",
    "hfrId": "IN-JH-002381",
    "address": "Devipur, Rohini, Deoghar, Jharkhand - 814152",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. A. K. Mandal, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-rjk",
    "name": "AIIMS Rajkot",
    "shortCode": "AIIMS-RJK",
    "city": "Rajkot",
    "state": "Gujarat",
    "category": "Central Apex Institute",
    "hfrId": "IN-GJ-003892",
    "address": "Village Khandheri, Para Pipaliya, Rajkot, Gujarat - 360006",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. C. Patel, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-bbn",
    "name": "AIIMS Bibinagar (Hyderabad)",
    "shortCode": "AIIMS-BBN",
    "city": "Bibinagar (Hyderabad)",
    "state": "Telangana",
    "category": "Central Apex Institute",
    "hfrId": "IN-TG-004612",
    "address": "Rangapur, Bibinagar, Yadadri Bhuvanagiri, Telangana - 508126",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. T. Reddy, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-awn",
    "name": "AIIMS Awantipora (Kashmir)",
    "shortCode": "AIIMS-AWN",
    "city": "Awantipora (Srinagar)",
    "state": "Jammu and Kashmir",
    "category": "Central Apex Institute",
    "hfrId": "IN-JK-003180",
    "address": "Awantipora, Pulwama, Jammu & Kashmir - 192122",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. F. Ahmad, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-rwr",
    "name": "AIIMS Rewari (Majra)",
    "shortCode": "AIIMS-RWR",
    "city": "Rewari",
    "state": "Haryana",
    "category": "Central Apex Institute",
    "hfrId": "IN-HR-002734",
    "address": "Majra Mustil Bhalaki, Rewari, Haryana - 123401",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. Yadav, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiims-sbp",
    "name": "AIIMS Sambalpur",
    "shortCode": "AIIMS-SBP",
    "city": "Sambalpur",
    "state": "Odisha",
    "category": "Central Apex Institute",
    "hfrId": "IN-OR-006214",
    "address": "Burla, Sambalpur, Odisha - 768017",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. K. Pradhan, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "pgimer-chd",
    "name": "PGIMER Chandigarh",
    "shortCode": "PGIMER-CHD",
    "city": "Chandigarh",
    "state": "Chandigarh",
    "category": "Central Apex Institute",
    "hfrId": "IN-CH-001092",
    "address": "Sector 12, Chandigarh - 160012",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. H. S. Bawa, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "jipmer-pdy",
    "name": "JIPMER Puducherry",
    "shortCode": "JIPMER-PDY",
    "city": "Puducherry",
    "state": "Puducherry",
    "category": "Central Apex Institute",
    "hfrId": "IN-PY-000311",
    "address": "Dhanvantari Nagar, Gorimedu, Puducherry - 605006",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. K. Swaminathan, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "safdarjung-delhi",
    "name": "Safdarjung Hospital & VMMC",
    "shortCode": "SJH-DEL",
    "city": "New Delhi",
    "state": "Delhi",
    "category": "Central Govt Hospital",
    "hfrId": "IN-DL-000842",
    "address": "Ring Road, Opposite AIIMS, New Delhi - 110029",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. R. K. Gupta, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "rml-delhi",
    "name": "Dr. RML Hospital & ABVIMS",
    "shortCode": "RML-DEL",
    "city": "New Delhi",
    "state": "Delhi",
    "category": "Central Govt Hospital",
    "hfrId": "IN-DL-001045",
    "address": "Baba Kharak Singh Marg, Connaught Place, New Delhi - 110001",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. A. K. Varshney, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "lhmc-delhi",
    "name": "Lady Hardinge Medical College & SK Hospital",
    "shortCode": "LHMC-DEL",
    "city": "New Delhi",
    "state": "Delhi",
    "category": "Central Govt Hospital",
    "hfrId": "IN-DL-000912",
    "address": "Shaheed Bhagat Singh Marg, Connaught Place, New Delhi - 110001",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. Batra, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "kgmu-lko",
    "name": "King George's Medical University (KGMU)",
    "shortCode": "KGMU-LKO",
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "category": "Central Govt Hospital",
    "hfrId": "IN-UP-002194",
    "address": "Shah Mina Road, Chowk, Lucknow, Uttar Pradesh - 226003",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. A. K. Tripathi, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "bhu-ims",
    "name": "IMS Banaras Hindu University (BHU)",
    "shortCode": "BHU-VNS",
    "city": "Varanasi",
    "state": "Uttar Pradesh",
    "category": "Central Apex Institute",
    "hfrId": "IN-UP-001876",
    "address": "Sir Sunderlal Hospital, BHU Campus, Varanasi, UP - 221005",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. K. Singh, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "sgpgi-lko",
    "name": "Sanjay Gandhi PGI of Medical Sciences (SGPGIMS)",
    "shortCode": "SGPGI-LKO",
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "category": "Central Apex Institute",
    "hfrId": "IN-UP-003418",
    "address": "Raebareli Road, Lucknow, Uttar Pradesh - 226014",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. R. K. Dhiman, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "nimhans-blr",
    "name": "NIMHANS Bengaluru",
    "shortCode": "NIMHANS-BLR",
    "city": "Bengaluru",
    "state": "Karnataka",
    "category": "Central Apex Institute",
    "hfrId": "IN-KA-001120",
    "address": "Hosur Road, Lakkasandra, Bengaluru, Karnataka - 560029",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. P. Murthy, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "neigrihms-shl",
    "name": "NEIGRIHMS Shillong",
    "shortCode": "NEIG-SHL",
    "city": "Shillong",
    "state": "Meghalaya",
    "category": "Central Apex Institute",
    "hfrId": "IN-ML-000412",
    "address": "Mawdiangdiang, Shillong, Meghalaya - 793018",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. N. Bhattacharyya, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "rims-imp",
    "name": "Regional Institute of Medical Sciences (RIMS)",
    "shortCode": "RIMS-IMP",
    "city": "Imphal",
    "state": "Manipur",
    "category": "Central Apex Institute",
    "hfrId": "IN-MN-000219",
    "address": "Lamphelpat, Imphal West, Manipur - 795004",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. G. S. Moirangthem, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "skims-sgr",
    "name": "Sher-i-Kashmir Institute of Medical Sciences (SKIMS)",
    "shortCode": "SKIMS-SGR",
    "city": "Srinagar",
    "state": "Jammu and Kashmir",
    "category": "Central Apex Institute",
    "hfrId": "IN-JK-001156",
    "address": "Soura, Srinagar, Jammu & Kashmir - 190011",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. P. A. Shah, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "kem-mum",
    "name": "Seth GS Medical College & KEM Hospital",
    "shortCode": "KEM-MUM",
    "city": "Mumbai",
    "state": "Maharashtra",
    "category": "State Medical College",
    "hfrId": "IN-MH-001842",
    "address": "Acharya Donde Marg, Parel, Mumbai, Maharashtra - 400012",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. Joshi, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "jj-mum",
    "name": "Grant Govt Medical College & Sir JJ Hospital",
    "shortCode": "JJ-MUM",
    "city": "Mumbai",
    "state": "Maharashtra",
    "category": "State Medical College",
    "hfrId": "IN-MH-001923",
    "address": "JJ Hospital Compound, Byculla, Mumbai, Maharashtra - 400008",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. E. V. Shinde, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "mmc-chn",
    "name": "Madras Medical College & RGGGH",
    "shortCode": "MMC-CHN",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "category": "State Medical College",
    "hfrId": "IN-TN-001048",
    "address": "EVR Periyar Salai, Park Town, Chennai, Tamil Nadu - 600003",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. E. Theranirajan, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "cmc-kol",
    "name": "Medical College Kolkata (Calcutta Medical College)",
    "shortCode": "CMC-KOL",
    "city": "Kolkata",
    "state": "West Bengal",
    "category": "State Medical College",
    "hfrId": "IN-WB-001210",
    "address": "88 College Street, Kolkata, West Bengal - 700073",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. I. Saha, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "sskm-kol",
    "name": "IPGMER & SSKM Hospital",
    "shortCode": "SSKM-KOL",
    "city": "Kolkata",
    "state": "West Bengal",
    "category": "State Medical College",
    "hfrId": "IN-WB-001540",
    "address": "244 AJC Bose Road, Bhowanipore, Kolkata, West Bengal - 700020",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. M. Roy, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "sms-jpr",
    "name": "Sawai Man Singh (SMS) Medical College & Hospital",
    "shortCode": "SMS-JPR",
    "city": "Jaipur",
    "state": "Rajasthan",
    "category": "State Medical College",
    "hfrId": "IN-RJ-001948",
    "address": "Jawahar Lal Nehru Marg, Gangawal Park, Jaipur, Rajasthan - 302004",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. R. Sharma, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "victoria-blr",
    "name": "Bangalore Medical College & Victoria Hospital",
    "shortCode": "BMC-BLR",
    "city": "Bengaluru",
    "state": "Karnataka",
    "category": "State Medical College",
    "hfrId": "IN-KA-001429",
    "address": "Fort Road, near City Market, Bengaluru, Karnataka - 560002",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. C. R. Jayanthi, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "osmania-hyd",
    "name": "Osmania General Hospital & Medical College",
    "shortCode": "OGH-HYD",
    "city": "Hyderabad",
    "state": "Telangana",
    "category": "State Medical College",
    "hfrId": "IN-TG-001840",
    "address": "Afzal Gunj, Hyderabad, Telangana - 500012",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. B. Nagender, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "gandhi-hyd",
    "name": "Gandhi Medical College & Hospital",
    "shortCode": "GMC-HYD",
    "city": "Secunderabad",
    "state": "Telangana",
    "category": "State Medical College",
    "hfrId": "IN-TG-002194",
    "address": "Musheerabad, Padmarao Nagar, Secunderabad, Telangana - 500003",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. M. Raja Rao, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "scb-ctk",
    "name": "SCB Medical College & Hospital",
    "shortCode": "SCB-CTK",
    "city": "Cuttack",
    "state": "Odisha",
    "category": "State Medical College",
    "hfrId": "IN-OR-001640",
    "address": "Manglabag, Cuttack, Odisha - 753007",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. D. Routray, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "gmch-gwt",
    "name": "Gauhati Medical College & Hospital (GMCH)",
    "shortCode": "GMCH-GWT",
    "city": "Guwahati",
    "state": "Assam",
    "category": "State Medical College",
    "hfrId": "IN-AS-001429",
    "address": "Narakasur Hilltop, Bhangagarh, Guwahati, Assam - 781032",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. A. Talukdar, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "gmc-clt",
    "name": "Government Medical College (GMC) Kozhikode",
    "shortCode": "GMC-CLT",
    "city": "Kozhikode (Calicut)",
    "state": "Kerala",
    "category": "State Medical College",
    "hfrId": "IN-KL-001842",
    "address": "Medical College Junction, Kozhikode, Kerala - 673008",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. V. R. Rajendran, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "gmc-tvm",
    "name": "Government Medical College Thiruvananthapuram",
    "shortCode": "GMC-TVM",
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "category": "State Medical College",
    "hfrId": "IN-KL-001290",
    "address": "Medical College PO, Thiruvananthapuram, Kerala - 695011",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. S. K. Sara, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "sassoon-pun",
    "name": "BJ Government Medical College & Sassoon Hospital",
    "shortCode": "BJMC-PUN",
    "city": "Pune",
    "state": "Maharashtra",
    "category": "State Medical College",
    "hfrId": "IN-MH-002148",
    "address": "Near Pune Railway Station, Pune, Maharashtra - 411001",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. V. Kale, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "civil-ahd",
    "name": "BJ Medical College & Civil Hospital Ahmedabad",
    "shortCode": "CIVIL-AHD",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "category": "State Medical College",
    "hfrId": "IN-GJ-001840",
    "address": "Asarwa, Ahmedabad, Gujarat - 380016",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. R. Dixit, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "pmch-pat",
    "name": "Patna Medical College & Hospital (PMCH)",
    "shortCode": "PMCH-PAT",
    "city": "Patna",
    "state": "Bihar",
    "category": "State Medical College",
    "hfrId": "IN-BR-001429",
    "address": "Ashok Rajpath, Patna, Bihar - 800004",
    "defaultRooms": [
      {
        "dept": "General Medicine & OPD Triage",
        "room": "OPD Room 14",
        "doctor": "Dr. I. S. Thakur, MD",
        "keywords": [
          "fever",
          "weakness",
          "fatigue",
          "malaise",
          "headache",
          "bodyache",
          "general",
          "diabetes",
          "hypertension",
          "infection"
        ]
      },
      {
        "dept": "Integrative AYUSH & Holistic Health Clinic",
        "room": "AYUSH Wing Room 08",
        "doctor": "AYUSH Senior Consultant, BAMS MD",
        "keywords": [
          "acidity",
          "gas",
          "indigestion",
          "constipation",
          "ayush",
          "ayurveda",
          "dosha",
          "pitta",
          "vata",
          "kapha",
          "chronic",
          "rejuvenation",
          "lifestyle"
        ]
      },
      {
        "dept": "Cardiology & Chest Clinic",
        "room": "Cardio Block Room 22",
        "doctor": "Cardiology Specialist, DM",
        "keywords": [
          "chest pain",
          "palpitation",
          "heart",
          "bp",
          "high blood pressure",
          "breathlessness",
          "angina",
          "dizziness"
        ]
      },
      {
        "dept": "Orthopedics & Joint Care",
        "room": "Trauma Block Room 05",
        "doctor": "Orthopedic Surgeon, MS",
        "keywords": [
          "knee",
          "joint",
          "back pain",
          "bone",
          "fracture",
          "spine",
          "arthritis",
          "shoulder",
          "muscle sprain",
          "fall"
        ]
      },
      {
        "dept": "Pulmonary & Respiratory Medicine",
        "room": "Chest Clinic Room 18",
        "doctor": "Pulmonology Consultant, MD",
        "keywords": [
          "cough",
          "cold",
          "asthma",
          "breathing",
          "phlegm",
          "wheezing",
          "sputum",
          "bronchitis"
        ]
      },
      {
        "dept": "Pediatrics OPD",
        "room": "MCH Block Room 11",
        "doctor": "Pediatrician, MD",
        "keywords": [
          "child",
          "infant",
          "baby",
          "pediatric",
          "growth",
          "vaccination"
        ]
      }
    ]
  },
  {
    "id": "aiia-delhi",
    "name": "All India Institute of Ayurveda (AIIA)",
    "shortCode": "AIIA-DEL",
    "city": "New Delhi",
    "state": "Delhi",
    "category": "National Apex AYUSH Institute",
    "hfrId": "IN-DL-004521",
    "address": "Gautampuri, Sarita Vihar, Mathura Road, New Delhi - 110076",
    "defaultRooms": [
      {
        "dept": "Kayachikitsa & Holistic OPD",
        "room": "OPD Block Room 101",
        "doctor": "Dr. Manjusha R., MD(Ayu)",
        "keywords": [
          "acidity",
          "gas",
          "fever",
          "cough",
          "constipation",
          "digestion",
          "pitta",
          "vata",
          "general",
          "weakness"
        ]
      },
      {
        "dept": "Panchakarma & Clinical Detoxification",
        "room": "Kriya Shala Room 06",
        "doctor": "Senior Vaidya on Duty",
        "keywords": [
          "paralysis",
          "detox",
          "rejuvenation",
          "stiffness",
          "chronic skin",
          "sciatica",
          "dosha"
        ]
      },
      {
        "dept": "Integrative Allopathic Triage & Emergency",
        "room": "Emergency Care Room 02",
        "doctor": "Duty Medical Officer, MBBS",
        "keywords": [
          "severe",
          "acute",
          "emergency",
          "chest pain",
          "breathlessness",
          "high bp"
        ]
      },
      {
        "dept": "Shalya Tantra (Ortho, Spine & Ano-rectal)",
        "room": "Surgical OPD Room 15",
        "doctor": "Vaidya Surgeon, MS(Ayu)",
        "keywords": [
          "joint",
          "spine",
          "piles",
          "fistula",
          "abscess",
          "wound",
          "knee",
          "bone"
        ]
      }
    ]
  },
  {
    "id": "nia-jpr",
    "name": "National Institute of Ayurveda (NIA Jaipur)",
    "shortCode": "NIA-JPR",
    "city": "Jaipur",
    "state": "Rajasthan",
    "category": "National Apex AYUSH Institute",
    "hfrId": "IN-RJ-003304",
    "address": "Jorawar Singh Gate, Amer Road, Jaipur, Rajasthan - 302002",
    "defaultRooms": [
      {
        "dept": "Kayachikitsa & Holistic OPD",
        "room": "OPD Block Room 101",
        "doctor": "Dr. B. L. Meena, MD(Ayu)",
        "keywords": [
          "acidity",
          "gas",
          "fever",
          "cough",
          "constipation",
          "digestion",
          "pitta",
          "vata",
          "general",
          "weakness"
        ]
      },
      {
        "dept": "Panchakarma & Clinical Detoxification",
        "room": "Kriya Shala Room 06",
        "doctor": "Senior Vaidya on Duty",
        "keywords": [
          "paralysis",
          "detox",
          "rejuvenation",
          "stiffness",
          "chronic skin",
          "sciatica",
          "dosha"
        ]
      },
      {
        "dept": "Integrative Allopathic Triage & Emergency",
        "room": "Emergency Care Room 02",
        "doctor": "Duty Medical Officer, MBBS",
        "keywords": [
          "severe",
          "acute",
          "emergency",
          "chest pain",
          "breathlessness",
          "high bp"
        ]
      },
      {
        "dept": "Shalya Tantra (Ortho, Spine & Ano-rectal)",
        "room": "Surgical OPD Room 15",
        "doctor": "Vaidya Surgeon, MS(Ayu)",
        "keywords": [
          "joint",
          "spine",
          "piles",
          "fistula",
          "abscess",
          "wound",
          "knee",
          "bone"
        ]
      }
    ]
  },
  {
    "id": "itra-jam",
    "name": "Institute of Teaching & Research in Ayurveda (ITRA)",
    "shortCode": "ITRA-JAM",
    "city": "Jamnagar",
    "state": "Gujarat",
    "category": "National Apex AYUSH Institute",
    "hfrId": "IN-GJ-004129",
    "address": "Guru Govind Singh Hospital Road, Jamnagar, Gujarat - 361008",
    "defaultRooms": [
      {
        "dept": "Kayachikitsa & Holistic OPD",
        "room": "OPD Block Room 101",
        "doctor": "Dr. A. B. Thakar, MD(Ayu)",
        "keywords": [
          "acidity",
          "gas",
          "fever",
          "cough",
          "constipation",
          "digestion",
          "pitta",
          "vata",
          "general",
          "weakness"
        ]
      },
      {
        "dept": "Panchakarma & Clinical Detoxification",
        "room": "Kriya Shala Room 06",
        "doctor": "Senior Vaidya on Duty",
        "keywords": [
          "paralysis",
          "detox",
          "rejuvenation",
          "stiffness",
          "chronic skin",
          "sciatica",
          "dosha"
        ]
      },
      {
        "dept": "Integrative Allopathic Triage & Emergency",
        "room": "Emergency Care Room 02",
        "doctor": "Duty Medical Officer, MBBS",
        "keywords": [
          "severe",
          "acute",
          "emergency",
          "chest pain",
          "breathlessness",
          "high bp"
        ]
      },
      {
        "dept": "Shalya Tantra (Ortho, Spine & Ano-rectal)",
        "room": "Surgical OPD Room 15",
        "doctor": "Vaidya Surgeon, MS(Ayu)",
        "keywords": [
          "joint",
          "spine",
          "piles",
          "fistula",
          "abscess",
          "wound",
          "knee",
          "bone"
        ]
      }
    ]
  },
  {
    "id": "nium-blr",
    "name": "National Institute of Unani Medicine (NIUM)",
    "shortCode": "NIUM-BLR",
    "city": "Bengaluru",
    "state": "Karnataka",
    "category": "National Apex AYUSH Institute",
    "hfrId": "IN-KA-003291",
    "address": "Kottigepalya, Magadi Main Road, Bengaluru, Karnataka - 560091",
    "defaultRooms": [
      {
        "dept": "Kayachikitsa & Holistic OPD",
        "room": "OPD Block Room 101",
        "doctor": "Dr. M. A. Siddiqui, MD(Ayu)",
        "keywords": [
          "acidity",
          "gas",
          "fever",
          "cough",
          "constipation",
          "digestion",
          "pitta",
          "vata",
          "general",
          "weakness"
        ]
      },
      {
        "dept": "Panchakarma & Clinical Detoxification",
        "room": "Kriya Shala Room 06",
        "doctor": "Senior Vaidya on Duty",
        "keywords": [
          "paralysis",
          "detox",
          "rejuvenation",
          "stiffness",
          "chronic skin",
          "sciatica",
          "dosha"
        ]
      },
      {
        "dept": "Integrative Allopathic Triage & Emergency",
        "room": "Emergency Care Room 02",
        "doctor": "Duty Medical Officer, MBBS",
        "keywords": [
          "severe",
          "acute",
          "emergency",
          "chest pain",
          "breathlessness",
          "high bp"
        ]
      },
      {
        "dept": "Shalya Tantra (Ortho, Spine & Ano-rectal)",
        "room": "Surgical OPD Room 15",
        "doctor": "Vaidya Surgeon, MS(Ayu)",
        "keywords": [
          "joint",
          "spine",
          "piles",
          "fistula",
          "abscess",
          "wound",
          "knee",
          "bone"
        ]
      }
    ]
  },
  {
    "id": "nih-kol",
    "name": "National Institute of Homoeopathy (NIH)",
    "shortCode": "NIH-KOL",
    "city": "Kolkata",
    "state": "West Bengal",
    "category": "National Apex AYUSH Institute",
    "hfrId": "IN-WB-002941",
    "address": "Block GE, Sector III, Salt Lake, Kolkata, West Bengal - 700106",
    "defaultRooms": [
      {
        "dept": "Kayachikitsa & Holistic OPD",
        "room": "OPD Block Room 101",
        "doctor": "Dr. S. K. Tiwari, MD(Ayu)",
        "keywords": [
          "acidity",
          "gas",
          "fever",
          "cough",
          "constipation",
          "digestion",
          "pitta",
          "vata",
          "general",
          "weakness"
        ]
      },
      {
        "dept": "Panchakarma & Clinical Detoxification",
        "room": "Kriya Shala Room 06",
        "doctor": "Senior Vaidya on Duty",
        "keywords": [
          "paralysis",
          "detox",
          "rejuvenation",
          "stiffness",
          "chronic skin",
          "sciatica",
          "dosha"
        ]
      },
      {
        "dept": "Integrative Allopathic Triage & Emergency",
        "room": "Emergency Care Room 02",
        "doctor": "Duty Medical Officer, MBBS",
        "keywords": [
          "severe",
          "acute",
          "emergency",
          "chest pain",
          "breathlessness",
          "high bp"
        ]
      },
      {
        "dept": "Shalya Tantra (Ortho, Spine & Ano-rectal)",
        "room": "Surgical OPD Room 15",
        "doctor": "Vaidya Surgeon, MS(Ayu)",
        "keywords": [
          "joint",
          "spine",
          "piles",
          "fistula",
          "abscess",
          "wound",
          "knee",
          "bone"
        ]
      }
    ]
  },
  {
    "id": "nis-chn",
    "name": "National Institute of Siddha (NIS)",
    "shortCode": "NIS-CHN",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "category": "National Apex AYUSH Institute",
    "hfrId": "IN-TN-003841",
    "address": "Grand Southern Trunk Rd, Tambaram Sanatorium, Chennai, Tamil Nadu - 600047",
    "defaultRooms": [
      {
        "dept": "Kayachikitsa & Holistic OPD",
        "room": "OPD Block Room 101",
        "doctor": "Dr. R. Meenakumari, MD(Ayu)",
        "keywords": [
          "acidity",
          "gas",
          "fever",
          "cough",
          "constipation",
          "digestion",
          "pitta",
          "vata",
          "general",
          "weakness"
        ]
      },
      {
        "dept": "Panchakarma & Clinical Detoxification",
        "room": "Kriya Shala Room 06",
        "doctor": "Senior Vaidya on Duty",
        "keywords": [
          "paralysis",
          "detox",
          "rejuvenation",
          "stiffness",
          "chronic skin",
          "sciatica",
          "dosha"
        ]
      },
      {
        "dept": "Integrative Allopathic Triage & Emergency",
        "room": "Emergency Care Room 02",
        "doctor": "Duty Medical Officer, MBBS",
        "keywords": [
          "severe",
          "acute",
          "emergency",
          "chest pain",
          "breathlessness",
          "high bp"
        ]
      },
      {
        "dept": "Shalya Tantra (Ortho, Spine & Ano-rectal)",
        "room": "Surgical OPD Room 15",
        "doctor": "Vaidya Surgeon, MS(Ayu)",
        "keywords": [
          "joint",
          "spine",
          "piles",
          "fistula",
          "abscess",
          "wound",
          "knee",
          "bone"
        ]
      }
    ]
  }
];

export const DEFAULT_HOSPITAL = TOP_GOVERNMENT_HOSPITALS[0]; // AIIMS New Delhi

export function getHospitalById(id?: string): GovernmentHospital {
  if (!id) return DEFAULT_HOSPITAL;
  const found = TOP_GOVERNMENT_HOSPITALS.find(h => h.id === id || h.shortCode === id || h.name.toLowerCase().includes(id.toLowerCase()));
  return found || DEFAULT_HOSPITAL;
}

export function getHospitalByCode(code?: string): GovernmentHospital | null {
  if (!code) return null;
  const found = TOP_GOVERNMENT_HOSPITALS.find(h => h.shortCode.toLowerCase() === code.toLowerCase() || h.id.toLowerCase() === code.toLowerCase());
  return found || null;
}

/**
 * Clinical Department Recognition Engine:
 * Intelligently analyzes the patient's reported symptoms, triage level, and clinical mode
 * to recognize the exact medical department, OPD room number, and attending physician.
 * Specifically built so rural and elderly patients never have to struggle with complex medical terms.
 */
export function aiRecognizeDepartment(
  complaintText: string,
  mode: 'modern' | 'ayush' = 'modern',
  triageLevel?: 'emergency' | 'priority' | 'routine' | 'normal',
  hospitalId?: string,
  age?: string | number
): {
  assignedDept: string;
  assignedRoom: string;
  doctorNumber: string;
  reasoning: string;
} {
  const hospital = getHospitalById(hospitalId);
  const text = (complaintText || '').toLowerCase();
  const numericAge = typeof age === 'string' ? parseInt(age, 10) : age;

  // 1. High-Acuity Emergency Override
  if (triageLevel === 'emergency') {
    return {
      assignedDept: 'Emergency Acute Trauma & Triage Bay',
      assignedRoom: 'Red Flag Triage Bay 1',
      doctorNumber: 'ER Senior Resident on Duty',
      reasoning: 'Emergency triage: Patient exhibits high-acuity acute symptoms requiring immediate resuscitation priority.'
    };
  }

  // 2. Pediatrics Check (Age < 14)
  if (numericAge && numericAge < 14) {
    const pedsRoom = hospital.defaultRooms.find(r => r.dept.toLowerCase().includes('pediatric'));
    if (pedsRoom) {
      return {
        assignedDept: pedsRoom.dept,
        assignedRoom: pedsRoom.room,
        doctorNumber: `${pedsRoom.room} (${pedsRoom.doctor})`,
        reasoning: `Pediatric routing: Patient age (${numericAge} yrs) triaged directly to specialized Child Health OPD.`
      };
    }
  }

  // 3. AYUSH Mode Preference: Route to Integrative AYUSH / Kayachikitsa
  if (mode === 'ayush') {
    const ayushRoom = hospital.defaultRooms.find(r => 
      r.dept.toLowerCase().includes('ayush') || 
      r.dept.toLowerCase().includes('kaya') ||
      r.dept.toLowerCase().includes('panchakarma')
    );
    if (ayushRoom) {
      return {
        assignedDept: ayushRoom.dept,
        assignedRoom: ayushRoom.room,
        doctorNumber: `${ayushRoom.room} (${ayushRoom.doctor})`,
        reasoning: 'Ayurvedic stream: Symptoms routed to specialized Integrative AYUSH & Constitutional Assessment Clinic.'
      };
    }
  }

  // 4. Keyword-based Clinical Semantic Matching
  let bestMatch: typeof hospital.defaultRooms[0] | null = null;
  let maxScore = 0;

  for (const room of hospital.defaultRooms) {
    let score = 0;
    for (const kw of room.keywords) {
      if (text.includes(kw)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = room;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      assignedDept: bestMatch.dept,
      assignedRoom: bestMatch.room,
      doctorNumber: `${bestMatch.room} (${bestMatch.doctor})`,
      reasoning: `Clinical triage matched symptoms to ${bestMatch.dept} (${bestMatch.room}).`
    };
  }

  // 5. Default Fallback: Primary General Medicine OPD (Room 14)
  const defaultRoom = hospital.defaultRooms[0] || {
    dept: 'General Medicine OPD',
    room: 'OPD Room 14',
    doctor: 'Dr. Arvind Sharma, MD'
  };

  return {
    assignedDept: defaultRoom.dept,
    assignedRoom: defaultRoom.room,
    doctorNumber: `${defaultRoom.room} (${defaultRoom.doctor})`,
    reasoning: `General OPD routing: Assigned to ${defaultRoom.dept} for primary clinical evaluation.`
  };
}
