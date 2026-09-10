import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Building2
} from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';
import { aiRecognizeDepartment } from '../data/governmentHospitals';
import { getTranslations } from '../data/regionalTranslations';

export default function Summary() {
  const navigate = useNavigate();
  const { currentPatient, evaluateTriageAndSummary, saveToDatabase, currentProfile, updateProfile } =
    usePatientStore();

  if (!currentProfile) {
    return <Navigate to="/patient/login" replace />;
  }

  const t = getTranslations(currentPatient.language);
  const isHindi = currentPatient.language === 'hi';
  
  // Determine OPD Department and Room based on AI Triage rules in real-time
  const [routingInfo, setRoutingInfo] = useState({ 
    dept: currentPatient.assignedDept && currentPatient.assignedDept !== 'AI Auto-Routing' 
      ? currentPatient.assignedDept 
      : 'General Medicine & OPD Triage', 
    room: currentPatient.assignedRoom && currentPatient.assignedRoom !== 'AI Auto-Routing'
      ? currentPatient.assignedRoom
      : 'OPD Room 14' 
  });

  useEffect(() => {
    // Re-evaluate to get the latest triage level
    evaluateTriageAndSummary();
    saveToDatabase();
  }, [evaluateTriageAndSummary, saveToDatabase]);

  useEffect(() => {
    // If patient already has assigned department from intake, use that directly
    if (
      currentPatient.assignedDept && 
      currentPatient.assignedDept !== 'AI Auto-Routing' &&
      currentPatient.assignedRoom &&
      currentPatient.assignedRoom !== 'AI Auto-Routing'
    ) {
      setRoutingInfo({ 
        dept: currentPatient.assignedDept, 
        room: currentPatient.assignedRoom 
      });
      return;
    }

    // Otherwise, generate routing via AI clinical department recognition
    const textToScan = `${currentPatient.chiefComplaint} ${currentPatient.chiefComplaintHi}`.toLowerCase();
    const routed = aiRecognizeDepartment(
      textToScan,
      currentPatient.mode,
      currentPatient.triageLevel,
      currentPatient.hospitalCode || 'aiims-delhi',
      Number(currentPatient.age) || undefined
    );

    setRoutingInfo({ dept: routed.assignedDept, room: routed.assignedRoom });
  }, [currentPatient.chiefComplaint, currentPatient.chiefComplaintHi, currentPatient.mode, currentPatient.assignedDept, currentPatient.assignedRoom, currentPatient.hospitalCode, currentPatient.triageLevel, currentPatient.age]);

  const handleReturnToDashboard = () => {
    // Record the completed visit to the patient profile
    if (currentProfile) {
      updateProfile({
        pastVisits: [
          {
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            hospital: currentPatient.hospitalName || 'AIIMS New Delhi (Apex)',
            department: routingInfo.dept,
            reason: currentPatient.chiefComplaint || 'Clinical OPD Consultation',
            doctorNotesHidden: `OPD Token #${currentPatient.token} assigned to ${routingInfo.room}. Pending doctor verification.`
          },
          ...currentProfile.pastVisits
        ]
      });
    }
    navigate('/patient/dashboard');
  };

  return (
    <div className="flex flex-col gap-6 px-4 pb-16 max-w-xl mx-auto mt-6 md:mt-8">
      
      {/* Top Routing Card */}
      <div className="bg-white p-6 sm:p-8 border border-slate-200/90 rounded-2xl shadow-xs text-center">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100 mx-auto">
          <CheckCircle2 size={24} strokeWidth={2.2} />
        </div>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {t.summary.completeTitle}
        </h1>
        <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          {t.summary.completeSub}
        </p>

        {/* Reassuring Care Route Card (Calm Patient Guidance) */}
        {currentPatient.esiTriage && (
          <div
            className={`mt-6 p-4 rounded-xl border text-left ${
              currentPatient.esiTriage.level <= 2
                ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                : currentPatient.esiTriage.level === 3
                ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 border border-current">
                {currentPatient.esiTriage.level <= 2
                  ? t.summary.fastTrack
                  : currentPatient.esiTriage.level === 3
                  ? t.summary.careReview
                  : t.summary.standardCare}
              </span>
              <span className="text-[11px] font-bold">
                {currentPatient.esiTriage.level <= 2
                  ? (isHindi ? 'प्राथमिकता सहायता निर्धारित' : 'Priority Care Route')
                  : currentPatient.esiTriage.level === 3
                  ? (isHindi ? 'परामर्श विवरण प्रेषित' : 'Details Sent to Doctor')
                  : (isHindi ? 'पंजीकरण सफल' : 'Confirmed')}
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed">
              {currentPatient.esiTriage.level <= 2
                ? (isHindi
                  ? 'आपकी जानकारी ओपीडी टीम को प्राथमिकता के साथ भेज दी गई है। कृपया अपने टोकन के साथ सीधे नर्सिंग काउंटर पर संपर्क करें ताकि आपकी जांच शीघ्र शुरू हो सके।'
                  : 'Your clinical details have been shared with our attending team. Please present your token at the nursing desk for fast-track assistance.')
                : (isHindi
                ? 'आपके लक्षण ओपीडी चिकित्सक को भेज दिए गए हैं। कृपया अपने टोकन नंबर के बुलाए जाने तक निर्धारित प्रतीक्षा क्षेत्र में बैठें।'
                : 'Your intake details have been transmitted to the OPD desk. Please take a seat in the waiting area until your token is called.')}
            </p>
          </div>
        )}

        {/* OPD Routing Box */}
        <div className="mt-6 p-6 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-900 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50/90 px-3 py-1 rounded-full border border-blue-200/80 mb-3 shadow-2xs">
              <Building2 size={13} className="text-blue-600" />
              <span>{currentPatient.hospitalName || 'AIIMS New Delhi (Apex)'}</span>
            </div>
            
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-2.5">
              <MapPin size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.summary.assignedStation}</span>
            <div className="text-xl font-bold text-slate-900">{routingInfo.dept}</div>
            <div className="text-sm font-semibold text-blue-600 mt-0.5">{routingInfo.room}</div>
            
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <Clock size={13} className="text-slate-400" />
              <span>Queue Status: Active • Token: {currentPatient.token}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 text-[11px] text-slate-400">
          Electronic health records transmitted securely under ABDM encryption protocols.
        </div>

        {/* Return to Dashboard */}
        <div className="mt-6">
          <button
            onClick={handleReturnToDashboard}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 mx-auto"
          >
            <span>{t.summary.openDashboard}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
