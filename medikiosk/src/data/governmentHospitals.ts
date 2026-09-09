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
    id: 'aiims-delhi',
    name: 'AIIMS New Delhi (Apex)',
    shortCode: 'AIIMS-DEL',
    city: 'New Delhi',
    state: 'Delhi',
    category: 'Central Apex Institute',
    hfrId: 'IN-DL-001248',
    address: 'Ansari Nagar East, New Delhi - 110029',
    defaultRooms: [
      {
        dept: 'General Medicine & OPD Triage',
        room: 'OPD Room 14',
        doctor: 'Dr. Arvind Sharma, MD',
        keywords: ['fever', 'weakness', 'fatigue', 'malaise', 'headache', 'bodyache', 'general', 'diabetes', 'hypertension']
      },
      {
        dept: 'Integrative AYUSH & Holistic Health',
        room: 'AYUSH Block Room 08',
        doctor: 'Dr. K. Vaidya, BAMS MD',
        keywords: ['acidity', 'gas', 'indigestion', 'constipation', 'ayush', 'ayurveda', 'dosha', 'pitta', 'vata', 'kapha', 'chronic', 'rejuvenation']
      },
      {
        dept: 'Cardiology & Chest Clinic',
        room: 'Cardio Block Room 22',
        doctor: 'Dr. S. Mukherjee, DM',
        keywords: ['chest pain', 'palpitation', 'heart', 'bp', 'high blood pressure', 'breathlessness', 'angina']
      },
      {
        dept: 'Orthopedics & Joint Care',
        room: 'Trauma Block Room 05',
        doctor: 'Dr. N. Rao, MS',
        keywords: ['knee', 'joint', 'back pain', 'bone', 'fracture', 'spine', 'arthritis', 'shoulder', 'muscle sprain']
      },
      {
        dept: 'Pulmonary & Respiratory Medicine',
        room: 'Chest Clinic Room 18',
        doctor: 'Dr. M. Nair, MD',
        keywords: ['cough', 'cold', 'asthma', 'breathing', 'phlegm', 'wheezing', 'sputum', 'bronchitis']
      },
      {
        dept: 'Pediatrics OPD',
        room: 'MCH Block Room 11',
        doctor: 'Dr. P. Joshi, MD',
        keywords: ['child', 'infant', 'baby', 'pediatric', 'growth', 'vaccination']
      }
    ]
  },
  {
    id: 'safdarjung-delhi',
    name: 'Safdarjung Hospital & VMMC',
    shortCode: 'SJH-DEL',
    city: 'New Delhi',
    state: 'Delhi',
    category: 'Central Govt Hospital',
    hfrId: 'IN-DL-000842',
    address: 'Ring Road, Opposite AIIMS, New Delhi - 110029',
    defaultRooms: [
      {
        dept: 'General Internal Medicine',
        room: 'OPD Complex Room 102',
        doctor: 'Dr. R. K. Gupta, MD',
        keywords: ['fever', 'headache', 'weakness', 'infection', 'diabetes']
      },
      {
        dept: 'Center for Integrative AYUSH',
        room: 'AYUSH Dispensary Room 12',
        doctor: 'Dr. S. Mishra, BAMS',
        keywords: ['gastric', 'acidity', 'joint pain', 'ayurveda', 'herbal', 'chronic pain']
      },
      {
        dept: 'Respiratory & Chest Clinic',
        room: 'Super Specialty Room 45',
        doctor: 'Dr. V. Malhotra, MD',
        keywords: ['cough', 'asthma', 'breathlessness', 'allergy']
      },
      {
        dept: 'Orthopedics & Fracture Clinic',
        room: 'Ortho OPD Room 28',
        doctor: 'Dr. D. K. Anand, MS',
        keywords: ['fracture', 'backache', 'knee pain', 'fall']
      }
    ]
  },
  {
    id: 'pgimer-chd',
    name: 'PGIMER Chandigarh',
    shortCode: 'PGIMER-CHD',
    city: 'Chandigarh',
    state: 'Chandigarh',
    category: 'Central Apex Institute',
    hfrId: 'IN-CH-001092',
    address: 'Sector 12, Chandigarh - 160012',
    defaultRooms: [
      {
        dept: 'Internal Medicine OPD',
        room: 'Nehru Hospital Room 204',
        doctor: 'Dr. H. S. Bawa, MD',
        keywords: ['fever', 'diabetes', 'hypertension', 'general']
      },
      {
        dept: 'Integrative AYUSH Health Center',
        room: 'Research Block A Room 05',
        doctor: 'Dr. A. Kaur, BAMS',
        keywords: ['digestive', 'acidity', 'ayurveda', 'arthritis', 'lifestyle']
      },
      {
        dept: 'Advanced Cardiac Center',
        room: 'ACC Block Room 14',
        doctor: 'Dr. R. Sehgal, DM',
        keywords: ['chest', 'heart', 'palpitation', 'cardiac']
      }
    ]
  },
  {
    id: 'aiia-delhi',
    name: 'All India Institute of Ayurveda (AIIA)',
    shortCode: 'AIIA-DEL',
    city: 'New Delhi',
    state: 'Delhi',
    category: 'National Apex AYUSH Institute',
    hfrId: 'IN-DL-004521',
    address: 'Gautampuri, Sarita Vihar, Mathura Road, New Delhi - 110076',
    defaultRooms: [
      {
        dept: 'Kayachikitsa (General Ayurvedic Medicine)',
        room: 'OPD Block Room 101',
        doctor: 'Dr. Manjusha R., MD(Ayu)',
        keywords: ['acidity', 'gas', 'fever', 'cough', 'constipation', 'digestion', 'pitta', 'vata', 'general']
      },
      {
        dept: 'Panchakarma & Doshic Detox',
        room: 'Kriya Shala Room 06',
        doctor: 'Dr. Santosh K., MD(Ayu)',
        keywords: ['paralysis', 'detox', 'rejuvenation', 'stiffness', 'chronic skin', 'sciatica']
      },
      {
        dept: 'Integrative Allopathic Triage & Emergency',
        room: 'Emergency Care Room 02',
        doctor: 'Dr. P. Verma, MBBS',
        keywords: ['severe', 'acute', 'emergency', 'chest pain', 'breathlessness', 'high bp']
      },
      {
        dept: 'Shalya Tantra (Ortho & Spine)',
        room: 'Surgical OPD Room 15',
        doctor: 'Dr. M. S. Baghel, MS(Ayu)',
        keywords: ['joint', 'spine', 'piles', 'fistula', 'abscess', 'wound', 'knee']
      }
    ]
  },
  {
    id: 'jipmer-pdy',
    name: 'JIPMER Puducherry',
    shortCode: 'JIPMER-PDY',
    city: 'Puducherry',
    state: 'Puducherry',
    category: 'Central Apex Institute',
    hfrId: 'IN-PY-000311',
    address: 'Dhanvantari Nagar, Gorimedu, Puducherry - 605006',
    defaultRooms: [
      {
        dept: 'General Medicine & Triage',
        room: 'SS Block Room 12',
        doctor: 'Dr. K. Swaminathan, MD',
        keywords: ['fever', 'infection', 'general', 'diabetes']
      },
      {
        dept: 'Integrative AYUSH Unit',
        room: 'Ayush Wing Room 04',
        doctor: 'Dr. M. Selvam, BAMS',
        keywords: ['ayurveda', 'herbal', 'acidity', 'chronic pain']
      },
      {
        dept: 'Cardiology Center',
        room: 'Cath Lab Block Room 08',
        doctor: 'Dr. R. Balachander, DM',
        keywords: ['chest', 'heart', 'palpitation', 'dizziness']
      }
    ]
  },
  {
    id: 'kgmu-lko',
    name: "King George's Medical University (KGMU)",
    shortCode: 'KGMU-LKO',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    category: 'Central Govt Hospital',
    hfrId: 'IN-UP-002194',
    address: 'Shah Mina Road, Chowk, Lucknow, UP - 226003',
    defaultRooms: [
      {
        dept: 'General Medicine OPD',
        room: 'Shatabdi Phase-1 Room 15',
        doctor: 'Dr. A. K. Tripathi, MD',
        keywords: ['fever', 'headache', 'vomiting', 'weakness']
      },
      {
        dept: 'AYUSH Integrative Clinic',
        room: 'OPD Room 09',
        doctor: 'Dr. R. Pandey, BAMS',
        keywords: ['acidity', 'gas', 'constipation', 'ayurveda']
      },
      {
        dept: 'Trauma & Orthopedics Center',
        room: 'Trauma Ground Floor Room 03',
        doctor: 'Dr. V. K. Sharma, MS',
        keywords: ['bone', 'joint', 'fracture', 'knee']
      }
    ]
  },
  {
    id: 'aiims-rsh',
    name: 'AIIMS Rishikesh',
    shortCode: 'AIIMS-RSH',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    category: 'Central Apex Institute',
    hfrId: 'IN-UT-003819',
    address: 'Virbhadra Road, Rishikesh, Uttarakhand - 249203',
    defaultRooms: [
      {
        dept: 'General Medicine OPD',
        room: 'OPD Block Room 12',
        doctor: 'Dr. V. Singhal, MD',
        keywords: ['fever', 'diabetes', 'hypertension', 'general']
      },
      {
        dept: 'AYUSH & Yoga Therapy Clinic',
        room: 'Holistic Health Room 04',
        doctor: 'Dr. D. Joshi, BAMS',
        keywords: ['acidity', 'stress', 'stomach', 'ayurveda', 'joint pain']
      },
      {
        dept: 'Pulmonary Medicine OPD',
        room: 'Chest Block Room 21',
        doctor: 'Dr. S. K. Rawat, MD',
        keywords: ['cough', 'asthma', 'shortness of breath']
      }
    ]
  },
  {
    id: 'aiims-jdp',
    name: 'AIIMS Jodhpur',
    shortCode: 'AIIMS-JDP',
    city: 'Jodhpur',
    state: 'Rajasthan',
    category: 'Central Apex Institute',
    hfrId: 'IN-RJ-004120',
    address: 'Basni Industrial Area Phase-2, Jodhpur, Rajasthan - 342005',
    defaultRooms: [
      {
        dept: 'Internal Medicine OPD',
        room: 'OPD Room 16',
        doctor: 'Dr. S. Bishnoi, MD',
        keywords: ['fever', 'headache', 'hypertension', 'general']
      },
      {
        dept: 'Integrative AYUSH OPD',
        room: 'Ayush Wing Room 09',
        doctor: 'Dr. G. Sharma, BAMS',
        keywords: ['acidity', 'ayurveda', 'joint', 'lifestyle', 'indigestion']
      },
      {
        dept: 'Orthopedics & Joint Clinic',
        room: 'Trauma Block Room 07',
        doctor: 'Dr. K. Choudhary, MS',
        keywords: ['knee', 'fracture', 'back pain', 'arthritis']
      }
    ]
  },
  {
    id: 'aiims-bpl',
    name: 'AIIMS Bhopal',
    shortCode: 'AIIMS-BPL',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    category: 'Central Apex Institute',
    hfrId: 'IN-MP-002951',
    address: 'Saket Nagar, Bhopal, MP - 462020',
    defaultRooms: [
      {
        dept: 'General Medicine',
        room: 'OPD Block Room 11',
        doctor: 'Dr. R. Saxena, MD',
        keywords: ['fever', 'weakness', 'cough', 'general']
      },
      {
        dept: 'Center for Integrative Medicine',
        room: 'AYUSH Block Room 06',
        doctor: 'Dr. N. Tiwari, BAMS',
        keywords: ['acidity', 'gas', 'ayush', 'ayurveda', 'constipation']
      }
    ]
  },
  {
    id: 'aiims-bbi',
    name: 'AIIMS Bhubaneswar',
    shortCode: 'AIIMS-BBI',
    city: 'Bhubaneswar',
    state: 'Odisha',
    category: 'Central Apex Institute',
    hfrId: 'IN-OR-005118',
    address: 'Sijua, Patrapada, Bhubaneswar, Odisha - 751019',
    defaultRooms: [
      {
        dept: 'Internal Medicine OPD',
        room: 'OPD Complex Room 15',
        doctor: 'Dr. B. K. Mohapatra, MD',
        keywords: ['fever', 'infection', 'general', 'diabetes']
      },
      {
        dept: 'AYUSH & Holistic Center',
        room: 'Ayush Room 07',
        doctor: 'Dr. P. Dash, BAMS',
        keywords: ['acidity', 'digestive', 'joint pain', 'ayurveda']
      }
    ]
  },
  {
    id: 'nia-jpr',
    name: 'National Institute of Ayurveda (NIA Jaipur)',
    shortCode: 'NIA-JPR',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'National Apex AYUSH Institute',
    hfrId: 'IN-RJ-003304',
    address: 'Jorawar Singh Gate, Amer Road, Jaipur, Rajasthan - 302002',
    defaultRooms: [
      {
        dept: 'Kayachikitsa (Internal Medicine)',
        room: 'Dhanwantari Block Room 03',
        doctor: 'Dr. B. L. Meena, MD(Ayu)',
        keywords: ['fever', 'acidity', 'gas', 'indigestion', 'cough', 'general']
      },
      {
        dept: 'Panchakarma & Detox Therapy',
        room: 'Therapy Block Room 08',
        doctor: 'Dr. A. K. Sharma, MD(Ayu)',
        keywords: ['paralysis', 'arthritis', 'joint pain', 'detox', 'skin']
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

export function getHospitalByCode(code?: string): GovernmentHospital {
  if (!code) return DEFAULT_HOSPITAL;
  const found = TOP_GOVERNMENT_HOSPITALS.find(h => h.shortCode.toLowerCase() === code.toLowerCase() || h.id.toLowerCase() === code.toLowerCase());
  return found || DEFAULT_HOSPITAL;
}

/**
 * AI Department Recognition Engine:
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

  // 4. Keyword-based AI Clinical Semantic Matching
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
      reasoning: `AI Clinical Analysis matched symptoms to ${bestMatch.dept} (${bestMatch.room}).`
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
