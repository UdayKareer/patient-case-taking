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

export const AYUSH_PARIKSHA_DATA = {
  prakritiOptions: [
    { id: 'vata', labelEn: 'Vata Dominant (Lean frame, dry skin, quick energetic movements, anxiety prone)', labelHi: 'वात प्रधान (पतला शरीर, रूखी त्वचा, चंचलता, चिंता की प्रवृत्ति)' },
    { id: 'pitta', labelEn: 'Pitta Dominant (Medium build, warm body, sharp intellect, heat intolerant, irritable)', labelHi: 'पित्त प्रधान (मध्यम कद-काठी, शरीर में गर्मी, तेज भूख, गुस्सा जल्दी आना)' },
    { id: 'kapha', labelEn: 'Kapha Dominant (Broad sturdy build, oily smooth skin, calm demeanor, slow digestion)', labelHi: 'कफ प्रधान (मजबूत भारी शरीर, शांत स्वभाव, गहरी नींद, धीमा पाचन)' },
    { id: 'dvandvaja', labelEn: 'Dvandvaja (Vata-Pitta or Pitta-Kapha dual combination)', labelHi: 'द्वंद्वज (वात-पित्त या पित्त-कफ मिश्रित प्रकृति)' }
  ],
  agniOptions: [
    { id: 'sama', labelEn: 'Samagni (Healthy balanced digestion, punctual hunger without discomfort)', labelHi: 'समाग्नि (संतुलित पाचन, समय पर सामान्य भूख)' },
    { id: 'tikshna', labelEn: 'Tikshnagni (Excessively sharp/burning digestion, acidity, frequent hunger)', labelHi: 'तीक्ष्णाग्नि (तेज जलन वाली भूख, अम्लपित्त, भोजन न मिलने पर बेचैनी)' },
    { id: 'manda', labelEn: 'Mandagni (Weak sluggish digestion, heaviness, no appetite for hours)', labelHi: 'मंदाग्नि (धीमा पाचन, भूख न लगना, खाने के बाद भारीपन)' },
    { id: 'vishama', labelEn: 'Vishamagni (Erratic/unpredictable appetite, sometimes voracious, sometimes none)', labelHi: 'विषमाग्नि (अनियमित पाचन, कभी तेज भूख कभी बिल्कुल नहीं)' }
  ],
  koshthaOptions: [
    { id: 'mridu', labelEn: 'Mridu Koshtha (Soft laxative bowel, easily irritated by milk/fruits)', labelHi: 'मृदु कोष्ठ (आसानी से पेट साफ होना, दूध या फलों से दस्त की प्रवृत्ति)' },
    { id: 'madhyama', labelEn: 'Madhyama Koshtha (Normal regular single bowel movement daily)', labelHi: 'मध्यम कोष्ठ (दिन में एक बार सामान्य रूप से शौच होना)' },
    { id: 'krura', labelEn: 'Krura Koshtha (Hard dry constipation, requires strong stimulants/laxatives)', labelHi: 'क्रूर कोष्ठ (कड़ा मल, कब्ज, शौच में कठिनाई)' }
  ]
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
