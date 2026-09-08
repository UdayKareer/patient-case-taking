import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';

export default function Summary() {
  const navigate = useNavigate();
  const { currentPatient, evaluateTriageAndSummary, saveToDatabase, currentProfile, updateProfile } =
    usePatientStore();

  if (!currentProfile) {
    return <Navigate to="/patient/login" replace />;
  }

  const isHindi = currentPatient.language === 'hi';
  
  // Determine OPD Department and Room based on AI Triage rules in real-time
  const [routingInfo, setRoutingInfo] = useState({ dept: 'General Medicine OPD', room: 'Room 101' });

  useEffect(() => {
    // Re-evaluate to get the latest triage level
    evaluateTriageAndSummary();
    saveToDatabase();
  }, [evaluateTriageAndSummary, saveToDatabase]);

  useEffect(() => {
    // Generate routing based on chief complaint text
    const textToScan = `${currentPatient.chiefComplaint} ${currentPatient.chiefComplaintHi}`.toLowerCase();
    
    let dept = 'General Medicine OPD';
    let room = 'Room 101, Ground Floor';
    
    if (textToScan.includes('chest') || textToScan.includes('सीने') || textToScan.includes('heart')) {
      dept = 'Cardiology OPD';
      room = 'Room 204, 2nd Floor';
    } else if (textToScan.includes('bone') || textToScan.includes('joint') || textToScan.includes('pain') || textToScan.includes('घुटनों') || textToScan.includes('हड्डी')) {
      dept = 'Orthopedics OPD';
      room = 'Room 112, 1st Floor';
    } else if (textToScan.includes('stomach') || textToScan.includes('abdomen') || textToScan.includes('पेट')) {
      dept = 'Gastroenterology OPD';
      room = 'Room 305, 3rd Floor';
    }

    if (currentPatient.mode === 'ayush') {
      dept = 'AYUSH / Ayurveda Department';
      room = 'Room 401, Heritage Wing';
    }

    setRoutingInfo({ dept, room });
  }, [currentPatient.chiefComplaint, currentPatient.chiefComplaintHi, currentPatient.mode]);

  const handleReturnToDashboard = () => {
    // We simulate recording the visit to the profile
    if (currentProfile) {
      updateProfile({
        pastVisits: [
          {
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            hospital: 'City Hospital',
            department: routingInfo.dept,
            reason: currentPatient.chiefComplaint || 'Consultation',
            doctorNotesHidden: 'Pending doctor review.'
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
          {isHindi ? 'पंजीकरण सफलतापूर्वक दर्ज' : 'Intake Triage Complete'}
        </h1>
        <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          {isHindi
            ? 'आपकी जानकारी ओपीडी परामर्श कक्ष को प्रेषित कर दी गई है। कृपया निर्धारित कक्ष में उपस्थित हों।'
            : 'Your symptoms and clinical intake have been transferred to the attending physician. Please proceed to the station below.'}
        </p>

        {/* Patient-Friendly ESI Triage Card (Feature 4D) */}
        {currentPatient.esiTriage && (
          <div
            className={`mt-6 p-4 rounded-xl border text-left ${
              currentPatient.esiTriage.level <= 2
                ? 'bg-red-50/80 border-red-200 text-red-950'
                : currentPatient.esiTriage.level === 3
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-blue-50/80 border-blue-200 text-blue-950'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-current">
                {isHindi ? `प्राथमिकता स्तर: ESI-${currentPatient.esiTriage.level}` : `Triage Priority: ESI-${currentPatient.esiTriage.level}`}
              </span>
              <span className="text-[10px] font-bold">
                {currentPatient.esiTriage.level <= 2
                  ? isHindi ? '🚨 तत्काल ध्यान अपेक्षित' : '🚨 Immediate Attention Required'
                  : currentPatient.esiTriage.level === 3
                  ? isHindi ? '⚠️ प्राथमिक परामर्श' : '⚠️ Priority Evaluation'
                  : isHindi ? '✓ नियमित परामर्श' : '✓ Standard Care'}
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed">
              {currentPatient.esiTriage.level <= 2
                ? isHindi
                  ? 'आपके लक्षणों के आधार पर आपको तत्काल प्राथमिकता दी गई है। कृपया सीधे नर्सिंग काउंटर या आपातकालीन कक्ष में संपर्क करें।'
                  : 'Based on your symptoms, your intake has been escalated to High Priority. Please inform the triage nurse immediately.'
                : isHindi
                ? 'आपकी जानकारी ओपीडी परामर्श कक्ष को प्रेषित कर दी गई है। कृपया निर्धारित कक्ष के बाहर प्रतीक्षा करें।'
                : 'Your intake details have been transmitted to the OPD desk. Diagnostic resources have been pre-allocated.'}
            </p>
          </div>
        )}

        {/* OPD Routing Box */}
        <div className="mt-6 p-6 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-900 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-2.5">
              <MapPin size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned OPD Station</span>
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
            <span>{isHindi ? 'रोगी डैशबोर्ड खोलें' : 'Open Patient Dashboard'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
