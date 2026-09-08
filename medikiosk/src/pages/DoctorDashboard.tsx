import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Leaf,
  Save,
  Printer,
  Bell,
  Plus,
  Trash2,
  Check,
  Zap,
  FileText,
  HeartPulse,
  ExternalLink,
  Sparkles,
  History,
  Building2,
  Activity,
  Clock,
  Stethoscope
} from 'lucide-react';
import { usePatientStore, mockDatabase, mockProfiles, type PatientData, type IpdMedication, type IpdProgressNote, syncPatientToSupabase } from '../store/usePatientStore';
import type { DoctorOutletContext } from '../components/DoctorLayout';
import OPDPrescriptionModal from '../components/OPDPrescriptionModal';

interface PrescribedMedItem {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function DoctorDashboard() {
  const { activeTab, setActiveTab } = useOutletContext<DoctorOutletContext>() || {
    activeTab: 'consultation',
    setActiveTab: () => {},
  };

  const { currentPatient, initSocket } = usePatientStore();
  const queueTrigger = usePatientStore(state => state.queueTrigger);

  // Search token input
  const [searchToken, setSearchToken] = useState(currentPatient.token || 'EMG-911');
  const [selectedPatient, setSelectedPatient] = useState<PatientData>(
    mockDatabase[currentPatient.token] || mockDatabase['EMG-911'] || Object.values(mockDatabase)[0]
  );

  useEffect(() => {
    initSocket();
    // Use queueTrigger to silence TS, it naturally triggers a re-render from Zustand
  }, [initSocket, queueTrigger]);

  const [activeChartTab, setActiveChartTab] = useState<'soap' | 'ocr' | 'ayush' | 'history'>('soap');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [queueFilter, setQueueFilter] = useState<'all' | 'emergency' | 'ayush' | 'waiting'>('all');

  // In-Patient (IPD) Ward Management State
  const [showAddMedToken, setShowAddMedToken] = useState<string | null>(null);
  const [showAddNoteToken, setShowAddNoteToken] = useState<string | null>(null);
  const [newIpdMed, setNewIpdMed] = useState<{ name: string; dose: string; route: 'IV' | 'Oral' | 'Nebulization'; schedule: string }>({
    name: '',
    dose: '',
    route: 'IV',
    schedule: 'BID'
  });
  const [newRoundNote, setNewRoundNote] = useState('');
  const [newRoundVitals, setNewRoundVitals] = useState('SpO2: 98% | BP: 120/80 | HR: 76');
  const [dischargeModalPatient, setDischargeModalPatient] = useState<PatientData | null>(null);
  const [dischargeSummaryNote, setDischargeSummaryNote] = useState('');

  // Interactive Rx Prescription Pad State
  const [prescribedMeds, setPrescribedMeds] = useState<PrescribedMedItem[]>([]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('1-0-1');
  const [newMedDuration, setNewMedDuration] = useState('7 Days');
  const [newMedInstructions, setNewMedInstructions] = useState('After food');

  // Initialize with current patient if valid
  useEffect(() => {
    if (currentPatient.token && mockDatabase[currentPatient.token]) {
      setSelectedPatient(mockDatabase[currentPatient.token]);
      setSearchToken(currentPatient.token);
      setDoctorNotes(mockDatabase[currentPatient.token].doctorNotes || '');
      setPrescribedMeds([]);
    }
  }, [currentPatient.token]);

  const handleSelectPatient = (patient: PatientData) => {
    setSelectedPatient(patient);
    setSearchToken(patient.token);
    setDoctorNotes(patient.doctorNotes || '');
    setPrescribedMeds([]); // Reset prescription pad for new patient
    setStatusMessage('');
    if (activeTab !== 'consultation') {
      setActiveTab('consultation');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchToken.toUpperCase();
    if (mockDatabase[query]) {
      handleSelectPatient(mockDatabase[query]);
    } else {
      const found = Object.values(mockDatabase).find(
        (p) => p.name.toUpperCase().includes(query) || p.phone === query
      );
      if (found) handleSelectPatient(found);
      else alert('Patient not found in active queue.');
    }
  };

  const handleCallPatient = () => {
    setStatusMessage(`📢 Chime triggered: Patient ${selectedPatient.name} (Token: ${selectedPatient.token}) summoned to OPD Room 14`);
    
    // Update status to in_consultation
    const updatedPatient = { ...selectedPatient, status: 'in_consultation' as const };
    setSelectedPatient(updatedPatient);
    if (mockDatabase[updatedPatient.token]) {
      mockDatabase[updatedPatient.token] = updatedPatient;
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // Audio context might be restricted
    }
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const syncToProfileVisit = (patient: PatientData, meds: PrescribedMedItem[], notes: string, diagnosisSuffix = '') => {
    const profileKey = Object.keys(mockProfiles).find(
      k => mockProfiles[k].name === patient.name || mockProfiles[k].abhaId === patient.abhaId
    );
    if (profileKey) {
      const prof = mockProfiles[profileKey];
      if (prof.pastVisits && prof.pastVisits.length > 0) {
        prof.pastVisits[0].diagnosis = `${patient.structuredSummary?.chiefComplaintSummary || patient.chiefComplaint || 'Consultation'} ${diagnosisSuffix}`;
        if (meds && meds.length > 0) {
          prof.pastVisits[0].prescriptions = meds.map(m => `${m.name} ${m.dose} - ${m.frequency} (${m.duration})`);
        }
        prof.pastVisits[0].doctorNotesHidden = notes;
      }
    }
  };

  const handleSaveToHIS = () => {
    selectedPatient.status = 'accepted';
    selectedPatient.doctorNotes = doctorNotes;
    if (mockDatabase[selectedPatient.token]) {
      mockDatabase[selectedPatient.token] = { ...selectedPatient };
    }
    syncToProfileVisit(selectedPatient, prescribedMeds, doctorNotes, '(Discharged/Outpatient)');
    setStatusMessage(`✅ Intake verified & pushed to Hospital Information System (HIS).`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleAdmitPatient = () => {
    selectedPatient.status = 'admitted';
    selectedPatient.doctorNotes = doctorNotes;
    selectedPatient.admittedWard = selectedPatient.admittedWard || 'Pulmonary & Acute Care Ward 4B';
    selectedPatient.bedNumber = selectedPatient.bedNumber || `Bed ${Math.floor(Math.random() * 15) + 1}`;
    selectedPatient.admissionDate = selectedPatient.admissionDate || `${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Day 1)`;
    selectedPatient.ipdStage = selectedPatient.ipdStage || 'Acute Care';
    if (!selectedPatient.ipdVitals) {
      selectedPatient.ipdVitals = {
        spO2: '96%',
        pulse: '86 bpm',
        bp: '128/84 mmHg',
        temp: '98.8°F',
        respiratoryRate: '19/min'
      };
    }
    if (!selectedPatient.ipdProgressNotes || selectedPatient.ipdProgressNotes.length === 0) {
      selectedPatient.ipdProgressNotes = [
        {
          id: `note-${Date.now()}`,
          timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Admission)`,
          doctorName: 'Dr. R. Verma, MD',
          note: `Admitted from OPD for in-patient clinical management of ${selectedPatient.structuredSummary?.chiefComplaintSummary || selectedPatient.chiefComplaint}. Immediate bed protocol initiated.`,
          vitalsSummary: 'SpO2: 96% | BP: 128/84 | HR: 86 bpm'
        }
      ];
    }
    if (!selectedPatient.ipdMedications || selectedPatient.ipdMedications.length === 0) {
      selectedPatient.ipdMedications = prescribedMeds.length > 0
        ? prescribedMeds.map((m, idx) => ({
            id: `ipd-${idx}-${Date.now()}`,
            name: m.name,
            dose: m.dose,
            route: (m.instructions.toLowerCase().includes('iv') ? 'IV' : 'Oral') as any,
            schedule: m.frequency,
            lastGiven: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            status: 'Active' as const
          }))
        : [
            { id: 'ipd-1', name: 'IV Normal Saline 500ml', dose: '100ml/hr', route: 'IV', schedule: 'Continuous', lastGiven: 'Running', status: 'Active' as const },
            { id: 'ipd-2', name: 'IV Pantoprazole', dose: '40mg', route: 'IV', schedule: 'OD (Morning)', lastGiven: 'Today 08:00 AM', status: 'Active' as const }
          ];
    }
    if (mockDatabase[selectedPatient.token]) {
      mockDatabase[selectedPatient.token] = { ...selectedPatient };
    }
    syncToProfileVisit(selectedPatient, prescribedMeds, doctorNotes, '(Admitted to IPD)');
    setStatusMessage(`🚨 Patient admitted to ${selectedPatient.admittedWard} (${selectedPatient.bedNumber}). In-patient chart active.`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleFreqChange = (freq: string) => {
    setNewMedFreq(freq);
    if (freq === 'SOS') {
      setNewMedDuration('SOS (When needed)');
      setNewMedInstructions('SOS (If pain/fever)');
    } else {
      if (newMedDuration.startsWith('SOS')) {
        setNewMedDuration('5 Days');
      }
      if (newMedInstructions.startsWith('SOS')) {
        setNewMedInstructions('After food');
      }
    }
  };

  const handleDoseChange = (dose: string) => {
    setNewMedDose(dose);
    if (dose.trim().toLowerCase() === 'sos') {
      setNewMedFreq('SOS');
      setNewMedDuration('SOS (When needed)');
      setNewMedInstructions('SOS (If pain/fever)');
    }
  };

  const handleInstructionsChange = (inst: string) => {
    setNewMedInstructions(inst);
    if (inst.startsWith('SOS')) {
      setNewMedFreq('SOS');
      if (!newMedDuration || !newMedDuration.startsWith('SOS')) {
        setNewMedDuration('SOS (When needed)');
      }
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    setPrescribedMeds([
      ...prescribedMeds,
      {
        name: newMedName.trim(),
        dose: newMedDose.trim() || (newMedFreq === 'SOS' ? '1 Tab SOS' : '1 Tab'),
        frequency: newMedFreq,
        duration: newMedDuration.trim() || (newMedFreq === 'SOS' ? 'SOS' : '5 Days'),
        instructions: newMedInstructions.trim() || (newMedFreq === 'SOS' ? 'SOS (If pain/fever)' : 'After food'),
      },
    ]);
    setNewMedName('');
    setNewMedDose('');
    setNewMedFreq('1-0-1');
    setNewMedDuration('5 Days');
    setNewMedInstructions('After food');
  };

  const handleRemoveMed = (index: number) => {
    setPrescribedMeds(prescribedMeds.filter((_, i) => i !== index));
  };

  const handleApplyOrderSet = (type: 'cardiac' | 'amlapitta' | 'diabetes') => {
    if (type === 'cardiac') {
      setPrescribedMeds([
        { name: 'Tab Ecosprin (Aspirin)', dose: '300 mg (Stat)', frequency: 'Stat chewable', duration: 'Immediate', instructions: 'Chew stat with water' },
        { name: 'Tab Clopidogrel', dose: '300 mg (Stat)', frequency: 'Stat loading', duration: 'Immediate', instructions: 'Oral stat dose' },
        { name: 'Tab Atorvastatin', dose: '80 mg', frequency: '0-0-1 (Bedtime)', duration: '14 Days', instructions: 'Nightly lipid stabilization' },
        { name: 'Tab Sorbitrate (Isosorbide)', dose: '5 mg', frequency: 'SOS Sublingual', duration: 'SOS', instructions: 'Keep under tongue if chest pain' },
      ]);
      setDoctorNotes((prev) => `${prev}\n[CARDIAC PROTOCOL]: High suspicion of Acute Coronary Syndrome. Stat 12-lead ECG and Troponin-I sent. Loading antiplatelets administered.`);
    } else if (type === 'amlapitta') {
      setPrescribedMeds([
        { name: 'Cap Pantoprazole', dose: '40 mg', frequency: '1-0-0 (Fasting)', duration: '14 Days', instructions: '30 mins before breakfast' },
        { name: 'Syp Sucralfate + Oxetacaine', dose: '10 ml', frequency: '1-1-1 (TDS)', duration: '7 Days', instructions: 'After meals for gastric coating' },
        { name: 'Avipattikar Churna (AYUSH)', dose: '3 grams', frequency: '1-0-1', duration: '14 Days', instructions: 'With lukewarm water after meals' },
      ]);
      setDoctorNotes((prev) => `${prev}\n[AMLAPITTA REGIMEN]: Integrative management. Pitta-pacifying diet advised. Avoid tea, citrus, and NSAIDs.`);
    } else if (type === 'diabetes') {
      setPrescribedMeds([
        { name: 'Tab Metformin SR', dose: '1000 mg', frequency: '1-0-1 (Post-meal)', duration: '30 Days', instructions: 'Twice daily with meals' },
        { name: 'Tab Glimepiride', dose: '1 mg', frequency: '1-0-0 (Pre-meal)', duration: '30 Days', instructions: 'Before morning breakfast' },
      ]);
      setDoctorNotes((prev) => `${prev}\n[T2DM REVIEW]: HbA1c target < 7.0%. Fasting blood sugar log advised twice weekly.`);
    }
  };

  const allQueuePatients = Object.values(mockDatabase);
  const filteredQueue = allQueuePatients.filter((p) => {
    if (queueFilter === 'emergency') return p.triageLevel === 'emergency';
    if (queueFilter === 'ayush') return p.mode === 'ayush';
    if (queueFilter === 'waiting') return p.status === 'waiting';
    return true;
  });

  const handleMarkDoseGiven = (patient: PatientData, medId: string) => {
    if (!patient.ipdMedications) return;
    const nowStr = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    patient.ipdMedications = patient.ipdMedications.map(m =>
      m.id === medId ? { ...m, lastGiven: `${nowStr} (By Nurse)` } : m
    );
    if (mockDatabase[patient.token]) {
      mockDatabase[patient.token] = { ...patient };
    }
    syncPatientToSupabase(patient);
    setStatusMessage(`✅ Medication dose recorded as given at ${nowStr} for ${patient.name}`);
    setTimeout(() => setStatusMessage(''), 3000);
    setDoctorNotes(prev => prev + ' ');
    setDoctorNotes(prev => prev.trim());
  };

  const handleAddIpdMed = (patient: PatientData) => {
    if (!newIpdMed.name.trim()) return;
    const medToAdd: IpdMedication = {
      id: `med-${Date.now()}`,
      name: newIpdMed.name.trim(),
      dose: newIpdMed.dose.trim() || '1 Dose',
      route: newIpdMed.route,
      schedule: newIpdMed.schedule,
      lastGiven: 'Ordered / Pending dose',
      status: 'Active'
    };
    patient.ipdMedications = [...(patient.ipdMedications || []), medToAdd];
    if (mockDatabase[patient.token]) {
      mockDatabase[patient.token] = { ...patient };
    }
    syncPatientToSupabase(patient);
    setNewIpdMed({ name: '', dose: '', route: 'IV', schedule: 'BID' });
    setShowAddMedToken(null);
    setStatusMessage(`✅ In-patient medication order added: ${medToAdd.name} (${medToAdd.dose})`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleAddRoundNote = (patient: PatientData) => {
    if (!newRoundNote.trim()) return;
    const noteToAdd: IpdProgressNote = {
      id: `note-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Rounds)`,
      doctorName: 'Dr. R. Verma, MD',
      note: newRoundNote.trim(),
      vitalsSummary: newRoundVitals.trim() || 'Vitals stable'
    };
    patient.ipdProgressNotes = [...(patient.ipdProgressNotes || []), noteToAdd];
    if (mockDatabase[patient.token]) {
      mockDatabase[patient.token] = { ...patient };
    }
    syncPatientToSupabase(patient);
    setNewRoundNote('');
    setShowAddNoteToken(null);
    setStatusMessage(`✅ Daily clinical round note logged for ${patient.name}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleStageChange = (patient: PatientData, newStage: 'Observation' | 'Acute Care' | 'Stabilizing' | 'Ready for Discharge') => {
    patient.ipdStage = newStage;
    if (mockDatabase[patient.token]) {
      mockDatabase[patient.token] = { ...patient };
    }
    syncPatientToSupabase(patient);
    setStatusMessage(`📋 Clinical stage updated to: ${newStage}`);
    setTimeout(() => setStatusMessage(''), 3000);
    setDoctorNotes(prev => prev + ' ');
    setDoctorNotes(prev => prev.trim());
  };

  const executeDischarge = (patient: PatientData) => {
    patient.status = 'accepted';
    const finalNote = dischargeSummaryNote.trim() || 'Patient stabilized and discharged from in-patient care. Step-down oral medications advised.';
    syncToProfileVisit(patient, patient.ipdMedications ? patient.ipdMedications.map(m => ({ name: m.name, dose: m.dose, frequency: m.schedule, duration: '5-7 Days', instructions: 'Oral stepdown' })) : [], finalNote, '(Discharged from IPD)');
    if (mockDatabase[patient.token]) {
      mockDatabase[patient.token] = { ...patient };
    }
    syncPatientToSupabase(patient);
    setStatusMessage(`🏥 Patient ${patient.name} successfully discharged. Bed freed.`);
    setDischargeModalPatient(null);
    setDischargeSummaryNote('');
    setTimeout(() => setStatusMessage(''), 3500);
    setDoctorNotes(prev => prev + ' ');
    setDoctorNotes(prev => prev.trim());
  };

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto animate-fade-in pb-12">
      
      {/* Top Notification Banner if any */}
      {statusMessage && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-teal-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage('')}
            className="text-teal-700 hover:text-teal-900 text-xs underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* OPD KPI Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Registered</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">14 <span className="text-[11px] font-normal text-slate-400">Patients</span></div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Waiting Hall</div>
          <div className="text-xl font-black text-blue-600 mt-0.5">{allQueuePatients.filter(p => p.status === 'waiting').length} <span className="text-[11px] font-normal text-slate-400">Waiting</span></div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Critical Red-Flags
          </div>
          <div className="text-xl font-black text-red-600 mt-0.5">
            {allQueuePatients.filter(p => p.triageLevel === 'emergency').length} <span className="text-[11px] font-normal text-slate-400">High Risk</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg Consult Duration</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">2.8 <span className="text-[11px] font-normal text-slate-400">min (was 15m)</span></div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Time Saved Today</div>
          <div className="text-xl font-black text-teal-700 mt-0.5">82% <span className="text-[11px] font-normal text-teal-600">Efficiency</span></div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: FULL-SCREEN OPD QUEUE (if activeTab === 'queue') */}
      {/* ========================================================================= */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">OPD Live Queue Management</h2>
              <p className="text-xs text-slate-500">Real-time status of patients waiting in AIIMS Medicine OPD corridor</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setQueueFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  queueFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                All ({allQueuePatients.length})
              </button>
              <button
                onClick={() => setQueueFilter('emergency')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  queueFilter === 'emergency' ? 'bg-red-600 text-white shadow-2xs' : 'text-red-700'
                }`}
              >
                🚨 Emergency ({allQueuePatients.filter(p => p.triageLevel === 'emergency').length})
              </button>
              <button
                onClick={() => setQueueFilter('ayush')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  queueFilter === 'ayush' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700'
                }`}
              >
                🌿 AYUSH ({allQueuePatients.filter(p => p.mode === 'ayush').length})
              </button>
              <button
                onClick={() => setQueueFilter('waiting')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  queueFilter === 'waiting' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Waiting ({allQueuePatients.filter(p => p.status === 'waiting').length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Token & Time</th>
                  <th className="p-4">Patient Demographics</th>
                  <th className="p-4">Chief Complaint & Red Flags</th>
                  <th className="p-4">Triage Priority</th>
                  <th className="p-4">Care Mode</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueue.map((p) => (
                  <tr
                    key={p.token}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      p.token === selectedPatient.token ? 'bg-teal-50/40' : ''
                    }`}
                  >
                    <td className="p-4 font-mono">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                        {p.token}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{p.createdAt || '09:30 AM'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-slate-500">{p.age} Yrs / {p.gender} • ABHA: {p.abhaId.slice(-4)}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-semibold text-slate-800 line-clamp-1">{p.chiefComplaint}</div>
                      {p.redFlags && p.redFlags.length > 0 && (
                        <div className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-0.5">
                          <AlertTriangle size={11} /> {p.redFlags[0]}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase ${
                        p.triageLevel === 'emergency'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : p.triageLevel === 'priority'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.triageLevel === 'emergency' && <Zap size={10} />}
                        {p.triageLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.mode === 'ayush' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {p.mode === 'ayush' ? 'AYUSH' : 'Modern OPD'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold capitalize text-slate-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleSelectPatient(p)}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs transition-all shadow-2xs"
                      >
                        Open Chart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CRITICAL EMERGENCY HUB (if activeTab === 'emergency') */}
      {/* ========================================================================= */}
      {activeTab === 'emergency' && (
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                <AlertOctagon size={26} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Emergency Resuscitation & Triage Bay</h2>
                <p className="text-xs text-slate-500">Immediate clinical alerts flagged by MediKiosk AI intake engine</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs uppercase animate-pulse">
              Level 1 / 2 Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allQueuePatients.filter(p => p.triageLevel === 'emergency').map((p) => (
              <div key={p.token} className="p-5 rounded-2xl border-2 border-red-300 bg-red-50/40 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-black bg-red-600 text-white px-2.5 py-0.5 rounded">
                      TOKEN: {p.token}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{p.name}</h3>
                    <p className="text-xs text-slate-600">{p.age} Yrs • {p.gender} • ABHA: {p.abhaId}</p>
                  </div>
                  <button
                    onClick={() => handleSelectPatient(p)}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Open Immediate Chart
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-red-200">
                  <div className="text-xs font-bold text-red-900">Chief Complaint:</div>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">{p.chiefComplaint}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-red-800 uppercase tracking-wider">Red Flag Triages:</div>
                  {p.redFlags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-red-700 font-medium">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-600" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-red-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Suggested Action: Immediate 12-Lead ECG & Stat IV Access</span>
                  <span className="font-bold text-red-700">Code Yellow</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: IPD / ADMITTED PATIENTS */}
      {/* ========================================================================= */}
      {activeTab === 'ipd' && (
        <div className="space-y-6">
          
          {/* Top In-Patient Ward Status Header */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                  Ward In-Patient Rounds & Orders
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">In-Patient Department (IPD)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor admitted patients, track bedside vitals, manage Medication Administration Records (MAR), and log daily clinical rounds.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Admitted</div>
                <div className="text-lg font-black text-slate-900">
                  {allQueuePatients.filter(p => p.status === 'admitted').length}
                </div>
              </div>
              <div className="px-4 py-2 bg-teal-50 border border-teal-200 rounded-xl text-center">
                <div className="text-[10px] uppercase font-bold text-teal-700">Ward Unit</div>
                <div className="text-lg font-black text-teal-900">Ward 4B Active</div>
              </div>
            </div>
          </div>

          {/* Admitted Patient Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allQueuePatients.filter(p => p.status === 'admitted').map(p => {
              const stageColors: Record<string, string> = {
                'Observation': 'bg-amber-50 text-amber-800 border-amber-200',
                'Acute Care': 'bg-red-50 text-red-800 border-red-200',
                'Stabilizing': 'bg-teal-50 text-teal-800 border-teal-200',
                'Ready for Discharge': 'bg-emerald-50 text-emerald-800 border-emerald-200'
              };
              const currentStage = p.ipdStage || 'Stabilizing';

              return (
                <div
                  key={p.token}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-xs hover:border-slate-300 transition-all relative overflow-hidden"
                >
                  {/* Top Ward & Bed Bar */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg shadow-2xs">
                          🛏️ {p.bedNumber || 'Bed 12'}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {p.admittedWard || 'Ward 4B (Acute Care)'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg mt-1.5">{p.name}</h3>
                      <div className="text-xs text-slate-500 font-medium">
                        {p.age} Yrs • {p.gender} • Token: <span className="font-mono font-bold text-slate-700">{p.token}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Stage:</span>
                        <select
                          value={currentStage}
                          onChange={(e) => handleStageChange(p, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${stageColors[currentStage] || 'bg-slate-100 text-slate-800 border-slate-200'}`}
                        >
                          <option value="Acute Care">Acute Care</option>
                          <option value="Observation">Observation</option>
                          <option value="Stabilizing">Stabilizing</option>
                          <option value="Ready for Discharge">Ready for Discharge</option>
                        </select>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={12} /> {p.admissionDate || 'Admitted Today'}
                      </span>
                    </div>
                  </div>

                  {/* Bedside Live Vitals Strip */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-5 gap-2 text-center">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold uppercase text-slate-400">SpO2</div>
                      <div className="text-sm font-black text-teal-700">{p.ipdVitals?.spO2 || '96%'}</div>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200/70">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Heart Rate</div>
                      <div className="text-sm font-black text-slate-900">{p.ipdVitals?.pulse || '82 bpm'}</div>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200/70">
                      <div className="text-[10px] font-bold uppercase text-slate-400">BP</div>
                      <div className="text-sm font-black text-slate-900">{p.ipdVitals?.bp || '126/80'}</div>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200/70">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Temp</div>
                      <div className="text-sm font-black text-slate-900">{p.ipdVitals?.temp || '98.6°F'}</div>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200/70">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Resp Rate</div>
                      <div className="text-sm font-black text-slate-900">{p.ipdVitals?.respiratoryRate || '18/min'}</div>
                    </div>
                  </div>

                  {/* Primary In-Patient Diagnosis */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Admitting Diagnosis & Clinical Context:</span>
                    <p className="font-semibold text-slate-800 leading-relaxed">
                      {p.structuredSummary?.chiefComplaintSummary || p.chiefComplaint}
                    </p>
                  </div>

                  {/* SECTION A: MEDICATION ADMINISTRATION RECORD (MAR) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Activity size={14} className="text-teal-600" />
                        Active In-Patient Meds & Infusions ({p.ipdMedications?.length || 0})
                      </span>
                      <button
                        onClick={() => setShowAddMedToken(showAddMedToken === p.token ? null : p.token)}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Medicine
                      </button>
                    </div>

                    {/* Inline Form to Add Medicine */}
                    {showAddMedToken === p.token && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fade-in text-xs">
                        <div className="font-bold text-slate-800 text-[11px]">Order New In-Patient Medication</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Medicine name (e.g. IV Ceftriaxone)"
                            value={newIpdMed.name}
                            onChange={(e) => setNewIpdMed({ ...newIpdMed, name: e.target.value })}
                            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Dose (e.g. 1g IV)"
                            value={newIpdMed.dose}
                            onChange={(e) => setNewIpdMed({ ...newIpdMed, dose: e.target.value })}
                            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={newIpdMed.route}
                            onChange={(e) => setNewIpdMed({ ...newIpdMed, route: e.target.value as any })}
                            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                          >
                            <option value="IV">IV Infusion / Bolus</option>
                            <option value="Oral">Oral (Tab / Syp)</option>
                            <option value="Nebulization">Nebulization</option>
                            <option value="SubQ">Subcutaneous</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Schedule (e.g. BID, TID, Q6H)"
                            value={newIpdMed.schedule}
                            onChange={(e) => setNewIpdMed({ ...newIpdMed, schedule: e.target.value })}
                            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowAddMedToken(null)}
                            className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddIpdMed(p)}
                            className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold"
                          >
                            Save Order
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {p.ipdMedications && p.ipdMedications.length > 0 ? (
                        p.ipdMedications.map((med) => {
                          const routeBadge: Record<string, string> = {
                            'IV': 'bg-blue-100 text-blue-800 border-blue-200',
                            'Oral': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                            'Nebulization': 'bg-purple-100 text-purple-800 border-purple-200',
                            'SubQ': 'bg-amber-100 text-amber-800 border-amber-200'
                          };

                          return (
                            <div
                              key={med.id}
                              className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${routeBadge[med.route] || 'bg-slate-200 text-slate-700'}`}>
                                    {med.route}
                                  </span>
                                  <span className="font-bold text-slate-900 truncate">{med.name}</span>
                                  <span className="text-slate-500">({med.dose})</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                  <span>Schedule: <strong className="text-slate-700">{med.schedule}</strong></span>
                                  <span>•</span>
                                  <span className="truncate">Last given: {med.lastGiven || 'Scheduled'}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleMarkDoseGiven(p, med.id)}
                                className="shrink-0 px-2.5 py-1 bg-white hover:bg-teal-50 text-teal-800 border border-slate-200 hover:border-teal-300 rounded-lg text-[11px] font-bold transition-all shadow-2xs"
                                title="Click to log this dose as administered"
                              >
                                ✓ Dose Given
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center">
                          No active in-patient medications ordered yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION B: CLINICAL PROGRESS ROUNDS & TRAJECTORY */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Stethoscope size={14} className="text-teal-600" />
                        Daily Clinical Rounds & Trajectory ({p.ipdProgressNotes?.length || 0})
                      </span>
                      <button
                        onClick={() => setShowAddNoteToken(showAddNoteToken === p.token ? null : p.token)}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Round Note
                      </button>
                    </div>

                    {/* Inline Form to Add Round Note */}
                    {showAddNoteToken === p.token && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 animate-fade-in text-xs">
                        <div className="font-bold text-slate-800 text-[11px]">Log Daily Clinical Observations</div>
                        <textarea
                          rows={2}
                          placeholder="E.g. Patient afebrile, chest wheeze reduced, ready for step-down..."
                          value={newRoundNote}
                          onChange={(e) => setNewRoundNote(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-700"
                        />
                        <input
                          type="text"
                          placeholder="Bedside Vitals (e.g. SpO2: 96% | BP: 120/80 | HR: 76)"
                          value={newRoundVitals}
                          onChange={(e) => setNewRoundVitals(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowAddNoteToken(null)}
                            className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddRoundNote(p)}
                            className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold"
                          >
                            Save Round Note
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {p.ipdProgressNotes && p.ipdProgressNotes.length > 0 ? (
                        p.ipdProgressNotes.map((note) => (
                          <div key={note.id} className="p-3 bg-slate-50/80 border border-slate-200/70 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-teal-800">{note.doctorName || 'Dr. R. Verma, MD'}</span>
                              <span className="text-slate-400 font-mono">{note.timestamp}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-medium">{note.note}</p>
                            {note.vitalsSummary && (
                              <div className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200/60 inline-block mt-0.5">
                                {note.vitalsSummary}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center">
                          No daily round notes recorded yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        handleSelectPatient(p);
                        setActiveTab('consultation');
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <ExternalLink size={14} />
                      <span>Open Full Clinical Chart</span>
                    </button>

                    <button
                      onClick={() => setDischargeModalPatient(p)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Check size={14} />
                      <span>Discharge from IPD</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {allQueuePatients.filter(p => p.status === 'admitted').length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
                <Building2 size={36} className="mx-auto mb-2 opacity-30 text-teal-700" />
                <h4 className="font-bold text-slate-700 text-sm">No Patients Currently Admitted</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Patients marked for admission from the OPD consultation chart will automatically appear here with bed allocations.
                </p>
              </div>
            )}
          </div>

          {/* Discharge Confirmation Modal */}
          {dischargeModalPatient && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      🏥
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Confirm Patient Discharge</h3>
                      <p className="text-[11px] text-slate-500">{dischargeModalPatient.name} (Bed: {dischargeModalPatient.bedNumber || 'Bed 12'})</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDischargeModalPatient(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed">
                  Patient condition will be updated to <strong>Discharged</strong>. The allocated bed will be freed in HIS, and discharge summary will sync to their lifelong health record.
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Discharge Summary & Home Care Instructions:</label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Condition stabilized, afebrile for 48 hrs. Continue Tab Cefixime 200mg BD for 5 days. Review in OPD after 1 week."
                    value={dischargeSummaryNote}
                    onChange={(e) => setDischargeSummaryNote(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDischargeModalPatient(null)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => executeDischarge(dischargeModalPatient)}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Authorize Discharge & Free Bed</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 6: MASTER-DETAIL ACTIVE CONSULTATION CHART (Default & Main Workspace) */}
      {/* ========================================================================= */}
      {(activeTab === 'consultation' || activeTab === 'ayush') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Mini Queue Panel (Quick Patient Switcher without leaving chart) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Corridor Queue</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {allQueuePatients.length} Total
                </span>
              </div>

              {/* Fast Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  placeholder="Token or Name..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:bg-white outline-none"
                />
              </form>

              {/* Patient List Cards */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {allQueuePatients.map((p) => {
                  const isSelected = p.token === selectedPatient.token;
                  return (
                    <div
                      key={p.token}
                      onClick={() => handleSelectPatient(p)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-500 shadow-2xs'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-mono text-[11px] font-black px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {p.token}
                        </span>
                        {p.triageLevel === 'emergency' && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                        {p.mode === 'ayush' && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                            AYUSH
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.chiefComplaint}</div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Main Stage: The Active Patient Clinical Chart */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* 1. STICKY PATIENT CONTEXT RIBBON (The 5-Second Rule Bar) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                
                {/* Demographics */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {selectedPatient.name ? selectedPatient.name.charAt(0) : 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">{selectedPatient.name}</h2>
                      <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                        {selectedPatient.token}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        selectedPatient.triageLevel === 'emergency'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : selectedPatient.triageLevel === 'priority'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {selectedPatient.triageLevel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{selectedPatient.age} Yrs</span>
                      <span>•</span>
                      <span>{selectedPatient.gender}</span>
                      <span>•</span>
                      <span>Ht: {selectedPatient.height}cm / Wt: {selectedPatient.weight}kg</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-teal-700 font-semibold">
                        <ShieldCheck size={12} /> ABHA: {selectedPatient.abhaId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button Cluster */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCallPatient}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    title="Play buzzer and announce patient token in corridor"
                  >
                    <Bell size={14} className="text-teal-600" />
                    <span>Call Patient</span>
                  </button>

                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
                  >
                    <Printer size={14} />
                    <span>Print Rx Slip</span>
                  </button>

                  <button
                    onClick={handleAdmitPatient}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
                  >
                    <AlertTriangle size={14} />
                    <span>Admit to IPD</span>
                  </button>

                  <button
                    onClick={handleSaveToHIS}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
                  >
                    <Save size={14} />
                    <span>Discharge / Save</span>
                  </button>
                </div>

              </div>

              {/* Critical Allergies & Chronic Conditions Strip */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                  selectedPatient.allergies.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold border border-red-200 animate-pulse"
                    >
                      <AlertTriangle size={13} className="text-red-600 shrink-0" />
                      ALLERGY: {a.allergen} ({a.reaction})
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No known drug allergies reported</span>
                )}

                {selectedPatient.chronicConditions && selectedPatient.chronicConditions.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    <HeartPulse size={12} className="text-slate-400" />
                    {c.condition} ({c.duration})
                  </span>
                ))}
              </div>

            </div>

            {/* 2. TABBED DEEP CLINICAL WORKSPACE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              
              {/* Tabs Navigation Header */}
              <div className="border-b border-slate-200 bg-slate-50/70 px-4 flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveChartTab('soap')}
                  className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeChartTab === 'soap'
                      ? 'border-teal-700 text-teal-800 bg-white shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText size={15} />
                  <span>AI Clinical Synthesis & SOAP Note</span>
                </button>

                <button
                  onClick={() => setActiveChartTab('ocr')}
                  className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeChartTab === 'ocr'
                      ? 'border-teal-700 text-teal-800 bg-white shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ExternalLink size={15} />
                  <span>OCR Document Scans & Labs ({selectedPatient.uploadedDocuments.length})</span>
                </button>

                <button
                  onClick={() => setActiveChartTab('ayush')}
                  className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeChartTab === 'ayush'
                      ? 'border-teal-700 text-teal-800 bg-white shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Leaf size={15} />
                  <span>AYUSH Dashavidha Pariksha</span>
                </button>


                <button
                  onClick={() => setActiveChartTab('history')}
                  className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeChartTab === 'history'
                      ? 'border-teal-700 text-teal-800 bg-white shadow-2xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <History size={15} />
                  <span>Past Medical History</span>
                </button>
              </div>

              {/* Tab Content 1: Interactive SOAP Note */}
              {activeChartTab === 'soap' && (
                <div className="p-6 space-y-6">
                  
                  {/* S - SUBJECTIVE */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xs">
                        S
                      </span>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                        Subjective (Chief Complaint & SOCRATES History)
                      </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
                        <span>Chief Complaint in Patient Vernacular:</span>
                        <span className="text-[10px] text-teal-600 bg-teal-100 px-2 py-0.5 rounded">Editable</span>
                      </div>
                      <textarea
                        value={selectedPatient.chiefComplaint || ''}
                        onChange={(e) => setSelectedPatient({ ...selectedPatient, chiefComplaint: e.target.value })}
                        className="w-full bg-transparent text-sm font-bold text-slate-900 border-b border-slate-300 focus:border-teal-500 outline-none resize-none"
                        rows={2}
                      />
                      {selectedPatient.chiefComplaintHi && (
                        <div className="text-xs text-slate-600 italic font-serif">"{selectedPatient.chiefComplaintHi}"</div>
                      )}
                    </div>

                    {/* SOCRATES Clinical Matrix Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Site & Location</span>
                        <input
                          type="text"
                          value={selectedPatient.symptomSite || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomSite: e.target.value })}
                          className="w-full font-semibold text-slate-900 outline-none bg-transparent"
                          placeholder="e.g. Retrosternal"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Onset / Duration</span>
                        <input
                          type="text"
                          value={selectedPatient.symptomDuration || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomDuration: e.target.value })}
                          className="w-full font-semibold text-slate-900 outline-none bg-transparent"
                          placeholder="e.g. Acute onset"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Character of Pain</span>
                        <input
                          type="text"
                          value={selectedPatient.symptomCharacter || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomCharacter: e.target.value })}
                          className="w-full font-semibold text-slate-900 outline-none bg-transparent"
                          placeholder="e.g. Crushing pressure"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Radiation</span>
                        <input
                          type="text"
                          value={selectedPatient.symptomRadiation || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomRadiation: e.target.value })}
                          className="w-full font-semibold text-slate-900 outline-none bg-transparent"
                          placeholder="e.g. Left Arm & Jaw"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Aggravating Factors</span>
                        <input
                          type="text"
                          value={selectedPatient.aggravatingFactors || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient, aggravatingFactors: e.target.value })}
                          className="w-full font-semibold text-slate-900 outline-none bg-transparent"
                          placeholder="e.g. Exertion"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Relieving Factors</span>
                        <input
                          type="text"
                          value={selectedPatient.relievingFactors || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient, relievingFactors: e.target.value })}
                          className="w-full font-semibold text-slate-900 outline-none bg-transparent"
                          placeholder="e.g. Rest"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Pain Severity (1-10)</span>
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="range"
                            min="1"
                            max="10"
                            value={selectedPatient.symptomSeverity || 7}
                            onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomSeverity: parseInt(e.target.value) })}
                            className="w-full accent-teal-600"
                          />
                          <span className="font-black text-slate-900 w-8 text-right">{selectedPatient.symptomSeverity || 7}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Associated Symptoms Pills */}
                    {selectedPatient.associatedSymptoms && selectedPatient.associatedSymptoms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-slate-500 text-[11px]">Associated Symptoms:</span>
                        {selectedPatient.associatedSymptoms.map((symp, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-medium border border-slate-200">
                            {symp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* O - OBJECTIVE */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                        O
                      </span>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                        Objective (OCR Extracted Labs & Prescriptions)
                      </h3>
                    </div>

                    {/* Highlights from Past Reports */}
                    {selectedPatient.uploadedDocuments && selectedPatient.uploadedDocuments.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPatient.uploadedDocuments.map((doc) => (
                          <div key={doc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="font-bold text-slate-900">{doc.name}</span>
                              <span className="text-slate-500 font-mono">{doc.date}</span>
                            </div>

                            {doc.extractedLabs && doc.extractedLabs.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                {doc.extractedLabs.map((lab, i) => (
                                  <div
                                    key={i}
                                    className={`p-2 rounded-lg border text-xs ${
                                      lab.isOutOfRange
                                        ? 'bg-red-50 border-red-200 text-red-900'
                                        : 'bg-white border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    <div className="font-semibold">{lab.test}</div>
                                    <div className="font-black text-sm">
                                      {lab.value} {lab.unit}
                                      {lab.isOutOfRange && (
                                        <span className="ml-1 text-[10px] uppercase font-bold text-red-600 bg-red-100 px-1 rounded">
                                          Abnormal
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500">Normal: {lab.range}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 italic">
                        No previous lab reports scanned.
                      </div>
                    )}
                  </div>

                  {/* A - ASSESSMENT */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                        A
                      </span>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                        Assessment & AI Differential Triage
                      </h3>
                    </div>

                    {/* Red Flags Alert Box */}
                    {selectedPatient.redFlags && selectedPatient.redFlags.length > 0 && (
                      <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 space-y-2">
                        <div className="text-xs font-bold text-red-900 flex items-center gap-1.5 uppercase">
                          <AlertTriangle size={15} className="text-red-600 animate-pulse" />
                          Red Flag Safety Warnings Triggered
                        </div>
                        {selectedPatient.redFlags.map((flag, idx) => (
                          <div key={idx} className="text-xs font-semibold text-red-800 pl-4 border-l-2 border-red-400">
                            {flag}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Provisional Workup */}
                    {selectedPatient.structuredSummary?.suggestedWorkup && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-700 block mb-1.5">Recommended Workup (AI Provisional):</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {selectedPatient.structuredSummary.suggestedWorkup.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* P - PLAN & INTERACTIVE RX ORDER PAD */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                          P
                        </span>
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                          Plan & Electronic Prescription (Rx Pad)
                        </h3>
                      </div>

                      {/* 1-Click Protocol Order Sets */}
                      <div className={`flex items-center gap-1 text-[11px] ${selectedPatient.status !== 'in_consultation' ? 'opacity-30 pointer-events-none' : ''}`}>
                        <span className="text-slate-400 font-semibold mr-1">1-Click Order Sets:</span>
                        <button
                          onClick={() => handleApplyOrderSet('cardiac')}
                          className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold hover:bg-red-200 transition-colors"
                        >
                          ACS Protocol
                        </button>
                        <button
                          onClick={() => handleApplyOrderSet('amlapitta')}
                          className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200 transition-colors"
                        >
                          Amlapitta Set
                        </button>
                        <button
                          onClick={() => handleApplyOrderSet('diabetes')}
                          className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold hover:bg-blue-200 transition-colors"
                        >
                          T2DM Set
                        </button>
                      </div>
                    </div>

                    {/* Active Prescribed Meds Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden relative">
                      {selectedPatient.status !== 'in_consultation' && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                          <p className="text-slate-800 font-bold text-sm mb-2 shadow-sm bg-white px-4 py-2 rounded-xl border border-slate-200">
                            Call Patient to unlock Prescription Pad
                          </p>
                          <button 
                            onClick={handleCallPatient}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-teal-700 transition-colors"
                          >
                            <Bell size={12} /> Call Patient Now
                          </button>
                        </div>
                      )}
                      
                      <div className={selectedPatient.status !== 'in_consultation' ? 'opacity-30 pointer-events-none grayscale' : ''}>
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                            <tr>
                              <th className="p-2.5">Medicine Name</th>
                              <th className="p-2.5">Dose</th>
                              <th className="p-2.5">Frequency</th>
                              <th className="p-2.5">Duration</th>
                              <th className="p-2.5">Instructions</th>
                              <th className="p-2.5 text-right">Remove</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {prescribedMeds.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="p-4 text-center text-slate-400 italic">No medications prescribed yet.</td>
                              </tr>
                            ) : (
                              prescribedMeds.map((med, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-bold text-slate-900">{med.name}</td>
                                  <td className="p-2.5 text-slate-700">{med.dose}</td>
                                  <td className="p-2.5 font-semibold text-teal-700">{med.frequency}</td>
                                  <td className="p-2.5 text-slate-700">{med.duration}</td>
                                  <td className="p-2.5 text-slate-600 italic">{med.instructions}</td>
                                  <td className="p-2.5 text-right">
                                    <button
                                      onClick={() => handleRemoveMed(idx)}
                                      className="text-red-400 hover:text-red-600 p-1"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add Medicine Mini Form */}
                    <form onSubmit={handleAddMedication} className={`p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs transition-opacity ${selectedPatient.status !== 'in_consultation' ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                      <input
                        type="text"
                        placeholder="Drug Name (e.g. Paracetamol)"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        className="sm:col-span-3 px-3 py-1.5 bg-white rounded-lg border border-slate-200 outline-none font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Dose (e.g. 650 mg)"
                        value={newMedDose}
                        onChange={(e) => handleDoseChange(e.target.value)}
                        className="sm:col-span-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 outline-none"
                      />
                      <select
                        value={newMedFreq}
                        onChange={(e) => handleFreqChange(e.target.value)}
                        className="sm:col-span-2 px-2 py-1.5 bg-white rounded-lg border border-slate-200 outline-none font-semibold text-teal-800"
                      >
                        <option value="1-0-0">1-0-0 (Morning)</option>
                        <option value="1-0-1">1-0-1 (BD)</option>
                        <option value="1-1-1">1-1-1 (TDS)</option>
                        <option value="0-0-1">0-0-1 (Night)</option>
                        <option value="SOS">SOS (When needed)</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Duration (e.g. 5 Days)"
                        value={newMedDuration}
                        onChange={(e) => setNewMedDuration(e.target.value)}
                        className="sm:col-span-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 outline-none"
                      />
                      <select
                        value={newMedInstructions}
                        onChange={(e) => handleInstructionsChange(e.target.value)}
                        className="sm:col-span-2 px-2 py-1.5 bg-white rounded-lg border border-slate-200 outline-none font-medium"
                      >
                        <option value="After food">After food</option>
                        <option value="Before food">Before food</option>
                        <option value="Empty stomach">Empty stomach</option>
                        <option value="With warm water">With warm water</option>
                        <option value="Before sleep">Before sleep</option>
                        <option value="Immediately after food">Immediately after food</option>
                        <option value="With milk">With milk</option>
                        <option value="SOS (If pain/fever)">SOS (If pain/fever)</option>
                        <option value="As directed">As directed</option>
                      </select>
                      <button
                        type="submit"
                        className="sm:col-span-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </form>

                    {/* Doctor Clinical Notes / Advice */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Doctor Clinical Impressions & Patient Advice:
                      </label>
                      <textarea
                        rows={3}
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        placeholder="Type clinical advice, dietary modifications, follow-up instructions..."
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none leading-relaxed"
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* Tab Content 2: OCR Document Scans */}
              {activeChartTab === 'ocr' && (
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Scanned Historical Prescriptions & Lab Records</h3>
                  <p className="text-xs text-slate-500">AI extracts diagnosis entities, dosage schedules, and highlights abnormal values</p>
                  
                  {selectedPatient.uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{doc.name}</span>
                        <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border">
                          {doc.date}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <strong>Diagnoses Detected: </strong> {doc.extractedDiagnoses.join(', ') || 'General Review'}
                      </div>
                      {doc.extractedLabs.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-700">Digitized Lab Parameters:</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {doc.extractedLabs.map((l, idx) => (
                              <div key={idx} className="p-2 bg-white rounded-lg border text-xs">
                                <div className="font-semibold text-slate-700">{l.test}</div>
                                <div className="text-sm font-black">{l.value} {l.unit}</div>
                                <div className="text-[10px] text-slate-400">Normal Range: {l.range}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Content 3: AYUSH Pariksha */}
              {activeChartTab === 'ayush' && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Leaf size={18} className="text-emerald-600" />
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase">AYUSH Dashavidha Pariksha Profile</h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Ayurvedic Integrative Desk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Deha Prakriti (Constitution)</span>
                      <span className="text-sm font-black text-emerald-950">{selectedPatient.prakriti || 'Vata-Pitta'}</span>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Predominant Pitta dosha indicates inflammatory and hyper-acidic vulnerability.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">Jatharagni (Digestive Fire)</span>
                      <span className="text-sm font-black text-amber-950">{selectedPatient.agni || 'Tikshnagni (Sharp/Burning)'}</span>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Correlates with rapid gastric burning, sour regurgitation, and hyperchlorhydria.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Koshtha (Bowel Regularity)</span>
                      <span className="text-sm font-black text-slate-900">{selectedPatient.koshtha || 'Krura (Constipation Tendency)'}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Nidra (Sleep Pattern)</span>
                      <span className="text-sm font-black text-slate-900">{selectedPatient.nidra || 'Alpa Nidra (< 6 hrs, disturbed)'}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block">Ahara & Vihara (Dietary & Lifestyle Stressors):</span>
                    <p className="text-slate-600">{selectedPatient.aharaVihara || 'Spicy, irregular meals with heavy tea consumption'}</p>
                  </div>
                </div>
              )}


              {/* Tab Content 5: Past Medical History */}
              {activeChartTab === 'history' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xs">
                      H
                    </span>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                      Comprehensive Past Medical History
                    </h3>
                  </div>
                  
                  {(() => {
                    // Try to find the patient's full global profile
                    const profileKey = Object.keys(mockProfiles).find(
                      k => mockProfiles[k].name === selectedPatient.name || mockProfiles[k].abhaId === selectedPatient.abhaId
                    );
                    const globalProfile = profileKey ? mockProfiles[profileKey] : null;

                    if (!globalProfile || !globalProfile.pastVisits || globalProfile.pastVisits.length === 0) {
                      return (
                        <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                          No previous history found for this patient in the network.
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        {globalProfile.pastVisits.map((visit, idx) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                              <History size={16} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-teal-300 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                  {visit.date}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  {visit.hospital}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm mb-1">{visit.diagnosis || 'General Consultation'}</h4>
                              <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <span className="font-semibold block mb-1">Chief Complaint:</span> "{visit.reason}"
                              </p>
                              
                              {visit.doctorNotesHidden && (
                                <div className="mb-3">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Private Clinical Notes (Hidden from pt)</span>
                                  <p className="text-xs text-slate-700 italic border-l-2 border-amber-400 pl-2">
                                    {visit.doctorNotesHidden}
                                  </p>
                                </div>
                              )}

                              {visit.prescriptions && visit.prescriptions.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prescribed</span>
                                  <div className="flex flex-wrap gap-1">
                                    {visit.prescriptions.map((px, pIdx) => (
                                      <span key={pIdx} className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                                        {px}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* OPD Prescription Print Modal */}
      {showPrescriptionModal && (
        <OPDPrescriptionModal
          patient={selectedPatient}
          doctorNotes={doctorNotes}
          prescribedMeds={prescribedMeds}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}

    </div>
  );
}
