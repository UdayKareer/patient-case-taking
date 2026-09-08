// Clinical AI Service: Dynamic Questioning (4A) & ESI Automated Triage Engine (4D)
// Uses Google Gemini 3.5 Flash-lite with deterministic clinical boundary fallback

export interface EsiTriageResult {
  level: 1 | 2 | 3 | 4 | 5;
  category: 'Resuscitation' | 'Emergent' | 'Urgent' | 'Less Urgent' | 'Non-Urgent';
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  rationale: string;
  immediateActions: string[];
  predictedResources: string[];
  vitalAlerts?: string[];
  algorithmSource: 'gemini-3.5-flash-lite' | 'clinical-rule-engine';
}

export interface DynamicQuestionOption {
  id: string;
  labelEn: string;
  labelHi: string;
  isRedFlag?: boolean;
}

export interface DynamicQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  clinicalRationale: string;
  options: DynamicQuestionOption[];
}

export type ClinicalDomain = 'pain' | 'respiratory' | 'gastrointestinal' | 'fever' | 'metabolic' | 'general';

const GEMINI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
  'AQ.Ab8RN6JVZU-UpByZMxHLL7V7ThcjaFR98DELnjC2zfRreQqnew';

/**
 * Classify a chief complaint text into a primary clinical domain
 */
export function detectClinicalDomain(text: string): ClinicalDomain {
  const lower = (text || '').toLowerCase();

  if (
    lower.includes('cough') ||
    lower.includes('खांसी') ||
    lower.includes('breath') ||
    lower.includes('सांस') ||
    lower.includes('wheez') ||
    lower.includes('asthma') ||
    lower.includes('दमा') ||
    lower.includes('sputum') ||
    lower.includes('phlegm') ||
    lower.includes('बलगम')
  ) {
    return 'respiratory';
  }

  if (
    lower.includes('fever') ||
    lower.includes('बुखार') ||
    lower.includes('chill') ||
    lower.includes('ताप') ||
    lower.includes('temperature') ||
    lower.includes('dengue') ||
    lower.includes('malaria')
  ) {
    return 'fever';
  }

  if (
    lower.includes('vomit') ||
    lower.includes('उल्टी') ||
    lower.includes('diarrhea') ||
    lower.includes('loose') ||
    lower.includes('दस्त') ||
    lower.includes('constipat') ||
    lower.includes('कब्ज') ||
    lower.includes('acid') ||
    lower.includes('regurgitat') ||
    lower.includes('bloat') ||
    lower.includes('stool') ||
    lower.includes('शौच')
  ) {
    return 'gastrointestinal';
  }

  if (
    lower.includes('sugar') ||
    lower.includes('diabet') ||
    lower.includes('मधुमेह') ||
    lower.includes('thirst') ||
    lower.includes('urination') ||
    lower.includes('weight loss')
  ) {
    return 'metabolic';
  }

  if (
    lower.includes('pain') ||
    lower.includes('दर्द') ||
    lower.includes('chest') ||
    lower.includes('सीने') ||
    lower.includes('joint') ||
    lower.includes('knee') ||
    lower.includes('घुटने') ||
    lower.includes('headache') ||
    lower.includes('सिरदर्द') ||
    lower.includes('back') ||
    lower.includes('कमर') ||
    lower.includes('neck') ||
    lower.includes('गर्दन')
  ) {
    return 'pain';
  }

  return 'general';
}

/**
 * Evidence-based ESI Level styling metadata
 */
export function getEsiMetadata(level: 1 | 2 | 3 | 4 | 5): {
  category: EsiTriageResult['category'];
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
} {
  switch (level) {
    case 1:
      return {
        category: 'Resuscitation',
        color: '#ef4444',
        badgeBg: 'bg-red-500/10',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-500/30'
      };
    case 2:
      return {
        category: 'Emergent',
        color: '#f97316',
        badgeBg: 'bg-orange-500/10',
        badgeText: 'text-orange-700',
        badgeBorder: 'border-orange-500/30'
      };
    case 3:
      return {
        category: 'Urgent',
        color: '#eab308',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-500/30'
      };
    case 4:
      return {
        category: 'Less Urgent',
        color: '#10b981',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-500/30'
      };
    case 5:
    default:
      return {
        category: 'Non-Urgent',
        color: '#3b82f6',
        badgeBg: 'bg-blue-500/10',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-500/30'
      };
  }
}

/**
 * Deterministic Clinical Rule Engine for ESI Triage (Offline Safe)
 */
export function calculateRuleBasedEsi(patient: {
  chiefComplaint?: string;
  symptomSeverity?: number;
  symptomSite?: string;
  symptomCharacter?: string;
  symptomRadiation?: string;
  associatedSymptoms?: string[];
  redFlags?: string[];
  triageLevel?: string;
}): EsiTriageResult {
  const comp = (patient.chiefComplaint || '').toLowerCase();
  const sev = patient.symptomSeverity || 0;
  const rad = (patient.symptomRadiation || '').toLowerCase();
  const char = (patient.symptomCharacter || '').toLowerCase();
  const flags = patient.redFlags || [];
  const assoc = patient.associatedSymptoms || [];

  // LEVEL 1: IMMEDIATE RESUSCITATION (Life threat / Hemodynamic instability)
  const isChestPainACS =
    (comp.includes('chest') || (patient.symptomSite || '').toLowerCase().includes('chest')) &&
    (rad.includes('left') || rad.includes('jaw') || rad.includes('arm')) &&
    (char.includes('crush') || char.includes('pressure') || sev >= 8);

  const hasDiaphoresis = assoc.some(a => a.toLowerCase().includes('sweat') || a.toLowerCase().includes('पसीना'));

  if ((isChestPainACS && hasDiaphoresis) || flags.some(f => f.toLowerCase().includes('cardiac arrest') || f.toLowerCase().includes('unresponsive'))) {
    const meta = getEsiMetadata(1);
    return {
      level: 1,
      ...meta,
      rationale: 'Suspected Acute Coronary Syndrome (STEMI / NSTEMI) with severe retrosternal pain, radiation, and diaphoresis. Immediate life-saving resuscitation required.',
      immediateActions: [
        'Immediate transfer to Emergency Resuscitation Bay',
        'Stat 12-lead ECG within 10 minutes',
        'High-sensitivity Troponin-I/T',
        'Stat dual antiplatelet loading (Aspirin 300mg + Clopidogrel 300mg)',
        'Continuous cardiac telemetry & IV access'
      ],
      predictedResources: ['12-Lead ECG', 'Serial Cardiac Troponins', 'IV Cannulation', 'Continuous Telemetry', 'Chest Radiograph'],
      algorithmSource: 'clinical-rule-engine'
    };
  }

  // LEVEL 2: EMERGENT / HIGH RISK (High potential for rapid deterioration or severe pain >= 8/10)
  const isAsthmaFlare =
    (comp.includes('asthma') || comp.includes('wheez') || comp.includes('दमा')) &&
    (sev >= 7 || flags.some(f => f.toLowerCase().includes('asthma') || f.toLowerCase().includes('respiratory')));

  const isSeverePain = sev >= 8;
  const isSevereHeadache = comp.includes('headache') && (sev >= 8 || char.includes('thunderclap') || char.includes('pulsat'));
  const isShiveringRigors = assoc.some(a => a.toLowerCase().includes('rigor') || a.toLowerCase().includes('shiver'));

  if (isAsthmaFlare || isSeverePain || isSevereHeadache || isChestPainACS || isShiveringRigors || patient.triageLevel === 'emergency') {
    const meta = getEsiMetadata(2);
    return {
      level: 2,
      ...meta,
      rationale: isAsthmaFlare
        ? 'Acute exacerbation of Reactive Airway Disease with marked expiratory wheezing and breathlessness. Risk of rapid respiratory fatigue.'
        : isSevereHeadache
        ? 'Severe neuro-vascular distress with high pain score (>8/10). Requires urgent neurological evaluation to rule out intracranial bleed or secondary cause.'
        : 'High-risk clinical presentation or severe distress (>7/10 pain). Requires rapid physician bedside evaluation within 15 minutes.',
      immediateActions: isAsthmaFlare
        ? [
            'Immediate bedside SpO2 oximetry monitoring',
            'Nebulization with Duolin (Levosalbutamol + Ipratropium)',
            'IV Hydrocortisone 100mg bolus consideration',
            'Bedside Peak Expiratory Flow Rate (PEFR)'
          ]
        : [
            'Prompt bedside physician assessment within 15 mins',
            'Vital signs monitoring (BP, Pulse, SpO2, Temp)',
            'Analgesic titration protocol per WHO step ladder'
          ],
      predictedResources: ['Nebulization / O2', 'Blood Gas / CBC', 'IV Medications', 'Bedside Monitoring'],
      algorithmSource: 'clinical-rule-engine'
    };
  }

  // LEVEL 3: URGENT (Stable vitals, multiple diagnostic resources required)
  const isBronchitisOrInfection = comp.includes('cough') || comp.includes('fever') || comp.includes('vomit') || comp.includes('diarrhea');
  if (isBronchitisOrInfection || sev >= 5 || (assoc.length >= 2)) {
    const meta = getEsiMetadata(3);
    return {
      level: 3,
      ...meta,
      rationale: 'Acute symptoms requiring multiple diagnostic or therapeutic resources (Labs, X-ray, or IV hydration), but patient demonstrates stable baseline hemodynamics.',
      immediateActions: [
        'Complete Blood Count (CBC) with differential',
        'Appropriate diagnostic workup (Chest X-ray / Stool routine / Urine analysis)',
        'Oral rehydration or targeted outpatient pharmacotherapy'
      ],
      predictedResources: ['Laboratory Blood Work (CBC, ESR, CRP)', 'Radiology / Chest X-ray', 'Outpatient Prescription'],
      algorithmSource: 'clinical-rule-engine'
    };
  }

  // LEVEL 4: LESS URGENT (1 resource required)
  if (comp.includes('knee') || comp.includes('joint') || comp.includes('acidity') || comp.includes('dyspepsia') || sev >= 3) {
    const meta = getEsiMetadata(4);
    return {
      level: 4,
      ...meta,
      rationale: 'Subacute or chronic complaint with minimal acute distress. Requires single diagnostic or therapeutic resource.',
      immediateActions: [
        'Focused physical examination',
        'Standard outpatient symptomatic prescription',
        'Routine non-urgent lab or radiograph if indicated'
      ],
      predictedResources: ['Targeted Prescription / Oral medications', 'Routine X-ray or simple panel'],
      algorithmSource: 'clinical-rule-engine'
    };
  }

  // LEVEL 5: NON-URGENT (0 resources required)
  const meta = getEsiMetadata(5);
  return {
    level: 5,
    ...meta,
    rationale: 'Chronic, stable, or routine health maintenance consultation. No emergency diagnostics or interventions required.',
    immediateActions: [
      'Routine OPD consultation',
      'Prescription refill & lifestyle counseling',
      'Periodic routine surveillance'
    ],
    predictedResources: ['Oral Prescription Refill', 'Clinical Counseling'],
    algorithmSource: 'clinical-rule-engine'
  };
}

/**
 * Automated ESI Triage calculation powered by Gemini 3.5 Flash-lite with rule engine fallback
 */
export async function calculateEsiTriage(patient: {
  name?: string;
  age?: string;
  gender?: string;
  chiefComplaint?: string;
  symptomDuration?: string;
  symptomSite?: string;
  symptomCharacter?: string;
  symptomRadiation?: string;
  symptomTiming?: string;
  symptomSeverity?: number;
  aggravatingFactors?: string;
  relievingFactors?: string;
  associatedSymptoms?: string[];
  chronicConditions?: Array<{ condition: string; medication?: string }>;
  allergies?: Array<{ allergen: string; severity?: string }>;
  redFlags?: string[];
  triageLevel?: string;
}): Promise<EsiTriageResult> {
  const fallback = calculateRuleBasedEsi(patient);

  if (!GEMINI_API_KEY) {
    return fallback;
  }

  try {
    const prompt = `You are a certified Emergency Medicine Chief Triage Officer using the gold-standard 5-level Emergency Severity Index (ESI) algorithm.
Classify this patient into ESI Level 1 (Resuscitation), Level 2 (Emergent), Level 3 (Urgent), Level 4 (Less Urgent), or Level 5 (Non-Urgent).

Patient Data:
- Name: ${patient.name || 'Anonymous'}, Age: ${patient.age || 'Unknown'}, Gender: ${patient.gender || 'Unknown'}
- Chief Complaint: ${patient.chiefComplaint || 'None specified'}
- Duration: ${patient.symptomDuration || 'Unknown'}
- Site: ${patient.symptomSite || 'Unknown'}
- Character: ${patient.symptomCharacter || 'Unknown'}
- Radiation: ${patient.symptomRadiation || 'None'}
- Timing: ${patient.symptomTiming || 'Unknown'}
- Pain Severity Score: ${patient.symptomSeverity || 0}/10
- Associated Symptoms: ${(patient.associatedSymptoms || []).join(', ') || 'None'}
- Known Chronic Conditions: ${(patient.chronicConditions || []).map(c => c.condition).join(', ') || 'None'}
- Documented Allergies: ${(patient.allergies || []).map(a => a.allergen).join(', ') || 'None'}
- Identified Red Flags: ${(patient.redFlags || []).join(', ') || 'None'}

Return ONLY a valid JSON object strictly matching this schema with no markdown or text:
{
  "level": 1 | 2 | 3 | 4 | 5,
  "category": "Resuscitation" | "Emergent" | "Urgent" | "Less Urgent" | "Non-Urgent",
  "rationale": "Short, authoritative clinical explanation for this level assignment",
  "immediateActions": ["List of 3-4 immediate clinical orders/steps for the nursing/medical team"],
  "predictedResources": ["List of medical resources needed: e.g. 12-Lead ECG, Lab Panel, Chest X-ray, IV Access"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call returned non-200, falling back to rule engine:', response.status);
      return fallback;
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return fallback;

    const parsed = JSON.parse(rawJson);
    const level = (parsed.level >= 1 && parsed.level <= 5 ? parsed.level : fallback.level) as 1 | 2 | 3 | 4 | 5;
    const meta = getEsiMetadata(level);

    return {
      level,
      category: meta.category,
      color: meta.color,
      badgeBg: meta.badgeBg,
      badgeText: meta.badgeText,
      badgeBorder: meta.badgeBorder,
      rationale: parsed.rationale || fallback.rationale,
      immediateActions: parsed.immediateActions?.length ? parsed.immediateActions : fallback.immediateActions,
      predictedResources: parsed.predictedResources?.length ? parsed.predictedResources : fallback.predictedResources,
      algorithmSource: 'gemini-3.5-flash-lite'
    };
  } catch (err) {
    console.warn('Error during Gemini ESI triage processing:', err);
    return fallback;
  }
}

/**
 * Generate 2-3 adaptive clinical follow-up questions using Gemini 3.5 Flash-lite (Feature 4A)
 */
export async function generateAdaptiveQuestions(
  chiefComplaint: string,
  age: string,
  gender: string
): Promise<DynamicQuestion[]> {
  const domain = detectClinicalDomain(chiefComplaint);

  // Default deterministic clinical trees if API fails or offline
  const fallbackQuestions: Record<ClinicalDomain, DynamicQuestion[]> = {
    respiratory: [
      {
        id: 'resp_sputum',
        questionEn: 'What is the nature of your cough and sputum (phlegm)?',
        questionHi: 'आपकी खांसी और बलगम का स्वरूप कैसा है?',
        clinicalRationale: 'Distinguishes viral bronchitis vs bacterial lower respiratory infection vs hemoptysis red flag.',
        options: [
          { id: 'dry_hacking', labelEn: 'Dry, irritating hacking cough with no phlegm', labelHi: 'सूखी खांसी, बिना बलगम के' },
          { id: 'yellow_green', labelEn: 'Productive with thick yellowish/greenish phlegm', labelHi: 'गाढ़ा पीला या हरा बलगम आना' },
          { id: 'blood_tinged', labelEn: 'Red / Blood-tinged streaks in sputum (Hemoptysis)', labelHi: 'बलगम में खून के छींटे या लाल रंग', isRedFlag: true },
          { id: 'clear_mucoid', labelEn: 'Thin clear / whitish watery secretions', labelHi: 'सफेद या पतला बलगम' }
        ]
      },
      {
        id: 'resp_triggers',
        questionEn: 'Are there any specific triggers that worsen your breathing?',
        questionHi: 'क्या किसी खास चीज से सांस लेने में तकलीफ बढ़ जाती है?',
        clinicalRationale: 'Identifies atopic asthma exacerbation vs environmental irritant exposure.',
        options: [
          { id: 'cold_dust', labelEn: 'Cold night air, dust, pollution, or smoke', labelHi: 'ठंडी हवा, धूल, धुआं या प्रदूषण' },
          { id: 'exertion_stairs', labelEn: 'Climbing stairs or walking briskly', labelHi: 'सीढ़ियां चढ़ने या तेज चलने पर' },
          { id: 'lying_flat', labelEn: 'Lying flat on bed at night (Orthopnea)', labelHi: 'सीधा लेटने पर सांस फूलना', isRedFlag: true },
          { id: 'constant_all_times', labelEn: 'Continuous distress with no clear trigger', labelHi: 'लगातार तकलीफ बनी रहना' }
        ]
      }
    ],
    gastrointestinal: [
      {
        id: 'gi_stool_nature',
        questionEn: 'How would you describe your bowel movements over the last 24 hours?',
        questionHi: 'पिछले 24 घंटों में आपके शौच (मल) की स्थिति कैसी रही है?',
        clinicalRationale: 'Assesses Bristol Stool Scale, dehydration risk, and dysenteric markers.',
        options: [
          { id: 'watery_frequent', labelEn: 'Frequent watery liquid motions (> 4-5 times)', labelHi: 'बार-बार पतले पानी जैसे दस्त (4-5 बार से अधिक)', isRedFlag: true },
          { id: 'hard_straining', labelEn: 'Hard, pellet-like dry stools with severe straining', labelHi: 'सख्त सूखा मल और शौच में बहुत जोर लगाना' },
          { id: 'blood_mucus', labelEn: 'Passage of red blood or dark black tarry stools', labelHi: 'शौच में खून या काला मल आना', isRedFlag: true },
          { id: 'bloated_irregular', labelEn: 'Irregular bowel habits with excessive gas & cramps', labelHi: 'अनियमित शौच, पेट में मरोड़ और गैस' }
        ]
      },
      {
        id: 'gi_oral_intake',
        questionEn: 'Are you able to keep fluids and food down without vomiting?',
        questionHi: 'क्या आप पानी या खाना बिना उल्टी किए पचा पा रहे हैं?',
        clinicalRationale: 'Evaluates acute dehydration severity and need for IV access.',
        options: [
          { id: 'tolerating_well', labelEn: 'Able to drink water and eat light meals normally', labelHi: 'पानी और हल्का भोजन आराम से ले पा रहे हैं' },
          { id: 'vomiting_everything', labelEn: 'Unable to keep any water down, vomiting repeatedly', labelHi: 'पानी पीते ही तुरंत उल्टी हो जाना', isRedFlag: true },
          { id: 'intense_thirst', labelEn: 'Extreme dry mouth, severe thirst and sunken eyes', labelHi: 'गला सूखना, अत्यधिक प्यास और कमजोरी', isRedFlag: true }
        ]
      }
    ],
    fever: [
      {
        id: 'fever_chills_pattern',
        questionEn: 'Does the fever come with teeth-chattering shivering chills or rigors?',
        questionHi: 'क्या बुखार दांत किटकिटाने वाली कंपकंपी और ठंड के साथ आता है?',
        clinicalRationale: 'Differentiates systemic bacteremia, malaria, or urinary tract pyelonephritis.',
        options: [
          { id: 'severe_rigors', labelEn: 'Intense shivering chills requiring multiple blankets', labelHi: 'तेज कंपकंपी जिसमें कंबल ओढ़ने की जरूरत पड़े', isRedFlag: true },
          { id: 'evening_sweats', labelEn: 'Rises every evening accompanied by night sweats', labelHi: 'हर शाम तेज होना और रात में पसीना आना' },
          { id: 'continuous_high', labelEn: 'Continuous sustained heat (102°F+) without dropping', labelHi: 'लगातार 102°F से अधिक तेज बुखार' },
          { id: 'low_grade_flu', labelEn: 'Mild dull temperature with generalized body aches', labelHi: 'हल्का बुखार और बदन में दर्द' }
        ]
      }
    ],
    metabolic: [
      {
        id: 'metabolic_symptoms',
        questionEn: 'Have you noticed any changes in thirst, urination frequency, or weight?',
        questionHi: 'क्या अत्यधिक प्यास, बार-बार पेशाब या वजन में कमी महसूस हुई है?',
        clinicalRationale: 'Screens for osmotic symptoms of glycemic decompensation or DKA.',
        options: [
          { id: 'polyuria_thirst', labelEn: 'Excessive thirst and waking up repeatedly to urinate at night', labelHi: 'बहुत प्यास लगना और रात में बार-बार पेशाब आना' },
          { id: 'unintentional_weight_loss', labelEn: 'Significant unexplained weight loss over recent weeks', labelHi: 'बिना कारण तेजी से वजन घटना', isRedFlag: true },
          { id: 'blurred_vision', labelEn: 'Episodes of blurred vision or extreme midday drowsiness', labelHi: 'आंखों के आगे धुंधलापन या बहुत ज्यादा सुस्ती' },
          { id: 'stable_routine', labelEn: 'No major changes, presenting for routine glycemic check', labelHi: 'कोई खास बदलाव नहीं, नियमित जांच के लिए आए हैं' }
        ]
      }
    ],
    pain: [
      {
        id: 'pain_radiation_check',
        questionEn: 'Does the pain spread or shoot to any other area of your body?',
        questionHi: 'क्या यह दर्द शरीर के किसी अन्य हिस्से में भी फैलता या खिंचता है?',
        clinicalRationale: 'Evaluates dermatomal radiculopathy or visceral referred pain patterns.',
        options: [
          { id: 'rad_left_jaw', labelEn: 'Radiates into left shoulder, inner arm, or jaw', labelHi: 'बाएं कंधे, हाथ या जबड़े में फैलता है', isRedFlag: true },
          { id: 'rad_back_scapula', labelEn: 'Pierces through directly to the mid-back or shoulder blade', labelHi: 'सीधे पीठ के पीछे की तरफ चुभता है' },
          { id: 'rad_leg_sciatica', labelEn: 'Shoots down the back of the leg to calf and foot', labelHi: 'कमर से पैर और पिंडलियों तक खिंचता है' },
          { id: 'rad_localized_none', labelEn: 'Stays strictly localized in one focal spot', labelHi: 'एक ही जगह रहता है, कहीं फैलता नहीं' }
        ]
      }
    ],
    general: [
      {
        id: 'general_functional_impact',
        questionEn: 'How significantly is this health issue affecting your daily routine?',
        questionHi: 'यह परेशानी आपकी दिनचर्या को कितना प्रभावित कर रही है?',
        clinicalRationale: 'Assesses functional status and ambulatory safety.',
        options: [
          { id: 'bedridden', labelEn: 'Completely bedridden, unable to stand or walk unassisted', labelHi: 'बिस्तर से उठने या चलने में असमर्थ', isRedFlag: true },
          { id: 'moderate_limit', labelEn: 'Able to do routine tasks but with significant difficulty', labelHi: 'दिक्कत के साथ रोजमर्रा के काम कर पा रहे हैं' },
          { id: 'mild_annoyance', labelEn: 'Mild discomfort, able to work and move normally', labelHi: 'हल्की परेशानी, काम सामान्य रूप से चल रहा है' }
        ]
      }
    ]
  };

  const domainFallbacks = fallbackQuestions[domain] || fallbackQuestions.general;

  if (!GEMINI_API_KEY) {
    return domainFallbacks;
  }

  try {
    const prompt = `You are an expert clinical triage physician.
A patient has presented with this chief complaint: "${chiefComplaint}".
Patient Demographics: Age: ${age || 'Adult'}, Gender: ${gender || 'Unknown'}.
Clinical Domain: ${domain}.

Generate 2 targeted, clinically high-yield follow-up questions to rule in or rule out critical differential diagnoses.
Ensure each question has 3 to 4 realistic options in both English and Hindi, with 'isRedFlag: true' tagged for emergency warning answers.

Return ONLY a valid JSON array matching this exact schema:
[
  {
    "id": "q1",
    "questionEn": "English question text",
    "questionHi": "Hindi question text (in Devanagari script)",
    "clinicalRationale": "Why this question is clinically essential",
    "options": [
      {
        "id": "opt1",
        "labelEn": "English option text",
        "labelHi": "Hindi option text",
        "isRedFlag": false
      }
    ]
  }
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) return domainFallbacks;
    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return domainFallbacks;

    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return domainFallbacks;
  } catch (err) {
    console.warn('Error fetching Gemini adaptive questions, using clinical fallbacks:', err);
    return domainFallbacks;
  }
}
