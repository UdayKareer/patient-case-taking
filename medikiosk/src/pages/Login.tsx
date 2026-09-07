import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorId.trim() && password.trim()) {
      // Mock login check
      if (doctorId === 'doctor' && password === 'admin') {
        sessionStorage.setItem('doctor_logged_in', 'true');
        navigate('/doctor');
      } else {
        setError('Invalid Doctor ID or password. Use doctor / admin');
      }
    } else {
      setError('Please fill in both fields');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Hospital Institutional Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center gap-3.5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white/10">
            <Stethoscope size={19} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Clinical EMR Access</h1>
            <p className="text-[11px] text-slate-400 font-medium">AIIMS OPD Doctor Workstation</p>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 text-red-800 text-xs rounded-lg flex items-start gap-2 border border-red-200/80">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor ID / License No.</label>
              <input
                type="text"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                placeholder="e.g. doctor"
                className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all"
                />
                <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-xs text-sm mt-2"
            >
              Sign In to Workstation
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            Demo credentials: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">doctor / admin</code>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Official Clinical System • Authorized Medical Personnel Only
        </div>
      </div>
    </div>
  );
}
