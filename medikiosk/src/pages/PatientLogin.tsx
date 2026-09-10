import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HeartPulse, User, Calendar, UserRound, Sparkles } from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';
import { getTranslations } from '../data/regionalTranslations';

export default function PatientLogin() {
  const navigate = useNavigate();
  const { loginProfile, checkProfileExists, currentPatient, resetDemoSession } = usePatientStore();
  const t = getTranslations(currentPatient.language);

  const [loginId, setLoginId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regData, setRegData] = useState({ name: '', age: '', gender: 'Male' });

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
              {t.login.portalTitle}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {t.login.portalSub}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          {isRegistering 
            ? t.login.noRecordFound
            : t.login.loginDesc}
        </p>

        {!isRegistering ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                {t.login.phoneOrAbha}
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
              <span>{t.login.continueBtn}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t.login.fullName}</label>
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
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t.login.age}</label>
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
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t.login.gender}</label>
                <select
                  value={regData.gender}
                  onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all outline-none"
                >
                  <option value="Male">{t.login.male}</option>
                  <option value="Female">{t.login.female}</option>
                  <option value="Other">{t.login.other}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!regData.name.trim() || !regData.age.trim()}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>{t.login.registerBtn}</span>
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
        
        {/* Demo Helper & Multi-Persona Selector */}
        {!isRegistering && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-bold flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span>Demo Personas (1-Click):</span>
              </span>
              <button
                type="button"
                onClick={() => navigate('/demo')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                <span>Demo Control Hub</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  resetDemoSession();
                  loginProfile('9811223344');
                  navigate('/patient/dashboard');
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 text-left transition-all shadow-2xs group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-blue-700">#1 Ramesh Kumar</div>
                <div className="text-[10px] text-red-600 font-mono font-medium">9811223344 • Cardiac</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetDemoSession();
                  loginProfile('9844332211');
                  navigate('/patient/dashboard');
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-300 text-left transition-all shadow-2xs group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-emerald-700">#2 Sunita Devi</div>
                <div className="text-[10px] text-emerald-700 font-mono font-medium">9844332211 • AYUSH</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetDemoSession();
                  loginProfile('9765432100');
                  navigate('/patient/dashboard');
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/90 hover:border-amber-300 text-left transition-all shadow-2xs group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-amber-700">#3 Aarav Patel</div>
                <div className="text-[10px] text-amber-700 font-mono font-medium">9765432100 • Asthma</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetDemoSession();
                  loginProfile('9833445566');
                  navigate('/patient/dashboard');
                }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/90 hover:border-purple-300 text-left transition-all shadow-2xs group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-purple-700">#4 Pooja Mehra</div>
                <div className="text-[10px] text-purple-700 font-mono font-medium">9833445566 • Migraine</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
