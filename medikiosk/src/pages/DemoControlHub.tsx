import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UserPlus,
  Zap,
  RotateCcw,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Users,
  Phone,
  AlertOctagon,
  ExternalLink,
  Sliders,
  Plus
} from 'lucide-react';
import { usePatientStore, mockDatabase, type PatientData } from '../store/usePatientStore';
import { DEMO_PRESET_PATIENTS } from '../data/demoPresets';

export default function DemoControlHub() {
  const navigate = useNavigate();
  const {
    populateDemoPatients,
    clearActiveQueueToRelieved,
    injectCustomPatient,
    loginProfile,
    resetDemoSession
  } = usePatientStore();

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Custom patient generator state
  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState('35');
  const [customGender, setCustomGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [customComplaint, setCustomComplaint] = useState('');
  const [customComplaintHi, setCustomComplaintHi] = useState('');
  const [customMode, setCustomMode] = useState<'modern' | 'ayush'>('modern');
  const [customEsi, setCustomEsi] = useState<1 | 2 | 3 | 4 | 5>(3);

  const activeQueueCount = Object.values(mockDatabase).filter(
    (p) => p.status !== 'accepted' && p.status !== 'admitted'
  ).length;

  const relievedCount = Object.values(mockDatabase).filter(
    (p) => p.status === 'accepted'
  ).length;

  const handleInjectSingle = (patient: PatientData, openDoctor = false) => {
    injectCustomPatient({
      ...patient,
      status: 'waiting',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    showToast(`✅ Patient ${patient.name} (${patient.token}) added to live queue.`);
    if (openDoctor) {
      navigate('/doctor');
    }
  };

  const handleLoginAsPersona = (phone: string, name: string) => {
    loginProfile(phone);
    showToast(`👤 Logged in as ${name} (${phone}). Redirecting to patient dashboard...`);
    setTimeout(() => {
      navigate('/patient/dashboard');
    }, 400);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customComplaint.trim()) return;

    const token = 'CUS-' + Math.floor(100 + Math.random() * 900);
    const newPatient: PatientData = {
      patientId: token,
      token,
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaVerified: true,
      name: customName.trim(),
      age: customAge,
      gender: customGender,
      phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
      height: '170',
      weight: '68',
      language: 'en',
      mode: customMode,
      chiefComplaint: customComplaint.trim(),
      chiefComplaintHi: customComplaintHi.trim() || customComplaint.trim(),
      symptomDuration: '2 days',
      symptomSite: 'General',
      symptomCharacter: 'Moderate distress',
      symptomRadiation: 'None',
      symptomTiming: 'Ongoing',
      symptomSeverity: customEsi <= 2 ? 8 : 5,
      aggravatingFactors: 'Exertion',
      relievingFactors: 'Rest',
      associatedSymptoms: [],
      prakriti: customMode === 'ayush' ? 'Pitta-Vata' : '',
      agni: customMode === 'ayush' ? 'Mandagni' : '',
      koshtha: customMode === 'ayush' ? 'Madhyama' : '',
      aharaVihara: '',
      nidra: '',
      chronicConditions: [],
      allergies: [],
      reviewOfSystems: [],
      triageLevel: customEsi <= 2 ? 'emergency' : customEsi === 3 ? 'priority' : 'normal',
      redFlags: customEsi <= 2 ? ['High acuity clinical presentation'] : [],
      esiTriage: {
        level: customEsi,
        category: customEsi === 1 ? 'Resuscitation' : customEsi === 2 ? 'Emergent' : customEsi === 3 ? 'Urgent' : 'Less Urgent',
        color: customEsi <= 2 ? '#ef4444' : customEsi === 3 ? '#eab308' : '#10b981',
        badgeBg: customEsi <= 2 ? 'bg-red-500/10' : customEsi === 3 ? 'bg-amber-500/10' : 'bg-emerald-500/10',
        badgeText: customEsi <= 2 ? 'text-red-700' : customEsi === 3 ? 'text-amber-700' : 'text-emerald-700',
        badgeBorder: customEsi <= 2 ? 'border-red-500/30' : customEsi === 3 ? 'border-amber-500/30' : 'border-emerald-500/30',
        rationale: 'Generated custom patient for live clinical simulation testing.',
        immediateActions: ['Standard clinical assessment and triage'],
        predictedResources: ['Clinical Evaluation', 'Prescription Slip'],
        algorithmSource: 'gemini-3.5-flash-lite'
      },
      uploadedDocuments: [],
      consentHistory: true,
      consentDocuments: true,
      consentAyush: customMode === 'ayush',
      structuredSummary: {
        chiefComplaintSummary: `${customName}, ${customAge}Y/${customGender} presenting with: ${customComplaint}`,
        hpi: customComplaint,
        pastHistory: 'None recorded',
        medicationsSummary: 'None',
        allergiesSummary: 'No known drug allergies',
        rosSummary: 'Unremarkable',
        redFlagsSummary: [],
        documentHighlights: [],
        suggestedWorkup: ['Physical Examination']
      },
      doctorNotes: '',
      status: 'waiting',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    injectCustomPatient(newPatient);
    showToast(`✅ Custom Patient ${newPatient.name} (${token}) created and added to queue!`);
    setCustomName('');
    setCustomComplaint('');
    setCustomComplaintHi('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-2xl flex items-center gap-2.5 animate-fade-in border border-teal-400">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20">
                <Sliders size={13} />
                <span>SIH Presentation & Live Pitch Controller</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>Demo Control Hub</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-600 text-white font-mono">v3.0</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Seamlessly inject realistic patient scenarios, trigger emergency alerts, switch between pre-authenticated ABHA personas, and control the OPD queue during live demonstrations.
              </p>
            </div>

            {/* Quick Portal Jump Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => navigate('/doctor')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope size={15} />
                <span>Doctor Portal</span>
                <ExternalLink size={13} className="opacity-70" />
              </button>

              <button
                onClick={() => navigate('/patient/login')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <HeartPulse size={15} className="text-rose-400" />
                <span>Patient Kiosk</span>
                <ExternalLink size={13} className="opacity-70" />
              </button>

              <button
                onClick={() => navigate('/consultation')}
                className="px-4 py-2.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-xs font-bold transition-all border border-teal-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} className="text-amber-400" />
                <span>New Voice Intake</span>
                <ExternalLink size={13} className="opacity-70" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Queue</span>
              <span className="text-2xl font-black text-blue-400 mt-1 block">{activeQueueCount} Waiting</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Relieved Patients</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">{relievedCount} Relieved</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pre-Built Presets</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">{DEMO_PRESET_PATIENTS.length} Clinical Cases</span>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cloud Sync Status</span>
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Live</span>
              </span>
            </div>
          </div>
        </div>

        {/* Master One-Click Simulation Triggers */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap size={16} className="text-amber-400" />
              <span>One-Click Simulation Commands</span>
            </h2>
            <span className="text-xs text-slate-500">Instant multi-patient queue control</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Command 1: Inject Core 4 Patients */}
            <button
              onClick={() => {
                populateDemoPatients();
                showToast('⚡ 4 Diverse OPD patients populated into the waiting queue!');
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/40 to-blue-950/80 hover:from-blue-800/50 hover:to-blue-900/90 border border-blue-700/40 text-left transition-all group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black text-xs">
                  4x
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Recommended</span>
              </div>
              <div className="font-bold text-white text-sm group-hover:text-blue-200 transition-colors">
                Populate 4 Demo Patients
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Fills queue with Cardiac (ESI 1), Asthma (ESI 3), AYUSH (ESI 4), and Migraine (ESI 3).
              </div>
            </button>

            {/* Command 2: Inject Immediate Red-Flag */}
            <button
              onClick={() => {
                handleInjectSingle(DEMO_PRESET_PATIENTS[0].patient);
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-950 hover:from-red-900/50 hover:to-slate-900 border border-red-800/40 text-left transition-all group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center font-black text-xs">
                  <AlertOctagon size={16} />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">High Risk</span>
              </div>
              <div className="font-bold text-white text-sm group-hover:text-red-200 transition-colors">
                Trigger Cardiac Emergency
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Injects Ramesh Sharma (STEMI suspicion, ESI 1, diaphoresis) to test red-flag protocol.
              </div>
            </button>

            {/* Command 3: Clear / Relieve All */}
            <button
              onClick={() => {
                clearActiveQueueToRelieved();
                showToast('🧹 All active patients marked Relieved. Testing empty queue state.');
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-950 hover:from-emerald-900/50 hover:to-slate-900 border border-emerald-800/40 text-left transition-all group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-xs">
                  <CheckCircle2 size={16} />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Clean Slate</span>
              </div>
              <div className="font-bold text-white text-sm group-hover:text-emerald-200 transition-colors">
                Relieve All (Clear Queue)
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Marks all corridor patients as relieved to verify the calm empty-queue UI state.
              </div>
            </button>

            {/* Command 4: Full Factory Reset */}
            <button
              onClick={() => {
                resetDemoSession();
                populateDemoPatients();
                showToast('🔄 Complete demo environment restored to pristine initial state.');
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 border border-slate-700 text-left transition-all group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-slate-700/50 text-slate-300 flex items-center justify-center font-black text-xs">
                  <RotateCcw size={16} />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Reset</span>
              </div>
              <div className="font-bold text-white text-sm group-hover:text-slate-200 transition-colors">
                Factory Reset Demo
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Clears past visits, restores 4 waiting cases, and resets doctor clinical impressions.
              </div>
            </button>
          </div>
        </div>

        {/* Individual Clinical Presets List (7 Distinct Cases) */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                <span>Select & Inject Demo Patients</span>
              </h2>
              <p className="text-xs text-slate-400">Click any patient to inject into the doctor queue or test login</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">7 Pre-Configured Cases</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_PRESET_PATIENTS.map((item) => {
              const p = item.patient;
              const isCurrentlyInQueue = mockDatabase[p.token]?.status === 'waiting' || mockDatabase[p.token]?.status === 'in_consultation';
              const isRelieved = mockDatabase[p.token]?.status === 'accepted';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrentlyInQueue
                      ? 'bg-slate-900 border-teal-500/50 shadow-lg'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-mono font-black text-xs flex items-center justify-center border border-slate-700">
                        #{item.badgeNumber}
                      </span>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className="font-mono text-xs text-slate-400">({p.token})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {p.age} Yrs • {p.gender} • {p.mode === 'ayush' ? '🌿 AYUSH' : '🩺 Allopathy'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isRelieved && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          ✓ Relieved
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        p.esiTriage?.level === 1 ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        p.esiTriage?.level === 2 ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                        p.esiTriage?.level === 3 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        ESI {p.esiTriage?.level} ({p.esiTriage?.category})
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.phone}</span>
                    </div>
                  </div>

                  {/* Complaint & Symptoms */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div className="text-slate-300 font-medium line-clamp-2">
                      "{p.chiefComplaint}"
                    </div>
                    {p.chiefComplaintHi && (
                      <div className="text-slate-500 text-[11px] italic font-serif mt-0.5 line-clamp-1">
                        "{p.chiefComplaintHi}"
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => handleInjectSingle(p, false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCurrentlyInQueue
                          ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Plus size={13} />
                      <span>{isCurrentlyInQueue ? 'In Queue (Re-add)' : 'Add to Queue'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInjectSingle(p, true)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Stethoscope size={13} className="text-teal-400" />
                      <span>Open in Chart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoginAsPersona(p.phone, p.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/90 text-slate-400 hover:text-white text-xs font-medium transition-all ml-auto flex items-center gap-1 cursor-pointer"
                    >
                      <Phone size={12} className="text-blue-400" />
                      <span>Login</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Patient Simulator Form */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus size={18} className="text-teal-400" />
                <span>Custom Patient Simulator</span>
              </h2>
              <p className="text-xs text-slate-400">Generate on-the-fly test cases with custom medical complaints and triage acuity</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Live Injection Engine</span>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Mahindra"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Age (Years)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={customAge}
                  onChange={(e) => setCustomAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Gender</label>
                <select
                  value={customGender}
                  onChange={(e) => setCustomGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Chief Complaint (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High fever with severe chills and body ache for 3 days"
                  value={customComplaint}
                  onChange={(e) => setCustomComplaint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Vernacular / Hindi (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 3 दिन से तेज बुखार, कपकपी और बदन दर्द"
                  value={customComplaintHi}
                  onChange={(e) => setCustomComplaintHi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Care Mode</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomMode('modern')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      customMode === 'modern'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    🩺 Allopathy OPD
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMode('ayush')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      customMode === 'ayush'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    🌿 AYUSH Integrative
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">ESI Triage Acuity</label>
                <select
                  value={customEsi}
                  onChange={(e) => setCustomEsi(Number(e.target.value) as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value={1}>Level 1: Resuscitation (Stat Life Threat)</option>
                  <option value={2}>Level 2: Emergent (High Risk / Confusion)</option>
                  <option value={3}>Level 3: Urgent (Multiple Diagnostic Resources)</option>
                  <option value={4}>Level 4: Less Urgent (Single Outpatient Resource)</option>
                  <option value={5}>Level 5: Non-Urgent (Refill / Dressing)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Plus size={16} />
              <span>Inject Custom Patient into Live Queue</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
