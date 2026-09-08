import { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Copy,
  Activity,
  Stethoscope
} from 'lucide-react';
import type { UploadedDocument, DocumentMedication } from '../store/usePatientStore';

interface DocumentViewerModalProps {
  document: UploadedDocument | null;
  patientName: string;
  patientToken: string;
  onClose: () => void;
  onAddPrescription?: (med: { name: string; dose: string; frequency: string; duration: string; instructions: string }) => void;
  onAppendNotes?: (note: string) => void;
}

export default function DocumentViewerModal({
  document: doc,
  patientName,
  patientToken,
  onClose,
  onAddPrescription,
  onAppendNotes
}: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState(1);
  const [copiedNote, setCopiedNote] = useState(false);
  const [addedMeds, setAddedMeds] = useState<Record<number, boolean>>({});

  if (!doc) return null;

  const isPrescription = doc.type === 'Prescription' || doc.name.toLowerCase().includes('prescription');
  const isHandwritten = doc.isHandwritten ?? (isPrescription || doc.name.toLowerCase().includes('civil'));

  const handleAddMed = (med: DocumentMedication, index: number) => {
    if (onAddPrescription) {
      onAddPrescription({
        name: med.name,
        dose: med.dose || '1 Dose',
        frequency: med.frequency || '1-0-1',
        duration: '7 Days',
        instructions: 'As noted on previous scanned prescription'
      });
      setAddedMeds((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setAddedMeds((prev) => ({ ...prev, [index]: false }));
      }, 2500);
    }
  };

  const handleAppendToNotes = () => {
    if (onAppendNotes) {
      const summaryParts = [
        `\n[SCANNED ${doc.type.toUpperCase()}: ${doc.name} (${doc.date})]`,
        doc.extractedDiagnoses?.length ? `• Diagnoses Extracted: ${doc.extractedDiagnoses.join(', ')}` : '',
        doc.extractedMeds?.length ? `• Scanned Meds: ${doc.extractedMeds.map((m) => `${m.name} (${m.dose})`).join(', ')}` : '',
        isHandwritten ? `• Attending Review: Original handwritten script visually verified by physician.` : ''
      ].filter(Boolean).join('\n');

      onAppendNotes(summaryParts);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isPrescription ? 'bg-teal-700 text-white' : 'bg-blue-600 text-white'
            }`}>
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 truncate">{doc.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isPrescription ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {doc.type}
                </span>
                {isHandwritten && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                    <AlertTriangle size={11} className="text-amber-700" />
                    Handwritten / Cursive Scan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Patient: <span className="font-semibold text-slate-700">{patientName}</span> ({patientToken}) • Uploaded / Scanned Date: <span className="font-mono">{doc.date}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors shrink-0"
            title="Close viewer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Clinical Safety Alert Banner for Cursive / Ineligible Handwriting */}
        {isHandwritten ? (
          <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-600 shrink-0" />
              <span>
                <strong>Physician Visual Bypass:</strong> Cursive handwriting or irregular formatting detected. Digital entities have been partially structured below, and the original raw document is bypassed directly to you for bedside visual verification.
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-mono bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded">
              Raw Image Pass-Through
            </span>
          </div>
        ) : (
          <div className="bg-teal-50 border-b border-teal-200 px-6 py-2 flex items-center gap-2 text-xs text-teal-900 shrink-0">
            <CheckCircle2 size={15} className="text-teal-600 shrink-0" />
            <span>
              <strong>Digitized Record:</strong> Standard printed report. Parameters were indexed with high OCR confidence.
            </span>
          </div>
        )}

        {/* Main Split Body: Raw Document on Left | OCR Structured Analysis on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* LEFT 7 COLS: The Raw Document Viewer Canvas */}
          <div className="lg:col-span-7 bg-slate-900/95 flex flex-col border-r border-slate-200 overflow-hidden relative">
            
            {/* Canvas Toolbar */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0 z-10">
              <span className="font-semibold text-[11px] text-slate-400 flex items-center gap-1.5">
                <Activity size={13} className="text-teal-400" />
                Raw Uploaded Scan Viewport
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.2).toFixed(1))))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="font-mono text-[11px] px-2 text-slate-400 font-bold">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.2).toFixed(1))))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Document Surface Area */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-slate-900">
              <div
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
                className="shadow-2xl rounded-xl transition-transform"
              >
                {doc.fileUrl ? (
                  /* Real uploaded photo or base64 file */
                  <img
                    src={doc.fileUrl}
                    alt={doc.name}
                    className="max-w-full sm:max-w-lg rounded-xl shadow-lg border border-slate-700 object-contain bg-white"
                  />
                ) : isPrescription ? (
                  /* Authentic Realistic Simulated Prescription Scan */
                  <div className="w-[480px] bg-[#fcfcf9] p-7 rounded-xl border border-slate-300 shadow-2xl text-slate-900 font-serif select-none space-y-4 relative overflow-hidden">
                    {/* Background faint watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none text-9xl font-black rotate-[-30deg]">
                      RX
                    </div>

                    {/* Clinic Header */}
                    <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base tracking-wide uppercase text-slate-950 font-sans">
                          Government Civil Hospital OPD
                        </h3>
                        <p className="text-[11px] font-sans text-slate-600">Department of Internal Medicine & Allied Care</p>
                        <p className="text-[10px] font-sans text-slate-500">NH-24 Medical Enclave • Emergency 24/7</p>
                      </div>
                      <div className="text-right text-[10px] font-sans">
                        <div className="font-bold text-slate-900">Dr. K. S. Meena, MD</div>
                        <div className="text-slate-600">Reg. No: 41829 / MCI</div>
                        <div className="text-slate-500 mt-1 font-mono">Date: {doc.date}</div>
                      </div>
                    </div>

                    {/* Patient Strip */}
                    <div className="bg-slate-100/70 p-2.5 rounded border border-slate-200 text-xs font-sans grid grid-cols-3 gap-2">
                      <div><span className="text-slate-500">Name:</span> <strong>{patientName}</strong></div>
                      <div><span className="text-slate-500">Token:</span> <strong>{patientToken}</strong></div>
                      <div><span className="text-slate-500">Dept:</span> <strong>Medicine OPD #3</strong></div>
                    </div>

                    {/* Prescription Body */}
                    <div className="pt-2 space-y-3">
                      <div className="text-3xl font-bold italic text-slate-800 font-serif leading-none">
                        ℞
                      </div>

                      <div className="space-y-3 text-sm pl-4 leading-relaxed font-mono">
                        <div className="border-b border-slate-200 pb-2">
                          <span className="font-bold text-slate-950">1. Tab Pantocid 40mg</span>
                          <span className="block text-xs text-slate-600 font-sans">Sig: 1 tab OD (Morning before breakfast) x 14 days</span>
                        </div>

                        <div className="border-b border-slate-200 pb-2">
                          <span className="font-bold text-slate-950">2. Tab Dolo 650mg</span>
                          <span className="block text-xs text-slate-600 font-sans">Sig: 1 tab SOS (If severe joint or epigastric ache)</span>
                        </div>

                        {/* Simulated cursive handwriting item that tripped OCR */}
                        <div className="p-2.5 bg-amber-50/70 rounded-lg border border-dashed border-amber-300">
                          <div className="flex items-center justify-between text-[10px] font-sans font-bold text-amber-800 uppercase tracking-wider mb-1">
                            <span>Handwritten Clinical Note (Cursive script):</span>
                            <span className="text-amber-600">OCR Skipped (Cursive)</span>
                          </div>
                          <p className="italic font-serif text-sm text-slate-800 leading-snug">
                            "Advised Pitta-pacifying diet; avoid excessive tea & spicy meals. Quadriceps static exercises advised daily. Review after 3 weeks with repeat LFT & lipid panel."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Doctor Stamp & Signature */}
                    <div className="pt-6 flex items-end justify-between border-t border-slate-200">
                      <div className="border border-blue-600/40 text-blue-800 font-sans text-[9px] font-bold p-1.5 rounded uppercase tracking-wider text-center rotate-[-4deg]">
                        CIVIL HOSPITAL OPD<br />VERIFIED DISPARY
                      </div>
                      <div className="text-right font-sans">
                        <div className="font-serif italic text-lg text-blue-900 select-none pb-1">K.S. Meena</div>
                        <div className="text-[10px] text-slate-500 border-t border-slate-400 pt-0.5">Signature & Stamp</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Authentic Realistic Simulated Lab Report Scan */
                  <div className="w-[500px] bg-white p-7 rounded-xl border border-slate-300 shadow-2xl text-slate-900 select-none space-y-4">
                    {/* Lab Header */}
                    <div className="border-b-2 border-slate-800 pb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-black text-base uppercase text-blue-950 tracking-tight">
                          Max Diagnostic Pathology Labs
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium">NABL Accredited ISO-15189 Certified Clinical Lab</p>
                      </div>
                      <div className="text-right text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">NABL ACCREDITED</span>
                        <div className="text-slate-400 mt-1 font-mono">{doc.date}</div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs grid grid-cols-3 gap-2 font-mono">
                      <div><span className="text-slate-400">PATIENT:</span> <strong>{patientName}</strong></div>
                      <div><span className="text-slate-400">SAMPLE ID:</span> <strong>MX-98214</strong></div>
                      <div><span className="text-slate-400">REF BY:</span> <strong>Dr. Sharma</strong></div>
                    </div>

                    {/* Lab Table */}
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-[10px] uppercase font-bold text-slate-500">
                          <th className="py-2">Investigation</th>
                          <th className="py-2">Observed Value</th>
                          <th className="py-2">Units</th>
                          <th className="py-2">Biological Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-mono">
                        {doc.extractedLabs?.map((lab, i) => (
                          <tr key={i} className={lab.isOutOfRange ? 'bg-red-50/70 font-bold text-red-950' : ''}>
                            <td className="py-2 font-sans">{lab.test}</td>
                            <td className="py-2 font-bold">
                              {lab.value}
                              {lab.isOutOfRange && (
                                <span className="ml-1 text-[9px] px-1 bg-red-600 text-white rounded uppercase">High</span>
                              )}
                            </td>
                            <td className="py-2 text-slate-500">{lab.unit}</td>
                            <td className="py-2 text-slate-500 font-sans">{lab.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Signatures */}
                    <div className="pt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                      <div className="font-mono text-[10px]">Methodology: Enzymatic Hexokinase & Photometry</div>
                      <div className="text-right">
                        <div className="font-serif italic text-sm text-slate-800">Dr. A. Sen, MD Path</div>
                        <div className="text-[10px] text-slate-400">Senior Pathologist</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: OCR Structured Extraction & Physician Decision Tools */}
          <div className="lg:col-span-5 bg-white flex flex-col overflow-y-auto p-5 sm:p-6 space-y-5">
            
            {/* Header Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope size={16} className="text-teal-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  OCR Structured Entities
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Machine-extracted parameters from the raw document above. Compare against the visual scan on the left.
              </p>
            </div>

            {/* Extracted Diagnoses */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Extracted Diagnoses & Findings ({doc.extractedDiagnoses?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {doc.extractedDiagnoses?.length ? (
                  doc.extractedDiagnoses.map((d, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No formal diagnosis string identified.</span>
                )}
              </div>
            </div>

            {/* Extracted Medications with One-Click "Import to Rx Pad" */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Scanned Medications ({doc.extractedMeds?.length || 0})
                </span>
                <span className="text-[10px] text-slate-400">One-click import to chart</span>
              </div>

              {doc.extractedMeds && doc.extractedMeds.length > 0 ? (
                <div className="space-y-2">
                  {doc.extractedMeds.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex items-center justify-between gap-2 hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{med.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {med.dose} • {med.frequency}
                        </div>
                      </div>

                      {onAddPrescription && (
                        <button
                          onClick={() => handleAddMed(med, idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 shrink-0 ${
                            addedMeds[idx]
                              ? 'bg-emerald-600 text-white'
                              : 'bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-200'
                          }`}
                        >
                          {addedMeds[idx] ? (
                            <>
                              <CheckCircle2 size={12} /> Added
                            </>
                          ) : (
                            <>
                              <Plus size={12} /> Add to Rx
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                  {isPrescription
                    ? 'No printed medicines parsed. Cursive handwriting requires direct visual reading.'
                    : 'No medications in this diagnostic record.'}
                </div>
              )}
            </div>

            {/* Extracted Labs */}
            {doc.extractedLabs && doc.extractedLabs.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Scanned Lab Parameters ({doc.extractedLabs.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {doc.extractedLabs.map((l, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border text-xs ${
                        l.isOutOfRange ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-slate-700 truncate">{l.test}</div>
                      <div className="text-sm font-black mt-0.5">
                        {l.value} <span className="text-xs font-normal text-slate-500">{l.unit}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Ref: {l.range}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physician Action Bar */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5 mt-auto">
              <button
                onClick={handleAppendToNotes}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                  copiedNote
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-950 text-white'
                }`}
              >
                {copiedNote ? (
                  <>
                    <CheckCircle2 size={14} /> Document Appended to Consultation Notes
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Append Verified Summary to Doctor Notes
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors text-center"
              >
                Close Viewer
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
