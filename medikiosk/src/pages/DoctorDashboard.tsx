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
  Stethoscope,
  Eye,
  Upload,
  Calendar,
  Paperclip
} from 'lucide-react';
import { usePatientStore, mockDatabase, mockProfiles, type PatientData, type IpdMedication, type IpdProgressNote, type UploadedDocument, syncPatientToSupabase } from '../store/usePatientStore';
import type { DoctorOutletContext } from '../components/DoctorLayout';
import OPDPrescriptionModal from '../components/OPDPrescriptionModal';
import DocumentViewerModal from '../components/DocumentViewerModal';
import { getEsiMetadata, calculateRuleBasedEsi, type EsiTriageResult } from '../services/clinicalAiService';

interface PrescribedMedItem {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export function getWaitSeconds(p: PatientData): number {
  if (!p) return 0;

  if (!p.createdTimestamp) {
    if (p.createdAt) {
      const match = p.createdAt.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const meridiem = match[3]?.toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;

        const now = new Date();
        const tokenDate = new Date();
        tokenDate.setHours(hours, minutes, 0, 0);

        let diffSec = Math.floor((now.getTime() - tokenDate.getTime()) / 1000);
        if (diffSec < 0) diffSec += 24 * 3600;

        // If more than 2 hours elapsed, scale into a realistic active OPD wait offset
        if (diffSec > 7200) {
          const charCodeSum = p.token.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
          diffSec = ((charCodeSum % 35) + 12) * 60;
        }
        p.createdTimestamp = Date.now() - diffSec * 1000;
      } else {
        p.createdTimestamp = Date.now() - 15 * 60 * 1000;
      }
    } else {
      p.createdTimestamp = Date.now() - 15 * 60 * 1000;
    }
  }

  const elapsed = Math.floor((Date.now() - p.createdTimestamp) / 1000);
  return Math.max(0, elapsed);
}

export function getWaitMinutes(p: PatientData): number {
  return Math.floor(getWaitSeconds(p) / 60);
}

export function formatWaitTime(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds}s wait`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins < 60) {
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s wait`;
  }
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hrs}h ${remainingMins}m wait`;
}

export default function DoctorDashboard() {
  const { activeTab, setActiveTab } = useOutletContext<DoctorOutletContext>() || {
    activeTab: 'consultation',
    setActiveTab: () => {},
  };

  const { currentPatient, initSocket, clearQueue, addDocumentToPatient } = usePatientStore();
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

  // Live real-time ticker: re-renders every 1 second so wait times tick live without page refresh
  const [, setLiveTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeChartTab, setActiveChartTab] = useState<'soap' | 'ocr' | 'ayush' | 'history'>('soap');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [queueFilter, setQueueFilter] = useState<'all' | 'emergency' | 'ayush' | 'waiting' | 'relieved'>('all');
  const [sortBy, setSortBy] = useState<'longest_wait' | 'newest' | 'acuity'>('longest_wait');
  const [viewingDoc, setViewingDoc] = useState<UploadedDocument | null>(null);

  // Feature 4D: Automated Emergency Severity Index (ESI) Triage State
  const [showEsiOverride, setShowEsiOverride] = useState(false);
  const [overrideEsiLevel, setOverrideEsiLevel] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [overrideEsiReason, setOverrideEsiReason] = useState('');

  // Active patient ESI acuity (uses saved result or calculates rule-based fallback)
  const activeEsi = selectedPatient.esiTriage || calculateRuleBasedEsi(selectedPatient);

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

  // Doctor Upload Document & Diagnostic Report State
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string>('');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocType, setUploadDocType] = useState<'Prescription' | 'Lab Report' | 'Discharge Summary' | 'ECG / Radiology' | 'Bedside Scan'>('Lab Report');
  const [uploadDocDate, setUploadDocDate] = useState(() =>
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  const [uploadDocNotes, setUploadDocNotes] = useState('');
  const [uploadDiagnoses, setUploadDiagnoses] = useState('');
  const [uploadTestName, setUploadTestName] = useState('');
  const [uploadTestValue, setUploadTestValue] = useState('');
  const [uploadTestUnit, setUploadTestUnit] = useState('');
  const [uploadTestRange, setUploadTestRange] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadDocFile(file);
      if (!uploadDocName) {
        setUploadDocName(file.name);
      }
      const reader = new FileReader();
      reader.onload = () => {
        setUploadPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetDocUploadForm = () => {
    setUploadDocFile(null);
    setUploadPreviewUrl('');
    setUploadDocName('');
    setUploadDocType('Lab Report');
    setUploadDocDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
    setUploadDocNotes('');
    setUploadDiagnoses('');
    setUploadTestName('');
    setUploadTestValue('');
    setUploadTestUnit('');
    setUploadTestRange('');
    setIsUploadingDoc(false);
    setShowDocUploadModal(false);
  };

  const handleDoctorSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingDoc(true);

    const docTitle = uploadDocName.trim() || uploadDocFile?.name || `${uploadDocType}_${selectedPatient.token}`;
    const docDate = uploadDocDate.trim() || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const labs = uploadTestName.trim() ? [{
      test: uploadTestName.trim(),
      value: uploadTestValue.trim() || 'Recorded',
      unit: uploadTestUnit.trim(),
      range: uploadTestRange.trim() || 'Normal',
      isOutOfRange: false
    }] : [];

    const diagnoses = uploadDiagnoses.trim()
      ? uploadDiagnoses.split(',').map(d => d.trim()).filter(Boolean)
      : [];

    const newDoc: UploadedDocument = {
      id: 'doc-' + Date.now(),
      name: docTitle,
      type: uploadDocType,
      date: docDate,
      timestamp: Date.now(),
      uploadedBy: 'doctor',
      fileUrl: uploadPreviewUrl || undefined,
      isHandwritten: false,
      ocrStatus: 'complete',
      notes: uploadDocNotes.trim() || 'Uploaded directly during clinical consultation by attending physician.',
      extractedDiagnoses: diagnoses,
      extractedMeds: [],
      extractedLabs: labs
    };

    addDocumentToPatient(selectedPatient.token, newDoc);

    const updatedPatient: PatientData = {
      ...selectedPatient,
      uploadedDocuments: [newDoc, ...(selectedPatient.uploadedDocuments || [])]
    };
    setSelectedPatient(updatedPatient);

    setStatusMessage(`✅ Document "${newDoc.name}" uploaded & linked to ${selectedPatient.name} with date ${newDoc.date}.`);
    setTimeout(() => setStatusMessage(''), 4000);

    resetDocUploadForm();
  };

  // Apply ESI immediate orders to clinical notes and prescription
  const handleApplyEsiOrders = () => {
    const ordersList = activeEsi.immediateActions || [];
    if (ordersList.length === 0) return;

    const ordersText = `\n[ESI LEVEL ${activeEsi.level} ORDERS]:\n` + ordersList.map((o) => `• ${o}`).join('\n');
    setDoctorNotes((prev) => `${prev.trim()}\n${ordersText}`.trim());

    if (activeEsi.level === 1 || selectedPatient.chiefComplaint?.toLowerCase().includes('chest')) {
      handleApplyOrderSet('cardiac');
    }

    setStatusMessage(`✅ ESI Level ${activeEsi.level} orders added to consultation chart.`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  // Physician override of ESI Triage Level
  const handleConfirmEsiOverride = () => {
    const meta = getEsiMetadata(overrideEsiLevel);
    const updatedEsi: EsiTriageResult = {
      level: overrideEsiLevel,
      category: meta.category,
      color: meta.color,
      badgeBg: meta.badgeBg,
      badgeText: meta.badgeText,
      badgeBorder: meta.badgeBorder,
      rationale: `Physician Override: ${overrideEsiReason || 'Direct bedside examination'}. (Prior: ESI Level ${activeEsi.level})`,
      immediateActions: activeEsi.immediateActions,
      predictedResources: activeEsi.predictedResources,
      algorithmSource: activeEsi.algorithmSource
    };

    const newTriageLevel = overrideEsiLevel <= 2 ? 'emergency' : overrideEsiLevel === 3 ? 'priority' : 'normal';
    const updatedPatient: PatientData = {
      ...selectedPatient,
      esiTriage: updatedEsi,
      triageLevel: newTriageLevel,
      doctorNotes: `${doctorNotes.trim()}\n[ESI OVERRIDE]: Reclassified to Level ${overrideEsiLevel} (${meta.category}) by Attending Physician. Reason: ${overrideEsiReason || 'Clinical assessment'}`.trim()
    };

    setSelectedPatient(updatedPatient);
    if (mockDatabase[updatedPatient.token]) {
      mockDatabase[updatedPatient.token] = updatedPatient;
    }
    syncPatientToSupabase(updatedPatient);
    setShowEsiOverride(false);
    setOverrideEsiReason('');
    setStatusMessage(`✅ Acuity updated to ESI Level ${overrideEsiLevel} (${meta.category}).`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

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
    const updated: PatientData = {
      ...selectedPatient,
      status: 'accepted',
      doctorNotes
    };
    if (mockDatabase[updated.token]) {
      mockDatabase[updated.token] = updated;
    }
    syncToProfileVisit(updated, prescribedMeds, doctorNotes, '(Discharged/Outpatient)');
    syncPatientToSupabase(updated);
    usePatientStore.getState().triggerQueueUpdate();

    // Automatically advance to the next active patient in queue
    const remainingActive = Object.values(mockDatabase).filter(
      p => p.token !== updated.token && p.status !== 'accepted' && p.status !== 'admitted'
    );
    if (remainingActive.length > 0) {
      handleSelectPatient(remainingActive[0]);
    }

    setStatusMessage(`Patient ${updated.name} (Token: ${updated.token}) marked OPD Done & Relieved.`);
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
  const activeQueuePatients = allQueuePatients.filter((p) => p.status !== 'accepted' && p.status !== 'admitted');
  const relievedPatients = allQueuePatients.filter((p) => p.status === 'accepted');

  const filteredQueue = allQueuePatients.filter((p) => {
    if (queueFilter === 'emergency') return p.triageLevel === 'emergency' && p.status !== 'accepted';
    if (queueFilter === 'ayush') return p.mode === 'ayush' && p.status !== 'accepted';
    if (queueFilter === 'waiting') return p.status === 'waiting';
    if (queueFilter === 'relieved') return p.status === 'accepted';
    return p.status !== 'accepted';
  });

  const sortPatients = (patients: PatientData[]) => {
    return [...patients].sort((a, b) => {
      if (sortBy === 'longest_wait') {
        return getWaitMinutes(b) - getWaitMinutes(a);
      }
      if (sortBy === 'newest') {
        return getWaitMinutes(a) - getWaitMinutes(b);
      }
      if (sortBy === 'acuity') {
        const aLevel = a.esiTriage?.level || (a.triageLevel === 'emergency' ? 1 : 4);
        const bLevel = b.esiTriage?.level || (b.triageLevel === 'emergency' ? 1 : 4);
        return aLevel - bLevel;
      }
      return 0;
    });
  };

  const sortedActivePatients = sortPatients(activeQueuePatients);
  const sortedFilteredQueue = sortPatients(filteredQueue);

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Waiting Hall</div>
          <div className="text-xl font-black text-blue-600 mt-0.5">{allQueuePatients.filter(p => p.status === 'waiting').length} <span className="text-[11px] font-normal text-slate-400">Waiting</span></div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Critical Red-Flags
          </div>
          <div className="text-xl font-black text-red-600 mt-0.5">
            {activeQueuePatients.filter(p => p.triageLevel === 'emergency').length} <span className="text-[11px] font-normal text-slate-400">High Risk</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Ward / IPD</div>
          <div className="text-xl font-black text-amber-600 mt-0.5">{allQueuePatients.filter(p => p.status === 'admitted').length} <span className="text-[11px] font-normal text-slate-400">Admitted</span></div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">OPD Done / Relieved</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{relievedPatients.length} <span className="text-[11px] font-normal text-slate-400">Relieved</span></div>
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

            {/* Filter Tabs and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all demo patients from the queue and cloud database?")) {
                    clearQueue();
                    window.location.reload();
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-2xs flex items-center gap-1.5 border border-red-200"
              >
                <Trash2 size={13} /> Clear Demo Queue
              </button>
              
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setQueueFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    queueFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Active Queue ({activeQueuePatients.length})
                </button>
                <button
                  onClick={() => setQueueFilter('emergency')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    queueFilter === 'emergency' ? 'bg-red-600 text-white shadow-2xs' : 'text-red-700'
                  }`}
                >
                  🚨 Emergency ({activeQueuePatients.filter(p => p.triageLevel === 'emergency').length})
                </button>
                <button
                  onClick={() => setQueueFilter('ayush')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    queueFilter === 'ayush' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700'
                  }`}
                >
                  🌿 AYUSH ({activeQueuePatients.filter(p => p.mode === 'ayush').length})
                </button>
                <button
                  onClick={() => setQueueFilter('waiting')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    queueFilter === 'waiting' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Waiting ({allQueuePatients.filter(p => p.status === 'waiting').length})
                </button>
                <button
                  onClick={() => setQueueFilter('relieved')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    queueFilter === 'relieved' ? 'bg-teal-700 text-white shadow-2xs' : 'text-teal-700'
                  }`}
                >
                  Relieved ({relievedPatients.length})
                </button>
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <span className="text-slate-500 pl-2 flex items-center gap-1">
                  <Clock size={12} className="text-teal-700" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 px-2.5 py-1.5 outline-none cursor-pointer focus:ring-1 focus:ring-teal-500 shadow-2xs"
                >
                  <option value="longest_wait">⏱️ Longest Waiting First (FIFO)</option>
                  <option value="newest">⚡ Newest Tokens First</option>
                  <option value="acuity">🚨 Acuity Priority (ESI 1-5)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Token, Time & Wait</th>
                  <th className="p-4">Patient Demographics</th>
                  <th className="p-4">Chief Complaint & Red Flags</th>
                  <th className="p-4">Triage Priority</th>
                  <th className="p-4">Care Mode</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedFilteredQueue.map((p) => {
                  const waitSecs = getWaitSeconds(p);
                  return (
                    <tr
                      key={p.token}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        p.token === selectedPatient.token ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <td className="p-4 font-mono">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                            {p.token}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border ${
                            waitSecs >= 30 * 60
                              ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                              : waitSecs >= 15 * 60
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            <Clock size={10} />
                            {formatWaitTime(waitSecs)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-sans">Issued: {p.createdAt || '09:30 AM'}</div>
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
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase w-fit ${
                          p.triageLevel === 'emergency'
                            ? 'bg-red-100 text-red-700 animate-pulse'
                            : p.triageLevel === 'priority'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.triageLevel === 'emergency' && <Zap size={10} />}
                          {p.triageLevel}
                        </span>
                        {p.esiTriage && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border w-fit ${p.esiTriage.badgeBg} ${p.esiTriage.badgeText} ${p.esiTriage.badgeBorder}`}>
                            ESI-{p.esiTriage.level} ({p.esiTriage.category})
                          </span>
                        )}
                      </div>
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
                );
              })}
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
                <p className="text-xs text-slate-500">Immediate clinical alerts flagged by MediKiosk Intake System</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs uppercase animate-pulse">
              Level 1 / 2 Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQueuePatients.filter(p => p.triageLevel === 'emergency').length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-dashed border-emerald-200 rounded-2xl space-y-2">
                <ShieldCheck size={32} className="mx-auto text-emerald-600" />
                <h4 className="font-bold text-slate-800 text-sm">Emergency Bay All Clear</h4>
                <p className="text-xs text-slate-500">No active high-acuity emergency cases pending triage.</p>
              </div>
            ) : (
              activeQueuePatients.filter(p => p.triageLevel === 'emergency').map((p) => (
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
              ))
            )}
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
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Corridor Queue</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {activeQueuePatients.length} Active
                </span>
              </div>

              {/* Mini Sort Toggle */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1 mb-2.5 text-[11px]">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Clock size={11} className="text-teal-700" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-[11px]"
                >
                  <option value="longest_wait">⏱️ Wait Time (FIFO)</option>
                  <option value="newest">⚡ Newest First</option>
                  <option value="acuity">🚨 Acuity (ESI)</option>
                </select>
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
                {sortedActivePatients.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-1.5 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Check size={18} className="mx-auto text-emerald-600" />
                    <p className="text-xs font-bold text-slate-700">Queue Clear</p>
                    <p className="text-[10px] text-slate-400">All registered patients have been relieved.</p>
                  </div>
                ) : (
                  sortedActivePatients.map((p) => {
                    const isSelected = p.token === selectedPatient.token;
                    const waitSecs = getWaitSeconds(p);
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
                          <div className="flex items-center gap-1">
                            {p.esiTriage && (
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${p.esiTriage.badgeBg} ${p.esiTriage.badgeText} ${p.esiTriage.badgeBorder}`}>
                                ESI-{p.esiTriage.level}
                              </span>
                            )}
                            {p.triageLevel === 'emergency' && !p.esiTriage && (
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
                        </div>
                        <div className="font-bold text-xs text-slate-900 truncate">{p.name}</div>
                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="text-slate-500 line-clamp-1 flex-1 pr-2">{p.chiefComplaint}</span>
                          <span className={`text-[10px] font-mono font-bold shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded border ${
                            waitSecs >= 30 * 60
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : waitSecs >= 15 * 60
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            <Clock size={10} />
                            {formatWaitTime(waitSecs)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
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
                      
                      {/* Feature 4D: ESI Triage Ribbon Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 shadow-2xs ${
                          activeEsi.level === 1
                            ? 'bg-red-500/15 text-red-700 border-red-500/30 animate-pulse'
                            : activeEsi.level === 2
                            ? 'bg-orange-500/15 text-orange-700 border-orange-500/30'
                            : activeEsi.level === 3
                            ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                            : activeEsi.level === 4
                            ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                            : 'bg-blue-500/15 text-blue-700 border-blue-500/30'
                        }`}
                      >
                        <Zap size={11} className={activeEsi.level <= 2 ? 'text-red-600' : 'text-slate-500'} />
                        ESI Level {activeEsi.level}: {activeEsi.category}
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
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Clock size={12} className="text-teal-600" />
                        <span className="font-mono font-bold text-slate-800">{formatWaitTime(getWaitSeconds(selectedPatient))}</span>
                        <span className="text-[10px] text-slate-400">({selectedPatient.createdAt || '09:30 AM'})</span>
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
                    <span>OPD Done / Relieved</span>
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
                  <span>Clinical Synthesis & SOAP Note</span>
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

                {(selectedPatient.mode === 'ayush' || (selectedPatient.consentAyush && (Boolean(selectedPatient.prakriti) || Boolean(selectedPatient.ayushResponses?.length)))) && (
                  <button
                    onClick={() => setActiveChartTab('ayush')}
                    className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                      activeChartTab === 'ayush'
                        ? 'border-emerald-700 text-emerald-800 bg-white shadow-2xs'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Leaf size={15} className="text-emerald-600" />
                    <span>AYUSH Integrative Pariksha</span>
                  </button>
                )}


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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                          <span className="text-teal-600 font-extrabold">SOCRATES Protocol:</span>
                          <span>[S]ite • [O]nset • [C]haracter • [R]adiation • [A]ssociations • [T]iming • [E]xacerbating • [S]everity</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Standard Clinical History</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            <span className="text-teal-700 font-black mr-1">[S]</span>Site & Location
                          </span>
                          <textarea value={selectedPatient.symptomSite || ''} onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomSite: e.target.value })} className="w-full font-semibold text-slate-900 outline-none bg-transparent resize-none leading-snug py-1" rows={2} placeholder="e.g. Retrosternal" />
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            <span className="text-teal-700 font-black mr-1">[O]</span>Onset & Duration
                          </span>
                          <textarea value={selectedPatient.symptomDuration || ''} onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomDuration: e.target.value })} className="w-full font-semibold text-slate-900 outline-none bg-transparent resize-none leading-snug py-1" rows={2} placeholder="e.g. Sudden / 45 mins ago" />
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            <span className="text-teal-700 font-black mr-1">[C]</span>Character / Nature
                          </span>
                          <textarea value={selectedPatient.symptomCharacter || ''} onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomCharacter: e.target.value })} className="w-full font-semibold text-slate-900 outline-none bg-transparent resize-none leading-snug py-1" rows={2} placeholder="e.g. Crushing, burning, stabbing" />
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            <span className="text-teal-700 font-black mr-1">[R]</span>Radiation
                          </span>
                          <textarea value={selectedPatient.symptomRadiation || ''} onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomRadiation: e.target.value })} className="w-full font-semibold text-slate-900 outline-none bg-transparent resize-none leading-snug py-1" rows={2} placeholder="e.g. Left arm, jaw, none" />
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            <span className="text-teal-700 font-black mr-1">[T]</span>Timing / Course
                          </span>
                          <textarea value={selectedPatient.symptomTiming || ''} onChange={(e) => setSelectedPatient({ ...selectedPatient, symptomTiming: e.target.value })} className="w-full font-semibold text-slate-900 outline-none bg-transparent resize-none leading-snug py-1" rows={2} placeholder="e.g. Constant, episodic waves" />
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            <span className="text-teal-700 font-black mr-1">[E+]</span>Aggravating Factors
                          </span>
                          <textarea value={selectedPatient.aggravatingFactors || ''} onChange={(e) => setSelectedPatient({ ...selectedPatient, aggravatingFactors: e.target.value })} className="w-full font-semibold text-slate-900 outline-none bg-transparent resize-none leading-snug py-1" rows={2} placeholder="e.g. Exertion, food" />
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            <span className="text-teal-700 font-black mr-1">[E-]</span>Relieving Factors
                          </span>
                          <textarea value={selectedPatient.relievingFactors || ''} onChange={(e) => setSelectedPatient({ ...selectedPatient, relievingFactors: e.target.value })} className="w-full font-semibold text-slate-900 outline-none bg-transparent resize-none leading-snug py-1" rows={2} placeholder="e.g. Rest, antacid" />
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            <span className="text-teal-700 font-black mr-1">[S]</span>Severity (1-10)
                          </span>
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

                    {/* Targeted Intake Q&A / Follow-up Responses */}
                    {selectedPatient.adaptiveAnswers && Object.keys(selectedPatient.adaptiveAnswers).length > 0 && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={12} className="text-blue-600" />
                            Clinical Intake Q&A (Follow-up Responses)
                          </span>
                          <span className="text-[10px] text-blue-700 font-semibold bg-white px-2 py-0.5 rounded border border-blue-100">
                            Patient Verified
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(selectedPatient.adaptiveAnswers).map(([_qKey, ans], idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-lg border border-blue-100/80 shadow-2xs">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase mb-0.5">Question Item {idx + 1}</span>
                              <span className="font-bold text-slate-800 text-xs">{ans}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* O - OBJECTIVE */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                          O
                        </span>
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                          Objective (Scans, Labs & Clinical Reports)
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDocUploadModal(true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
                        title="Upload fresh lab report, bedside ECG, or scan"
                      >
                        <Paperclip size={13} />
                        <span>Attach Report / ECG</span>
                      </button>
                    </div>

                    {/* Highlights from Past Reports */}
                    {selectedPatient.uploadedDocuments && selectedPatient.uploadedDocuments.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPatient.uploadedDocuments.map((doc) => (
                          <div key={doc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{doc.name}</span>
                                {doc.uploadedBy === 'doctor' && (
                                  <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                                    <Stethoscope size={10} className="text-purple-600" />
                                    Doctor Uploaded
                                  </span>
                                )}
                                {doc.isHandwritten && (
                                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                                    Handwritten Scan
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-mono text-[11px]">{doc.date}</span>
                                <button
                                  type="button"
                                  onClick={() => setViewingDoc(doc)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors shadow-xs cursor-pointer"
                                  title="View original scanned prescription/report image"
                                >
                                  <Eye size={12} className="text-blue-600" />
                                  <span>View Original Scan</span>
                                </button>
                              </div>
                            </div>

                            {/* If bypassed / handwritten notice when neither labs nor meds were digitizable */}
                            {(!doc.extractedLabs || doc.extractedLabs.length === 0) && (!doc.extractedMeds || doc.extractedMeds.length === 0) && (
                              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                                <span className="text-[11px]">
                                  {doc.isHandwritten
                                    ? 'Cursive handwriting bypassed directly to doctor inspection for bedside safety.'
                                    : 'Original scanned document available for verification.'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setViewingDoc(doc)}
                                  className="text-[11px] font-bold text-amber-900 underline hover:text-amber-950 flex items-center gap-1"
                                >
                                  Open Lightbox &rarr;
                                </button>
                              </div>
                            )}

                            {/* Extracted Labs if present */}
                            {doc.extractedLabs && doc.extractedLabs.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

                            {/* Extracted Medications if present */}
                            {doc.extractedMeds && doc.extractedMeds.length > 0 && (
                              <div className="pt-1 border-t border-slate-200/60">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                  Prior Scanned Medications
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {doc.extractedMeds.map((med, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-800">
                                      <span className="font-bold">{med.name}</span>
                                      <span className="text-slate-500 font-mono text-[10px]">({med.dose} • {med.frequency})</span>
                                    </span>
                                  ))}
                                </div>
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
                        Assessment & Differential Triage
                      </h3>
                    </div>

                    {/* Feature 4D: Automated Emergency Severity Index (ESI) Clinical Decision Support Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                      
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs ${
                              activeEsi.level === 1
                                ? 'bg-red-600 animate-pulse'
                                : activeEsi.level === 2
                                ? 'bg-orange-500'
                                : activeEsi.level === 3
                                ? 'bg-amber-500'
                                : activeEsi.level === 4
                                ? 'bg-emerald-600'
                                : 'bg-blue-600'
                            }`}
                          >
                            {activeEsi.level}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                ESI Level {activeEsi.level} — {activeEsi.category}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500">Emergency Severity Index 5-Tier Acuity Protocol</p>
                          </div>
                        </div>

                        {/* Override Toggle Button */}
                        <button
                          type="button"
                          onClick={() => setShowEsiOverride(!showEsiOverride)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          {showEsiOverride ? 'Close Override' : '⚙️ Triage Override'}
                        </button>
                      </div>

                      {/* Doctor Override Drawer */}
                      {showEsiOverride && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2.5 animate-fade-in text-xs">
                          <div className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                            <AlertTriangle size={13} className="text-amber-700" />
                            Physician Clinical Acuity Override
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">New ESI Level:</label>
                              <select
                                value={overrideEsiLevel}
                                onChange={(e) => setOverrideEsiLevel(Number(e.target.value) as any)}
                                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold text-xs outline-none"
                              >
                                <option value={1}>ESI Level 1 — Resuscitation (Life-threat)</option>
                                <option value={2}>ESI Level 2 — Emergent (High-risk)</option>
                                <option value={3}>ESI Level 3 — Urgent (Multi-resource)</option>
                                <option value={4}>ESI Level 4 — Less Urgent (Single-resource)</option>
                                <option value={5}>ESI Level 5 — Non-Urgent (Zero resource)</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">Clinical Override Justification:</label>
                              <input
                                type="text"
                                placeholder="E.g. Hemodynamically stable upon direct exam..."
                                value={overrideEsiReason}
                                onChange={(e) => setOverrideEsiReason(e.target.value)}
                                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowEsiOverride(false)}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmEsiOverride}
                              className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold shadow-2xs"
                            >
                              Confirm Triage Override
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Clinical Rationale */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                        <span className="font-bold text-slate-700 block text-[11px]">Acuity Rationale:</span>
                        <p className="text-slate-600 leading-relaxed">{activeEsi.rationale}</p>
                      </div>

                      {/* Recommended Immediate Clinical Orders & Resources */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        
                        {/* Column 1: Immediate Clinical Orders */}
                        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                              <Activity size={13} className="text-teal-700" />
                              Immediate Recommended Orders
                            </span>
                            <button
                              type="button"
                              onClick={handleApplyEsiOrders}
                              className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors"
                              title="Add these orders to doctor notes and prescription pad"
                            >
                              + Apply Orders
                            </button>
                          </div>
                          <ul className="space-y-1 text-slate-700 text-[11px]">
                            {activeEsi.immediateActions.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-teal-600 font-bold">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Column 2: Predicted Medical Resources */}
                        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2">
                          <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                            <Stethoscope size={13} className="text-blue-700" />
                            Predicted Resources Required ({activeEsi.predictedResources.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeEsi.predictedResources.map((res, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-md bg-white text-slate-800 text-[10px] font-semibold border border-slate-200 shadow-2xs"
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

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
                        <span className="font-bold text-slate-700 block mb-1.5">Recommended Provisional Workup:</span>
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
                <div className="p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        Scanned Prescriptions & Lab Documents ({selectedPatient.uploadedDocuments?.length || 0})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ABDM optical ingestion pipeline with raw document bypass and direct physician report uploads.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDocUploadModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="Upload and link a new report to this patient"
                    >
                      <Upload size={14} />
                      <span>Upload Report / Scan</span>
                    </button>
                  </div>

                  {!selectedPatient.uploadedDocuments || selectedPatient.uploadedDocuments.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <FileText size={32} className="mx-auto text-slate-400" />
                      <h4 className="text-sm font-bold text-slate-700">No Scanned Documents Uploaded</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Documents uploaded by the patient at the Kiosk or via their Mobile Dashboard will be displayed here with side-by-side verification lightboxes.
                      </p>
                    </div>
                  ) : (
                    selectedPatient.uploadedDocuments.map((doc) => (
                      <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-4 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                              <FileText size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{doc.name}</span>
                                <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                  {doc.type}
                                </span>
                              </div>
                              <span className="text-xs font-mono text-slate-500">{doc.date}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {doc.uploadedBy === 'doctor' ? (
                              <span className="text-[10px] font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <Stethoscope size={12} className="text-purple-700" />
                                Doctor Uploaded ({doc.date})
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <FileText size={11} className="text-slate-500" />
                                Patient Upload ({doc.date})
                              </span>
                            )}

                            {doc.ocrStatus === 'bypassed_to_doctor' || doc.isHandwritten ? (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <AlertTriangle size={12} className="text-amber-600" />
                                Handwritten / Bypassed
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <ShieldCheck size={12} className="text-emerald-600" />
                                Digitized & Indexed
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => setViewingDoc(doc)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                              <span>View Original Scanned Document</span>
                            </button>
                          </div>
                        </div>

                        {doc.notes && (
                          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
                            <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold">Clinical Transcription Note: </strong>
                              {doc.notes}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-slate-700">
                          <strong className="font-semibold text-slate-900">Extracted Diagnoses: </strong>{' '}
                          {doc.extractedDiagnoses && doc.extractedDiagnoses.length > 0 ? (
                            <span className="inline-flex flex-wrap gap-1 mt-1">
                              {doc.extractedDiagnoses.map((d, i) => (
                                <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium text-slate-800">
                                  {d}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">None structured (manual visual review advised)</span>
                          )}
                        </div>

                        {/* Extracted Medications with 1-Click Import to Rx Pad */}
                        {doc.extractedMeds && doc.extractedMeds.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                              <span>Digitized Medications on this Slip:</span>
                              <span className="text-[10px] text-slate-500 font-normal">Click "+ Add to Rx Pad" to prescribe</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {doc.extractedMeds.map((med, mIdx) => (
                                <div key={mIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 truncate">{med.name}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">
                                      {med.dose} • {med.frequency}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPrescribedMeds((prev) => [
                                        ...prev,
                                        {
                                          name: med.name,
                                          dose: med.dose || '1 Dose',
                                          frequency: med.frequency || '1-0-1',
                                          duration: '7 Days',
                                          instructions: 'As noted on previous scanned prescription'
                                        }
                                      ]);
                                      setStatusMessage(`Added "${med.name}" to prescription pad.`);
                                      setTimeout(() => setStatusMessage(''), 3000);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shrink-0"
                                  >
                                    <Plus size={12} /> Add to Rx
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Digitized Labs */}
                        {doc.extractedLabs && doc.extractedLabs.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-800">Digitized Lab Parameters:</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {doc.extractedLabs.map((l, idx) => (
                                <div
                                  key={idx}
                                  className={`p-2.5 rounded-xl border text-xs ${
                                    l.isOutOfRange
                                      ? 'bg-red-50 border-red-200 text-red-900'
                                      : 'bg-white border-slate-200 text-slate-800'
                                  }`}
                                >
                                  <div className="font-semibold text-slate-700">{l.test}</div>
                                  <div className="text-sm font-black mt-0.5">
                                    {l.value} {l.unit}
                                    {l.isOutOfRange && (
                                      <span className="ml-1.5 text-[9px] uppercase font-bold text-red-600 bg-red-100 px-1 py-0.5 rounded">
                                        Abnormal
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">Normal Range: {l.range}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Lightbox Quick Access Callout */}
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-blue-900">
                          <span className="text-[11px]">
                            {doc.isHandwritten
                              ? '⚠️ Cursive clinical handwriting detected. Visual inspection in verification lightbox is advised.'
                              : '🔍 Need high-resolution bedside inspection? Zoom into the raw clinical scan.'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="text-xs font-bold text-blue-700 underline hover:text-blue-900 flex items-center gap-1 shrink-0 ml-2"
                          >
                            Open Verification Lightbox &rarr;
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab Content 3: AYUSH Pariksha */}
              {activeChartTab === 'ayush' && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Leaf size={18} className="text-emerald-600" />
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase">AYUSH Integrative Pariksha Profile</h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Patient Consented AYUSH Desk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Deha Prakriti (Constitution)</span>
                      <span className="text-sm font-black text-emerald-950">{selectedPatient.prakriti || 'Not assessed'}</span>
                      {selectedPatient.prakriti && (
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          Assessed constitutional balance according to Ayurvedic Dosha pariksha.
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">Jatharagni (Digestive Fire)</span>
                      <span className="text-sm font-black text-amber-950">{selectedPatient.agni || 'Not assessed'}</span>
                      {selectedPatient.agni && (
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          Metabolic fire and digestive assimilation capacity.
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Koshtha (Bowel Regularity)</span>
                      <span className="text-sm font-black text-slate-900">{selectedPatient.koshtha || 'Not assessed'}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Nidra (Sleep Pattern)</span>
                      <span className="text-sm font-black text-slate-900">{selectedPatient.nidra || 'Not assessed'}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block">Ahara & Vihara (Dietary & Lifestyle Stressors):</span>
                    <p className="text-slate-600">{selectedPatient.aharaVihara || 'Standard balanced diet, regular lifestyle'}</p>
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

      {/* Document Inspection & Verification Lightbox Modal */}
      {viewingDoc && (
        <DocumentViewerModal
          document={viewingDoc}
          patientName={selectedPatient.name}
          patientToken={selectedPatient.token}
          onClose={() => setViewingDoc(null)}
          onAddPrescription={(med) => {
            setPrescribedMeds((prev) => [...prev, med]);
            setStatusMessage(`Added "${med.name}" to active prescription pad.`);
            setTimeout(() => setStatusMessage(''), 3000);
          }}
          onAppendNotes={(note) => {
            setDoctorNotes((prev) => (prev ? `${prev}\n${note}` : note));
            setStatusMessage('Appended transcription note to doctor observations.');
            setTimeout(() => setStatusMessage(''), 3000);
          }}
        />
      )}

      {/* Doctor Document & Diagnostic Report Upload Modal */}
      {showDocUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Upload size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Upload & Link Clinical Document</h3>
                  <p className="text-xs text-slate-500">
                    Linking to: <span className="font-semibold text-slate-800">{selectedPatient.name}</span> ({selectedPatient.token})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetDocUploadForm}
                className="w-8 h-8 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDoctorSubmitUpload} className="p-6 space-y-4 overflow-y-auto">
              {/* File Drop / Selection Area */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Select Document File (Scan, ECG, Photo, or PDF):
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-teal-50/30 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleDocFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadDocFile ? (
                    <div className="space-y-1">
                      <FileText size={28} className="mx-auto text-teal-600" />
                      <div className="text-xs font-bold text-slate-900">{uploadDocFile.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {(uploadDocFile.size / 1024).toFixed(1)} KB • Click or drop another to replace
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      <Upload size={28} className="mx-auto text-slate-400" />
                      <div className="text-xs font-bold text-slate-700">Click or drag & drop document file here</div>
                      <div className="text-[11px] text-slate-400">Supports JPG, PNG, WebP, PDF or bedside mobile scans</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Document Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document Category:
                  </label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none cursor-pointer"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="ECG / Radiology">ECG / Radiology</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Bedside Scan">Bedside Scan</option>
                  </select>
                </div>

                {/* Document Date */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Document / Report Date:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={uploadDocDate}
                      onChange={(e) => setUploadDocDate(e.target.value)}
                      placeholder="e.g. 08 Sep 2026"
                      className="w-full px-3 py-2 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none"
                      required
                    />
                    <Calendar size={13} className="absolute left-2.5 top-3 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Document Title / Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Document Title:
                </label>
                <input
                  type="text"
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  placeholder="e.g. Bedside 12-Lead ECG, Blood CBC Report, Chest X-Ray..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none"
                  required
                />
              </div>

              {/* Doctor Impressions / Notations */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Doctor Clinical Impressions & Notations:
                </label>
                <textarea
                  rows={2}
                  value={uploadDocNotes}
                  onChange={(e) => setUploadDocNotes(e.target.value)}
                  placeholder="e.g. Normal sinus rhythm, no acute ischemic ST changes. External lab verified by Dr..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none leading-relaxed"
                />
              </div>

              {/* Optional Key Findings / Parameters */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Quick Diagnostic Parameter (Optional):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Test (e.g. Troponin)"
                    value={uploadTestName}
                    onChange={(e) => setUploadTestName(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 0.02)"
                    value={uploadTestValue}
                    onChange={(e) => setUploadTestValue(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g. ng/mL)"
                    value={uploadTestUnit}
                    onChange={(e) => setUploadTestUnit(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Range (e.g. <0.04)"
                    value={uploadTestRange}
                    onChange={(e) => setUploadTestRange(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetDocUploadForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingDoc}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Upload size={14} />
                  <span>Upload & Link to Patient Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


