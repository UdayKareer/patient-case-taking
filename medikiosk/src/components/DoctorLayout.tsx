import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DoctorSidebar, { type DoctorNavTab } from './DoctorSidebar';
import {
  Menu,
  X,
  Zap
} from 'lucide-react';
import { mockDatabase, usePatientStore } from '../store/usePatientStore';

export interface DoctorOutletContext {
  activeTab: DoctorNavTab;
  setActiveTab: (tab: DoctorNavTab) => void;
}

export default function DoctorLayout() {
  const navigate = useNavigate();
  const { currentPatient } = usePatientStore();
  const [activeTab, setActiveTab] = useState<DoctorNavTab>('consultation');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const emergencyCount = Object.values(mockDatabase).filter((p) => p.triageLevel === 'emergency').length;

  const handleLogout = () => {
    sessionStorage.removeItem('doctor_logged_in');
    navigate('/doctor/login');
  };

  return (
    <div className="h-screen max-h-screen bg-slate-900 flex font-sans text-slate-100 overflow-hidden">
      
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <DoctorSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 bg-slate-950 h-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <DoctorSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Top Clinical Utility Bar */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
          
          {/* Left: Mobile Toggle & Context Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">
                {currentPatient.hospitalName ? `${currentPatient.hospitalName} OPD` : 'Hospital OPD'}
              </span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-800 uppercase tracking-wide">
                {activeTab === 'consultation' && 'Active Chart & SOAP'}
                {activeTab === 'queue' && 'OPD Live Queue'}
                {activeTab === 'emergency' && 'Emergency Red Flags'}
                {activeTab === 'ayush' && 'AYUSH Integrative Desk'}
                {activeTab === 'ipd' && 'IPD / Admitted Ward'}
              </span>
            </div>
          </div>

          {/* Right: Emergency Alerts & Status */}
          <div className="flex items-center gap-3">
            {emergencyCount > 0 && (
              <button
                onClick={() => setActiveTab('emergency')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-200 rounded-full text-xs font-bold transition-all animate-pulse"
              >
                <Zap size={13} className="fill-red-600 text-red-600" />
                <span>{emergencyCount} Critical Triage Cases</span>
              </button>
            )}

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>EHR Cloud Synced</span>
              </div>
            </div>
          </div>

        </header>

        {/* Scrollable Clinical Stage */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain bg-slate-50/60 p-4 sm:p-6 lg:p-7" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Outlet context={{ activeTab, setActiveTab }} />
        </main>
      </div>

    </div>
  );
}
