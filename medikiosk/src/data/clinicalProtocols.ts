export interface PresetOption {
  id: string;
  labelEn: string;
  labelHi: string;
  icon?: string;
  isRedFlag?: boolean;
}

export interface ComplaintCategory {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  commonComplaints: Array<{
    textEn: string;
    textHi: string;
    defaultSite: string;
    isEmergency?: boolean;
  }>;
}

export const CHIEF_COMPLAINT_PRESETS: ComplaintCategory[] = [
  {
    id: 'cardiorespiratory',
    titleEn: 'Chest & Breathing',
    titleHi: 'सीने और सांस की समस्या',
    subtitleEn: 'Chest discomfort, breathlessness, palpitations',
    subtitleHi: 'सीने में भारीपन, सांस फूलना, धड़कन तेज होना',
    commonComplaints: [
      { textEn: 'Severe retrosternal chest heaviness radiating to left arm & jaw with cold sweats', textHi: 'सीने में भारी दबाव जो बाएं हाथ और जबड़े तक जा रहा है और पसीना आ रहा है', defaultSite: 'Retrosternal chest', isEmergency: true },
      { textEn: 'Sudden shortness of breath / gasping on slight walking or stairs', textHi: 'थोड़ा चलने पर भी अचानक सांस फूलना और घबराहट होना', defaultSite: 'Chest & Lungs', isEmergency: true },
      { textEn: 'Sharp stabbing chest pain worsening on deep inspiration or coughing', textHi: 'गहरी सांस लेने या खांसने पर सीने में तीखा चुभने वाला दर्द', defaultSite: 'Chest Wall / Pleura' },
      { textEn: 'Rapid racing heartbeat, fluttering sensation in chest (Palpitations)', textHi: 'अचानक दिल की धड़कन बहुत तेज और अनियमित होना (घबराहट)', defaultSite: 'Precordial chest' },
      { textEn: 'Persistent dry hacking cough with nocturnal wheezing & chest tightness', textHi: 'लगातार सूखी खांसी, रात में सीटी जैसी आवाज और सीने में जकड़न', defaultSite: 'Throat & Bronchial airway' }
    ]
  },
  {
    id: 'gastro_ayush',
    titleEn: 'Digestion & Stomach',
    titleHi: 'पेट, पाचन और एसिडिटी',
    subtitleEn: 'Acidity, burning, severe pain, bloating, bowel distress',
    subtitleHi: 'पेट में जलन, खट्टी डकारें, दर्द, उल्टी या दस्त',
    commonComplaints: [
      { textEn: 'Severe retrosternal burning, sour acidic regurgitation and heartburn', textHi: 'सीने और पेट में तेज जलन, खट्टी डकारें और एसिडिटी', defaultSite: 'Epigastrium / Upper abdomen' },
      { textEn: 'Severe cramping abdominal pain with recurrent nausea & vomiting', textHi: 'पेट में तेज मरोड़ का दर्द और बार-बार उल्टी या जी मिचलाना', defaultSite: 'Umbilical / Abdomen' },
      { textEn: 'Frequent watery loose motions with dehydration, weakness and stomach cramps', textHi: 'बार-बार पतले दस्त, कमजोरी, पानी की कमी और पेट में ऐंठन', defaultSite: 'Lower Abdomen' },
      { textEn: 'Chronic constipation, hard dry stools, severe straining and gas bloating', textHi: 'लंबे समय से सख्त कब्ज, शौच में बहुत कठिनाई और पेट फूलना', defaultSite: 'Lower Abdomen / Colon' },
      { textEn: 'Sharp pain in upper right side of abdomen after oily or spicy meals', textHi: 'तला-भुना या भारी खाना खाने के बाद पेट के ऊपरी दाहिने हिस्से में तेज दर्द', defaultSite: 'Right Hypochondrium' }
    ]
  },
  {
    id: 'fever_infections',
    titleEn: 'Fever & Chills',
    titleHi: 'बुखार, कंपकंपी और संक्रमण',
    subtitleEn: 'High temperature, shivering chills, viral illness, bodyache',
    subtitleHi: 'तेज बुखार, कंपकंपी, बदन दर्द, कमजोरी और संक्रमण',
    commonComplaints: [
      { textEn: 'High-grade fever with severe shivering chills and rigors (102°F+)', textHi: 'कंपकंपी और ठंड लगने के साथ तेज बुखार (102°F से अधिक)', defaultSite: 'Generalized body', isEmergency: true },
      { textEn: 'Fever with severe body ache, intense joint/back pain and pain behind eyes (Viral/Dengue)', textHi: 'तेज बुखार के साथ पूरे बदन, जोड़ों व कमर में तेज दर्द और आंखों के पीछे दर्द', defaultSite: 'Head, Back & Joints' },
      { textEn: 'Fever accompanied by severe sore throat, painful swallowing and dry cough', textHi: 'बुखार के साथ गले में तेज खराश, दर्द और निगलने में तकलीफ', defaultSite: 'Throat & Pharynx' },
      { textEn: 'Intermittent fever rising every evening with profuse night sweats and exhaustion', textHi: 'हर शाम को तेज बुखार आना, रात में पसीना और अत्यधिक कमजोरी', defaultSite: 'Generalized body' },
      { textEn: 'Fever associated with stomach upset, nausea, vomiting or loose motions', textHi: 'बुखार के साथ पेट खराब, उल्टी, जी मिचलाना या दस्त लगना', defaultSite: 'Abdomen & Systemic' },
      { textEn: 'Persistent low-grade continuous fever lasting for more than 5 days', textHi: '5 दिनों से लगातार बना रहने वाला हल्का बुखार और थकान', defaultSite: 'Generalized body' }
    ]
  },
  {
    id: 'neuro_joint',
    titleEn: 'Joints, Spine & Headache',
    titleHi: 'जोड़, रीढ़ और सिरदर्द',
    subtitleEn: 'Joint pain, stiffness, sciatica, severe migraine headache',
    subtitleHi: 'जोड़ों का दर्द, जकड़न, साइटिका, सर्वाइकल और तेज सिरदर्द',
    commonComplaints: [
      { textEn: 'Bilateral knee joint pain, swelling, stiffness and grinding sound on walking (Osteoarthritis)', textHi: 'दोनों घुटनों में दर्द, सूजन, जकड़न और चलने पर कट-कट की आवाज', defaultSite: 'Bilateral Knees' },
      { textEn: 'Severe throbbing one-sided headache with nausea and light sensitivity (Migraine)', textHi: 'सिर के एक हिस्से में तेज धड़कता हुआ दर्द, उल्टी जैसा लगना और रोशनी से परेशानी', defaultSite: 'Frontotemporal head' },
      { textEn: 'Severe radiating lower back pain shooting down into leg and calf (Sciatica)', textHi: 'कमर के निचले हिस्से से लेकर पैर और पिंडलियों तक खिंचाव और तेज दर्द (साइटिका)', defaultSite: 'Lumbar spine to leg' },
      { textEn: 'Neck pain and stiffness radiating into shoulder and arm (Cervical Spondylosis)', textHi: 'गर्दन में अकड़न और दर्द जो कंधे और हाथ तक जाता है (सर्वाइकल)', defaultSite: 'Cervical spine & Shoulder' },
      { textEn: 'Sudden dizziness, spinning sensation and feeling unsteady on standing (Vertigo)', textHi: 'अचानक चक्कर आना, सब कुछ घूमता हुआ लगना और खड़े होने में संतुलन बिगड़ना', defaultSite: 'Head & Vestibular' }
    ]
  }
];

export const SOCRATES_OPTIONS = {
  site: [
    { id: 'chest_cardiac', labelEn: 'Chest & Retrosternal / Precordium', labelHi: 'सीने के बीच में या दिल के पास' },
    { id: 'head_neck', labelEn: 'Head & Neck / ENT / Throat', labelHi: 'सिर, गर्दन या गले में' },
    { id: 'upper_abdomen', labelEn: 'Upper Abdomen / Stomach / Epigastrium', labelHi: 'पेट के ऊपरी हिस्से में' },
    { id: 'lower_abdomen', labelEn: 'Lower Abdomen / Pelvic region', labelHi: 'पेट के निचले हिस्से में' },
    { id: 'back_spine', labelEn: 'Back & Spine / Lumbar area', labelHi: 'पीठ, कमर या रीढ़ की हड्डी में' },
    { id: 'joints_limbs', labelEn: 'Joints / Knees / Arms / Legs', labelHi: 'जोड़ों, घुटनों या हाथ-पैरों में' },
    { id: 'generalized', labelEn: 'Generalized / Full body discomfort', labelHi: 'पूरे शरीर में फैला हुआ' }
  ],
  onset: [
    { id: 'sudden_acute', labelEn: 'Sudden (< 1 hour ago)', labelHi: 'अचानक (1 घंटे से भी कम)', isRedFlag: true },
    { id: 'hours_today', labelEn: 'Started earlier today', labelHi: 'आज सुबह से शुरू हुआ' },
    { id: 'few_days', labelEn: '2 - 5 days ago', labelHi: '2 से 5 दिनों से' },
    { id: 'chronic_weeks', labelEn: 'Weeks to months (Chronic)', labelHi: 'हफ्तों या महीनों से (पुराना)' }
  ],
  character: [
    { id: 'crushing', labelEn: 'Heavy crushing / Pressure', labelHi: 'भारी दबाव / जकड़न', isRedFlag: true },
    { id: 'burning', labelEn: 'Burning / Acidic sensation', labelHi: 'तेज जलन / एसिडिटी' },
    { id: 'sharp', labelEn: 'Sharp / Stabbing needle-like', labelHi: 'तीखा / सुई चुभने जैसा' },
    { id: 'dull_ache', labelEn: 'Dull deep continuous ache', labelHi: 'धीमा लगातार बना रहने वाला दर्द' },
    { id: 'throbbing', labelEn: 'Pulsating / Throbbing', labelHi: 'धड़कता हुआ दर्द (धड़कन जैसा)' },
    { id: 'colicky', labelEn: 'Comes and goes in waves (Cramps)', labelHi: 'रुक-रुक कर मरोड़ उठना' }
  ],
  radiation: [
    { id: 'none', labelEn: 'Stays localized in one area', labelHi: 'एक ही जगह रहता है, फैलता नहीं' },
    { id: 'left_arm_jaw', labelEn: 'Radiates to left arm, shoulder, or jaw', labelHi: 'बाएं हाथ, कंधे या जबड़े में फैलता है', isRedFlag: true },
    { id: 'back', labelEn: 'Radiates through to the back', labelHi: 'पीठ के पीछे की तरफ जाता है' },
    { id: 'groin', labelEn: 'Radiates downwards to lower abdomen/groin', labelHi: 'पेट के निचले हिस्से या जांघ में जाता है' }
  ],
  timing: [
    { id: 'continuous', labelEn: 'Constant continuous (Never subsides)', labelHi: 'लगातार बना रहता है (रुकता नहीं)' },
    { id: 'intermittent_waves', labelEn: 'Episodic waves (Comes & goes)', labelHi: 'रुक-रुक कर आता है (दौरे की तरह)' },
    { id: 'morning_worse', labelEn: 'Worst upon morning awakening', labelHi: 'सुबह उठने पर सबसे ज्यादा' },
    { id: 'night_worse', labelEn: 'Worst at night / while lying flat', labelHi: 'रात में या सीधा लेटने पर ज्यादा' },
    { id: 'post_meal', labelEn: 'Triggers shortly after meals', labelHi: 'खाना खाने के थोड़ी देर बाद शुरू' }
  ],
  aggravating: [
    { id: 'exertion', labelEn: 'Physical walking or stairs', labelHi: 'चलने या सीढ़ियां चढ़ने पर' },
    { id: 'food_spicy', labelEn: 'After eating spicy / oily food', labelHi: 'मसालेदार या तला-भुना खाने के बाद' },
    { id: 'posture', labelEn: 'Bending forward / coughing', labelHi: 'झुकने या खांसने पर' },
    { id: 'stress', labelEn: 'Mental stress & empty stomach', labelHi: 'मानसिक तनाव या खाली पेट रहने पर' }
  ],
  relieving: [
    { id: 'complete_rest', labelEn: 'Sitting down and complete rest', labelHi: 'बैठने और आराम करने से' },
    { id: 'antacids_milk', labelEn: 'Cold milk, antacids or light food', labelHi: 'ठंडा दूध, दवा या हल्का खाना लेने से' },
    { id: 'warm_fluids', labelEn: 'Warm water / steam inhalation', labelHi: 'गर्म पानी या भाप लेने से' },
    { id: 'lying_still', labelEn: 'Lying still in dark quiet room', labelHi: 'अंधेरे कमरे में शांति से लेटने से' }
  ],
  associated: [
    { id: 'sweating', labelEn: 'Profuse cold sweating (Diaphoresis)', labelHi: 'ठंडा पसीना आना', isRedFlag: true },
    { id: 'dyspnea', labelEn: 'Shortness of breath / gasping', labelHi: 'सांस फूलना या घबराहट', isRedFlag: true },
    { id: 'nausea', labelEn: 'Nausea or vomiting sensation', labelHi: 'जी मिचलाना या उल्टी आना' },
    { id: 'dizziness', labelEn: 'Lightheadedness / feeling faint', labelHi: 'चक्कर आना या बेहोशी जैसा लगना' },
    { id: 'fever_chills', labelEn: 'High fever with shivering', labelHi: 'तेज बुखार और कंपकंपी' },
    { id: 'bloating', labelEn: 'Gas bloating & sour burps', labelHi: 'पेट फूलना और खट्टी डकारें' }
  ]
};

export const FEVER_OPTIONS = {
  onset: [
    { id: 'sudden_acute', labelEn: 'Started suddenly today (< 12 hrs)', labelHi: 'आज अचानक शुरू हुआ (12 घंटे से कम)', isRedFlag: true },
    { id: 'days_1_2', labelEn: '1 to 2 days ago', labelHi: '1 से 2 दिनों से' },
    { id: 'days_3_5', labelEn: '3 to 5 days ago (Persistent)', labelHi: '3 से 5 दिनों से लगातार' },
    { id: 'prolonged', labelEn: 'More than 1 week (Prolonged)', labelHi: '1 हफ्ते से अधिक समय से' }
  ],
  character: [
    { id: 'high_continuous', labelEn: 'High continuous burning fever (102°F+)', labelHi: 'लगातार तेज जलने वाला बुखार (102°F+)' },
    { id: 'intermittent_chills', labelEn: 'Comes with severe shivering chills & rigors', labelHi: 'कंपकंपी और ठंड लगने के साथ बुखार आना', isRedFlag: true },
    { id: 'evening_spikes', labelEn: 'Spikes every evening with night sweats', labelHi: 'हर शाम तेज होना और रात में पसीना आना' },
    { id: 'fever_bodyache', labelEn: 'Fever with intense back, bone & eye pain (Breakbone)', labelHi: 'तेज बुखार के साथ आंखों के पीछे व हड्डियों में दर्द' },
    { id: 'low_grade_fatigue', labelEn: 'Low-grade dull fever with extreme tiredness', labelHi: 'हल्का बुखार और अत्यधिक सुस्ती व कमजोरी' }
  ],
  radiation: [
    { id: 'full_body', labelEn: 'Generalized full body chills & aches', labelHi: 'पूरे शरीर में कंपकंपी और बदन दर्द' },
    { id: 'throat_chest', labelEn: 'Mainly in throat, chest & coughing', labelHi: 'मुख्यतः गले में खराश और सीने में' },
    { id: 'head_eyes', labelEn: 'Severe headache and pain behind eyes', labelHi: 'तेज सिरदर्द और आंखों में दर्द' },
    { id: 'stomach_gut', labelEn: 'With nausea, stomach pain & loose stools', labelHi: 'पेट दर्द, उल्टी या दस्त के साथ' }
  ],
  timing: [
    { id: 'continuous', labelEn: 'Continuous sustained fever (No break)', labelHi: 'लगातार बना रहने वाला बुखार' },
    { id: 'intermittent', labelEn: 'Intermittent spikes with normal periods', labelHi: 'रुक-रुक कर चढ़ने-उतरने वाला बुखार' },
    { id: 'evening_rise', labelEn: 'Rises predominantly in evening/night', labelHi: 'मुख्यतः शाम या रात में तेज होना' },
    { id: 'remittent', labelEn: 'Fluctuates throughout day without settling', labelHi: 'दिन भर घटता-बढ़ता रहता है' }
  ],
  aggravating: [
    { id: 'cold_exposure', labelEn: 'Exposure to cold air / AC / breeze', labelHi: 'ठंडी हवा या एसी में रहने पर' },
    { id: 'exertion_standing', labelEn: 'Moving around or physical exertion', labelHi: 'हिलने-डुलने या चलने-फिरने पर' },
    { id: 'evening_hours', labelEn: 'Towards the evening & night time', labelHi: 'शाम और रात के समय' },
    { id: 'empty_stomach', labelEn: 'Dehydration & empty stomach', labelHi: 'खाली पेट रहने या पानी कम पीने पर' }
  ],
  relieving: [
    { id: 'paracetamol_sponge', labelEn: 'Paracetamol / cold wet sponging', labelHi: 'पैरासिटामोल या माथे पर ठंडी पट्टी से' },
    { id: 'warm_blanket', labelEn: 'Warm blankets, resting & sleeping', labelHi: 'कंबल ओढ़ने और आराम से सोने से' },
    { id: 'warm_decoction', labelEn: 'Warm fluids, herbal tea or soups', labelHi: 'गर्म पानी, काढ़ा या सूप पीने से' },
    { id: 'lying_still', labelEn: 'Lying quietly in a shaded room', labelHi: 'शांत कमरे में लेटे रहने से' }
  ],
  associated: [
    { id: 'shivering_rigors', labelEn: 'Severe shivering chills (Teeth chattering)', labelHi: 'दांत किटकिटाने वाली कंपकंपी', isRedFlag: true },
    { id: 'sore_throat_cough', labelEn: 'Severe sore throat & dry cough', labelHi: 'गले में तेज दर्द और सूखी खांसी' },
    { id: 'headache_eyepain', labelEn: 'Severe frontal headache & retro-orbital pain', labelHi: 'तेज सिरदर्द और आंखों के पीछे दर्द' },
    { id: 'vomiting_nausea', labelEn: 'Nausea, vomiting or loose motions', labelHi: 'उल्टी, जी मिचलाना या दस्त' },
    { id: 'rash_flushing', labelEn: 'Skin rashes or extreme redness', labelHi: 'शरीर पर लाल चकत्ते या दाने' },
    { id: 'exhaustion', labelEn: 'Extreme dizziness & inability to stand', labelHi: 'चक्कर आना और खड़े न हो पाना' }
  ]
};

export const RESPIRATORY_OPTIONS = {
  onset: [
    { id: 'sudden_acute', labelEn: 'Sudden choking / acute onset (< 2 hours)', labelHi: 'अचानक सांस फूलना या खांसी (< 2 घंटे)', isRedFlag: true },
    { id: 'today', labelEn: 'Started earlier today', labelHi: 'आज सुबह से शुरू हुआ' },
    { id: 'few_days', labelEn: '3 to 5 days ago (Recent infection)', labelHi: '3 से 5 दिनों से' },
    { id: 'chronic_weeks', labelEn: 'Chronic recurrent for weeks or months', labelHi: 'हफ्तों या महीनों से (लगातार/पुराना)' }
  ],
  character: [
    { id: 'dry_hacking', labelEn: 'Dry, irritating hacking cough (No phlegm)', labelHi: 'सूखी, गले में चुभने वाली खांसी' },
    { id: 'yellow_phlegm', labelEn: 'Productive with thick yellowish/greenish sputum', labelHi: 'गाढ़ा पीला या हरा बलगम आना' },
    { id: 'blood_streaked', labelEn: 'Blood-streaked or rusty sputum (Hemoptysis)', labelHi: 'बलगम में खून की धारियां (हेमोप्टाइसिस)', isRedFlag: true },
    { id: 'wheezy_tight', labelEn: 'Whistling sound / wheeze on breathing out', labelHi: 'सांस छोड़ते समय सीटी की आवाज (घरघराहट)', isRedFlag: true },
    { id: 'barking_stridor', labelEn: 'Harsh high-pitched barking sound on inspiration', labelHi: 'गले से तेज घबराहट भरी आवाज' }
  ],
  radiation: [
    { id: 'none', labelEn: 'Confined to chest & throat', labelHi: 'गले और सीने तक सीमित' },
    { id: 'diffuse_chest', labelEn: 'Spreads across both sides of the chest', labelHi: 'सीने के दोनों तरफ फैलती है' },
    { id: 'throat_ears', labelEn: 'Radiates upwards to ears and throat', labelHi: 'गले से कानों की तरफ दर्द जाना' }
  ],
  timing: [
    { id: 'nocturnal_early', labelEn: 'Worse at 2 AM - 4 AM (Nocturnal dip)', labelHi: 'रात में 2 से 4 बजे ज्यादा तकलीफ' },
    { id: 'morning_wake', labelEn: 'Paroxysms on waking up in the morning', labelHi: 'सुबह सोकर उठने पर खांसी के दौरे' },
    { id: 'continuous', labelEn: 'Continuous unremitting throughout the day', labelHi: 'पूरे दिन लगातार बनी रहती है' },
    { id: 'episodic_triggers', labelEn: 'Episodic only when exposed to cold air or dust', labelHi: 'धूल या ठंडी हवा लगने पर दौरे उठना' }
  ],
  aggravating: [
    { id: 'cold_air', labelEn: 'Cold night breeze or AC', labelHi: 'ठंडी हवा या एसी में रहने पर' },
    { id: 'dust_smoke', labelEn: 'Dust, incense, traffic pollution or smoke', labelHi: 'धूल, धुआं, अगरबत्ती या प्रदूषण' },
    { id: 'lying_flat', labelEn: 'Lying flat on back', labelHi: 'सीधा पीठ के बल लेटने पर' },
    { id: 'physical_exertion', labelEn: 'Walking up stairs or fast walking', labelHi: 'सीढ़ियां चढ़ने या तेज चलने पर' }
  ],
  relieving: [
    { id: 'steam_inhaler', labelEn: 'Steam inhalation & warm water', labelHi: 'भाप लेने और गर्म पानी पीने से' },
    { id: 'bronchodilator_puff', labelEn: 'Rescue inhaler puff (Salbutamol / Duolin)', labelHi: 'इनहेलर का कश लेने से' },
    { id: 'sitting_upright', labelEn: 'Sitting upright leaning forward', labelHi: 'आगे झुककर बैठने से' },
    { id: 'fresh_warm_air', labelEn: 'Warm environment and rest', labelHi: 'गर्म वातावरण और आराम से' }
  ],
  associated: [
    { id: 'stridor_wheeze', labelEn: 'Audible wheezing / whistling in chest', labelHi: 'सीने में सीटी जैसी आवाज', isRedFlag: true },
    { id: 'blue_lips', labelEn: 'Bluish tint on lips / fingers (Cyanosis)', labelHi: 'होंठों या नाखूनों का नीला पड़ना', isRedFlag: true },
    { id: 'chest_heaviness', labelEn: 'Tight heavy feeling across the chest', labelHi: 'सीने में भारीपन या जकड़न' },
    { id: 'fever_chills', labelEn: 'Fever with chills and night sweats', labelHi: 'बुखार और रात में पसीना' },
    { id: 'nasal_rhinitis', labelEn: 'Runny nose, sneezing & itchy eyes', labelHi: 'नाक बहना, छींकें और आंखों में खुजली' }
  ]
};

export const GI_OPTIONS = {
  onset: [
    { id: 'sudden_acute', labelEn: 'Acute sudden onset (< 6 hours)', labelHi: 'अचानक शुरू हुआ (< 6 घंटे)', isRedFlag: true },
    { id: 'today', labelEn: 'Started earlier today after a meal', labelHi: 'आज भोजन के बाद शुरू हुआ' },
    { id: 'few_days', labelEn: '2 to 4 days ago', labelHi: '2 से 4 दिनों से' },
    { id: 'chronic_recurrent', labelEn: 'Chronic intermittent for weeks/months', labelHi: 'हफ्तों या महीनों से बार-बार' }
  ],
  character: [
    { id: 'watery_liquid', labelEn: 'Frequent watery liquid stools (Bristol 7)', labelHi: 'बार-बार पानी जैसे पतले दस्त', isRedFlag: true },
    { id: 'burning_acidity', labelEn: 'Severe burning sensation rising to throat', labelHi: 'सीने और गले में तेज खट्टी जलन' },
    { id: 'cramping_colic', labelEn: 'Severe twisting spasmodic cramps', labelHi: 'पेट में मरोड़ और ऐंठन उठना' },
    { id: 'dry_hard_pellets', labelEn: 'Extremely hard, painful pellet-like stool', labelHi: 'सख्त सूखा मल और अत्यधिक दर्द' },
    { id: 'distended_gas', labelEn: 'Severe tight gas bloating & inability to pass gas', labelHi: 'पेट फूलना और गैस न निकल पाना' }
  ],
  radiation: [
    { id: 'none', labelEn: 'Localized in stomach / lower belly', labelHi: 'पेट तक ही सीमित' },
    { id: 'to_back', labelEn: 'Pierces through directly to the back', labelHi: 'सीधे पीठ की तरफ जाता है' },
    { id: 'to_groin', labelEn: 'Shoots downward to groin area', labelHi: 'नीचे जांघों की तरफ दर्द खिंचना' }
  ],
  timing: [
    { id: 'post_prandial', labelEn: 'Starts 30-60 mins after eating meals', labelHi: 'खाना खाने के 30-60 मिनट बाद' },
    { id: 'empty_stomach', labelEn: 'Worst on empty stomach (Relieved by eating)', labelHi: 'खाली पेट ज्यादा तेज, खाने से आराम' },
    { id: 'continuous_cramps', labelEn: 'Continuous unremitting abdominal pain', labelHi: 'लगातार बना रहने वाला दर्द', isRedFlag: true },
    { id: 'early_morning', labelEn: 'Sudden early morning urgent bowel urge', labelHi: 'सुबह उठते ही अचानक शौच की जल्दी' }
  ],
  aggravating: [
    { id: 'spicy_oily', labelEn: 'Spicy, fried or street food', labelHi: 'मसालेदार, तला-भुना या बाहर का खाना' },
    { id: 'dairy_milk', labelEn: 'Milk, dairy or tea/coffee', labelHi: 'दूध, चाय या कॉफी पीने पर' },
    { id: 'any_food', labelEn: 'Eating or drinking anything', labelHi: 'कुछ भी खाने-पीने पर' },
    { id: 'stress_fasting', labelEn: 'Mental stress or prolonged fasting', labelHi: 'मानसिक तनाव या भूखे रहने पर' }
  ],
  relieving: [
    { id: 'passing_stool', labelEn: 'Relieved after passing stool / flatus', labelHi: 'शौच या गैस पास होने के बाद आराम' },
    { id: 'antacids_milk', labelEn: 'Antacid gel, cold milk or water', labelHi: 'ठंडा दूध, पानी या एंटासिड सिरप' },
    { id: 'ors_electrolytes', labelEn: 'ORS electrolyte solution & rest', labelHi: 'ओआरएस का घोल और आराम' },
    { id: 'warm_compress', labelEn: 'Warm compress on abdomen', labelHi: 'पेट पर गर्म सिंकाई करने से' }
  ],
  associated: [
    { id: 'blood_melena', labelEn: 'Blood in stool or black tarry stools', labelHi: 'मल में खून या काला रंग', isRedFlag: true },
    { id: 'recurrent_vomiting', labelEn: 'Unable to keep fluids down / recurrent vomiting', labelHi: 'बार-बार उल्टी, पानी न पचना', isRedFlag: true },
    { id: 'dehydration_thirst', labelEn: 'Sunken eyes, extreme thirst, dry tongue', labelHi: 'आंखें धंसना, अत्यधिक प्यास, सूखा मुंह', isRedFlag: true },
    { id: 'sour_burps', labelEn: 'Sour acidic belching & water brash', labelHi: 'खट्टी डकारें और मुंह में खट्टा पानी आना' },
    { id: 'low_fever', labelEn: 'Low-grade fever and fatigue', labelHi: 'हल्का बुखार और कमजोरी' }
  ]
};

export interface DashavidhaData {
  prakriti: string;
  vikriti: string;
  sara: string;
  samhanana: string;
  pramana: string;
  satmya: string;
  sattva: string;
  aharaShakti: string;
  vyayamaShakti: string;
  vaya: string;
}

export interface AshtaSthanaData {
  nadi: string;
  mutra: string;
  mala: string;
  jihwa: string;
  shabda: string;
  sparsha: string;
  druk: string;
  akruti: string;
}

export const DASHAVIDHA_PARIKSHA_DATA = {
  // 1. Prakriti - Baseline Constitution / Phenotype
  prakriti: {
    nameEn: 'Baseline Constitution (Prakriti)',
    nameHi: 'मूल शारीरिक प्रकृति',
    options: [
      { id: 'vata', labelEn: 'Vata Dominant (Lean frame, active, light sleep, variable appetite)', labelHi: 'वात प्रधान (पतला शरीर, चंचल, हल्की नींद, अनियमित भूख)' },
      { id: 'pitta', labelEn: 'Pitta Dominant (Medium build, warm skin, sharp appetite, heat intolerance)', labelHi: 'पित्त प्रधान (मध्यम कद, शरीर में गर्मी, तेज भूख, गर्मी असहनीय)' },
      { id: 'kapha', labelEn: 'Kapha Dominant (Sturdy broad build, calm, deep sleep, slow digestion)', labelHi: 'कफ प्रधान (मजबूत शरीर, शांत स्वभाव, गहरी नींद, धीमा पाचन)' },
      { id: 'vata_pitta', labelEn: 'Vata-Pitta Combination (Lean to medium, quick, sensitive to heat/cold)', labelHi: 'वात-पित्त मिश्रित (फुर्तीला, सर्दी-गर्मी के प्रति संवेदनशील)' },
      { id: 'pitta_kapha', labelEn: 'Pitta-Kapha Combination (Athletic build, good stamina, moderate hunger)', labelHi: 'पित्त-कफ मिश्रित (मजबूत सहनशक्ति, संतुलित स्वास्थ्य)' },
      { id: 'sama', labelEn: 'Tridoshaja / Balanced (Equally balanced doshas)', labelHi: 'समदोष / त्रिदोषज (संतुलित प्रकृति)' }
    ]
  },
  // 2. Vikriti - Current Morbidity / Imbalance State
  vikriti: {
    nameEn: 'Current Pathological Imbalance (Vikriti)',
    nameHi: 'वर्तमान दोष विकृति / रोग स्थिति',
    options: [
      { id: 'vata_vriddhi', labelEn: 'Vata Imbalance (Neuralgia, body aches, dryness, flatulence, insomnia)', labelHi: 'वात वृद्धि (शरीर दर्द, नसों में खिंचाव, रूखापन, अनिद्रा, गैस)' },
      { id: 'pitta_vriddhi', labelEn: 'Pitta Imbalance (Hyperacidity, burning sensation, fever, inflammation, rash)', labelHi: 'पित्त वृद्धि (खट्टी डकारें, जलन, बुखार, सूजन, लाल चकत्ते)' },
      { id: 'kapha_vriddhi', labelEn: 'Kapha Imbalance (Productive cough, chest heaviness, water retention, lethargy)', labelHi: 'कफ वृद्धि (बलगम, छाती में भारीपन, सुस्ती, सूजन, भारी सिर)' },
      { id: 'sannipata', labelEn: 'Tridoshic / Mixed Imbalance (Complex multi-system chronic involvement)', labelHi: 'सन्निपात / मिश्रित दोष (जटिल बहु-प्रणालीय असंतुलन)' },
      { id: 'prakritistha', labelEn: 'Near Baseline / Mild Transient Disturbance', labelHi: 'प्रकृतिस्थ / सामान्य अल्पकालिक लक्षण' }
    ]
  },
  // 3. Sara - Tissue Vitality & Tone
  sara: {
    nameEn: 'Tissue Vitality & Structural Reserve (Sara)',
    nameHi: 'धातु सारता (शारीरिक बल व ऊर्जा भंडार)',
    options: [
      { id: 'pravara', labelEn: 'High Reserve (Pravara Sara - robust immunity, glowing skin, firm musculature)', labelHi: 'प्रवर सार (उत्तम रोग प्रतिरोधक क्षमता, सुदृढ़ मांसपेशियां, तेज)' },
      { id: 'madhyama', labelEn: 'Moderate Reserve (Madhyama Sara - average stamina and tissue recovery)', labelHi: 'मध्यम सार (सामान्य सहनशक्ति और औसत स्वास्थ्य)' },
      { id: 'avara', labelEn: 'Low Reserve (Avara Sara - easily exhausted, fragile tissue tone, slow healing)', labelHi: 'अवर सार (जल्दी थकान, कमजोर मांसपेशियां, धीमी रिकवरी)' }
    ]
  },
  // 4. Samhanana - Musculoskeletal Build & Compactness
  samhanana: {
    nameEn: 'Musculoskeletal Build & Compactness (Samhanana)',
    nameHi: 'शारीरिक संहनन (शरीर का गठन व सुदृढ़ता)',
    options: [
      { id: 'susamhanita', labelEn: 'Compact & Well-Knit (Susamhanita - symmetrical, well-developed joints/muscles)', labelHi: 'सुसंहनित (मजबूत जोड़ व सुगठित मांसपेशियां)' },
      { id: 'madhyama', labelEn: 'Average Build (Madhyama - balanced, normal tone)', labelHi: 'मध्यम संहनन (सामान्य शारीरिक गठन)' },
      { id: 'heena', labelEn: 'Frail / Loose Jointed (Heena - prominent veins, loose joints, underweight/overweight)', labelHi: 'हीन संहनन (ढीले जोड़, कमजोर शारीरिक ढांचा)' }
    ]
  },
  // 5. Pramana - Anthropometric Proportions
  pramana: {
    nameEn: 'Anthropometric Proportions & Symmetry (Pramana)',
    nameHi: 'शारीरिक प्रमाण (शरीर का अनुपात व सममितता)',
    options: [
      { id: 'sama', labelEn: 'Proportionate & Symmetrical (Anatomically balanced BMI and limb span)', labelHi: 'सम प्रमाण (कद, वजन और अंगों का संतुलित अनुपात)' },
      { id: 'vishama_heena', labelEn: 'Ectomorphic / Disproportionate Lean (Underweight, elongated limbs)', labelHi: 'विषम-हीन प्रमाण (पतलापन, कम वजन, लंबा ढांचा)' },
      { id: 'vishama_adhika', labelEn: 'Endomorphic / Truncal Adiposity (Central obesity, high BMI)', labelHi: 'विषम-अधिक प्रमाण (मोटापा, अत्यधिक वजन, असंतुलित वसा)' }
    ]
  },
  // 6. Satmya - Environmental & Dietary Adaptability
  satmya: {
    nameEn: 'Environmental & Dietary Adaptability (Satmya)',
    nameHi: 'सात्म्य (खान-पान और मौसम की अनुकूलता)',
    options: [
      { id: 'sarva_rasa', labelEn: 'High Adaptability (Sarva-rasa Satmya - tolerates diverse foods, climates & seasonal shifts)', labelHi: 'सर्व-रस सात्म्य (हर प्रकार का भोजन व मौसम आसानी से सहना)' },
      { id: 'madhyama', labelEn: 'Moderate Adaptability (Sensitive to sudden cold/heat, tolerates common diets)', labelHi: 'मध्यम सात्म्य (सामान्य अनुकूलता, मौसम बदलने पर हल्का प्रभाव)' },
      { id: 'alpa_satmya', labelEn: 'Hypersensitive (Alpa Satmya - prone to allergies, food intolerances, sensitive gut)', labelHi: 'अल्प सात्म्य (एलर्जी प्रवण, पेट संवेदनशील, खान-पान में असहनशीलता)' }
    ]
  },
  // 7. Sattva - Mental Resilience & Stress Tolerance
  sattva: {
    nameEn: 'Mental Resilience & Stress Tolerance (Sattva)',
    nameHi: 'सत्त्व बल (मानसिक दृढ़ता व तनाव सहनशक्ति)',
    options: [
      { id: 'pravara', labelEn: 'High Resilience (Pravara Sattva - calm under stress, high pain threshold, positive coping)', labelHi: 'प्रवर सत्त्व (तनाव में शांत, दर्द सहने की उच्च क्षमता, सकारात्मक)' },
      { id: 'madhyama', labelEn: 'Moderate Resilience (Madhyama Sattva - copes with encouragement and reassurance)', labelHi: 'मध्यम सत्त्व (सामान्य मानसिक बल, समझाने पर संभलना)' },
      { id: 'avara', labelEn: 'Low Resilience (Avara Sattva - highly anxious, low pain tolerance, easily overwhelmed)', labelHi: 'अवर सत्त्व (घबराहट, अत्यधिक चिंता, दर्द सहने में कठिनाई)' }
    ]
  },
  // 8. Ahara-shakti - Metabolic & Digestive Capacity
  aharaShakti: {
    nameEn: 'Metabolic & Digestive Capacity (Ahara-shakti / Agni)',
    nameHi: 'आहार-शक्ति व जठराग्नि (पाचन बल व भूख)',
    options: [
      { id: 'samagni', labelEn: 'Samagni (Optimal balanced digestion, timely hunger, comfortable post-meal assimilation)', labelHi: 'समाग्नि (संतुलित पाचन, समय पर भूख, भोजन आसानी से पचना)' },
      { id: 'tikshnagni', labelEn: 'Tikshnagni (Hypermetabolic, frequent intense hunger, acidity, heat feeling)', labelHi: 'तीक्ष्णाग्नि (अत्यधिक तेज भूख, खट्टी डकारें, जलन की प्रवृत्ति)' },
      { id: 'mandagni', labelEn: 'Mandagni (Sluggish digestion, heaviness for hours after meals, poor appetite)', labelHi: 'मंदाग्नि (धीमा पाचन, भूख की कमी, खाने के बाद लंबे समय तक भारीपन)' },
      { id: 'vishamagni', labelEn: 'Vishamagni (Erratic/unpredictable appetite, occasional bloating and gas)', labelHi: 'विषमाग्नि (अनियमित पाचन, कभी तेज भूख कभी बिल्कुल नहीं, गैस)' }
    ]
  },
  // 9. Vyayama-shakti - Physical Endurance
  vyayamaShakti: {
    nameEn: 'Physical Endurance & Work Capacity (Vyayama-shakti)',
    nameHi: 'व्यायाम-शक्ति (शारीरिक सहनशक्ति व कार्यक्षमता)',
    options: [
      { id: 'pravara', labelEn: 'High Endurance (Easily performs heavy physical labor/exercise without fatigue)', labelHi: 'प्रवर शक्ति (भारी कार्य व व्यायाम आसानी से करने में सक्षम)' },
      { id: 'madhyama', labelEn: 'Moderate Endurance (Handles routine daily work, tires with strenuous exertion)', labelHi: 'मध्यम शक्ति (दैनिक कार्य सामान्य रूप से, अधिक परिश्रम पर थकान)' },
      { id: 'avara', labelEn: 'Low Endurance (Dyspneic/exhausted on climbing stairs or mild walking)', labelHi: 'अवर शक्ति (हल्के चलने या सीढ़ी चढ़ने पर ही सांस फूलना/थकान)' }
    ]
  },
  // 10. Vaya - Biological Age Stage
  vaya: {
    nameEn: 'Biological Age Stage & Metabolic Phase (Vaya)',
    nameHi: 'वय (आयु अवस्था व शारीरिक अवस्था)',
    options: [
      { id: 'bala', labelEn: 'Balya / Growth Phase (< 16 years, Kapha dominant tissue synthesis)', labelHi: 'बाल्यावस्था (< 16 वर्ष, शारीरिक विकास अवस्था)' },
      { id: 'madhyama', labelEn: 'Madhyama / Productive Phase (16–60 years, Pitta dominant metabolic vigor)', labelHi: 'मध्यमावस्था (16–60 वर्ष, सक्रिय उत्पादक अवस्था)' },
      { id: 'vriddha', labelEn: 'Vriddha / Degenerative Phase (> 60 years, Vata dominant catabolic wear)', labelHi: 'वृद्धावस्था (> 60 वर्ष, जोड़ों में घिसाव, प्राकृतिक क्षय)' }
    ]
  }
};

export const ASHTA_STHANA_PARIKSHA_DATA = {
  // 1. Nadi - Pulse & Arterial Character
  nadi: {
    nameEn: 'Pulse Rate & Arterial Character (Nadi)',
    nameHi: 'नाड़ी परीक्षा (हृदय गति व लय)',
    options: [
      { id: 'normal', labelEn: 'Normal Regular (70-80 bpm, steady rhythmic pulse)', labelHi: 'सामान्य नियमित (70-80 प्रति मिनट, लयबद्ध)' },
      { id: 'rapid_bounding', labelEn: 'Rapid & Bounding (Manduka/Pitta gati - tachycardic, warm, forceful)', labelHi: 'द्रुत व तीव्र नाड़ी (पित्त प्रधान - तेज गति, गर्म अनुभव)' },
      { id: 'slow_full', labelEn: 'Slow & Soft (Hamsa/Kapha gati - bradycardic, heavy regular pulse)', labelHi: 'मन्द व गंभीर नाड़ी (कफ प्रधान - धीमी, गहरी गति)' },
      { id: 'thread_irregular', labelEn: 'Feeble & Irregular (Sarpa/Vata gati - weak, thread-like, rapid fluctuation)', labelHi: 'अस्थिर व सूक्ष्म नाड़ी (वात प्रधान - कमजोर, लहरदार गति)' }
    ]
  },
  // 2. Mutra - Urinary Output & Examination
  mutra: {
    nameEn: 'Urinary Output & Characteristics (Mutra)',
    nameHi: 'मूत्र परीक्षा (मूत्र की रंगत व मात्रा)',
    options: [
      { id: 'normal_clear', labelEn: 'Clear Pale Yellow (Normal specific gravity, non-burning, 4-6 times/day)', labelHi: 'सामान्य पारदर्शी हल्का पीला (बिना जलन, सामान्य आवृत्ति)' },
      { id: 'high_colored_burning', labelEn: 'Dark Yellow / Burning (Pitta - concentrated, dysuria, mild dehydration)', labelHi: 'गहरा पीला व जलनयुक्त (पित्त लक्षण, अल्पमूत्रता)' },
      { id: 'turbid_cloudy', labelEn: 'Turbid / Cloudy (Kapha / Avila - sediment, possible UTI/glycosuria)', labelHi: 'मटमैला व भारी (कफ लक्षण, संक्रमण या गाढ़ापन)' },
      { id: 'frothy_pale', labelEn: 'Frothy / Frequent Clear (Vata / Phenila - polyuria, frothy urine)', labelHi: 'झागदार व बार-बार (वात लक्षण, झाग आना)' }
    ]
  },
  // 3. Mala - Bowel Habits & Stool Character
  mala: {
    nameEn: 'Bowel Regularity & Stool Consistency (Mala)',
    nameHi: 'मल परीक्षा (पेट साफ होना व मल की प्रकृति)',
    options: [
      { id: 'normal_formed', labelEn: 'Normal Formed (Samamala - once daily, non-sticky, easily evacuated)', labelHi: 'सामान्य बंधा हुआ (दिन में एक बार, आसानी से पेट साफ)' },
      { id: 'constipated_hard', labelEn: 'Constipated & Hard (Krura - scybalous, dry, straining required)', labelHi: 'कड़ा व सूखा मल (कब्ज, जोर लगाना, सूखापन)' },
      { id: 'loose_frequent', labelEn: 'Loose / Watery (Mridu - semi-solid, 2-4 times, urgency)', labelHi: 'ढीला व बार-बार (अतिसार की प्रवृत्ति, पतला मल)' },
      { id: 'sticky_mucus', labelEn: 'Sticky with Mucus (Sama / Sluggish - incomplete evacuation feeling)', labelHi: 'चिपचिपा व आंवयुक्त (पेट पूरी तरह साफ न होने का आभास)' }
    ]
  },
  // 4. Jihwa - Tongue Appearance & Oral Coating
  jihwa: {
    nameEn: 'Tongue Appearance & Oral Coating (Jihwa)',
    nameHi: 'जिह्वा परीक्षा (जीभ की रंगत व मैल/परत)',
    options: [
      { id: 'clean_pink', labelEn: 'Clean & Pink (Nirama - moist, papillae normal, no Saburral coating)', labelHi: 'स्वच्छ व गुलाबी (निराम - कोई सफेद परत नहीं, स्वस्थ)' },
      { id: 'white_coated', labelEn: 'Thick White Coated (Sama - heavy Saburral furring, oral halitosis, indigestion)', labelHi: 'सफेद मोटी परतयुक्त (साम - मंदाग्नि, मुंह में बेस्वादी, भारी मैल)' },
      { id: 'red_raw', labelEn: 'Red / Erythematous (Pitta - hyperemic, red margins, aphthae prone)', labelHi: 'लाल व चमकदार (पित्त - जीभ लाल, छालों की प्रवृत्ति)' },
      { id: 'fissured_dry', labelEn: 'Fissured & Dry (Vata - dry, mapped fissures, papillae atrophy)', labelHi: 'सूखी व कटी-फटी (वात - दरारें, सूखापन, रूखापन)' }
    ]
  },
  // 5. Shabda - Voice Quality & Breath Sounds
  shabda: {
    nameEn: 'Voice Quality & Breath Sounds (Shabda)',
    nameHi: 'शब्द परीक्षा (आवाज व श्वास की ध्वनि)',
    options: [
      { id: 'clear_resonant', labelEn: 'Clear & Resonant (Spashta - normal phonation and vesicular breathing)', labelHi: 'स्पष्ट व मधुर (सामान्य स्पष्ट आवाज, फेफड़ों की साफ ध्वनि)' },
      { id: 'hoarse_husky', labelEn: 'Hoarse / Dysphonic (Mandasvara - laryngitic, cracked, throat dryness)', labelHi: 'भारी व बैठी हुई आवाज (गले में खराश, सूखापन)' },
      { id: 'feeble_weak', labelEn: 'Feeble & Exhausted (Ksheenasvara - shallow breathing, speaks with effort)', labelHi: 'धीमी व कमजोर आवाज (सांस में कमजोरी, बोलने में थकान)' },
      { id: 'wheeze_stridor', labelEn: 'Wheezing / Audible Rattling (Ghurghura - broncho-spasm, rhonchi)', labelHi: 'घड़घड़ाहट व सीटी जैसी आवाज (कफ जमाव, सांस फूलना)' }
    ]
  },
  // 6. Sparsha - Skin Texture & Temperature
  sparsha: {
    nameEn: 'Skin Temperature & Palpatory Texture (Sparsha)',
    nameHi: 'स्पर्श परीक्षा (त्वचा का तापमान व बनावट)',
    options: [
      { id: 'smooth_normal', labelEn: 'Smooth & Euthermic (Snigdha - normal turgor, supple, pleasant warm)', labelHi: 'कोमल व सामान्य तापमान (स्निग्ध - स्वस्थ त्वचा, लचीलापन)' },
      { id: 'warm_febrile', labelEn: 'Warm / Febrile (Ushna - hot, flushed, diaphoretic)', labelHi: 'गर्म व बुखारयुक्त (उष्ण - शरीर तपना, पसीना)' },
      { id: 'cold_clammy', labelEn: 'Cold & Clammy (Sheeta - vasoconstricted, peripheral chilliness)', labelHi: 'शीत व चिपचिपा (हाथ-पैर ठंडे, कमजोरी)' },
      { id: 'dry_rough', labelEn: 'Dry & Rough (Ruksha - scaly, reduced turgor, cracked heels)', labelHi: 'सूखी व रूखी (त्वचा में खिंचाव, पपड़ीदार)' }
    ]
  },
  // 7. Druk - Ocular & Scleral Inspection
  druk: {
    nameEn: 'Ocular & Scleral Inspection (Druk)',
    nameHi: 'दृग् परीक्षा (आंखों व कंजेक्टिवा की स्थिति)',
    options: [
      { id: 'clear_normal', labelEn: 'Clear & Lustrous (Prakrita - clear sclera, pink palpebral conjunctiva)', labelHi: 'सामान्य व चमकदार (साफ आंखें, स्वस्थ गुलाबी रंगत)' },
      { id: 'pale_conjunctiva', labelEn: 'Pale Palpebral Conjunctiva (Pandu - clinical anemia, lack of luster)', labelHi: 'पीली/सफेद कंजेक्टिवा (पाण्डु - हीमोग्लोबिन की कमी, खून की कमी)' },
      { id: 'icteric_yellow', labelEn: 'Icteric / Yellowish Sclera (Haridra - hyperbilirubinemia, jaundice)', labelHi: 'पीली आंखें (हरिद्रा - पीलिया, यकृत पित्त प्रकोप)' },
      { id: 'injected_red', labelEn: 'Congested / Injected Sclera (Rakta - conjunctival injection, burning, gritty)', labelHi: 'लाल आंखें (रक्तज - आंखें लाल होना, जलन, चुभन)' }
    ]
  },
  // 8. Akruti - General Posture & Facies
  akruti: {
    nameEn: 'General Posture, Body Habitus & Facies (Akruti)',
    nameHi: 'आकृति परीक्षा (शारीरिक हाव-भाव व चेहरे की मुद्रा)',
    options: [
      { id: 'comfortable_normal', labelEn: 'Comfortable & Normal Facies (Prasanna Vadana - relaxed posture, no distress)', labelHi: 'प्रसन्न व सामान्य मुद्रा (चेहरे पर शांति, कोई कष्ट नहीं)' },
      { id: 'pain_distress', labelEn: 'Pain Facies / Protective Guarding (Kastam - furrowed brow, grimacing, splinting)', labelHi: 'दर्द व कष्ट का चेहरा (माथे पर सिलवटें, दर्द से सिकुड़ना)' },
      { id: 'fatigued_exhausted', labelEn: 'Fatigued & Listless (Glani - sunken eyes, drooped shoulders, sluggish response)', labelHi: 'थका हुआ व सुस्त (आंखें धंसी, चेहरे पर कमजोरी)' },
      { id: 'emaciated_frail', labelEn: 'Cachectic / Frail (Krisha - muscle wasting, temporal hollowing, hunched)', labelHi: 'अत्यधिक दुर्बल (मांसपेशियों का क्षय, कमजोरी)' }
    ]
  }
};

export const AYUSH_PARIKSHA_DATA = {
  prakritiOptions: DASHAVIDHA_PARIKSHA_DATA.prakriti.options,
  agniOptions: DASHAVIDHA_PARIKSHA_DATA.aharaShakti.options,
  koshthaOptions: ASHTA_STHANA_PARIKSHA_DATA.mala.options
};

export const COMMON_CHRONIC_PRESETS = [
  { condition: 'Type 2 Diabetes Mellitus', commonMeds: 'Metformin 500mg, Glimepiride' },
  { condition: 'Essential Hypertension (High BP)', commonMeds: 'Amlodipine 5mg, Telmisartan 40mg' },
  { condition: 'Bronchial Asthma / COPD', commonMeds: 'Budecort Inhaler, Levolin' },
  { condition: 'Hypothyroidism', commonMeds: 'Thyronorm / Eltroxin 50mcg' },
  { condition: 'Coronary Artery Disease (CAD/Stent)', commonMeds: 'Ecosprin 75mg, Atorvastatin 20mg' },
  { condition: 'Chronic Kidney Disease (CKD)', commonMeds: 'Sodium Bicarbonate, Torsemide' },
  { condition: 'Osteoarthritis (Sandhivata)', commonMeds: 'Calcium, Vitamin D3' }
];

export const COMMON_ALLERGIES_PRESETS = [
  { allergen: 'Penicillin / Amoxicillin', reaction: 'Skin hives, swelling, breathing difficulty', severity: 'severe' as const },
  { allergen: 'Sulfa Drugs (Bactrim/Septran)', reaction: 'Erythematous rash, itching', severity: 'moderate' as const },
  { allergen: 'NSAIDs (Brufen/Combiflam/Diclofenac)', reaction: 'Stomach irritation, facial swelling', severity: 'moderate' as const },
  { allergen: 'Paracetamol', reaction: 'Urticaria / rash', severity: 'mild' as const },
  { allergen: 'Dust Mites & Pollen', reaction: 'Allergic rhinitis, sneezing, wheeze', severity: 'mild' as const }
];
