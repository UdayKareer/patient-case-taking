import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { usePatientStore } from '../store/usePatientStore';
import { 
  History, 
  FileText, 
  User, 
  LogOut, 
  MapPin, 
  QrCode, 
  HeartPulse,
  Leaf,
  ArrowRight,
  ShieldAlert,
  Activity,
  Lock,
  Plus,
  Trash2,
  Bell,
  Clock,
  ExternalLink,
  AlertTriangle,
  Upload,
  Calendar,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { currentProfile, updateProfile, logoutProfile, setMode, updatePatient, currentPatient, resetPatient } = usePatientStore();
  
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'documents' | 'profile'>('home');
  const [hospitalCode, setHospitalCode] = useState(currentPatient.hospitalCode || 'AIIMS-DEL');
  const [doctorNumber, setDoctorNumber] = useState(currentPatient.doctorNumber || 'OPD Room 14 (Dr. Verma)');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [forceNewConsultation, setForceNewConsultation] = useState(false);

  // Profile Edit State
  const [newCondition, setNewCondition] = useState({ condition: '', medication: '' });
  const [newAllergy, setNewAllergy] = useState({ allergen: '', reaction: '' });
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [isAddingAllergy, setIsAddingAllergy] = useState(false);

  // Document Upload State
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!currentProfile) {
    return <Navigate to="/patient/login" replace />;
  }

  const hasActiveConsultation = Boolean(
    currentPatient.token &&
    currentPatient.chiefComplaint &&
    currentPatient.status !== 'accepted' &&
    currentPatient.status !== 'admitted' &&
    !forceNewConsultation
  );

  const handleRemoveCondition = (index: number) => {
    const updated = [...currentProfile.chronicConditions];
    updated.splice(index, 1);
    updateProfile({ chronicConditions: updated });
  };

  const handleAddCondition = () => {
    if (!newCondition.condition.trim()) return;
    updateProfile({
      chronicConditions: [
        ...currentProfile.chronicConditions,
        {
          condition: newCondition.condition,
          medication: newCondition.medication || 'None',
          duration: 'Recent',
          status: 'Self-reported',
          isDoctorVerified: false
        }
      ]
    });
    setNewCondition({ condition: '', medication: '' });
    setIsAddingCondition(false);
  };

  const handleRemoveAllergy = (index: number) => {
    const updated = [...currentProfile.allergies];
    updated.splice(index, 1);
    updateProfile({ allergies: updated });
  };

  const handleAddAllergy = () => {
    if (!newAllergy.allergen.trim()) return;
    updateProfile({
      allergies: [
        ...currentProfile.allergies,
        {
          allergen: newAllergy.allergen,
          reaction: newAllergy.reaction || 'Unknown',
          severity: 'mild',
          isDoctorVerified: false
        }
      ]
    });
    setNewAllergy({ allergen: '', reaction: '' });
    setIsAddingAllergy(false);
  };

  const handleStartConsult = (mode: 'modern' | 'ayush') => {
    if (!hospitalCode.trim()) {
      alert('Please enter a Hospital Code first (e.g. AIIMS-DEL)');
      return;
    }
    setMode(mode);
    updatePatient({ 
      hospitalCode: hospitalCode.trim(),
      doctorNumber: doctorNumber.trim() || 'OPD Room 14 (Dr. Verma)',
      status: 'waiting' 
    });
    setForceNewConsultation(false);
    navigate('/consultation');
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('document', file);

    try {
      // In a real scenario this points to our new Node.js server
      const response = await fetch('http://localhost:5000/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Mock updating profile with new document
        updateProfile({
          uploadedDocuments: [
            ...currentProfile.uploadedDocuments,
            {
              id: 'doc-' + Date.now(),
              name: file.name,
              type: file.type.includes('pdf') ? 'Lab Report' : 'Prescription',
              date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              extractedDiagnoses: result.data.diagnoses || [],
              extractedMeds: (result.data.prescriptions || []).map((p: any) => ({
                name: p.medicineName,
                dose: p.dosage,
                frequency: p.frequency
              })),
              extractedLabs: [] // You could map vitals or labs here
            }
          ]
        });
      } else {
        setUploadError(result.error || 'Failed to process document');
      }
    } catch (err) {
      console.error(err);
      setUploadError('Server unreachable. Ensure the backend is running.');
    } finally {
      setIsUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    logoutProfile();
    navigate('/patient/login');
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-50 overflow-hidden relative">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-60 bg-white border-r border-slate-200/90 flex-col shadow-xs z-10 shrink-0">
        <div className="p-5 border-b border-slate-100 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-2.5 text-base font-bold shadow-xs">
            {currentProfile.name.charAt(0)}
          </div>
          <h2 className="text-sm font-semibold text-slate-900 text-center">{currentProfile.name}</h2>
          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 mt-1">
            ABHA: {currentProfile.abhaId}
          </span>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <SidebarButton 
            active={activeTab === 'home'} 
            icon={<MapPin size={16} />} 
            label="OPD Intake" 
            onClick={() => setActiveTab('home')} 
          />
          <SidebarButton 
            active={activeTab === 'history'} 
            icon={<History size={16} />} 
            label="Visit History" 
            onClick={() => setActiveTab('history')} 
          />
          <SidebarButton 
            active={activeTab === 'documents'} 
            icon={<FileText size={16} />} 
            label="EHR Documents" 
            onClick={() => setActiveTab('documents')} 
          />
          <SidebarButton 
            active={activeTab === 'profile'} 
            icon={<User size={16} />} 
            label="Health Profile" 
            onClick={() => setActiveTab('profile')} 
          />
        </nav>
        
        <div className="p-3 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/80 rounded-lg transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header */}
        <div className="md:hidden bg-white border-b border-slate-200/90 p-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-xs">
              {currentProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">{currentProfile.name}</h2>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">ABHA: {currentProfile.abhaId}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
          
          {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {currentPatient.status === 'admitted' && (
              <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl flex items-start gap-3 shadow-xs">
                <div className="p-2 bg-red-100 rounded-lg text-red-700 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-900">Admitted to In-Patient Department (IPD)</h3>
                  <p className="text-xs text-red-800 mt-0.5">
                    Your physician has marked you for admission. Please proceed to the Admission / Billing Desk for bed allocation.
                  </p>
                </div>
              </div>
            )}

            {/* 1. If an active consultation exists, display LIVE OPD WAITING STATUS */}
            {hasActiveConsultation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">OPD Queue & Visit Status</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Intake details submitted. Please proceed to the assigned waiting area.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetPatient();
                      setForceNewConsultation(true);
                    }}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors shadow-2xs"
                  >
                    + New Consultation
                  </button>
                </div>

                {/* Urgent Call Alert if Doctor called the patient */}
                {currentPatient.status === 'in_consultation' && (
                  <div className="p-4 bg-amber-500 text-white rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <Bell size={20} />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">
                          Doctor is calling Token #{currentPatient.token}
                        </div>
                        <div className="text-xs text-amber-100 font-medium">
                          Please proceed inside {currentPatient.assignedRoom || 'OPD Room 14'}.
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-white text-amber-900 font-bold text-xs rounded-lg shadow-2xs">
                      ENTER NOW
                    </span>
                  </div>
                )}

                {/* Live Waiting Card */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-5">
                  {/* Status Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                          {currentPatient.status === 'waiting'
                            ? 'Waiting in Queue'
                            : currentPatient.status === 'in_consultation'
                            ? 'Currently in Consultation'
                            : 'Consultation Recorded'}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} /> Estimated wait: ~10 - 15 mins (2 patients ahead)
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right bg-slate-50/80 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Queue Token
                      </span>
                      <span className="text-2xl font-bold text-slate-900 font-mono">
                        #{currentPatient.token}
                      </span>
                    </div>
                  </div>

                  {/* Location & Routing Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/70 space-y-1">
                      <span className="font-semibold text-slate-500 uppercase text-[10px] block">Hospital & Branch</span>
                      <span className="font-bold text-slate-900 text-sm block">
                        {currentPatient.hospitalName || 'AIIMS Hospital'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">Code: {currentPatient.hospitalCode || 'AIIMS-DEL'}</span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/70 space-y-1">
                      <span className="font-semibold text-slate-500 uppercase text-[10px] block">Assigned OPD Dept</span>
                      <span className="font-bold text-blue-700 text-sm block">
                        {currentPatient.assignedDept || 'General Medicine OPD'}
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        {currentPatient.assignedRoom || 'Room 101, Ground Floor'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/70 space-y-1">
                      <span className="font-semibold text-slate-500 uppercase text-[10px] block">Doctor / Counter Desk</span>
                      <span className="font-bold text-slate-900 text-sm block">
                        {currentPatient.doctorNumber || 'OPD Room 14 (Dr. Verma)'}
                      </span>
                      <span className="text-emerald-700 font-semibold text-[11px]">✓ Records Transmitted</span>
                    </div>
                  </div>

                  {/* Summary of What Patient Entered */}
                  <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/70 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Chief Complaint Reported:
                    </span>
                    <p className="text-sm font-medium text-slate-800">
                      "{currentPatient.chiefComplaint}"
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                      <span>Onset: <strong className="text-slate-700 font-medium">{currentPatient.symptomDuration || 'Recent'}</strong></span>
                      <span>•</span>
                      <span>Severity: <strong className="text-slate-700 font-medium">{currentPatient.symptomSeverity}/10</strong></span>
                      {currentPatient.symptomCharacter && (
                        <>
                          <span>•</span>
                          <span>Character: <strong className="text-slate-700 font-medium">{currentPatient.symptomCharacter}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      onClick={() => navigate('/summary')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <ExternalLink size={13} />
                      <span>View OPD Token Slip</span>
                    </button>
                    <button
                      onClick={() => {
                        resetPatient();
                        setForceNewConsultation(true);
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-all"
                    >
                      Start Another Consultation
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* 2. CHECK-IN / START CONSULTATION FORM */
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Hospital Check-in & Consultation</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan the QR code at the OPD desk or enter hospital & doctor room details.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Hospital Code */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                        Hospital Code or Name
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                          type="text"
                          value={hospitalCode}
                          onChange={(e) => setHospitalCode(e.target.value)}
                          placeholder="e.g. AIIMS-DEL or City Hospital"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Doctor / Reception Desk Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                        Doctor / OPD Room Number
                      </label>
                      <input
                        type="text"
                        value={doctorNumber}
                        onChange={(e) => setDoctorNumber(e.target.value)}
                        placeholder="e.g. OPD Room 14 (Dr. Verma)"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* QR Scan Button */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Present at reception or OPD counter? Scan desk QR to auto-populate.
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="w-full sm:w-auto px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 font-medium text-xs transition-colors shadow-2xs"
                    >
                      <QrCode size={14} /> Scan Desk QR
                    </button>
                  </div>
                </div>

                {/* Consultation Mode Options */}
                {hospitalCode.trim() && (
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Select Department Clinical Stream:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Modern Medicine */}
                      <button
                        onClick={() => handleStartConsult('modern')}
                        className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all text-left flex flex-col gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <HeartPulse size={20} strokeWidth={2.2} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Modern Medicine (Allopathy)</h3>
                          <p className="text-xs text-slate-500 mt-0.5">General OPD, clinical symptom triage, and rapid OPD queue assignment.</p>
                        </div>
                        <div className="mt-auto pt-2 flex items-center gap-1.5 text-blue-600 font-semibold text-xs">
                          Start Intake <ArrowRight size={14} />
                        </div>
                      </button>

                      {/* AYUSH */}
                      <button
                        onClick={() => handleStartConsult('ayush')}
                        className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all text-left flex flex-col gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Leaf size={20} strokeWidth={2.2} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">AYUSH / Traditional Medicine</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Prakriti, Agni, and Ahara-Vihara traditional clinical intake evaluation.</p>
                        </div>
                        <div className="mt-auto pt-2 flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                          Start Intake <ArrowRight size={14} />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Consultation History</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified clinical consultations, diagnostic impressions, and prescriptions.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500 self-start sm:self-auto bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70">
                {currentProfile.pastVisits.length} {currentProfile.pastVisits.length === 1 ? 'Recorded Visit' : 'Recorded Visits'}
              </span>
            </div>
            
            {currentProfile.pastVisits.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-slate-200/90 text-center shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <History size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-800">No past visits recorded</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Completed consultations and OPD discharge summaries will automatically populate here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentProfile.pastVisits.map((visit, idx) => (
                  <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{visit.hospital}</h3>
                          <span className="text-xs font-medium text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100/70 inline-block mt-1">
                            {visit.department}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 self-start sm:self-auto">
                        <Calendar size={13} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">{visit.date}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200/70 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Reported Chief Complaint
                        </span>
                        <p className="text-slate-800 font-medium">"{visit.reason}"</p>
                      </div>

                      {visit.diagnosis && (
                        <div className="p-3.5 bg-blue-50/40 rounded-lg border border-blue-100/80 space-y-1">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                            Physician Diagnosis
                          </span>
                          <p className="text-slate-900 font-semibold">{visit.diagnosis}</p>
                        </div>
                      )}
                    </div>

                    {visit.prescriptions && visit.prescriptions.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Prescribed Medications
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {visit.prescriptions.map((med, mIdx) => (
                            <span key={mIdx} className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-md text-xs font-medium text-slate-700">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {visit.patientVisibleNotes && (
                      <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200/70 space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                          Physician Instructions
                        </span>
                        <p className="text-slate-700 leading-relaxed">{visit.patientVisibleNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
            <div className="pb-1 border-b border-slate-200/80">
              <h1 className="text-xl font-bold text-slate-900">Health Profile & Clinical Background</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage ongoing medical conditions, active prescriptions, and known drug or food allergies.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Chronic Conditions Card */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                      <Activity size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Chronic Conditions</h3>
                      <p className="text-[11px] text-slate-500">Long-term diagnosed illnesses</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAddingCondition(true)} 
                    className="px-2.5 py-1 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/70 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>

                {currentProfile.chronicConditions.length > 0 ? (
                  <ul className="space-y-2.5">
                    {currentProfile.chronicConditions.map((c, i) => (
                      <li key={i} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/70 flex items-start justify-between group">
                        <div>
                          <div className="font-semibold text-slate-800 text-xs flex items-center gap-2">
                            {c.condition}
                            {c.isDoctorVerified ? (
                              <span title="Verified by Doctor" className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-medium">
                                <Lock size={10} /> Verified
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200/60 px-1.5 py-0.5 rounded-md font-medium">
                                Self-Reported
                              </span>
                            )}
                          </div>
                          {c.medication && (
                            <div className="text-[11px] text-slate-500 mt-1">
                              Taking: <span className="text-slate-700 font-medium">{c.medication}</span>
                            </div>
                          )}
                        </div>
                        {!c.isDoctorVerified && (
                          <button 
                            onClick={() => handleRemoveCondition(i)} 
                            className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove condition"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 py-2">No chronic conditions recorded.</p>
                )}

                {isAddingCondition && (
                  <div className="p-3.5 bg-slate-50 rounded-lg space-y-2.5 border border-slate-200">
                    <input 
                      type="text" 
                      placeholder="Condition name (e.g. Type 2 Diabetes)..." 
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                      value={newCondition.condition}
                      onChange={e => setNewCondition({...newCondition, condition: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Medication / dosage (e.g. Metformin 500mg)..." 
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                      value={newCondition.medication}
                      onChange={e => setNewCondition({...newCondition, medication: e.target.value})}
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setIsAddingCondition(false)} className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                      <button onClick={handleAddCondition} className="px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-2xs">Save Condition</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Known Allergies Card */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                      <ShieldAlert size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Known Allergies</h3>
                      <p className="text-[11px] text-slate-500">Medication & food sensitivities</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAddingAllergy(true)} 
                    className="px-2.5 py-1 text-xs font-medium text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 rounded-lg border border-amber-200/70 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>

                {currentProfile.allergies.length > 0 ? (
                  <ul className="space-y-2.5">
                    {currentProfile.allergies.map((a, i) => (
                      <li key={i} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/70 flex items-start justify-between group">
                        <div>
                          <div className="font-semibold text-slate-800 text-xs flex items-center gap-2">
                            {a.allergen}
                            {a.isDoctorVerified ? (
                              <span title="Verified by Doctor" className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-medium">
                                <Lock size={10} /> Verified
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-100/70 text-amber-800 border border-amber-200/70 px-1.5 py-0.5 rounded-md font-medium">
                                Self-Reported
                              </span>
                            )}
                          </div>
                          {a.reaction && (
                            <div className="text-[11px] text-slate-500 mt-1">
                              Reaction: <span className="text-slate-700 font-medium">{a.reaction}</span>
                            </div>
                          )}
                        </div>
                        {!a.isDoctorVerified && (
                          <button 
                            onClick={() => handleRemoveAllergy(i)} 
                            className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove allergy"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 py-2">No known allergies reported.</p>
                )}

                {isAddingAllergy && (
                  <div className="p-3.5 bg-slate-50 rounded-lg space-y-2.5 border border-slate-200">
                    <input 
                      type="text" 
                      placeholder="Allergen name (e.g. Penicillin, Sulfa)..." 
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                      value={newAllergy.allergen}
                      onChange={e => setNewAllergy({...newAllergy, allergen: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Adverse reaction (e.g. Skin Rash, Hives)..." 
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                      value={newAllergy.reaction}
                      onChange={e => setNewAllergy({...newAllergy, reaction: e.target.value})}
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setIsAddingAllergy(false)} className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                      <button onClick={handleAddAllergy} className="px-3.5 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-2xs">Save Allergy</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Medical Records & Documents</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload laboratory reports, discharge summaries, or previous prescriptions.
                </p>
              </div>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleDocumentUpload} 
                  className="hidden" 
                  accept=".pdf,image/png,image/jpeg"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingDoc}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all shadow-xs flex items-center gap-1.5 ${
                    isUploadingDoc 
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                  }`}
                >
                  <Upload size={14} />
                  <span>{isUploadingDoc ? 'Processing Document...' : 'Upload Document'}</span>
                </button>
              </div>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            
            {currentProfile.uploadedDocuments.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-slate-200/90 text-center shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <FileText size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-800">No medical documents uploaded</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload PDF or image files of your lab tests, diagnostic scans, or previous prescriptions for automated clinical indexing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentProfile.uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200/90 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText size={17} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 text-xs truncate">{doc.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.type} • Uploaded {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-medium rounded-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Indexed & Structured
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-600">
              <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Uploaded files are processed through ABDM-compliant clinical record indexing. Your consulting physician can instantly view extracted vitals, lab markers, and longitudinal trends.
              </p>
            </div>
          </div>
        )}

      </div>
      </div>

      {/* RECEPTION QR SCANNER MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full text-white space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <QrCode size={15} /> Reception Desk Scanner
              </span>
              <button 
                onClick={() => setShowQrModal(false)} 
                className="text-slate-400 hover:text-white text-xs font-medium px-1.5 py-0.5 rounded-md hover:bg-slate-800 transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="relative w-56 h-56 mx-auto rounded-xl border border-blue-500/40 bg-slate-950 flex items-center justify-center overflow-hidden">
              {/* Laser animation */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
              <div className="w-40 h-40 border border-dashed border-blue-400/40 rounded-lg flex items-center justify-center">
                <QrCode size={80} className="text-blue-400/40" />
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Align camera with the QR code placed at the Reception Counter or OPD Kiosk.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsScanning(true);
                setTimeout(() => {
                  setHospitalCode('AIIMS-DEL');
                  setDoctorNumber('OPD Room 14 (Dr. R. Verma)');
                  setIsScanning(false);
                  setShowQrModal(false);
                }, 700);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all shadow-xs"
            >
              {isScanning ? 'Verifying Reception QR...' : 'Simulate Scan Reception QR'}
            </button>
          </div>
        </div>
      )}
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <MobileNavButton active={activeTab === 'home'} icon={<MapPin size={22} />} label="Consult" onClick={() => setActiveTab('home')} />
        <MobileNavButton active={activeTab === 'history'} icon={<History size={22} />} label="History" onClick={() => setActiveTab('history')} />
        <MobileNavButton active={activeTab === 'documents'} icon={<FileText size={22} />} label="Docs" onClick={() => setActiveTab('documents')} />
        <MobileNavButton active={activeTab === 'profile'} icon={<User size={22} />} label="Profile" onClick={() => setActiveTab('profile')} />
      </div>

    </div>
  );
}

function MobileNavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 p-1 transition-colors ${
        active ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <div className={`${active ? 'bg-blue-50 text-blue-700 rounded-lg p-1.5' : 'p-1.5'}`}>{icon}</div>
      <span className={`text-[10px] ${active ? 'font-semibold text-blue-700' : 'font-medium text-slate-500'} mt-0.5`}>{label}</span>
    </button>
  );
}

// Modern Sidebar Button component
function SidebarButton({ 
  active, 
  icon, 
  label, 
  onClick 
}: { 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
        active 
          ? 'bg-blue-50/80 text-blue-700 font-semibold shadow-2xs' 
          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
      }`}
    >
      <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
