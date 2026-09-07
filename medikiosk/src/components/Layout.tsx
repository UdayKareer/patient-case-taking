import { Outlet, useNavigate } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Volume2, VolumeX } from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';

export default function Layout() {
  const navigate = useNavigate();
  const { currentPatient, setLanguage, soundEnabled, setSoundEnabled } = usePatientStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        
        {/* Brand & Mission */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Stethoscope size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">MediKiosk</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-200/70">
                <ShieldCheck size={13} className="text-blue-600" /> ABDM Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal hidden sm:block">
              Clinical Intake & Triage Platform • AIIMS OPD
            </p>
          </div>
        </div>

        {/* Right Tools: Language & Audio */}
        <div className="flex items-center gap-2">
          {/* Audio TTS toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title={soundEnabled ? 'Voice Guidance Active' : 'Voice Muted'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Bilingual Language Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                currentPatient.language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                currentPatient.language === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/40">
        DPDP Act 2023 & Ayushman Bharat Digital Mission (ABDM) Standards Compliant • All health data strictly encrypted
      </footer>
    </div>
  );
}
