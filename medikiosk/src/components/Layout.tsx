import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Volume2, VolumeX, Globe, Check, X, ChevronDown } from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';
import { SUPPORTED_LANGUAGES, getLanguageInfo, type SupportedLanguage } from '../data/regionalTranslations';

export default function Layout() {
  const navigate = useNavigate();
  const { currentPatient, setLanguage, soundEnabled, setSoundEnabled } = usePatientStore();
  const [showLangModal, setShowLangModal] = useState(false);

  const currentLangInfo = getLanguageInfo(currentPatient.language);

  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setShowLangModal(false);
  };

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
              Clinical Intake & Triage Platform • {currentPatient.hospitalName || 'National Health OPD'}
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

          {/* Regional Language Selector Button */}
          <button
            type="button"
            onClick={() => setShowLangModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 rounded-lg text-xs font-bold text-slate-800 transition-all shadow-2xs cursor-pointer"
            title="Choose Regional Language"
          >
            <Globe size={14} className="text-blue-600" />
            <span className="text-sm font-semibold">{currentLangInfo.nativeName}</span>
            <span className="text-[10px] text-slate-500 uppercase font-mono hidden xs:inline">({currentLangInfo.name})</span>
            <ChevronDown size={13} className="text-slate-400 ml-0.5" />
          </button>
        </div>
      </header>

      {/* 10 Regional Languages Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Globe size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Choose Language / भाषा चुनें</h3>
                  <p className="text-xs text-slate-500 font-medium">Select your preferred regional language for voice intake</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLangModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Language Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentPatient.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500/80 shadow-xs ring-1 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 leading-tight">
                          {lang.nativeName}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          ({lang.name})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5 font-normal">
                        {lang.region}
                      </span>
                    </div>

                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check size={14} strokeWidth={2.5} />
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                        {lang.code}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Natural voice synthesis and Groq Whisper transcription enabled in all 10 languages
              </p>
            </div>
          </div>
        </div>
      )}

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
