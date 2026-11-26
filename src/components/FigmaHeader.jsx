import React from 'react';
import { RefreshCw, UploadCloud, Settings, Database } from 'lucide-react';

export default function FigmaHeader({
  activeFilter,
  setActiveFilter,
  isLiveMode,
  setIsLiveMode,
  lastUpdatedTime,
  onRefresh,
  isRefreshing,
  onOpenUpload,
  onOpenSettings,
  isOnline
}) {
  return (
    <header className="box-border flex flex-row justify-between items-center px-6 py-2 w-full max-w-[1440px] h-[64px] bg-[#111A22] border-b border-[#243241] mx-auto select-none">
      
      {/* Header Left */}
      <div className="flex flex-row items-center p-0 gap-4 h-[28px]">
        {/* Judul */}
        <h1 className="font-['Geist'] font-semibold text-[20px] leading-[28px] text-[#E8EEF4] m-0 tracking-normal whitespace-nowrap">
          Eclipse IDS — Monitoring Serangan Jaringan
        </h1>

        {/* Tag DUMMY DATA / LIVE DATA */}
        <button
          type="button"
          onClick={() => setIsLiveMode(!isLiveMode)}
          className="box-border flex flex-row items-center px-2 py-1 h-[26px] border border-[#35485A] hover:border-[#2DD4BF] rounded-[4px] bg-transparent cursor-pointer transition"
          title="Klik untuk beralih antara Mode Demo & Live Neon Data"
        >
          <span className={`font-['Geist_Mono'] font-medium text-[12px] leading-[16px] uppercase tracking-wide ${
            isLiveMode ? 'text-[#2DD4BF]' : 'text-[#98A9BA]'
          }`}>
            {isLiveMode ? 'LIVE NEON' : 'DUMMY DATA'}
          </span>
        </button>
      </div>

      {/* Header Right */}
      <div className="flex flex-row items-center p-0 gap-6 h-[44px]">
        
        {/* Filter Waktu */}
        <div className="flex flex-row items-center p-0 gap-2 h-[44px]">
          {['1 Jam', '24 Jam', '7 Hari'].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`box-border flex flex-row justify-center items-center px-4 min-w-[44px] h-[44px] rounded-[8px] cursor-pointer transition font-['Geist'] font-medium text-[12px] leading-[16px] ${
                  isActive
                    ? 'bg-[#0B2E2B] border border-[#2DD4BF] text-[#2DD4BF]'
                    : 'bg-[#111A22] border border-[#35485A] text-[#E8EEF4] hover:border-[#4B637B]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Status Model */}
        <div className="flex flex-row items-center p-0 gap-2 h-[16px]">
          <div className={`w-[8px] h-[8px] rounded-full shrink-0 ${
            isOnline 
              ? 'bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]' 
              : 'bg-[#F87171] shadow-[0_0_8px_#F87171]'
          }`} />
          <span className="font-['Geist'] font-medium text-[12px] leading-[16px] text-[#E8EEF4] whitespace-nowrap">
            {isOnline ? 'Model ML: Aktif' : 'Model ML: Offline'}
          </span>
        </div>

        {/* Pembaruan */}
        <div className="flex flex-row items-center p-0 gap-2 h-[16px]">
          <button
            type="button"
            onClick={onRefresh}
            className="p-0 border-0 bg-transparent text-[#98A9BA] hover:text-[#E8EEF4] cursor-pointer transition"
            title="Klik untuk perbarui data"
          >
            <RefreshCw className={`w-[14px] h-[14px] ${isRefreshing ? 'animate-spin text-[#2DD4BF]' : ''}`} />
          </button>
          <span className="font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#98A9BA] whitespace-nowrap">
            Diperbarui: {lastUpdatedTime}
          </span>
        </div>

        {/* Quick Actions (Upload & Settings) */}
        <div className="flex flex-row items-center gap-2">
          <button
            type="button"
            onClick={onOpenUpload}
            className="flex flex-row items-center gap-1.5 px-3 py-1.5 h-[32px] rounded-[6px] bg-[#18242F] hover:bg-[#243241] border border-[#35485A] text-[#2DD4BF] font-['Geist'] font-medium text-[12px] cursor-pointer transition"
            title="Upload CSV untuk analisis model CNN"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 h-[32px] w-[32px] flex items-center justify-center rounded-[6px] bg-[#18242F] hover:bg-[#243241] border border-[#35485A] text-[#98A9BA] hover:text-[#E8EEF4] cursor-pointer transition"
            title="Pengaturan Koneksi API & DB"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </header>
  );
}
