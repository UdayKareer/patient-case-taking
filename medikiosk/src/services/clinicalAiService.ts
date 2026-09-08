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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      }
    );
    clearTimeout(timeoutId);

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

export interface PatientAdaptiveContext {
  chiefComplaint: string;
  age?: string;
  gender?: string;
  duration?: string;
  site?: string;
  character?: string;
  radiation?: string;
  severity?: number;
  aggravating?: string;
  relieving?: string;
  associated?: string[];
  chronicConditions?: Array<{ condition: string }>;
}

/**
 * Generate 2-3 adaptive clinical follow-up questions using Gemini 3.5 Flash-lite (Feature 4A)
 * Enhanced with context-rich prompting, empathetic patient phrasing, and deterministic fail-safe.
 */
export async function generateAdaptiveQuestions(
  contextOrComplaint: string | PatientAdaptiveContext,
  fallbackAge?: string,
  fallbackGender?: string
): Promise<DynamicQuestion[]> {
  const context: PatientAdaptiveContext =
    typeof contextOrComplaint === 'string'
      ? {
          chiefComplaint: contextOrComplaint,
          age: fallbackAge || 'Adult',
          gender: fallbackGender || 'Unknown'
        }
      : contextOrComplaint;

  const chiefComplaint = context.chiefComplaint || '';
  const domain = detectClinicalDomain(chiefComplaint);

  // Default deterministic clinical trees with calm, empathetic, jargon-free phrasing
  const fallbackQuestions: Record<ClinicalDomain, DynamicQuestion[]> = {
    respiratory: [
      {
        id: 'resp_sputum',
        questionEn: 'What is the nature of your cough and secretions?',
        questionHi: 'आपकी खांसी और बलगम का स्वरूप कैसा है?',
        clinicalRationale: 'Assesses infectious vs inflammatory etiology and bronchial involvement.',
        options: [
          { id: 'dry_hacking', labelEn: 'Dry, irritating cough without phlegm', labelHi: 'सूखी खांसी, बिना बलगम के' },
          { id: 'yellow_green', labelEn: 'Thick yellowish or greenish phlegm', labelHi: 'गाढ़ा पीला या हरा बलगम' },
          { id: 'blood_tinged', labelEn: 'Small pink or red streaks noticed in phlegm', labelHi: 'बलगम में हल्के लाल या गुलाबी छींटे', isRedFlag: true },
          { id: 'clear_mucoid', labelEn: 'Clear or watery thin secretions', labelHi: 'सफेद या पतला बलगम' }
        ]
      },
      {
        id: 'resp_triggers',
        questionEn: 'Do specific situations make breathing more difficult?',
        questionHi: 'क्या किसी विशेष स्थिति में सांस लेने में अधिक कठिनाई होती है?',
        clinicalRationale: 'Identifies postural or environmental respiratory patterns.',
        options: [
          { id: 'cold_dust', labelEn: 'Exposure to cold air, dust, or smoke', labelHi: 'ठंडी हवा, धूल या धुआं' },
          { id: 'exertion_stairs', labelEn: 'Climbing stairs or walking briskly', labelHi: 'सीढ़ियां चढ़ने या तेज चलने पर' },
          { id: 'lying_flat', labelEn: 'Lying flat on bed at night', labelHi: 'रात में बिस्तर पर सीधा लेटने पर', isRedFlag: true },
          { id: 'constant_all_times', labelEn: 'Present consistently throughout the day', labelHi: 'दिनभर एक जैसी स्थिति रहना' }
        ]
      }
    ],
    gastrointestinal: [
      {
        id: 'gi_stool_nature',
        questionEn: 'How would you describe your bowel movements over the past 24 hours?',
        questionHi: 'पिछले 24 घंटों में आपके शौच (मल) की स्थिति कैसी रही है?',
        clinicalRationale: 'Screens for acute fluid loss and bowel inflammation.',
        options: [
          { id: 'watery_frequent', labelEn: 'Frequent watery loose motions (> 4 times today)', labelHi: 'बार-बार पतले पानी जैसे दस्त (आज 4 बार से अधिक)', isRedFlag: true },
          { id: 'hard_straining', labelEn: 'Hard dry stool requiring significant effort', labelHi: 'सख्त सूखा मल और शौच में अधिक जोर लगना' },
          { id: 'blood_mucus', labelEn: 'Noticed reddish or unusually dark black stools', labelHi: 'शौच में लाल या असामान्य काला रंग दिखना', isRedFlag: true },
          { id: 'bloated_irregular', labelEn: 'Mild abdominal fullness with cramps and gas', labelHi: 'पेट में हल्का भारीपन, गैस और मरोड़' }
        ]
      },
      {
        id: 'gi_oral_intake',
        questionEn: 'Are you currently able to keep water and light food down?',
        questionHi: 'क्या आप पानी और हल्का खाना बिना उल्टी के ले पा रहे हैं?',
        clinicalRationale: 'Assesses oral tolerance and hydration capacity.',
        options: [
          { id: 'tolerating_well', labelEn: 'Able to drink water and light liquids comfortably', labelHi: 'पानी और हल्का भोजन आराम से ले पा रहे हैं' },
          { id: 'vomiting_everything', labelEn: 'Unable to keep liquids down, frequent vomiting', labelHi: 'पानी पीते ही उल्टी हो जाना', isRedFlag: true },
          { id: 'intense_thirst', labelEn: 'Feeling severe thirst, dry lips, and marked weakness', labelHi: 'गला सूखना, तेज प्यास और कमजोरी लगना', isRedFlag: true }
        ]
      }
    ],
    fever: [
      {
        id: 'fever_chills_pattern',
        questionEn: 'Does the fever come with shivering chills or sudden temperature peaks?',
        questionHi: 'क्या बुखार ठंड लगने, कंपकंपी या तेज गर्माहट के साथ आता है?',
        clinicalRationale: 'Evaluates febrile pattern and shivering rigors.',
        options: [
          { id: 'severe_rigors', labelEn: 'Shivering chills requiring extra warmth and blankets', labelHi: 'तेज कंपकंपी जिसमें कंबल ओढ़ने की जरूरत पड़े', isRedFlag: true },
          { id: 'evening_sweats', labelEn: 'Tends to rise in the evening with sweating', labelHi: 'शाम के समय बढ़ना और पसीना आना' },
          { id: 'continuous_high', labelEn: 'Persistent high body heat that does not settle', labelHi: 'लगातार तेज बुखार जो कम नहीं हो रहा' },
          { id: 'low_grade_flu', labelEn: 'Mild feverish feeling with general body tiredness', labelHi: 'हल्का बुखार और शरीर में सुस्ती व दर्द' }
        ]
      }
    ],
    metabolic: [
      {
        id: 'metabolic_symptoms',
        questionEn: 'Have you noticed any changes in thirst, urination, or energy levels?',
        questionHi: 'क्या प्यास, पेशाब या ऊर्जा के स्तर में कोई बदलाव महसूस हुआ है?',
        clinicalRationale: 'Screens for metabolic fluid homeostasis and glycemic balance.',
        options: [
          { id: 'polyuria_thirst', labelEn: 'Waking frequently at night to drink water and urinate', labelHi: 'रात में बार-बार उठकर पानी पीना और पेशाब जाना' },
          { id: 'unintentional_weight_loss', labelEn: 'Noticeable unintended weight reduction recently', labelHi: 'हाल में तेजी से वजन कम होना', isRedFlag: true },
          { id: 'blurred_vision', labelEn: 'Episodes of visual blurriness or noticeable fatigue', labelHi: 'आंखों के आगे धुंधलापन या जल्दी थकान होना' },
          { id: 'stable_routine', labelEn: 'No major changes, here for routine health follow-up', labelHi: 'कोई खास बदलाव नहीं, नियमित जांच के लिए आए हैं' }
        ]
      }
    ],
    pain: [
      {
        id: 'pain_radiation_check',
        questionEn: 'Does the discomfort spread or travel to any other part of your body?',
        questionHi: 'क्या यह परेशानी शरीर के किसी अन्य हिस्से में भी फैलती है?',
        clinicalRationale: 'Evaluates dermatomal radiculopathy and referred pain patterns.',
        options: [
          { id: 'rad_left_jaw', labelEn: 'Spreads to shoulder, inner arm, or jaw', labelHi: 'कंधे, हाथ या जबड़े तक फैलता है', isRedFlag: true },
          { id: 'rad_back_scapula', labelEn: 'Extends through to the upper back or shoulder blade', labelHi: 'पीठ के पीछे या कंधे की हड्डी तक जाता है' },
          { id: 'rad_leg_sciatica', labelEn: 'Travels down through the hip, leg, or foot', labelHi: 'कमर से नीचे पैर या पंजे की तरफ जाता है' },
          { id: 'rad_localized_none', labelEn: 'Remains strictly in one focal spot', labelHi: 'एक ही जगह रहता है, कहीं फैलता नहीं' }
        ]
      }
    ],
    general: [
      {
        id: 'general_functional_impact',
        questionEn: 'How is this condition affecting your ability to carry out daily activities?',
        questionHi: 'यह परेशानी आपकी दिनचर्या को कितना प्रभावित कर रही है?',
        clinicalRationale: 'Assesses functional independence and ambulatory safety.',
        options: [
          { id: 'bedridden', labelEn: 'Feeling very weak, needing assistance to stand or walk', labelHi: 'बहुत कमजोरी, उठने या चलने में सहारे की जरूरत', isRedFlag: true },
          { id: 'moderate_limit', labelEn: 'Able to do light tasks but with noticeable difficulty', labelHi: 'कठिनाई के साथ हल्के काम कर पा रहे हैं' },
          { id: 'mild_annoyance', labelEn: 'Mild discomfort, able to continue daily routine', labelHi: 'हल्की परेशानी, दैनिक काम सामान्य रूप से जारी हैं' }
        ]
      }
    ]
  };

  const domainFallbacks = fallbackQuestions[domain] || fallbackQuestions.general;

  if (!GEMINI_API_KEY) {
    return domainFallbacks;
  }

  try {
    const prompt = `You are an empathetic, world-class hospital clinical consultant creating 2 follow-up questions for a patient intake kiosk.
Patient Context:
- Chief Complaint: "${chiefComplaint}"
- Age: ${context.age || 'Adult'}, Gender: ${context.gender || 'Unknown'}
- Duration: ${context.duration || 'Not specified'}
- Location/Site: ${context.site || 'Not specified'}
- Character: ${context.character || 'Not specified'}
- Severity: ${context.severity || 'Unspecified'}/10
- Associated Symptoms: ${(context.associated || []).join(', ') || 'None reported'}

CRITICAL GUIDELINES FOR PATIENT SAFETY & PEACE OF MIND:
1. Tone must be warm, reassuring, respectful, and clinically focused.
2. AVOID REDUNDANT QUESTIONS: If the Patient Context above already specifies their Duration, Location/Site, Character, or Associated Symptoms, DO NOT ask them about those things again. Your questions MUST uncover entirely NEW information (e.g., triggers, progression, exact nature of the symptom).
3. DO NOT use fear-inducing terms (e.g. avoid words like 'fatal', 'heart attack danger', 'emergency red flag', 'critical warning', 'imminent threat').
4. DO NOT use obscure medical jargon in patient options (e.g. use 'small red streaks in phlegm' instead of 'hemoptysis', use 'trouble breathing when lying flat' instead of 'orthopnea').
5. Provide natural, accurate, conversational Hindi (in Devanagari script) alongside English for every question and option.
6. Set 'isRedFlag: true' on options that indicate serious symptoms for internal hospital prioritization, but make the option label itself calm and descriptive.

Return ONLY a valid JSON array matching this exact schema:
[
  {
    "id": "q1",
    "questionEn": "Patient-friendly English question text",
    "questionHi": "Hindi question text (in Devanagari script)",
    "clinicalRationale": "Short physician rationale explaining what clinical condition this clarifies",
    "options": [
      {
        "id": "opt1",
        "labelEn": "Clear, reassuring English option",
        "labelHi": "Hindi option translation",
        "isRedFlag": false
      }
    ]
  }
]`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      }
    );
    clearTimeout(timeoutId);

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
    console.warn('Adaptive questions fetch timed out or errored, using clinical fallbacks smoothly:', err);
    return domainFallbacks;
  }
}
