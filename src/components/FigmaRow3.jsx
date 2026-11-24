import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function FigmaRow3({ targetedAssets, topAttackers, activeFilter = '24 Jam' }) {
  // Figma default rows (fallback for Dummy Data mode)
  const defaultAssets = [
    { ip: '10.0.4.12', service: 'Web Gateway', count: '8.412' },
    { ip: '10.0.7.31', service: 'API Auth', count: '5.240' },
    { ip: '10.0.2.8', service: 'Database Utama', count: '3.678' },
  ];

  const defaultAttackers = [
    {
      ip: '203.0.113.44',
      origin: 'Rusia',
      attempts: '3.984',
      status: 'Kritis',
      badgeClass: 'bg-[#3B1F26] border-[#F87171] text-[#FCA5A5]',
    },
    {
      ip: '198.51.100.17',
      origin: 'Brazil',
      attempts: '2.481',
      status: 'Tinggi',
      badgeClass: 'bg-[#3A2A18] border-[#FB923C] text-[#FDBA74]',
    },
    {
      ip: '192.0.2.88',
      origin: 'Vietnam',
      attempts: '1.540',
      status: 'Sedang',
      badgeClass: 'bg-[#38330F] border-[#FACC15] text-[#FDE047]',
    },
  ];

  const assetsList = targetedAssets !== undefined && targetedAssets !== null ? targetedAssets : defaultAssets;
  const attackersList = topAttackers !== undefined && topAttackers !== null ? topAttackers : defaultAttackers;

  return (
    <div className="flex flex-row items-start p-0 gap-4 w-full h-[194px]">
      
      {/* 1. Panel / Aset yang Diserang (Width: 688px / flex-1) */}
      <div className="box-border flex flex-col items-start p-4 gap-3 flex-1 h-[194px] bg-[#111A22] border border-[#243241] rounded-[8px] overflow-hidden">
        
        {/* Panel Header */}
        <div className="flex flex-row justify-between items-center w-full h-[20px]">
          <div className="flex flex-row items-center gap-2">
            <div className="w-[2px] h-[8px] bg-[#2DD4BF]" />
            <span className="font-['Geist'] font-semibold text-[14px] leading-[20px] text-[#E8EEF4]">
              Aset yang Diserang
            </span>
          </div>
          <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
            3 teratas, {activeFilter.toLowerCase()}
          </span>
        </div>

        {/* Tabel atau Empty State */}
        {assetsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-[120px] gap-2 text-center">
            <ShieldCheck className="w-6 h-6 text-[#2DD4BF]" />
            <p className="font-['Geist'] text-xs text-[#E8EEF4] font-medium">
              Tidak Ada Aset yang Mengalami Serangan
            </p>
            <p className="font-['Geist'] text-[11px] text-[#98A9BA]">
              Seluruh node dan gateway server dalam kondisi aman pada rentang {activeFilter.toLowerCase()} ini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-start p-0 w-full">
            {/* Table Header */}
            <div className="box-border flex flex-row items-center px-3 py-1 gap-3 w-full h-[32px] border-b border-[#35485A]">
              <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
                IP Aset
              </span>
              <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
                Layanan
              </span>
              <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA] text-right">
                Serangan
              </span>
            </div>

            {/* Table Rows */}
            {assetsList.slice(0, 3).map((row, idx) => (
              <div
                key={idx}
                className="box-border flex flex-row items-center px-3 py-1 gap-3 w-full h-[32px] border-b border-[#243241] last:border-b-0 hover:bg-[#18242F]/50 transition"
              >
                <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4]">
                  {row.ip}
                </span>
                <span className="flex-1 font-['Geist'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
                  {row.service || 'Web Service'}
                </span>
                <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4] text-right">
                  {typeof row.count === 'number' ? row.count.toLocaleString('id-ID') : row.count}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 2. Panel / Alamat Penyerang (Width: 688px / flex-1) */}
      <div className="box-border flex flex-col items-start p-4 gap-3 flex-1 h-[194px] bg-[#111A22] border border-[#243241] rounded-[8px] overflow-hidden">
        
        {/* Panel Header */}
        <div className="flex flex-row justify-between items-center w-full h-[20px]">
          <div className="flex flex-row items-center gap-2">
            <div className="w-[2px] h-[8px] bg-[#2DD4BF]" />
            <span className="font-['Geist'] font-semibold text-[14px] leading-[20px] text-[#E8EEF4]">
              Alamat Penyerang
            </span>
          </div>
          <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
            3 teratas, {activeFilter.toLowerCase()}
          </span>
        </div>

        {/* Tabel atau Empty State */}
        {attackersList.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-[120px] gap-2 text-center">
            <ShieldCheck className="w-6 h-6 text-[#2DD4BF]" />
            <p className="font-['Geist'] text-xs text-[#E8EEF4] font-medium">
              Tidak Terdeteksi Aktivitas Penyerang Aktif
            </p>
            <p className="font-['Geist'] text-[11px] text-[#98A9BA]">
              Tidak ada anomali IP penyerang yang terekam pada rentang {activeFilter.toLowerCase()} ini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-start p-0 w-full">
            {/* Table Header */}
            <div className="box-border flex flex-row items-center px-3 py-1 gap-3 w-full h-[32px] border-b border-[#35485A]">
              <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
                IP Penyerang
              </span>
              <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
                Perkiraan Asal
              </span>
              <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA] text-right">
                Percobaan
              </span>
              <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA] text-right pr-2">
                Status
              </span>
            </div>

            {/* Table Rows */}
            {attackersList.slice(0, 3).map((row, idx) => {
              const badgeClass = row.badgeClass || (
                row.status === 'Kritis' 
                  ? 'bg-[#3B1F26] border-[#F87171] text-[#FCA5A5]' 
                  : row.status === 'Tinggi' 
                  ? 'bg-[#3A2A18] border-[#FB923C] text-[#FDBA74]' 
                  : 'bg-[#38330F] border-[#FACC15] text-[#FDE047]'
              );

              return (
                <div
                  key={idx}
                  className="box-border flex flex-row items-center px-3 py-1 gap-3 w-full h-[32px] border-b border-[#243241] last:border-b-0 hover:bg-[#18242F]/50 transition"
                >
                  <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4]">
                    {row.ip}
                  </span>
                  <span className="flex-1 font-['Geist'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
                    {row.origin || 'External'}
                  </span>
                  <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4] text-right">
                    {typeof row.attempts === 'number' ? row.attempts.toLocaleString('id-ID') : row.attempts}
                  </span>
                  <div className="flex-1 flex justify-end pr-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] border text-[11px] font-['Geist'] font-medium leading-[14px] ${badgeClass}`}>
                      {row.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
