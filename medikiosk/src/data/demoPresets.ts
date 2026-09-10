import type { PatientData, PatientProfile } from '../store/usePatientStore';

export interface DemoPresetItem {
  id: string;
  badgeNumber: number;
  label: string;
  category: 'Cardiac Emergency' | 'Respiratory / Asthma' | 'AYUSH / Integrative' | 'Neurology' | 'Diabetic Complication' | 'Acute Dehydration' | 'Orthopedics';
  patient: PatientData;
  personaProfile?: PatientProfile;
}

export const DEMO_PRESET_PATIENTS: DemoPresetItem[] = [
  {
    id: 'demo-cardiac',
    badgeNumber: 1,
    label: 'Ramesh Kumar Sharma',
    category: 'Cardiac Emergency',
    patient: {
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
      chiefComplaint: 'Acute retrosternal crushing chest pain with diaphoresis and breathlessness',
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
      esiTriage: {
        level: 1,
        category: 'Resuscitation',
        color: '#ef4444',
        badgeBg: 'bg-red-500/10',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-500/30',
        rationale: 'Acute crushing retrosternal chest pain with left arm/jaw radiation, severe diaphoresis and dyspnea in a known diabetic. High probability of STEMI.',
        immediateActions: [
          'Immediate transfer to Emergency Resuscitation Bay',
          'Stat 12-lead ECG within 10 minutes',
          'High-sensitivity Troponin-I/T',
          'Aspirin 300mg + Clopidogrel 300mg stat loading',
          'Continuous cardiac telemetry & IV access'
        ],
        predictedResources: ['12-Lead ECG', 'Serial Cardiac Troponins', 'IV Cannulation', 'Continuous Telemetry', 'Chest Radiograph'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: false,
      structuredSummary: {
        chiefComplaintSummary: '58-year-old male presenting with acute 45-minute history of severe retrosternal crushing pain.',
        hpi: 'Patient describes acute onset of retrosternal heaviness radiating to left shoulder and jaw, rated 9/10, accompanied by cold diaphoresis, dyspnea and nausea.',
        pastHistory: 'T2DM (8 yrs), Essential HTN (5 yrs). High cardiovascular risk profile.',
        medicationsSummary: 'Metformin 1000mg BD, Telmisartan 40mg OD.',
        allergiesSummary: 'ALLERGY WARNING: Severe Penicillin allergy.',
        rosSummary: 'Positive for acute diaphoresis, dyspnea, nausea. Negative for hemoptysis, fever.',
        redFlagsSummary: [
          'Acute Coronary Syndrome (STEMI / NSTEMI) suspected',
          'Immediate 12-lead ECG and Troponin-I protocol required'
        ],
        documentHighlights: [],
        suggestedWorkup: ['Stat 12-Lead ECG', 'Serial Troponins', 'Aspirin 300mg stat']
      },
      doctorNotes: '',
      status: 'waiting',
      createdAt: '09:15 AM'
    },
    personaProfile: {
      phone: '9811223344',
      name: 'Ramesh Kumar Sharma',
      age: '58',
      gender: 'Male',
      abhaId: '88-3921-9941-0021',
      abhaVerified: true,
      height: '168',
      weight: '76',
      uploadedDocuments: [],
      chronicConditions: [
        { condition: 'Type 2 Diabetes Mellitus', duration: '8 years', medication: 'Tab Metformin 1000mg BD', status: 'Active' },
        { condition: 'Essential Hypertension', duration: '5 years', medication: 'Tab Telmisartan 40mg OD', status: 'Active' }
      ],
      allergies: [
        { allergen: 'Penicillin', reaction: 'Anaphylaxis / Urticaria', severity: 'severe' }
      ],
      pastVisits: [
        {
          date: '28 Aug 2024',
          hospital: 'AIIMS New Delhi (Apex)',
          department: 'Cardiology OPD (Room 12)',
          reason: 'Severe exertional breathlessness and recurrent chest tightness.',
          diagnosis: 'Hypertensive crisis secondary to non-compliance',
          prescriptions: ['Tab Telmisartan 40mg OD', 'Tab Amlodipine 5mg OD'],
          patientVisibleNotes: 'Take BP medicines regularly. Cut down salt intake to less than 1 tsp/day.',
          doctorNotesHidden: 'Patient non-compliant with Telmisartan. Re-emphasized diet control.'
        }
      ]
    }
  },
  {
    id: 'demo-asthma',
    badgeNumber: 2,
    label: 'Aarav Patel',
    category: 'Respiratory / Asthma',
    patient: {
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
      redFlags: ['Wheezing exacerbation in known asthmatic patient'],
      esiTriage: {
        level: 3,
        category: 'Urgent',
        color: '#eab308',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-500/30',
        rationale: 'Productive cough, low-grade fever, and wheeze in a known asthmatic. Hemodynamically stable but requires multiple diagnostic resources.',
        immediateActions: [
          'Complete Blood Count (CBC) with differential',
          'Peak Expiratory Flow Rate (PEFR)',
          'Chest X-Ray (PA view) if fever persists',
          'Symptomatic bronchodilator therapy'
        ],
        predictedResources: ['Complete Blood Count', 'Chest Radiograph (PA)', 'Peak Flow Meter', 'Outpatient Inhaler Prescription'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: false,
      structuredSummary: {
        chiefComplaintSummary: '29-year-old male asthmatic presenting with 5-day acute lower respiratory infection and wheeze.',
        hpi: 'Patient developed productive cough with yellowish sputum, low-grade fevers, and nocturnal wheezing. Relies on SOS Budesonide inhaler.',
        pastHistory: 'Childhood bronchial asthma with atopic history.',
        medicationsSummary: 'Budecort 200mcg PRN.',
        allergiesSummary: 'Environmental dust/pollen atopy.',
        rosSummary: 'Positive for productive sputum and wheezing.',
        redFlagsSummary: ['Exacerbation of underlying reactive airway disease'],
        documentHighlights: [],
        suggestedWorkup: ['PEFR', 'CBC Differential', 'Chest X-Ray']
      },
      doctorNotes: '',
      status: 'waiting',
      createdAt: '10:05 AM'
    },
    personaProfile: {
      phone: '9765432100',
      name: 'Aarav Patel',
      age: '29',
      gender: 'Male',
      abhaId: '22-8190-4491-1002',
      abhaVerified: true,
      height: '175',
      weight: '70',
      uploadedDocuments: [],
      chronicConditions: [
        { condition: 'Bronchial Asthma (Childhood onset)', duration: 'Since age 12', medication: 'Inhaler Budecort 200mcg SOS', status: 'Intermittent' }
      ],
      allergies: [
        { allergen: 'Dust Mites & Pollen', reaction: 'Allergic rhinitis & bronchospasm', severity: 'moderate' }
      ],
      pastVisits: [
        {
          date: '12 Jan 2024',
          hospital: 'Safdarjung Hospital & VMMC (Central Govt)',
          department: 'Pulmonary Medicine (Room 08)',
          reason: 'Routine asthma checkup and inhaler refill.',
          diagnosis: 'Mild Persistent Asthma',
          prescriptions: ['Inhaler Budecort 200mcg (1 puff BD)', 'Tab Montelukast 10mg OD HS'],
          patientVisibleNotes: 'Use spacer device with MDI inhaler. Rinse mouth after each use.',
          doctorNotesHidden: 'Good inhaler technique verified. Baseline PEFR 450 L/min.'
        }
      ]
    }
  },
  {
    id: 'demo-ayush',
    badgeNumber: 3,
    label: 'Sunita Devi Verma',
    category: 'AYUSH / Integrative',
    patient: {
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
      dashavidha: {
        prakriti: 'Pitta-Vata Combination',
        vikriti: 'Pitta Imbalance (Hyperacidity, burning sensation, vidaha)',
        sara: 'Moderate Reserve (Madhyama Sara)',
        samhanana: 'Average Build',
        pramana: 'Proportionate & Symmetrical',
        satmya: 'Moderate Adaptability',
        sattva: 'Moderate Resilience',
        aharaShakti: 'Tikshnagni (Hypermetabolic, intense hunger, acidity)',
        vyayamaShakti: 'Moderate Endurance',
        vaya: 'Madhyama Phase (44 Yrs)'
      },
      ashtaSthana: {
        nadi: 'Rapid & Bounding (Manduka/Pitta gati, 78 bpm)',
        mutra: 'Dark Yellow / Burning',
        mala: 'Constipated & Hard (Krura)',
        jihwa: 'Red Margins with Mild White Coating (Pitta-Sama)',
        shabda: 'Clear & Resonant (Spashta)',
        sparsha: 'Warm & Mildly Dry',
        druk: 'Clear with Mild Vascular Injection',
        akruti: 'Mild Pain Facies (Kastam)'
      },
      chronicConditions: [
        { condition: 'Amlapitta / Dyspepsia', duration: '2 years', medication: 'Occasional Pantoprazole 40mg', status: 'Recurrent' }
      ],
      allergies: [
        { allergen: 'Sulfa Drugs', reaction: 'Skin rashes', severity: 'moderate' }
      ],
      reviewOfSystems: ['No GI bleeding', 'Morning stiffness < 30 mins'],
      triageLevel: 'normal',
      redFlags: [],
      esiTriage: {
        level: 4,
        category: 'Less Urgent',
        color: '#10b981',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-500/30',
        rationale: 'Subacute chronic dyspeptic discomfort and early knee joint stiffness. Normal vital signs.',
        immediateActions: [
          'Outpatient integrative consultation',
          'Dietary counseling (Pitta-pacifying diet)',
          'Targeted oral herbal / allopathic regimen'
        ],
        predictedResources: ['Outpatient Prescription', 'Dietary & Lifestyle Counseling'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: true,
      structuredSummary: {
        chiefComplaintSummary: '44-year-old female presenting with 3-month history of Amlapitta and early Sandhivata symptoms.',
        hpi: 'Patient reports persistent burning in epigastrium (Vidaha), acid regurgitation (Amlodgara), and constipation (Vibandha).',
        pastHistory: 'Recurrent dyspepsia over 2 years.',
        medicationsSummary: 'Pantoprazole 40mg PRN.',
        allergiesSummary: 'Sulfa allergy.',
        rosSummary: 'Negative for GI bleeding.',
        ayushSummary: 'Prakriti: Pitta-Vata | Agni: Tikshna/Vishama | Koshtha: Krura | Dosha Dushti: Pitta-Vata dominant.',
        redFlagsSummary: [],
        documentHighlights: [],
        suggestedWorkup: ['Deepana-Pachana protocol', 'Pitta-Vata shamana']
      },
      doctorNotes: '',
      primaryDiagnosis: 'Amlapitta (Non-Ulcer Dyspepsia / Acid Reflux)',
      namasteCode: 'NAM-AYU-DIG-001 | ICD-11 TM2: AA10',
      status: 'waiting',
      createdAt: '09:40 AM'
    },
    personaProfile: {
      phone: '9844332211',
      name: 'Sunita Devi Verma',
      age: '44',
      gender: 'Female',
      abhaId: '45-2019-3382-7711',
      abhaVerified: true,
      height: '158',
      weight: '62',
      uploadedDocuments: [],
      chronicConditions: [
        { condition: 'Amlapitta / Dyspepsia', duration: '2 years', medication: 'Occasional Pantoprazole 40mg', status: 'Recurrent' }
      ],
      allergies: [
        { allergen: 'Sulfa Drugs', reaction: 'Skin rashes', severity: 'moderate' }
      ],
      pastVisits: [
        {
          date: '18 Jun 2024',
          hospital: 'All India Institute of Ayurveda (AIIA New Delhi)',
          department: 'Kayachikitsa & Panchakarma (Room 04)',
          reason: 'Persistent acid reflux, burning throat, and sluggish bowel movements.',
          diagnosis: 'Amlapitta (Pitta-Vata dominant)',
          prescriptions: ['Avipattikar Churna 3g BD with honey', 'Sutashekhar Rasa 1 tab BD after food'],
          patientVisibleNotes: 'Avoid pungent, excessively sour and oily foods. Drink lukewarm coriander seed water.',
          doctorNotesHidden: 'Chronic PPI dependence noted. Advised dietary Pitta shamana protocol.'
        }
      ]
    }
  },
  {
    id: 'demo-neuro',
    badgeNumber: 4,
    label: 'Pooja Mehra',
    category: 'Neurology',
    patient: {
      patientId: 'NEU-214',
      token: 'NEU-214',
      abhaId: '66-1049-8821-3304',
      abhaVerified: true,
      name: 'Pooja Mehra',
      age: '34',
      gender: 'Female',
      phone: '9833445566',
      height: '164',
      weight: '58',
      language: 'en',
      mode: 'modern',
      chiefComplaint: 'Severe unilateral throbbing headache with visual aura, photophobia and nausea for 18 hours',
      chiefComplaintHi: 'सिर के आधे हिस्से में तेज धड़कता दर्द, रोशनी से परेशानी और उल्टी जैसा लगना',
      symptomDuration: 'Started yesterday evening (18 hours)',
      symptomSite: 'Left fronto-temporal cranial region',
      symptomCharacter: 'Pulsating, throbbing, severe ache with ocular pressure',
      symptomRadiation: 'Retro-orbital and left occiput',
      symptomTiming: 'Continuous throbbing; preceded by zig-zag flashing lights (scintillating scotoma)',
      symptomSeverity: 8,
      aggravatingFactors: 'Bright light, loud noises, physical exertion, head tilting',
      relievingFactors: 'Darkened quiet room, cold forehead compress',
      associatedSymptoms: ['Photophobia', 'Phonophobia', 'Repeated dry retching / nausea'],
      prakriti: '',
      agni: '',
      koshtha: '',
      aharaVihara: '',
      nidra: '',
      chronicConditions: [
        { condition: 'Episodic Migraine without Aura', duration: '4 years', medication: 'Tab Naproxen 500mg SOS', status: 'Worsening frequency' }
      ],
      allergies: [],
      reviewOfSystems: ['No fever, no neck rigidity, no focal neurological deficits, no loss of consciousness'],
      triageLevel: 'priority',
      redFlags: ['Severe acute incapacitating headache with photophobia'],
      esiTriage: {
        level: 3,
        category: 'Urgent',
        color: '#eab308',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-500/30',
        rationale: 'Acute severe migraine flare with photophobia and persistent nausea. Stable vitals, no meningeal signs.',
        immediateActions: [
          'Quiet darkened observation cubicle',
          'Oral/IV Triptan therapy or NSAID + anti-emetic loading',
          'IV hydration with Normal Saline 500ml',
          'Neurological examination'
        ],
        predictedResources: ['Oral / IV Triptan Analgesia', 'IV Antiemetic (Ondansetron)', 'IV Fluid Hydration'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: false,
      structuredSummary: {
        chiefComplaintSummary: '34-year-old female presenting with acute 18-hour severe throbbing left hemicranial headache with visual aura.',
        hpi: 'Patient describes acute left temporal throbbing preceded by scintillating scotoma. Severe photophobia and nausea present.',
        pastHistory: 'Migraine for 4 years.',
        medicationsSummary: 'Naproxen 500mg PRN.',
        allergiesSummary: 'No known drug allergies.',
        rosSummary: 'Positive for photophobia and nausea. Negative for fever, neck stiffness.',
        redFlagsSummary: ['Acute severe headache requiring quiet room analgesia'],
        documentHighlights: [],
        suggestedWorkup: ['Targeted Triptan analgesia', 'Antiemetic therapy', 'Hydration']
      },
      doctorNotes: '',
      primaryDiagnosis: 'Migraine with Aura (ICD-11: 8A80.1)',
      status: 'waiting',
      createdAt: '10:20 AM'
    },
    personaProfile: {
      phone: '9833445566',
      name: 'Pooja Mehra',
      age: '34',
      gender: 'Female',
      abhaId: '66-1049-8821-3304',
      abhaVerified: true,
      height: '162',
      weight: '56',
      uploadedDocuments: [],
      chronicConditions: [
        { condition: 'Episodic Migraine', duration: '4 years', medication: 'Tab Naproxen 500mg SOS', status: 'Active' }
      ],
      allergies: [],
      pastVisits: [
        {
          date: '05 May 2024',
          hospital: 'Dr. RML Hospital (Central Govt, New Delhi)',
          department: 'Neurology Outpatient (Room 19)',
          reason: 'Recurrent weekend headaches with nausea.',
          diagnosis: 'Migraine Flare-Up',
          prescriptions: ['Tab Rizatriptan 10mg SOS at onset', 'Tab Domperidone 10mg BD'],
          patientVisibleNotes: 'Identify trigger factors (skip meals, sleep deprivation, stress). Keep headache diary.',
          doctorNotesHidden: 'Normal fundus examination. Advised prophylactic Flunarizine if attacks exceed 3/month.'
        }
      ]
    }
  },
  {
    id: 'demo-diabetes-foot',
    badgeNumber: 5,
    label: 'Dr. Vikramaditya Sen',
    category: 'Diabetic Complication',
    patient: {
      patientId: 'CRD-502',
      token: 'CRD-502',
      abhaId: '19-4820-9931-4412',
      abhaVerified: true,
      name: 'Dr. Vikramaditya Sen',
      age: '62',
      gender: 'Male',
      phone: '9855667788',
      height: '172',
      weight: '82',
      language: 'en',
      mode: 'modern',
      chiefComplaint: 'Right great toe non-healing ulcer with surrounding erythema and diminished sensation for 3 weeks',
      chiefComplaintHi: 'दाएं पैर के अंगूठे में 3 हफ्ते से न भरने वाला घाव, लाली और सुन्नपन',
      symptomDuration: '3 weeks',
      symptomSite: 'Plantar surface of right first metatarsophalangeal joint and hallux',
      symptomCharacter: 'Painless superficial ulceration with serosanguinous discharge',
      symptomRadiation: 'None',
      symptomTiming: 'Slowly expanding over 21 days following minor shoe friction',
      symptomSeverity: 4,
      aggravatingFactors: 'Weight-bearing ambulation, friction from footwear',
      relievingFactors: 'Leg elevation, saline dressing',
      associatedSymptoms: ['Glove-and-stocking numbness / tingling', 'Bilateral pedal dryness'],
      prakriti: '',
      agni: '',
      koshtha: '',
      aharaVihara: '',
      nidra: '',
      chronicConditions: [
        { condition: 'Type 2 Diabetes Mellitus', duration: '14 years', medication: 'Tab Glimepiride 2mg + Metformin 1000mg BD', status: 'Poor glycemic control' },
        { condition: 'Diabetic Peripheral Neuropathy', duration: '4 years', medication: 'Tab Pregabalin 75mg HS', status: 'Moderate sensation loss' }
      ],
      allergies: [
        { allergen: 'Ciprofloxacin', reaction: 'Maculopapular rash', severity: 'moderate' }
      ],
      reviewOfSystems: ['No fever, no ascending lymphangitis, no deep fascial crepitus, distal dorsalis pedis pulse palpable'],
      triageLevel: 'priority',
      redFlags: ['Diabetic foot ulceration with peripheral neuropathy risk of osteomyelitis'],
      esiTriage: {
        level: 3,
        category: 'Urgent',
        color: '#eab308',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-500/30',
        rationale: 'Diabetic foot ulcer in long-standing diabetic with sensory neuropathy. Requires glycemic review, wound swab, foot X-ray, and offloading protocol.',
        immediateActions: [
          'Bedside surgical wound inspection & probe-to-bone test',
          'Foot X-Ray (AP & Lateral) to rule out osteomyelitis',
          'Fasting & Post-prandial blood sugar check',
          'Non-weight bearing offloading advice and sterile dressing'
        ],
        predictedResources: ['Plain Radiograph Right Foot', 'Wound Culture / Swab', 'Glycemic Profile (HbA1c / FBS)', 'Specialist Diabetic Foot Dressing'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: false,
      structuredSummary: {
        chiefComplaintSummary: '62-year-old diabetic male presenting with 3-week-old neuropathic right hallux ulcer.',
        hpi: 'Patient developed painless ulcer on right big toe following tight footwear friction. Known 14-year diabetic with stocking neuropathy.',
        pastHistory: 'T2DM (14 yrs), Peripheral Neuropathy (4 yrs).',
        medicationsSummary: 'Glimepiride 2mg + Metformin 1000mg BD, Pregabalin 75mg HS.',
        allergiesSummary: 'Ciprofloxacin allergy.',
        rosSummary: 'Distal pulse present, no systemic fever.',
        redFlagsSummary: ['Diabetic neuropathic ulcer with high risk of limb-threatening infection'],
        documentHighlights: [],
        suggestedWorkup: ['Foot X-Ray', 'Wound Swab Culture', 'HbA1c & Fasting Glucose']
      },
      doctorNotes: '',
      primaryDiagnosis: 'Diabetic Neuropathic Foot Ulcer (Wagner Grade 1)',
      status: 'waiting',
      createdAt: '10:45 AM'
    },
    personaProfile: {
      phone: '9855667788',
      name: 'Dr. Vikramaditya Sen',
      age: '62',
      gender: 'Male',
      abhaId: '19-4820-9931-4412',
      abhaVerified: true,
      height: '172',
      weight: '80',
      uploadedDocuments: [],
      chronicConditions: [
        { condition: 'Type 2 Diabetes Mellitus', duration: '14 years', medication: 'Tab Glimepiride 2mg + Metformin 1000mg BD', status: 'Active' },
        { condition: 'Diabetic Neuropathy', duration: '4 years', medication: 'Tab Pregabalin 75mg HS', status: 'Active' }
      ],
      allergies: [
        { allergen: 'Ciprofloxacin', reaction: 'Maculopapular rash', severity: 'moderate' }
      ],
      pastVisits: [
        {
          date: '10 Feb 2024',
          hospital: 'Post Graduate Institute of Medical Education & Research (PGIMER Chandigarh)',
          department: 'Endocrinology & Podiatry (Room 03)',
          reason: 'Annual diabetic complication screening and nerve conduction study.',
          diagnosis: 'Distal Symmetrical Polyneuropathy',
          prescriptions: ['Tab Pregabalin 75mg HS', 'Tab Methylcobalamin 1500mcg OD'],
          patientVisibleNotes: 'Inspect feet daily with mirror. Never walk barefoot even inside the house.',
          doctorNotesHidden: '10g Semmes-Weinstein monofilament test negative at 4 points bilaterally.'
        }
      ]
    }
  },
  {
    id: 'demo-gastro',
    badgeNumber: 6,
    label: 'Meera Ananthakrishnan',
    category: 'Acute Dehydration',
    patient: {
      patientId: 'EMG-105',
      token: 'EMG-105',
      abhaId: '91-3004-7718-2910',
      abhaVerified: true,
      name: 'Meera Ananthakrishnan',
      age: '24',
      gender: 'Female',
      phone: '9899001122',
      height: '160',
      weight: '50',
      language: 'en',
      mode: 'modern',
      chiefComplaint: 'Multiple episodes of watery diarrhea (8-10 times), vomiting, crampy abdominal pain and postural dizziness',
      chiefComplaintHi: 'बार-बार दस्त और उल्टियां, पेट में मरोड़ और चक्कर आना',
      symptomDuration: 'Started 12 hours ago after outside food consumption',
      symptomSite: 'Periumbilical and lower abdomen',
      symptomCharacter: 'Colicky spasmodic cramps followed by profuse watery stools',
      symptomRadiation: 'None',
      symptomTiming: 'Continuous nausea and frequent watery evacuations',
      symptomSeverity: 7,
      aggravatingFactors: 'Any oral intake of water or food triggers immediate retching',
      relievingFactors: 'None',
      associatedSymptoms: ['Postural dizziness / lightheadedness', 'Dry mouth & parched lips', 'Low urine output'],
      prakriti: '',
      agni: '',
      koshtha: '',
      aharaVihara: '',
      nidra: '',
      chronicConditions: [],
      allergies: [],
      reviewOfSystems: ['No hematochezia, no high fever, dry mucous membranes, delayed capillary refill 2.5s'],
      triageLevel: 'emergency',
      redFlags: ['CRITICAL: Severe acute dehydration with inability to retain oral fluids and postural hypotension'],
      esiTriage: {
        level: 2,
        category: 'Emergent',
        color: '#f97316',
        badgeBg: 'bg-orange-500/10',
        badgeText: 'text-orange-700',
        badgeBorder: 'border-orange-500/30',
        rationale: 'Acute gastroenteritis with severe volume depletion, orthostatic symptoms, and inability to tolerate oral fluids. High risk of hypovolemic shock if not resuscitated.',
        immediateActions: [
          'Immediate IV cannulation (18G / 20G)',
          'Stat bolus IV Ringer Lactate / Normal Saline 1000ml',
          'IV Ondansetron 4mg stat',
          'Serum Electrolytes, Renal Function Tests (RFT), and blood glucose'
        ],
        predictedResources: ['Rapid IV Crystalloid Resuscitation', 'IV Antiemetic / Antispasmodic', 'Serum Electrolytes & Creatinine', 'Short-Stay Observation Bed'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: false,
      structuredSummary: {
        chiefComplaintSummary: '24-year-old female presenting with acute dehydrating gastroenteritis and postural dizziness.',
        hpi: 'Patient developed profuse watery diarrhea and persistent vomiting after street food consumption. Cannot retain water.',
        pastHistory: 'None. Previously healthy.',
        medicationsSummary: 'None.',
        allergiesSummary: 'No known drug allergies.',
        rosSummary: 'Signs of moderate-to-severe dehydration, dry oral mucosa, tachycardia.',
        redFlagsSummary: ['Acute hypovolemia with postural collapse risk'],
        documentHighlights: [],
        suggestedWorkup: ['Stat IV Fluid Bolus (RL 1L)', 'IV Ondansetron', 'Serum Electrolytes']
      },
      doctorNotes: '',
      primaryDiagnosis: 'Acute Gastroenteritis with Moderate-Severe Dehydration',
      status: 'waiting',
      createdAt: '11:00 AM'
    },
    personaProfile: {
      phone: '9899001122',
      name: 'Meera Ananthakrishnan',
      age: '24',
      gender: 'Female',
      abhaId: '91-3004-7718-2910',
      abhaVerified: true,
      height: '160',
      weight: '52',
      uploadedDocuments: [],
      chronicConditions: [],
      allergies: [],
      pastVisits: []
    }
  },
  {
    id: 'demo-ortho',
    badgeNumber: 7,
    label: 'Harishankar Tiwari',
    category: 'Orthopedics',
    patient: {
      patientId: 'AYU-603',
      token: 'AYU-603',
      abhaId: '77-3810-4492-6601',
      abhaVerified: true,
      name: 'Harishankar Tiwari',
      age: '67',
      gender: 'Male',
      phone: '9877665544',
      height: '166',
      weight: '74',
      language: 'hi',
      mode: 'ayush',
      chiefComplaint: 'Bilateral knee joint pain, crepitus, and stiffness making stair climbing and walking difficult',
      chiefComplaintHi: 'दोनों घुटनों में तेज दर्द, कट-कट की आवाज और चलने में कठिनाई',
      symptomDuration: '8 months, severe since 1 month',
      symptomSite: 'Bilateral knee joints (Right > Left)',
      symptomCharacter: 'Aching deep joint pain (Shoola) with audible crepitus (Sandhi Sphutana)',
      symptomRadiation: 'Proximal tibia and calves',
      symptomTiming: 'Marked stiffness on waking up, improves mildly after gentle walking, worsens by evening',
      symptomSeverity: 6,
      aggravatingFactors: 'Climbing stairs, sitting cross-legged on floor, squatting, cold weather',
      relievingFactors: 'Hot fomentation (Swedana), resting with knee supported',
      associatedSymptoms: ['Mild joint effusion / puffiness', 'Restricted terminal flexion'],
      prakriti: 'Vata-Kapha',
      agni: 'Mandagni / Vishamagni',
      koshtha: 'Krura Koshtha',
      aharaVihara: 'Sedentary retired life, dry food diet, cold exposure',
      nidra: 'Fragmented sleep due to nocturia and knee ache',
      dashavidha: {
        prakriti: 'Vata-Kapha Combination',
        vikriti: 'Vata Imbalance (Dhatu Kshaya, Sandhigata Vata)',
        sara: 'Avara Sara (Depleted tissue stamina)',
        samhanana: 'Average Build',
        pramana: 'Overweight (BMI 26.8)',
        satmya: 'Cold sensitive',
        sattva: 'Madhyama Sattva',
        aharaShakti: 'Vishamagni (Irregular digestion)',
        vyayamaShakti: 'Avara (Easily fatigued on knee weight-bearing)',
        vaya: 'Vriddha Phase (67 Yrs)'
      },
      ashtaSthana: {
        nadi: 'Thin, Hard & Slower (Vata-Kapha gati, 68 bpm)',
        mutra: 'Normal Pale Straw',
        mala: 'Hard and dry stools',
        jihwa: 'Slightly dry with posterior white coat',
        shabda: 'Clear',
        sparsha: 'Cool extremities, dry skin',
        druk: 'Normal Sclera with arcus senilis',
        akruti: 'Guarded antalgic gait'
      },
      chronicConditions: [
        { condition: 'Primary Osteoarthritis of Bilateral Knees', duration: '3 years', medication: 'Occasional Diclofenac gel', status: 'Progressive' }
      ],
      allergies: [],
      reviewOfSystems: ['No fever, no hot red erythematous joint, no systemic connective tissue signs'],
      triageLevel: 'normal',
      redFlags: [],
      esiTriage: {
        level: 4,
        category: 'Less Urgent',
        color: '#10b981',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-500/30',
        rationale: 'Chronic degenerative knee joint pain. Stable vital signs, non-urgent ambulatory presentation.',
        immediateActions: [
          'Orthopedic / AYUSH Janu Basti & physical evaluation',
          'Bilateral knee weight-bearing X-ray review',
          'Oral anti-arthritic herbal/allopathic prescription & quadriceps exercise advice'
        ],
        predictedResources: ['Bilateral Knee X-Ray (Standing AP)', 'Physical Therapy / Janu Basti Regimen'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: true,
      structuredSummary: {
        chiefComplaintSummary: '67-year-old male presenting with progressive bilateral Sandhigata Vata (Knee Osteoarthritis).',
        hpi: 'Patient has 8-month history of worsening bilateral knee ache, joint crepitus, and morning stiffness.',
        pastHistory: 'Known bilateral knee OA for 3 years.',
        medicationsSummary: 'Topical NSAID gel PRN.',
        allergiesSummary: 'No known drug allergies.',
        rosSummary: 'No acute hot joint effusion.',
        ayushSummary: 'Sandhigata Vata (Asthi-Majja Dhatu Kshaya, Vata Prakopa).',
        redFlagsSummary: [],
        documentHighlights: [],
        suggestedWorkup: ['Janu Dhara / Basti protocol', 'Knee X-Rays', 'Quadriceps strengthening']
      },
      doctorNotes: '',
      primaryDiagnosis: 'Sandhigata Vata (Bilateral Knee Osteoarthritis)',
      namasteCode: 'NAM-AYU-MSK-003 | ICD-11 TM2: FA00',
      status: 'waiting',
      createdAt: '11:15 AM'
    },
    personaProfile: {
      phone: '9877665544',
      name: 'Harishankar Tiwari',
      age: '67',
      gender: 'Male',
      abhaId: '77-3810-4492-6601',
      abhaVerified: true,
      height: '166',
      weight: '74',
      uploadedDocuments: [],
      chronicConditions: [
        { condition: 'Bilateral Knee Osteoarthritis', duration: '3 years', medication: 'Diclofenac gel SOS', status: 'Active' }
      ],
      allergies: [],
      pastVisits: [
        {
          date: '02 Apr 2024',
          hospital: 'National Institute of Ayurveda (NIA Jaipur)',
          department: 'Shalya & Marma Chikitsa (Room 11)',
          reason: 'Severe right knee crepitus and difficulty standing from chair.',
          diagnosis: 'Sandhigata Vata',
          prescriptions: ['Yogaraj Guggulu 2 tabs BD with warm water', 'Mahanarayan Taila for gentle local application'],
          patientVisibleNotes: 'Avoid squatting and cross-legged sitting. Do non-weight bearing straight leg raises daily.',
          doctorNotesHidden: 'Grade 3 medial joint space narrowing on right knee X-ray. Recommended Janu Basti course.'
        }
      ]
    }
  }
];

export function getFourActiveDemoPatients(): PatientData[] {
  // Returns 4 diverse waiting patients ready for immediate consultation
  return [
    { ...DEMO_PRESET_PATIENTS[0].patient, status: 'waiting' }, // Cardiac Emergency (Ramesh)
    { ...DEMO_PRESET_PATIENTS[1].patient, status: 'waiting' }, // Asthma Wheeze (Aarav)
    { ...DEMO_PRESET_PATIENTS[2].patient, status: 'waiting' }, // AYUSH Amlapitta (Sunita)
    { ...DEMO_PRESET_PATIENTS[3].patient, status: 'waiting' }, // Acute Migraine (Pooja)
  ];
}

export function getAllDemoPresets(): DemoPresetItem[] {
  return DEMO_PRESET_PATIENTS;
}
