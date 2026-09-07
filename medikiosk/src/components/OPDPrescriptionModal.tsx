import { X, Printer, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { PatientData } from '../store/usePatientStore';

interface OPDPrescriptionModalProps {
  patient: PatientData;
  doctorNotes: string;
  prescribedMeds: Array<{
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  onClose: () => void;
}

export default function OPDPrescriptionModal({
  patient,
  doctorNotes,
  prescribedMeds,
  onClose,
}: OPDPrescriptionModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Action Bar (Hidden on print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Official OPD Prescription Slip • Print Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Printer size={15} />
              Print Prescription
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Prescription Paper Surface */}
        <div className="p-8 sm:p-10 bg-white text-slate-900 font-sans print:p-0">
          
          {/* Hospital Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-900 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0">
                +
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-950 uppercase leading-tight">
                  AIIMS APEX CLINICAL CENTER
                </h1>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mt-0.5">
                  Outpatient Department (OPD) • General Medicine & Triage Unit
                </p>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5">
                  Ansari Nagar, New Delhi - 110029 • ABDM Facility ID: DL-ND-AIIMS-001
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right w-full sm:w-auto bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
              <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg border border-slate-300 text-slate-900 font-mono text-sm font-black">
                TOKEN: {patient.token}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Date: {currentDate}</p>
              <p className="text-[11px] font-semibold text-teal-700">ABHA: {patient.abhaId}</p>
            </div>
          </div>

          {/* Patient Demographics Strip */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
            <div>
              <span className="text-slate-500 font-medium block">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{patient.name || 'Walk-in Patient'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Age / Gender</span>
              <span className="font-bold text-slate-900">{patient.age} Yrs / {patient.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Phone Number</span>
              <span className="font-mono text-slate-900 font-medium">{patient.phone || '98XXXXXXXX'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">OPD Triage</span>
              <span className={`inline-flex items-center gap-1 font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                patient.triageLevel === 'emergency'
                  ? 'bg-red-100 text-red-800'
                  : patient.triageLevel === 'priority'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {patient.triageLevel}
              </span>
            </div>
          </div>

          {/* Allergy Warning Banner if any */}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border-2 border-red-300 rounded-xl flex items-center gap-2.5 text-red-900 text-xs">
              <AlertTriangle size={18} className="text-red-600 shrink-0 animate-pulse" />
              <div>
                <strong className="font-bold uppercase tracking-wider">Known Drug Allergies: </strong>
                {patient.allergies.map(a => `${a.allergen} (${a.reaction} - ${a.severity})`).join(', ')}
              </div>
            </div>
          )}

          {/* Chief Complaint & History */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
              Presenting Clinical Complaint & History
            </h3>
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {patient.chiefComplaint}
            </p>
            {patient.structuredSummary?.hpi && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {patient.structuredSummary.hpi}
              </p>
            )}
          </div>

          {/* Chronic Diseases */}
          {patient.chronicConditions && patient.chronicConditions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                Past Medical History & Comorbidities
              </h3>
              <div className="flex flex-wrap gap-2">
                {patient.chronicConditions.map((c, i) => (
                  <span key={i} className="text-xs bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-slate-800 font-medium">
                    <strong>{c.condition}</strong> ({c.duration}) - {c.medication}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rx Prescription Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1 mb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="text-lg font-serif italic">℞</span> Medications Prescribed
              </h3>
              <span className="text-[11px] text-slate-500">Meds / Posology</span>
            </div>

            {prescribedMeds.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Medicine Name & Strength</th>
                      <th className="p-2.5">Dosing Frequency</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescribedMeds.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">{med.name} <span className="font-normal text-slate-600">({med.dose})</span></td>
                        <td className="p-2.5 font-semibold text-teal-700">{med.frequency}</td>
                        <td className="p-2.5 text-slate-700">{med.duration}</td>
                        <td className="p-2.5 text-slate-600 italic">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 italic border border-slate-200">
                No specific medicines prescribed yet. Use the Rx Order pad in chart.
              </div>
            )}
          </div>

          {/* Doctor Advice / Clinical Plan */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
              Clinical Advice & Investigations Ordered
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {doctorNotes || 'Routine follow-up in OPD after 7 days. Review SOS if symptoms worsen.'}
            </p>
          </div>

          {/* Footer Signature Strip */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
            <div className="text-[11px] text-slate-500">
              <p className="flex items-center gap-1 font-semibold text-teal-700">
                <ShieldCheck size={13} /> ABDM FHIR R4 Digitally Verified
              </p>
              <p>Generated via MediKiosk Clinical Pre-Elicitation System</p>
              <p className="font-mono text-[10px] text-slate-400 mt-1">Doc ID: {patient.patientId}-RX</p>
            </div>

            <div className="text-right">
              <div className="w-36 border-b border-slate-900 mb-1 ml-auto" />
              <p className="font-bold text-xs text-slate-900">Dr. Arvind Sharma, MD</p>
              <p className="text-[10px] text-slate-500">Reg. No: NMC-48291 • Internal Medicine</p>
              <p className="text-[10px] text-slate-500">AIIMS New Delhi</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
