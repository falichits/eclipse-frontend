import React from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export default function FigmaRow4({ recentAlerts, modelPerformance }) {
  // Figma default alerts
  const defaultAlerts = [
    {
      time: '14:32:08',
      src: '203.0.113.44',
      dst: '10.0.4.12',
      score: '0,98',
      severity: 'Kritis',
      badgeClass: 'bg-[#3B1F26] border-[#F87171] text-[#FCA5A5]',
    },
    {
      time: '14:29:41',
      src: '198.51.100.17',
      dst: '10.0.7.31',
      score: '0,91',
      severity: 'Tinggi',
      badgeClass: 'bg-[#3A2A18] border-[#FB923C] text-[#FDBA74]',
    },
    {
      time: '14:27:15',
      src: '192.0.2.88',
      dst: '10.0.2.8',
      score: '0,85',
      severity: 'Sedang',
      badgeClass: 'bg-[#38330F] border-[#FACC15] text-[#FDE047]',
    },
    {
      time: '14:24:52',
      src: '192.0.2.14',
      dst: '10.0.4.12',
      score: '0,72',
      severity: 'Rendah',
      badgeClass: 'bg-[#243241] border-[#7B8EA0] text-[#BFD0E0]',
    },
  ];

  const alertsList = (recentAlerts && recentAlerts.length > 0) ? recentAlerts : defaultAlerts;

  const accuracy = modelPerformance?.accuracy || '[REAL DATA: 800/1000]';
  const fpr = modelPerformance?.fpr || '[REAL DATA: 400/1000]';
  const dailyPredictions = modelPerformance?.dailyPredictions || '48.330';

  return (
    <div className="flex flex-row items-start p-0 gap-4 w-full h-[226px]">
      
      {/* 1. Panel / Alert Terbaru (Width: 976px / flex-1) */}
      <div className="box-border flex flex-col items-start p-4 gap-3 flex-1 h-[226px] bg-[#111A22] border border-[#243241] rounded-[8px] overflow-hidden">
        
        {/* Panel Header */}
        <div className="flex flex-row justify-between items-center w-full h-[20px]">
          <div className="flex flex-row items-center gap-2">
            <div className="w-[2px] h-[8px] bg-[#2DD4BF]" />
            <span className="font-['Geist'] font-semibold text-[14px] leading-[20px] text-[#E8EEF4]">
              Alert Terbaru
            </span>
          </div>
          <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
            4 teratas
          </span>
        </div>

        {/* Tabel Alert */}
        <div className="flex flex-col items-start p-0 w-full">
          {/* Table Header */}
          <div className="box-border flex flex-row items-center px-3 py-1 gap-3 w-full h-[32px] border-b border-[#35485A]">
            <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
              Waktu
            </span>
            <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
              IP Sumber
            </span>
            <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
              IP Tujuan
            </span>
            <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA] text-right">
              Confidence
            </span>
            <span className="flex-1 font-['Geist'] font-medium text-[12px] leading-[16px] text-[#98A9BA] text-right pr-2">
              Severity
            </span>
          </div>

          {/* Table Rows */}
          {alertsList.slice(0, 4).map((row, idx) => (
            <div
              key={idx}
              className="box-border flex flex-row items-center px-3 py-1 gap-3 w-full h-[32px] border-b border-[#243241] last:border-b-0 hover:bg-[#18242F]/50 transition"
            >
              <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
                {row.time}
              </span>
              <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4]">
                {row.src}
              </span>
              <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4]">
                {row.dst}
              </span>
              <span className="flex-1 font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4] text-right">
                {row.score}
              </span>
              <div className="flex-1 flex justify-end">
                <div
                  className={`box-border flex flex-row items-center px-2 py-1 gap-1 h-[24px] border rounded-[4px] ${
                    row.badgeClass || (
                      row.severity === 'Kritis' ? 'bg-[#3B1F26] border-[#F87171] text-[#FCA5A5]' :
                      row.severity === 'Tinggi' ? 'bg-[#3A2A18] border-[#FB923C] text-[#FDBA74]' :
                      row.severity === 'Sedang' ? 'bg-[#38330F] border-[#FACC15] text-[#FDE047]' :
                      'bg-[#243241] border-[#7B8EA0] text-[#BFD0E0]'
                    )
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span className="font-['Geist'] font-medium text-[11px] leading-[14px]">
                    {row.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 2. Panel / Performa Model (Width: 400px) */}
      <div className="box-border flex flex-col items-start p-4 gap-3 w-[400px] h-[226px] bg-[#111A22] border border-[#243241] rounded-[8px] shrink-0">
        
        {/* Panel Header */}
        <div className="flex flex-row justify-between items-center w-full h-[20px]">
          <div className="flex flex-row items-center gap-2">
            <div className="w-[2px] h-[8px] bg-[#2DD4BF]" />
            <span className="font-['Geist'] font-semibold text-[14px] leading-[20px] text-[#E8EEF4]">
              Performa Model
            </span>
          </div>
          <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
            Saat ini
          </span>
        </div>

        {/* Metrik Body */}
        <div className="flex flex-col justify-between items-start p-0 w-full flex-1 pt-1 pb-1">
          
          {/* Metrik 1: Accuracy */}
          <div className="flex flex-row justify-between items-center w-full h-[26px]">
            <span className="font-['Geist'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
              Accuracy
            </span>
            <div className="box-border flex flex-row items-center px-2 py-1 h-[26px] border border-[#35485A] rounded-[4px] bg-[#18242F]">
              <span className="font-['Geist_Mono'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
                {accuracy}
              </span>
            </div>
          </div>

          {/* Metrik 2: False positive rate */}
          <div className="flex flex-row justify-between items-center w-full h-[26px]">
            <span className="font-['Geist'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
              False positive rate
            </span>
            <div className="box-border flex flex-row items-center px-2 py-1 h-[26px] border border-[#35485A] rounded-[4px] bg-[#18242F]">
              <span className="font-['Geist_Mono'] font-medium text-[12px] leading-[16px] text-[#98A9BA]">
                {fpr}
              </span>
            </div>
          </div>

          {/* Metrik 3: Prediksi hari ini */}
          <div className="flex flex-row justify-between items-center w-full h-[20px]">
            <span className="font-['Geist'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
              Prediksi hari ini
            </span>
            <span className="font-['Geist_Mono'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
              {dailyPredictions}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
