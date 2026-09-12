import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Leaf,
  Sparkles,
  Stethoscope,
  Camera,
  Paperclip,
  Building2
} from 'lucide-react';
import { usePatientStore, type UploadedDocument } from '../store/usePatientStore';
import {
  CHIEF_COMPLAINT_PRESETS,
  SOCRATES_OPTIONS,
  FEVER_OPTIONS,
  RESPIRATORY_OPTIONS,
  GI_OPTIONS,
  type DashavidhaData,
  type AshtaSthanaData
} from '../data/clinicalProtocols';
import { AYURVEDA_QUESTION_TREE, getStartingQuestionId } from '../data/ayurvedicProtocols';
import { speakPrompt } from '../utils/speechVoice';
import { UnifiedVoiceSession, type VoiceState, isGroqWhisperAvailable } from '../services/whisperService';
import {
  detectClinicalDomain,
  calculateEsiTriage,
  generateAdaptiveQuestions,
  type DynamicQuestion,
  type DynamicQuestionOption
} from '../services/clinicalAiService';
import { aiRecognizeDepartment } from '../data/governmentHospitals';
import { getTranslations, getLanguageInfo } from '../data/regionalTranslations';

export default function Consultation() {
  const navigate = useNavigate();
  const { currentPatient, currentProfile, updatePatient, evaluateTriageAndSummary, saveToDatabase, soundEnabled, addDocument } =
    usePatientStore();

  if (!currentProfile) {
    return <Navigate to="/patient/login" replace />;
  }

  const t = getTranslations(currentPatient.language);
  const langInfo = getLanguageInfo(currentPatient.language);
  const isHindi = currentPatient.language === 'hi';
  const isAyush = currentPatient.mode === 'ayush';

  // Unified single-question Typeform step index
  const [currentStep, setCurrentStep] = useState(0);

  // Voice recording state powered by Groq Whisper with Web Speech fallback
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const isListening = voiceState === 'recording';
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);
  const voiceSessionRef = useRef<UnifiedVoiceSession | null>(null);

  // Form states
  const [chiefComplaintText, setChiefComplaintText] = useState(currentPatient.chiefComplaint || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [duration, setDuration] = useState(currentPatient.symptomDuration || '');
  const [site, setSite] = useState(currentPatient.symptomSite || '');
  const [character, setCharacter] = useState(currentPatient.symptomCharacter || '');
  const [radiation, setRadiation] = useState(currentPatient.symptomRadiation || '');
  const [severity, setSeverity] = useState(currentPatient.symptomSeverity || 6);
  const [associated, setAssociated] = useState<string[]>(currentPatient.associatedSymptoms || []);
  const [customAssociated, setCustomAssociated] = useState('');
  const [aggravating, setAggravating] = useState(currentPatient.aggravatingFactors || '');
  const [relieving, setRelieving] = useState(currentPatient.relievingFactors || '');

  // AYUSH & Integrative states (Dashavidha 10-Fold & Ashta Sthana 8-Point)
  const [prakriti, setPrakriti] = useState(currentPatient.prakriti || '');
  const [agni, setAgni] = useState(currentPatient.agni || '');
  const [koshtha, setKoshtha] = useState(currentPatient.koshtha || '');
  const [aharaVihara, setAharaVihara] = useState(currentPatient.aharaVihara || '');
  const [nidra, setNidra] = useState(currentPatient.nidra || '');
  const [dashavidha, setDashavidha] = useState<Partial<DashavidhaData>>(
    currentPatient.dashavidha || {}
  );
  const [ashtaSthana, setAshtaSthana] = useState<Partial<AshtaSthanaData>>(
    currentPatient.ashtaSthana || {}
  );
  const [activeAyushQuestionId, setActiveAyushQuestionId] = useState<string>('q_gastro_start');
  const [ayushResponses, setAyushResponses] = useState<{ qId: string; answer: string; dosha: string }[]>(
    currentPatient.ayushResponses || []
  );
  const [ayushCompleted, setAyushCompleted] = useState(false);

  // Feature 4A: Dynamically detect clinical domain (Respiratory, GI, Fever, Pain, Metabolic, General)
  const clinicalDomain = detectClinicalDomain(chiefComplaintText);

  // Select domain-specific options without forcing inappropriate pain questions
  const currentOptions =
    clinicalDomain === 'respiratory'
      ? RESPIRATORY_OPTIONS
      : clinicalDomain === 'gastrointestinal'
      ? GI_OPTIONS
      : clinicalDomain === 'fever'
      ? FEVER_OPTIONS
      : SOCRATES_OPTIONS;

  // Feature 4A & 4D: Gemini adaptive follow-ups & ESI triage state
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<DynamicQuestion[]>([]);
  const [adaptiveAnswers, setAdaptiveAnswers] = useState<Record<string, string>>({});
  const [loadingAdaptive, setLoadingAdaptive] = useState(false);
  const [detectedRedFlags, setDetectedRedFlags] = useState<string[]>(currentPatient.redFlags || []);
  const [isCalculatingEsi, setIsCalculatingEsi] = useState(false);

  // Steps: 9 for Modern Medicine (Step 0 to 8 including Gemini Adaptive Questioning), 5 for AYUSH
  const totalSteps = isAyush ? 5 : 9;

  // Determine Ayush Start node based on complaint
  useEffect(() => {
    if (isAyush && currentStep === 1 && !ayushCompleted) {
      let catId = 'gastro_ayush';
      for (const cat of CHIEF_COMPLAINT_PRESETS) {
        if (cat.commonComplaints.some(c => c.textEn === chiefComplaintText || c.textHi === chiefComplaintText)) {
          catId = cat.id;
          break;
        }
      }
      setActiveAyushQuestionId(getStartingQuestionId(catId));
    }
  }, [currentStep, isAyush, chiefComplaintText, ayushCompleted]);

  // Background Pre-fetching for Step 8 follow-up questions to eliminate loading lag
  useEffect(() => {
    if (!isAyush && chiefComplaintText && chiefComplaintText.trim().length > 2 && adaptiveQuestions.length === 0) {
      setLoadingAdaptive(true);
      generateAdaptiveQuestions({
        chiefComplaint: chiefComplaintText,
        age: currentPatient.age || 'Adult',
        gender: currentPatient.gender || 'Unknown',
        duration,
        site,
        character,
        radiation,
        severity,
        aggravating,
        relieving,
        associated,
        chronicConditions: currentPatient.chronicConditions
      })
        .then((questions) => {
          if (questions && questions.length > 0) {
            setAdaptiveQuestions(questions);
          }
        })
        .catch((err) => {
          console.warn('Silent fallback for adaptive questions:', err);
        })
        .finally(() => {
          setLoadingAdaptive(false);
        });
    }
  }, [
    isAyush,
    chiefComplaintText,
    adaptiveQuestions.length,
    currentPatient.age,
    currentPatient.gender,
    duration,
    site,
    character,
    radiation,
    severity,
    aggravating,
    relieving,
    associated,
    currentPatient.chronicConditions
  ]);

  // Read aloud prompt when step changes in chosen regional language
  useEffect(() => {
    if (!soundEnabled) return;

    let textToSpeak = '';
    if (currentStep === 0) {
      textToSpeak = t.chiefComplaint.tts;
    } else if (!isAyush) {
      const domainKey =
        clinicalDomain === 'fever' || clinicalDomain === 'respiratory' || clinicalDomain === 'gastrointestinal'
          ? clinicalDomain
          : 'general';

      if (currentStep === 1) {
        textToSpeak = t.stepDuration[domainKey].tts;
      } else if (currentStep === 2) {
        textToSpeak = t.stepCharacter[domainKey].tts;
      } else if (currentStep === 3) {
        textToSpeak = t.stepSiteRadiation[domainKey].tts;
      } else if (currentStep === 4) {
        textToSpeak = t.stepSeverity.tts;
      } else if (currentStep === 5) {
        textToSpeak = t.stepAssociated.tts;
      } else if (currentStep === 6) {
        textToSpeak = t.stepAggravating.tts;
      } else if (currentStep === 7) {
        textToSpeak = t.stepRelieving.tts;
      } else if (currentStep === 8) {
        textToSpeak = t.stepFollowUp.tts;
      }
    } else if (isAyush) {
      if (currentStep === 1 && !ayushCompleted) {
        const q = AYURVEDA_QUESTION_TREE[activeAyushQuestionId];
        textToSpeak = q ? (isHindi ? q.questionHi : q.questionEn) : '';
      } else if (currentStep === 2) {
        textToSpeak = isHindi ? 'अपने आहार और दिनचर्या के बारे में बताएं।' : 'Please describe your diet and daily lifestyle habits.';
      } else if (currentStep === 3) {
        textToSpeak = isHindi ? 'आपकी नींद की गुणवत्ता कैसी है?' : 'How is your sleep quality?';
      }
    }

    if (textToSpeak) {
      speakPrompt(textToSpeak, currentPatient.language);
    }
  }, [currentStep, soundEnabled, isHindi, isAyush, clinicalDomain, currentPatient.language, activeAyushQuestionId, ayushCompleted, t]);

  // Cleanup active voice recording on component unmount
  useEffect(() => {
    return () => {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.cancel();
      }
    };
  }, []);

  // Voice recording toggle using Unified Voice Session (Groq Whisper v3 + Web Speech fallback)
  const toggleVoice = (fieldName: string, setter: (val: string) => void) => {
    if (voiceState !== 'idle' && activeVoiceField === fieldName) {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.stop();
      }
      return;
    }

    if (voiceSessionRef.current) {
      voiceSessionRef.current.cancel();
      voiceSessionRef.current = null;
    }

    setActiveVoiceField(fieldName);

    const session = new UnifiedVoiceSession(
      {
        onStateChange: (newState) => {
          setVoiceState(newState);
          if (newState === 'idle') {
            setActiveVoiceField(null);
          }
        },
        onResult: (transcript) => {
          if (transcript && transcript.trim()) {
            setter(transcript.trim());
          }
          setVoiceState('idle');
          setActiveVoiceField(null);
        },
        onError: (err) => {
          console.warn('Voice intake error:', err);
          setVoiceState('idle');
          setActiveVoiceField(null);
        }
      },
      {
        language: currentPatient.language,
        prompt: `Patient describing medical symptoms in ${langInfo.name} (${langInfo.nativeName}): chest pain, fever, chills, cough, breathlessness, abdominal distress, weakness, headache, vomiting, body pain, dizziness.`
      }
    );

    voiceSessionRef.current = session;
    session.start();
  };

  // Handle adaptive option selection with red flag tracking
  const handleSelectAdaptiveOption = (questionId: string, option: DynamicQuestionOption) => {
    setAdaptiveAnswers((prev) => ({
      ...prev,
      [questionId]: isHindi ? option.labelHi : option.labelEn
    }));

    if (option.isRedFlag) {
      const flagText = `[Priority Marker]: ${option.labelEn}`;
      if (!detectedRedFlags.includes(flagText)) {
        setDetectedRedFlags((prev) => [...prev, flagText]);
      }
    }
  };

  // Sync to store & advance with automated ESI triage (Feature 4D)
  const advance = async (nextStepIndex?: number) => {
    const nextIdx = nextStepIndex !== undefined ? nextStepIndex : currentStep + 1;

    const finalAssociated = [...associated];
    if (customAssociated.trim() && !finalAssociated.includes(customAssociated.trim())) {
      finalAssociated.push(customAssociated.trim());
    }

    updatePatient({
      chiefComplaint: chiefComplaintText,
      symptomDuration: duration,
      symptomSite: site,
      symptomCharacter: character,
      symptomRadiation: radiation,
      symptomSeverity: severity,
      aggravatingFactors: aggravating,
      relievingFactors: relieving,
      associatedSymptoms: finalAssociated,
      redFlags: detectedRedFlags,
      adaptiveAnswers,
      prakriti,
      agni,
      koshtha,
      aharaVihara,
      nidra,
      ayushResponses,
      dashavidha,
      ashtaSthana,
      status: 'waiting'
    });

    if (nextIdx < totalSteps) {
      setCurrentStep(nextIdx);
    } else {
      // Feature 4D: Compute Automated Emergency Severity Index (ESI) Triage via Gemini 3.5 & Rule Engine
      setIsCalculatingEsi(true);
      try {
        const esiResult = await calculateEsiTriage({
          name: currentPatient.name,
          age: currentPatient.age,
          gender: currentPatient.gender,
          chiefComplaint: chiefComplaintText,
          symptomDuration: duration,
          symptomSite: site,
          symptomCharacter: character,
          symptomRadiation: radiation,
          symptomSeverity: severity,
          aggravatingFactors: aggravating,
          relievingFactors: relieving,
          associatedSymptoms: finalAssociated,
          chronicConditions: currentPatient.chronicConditions,
          allergies: currentPatient.allergies,
          redFlags: detectedRedFlags,
          triageLevel: currentPatient.triageLevel
        });

        let computedTriage: 'emergency' | 'priority' | 'normal' =
          esiResult.level <= 2 ? 'emergency' : esiResult.level === 3 ? 'priority' : 'normal';

        // AI Clinical Department Recognition & Room Routing
        const fullSymptomsText = [
          chiefComplaintText,
          site,
          character,
          ...finalAssociated
        ].filter(Boolean).join(' ');

        const routed = aiRecognizeDepartment(
          fullSymptomsText,
          currentPatient.mode,
          computedTriage,
          currentPatient.hospitalCode || 'aiims-delhi',
          Number(currentPatient.age) || undefined
        );

        const shouldAutoRoute = !currentPatient.assignedDept || 
          currentPatient.assignedDept === 'AI Auto-Routing' || 
          currentPatient.assignedDept === 'Auto-Allocated' ||
          currentPatient.assignedDept === 'General Medicine OPD' ||
          currentPatient.assignedDept === 'Integrative AYUSH OPD' ||
          currentPatient.assignedDept === 'General Medicine' ||
          currentPatient.assignedRoom === 'AI Auto-Routing' ||
          currentPatient.assignedRoom === 'OPD Room Pending Triage' ||
          currentPatient.assignedRoom === 'OPD Desk' ||
          !currentPatient.assignedRoom;

        updatePatient({
          esiTriage: esiResult,
          triageLevel: computedTriage,
          redFlags: detectedRedFlags,
          ...(shouldAutoRoute && routed ? {
            assignedDept: routed.assignedDept,
            assignedRoom: routed.assignedRoom,
            doctorNumber: routed.doctorNumber
          } : {})
        });
      } catch (err) {
        console.warn('ESI calculation error:', err);
      } finally {
        setIsCalculatingEsi(false);
        evaluateTriageAndSummary();
        saveToDatabase();
        navigate('/summary');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate('/patient/dashboard');
    }
  };

  // Auto-advance helper on option tap
  const pickAndAdvance = (setter: (val: any) => void, value: any) => {
    setter(value);
    setTimeout(() => {
      advance();
    }, 280);
  };

  // Handle physical prescription slip / lab report photo upload at kiosk intake
  const handleKioskFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const isSlip =
        file.name.toLowerCase().includes('rx') ||
        file.name.toLowerCase().includes('presc') ||
        file.type.includes('image');
      const newDoc: UploadedDocument = {
        id: 'kiosk-doc-' + Date.now(),
        name: file.name,
        type: isSlip ? 'Prescription' : 'Lab Report',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        timestamp: Date.now(),
        uploadedBy: 'patient',
        fileUrl: reader.result as string,
        isHandwritten: isSlip,
        ocrStatus: isSlip ? 'bypassed_to_doctor' : 'complete',
        notes: isSlip
          ? 'Physical slip photographed at kiosk intake; bypassed directly for physician visual review.'
          : 'Attached at kiosk intake.',
        extractedDiagnoses: [],
        extractedMeds: [],
        extractedLabs: []
      };
      addDocument(newDoc);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-2xl mx-auto px-4 py-6">
      
      {/* 1. Top Header with Hospital Badge & Step Progress */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded-md border border-blue-200/70 font-semibold flex items-center gap-1">
              <Building2 size={11} />
              {currentPatient.hospitalName || currentPatient.hospitalCode || 'AIIMS New Delhi (Apex)'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">
              {isHindi ? 'प्रश्न' : 'Question'} {currentStep + 1} of {totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const domainKey =
                clinicalDomain === 'fever' || clinicalDomain === 'respiratory' || clinicalDomain === 'gastrointestinal'
                  ? clinicalDomain
                  : 'general';
              let textToRead = t.chiefComplaint.tts;
              if (currentStep === 1) textToRead = t.stepDuration[domainKey].tts;
              else if (currentStep === 2) textToRead = t.stepCharacter[domainKey].tts;
              else if (currentStep === 3) textToRead = t.stepSiteRadiation[domainKey].tts;
              else if (currentStep === 4) textToRead = t.stepSeverity.tts;
              else if (currentStep === 5) textToRead = t.stepAssociated.tts;
              else if (currentStep === 6) textToRead = t.stepAggravating.tts;
              else if (currentStep === 7) textToRead = t.stepRelieving.tts;
              else if (currentStep === 8) textToRead = t.stepFollowUp.tts;

              speakPrompt(textToRead, currentPatient.language);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer text-xs font-medium"
            title="Read Question Aloud in Your Language"
          >
            <Volume2 size={15} />
            <span className="text-[11px] font-semibold">{t.listen}</span>
          </button>
        </div>

        {/* Crisp Modern Linear Progress Bar */}
        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Main Single Question Stage */}
      <div className="flex-1 flex flex-col justify-center">

        {/* STEP 0: Chief Complaint */}
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                {isHindi ? 'चरण 1: मुख्य स्वास्थ्य समस्या' : 'Section 1: Chief Complaint'}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {t.chiefComplaint.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {t.chiefComplaint.sub}
              </p>
            </div>

            {/* Input with Voice Dictation */}
            <div className="relative">
              <textarea
                rows={3}
                value={chiefComplaintText}
                onChange={(e) => setChiefComplaintText(e.target.value)}
                placeholder={t.chiefComplaint.placeholder}
                className="w-full p-4 pr-14 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => toggleVoice('chiefComplaint', setChiefComplaintText)}
                className={`absolute right-3 bottom-3 p-2.5 rounded-lg transition-all ${
                  voiceState === 'recording' && activeVoiceField === 'chiefComplaint'
                    ? 'bg-red-600 text-white animate-pulse shadow-md'
                    : voiceState === 'transcribing' && activeVoiceField === 'chiefComplaint'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer'
                }`}
                title={
                  voiceState === 'recording'
                    ? 'Tap to Transcribe with Whisper'
                    : voiceState === 'transcribing'
                    ? 'Transcribing with Whisper...'
                    : 'Speak using Groq Whisper'
                }
              >
                {voiceState === 'recording' && activeVoiceField === 'chiefComplaint' ? (
                  <MicOff size={17} />
                ) : voiceState === 'transcribing' && activeVoiceField === 'chiefComplaint' ? (
                  <Sparkles size={17} className="animate-spin" />
                ) : (
                  <Mic size={17} />
                )}
              </button>
            </div>

            {/* Voice Status Indicator */}
            {activeVoiceField === 'chiefComplaint' && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1">
                {voiceState === 'recording' && (
                  <div className="text-xs font-semibold text-red-600 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    <span>
                      {t.speak} ({langInfo.nativeName})... {isHindi ? 'बोलना खत्म होने पर दोबारा दबाएं' : 'tap mic when done'}
                    </span>
                  </div>
                )}
                {voiceState === 'transcribing' && (
                  <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-600 animate-spin" />
                    <span>
                      {isHindi ? 'Whisper v3 से विश्लेषण हो रहा है...' : 'Transcribing via Groq Whisper v3...'}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 font-mono">
                  {isGroqWhisperAvailable() ? '⚡ Groq Whisper Large-v3' : '🎙️ Multi-lingual Speech Engine'}
                </span>
              </div>
            )}

            {/* Categorized Complaint Selectors */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                {t.chiefComplaint.orChoosePreset}
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'fever_infections', label: `🌡️ ${t.presets.feverTitle}` },
                  { id: 'cardiorespiratory', label: `🫀 ${t.presets.chestTitle}` },
                  { id: 'gastro_ayush', label: `🩺 ${t.presets.giTitle}` },
                  { id: 'neuro_joint', label: `🦴 ${t.presets.orthoTitle}` },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`p-3 rounded-lg border text-xs font-medium transition-all text-left flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-slate-400 text-[10px]">{selectedCategory === cat.id ? '▲' : '▼'}</span>
                  </button>
                ))}
              </div>

              {/* Sub-complaints for selected category */}
              {selectedCategory && (
                <div className="mt-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-700 block">
                    {isHindi ? 'विशिष्ट लक्षण चुनें:' : 'Select specific symptom:'}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {CHIEF_COMPLAINT_PRESETS.find((c) => c.id === selectedCategory)?.commonComplaints.map(
                      (item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setChiefComplaintText(isHindi ? item.textHi : item.textEn);
                            setSite(item.defaultSite);
                            advance();
                          }}
                          className="p-3 text-xs text-left font-semibold text-slate-800 bg-white hover:bg-teal-600 hover:text-white rounded-xl border border-slate-200 transition-colors shadow-2xs"
                        >
                          {isHindi ? item.textHi : item.textEn}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Document / Prescription Bypass Upload Card */}
            <div className="pt-3 border-t border-slate-100">
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Paperclip size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {isHindi ? 'पुरानी पर्ची या जांच रिपोर्ट साथ लाए हैं?' : 'Have a past prescription or lab report?'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isHindi
                        ? 'फोटो या फ़ाइल जोड़ें — डॉक्टर इसे सीधे अपने कंप्यूटर पर देख सकेंगे।'
                        : 'Attach scan or photo — optical OCR will bypass handwritten notes straight to the doctor.'}
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0">
                  <Camera size={14} />
                  <span>{isHindi ? 'पर्ची जोड़ें' : 'Attach Report'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleKioskFileUpload}
                  />
                </label>
              </div>

              {/* Uploaded Documents Preview List */}
              {currentPatient.uploadedDocuments && currentPatient.uploadedDocuments.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {currentPatient.uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span className="font-bold text-emerald-900 truncate max-w-[200px]">{doc.name}</span>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                          {doc.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium shrink-0">
                        ✓ {isHindi ? 'डॉक्टर को प्रेषित' : 'Bypassed to Doctor'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: Onset & Duration */}
        {currentStep === 1 && !isAyush && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                {isHindi ? 'कदम 2: अवधि' : 'Step 2: Onset & Duration'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.stepDuration[clinicalDomain === 'fever' || clinicalDomain === 'respiratory' || clinicalDomain === 'gastrointestinal' ? clinicalDomain : 'general'].title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {currentOptions.onset.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => pickAndAdvance(setDuration, isHindi ? opt.labelHi : opt.labelEn)}
                  className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all text-center ${
                    duration === (isHindi ? opt.labelHi : opt.labelEn)
                      ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  {isHindi ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>

            {/* Custom Input or Speak your own */}
            <div className="max-w-lg mx-auto p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={isHindi ? 'या अपनी भाषा में लिखें (उदा. कल रात 8 बजे से)...' : 'Or type your exact duration (e.g. since yesterday 8 PM)...'}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
              <button
                type="button"
                onClick={() => toggleVoice('duration', setDuration)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'duration'
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <Mic size={15} />
                <span className="hidden sm:inline">{isListening && activeVoiceField === 'duration' ? t.stopVoice : t.speak}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Character of Discomfort */}
        {currentStep === 2 && !isAyush && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                {isHindi ? 'कदम 3: अहसास का प्रकार' : 'Step 3: Character & Sensation'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.stepCharacter[clinicalDomain === 'fever' || clinicalDomain === 'respiratory' || clinicalDomain === 'gastrointestinal' ? clinicalDomain : 'general'].title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {currentOptions.character.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => pickAndAdvance(setCharacter, isHindi ? opt.labelHi : opt.labelEn)}
                  className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all text-center ${
                    character === (isHindi ? opt.labelHi : opt.labelEn)
                      ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  {isHindi ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>

            {/* Custom Input / Speech for Character */}
            <div className="max-w-lg mx-auto p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                placeholder={isHindi ? 'या बोलें/लिखें कि कैसा महसूस हो रहा है...' : 'Or speak/type how it feels in your own words...'}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
              <button
                type="button"
                onClick={() => toggleVoice('character', setCharacter)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'character'
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <Mic size={15} />
                <span className="hidden sm:inline">{isListening && activeVoiceField === 'character' ? t.stopVoice : t.speak}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Radiation / Affected Regions */}
        {currentStep === 3 && !isAyush && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                {isHindi ? 'कदम 4: फैलाव / प्रभावित अंग' : 'Step 4: Affected Regions & Spread'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.stepSiteRadiation[clinicalDomain === 'fever' || clinicalDomain === 'respiratory' || clinicalDomain === 'gastrointestinal' ? clinicalDomain : 'general'].title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {currentOptions.radiation.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => pickAndAdvance(setRadiation, isHindi ? opt.labelHi : opt.labelEn)}
                  className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all text-center ${
                    radiation === (isHindi ? opt.labelHi : opt.labelEn)
                      ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  {isHindi ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>

            {/* Custom Input / Speech */}
            <div className="max-w-lg mx-auto p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={radiation}
                onChange={(e) => setRadiation(e.target.value)}
                placeholder={isHindi ? 'या अंग/हिस्सा बोलें या टाइप करें...' : 'Or type / speak the affected areas...'}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
              <button
                type="button"
                onClick={() => toggleVoice('radiation', setRadiation)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'radiation'
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <Mic size={15} />
                <span className="hidden sm:inline">{isListening && activeVoiceField === 'radiation' ? 'Listening' : 'Speak'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Severity Slider */}
        {currentStep === 4 && !isAyush && (
          <div className="animate-slide-up text-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                {isHindi ? 'कदम 5: तीव्रता' : 'Step 5: Severity Scale'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.stepSeverity.title}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {t.stepSeverity.sub}
              </p>
            </div>

            <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900">{severity}/10</span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-md mt-2 ${
                    severity >= 8
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : severity >= 5
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {severity >= 8
                    ? t.stepSeverity.severe
                    : severity >= 5
                    ? t.stepSeverity.moderate
                    : t.stepSeverity.mild}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={10}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-3.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />

              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>1 (Mild)</span>
                <span>5 (Moderate)</span>
                <span>10 (Unbearable)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Associated Symptoms */}
        {currentStep === 5 && !isAyush && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                {isHindi ? 'कदम 6: अन्य लक्षण' : 'Step 6: Associated Symptoms'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.stepAssociated.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t.stepAssociated.sub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {currentOptions.associated.map((opt) => {
                const isChecked = associated.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (isChecked) {
                        setAssociated(associated.filter((x) => x !== opt.id));
                      } else {
                        setAssociated([...associated, opt.id]);
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{isHindi ? opt.labelHi : opt.labelEn}</span>
                    {isChecked && <CheckCircle2 size={18} className="text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Associated Symptom Input/Voice */}
            <div className="max-w-lg mx-auto p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={customAssociated}
                onChange={(e) => setCustomAssociated(e.target.value)}
                placeholder={isHindi ? 'या कोई अन्य लक्षण बोलें या टाइप करें...' : 'Or speak/type any other symptom...'}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
              <button
                type="button"
                onClick={() => toggleVoice('associated', setCustomAssociated)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'associated'
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <Mic size={15} />
                <span className="hidden sm:inline">{isListening && activeVoiceField === 'associated' ? 'Listening' : 'Speak'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Aggravating Factors */}
        {currentStep === 6 && !isAyush && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                {isHindi ? 'कदम 7: बढ़ने के कारण' : 'Step 7: Aggravating Factors'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.stepAggravating.title}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {t.stepAggravating.sub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {currentOptions.aggravating.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => pickAndAdvance(setAggravating, isHindi ? opt.labelHi : opt.labelEn)}
                  className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all text-center ${
                    aggravating === (isHindi ? opt.labelHi : opt.labelEn)
                      ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  {isHindi ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>

            {/* Custom Input / Speech */}
            <div className="max-w-lg mx-auto p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={aggravating}
                onChange={(e) => setAggravating(e.target.value)}
                placeholder={isHindi ? 'या बोलें/लिखें कि किससे तकलीफ बढ़ती है...' : 'Or type / speak what triggers or worsens it...'}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
              <button
                type="button"
                onClick={() => toggleVoice('aggravating', setAggravating)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'aggravating'
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <Mic size={15} />
                <span className="hidden sm:inline">{isListening && activeVoiceField === 'aggravating' ? t.stopVoice : t.speak}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Relieving Factors */}
        {currentStep === 7 && !isAyush && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                {isHindi ? 'कदम 8: राहत के उपाय' : 'Step 8: Relieving Factors'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.stepRelieving.title}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {t.stepRelieving.sub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {currentOptions.relieving.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => pickAndAdvance(setRelieving, isHindi ? opt.labelHi : opt.labelEn)}
                  className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all text-center ${
                    relieving === (isHindi ? opt.labelHi : opt.labelEn)
                      ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  {isHindi ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>

            {/* Custom Input / Speech */}
            <div className="max-w-lg mx-auto p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={relieving}
                onChange={(e) => setRelieving(e.target.value)}
                placeholder={isHindi ? 'या बोलें/लिखें कि किससे आराम मिलता है...' : 'Or type / speak what brings relief...'}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
              <button
                type="button"
                onClick={() => toggleVoice('relieving', setRelieving)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isListening && activeVoiceField === 'relieving'
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <Mic size={15} />
                <span className="hidden sm:inline">{isListening && activeVoiceField === 'relieving' ? t.stopVoice : t.speak}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: Clinical Follow-up (Adaptive Questioning) */}
        {currentStep === 8 && !isAyush && (
          <div className="animate-slide-up space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center justify-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-blue-600" />
                {isHindi ? 'कदम 8: अतिरिक्त स्वास्थ्य विवरण' : 'Step 8: Additional Health Details'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.stepFollowUp.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {t.stepFollowUp.sub}
              </p>
            </div>

            {loadingAdaptive ? (
              <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-200/80 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-blue-900">
                  {isHindi ? 'आपके स्वास्थ्य विवरण के अनुसार प्रश्न तैयार किए जा रहे हैं...' : 'Preparing personalized follow-up questions...'}
                </p>
              </div>
            ) : adaptiveQuestions.length > 0 ? (
              <div className="space-y-4 max-w-lg mx-auto">
                {adaptiveQuestions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {qIdx + 1}. {isHindi ? q.questionHi : q.questionEn}
                      </h3>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                        {isHindi ? 'स्वास्थ्य प्रश्न' : 'Care Review'}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt) => {
                        const isSelected = adaptiveAnswers[q.id] === (isHindi ? opt.labelHi : opt.labelEn);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectAdaptiveOption(q.id, opt)}
                            className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                            }`}
                          >
                            <span className="leading-relaxed">{isHindi ? opt.labelHi : opt.labelEn}</span>
                            {isSelected && <CheckCircle2 size={16} className="text-blue-600 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-600">
                {isHindi ? 'सभी प्रश्न पूरे हुए। कृपया आगे बढ़ें।' : 'Standard questions completed. Click Continue to proceed.'}
              </div>
            )}
          </div>
        )}

        {/* STEP 1 (AYUSH): Dynamic Pariksha Question Tree */}
        {currentStep === 1 && isAyush && (
          <div className="animate-slide-up space-y-6">
            {!ayushCompleted ? (
              <div className="bg-emerald-50/50 rounded-xl p-6 sm:p-7 border border-emerald-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Leaf size={15} /> {isHindi ? 'दोष परीक्षण' : 'Dosha Root Cause Analysis'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      speakPrompt(
                        isHindi
                          ? AYURVEDA_QUESTION_TREE[activeAyushQuestionId]?.questionHi
                          : AYURVEDA_QUESTION_TREE[activeAyushQuestionId]?.questionEn,
                        currentPatient.language
                      )
                    }
                    className="p-1.5 text-emerald-700 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-200/60"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-emerald-950 mb-6">
                  {isHindi
                    ? AYURVEDA_QUESTION_TREE[activeAyushQuestionId]?.questionHi
                    : AYURVEDA_QUESTION_TREE[activeAyushQuestionId]?.questionEn}
                </h2>

                <div className="space-y-2.5">
                  {AYURVEDA_QUESTION_TREE[activeAyushQuestionId]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const newResponses = [
                          ...ayushResponses,
                          {
                            qId: activeAyushQuestionId,
                            answer: isHindi ? opt.labelHi : opt.labelEn,
                            dosha: opt.associatedDosha,
                          },
                        ];
                        setAyushResponses(newResponses);

                        if (opt.clinicalNote?.includes('Agni')) {
                          setAgni(opt.clinicalNote);
                          setDashavidha((prev) => ({ ...prev, aharaShakti: opt.clinicalNote }));
                        }
                        if (activeAyushQuestionId === 'q_gastro_vata') {
                          setKoshtha('Krura (Constipation)');
                          setAshtaSthana((prev) => ({ ...prev, mala: 'Constipated & Hard (Krura)' }));
                        }
                        if (activeAyushQuestionId === 'q_general_sleep') {
                          setNidra(isHindi ? opt.labelHi : opt.labelEn);
                        }

                        if (opt.nextQuestionId) {
                          setActiveAyushQuestionId(opt.nextQuestionId);
                        } else {
                          const doshaCounts = newResponses.reduce((acc, r) => {
                            if (r.dosha && r.dosha !== 'none') acc[r.dosha] = (acc[r.dosha] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);

                          let dominantDosha = 'Vata-Pitta';
                          if (Object.keys(doshaCounts).length > 0) {
                            const sorted = Object.entries(doshaCounts).sort((a, b) => b[1] - a[1]);
                            dominantDosha = sorted.map((s) => s[0].charAt(0).toUpperCase() + s[0].slice(1)).join('-');
                          }
                          setPrakriti(dominantDosha);
                          setDashavidha((prev) => ({ ...prev, prakriti: dominantDosha }));
                          setAyushCompleted(true);
                          advance();
                        }
                      }}
                      className="w-full p-3.5 rounded-lg border border-slate-200 bg-white text-left text-sm font-semibold text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all shadow-2xs"
                    >
                      {isHindi ? opt.labelHi : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/60 rounded-xl p-6 border border-emerald-200/90 text-center space-y-4 animate-fade-in shadow-xs">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black text-emerald-950">
                  {isHindi ? 'आयुर्वेदिक परीक्षण पूर्ण' : 'Ayurvedic Assessment Complete'}
                </h3>
                <p className="text-sm font-semibold text-emerald-800">
                  {isHindi ? `दोष प्रधानता: ${prakriti}` : `Predominant Dosha: ${prakriti}`}
                </p>
                <button
                  type="button"
                  onClick={() => advance()}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium text-xs shadow-xs transition-colors"
                >
                  {isHindi ? 'आगे बढ़ें' : 'Continue to Lifestyle'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 (AYUSH): Ahara & Vihara */}
        {currentStep === 2 && isAyush && (
          <div className="animate-slide-up text-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                {isHindi ? 'आहार-विहार' : 'Diet & Daily Habits'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isHindi ? 'आपकी खान-पान और दिनचर्या कैसी है?' : 'Describe your diet and daily lifestyle'}
              </h2>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              {[
                { labelEn: 'Spicy, irregular meals with heavy tea', labelHi: 'तीखा, अनियमित भोजन और अधिक चाय' },
                { labelEn: 'Heavy oily food, late night dinners', labelHi: 'भारी तला-भुना खाना और देर रात भोजन' },
                { labelEn: 'Light vegetarian diet, timely meals', labelHi: 'सादा शाकाहारी भोजन, समय पर' },
                { labelEn: 'Sedentary desk work, high stress', labelHi: 'बैठकर काम, मानसिक तनाव अधिक' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickAndAdvance(setAharaVihara, isHindi ? opt.labelHi : opt.labelEn)}
                  className={`w-full p-4 rounded-2xl border-2 text-sm font-bold transition-all text-left ${
                    aharaVihara === (isHindi ? opt.labelHi : opt.labelEn)
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {isHindi ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 (AYUSH): Nidra */}
        {currentStep === 3 && isAyush && (
          <div className="animate-slide-up text-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                {isHindi ? 'निद्रा' : 'Sleep Quality'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isHindi ? 'आपकी नींद कैसी रहती है?' : 'How is your sleep quality?'}
              </h2>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              {[
                { labelEn: 'Disturbed / Insomnia (< 6 hrs, anxious)', labelHi: 'अल्प निद्रा (< 6 घंटे, बेचैनी)' },
                { labelEn: 'Sound, deep peaceful sleep (7-8 hrs)', labelHi: 'गहरी और शांतिपूर्ण नींद (7-8 घंटे)' },
                { labelEn: 'Excessive daytime sleepiness (Tandra)', labelHi: 'दिन में अत्यधिक नींद और आलस्य' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickAndAdvance(setNidra, isHindi ? opt.labelHi : opt.labelEn)}
                  className={`w-full p-4 rounded-2xl border-2 text-sm font-bold transition-all text-left ${
                    nidra === (isHindi ? opt.labelHi : opt.labelEn)
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {isHindi ? opt.labelHi : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 (AYUSH): Pre-Consultation Patient Intake & Lifestyle Review */}
        {currentStep === 4 && isAyush && (
          <div className="animate-slide-up space-y-5 max-w-2xl mx-auto text-left">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                <Leaf size={13} />
                <span>{isHindi ? 'परामर्श-पूर्व रोगी समीक्षा' : 'Pre-Consultation Patient Intake Review'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'आपकी जीवनशैली व स्वास्थ्य विवरण सारांश' : 'Your Self-Reported Clinical & Lifestyle Summary'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isHindi
                  ? 'आपके द्वारा दर्ज किए गए लक्षण, पाचन, आहार-विहार व प्राथमिक प्रकृति का विवरण।'
                  : 'Review your symptoms, digestive fire, lifestyle habits, and preliminary constitutional tendencies.'}
              </p>
            </div>

            {/* Self-Reported Intake Summary Card */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    {isHindi ? 'रोगी द्वारा दर्ज स्वास्थ्य विवरण' : 'Patient Self-Reported Intake Data'}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {isHindi ? 'सत्यापित' : 'Patient Entered'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                    {isHindi ? 'मुख्य लक्षण' : 'Chief Complaint'}
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {chiefComplaintText || currentPatient.chiefComplaint || 'Consultation'}
                  </span>
                  {duration && (
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {isHindi ? `अवधि: ${duration}` : `Duration: ${duration}`}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">
                    {isHindi ? 'प्राथमिक दोष प्रवृत्ति (अनुमानित)' : 'Estimated Prakriti Tendency'}
                  </span>
                  <span className="font-bold text-emerald-950 text-sm block">
                    {prakriti || 'Vata-Pitta'}
                  </span>
                  <span className="text-[11px] text-emerald-700 mt-1 block">
                    {isHindi ? 'प्रश्नावली के आधार पर प्रारंभिक अनुमान' : 'Derived from self-reported intake responses'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                    {isHindi ? 'भूख व पाचन क्षमता (अग्नि)' : 'Reported Digestion & Appetite (Agni)'}
                  </span>
                  <span className="font-bold text-slate-800 block">
                    {agni || 'Samagni (Balanced digestion)'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                    {isHindi ? 'शौच प्रवृत्ति (कोष्ठ)' : 'Bowel Regularity (Koshtha)'}
                  </span>
                  <span className="font-bold text-slate-800 block">
                    {koshtha || 'Normal Regular Formed'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                    {isHindi ? 'आहार-विहार' : 'Reported Diet & Lifestyle (Ahara-Vihara)'}
                  </span>
                  <span className="font-bold text-slate-800 block">
                    {aharaVihara || 'Light vegetarian diet, timely meals'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                    {isHindi ? 'निद्रा' : 'Reported Sleep Quality (Nidra)'}
                  </span>
                  <span className="font-bold text-slate-800 block">
                    {nidra || 'Sound, peaceful sleep'}
                  </span>
                </div>
              </div>
            </div>

            {/* Clear Physical Examination Clinical Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <Stethoscope size={18} className="text-amber-700 shrink-0" />
                <span>
                  {isHindi
                    ? 'चिकित्सकीय शारीरिक परीक्षा (ओपीडी कक्ष में)'
                    : 'Physical Clinical Examination Conducted in OPD Room'}
                </span>
              </div>
              <p className="text-amber-800 leading-relaxed font-medium">
                {isHindi
                  ? 'ध्यान दें: दशविध समग्र शारीरिक परीक्षण (धातु-सार, संहनन, सात्म्य) और अष्टस्थान प्रत्यक्ष परीक्षा (नाड़ी परीक्षा/Pulse, जिह्वा/Tongue, नेत्र, त्वचा आदि) ओपीडी कक्ष में उपस्थित होने पर डॉक्टर अथवा नर्सिंग स्टाफ द्वारा प्रत्यक्ष रूप से की जाएगी।'
                  : 'Notice: Formal 10-Fold Systemic Examination (Dashavidha Pariksha: tissue vitality, structural build, adaptability) and 8-Point Physical Examination (Ashta Sthana: arterial pulse rhythm / Nadi, tongue inspection / Jihwa, skin texture, sclera) will be physically conducted and documented by your attending physician / nurse in OPD Room 14.'}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* 3. Persistent Clean Navigation Bar */}
      <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-all shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          onClick={() => advance()}
          disabled={(currentStep === 0 && !chiefComplaintText.trim()) || isCalculatingEsi}
          className={`px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs ${
            (currentStep === 0 && !chiefComplaintText.trim()) || isCalculatingEsi
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isCalculatingEsi ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isHindi ? 'पंजीकरण पूरा हो रहा है...' : 'Finalizing Registration...'}</span>
            </div>
          ) : (
            <>
              <span>
                {currentStep === totalSteps - 1
                  ? t.submit
                  : t.next}
              </span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      {/* Finalizing Registration Modal */}
      {isCalculatingEsi && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full text-center space-y-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">
              {isHindi ? 'पंजीकरण पूरा किया जा रहा है' : 'Finalizing Your OPD Registration'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'आपकी जानकारी सुरक्षित रूप से ओपीडी डॉक्टर को भेजी जा रही है...'
                : 'Securely transferring your details to the attending OPD physician...'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
