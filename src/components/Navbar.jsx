import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  RefreshCw, 
  UploadCloud, 
  Server, 
  Settings, 
  Database,
  ExternalLink
} from 'lucide-react';

export default function Navbar({
  isOnline,
  isRefreshing,
  onRefresh,
  autoRefreshInterval,
  setAutoRefreshInterval,
  onOpenUpload,
  onOpenSettings,
  isDemoMode,
  backendUrl,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-rose-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-slate-100 font-mono">
                  ECLIPSE<span className="text-cyan-400">.IDS</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  v1.0-SOC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Intrusion Detection System Dashboard &bull; Praktikum ML
              </p>
            </div>
          </div>

          {/* Center Team Role Badges */}
          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">Data:</span>
              <span className="font-medium text-slate-200">Hilal</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span className="text-slate-400">Backend:</span>
              <span className="font-medium text-slate-200">Mahda</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/50 text-cyan-200 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-cyan-300">Frontend:</span>
              <span className="font-medium text-white">Falich</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Status indicator */}
            <div 
              onClick={onOpenSettings}
              className="cursor-pointer group flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition"
              title="Click to view API settings & database status"
            >
              <span className={`w-2 h-2 rounded-full ${
                isOnline 
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                  : isDemoMode 
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' 
                    : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
              }`} />
              <span className="text-xs font-mono hidden md:inline text-slate-300">
                {isOnline ? 'Neon Online' : isDemoMode ? 'Demo Mode' : 'Backend Offline'}
              </span>
            </div>

            {/* Auto refresh dropdown */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="bg-transparent text-xs text-slate-300 font-mono py-1 px-2 focus:outline-none cursor-pointer"
                aria-label="Auto refresh interval"
              >
                <option value={0} className="bg-slate-900 text-slate-200">Auto: OFF</option>
                <option value={5000} className="bg-slate-900 text-slate-200">5s</option>
                <option value={10000} className="bg-slate-900 text-slate-200">10s</option>
                <option value={30000} className="bg-slate-900 text-slate-200">30s</option>
              </select>
            </div>

            {/* Manual refresh button */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition focus:outline-none"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Settings button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition focus:outline-none"
              title="API & Database Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Upload CSV Action Button */}
            <button
              type="button"
              onClick={onOpenUpload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="font-semibold">Upload CSV</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
