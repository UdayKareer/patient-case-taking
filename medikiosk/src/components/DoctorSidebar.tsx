import {
  Users,
  Stethoscope,
  AlertOctagon,
  Leaf,
  LogOut,
  Activity,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { usePatientStore, mockDatabase } from '../store/usePatientStore';

export type DoctorNavTab = 'consultation' | 'queue' | 'emergency' | 'ayush' | 'ipd';

interface DoctorSidebarProps {
  activeTab: DoctorNavTab;
  setActiveTab: (tab: DoctorNavTab) => void;
  onLogout: () => void;
}

export default function DoctorSidebar({ activeTab, setActiveTab, onLogout }: DoctorSidebarProps) {
  const { currentPatient } = usePatientStore();

  const allPatients = Object.values(mockDatabase);
  const emergencyCount = allPatients.filter((p) => p.triageLevel === 'emergency').length;
  const waitingCount = allPatients.filter((p) => p.status === 'waiting').length;
  const ayushCount = allPatients.filter((p) => p.mode === 'ayush').length;
  const ipdCount = allPatients.filter((p) => p.status === 'admitted').length;

  const navItems = [
    {
      id: 'consultation' as DoctorNavTab,
      label: 'Active Clinical Chart',
      subtext: currentPatient.token ? `Patient ${currentPatient.token}` : 'EMG-911 Open',
      icon: Stethoscope,
      badge: currentPatient.token || 'Active',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
    {
      id: 'queue' as DoctorNavTab,
      label: 'OPD Live Queue',
      subtext: 'Real-time patient flow',
      icon: Users,
      badge: `${waitingCount} Waiting`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'emergency' as DoctorNavTab,
      label: 'Emergency Triage Hub',
      subtext: 'High-acuity red flags',
      icon: AlertOctagon,
      badge: emergencyCount > 0 ? `${emergencyCount} Critical` : undefined,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse',
    },
    {
      id: 'ayush' as DoctorNavTab,
      label: 'AYUSH Integrative Desk',
      subtext: 'Prakriti & Agni pariksha',
      icon: Leaf,
      badge: `${ayushCount} Active`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'ipd' as DoctorNavTab,
      label: 'IPD / Admitted Ward',
      subtext: 'Manage admitted patients',
      icon: Building2,
      badge: `${ipdCount} Admitted`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/80 shrink-0 select-none">
      
      {/* Top Clinic Branding */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Activity size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white tracking-tight">MediKiosk</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                EHR v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Building2 size={11} className="text-slate-500" /> AIIMS Apex • OPD Room #14
            </p>
          </div>
        </div>

        {/* Doctor Profile Mini Card */}
        <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
              AS
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">Dr. Arvind Sharma, MD</div>
            <div className="text-[10px] text-slate-400 truncate">Internal Medicine & Triage</div>
          </div>
        </div>
      </div>

      {/* OPD Shift Status Ticker */}
      <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Clock size={12} className="text-teal-400" /> Morning Shift
        </span>
        <span className="font-mono text-emerald-400 font-semibold">08:00 - 14:00 (Active)</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 py-1">
          Clinical Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-teal-500/15 text-white border border-teal-500/30 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 shadow-xs'
                      : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{item.subtext}</div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ABDM & System Status Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-teal-400" /> ABDM Gateway
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
              Online (M1-M3)
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Time Saved / Patient</span>
            <span className="text-[11px] font-semibold text-teal-300 flex items-center gap-1">
              <Sparkles size={11} /> 12.2 min
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="mt-3 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <LogOut size={14} />
          End Doctor Session
        </button>
      </div>

    </aside>
  );
}
