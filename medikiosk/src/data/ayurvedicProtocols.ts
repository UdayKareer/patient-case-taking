export type Dosha = 'vata' | 'pitta' | 'kapha' | 'tridoshic' | 'none';

export interface AyushQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  options: {
    labelEn: string;
    labelHi: string;
    nextQuestionId: string | null;
    associatedDosha: Dosha;
    clinicalNote?: string;
  }[];
}

// Tree structured question flow for Ayurvedic Pariksha
export const AYURVEDA_QUESTION_TREE: Record<string, AyushQuestion> = {
  // --- GASTRO / AGNI BRANCH (Start here if complaint is GI related) ---
  'q_gastro_start': {
    id: 'q_gastro_start',
    questionEn: 'How does your digestive issue typically feel (Agni Pariksha)?',
    questionHi: 'आपकी पाचन समस्या मुख्य रूप से कैसी महसूस होती है?',
    options: [
      { labelEn: 'Heavy, sluggish, loss of appetite', labelHi: 'भारीपन, भूख न लगना', nextQuestionId: 'q_gastro_kapha', associatedDosha: 'kapha', clinicalNote: 'Mandagni indicator' },
      { labelEn: 'Severe burning, acidic, excessive hunger', labelHi: 'तेज जलन, खट्टी डकार, बहुत ज्यादा भूख', nextQuestionId: 'q_gastro_pitta', associatedDosha: 'pitta', clinicalNote: 'Tikshnagni indicator' },
      { labelEn: 'Gas, bloating, unpredictable appetite', labelHi: 'गैस, पेट फूलना, कभी भूख लगती है कभी नहीं', nextQuestionId: 'q_gastro_vata', associatedDosha: 'vata', clinicalNote: 'Vishamagni indicator' },
    ]
  },
  'q_gastro_kapha': {
    id: 'q_gastro_kapha',
    questionEn: 'Do you feel nauseous or lethargic after eating? Are your bowel movements slow and sticky?',
    questionHi: 'क्या खाना खाने के बाद उल्टी जैसा या आलस लगता है? क्या शौच चिपचिपा और धीमा होता है?',
    options: [
      { labelEn: 'Yes, very lethargic and slow bowel', labelHi: 'हाँ, बहुत आलस और धीमा शौच', nextQuestionId: 'q_general_sleep', associatedDosha: 'kapha' },
      { labelEn: 'No, just loss of appetite', labelHi: 'नहीं, बस भूख कम लगती है', nextQuestionId: 'q_general_sleep', associatedDosha: 'none' },
    ]
  },
  'q_gastro_pitta': {
    id: 'q_gastro_pitta',
    questionEn: 'Do you have a burning sensation in the throat/chest, or loose stools (Atisara)?',
    questionHi: 'क्या गले या सीने में जलन होती है, या दस्त की शिकायत रहती है?',
    options: [
      { labelEn: 'Severe chest burning (Amlapitta)', labelHi: 'सीने में तेज जलन', nextQuestionId: 'q_general_sleep', associatedDosha: 'pitta' },
      { labelEn: 'Frequent loose stools', labelHi: 'बार-बार पतले दस्त', nextQuestionId: 'q_general_sleep', associatedDosha: 'pitta' },
    ]
  },
  'q_gastro_vata': {
    id: 'q_gastro_vata',
    questionEn: 'Are you experiencing severe constipation (Krura Koshtha) and dry, hard stools?',
    questionHi: 'क्या आपको तेज कब्ज (क्रूर कोष्ठ) और सूखा, कड़ा मल होता है?',
    options: [
      { labelEn: 'Yes, very dry and hard stools', labelHi: 'हाँ, बहुत सूखा और कड़ा शौच', nextQuestionId: 'q_general_sleep', associatedDosha: 'vata' },
      { labelEn: 'Mainly gas and bloating without severe constipation', labelHi: 'कब्ज नहीं, लेकिन गैस और पेट बहुत फूलता है', nextQuestionId: 'q_general_sleep', associatedDosha: 'vata' },
    ]
  },

  // --- NEURO / JOINT BRANCH (Start here if complaint is joint/neuro related) ---
  'q_neuro_start': {
    id: 'q_neuro_start',
    questionEn: 'Describe the nature of your joint pain or stiffness.',
    questionHi: 'आपके जोड़ों के दर्द या जकड़न का प्रकार कैसा है?',
    options: [
      { labelEn: 'Dry, cracking joints with shooting pain', labelHi: 'सूखे, कटकटाते जोड़ और खिंचाव वाला दर्द', nextQuestionId: 'q_neuro_vata', associatedDosha: 'vata', clinicalNote: 'Sandhigata Vata indicator' },
      { labelEn: 'Swollen, red, hot joints with burning', labelHi: 'सूजे हुए, लाल, गर्म जोड़ और जलन', nextQuestionId: 'q_neuro_pitta', associatedDosha: 'pitta', clinicalNote: 'Vatarakta / Pitta indicator' },
      { labelEn: 'Heavy, stiff, cold joints (worse in morning)', labelHi: 'भारी, जकड़े हुए, ठंडे जोड़ (सुबह ज्यादा तकलीफ)', nextQuestionId: 'q_neuro_kapha', associatedDosha: 'kapha', clinicalNote: 'Amavata indicator' },
    ]
  },
  'q_neuro_vata': {
    id: 'q_neuro_vata',
    questionEn: 'Does the pain worsen with cold weather and dry winds? Do you feel anxiety?',
    questionHi: 'क्या दर्द ठंडे मौसम या रूखी हवा में बढ़ जाता है? क्या आपको घबराहट होती है?',
    options: [
      { labelEn: 'Yes, cold worsens it significantly', labelHi: 'हाँ, ठंड से बहुत तकलीफ बढ़ती है', nextQuestionId: 'q_general_sleep', associatedDosha: 'vata' },
      { labelEn: 'No, not necessarily related to weather', labelHi: 'नहीं, मौसम से खास संबंध नहीं', nextQuestionId: 'q_general_sleep', associatedDosha: 'none' },
    ]
  },
  'q_neuro_pitta': {
    id: 'q_neuro_pitta',
    questionEn: 'Is there intense redness or associated fever/sweating?',
    questionHi: 'क्या लालिमा बहुत ज्यादा है या साथ में बुखार/पसीना भी आता है?',
    options: [
      { labelEn: 'Yes, very hot and sweating', labelHi: 'हाँ, बहुत गर्मी और पसीना', nextQuestionId: 'q_general_sleep', associatedDosha: 'pitta' },
      { labelEn: 'Just localized redness', labelHi: 'सिर्फ उस जगह पर लालिमा है', nextQuestionId: 'q_general_sleep', associatedDosha: 'pitta' },
    ]
  },
  'q_neuro_kapha': {
    id: 'q_neuro_kapha',
    questionEn: 'Is your digestion sluggish along with the joint stiffness (suggests Ama/Toxins)?',
    questionHi: 'क्या जोड़ों की जकड़न के साथ आपका पाचन भी धीमा/खराब रहता है (आम दोष)?',
    options: [
      { labelEn: 'Yes, heavy digestion and coated tongue', labelHi: 'हाँ, पेट भारी रहता है और जीभ पर सफेद परत है', nextQuestionId: 'q_general_sleep', associatedDosha: 'kapha' },
      { labelEn: 'Digestion is mostly fine', labelHi: 'पाचन आमतौर पर ठीक है', nextQuestionId: 'q_general_sleep', associatedDosha: 'none' },
    ]
  },

  // --- GENERAL CONSTITUTION (Nidra & Manas) ---
  'q_general_sleep': {
    id: 'q_general_sleep',
    questionEn: 'How is your sleep pattern (Nidra Pariksha)?',
    questionHi: 'आपकी नींद का स्वरूप (निद्रा) कैसा है?',
    options: [
      { labelEn: 'Light, interrupted, trouble falling asleep', labelHi: 'कच्ची नींद, बार-बार टूटना, नींद आने में दिक्कत', nextQuestionId: 'q_general_thirst', associatedDosha: 'vata' },
      { labelEn: 'Moderate, but wake up feeling hot or intense', labelHi: 'मध्यम, लेकिन गर्मी लगती है या बेचैनी से खुलती है', nextQuestionId: 'q_general_thirst', associatedDosha: 'pitta' },
      { labelEn: 'Heavy, prolonged, hard to wake up', labelHi: 'बहुत गहरी और लंबी नींद, सुबह उठने में भारीपन', nextQuestionId: 'q_general_thirst', associatedDosha: 'kapha' },
    ]
  },

  'q_general_thirst': {
    id: 'q_general_thirst',
    questionEn: 'How is your thirst and skin texture?',
    questionHi: 'आपकी प्यास और त्वचा की बनावट कैसी है?',
    options: [
      { labelEn: 'Variable thirst, dry/rough skin', labelHi: 'प्यास कभी ज्यादा कभी कम, त्वचा रूखी और खुरदरी', nextQuestionId: null, associatedDosha: 'vata' },
      { labelEn: 'Excessive thirst, warm/reddish skin', labelHi: 'बहुत ज्यादा प्यास, त्वचा गर्म और लालिमा लिए हुए', nextQuestionId: null, associatedDosha: 'pitta' },
      { labelEn: 'Low thirst, oily/smooth skin', labelHi: 'प्यास कम, त्वचा चिकनी और तैलीय', nextQuestionId: null, associatedDosha: 'kapha' },
    ]
  }
};

export const getStartingQuestionId = (chiefComplaintId?: string): string => {
  if (chiefComplaintId === 'gastro_ayush') return 'q_gastro_start';
  if (chiefComplaintId === 'neuro_joint') return 'q_neuro_start';
  // Fallback to general digestive start if unknown, as Agni is the root in Ayurveda
  return 'q_gastro_start'; 
};
