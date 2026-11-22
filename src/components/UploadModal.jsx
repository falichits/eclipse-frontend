import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  BrainCircuit,
  Database
} from 'lucide-react';
import { apiService } from '../services/api';
import { downloadSampleCsv } from '../utils/sampleCsv';

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setErrorMsg('Please select a valid CSV file (.csv).');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMsg(null);
      setUploadResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.csv')) {
        setErrorMsg('Please select a valid CSV file (.csv).');
        return;
      }
      setSelectedFile(file);
      setErrorMsg(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMsg(null);
    setUploadResult(null);

    try {
      const res = await apiService.uploadCsv(selectedFile, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      setUploadResult(res);
      setIsUploading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setIsUploading(false);
      setErrorMsg(err.response?.data?.detail || err.message || 'Failed to upload and analyze CSV.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setErrorMsg(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-white">
                ANALYZE NEW TRAFFIC CSV
              </h2>
              <p className="text-xs text-slate-400">
                Predict network flows with Hilal's ML model and store into Neon DB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-4">
          
          {/* Architecture note */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
            <BrainCircuit className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">ML Pipeline:</span> The CSV is ingested by Mahda's FastAPI backend, sent to Hilal's ML model API (77 extracted flow features), and the predictions are written into Neon PostgreSQL.
            </div>
          </div>

          {/* Drag & Drop Zone */}
          {!uploadResult ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                selectedFile 
                  ? 'border-cyan-500/60 bg-cyan-950/10' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <FileSpreadsheet className="w-10 h-10 text-cyan-400 mb-2" />
                  <p className="text-sm font-bold font-mono text-slate-200">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready for inference
                  </p>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="text-xs text-rose-400 hover:underline mt-2 font-mono"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-10 h-10 text-slate-500 mb-2" />
                  <p className="text-sm font-medium text-slate-200">
                    Click to browse or drop CSV file here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accepts network traffic CSV containing flow features
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Success Card */
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>{uploadResult.message || 'Analysis Complete!'}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">TOTAL ROWS</span>
                  <span className="text-base font-bold text-white">{uploadResult.total_rows}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40">
                  <span className="text-rose-400 block text-[10px]">ATTACKS</span>
                  <span className="text-base font-bold text-rose-300">{uploadResult.detected_attacks}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                  <span className="text-emerald-400 block text-[10px]">BENIGN</span>
                  <span className="text-base font-bold text-emerald-300">{uploadResult.detected_benign}</span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-cyan-400">
                <span>Sending to FastAPI & Hilal Model...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start space-x-2 text-xs text-rose-300 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Download Sample Helper */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs">
            <span className="text-slate-400">Need a valid test CSV formatted with 77 features?</span>
            <button
              type="button"
              onClick={() => downloadSampleCsv()}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Sample CSV</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
          >
            {uploadResult ? 'Done' : 'Cancel'}
          </button>

          {!uploadResult ? (
            <button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs font-mono transition shadow-lg shadow-cyan-500/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Start AI Analysis</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition"
            >
              Upload Another
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
