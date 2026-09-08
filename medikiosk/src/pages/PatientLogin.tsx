import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HeartPulse, User, Calendar, UserRound, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';

export default function PatientLogin() {
  const navigate = useNavigate();
  const { loginProfile, checkProfileExists, currentPatient, resetDemoSession } = usePatientStore();
  const isHindi = currentPatient.language === 'hi';

  const [loginId, setLoginId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regData, setRegData] = useState({ name: '', age: '', gender: 'Male' });
  const [resetFeedback, setResetFeedback] = useState('');

  const handleQuickDemoLogin = () => {
    resetDemoSession();
    loginProfile('9811223344');
    navigate('/patient/dashboard');
  };

  const handleManualResetDemo = () => {
    resetDemoSession();
    setLoginId('');
    setResetFeedback(isHindi ? '✅ डेमो सत्र रीसेट कर दिया गया है!' : '✅ Demo session freshly reset! All past consultation data cleared.');
    setTimeout(() => setResetFeedback(''), 4000);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) return;

    if (checkProfileExists(loginId)) {
      loginProfile(loginId);
      navigate('/patient/dashboard');
    } else {
      setIsRegistering(true);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !regData.name.trim() || !regData.age.trim()) return;
    
    loginProfile(loginId, regData);
    navigate('/patient/dashboard');
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-md mx-auto mt-8">
      
      {/* Login Card */}
      <div className="bg-white p-6 sm:p-8 border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <HeartPulse size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {isHindi ? 'रोगी पोर्टल' : 'Patient OPD Portal'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isHindi ? 'आभा और ओपीडी सहायता' : 'ABDM & Clinical Intake Services'}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          {isRegistering 
            ? (isHindi ? 'खाता नहीं मिला। कृपया नीचे विवरण दर्ज करके रजिस्टर करें।' : 'No prior OPD record found for this number. Please register your details below.')
            : (isHindi ? 'स्वास्थ्य रिकॉर्ड, ई-पर्चे और ओपीडी टोकन के लिए लॉगिन करें।' : 'Sign in to access your OPD token, clinical summary, and digital prescriptions.')}
        </p>

        {!isRegistering ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                {isHindi ? 'फ़ोन नंबर या आभा आईडी दर्ज करें' : 'Phone Number or ABHA Address'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. 9811223344"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!loginId.trim()}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{isHindi ? 'आगे बढ़ें' : 'Continue / Next'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Full Name</label>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="e.g. Aarav Patel"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="number"
                    value={regData.age}
                    onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                    placeholder="e.g. 35"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Gender</label>
                <select
                  value={regData.gender}
                  onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!regData.name.trim() || !regData.age.trim()}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>{isHindi ? 'रजिस्टर करें' : 'Create Record & Register'}</span>
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="w-full py-2 text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ABDM Verified Integration
          </span>
          <span className="text-[11px] text-slate-400 font-mono">256-bit SSL</span>
        </div>
        
        {/* Demo Helper & 1-Click Presentation Controls */}
        {!isRegistering && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] text-slate-600 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Sparkles size={13} className="text-amber-500" />
                <span>SIH Demo & Presentation Profile:</span>
              </span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                9811223344
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ramesh Sharma (Known T2DM + HTN history with verified lab reports). Each demonstration session starts fresh without lingering test inputs.
            </p>

            {resetFeedback && (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5 text-[11px] animate-fade-in">
                <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                <span>{resetFeedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Quick Demo Login</span>
              </button>

              <button
                type="button"
                onClick={handleManualResetDemo}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Demo Session</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
