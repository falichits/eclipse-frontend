import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Server, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { getBaseUrl, setBaseUrl, apiService } from '../services/api';

export default function ApiSettingsModal({
  isOpen,
  onClose,
  isOnline,
  isDemoMode,
  setIsDemoMode,
  onTriggerRefresh
}) {
  const [apiUrl, setApiUrlState] = useState(getBaseUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setBaseUrl(apiUrl);
    if (onTriggerRefresh) onTriggerRefresh();
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      setBaseUrl(apiUrl);
      const res = await apiService.checkHealth();
      setTestResult(res);
    } catch (err) {
      setTestResult({ online: false, error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-200">
              <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-white">
                API & DATABASE CONFIGURATION
              </h2>
              <p className="text-xs text-slate-400">
                Backend connection endpoint & demo mode toggle
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

        {/* Content */}
        <div className="py-5 space-y-4">
          
          {/* Status info */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">FastAPI Status:</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                {isOnline ? 'Online (Connected)' : 'Offline / Unreachable'}
              </span>
            </div>
          </div>

          {/* Database Info */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300">Database Engine:</span>
            </div>
            <span className="text-indigo-300 font-bold">
              PostgreSQL on Neon.tech
            </span>
          </div>

          {/* API Base URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 block">
              Backend API Base URL:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrlState(e.target.value)}
                placeholder="http://127.0.0.1:8000"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition flex items-center space-x-1"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Ping'}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Default: <code>http://127.0.0.1:8000</code> (FastAPI standard port)
            </span>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center space-x-2 ${
              testResult.online 
                ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' 
                : 'bg-rose-950/30 border-rose-800 text-rose-300'
            }`}>
              {testResult.online ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>
                {testResult.online 
                  ? 'Connection successful! Swagger docs responded.' 
                  : `Failed to connect: ${testResult.error || 'Server did not respond'}`}
              </span>
            </div>
          )}

          {/* Demo Mode Toggle */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Enable Fallback Demo Mode
              </span>
              <span className="text-[11px] text-slate-400">
                Populates dashboard with realistic preview data when database is empty
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              {isDemoMode ? (
                <ToggleRight className="w-7 h-7 text-cyan-400" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-slate-600" />
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition shadow-lg shadow-cyan-500/20"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
