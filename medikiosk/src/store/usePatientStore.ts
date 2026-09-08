import { create } from 'zustand';
import { io } from 'socket.io-client';
import { supabase } from '../lib/supabase';

const socket = io('https://medikiosk-sih-2026.loca.lt', {
  extraHeaders: {
    "Bypass-Tunnel-Reminder": "true"
  }
});

export interface PatientProfile {
  abhaId: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  height: string;
  weight: string;
  chronicConditions: ChronicConditionItem[];
  allergies: AllergyItem[];
  uploadedDocuments: UploadedDocument[];
  pastVisits: {
    date: string;
    hospital: string;
    department: string;
    reason: string; // What the patient mentioned
    diagnosis?: string; // What happened / Doctor's diagnosis
    prescriptions?: string[]; // Prescribed medications
    patientVisibleNotes?: string; // Instructions for patient
    doctorNotesHidden: string;
  }[];
}

export interface DocumentLabResult {
  test: string;
  value: string;
  unit: string;
  range: string;
  isOutOfRange: boolean;
}

export interface DocumentMedication {
  name: string;
  dose: string;
  frequency: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary';
  date: string;
  extractedDiagnoses: string[];
  extractedMeds: DocumentMedication[];
  extractedLabs: DocumentLabResult[];
}

export interface ChronicConditionItem {
  condition: string;
  duration: string;
  medication: string;
  status: string;
  isDoctorVerified?: boolean;
}

export interface AllergyItem {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  isDoctorVerified?: boolean;
}

export interface StructuredSummary {
  chiefComplaintSummary: string;
  hpi: string;
  pastHistory: string;
  medicationsSummary: string;
  allergiesSummary: string;
  rosSummary: string;
  ayushSummary?: string;
  redFlagsSummary: string[];
  documentHighlights: string[];
  suggestedWorkup: string[];
}

export interface PatientData {
  patientId: string;
  token: string;
  abhaId: string;
  abhaVerified: boolean;
  name: string;
  age: string;
  gender: string;
  phone: string;
  height: string;
  weight: string;
  language: 'en' | 'hi';
  mode: 'modern' | 'ayush';
  
  // Step 1: Chief Complaint & Symptom Exploration (SOCRATES)
  chiefComplaint: string;
  chiefComplaintHi: string;
  symptomDuration: string;
  symptomSite: string;
  symptomCharacter: string;
  symptomRadiation: string;
  symptomTiming: string; // SOCRATES 'T' - Time course / diurnal timing pattern
  symptomSeverity: number; // 1-10
  aggravatingFactors: string;
  relievingFactors: string;
  associatedSymptoms: string[];

  // AYUSH Dashavidha / Ashtavidha Pariksha (Only populated if patient opts into AYUSH)
  prakriti: string;
  agni: string; // Digestive Fire
  koshtha: string; // Bowel Nature
  aharaVihara: string; // Diet & Lifestyle
  nidra: string; // Sleep quality
  ayushResponses?: { qId: string; answer: string; dosha: string }[];

  // Chronic & Allergies
  chronicConditions: ChronicConditionItem[];
  allergies: AllergyItem[];
  reviewOfSystems: string[];

  // Triage & Safety
  triageLevel: 'normal' | 'priority' | 'emergency';
  redFlags: string[];

  // Scanned Documents & OCR
  uploadedDocuments: UploadedDocument[];

  // Doctor & Consent
  consentHistory: boolean;
  consentDocuments: boolean;
  consentAyush: boolean;
  structuredSummary: StructuredSummary;
  doctorNotes: string;
  status: 'waiting' | 'in_consultation' | 'accepted' | 'amended' | 'rejected' | 'admitted';
  createdAt: string;

  // In-Patient Department (IPD) / Admission Tracking
  admittedWard?: string;
  bedNumber?: string;
  admissionDate?: string;
  ipdStage?: 'Observation' | 'Acute Care' | 'Stabilizing' | 'Ready for Discharge';
  ipdProgressNotes?: IpdProgressNote[];
  ipdMedications?: IpdMedication[];
  ipdVitals?: {
    spO2?: string;
    pulse?: string;
    bp?: string;
    temp?: string;
    respiratoryRate?: string;
  };

  // Hospital & Doctor Check-in Details
  hospitalCode?: string;
  hospitalName?: string;
  doctorNumber?: string;
  assignedDept?: string;
  assignedRoom?: string;
  queuePosition?: number;
}

export interface IpdProgressNote {
  id: string;
  timestamp: string;
  doctorName: string;
  note: string;
  vitalsSummary?: string;
}

export interface IpdMedication {
  id: string;
  name: string;
  dose: string;
  route: 'IV' | 'Oral' | 'SubQ' | 'Nebulization';
  schedule: string;
  lastGiven?: string;
  status: 'Active' | 'Held' | 'Completed';
}

interface PatientStore {
  currentPatient: PatientData;
  currentProfile: PatientProfile | null;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  updatePatient: (data: Partial<PatientData>) => void;
  updateProfile: (data: Partial<PatientProfile>) => void;
  checkProfileExists: (id: string) => boolean;
  loginProfile: (id: string, regData?: { name: string; age: string; gender: string }) => void;
  logoutProfile: () => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setMode: (mode: 'modern' | 'ayush') => void;
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;
  generatePatientToken: () => string;
  evaluateTriageAndSummary: () => void;
  saveToDatabase: () => void;
  resetPatient: () => void;
  loadPatient: (token: string) => PatientData | null;
  queueTrigger: number;
  triggerQueueUpdate: () => void;
  initSocket: () => void;
}

const createInitialPatient = (): PatientData => ({
  patientId: '',
  token: '',
  abhaId: '',
  abhaVerified: false,
  name: '',
  age: '',
  gender: 'Male',
  phone: '',
  height: '',
  weight: '',
  language: 'en',
  mode: 'modern',

  chiefComplaint: '',
  chiefComplaintHi: '',
  symptomDuration: '',
  symptomSite: '',
  symptomCharacter: '',
  symptomRadiation: '',
  symptomTiming: '',
  symptomSeverity: 5,
  aggravatingFactors: '',
  relievingFactors: '',
  associatedSymptoms: [],

  prakriti: '',
  agni: '',
  koshtha: '',
  aharaVihara: '',
  nidra: '',
  ayushResponses: [],

  chronicConditions: [],
  allergies: [],
  reviewOfSystems: [],

  triageLevel: 'normal',
  redFlags: [],

  uploadedDocuments: [],

  consentHistory: true,
  consentDocuments: true,
  consentAyush: false,

  structuredSummary: {
    chiefComplaintSummary: '',
    hpi: '',
    pastHistory: '',
    medicationsSummary: '',
    allergiesSummary: '',
    rosSummary: '',
    redFlagsSummary: [],
    documentHighlights: [],
    suggestedWorkup: [],
  },

  doctorNotes: '',
  status: 'waiting',
  createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  hospitalCode: '',
  hospitalName: '',
  doctorNumber: '',
  assignedDept: '',
  assignedRoom: '',
  queuePosition: 0,
});

// Seed Initial Mock Database with Realistic Cases
export const mockDatabase: Record<string, PatientData> = {
  'EMG-911': {
    patientId: 'EMG-911',
    token: 'EMG-911',
    abhaId: '88-3921-9941-0021',
    abhaVerified: true,
    name: 'Ramesh Kumar Sharma',
    age: '58',
    gender: 'Male',
    phone: '9811223344',
    height: '168',
    weight: '76',
    language: 'hi',
    mode: 'modern',
    chiefComplaint: 'Acute retrosternal chest pain with diaphoresis and breathlessness',
    chiefComplaintHi: 'सीने में तेज दबाव, पसीना और सांस लेने में कठिनाई',
    symptomDuration: 'Started 45 minutes ago',
    symptomSite: 'Center of chest radiating to left arm and jaw',
    symptomCharacter: 'Crushing elephant-on-chest pressure',
    symptomRadiation: 'Left shoulder, inner arm, lower jaw',
    symptomTiming: 'Constant unremitting crushing pressure since 45 minutes',
    symptomSeverity: 9,
    aggravatingFactors: 'Any slight movement or exertion',
    relievingFactors: 'None, persisting at complete rest',
    associatedSymptoms: ['Profuse cold sweating', 'Shortness of breath', 'Nausea / Lightheadedness'],
    prakriti: '',
    agni: '',
    koshtha: '',
    aharaVihara: '',
    nidra: '',
    chronicConditions: [
      { condition: 'Type 2 Diabetes Mellitus', duration: '8 years', medication: 'Tab Metformin 1000mg BD', status: 'Sub-optimally controlled' },
      { condition: 'Essential Hypertension', duration: '5 years', medication: 'Tab Telmisartan 40mg OD', status: 'Poor compliance' }
    ],
    allergies: [
      { allergen: 'Penicillin', reaction: 'Anaphylaxis / Urticaria', severity: 'severe' }
    ],
    reviewOfSystems: ['Dyspnea on mild exertion', 'Occasional orthopnea', 'Bilateral pedal edema'],
    triageLevel: 'emergency',
    redFlags: [
      'CRITICAL: Acute crushing retrosternal chest pain radiating to left arm',
      'CRITICAL: Associated diaphoresis (cold sweats) and acute dyspnea',
      'HIGH RISK: Diaphoretic presentation with known DM-2 and HTN background'
    ],
    uploadedDocuments: [
      {
        id: 'doc-1',
        name: 'MaxLab_Lipid_HbA1c_July2024.pdf',
        type: 'Lab Report',
        date: '14 Jul 2024',
        extractedDiagnoses: ['Hyperlipidemia', 'Poorly controlled Glycemia'],
        extractedMeds: [],
        extractedLabs: [
          { test: 'HbA1c', value: '9.4', unit: '%', range: '4.0 - 5.6', isOutOfRange: true },
          { test: 'Total Cholesterol', value: '248', unit: 'mg/dL', range: '< 200', isOutOfRange: true },
          { test: 'Serum Creatinine', value: '1.4', unit: 'mg/dL', range: '0.7 - 1.2', isOutOfRange: true }
        ]
      }
    ],
    consentHistory: true,
    consentDocuments: true,
    consentAyush: false,
    structuredSummary: {
      chiefComplaintSummary: '58-year-old male presenting with acute 45-minute history of severe retrosternal crushing pain.',
      hpi: 'Patient describes acute onset of retrosternal heaviness radiating to left shoulder and jaw, rated 9/10, accompanied by cold diaphoresis, dyspnea and nausea. Pain is unremitting at rest. Cardiovascular risk profile includes 8-year T2DM and 5-year HTN with prior documented dyslipidemia.',
      pastHistory: 'T2DM (8 yrs), Essential HTN (5 yrs). High cardiovascular risk profile.',
      medicationsSummary: 'Metformin 1000mg BD, Telmisartan 40mg OD (erratic compliance).',
      allergiesSummary: 'ALLERGY WARNING: Severe Penicillin allergy (anaphylactoid reaction).',
      rosSummary: 'Positive for acute diaphoresis, dyspnea, nausea. Negative for hemoptysis, fever.',
      redFlagsSummary: [
        'Acute Coronary Syndrome (STEMI / NSTEMI) suspected',
        'Immediate 12-lead ECG and Troponin-I protocol required',
        'Direct bypass to Emergency Resuscitation Bay'
      ],
      documentHighlights: [
        'HbA1c 9.4% (Severely Elevated)',
        'Cholesterol 248 mg/dL (Elevated)',
        'Borderline elevated Serum Creatinine (1.4 mg/dL)'
      ],
      suggestedWorkup: [
        'Stat 12-Lead ECG within 10 minutes',
        'High-sensitivity Cardiac Troponin I/T',
        'Aspirin 300mg + Clopidogrel 300mg loading if ECG positive & no contraindications',
        'Continuous cardiac monitoring & IV access'
      ]
    },
    doctorNotes: '',
    status: 'waiting',
    createdAt: '09:15 AM'
  },
  'AYU-402': {
    patientId: 'AYU-402',
    token: 'AYU-402',
    abhaId: '45-2019-3382-7711',
    abhaVerified: true,
    name: 'Sunita Devi Verma',
    age: '44',
    gender: 'Female',
    phone: '9844332211',
    height: '158',
    weight: '62',
    language: 'hi',
    mode: 'ayush',
    chiefComplaint: 'Chronic Amlapitta (Acid peptic distress), bloating and Sandhivata (knee stiffness)',
    chiefComplaintHi: 'पेट में जलन, खट्टी डकारें, गैस और घुटनों में जकड़न',
    symptomDuration: '3 months, worsening over last 2 weeks',
    symptomSite: 'Epigastrium and bilateral knee joints',
    symptomCharacter: 'Vidaha (burning), Gaurava (heaviness), Sandhishoola',
    symptomRadiation: 'Retro-sternal burning upward radiation',
    symptomTiming: 'Epigastric burning worse 1-2 hours post meals; knee stiffness worse in mornings on rising',
    symptomSeverity: 6,
    aggravatingFactors: 'Pungent, oily foods (Katu/Amla Ahara), mental stress, fasting',
    relievingFactors: 'Cold milk, light bland diet (Laghu Ahara)',
    associatedSymptoms: ['Sour belching (Amlodgara)', 'Early morning joint stiffness', 'Lethargy (Alasya)'],
    prakriti: 'Pitta-Vata',
    agni: 'Tikshnagni with Vishamata (erratic burning appetite)',
    koshtha: 'Krura Koshtha (Vibandha / constipation tendency)',
    aharaVihara: 'Irregular breakfast, excessive tea consumption (5-6 cups/day), late dinners',
    nidra: 'Alpa Nidra (fragmented sleep < 6 hrs)',
    chronicConditions: [
      { condition: 'Amlapitta / Dyspepsia', duration: '2 years', medication: 'Occasional Pantoprazole 40mg', status: 'Recurrent' },
      { condition: 'Bilateral Knee Osteoarthritis (Early)', duration: '1 year', medication: 'Calcium + Vit D3', status: 'Mild functional limitation' }
    ],
    allergies: [
      { allergen: 'Sulfa Drugs', reaction: 'Skin rashes', severity: 'moderate' }
    ],
    reviewOfSystems: ['No hematemesis, no melena', 'Morning stiffness < 30 mins', 'No inflammatory joint swelling'],
    triageLevel: 'normal',
    redFlags: [],
    uploadedDocuments: [
      {
        id: 'doc-2',
        name: 'Prescription_CivilHospital_April.jpg',
        type: 'Prescription',
        date: '22 Apr 2024',
        extractedDiagnoses: ['Acid Peptic Disease', 'Early Bilateral Knee OA'],
        extractedMeds: [
          { name: 'Pantoprazole 40mg', dose: '1 tab', frequency: 'Before breakfast' },
          { name: 'Paracetamol 650mg', dose: '1 tab', frequency: 'SOS for knee ache' }
        ],
        extractedLabs: [
          { test: 'Serum Uric Acid', value: '5.2', unit: 'mg/dL', range: '2.5 - 6.5', isOutOfRange: false },
          { test: 'ESR', value: '24', unit: 'mm/hr', range: '0 - 20', isOutOfRange: true }
        ]
      }
    ],
    consentHistory: true,
    consentDocuments: true,
    consentAyush: true,
    structuredSummary: {
      chiefComplaintSummary: '44-year-old female presenting with 3-month history of Amlapitta (acid peptic burning) and early Sandhivata symptoms.',
      hpi: 'Patient reports persistent burning in epigastrium (Vidaha), acid regurgitation (Amlodgara), and constipation (Vibandha). Symptoms severely exacerbated by tea and spicy diet. Bilateral knee stiffness noted on rising in mornings.',
      pastHistory: 'Recurrent dyspepsia over 2 years, episodic NSAID self-medication.',
      medicationsSummary: 'Pantoprazole 40mg PRN, Paracetamol SOS.',
      allergiesSummary: 'Sulfa allergy (erythematous rash).',
      rosSummary: 'Negative for GI bleeding, weight loss, dysphagia.',
      ayushSummary: 'Prakriti: Pitta-Vata | Agni: Tikshna/Vishama | Koshtha: Krura (Constipation) | Dhatu affected: Rasa, Asthi, Majja | Dosha Dushti: Pitta-Vata dominant.',
      redFlagsSummary: [],
      documentHighlights: [
        'ESR slightly elevated at 24 mm/hr',
        'Chronic PPI dependence noted from April prescription'
      ],
      suggestedWorkup: [
        'Deepana-Pachana protocol (e.g. Shunthi + Musta)',
        'Virechana / Sukhamridu Virechana consideration for Pitta-Vata shamana',
        'Stool Occult Blood (routine screen for chronic dyspepsia)'
      ]
    },
    doctorNotes: '',
    status: 'waiting',
    createdAt: '09:40 AM'
  },
  'GEN-108': {
    patientId: 'GEN-108',
    token: 'GEN-108',
    abhaId: '22-8190-4491-1002',
    abhaVerified: true,
    name: 'Aarav Patel',
    age: '29',
    gender: 'Male',
    phone: '9765432100',
    height: '175',
    weight: '70',
    language: 'en',
    mode: 'modern',
    chiefComplaint: 'Productive cough, low-grade evening fever and wheezing for 5 days',
    chiefComplaintHi: '5 दिनों से खांसी, हल्का बुखार और सांस में घरघराहट',
    symptomDuration: '5 days',
    symptomSite: 'Chest / Upper respiratory tract',
    symptomCharacter: 'Productive cough with yellowish phlegm, chest tightness',
    symptomRadiation: 'None',
    symptomTiming: 'Cough worse at night and early morning; daytime episodes triggered by cold air',
    symptomSeverity: 5,
    aggravatingFactors: 'Cold air exposure, night time, dust',
    relievingFactors: 'Steam inhalation, warm fluids',
    associatedSymptoms: ['Wheezing on exhalation', 'Nasal congestion', 'Mild fatigue'],
    prakriti: '',
    agni: '',
    koshtha: '',
    aharaVihara: '',
    nidra: '',
    chronicConditions: [
      { condition: 'Bronchial Asthma (Childhood onset)', duration: 'Since age 12', medication: 'Inhaler Budecort 200mcg SOS', status: 'Intermittent' }
    ],
    allergies: [
      { allergen: 'Dust Mites & Pollen', reaction: 'Allergic rhinitis & bronchospasm', severity: 'moderate' }
    ],
    reviewOfSystems: ['No hemoptysis', 'No weight loss', 'No pleuritic pain'],
    triageLevel: 'priority',
    redFlags: [
      'Wheezing exacerbation in known asthmatic patient'
    ],
    uploadedDocuments: [],
    consentHistory: true,
    consentDocuments: true,
    consentAyush: false,
    structuredSummary: {
      chiefComplaintSummary: '29-year-old male asthmatic presenting with 5-day acute lower respiratory infection and wheeze.',
      hpi: 'Patient developed productive cough with yellowish sputum, low-grade fevers, and nocturnal wheezing. Relies on SOS Budesonide inhaler. No hemoptysis, no chest pain on inspiration.',
      pastHistory: 'Childhood bronchial asthma with atopic history.',
      medicationsSummary: 'Budecort 200mcg PRN.',
      allergiesSummary: 'Environmental dust/pollen atopy.',
      rosSummary: 'Positive for productive sputum and wheezing. Negative for hemoptysis, chest pain.',
      redFlagsSummary: ['Exacerbation of underlying reactive airway disease'],
      documentHighlights: ['No prior documents uploaded in this visit'],
      suggestedWorkup: [
        'Peak Expiratory Flow Rate (PEFR)',
        'Complete Blood Count (CBC) with Differential (Eosinophil count)',
        'Chest X-Ray (PA view) if fever persists'
      ]
    },
    doctorNotes: '',
    status: 'waiting',
    createdAt: '10:05 AM'
  },
  'IPD-304': {
    patientId: 'IPD-304',
    token: 'IPD-304',
    abhaId: '33-9120-7714-8890',
    abhaVerified: true,
    name: 'Kavita Rajesh Singhania',
    age: '52',
    gender: 'Female',
    phone: '9822334455',
    height: '162',
    weight: '68',
    language: 'en',
    mode: 'modern',
    chiefComplaint: 'Severe acute exacerbation of Bronchial Asthma with secondary lower respiratory tract infection',
    chiefComplaintHi: 'गंभीर दमा और श्वसन संक्रमण के कारण सांस फूलना',
    symptomDuration: 'Admitted 3 days ago',
    symptomSite: 'Chest / Lungs bilaterally',
    symptomCharacter: 'Severe expiratory wheezing and breathlessness',
    symptomRadiation: 'None',
    symptomTiming: 'Continuous dyspnea on admission; now stabilizing with mild morning tightness',
    symptomSeverity: 8,
    aggravatingFactors: 'Exertion, cold air',
    relievingFactors: 'Supplemental O2, IV bronchodilators',
    associatedSymptoms: ['Tachypnea', 'Productive cough', 'Chest tightness'],
    prakriti: '',
    agni: '',
    koshtha: '',
    aharaVihara: '',
    nidra: '',
    chronicConditions: [
      { condition: 'Severe Chronic Bronchial Asthma', duration: '15 years', medication: 'Inhaler Formoterol + Budesonide', status: 'Under treatment' },
      { condition: 'Mild Essential Hypertension', duration: '3 years', medication: 'Tab Amlodipine 5mg OD', status: 'Stable' }
    ],
    allergies: [
      { allergen: 'NSAIDs (Aspirin)', reaction: 'Bronchospasm / Asthma exacerbation', severity: 'severe' }
    ],
    reviewOfSystems: ['No hemoptysis', 'No chest pain', 'Bilateral wheezing clearing'],
    triageLevel: 'priority',
    redFlags: ['Asthma flare-up requiring inpatient monitoring'],
    uploadedDocuments: [],
    consentHistory: true,
    consentDocuments: true,
    consentAyush: false,
    structuredSummary: {
      chiefComplaintSummary: '52-year-old female admitted for acute exacerbation of severe asthma with secondary infection.',
      hpi: 'Patient presented with severe dyspnea, wheezing and productive cough. SpO2 on admission was 89% room air. Admitted to Ward 4B for oxygen therapy, IV steroids and nebulization protocol.',
      pastHistory: 'Chronic asthma (15 yrs), HTN (3 yrs). Known aspirin sensitivity.',
      medicationsSummary: 'IV Ceftriaxone, IV Hydrocortisone, Nebulization Duolin, IV Pantoprazole.',
      allergiesSummary: 'Aspirin/NSAID induced asthma.',
      rosSummary: 'Chest wheeze improving, SpO2 96% on room air.',
      redFlagsSummary: ['Inpatient respiratory care'],
      documentHighlights: [],
      suggestedWorkup: ['Daily PEFR', 'Serial SpO2 monitoring', 'Step down to oral steroids']
    },
    doctorNotes: 'Day 3 Rounds: Patient afebrile, wheeze markedly reduced. Plan: Wean off IV steroids to oral Prednisolone. Prepare for discharge tomorrow.',
    status: 'admitted',
    createdAt: '08:30 AM',
    admittedWard: 'Pulmonary Ward 4B (Acute Care)',
    bedNumber: 'Bed 12',
    admissionDate: '06 Sep 2026, 04:15 PM (Day 3)',
    ipdStage: 'Stabilizing',
    ipdVitals: {
      spO2: '96%',
      pulse: '82 bpm',
      bp: '126/80 mmHg',
      temp: '98.6°F',
      respiratoryRate: '18/min'
    },
    ipdMedications: [
      { id: 'm1', name: 'IV Ceftriaxone', dose: '1g in 100ml NS', route: 'IV', schedule: 'BID (08:00 AM / 08:00 PM)', lastGiven: 'Today 08:00 AM (Nurse Sunita)', status: 'Active' },
      { id: 'm2', name: 'IV Hydrocortisone', dose: '100mg Bolus', route: 'IV', schedule: 'TID (06:00 / 14:00 / 22:00)', lastGiven: 'Today 02:00 PM', status: 'Active' },
      { id: 'm3', name: 'Nebulization Duolin', dose: '2.5ml Respule', route: 'Nebulization', schedule: 'Q6H (Every 6 hrs)', lastGiven: 'Today 12:00 PM', status: 'Active' },
      { id: 'm4', name: 'IV Pantoprazole', dose: '40mg', route: 'IV', schedule: 'OD (Morning before food)', lastGiven: 'Today 07:00 AM', status: 'Active' },
      { id: 'm5', name: 'Tab Paracetamol', dose: '650mg Oral', route: 'Oral', schedule: 'SOS (If Temp > 100°F)', lastGiven: 'Yesterday 09:00 PM', status: 'Active' }
    ],
    ipdProgressNotes: [
      { id: 'n1', timestamp: '06 Sep, 05:00 PM (Admission)', doctorName: 'Dr. R. Verma, MD', note: 'Admitted from Emergency with acute exacerbation of severe asthma & lower respiratory infection. Wheezing +++, SpO2 89% on room air. Started on 2L O2, IV steroids, IV antibiotics and scheduled nebulizations.', vitalsSummary: 'SpO2: 89% | BP: 142/90 | HR: 104' },
      { id: 'n2', timestamp: '07 Sep, 09:30 AM (Day 2 Morning Rounds)', doctorName: 'Dr. R. Verma, MD', note: 'Dyspnea significantly improved. Wheezing diminished, SpO2 94% on 2L O2. Patient able to speak in full sentences. Chest air entry improved bilaterally. Continued current IV regimen.', vitalsSummary: 'SpO2: 94% | BP: 132/84 | HR: 90' },
      { id: 'n3', timestamp: '08 Sep, 08:45 AM (Day 3 Today\'s Rounds)', doctorName: 'Dr. R. Verma, MD', note: 'Patient afebrile for past 24 hours. Cough productive with thinning sputum. SpO2 96% maintaining well on room air. Plan: Wean off supplemental O2. Step down IV Hydrocortisone to oral Prednisolone 30mg tomorrow. Discharge planned for Day 4 if stable.', vitalsSummary: 'SpO2: 96% | BP: 126/80 | HR: 82' }
    ]
  }
};

export const mockProfiles: Record<string, PatientProfile> = {
  '9811223344': {
    abhaId: '88-3921-9941-0021',
    name: 'Ramesh Kumar Sharma',
    age: '58',
    gender: 'Male',
    phone: '9811223344',
    height: '168',
    weight: '76',
    chronicConditions: [
      { condition: 'Type 2 Diabetes Mellitus', duration: '8 years', medication: 'Tab Metformin 1000mg BD', status: 'Sub-optimally controlled', isDoctorVerified: true },
      { condition: 'Essential Hypertension', duration: '5 years', medication: 'Tab Telmisartan 40mg OD', status: 'Poor compliance', isDoctorVerified: true },
      { condition: 'Mild Joint Pain', duration: '6 months', medication: 'Paracetamol PRN', status: 'Self-reported', isDoctorVerified: false }
    ],
    allergies: [
      { allergen: 'Penicillin', reaction: 'Anaphylaxis / Urticaria', severity: 'severe', isDoctorVerified: true },
      { allergen: 'Dust', reaction: 'Sneezing', severity: 'mild', isDoctorVerified: false }
    ],
    uploadedDocuments: [
      {
        id: 'doc-1',
        name: 'MaxLab_Lipid_HbA1c_July2024.pdf',
        type: 'Lab Report',
        date: '14 Jul 2024',
        extractedDiagnoses: ['Hyperlipidemia', 'Poorly controlled Glycemia'],
        extractedMeds: [],
        extractedLabs: [
          { test: 'HbA1c', value: '9.4', unit: '%', range: '4.0 - 5.6', isOutOfRange: true },
          { test: 'Total Cholesterol', value: '248', unit: 'mg/dL', range: '< 200', isOutOfRange: true },
          { test: 'Serum Creatinine', value: '1.4', unit: 'mg/dL', range: '0.7 - 1.2', isOutOfRange: true }
        ]
      }
    ],
    pastVisits: [
      {
        date: '10 Aug 2024',
        hospital: 'City Hospital',
        department: 'General Medicine',
        reason: 'Routine checkup for BP, experiencing mild dizziness.',
        diagnosis: 'Hypertensive crisis secondary to non-compliance',
        prescriptions: ['Tab Telmisartan 40mg OD', 'Tab Amlodipine 5mg OD'],
        patientVisibleNotes: 'Please take your BP medicines regularly. Cut down salt intake to less than 1 tsp per day. Follow up in 1 month with lipid profile.',
        doctorNotesHidden: 'Patient non-compliant with Telmisartan. Re-emphasized diet control. Warned about cardiovascular risks.'
      },
      {
        date: '15 Mar 2024',
        hospital: 'AIIMS Delhi',
        department: 'Endocrinology',
        reason: 'High blood sugar readings at home.',
        diagnosis: 'Uncontrolled Type 2 Diabetes',
        prescriptions: ['Tab Metformin 1000mg BD', 'Tab Glimepiride 1mg OD'],
        patientVisibleNotes: 'Continue strict diabetic diet. Avoid sweets and simple carbs. Start daily 30-minute brisk walk.',
        doctorNotesHidden: 'HbA1c at 9.4%. Added sulfonylurea. Monitor for hypoglycemia.'
      }
    ]
  }
};

export const usePatientStore = create<PatientStore>((set, get) => ({
  currentPatient: createInitialPatient(),
  currentProfile: null,
  soundEnabled: true,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  updatePatient: (data) =>
    set((state) => ({
      currentPatient: { ...state.currentPatient, ...data },
    })),

  updateProfile: (data) =>
    set((state) => ({
      currentProfile: state.currentProfile ? { ...state.currentProfile, ...data } : null,
    })),

  checkProfileExists: (id) => {
    return Object.values(mockProfiles).some(p => p.phone === id || p.abhaId === id);
  },

  loginProfile: (id, regData) => {
    // Mock login by matching phone or abhaId
    const profile = Object.values(mockProfiles).find(p => p.phone === id || p.abhaId === id);
    if (profile) {
      set({ currentProfile: profile });
      // pre-fill patient data with profile
      set((state) => ({
        currentPatient: {
          ...state.currentPatient,
          name: profile.name,
          phone: profile.phone,
          age: profile.age,
          gender: profile.gender,
          abhaId: profile.abhaId,
          chronicConditions: profile.chronicConditions,
          allergies: profile.allergies,
          uploadedDocuments: profile.uploadedDocuments,
        }
      }));
    } else {
      // Create new profile with regData
      const newProfile: PatientProfile = {
        abhaId: id.includes('-') ? id : 'Pending',
        name: regData?.name || 'New Patient',
        age: regData?.age || '30',
        gender: regData?.gender || 'Male',
        phone: id.includes('-') ? 'Pending' : id,
        height: '',
        weight: '',
        chronicConditions: [],
        allergies: [],
        uploadedDocuments: [],
        pastVisits: []
      };
      
      // Save to mockProfiles so they can login again
      mockProfiles[id] = newProfile;
      
      set({ currentProfile: newProfile });
      set((state) => ({
        currentPatient: {
          ...state.currentPatient,
          name: newProfile.name,
          phone: newProfile.phone,
          age: newProfile.age,
          gender: newProfile.gender,
          abhaId: newProfile.abhaId,
        }
      }));
    }
  },

  logoutProfile: () => {
    set({ currentProfile: null, currentPatient: createInitialPatient() });
  },

  setLanguage: (lang) =>
    set((state) => ({
      currentPatient: { ...state.currentPatient, language: lang },
    })),

  setMode: (mode) =>
    set((state) => ({
      currentPatient: { ...state.currentPatient, mode: mode },
    })),

  addDocument: (doc) =>
    set((state) => ({
      currentPatient: {
        ...state.currentPatient,
        uploadedDocuments: [...state.currentPatient.uploadedDocuments, doc],
      },
    })),

  removeDocument: (id) =>
    set((state) => ({
      currentPatient: {
        ...state.currentPatient,
        uploadedDocuments: state.currentPatient.uploadedDocuments.filter((d) => d.id !== id),
      },
    })),

  generatePatientToken: () => {
    const existing = get().currentPatient.token;
    if (existing) return existing;
    const prefix = get().currentPatient.mode === 'ayush' ? 'AYU' : 'MED';
    const rand = Math.floor(100 + Math.random() * 900);
    const newToken = `${prefix}-${rand}`;
    set((state) => ({
      currentPatient: { ...state.currentPatient, token: newToken, patientId: newToken },
    }));
    return newToken;
  },

  evaluateTriageAndSummary: () => {
    const p = get().currentPatient;
    const redFlags: string[] = [];
    let triage: 'normal' | 'priority' | 'emergency' = 'normal';

    const textToScan = `${p.chiefComplaint} ${p.chiefComplaintHi} ${p.symptomCharacter} ${p.symptomRadiation} ${p.associatedSymptoms.join(' ')}`.toLowerCase();

    // Red flag clinical rules
    if (
      (textToScan.includes('chest') || textToScan.includes('सीने') || textToScan.includes('pressure') || textToScan.includes('दबाव')) &&
      (textToScan.includes('sweat') || textToScan.includes('पसीना') || textToScan.includes('arm') || textToScan.includes('breath') || textToScan.includes('सांस'))
    ) {
      triage = 'emergency';
      redFlags.push('RED FLAG: Suspected Acute Coronary Syndrome (Chest discomfort with radiation/diaphoresis)');
    } else if (textToScan.includes('stroke') || textToScan.includes('weakness') || textToScan.includes('slur') || textToScan.includes('लकवा')) {
      triage = 'emergency';
      redFlags.push('RED FLAG: Acute Neurological Deficit / Possible CVA stroke signs');
    } else if (textToScan.includes('blood') || textToScan.includes('खून') || textToScan.includes('hemoptysis') || textToScan.includes('vomiting blood')) {
      triage = 'emergency';
      redFlags.push('RED FLAG: Significant active hemorrhage / hemoptysis');
    } else if (p.symptomSeverity >= 8) {
      triage = 'priority';
      redFlags.push('High pain score (≥ 8/10)');
    }

    // Document highlights
    const docHighlights: string[] = [];
    p.uploadedDocuments.forEach((doc) => {
      doc.extractedLabs.forEach((lab) => {
        if (lab.isOutOfRange) {
          docHighlights.push(`Out of range: ${lab.test} is ${lab.value} ${lab.unit} (Ref: ${lab.range})`);
        }
      });
      if (doc.extractedDiagnoses.length) {
        docHighlights.push(`Prior diagnosed: ${doc.extractedDiagnoses.join(', ')}`);
      }
    });

    // Suggested workup
    const suggested: string[] = [];
    if (triage === 'emergency') {
      suggested.push('Stat 12-Lead ECG & continuous telemetry');
      suggested.push('Serum Troponin I / T');
      suggested.push('Immediate Triage Nurse bedside review');
    } else if (textToScan.includes('fever') || textToScan.includes('cough')) {
      suggested.push('Complete Blood Count (CBC) with ESR');
      suggested.push('Chest X-Ray PA View');
    } else if (textToScan.includes('abdominal') || textToScan.includes('stomach') || textToScan.includes('acidity')) {
      suggested.push('Ultrasound Whole Abdomen (USG)');
      suggested.push('Liver Function Test (LFT) & Serum Amylase/Lipase if acute');
    } else {
      suggested.push('Baseline Complete Hemogram');
      suggested.push('Vitals re-check: BP, Pulse, SpO2');
    }

    // Synthesis of HPI
    const hpiText = `${p.age || 'Patient'} ${p.gender} presenting with chief complaint of ${p.chiefComplaint || 'unspecified complaints'}. Symptom onset was ${p.symptomDuration || 'recent'}, characterized as ${p.symptomCharacter || 'discomfort'}, localized to ${p.symptomSite || 'affected region'}, severity rated ${p.symptomSeverity}/10. Aggravated by: ${p.aggravatingFactors || 'N/A'}; relieved by: ${p.relievingFactors || 'N/A'}. Associated symptoms: ${p.associatedSymptoms.length ? p.associatedSymptoms.join(', ') : 'None denied'}.`;

    const pastText = p.chronicConditions.length
      ? p.chronicConditions.map((c) => `${c.condition} (${c.duration}) - on ${c.medication || 'No meds'} [${c.status || 'Active'}]`).join('; ')
      : 'No significant past chronic medical illnesses reported.';

    const medText = p.chronicConditions
      .filter((c) => c.medication)
      .map((c) => c.medication)
      .join(', ') || 'No chronic daily medications listed.';

    const allergyText = p.allergies.length
      ? p.allergies.map((a) => `${a.allergen} (Reaction: ${a.reaction}, Severity: ${a.severity.toUpperCase()})`).join('; ')
      : 'No known drug or food allergies (NKDA).';

    const rosText = p.reviewOfSystems.length
      ? `Positive systems: ${p.reviewOfSystems.join(', ')}`
      : 'Review of systems non-contributory beyond presenting illness.';

    const ayushText = p.mode === 'ayush'
      ? `Prakriti: ${p.prakriti} | Agni: ${p.agni} | Koshtha: ${p.koshtha} | Ahara-Vihara: ${p.aharaVihara} | Nidra: ${p.nidra}` +
        (p.ayushResponses?.length ? `\nPariksha Responses: ${p.ayushResponses.map(r => r.answer).join(', ')}` : '')
      : undefined;

    // Department & Room routing
    let assignedDept = 'General Medicine OPD';
    let assignedRoom = 'Room 101, Ground Floor';

    if (p.mode === 'ayush') {
      assignedDept = 'AYUSH / Ayurveda Department';
      assignedRoom = 'Room 401, Heritage Wing';
    } else if (textToScan.includes('chest') || textToScan.includes('heart') || textToScan.includes('सीने') || textToScan.includes('cardio') || triage === 'emergency') {
      assignedDept = 'Cardiology / Emergency OPD';
      assignedRoom = 'Emergency Bay / Room 204';
    } else if (textToScan.includes('fever') || textToScan.includes('बुखार') || textToScan.includes('chill') || textToScan.includes('shivering')) {
      assignedDept = 'General Medicine & Fever Clinic';
      assignedRoom = 'Room 105, Ground Floor';
    } else if (textToScan.includes('stomach') || textToScan.includes('abdomen') || textToScan.includes('पेट') || textToScan.includes('acidity') || textToScan.includes('vomit') || textToScan.includes('loose')) {
      assignedDept = 'Gastroenterology OPD';
      assignedRoom = 'Room 305, 3rd Floor';
    } else if (textToScan.includes('joint') || textToScan.includes('knee') || textToScan.includes('back') || textToScan.includes('कमर') || textToScan.includes('घुटने') || textToScan.includes('headache') || textToScan.includes('सिरदर्द')) {
      assignedDept = 'Orthopedics & Spine Clinic';
      assignedRoom = 'Room 112, 1st Floor';
    }

    set((state) => ({
      currentPatient: {
        ...state.currentPatient,
        triageLevel: triage,
        redFlags: redFlags,
        assignedDept,
        assignedRoom,
        structuredSummary: {
          chiefComplaintSummary: p.chiefComplaint || 'Intake completed',
          hpi: hpiText,
          pastHistory: pastText,
          medicationsSummary: medText,
          allergiesSummary: allergyText,
          rosSummary: rosText,
          ayushSummary: ayushText,
          redFlagsSummary: redFlags,
          documentHighlights: docHighlights,
          suggestedWorkup: suggested,
        },
      },
    }));
  },

  saveToDatabase: () => {
    const p = get().currentPatient;
    if (!p.token) {
      get().generatePatientToken();
    }
    const token = get().currentPatient.token;
    const fullPatient = { ...get().currentPatient, token };
    mockDatabase[token] = fullPatient;

    // Sync active visit to currentProfile if logged in
    const prof = get().currentProfile;
    if (prof) {
      const existingVisits = prof.pastVisits || [];
      const newVisit = {
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        hospital: fullPatient.hospitalName || fullPatient.hospitalCode || 'AIIMS Hospital',
        department: fullPatient.assignedDept || 'General Medicine OPD',
        reason: fullPatient.chiefComplaint || 'Consultation intake',
        diagnosis: fullPatient.structuredSummary?.chiefComplaintSummary || 'Active consultation in progress',
        prescriptions: [],
        doctorNotesHidden: `Token ${token} - Waiting in corridor. Doctor: ${fullPatient.doctorNumber || 'Room 14'}`
      };
      
      const visitExists = existingVisits.some(v => v.reason === fullPatient.chiefComplaint && v.date === newVisit.date);
      if (!visitExists) {
        get().updateProfile({
          pastVisits: [newVisit, ...existingVisits]
        });
      }
    }

    // Push to Supabase Cloud Database (if table exists)
    try {
      supabase.from('patients').upsert({
        token: fullPatient.token,
        patient_id: fullPatient.patientId,
        abha_id: fullPatient.abhaId,
        name: fullPatient.name,
        age: fullPatient.age,
        gender: fullPatient.gender,
        phone: fullPatient.phone,
        chief_complaint: fullPatient.chiefComplaint,
        triage_level: fullPatient.triageLevel,
        status: fullPatient.status,
        admitted_ward: fullPatient.admittedWard,
        bed_number: fullPatient.bedNumber,
        admission_date: fullPatient.admissionDate,
        ipd_stage: fullPatient.ipdStage,
        data: fullPatient
      }).then(({ error }) => {
        if (error) console.warn('Supabase save note:', error.message);
      });
    } catch (e) {
      console.warn('Supabase sync error:', e);
    }

    // Real-time sync to Doctor's Dashboard (50ms latency)
    socket.emit('patient_intake_submitted', fullPatient);
  },

  resetPatient: () => {
    set({ currentPatient: createInitialPatient() });
  },

  loadPatient: (token: string) => {
    const found = mockDatabase[token.trim().toUpperCase()];
    return found || null;
  },

  queueTrigger: 0,
  triggerQueueUpdate: () => set((state) => ({ queueTrigger: state.queueTrigger + 1 })),

  initSocket: () => {
    socket.off('new_patient_in_queue');
    socket.on('new_patient_in_queue', (data: PatientData) => {
      mockDatabase[data.token] = data;
      get().triggerQueueUpdate();
    });

    // Supabase cloud data initialization
    try {
      supabase.from('patients').select('*').then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          data.forEach((row: any) => {
            if (row.data && row.token) {
              mockDatabase[row.token] = row.data;
            }
          });
          get().triggerQueueUpdate();
        }
      });

      // Supabase Realtime channel across devices
      supabase
        .channel('public:patients')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'patients' },
          (payload) => {
            const patientData = (payload.new as any)?.data;
            if (patientData && patientData.token) {
              mockDatabase[patientData.token] = patientData;
              get().triggerQueueUpdate();
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Supabase Realtime:', e);
    }
  }
}));

export const syncPatientToSupabase = async (patient: PatientData) => {
  try {
    const { error } = await supabase.from('patients').upsert({
      token: patient.token,
      patient_id: patient.patientId,
      abha_id: patient.abhaId,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      chief_complaint: patient.chiefComplaint,
      triage_level: patient.triageLevel,
      status: patient.status,
      admitted_ward: patient.admittedWard,
      bed_number: patient.bedNumber,
      admission_date: patient.admissionDate,
      ipd_stage: patient.ipdStage,
      data: patient
    });
    if (error) console.warn('Supabase upsert error:', error.message);
  } catch (err) {
    console.warn('Supabase error:', err);
  }
};
