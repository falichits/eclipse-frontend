import React from 'react';
import { Activity, ShieldAlert, Percent, AlertTriangle } from 'lucide-react';

export default function FigmaStatCards({ data, activeFilter = '24 Jam' }) {
  // Figma values default:
  // 1. Total request: 149.900 / 24 jam (or 1 jam / 7 hari)
  // 2. Terdeteksi serangan: 17.330 / anomali
  // 3. Persentase serangan: 11,6% / serangan / total
  // 4. Alert aktif: 17 / ancaman tersaring

  const filterSubLabel = activeFilter ? activeFilter.toLowerCase() : '24 jam';

  const cards = [
    {
      label: 'Total request',
      value: data.totalRequest || '149.900',
      sub: filterSubLabel,
      icon: (
        <svg className="w-4 h-4 text-[#98A9BA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      label: 'Terdeteksi serangan',
      value: data.detectedAttacks || '17.330',
      sub: 'anomali',
      icon: (
        <svg className="w-4 h-4 text-[#98A9BA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      label: 'Persentase serangan',
      value: data.attackPercentage || '11,6%',
      sub: 'serangan / total',
      icon: (
        <svg className="w-4 h-4 text-[#98A9BA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      ),
    },
    {
      label: 'Alert aktif',
      value: data.activeAlerts || '17',
      sub: 'ancaman tersaring',
      icon: (
        <svg className="w-4 h-4 text-[#98A9BA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-row items-start p-0 gap-4 w-full h-[80px]">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="box-border flex flex-row items-center p-4 gap-3 flex-1 h-[80px] bg-[#111A22] border border-[#243241] rounded-[8px]"
        >
          {/* icon-box */}
          <div className="flex flex-row justify-center items-center p-0 w-[32px] h-[32px] bg-[#18242F] rounded-[4px] shrink-0">
            {card.icon}
          </div>

          {/* content */}
          <div className="flex flex-col items-start p-0 flex-1 h-[48px] overflow-hidden">
            {/* label */}
            <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA] w-full truncate">
              {card.label}
            </span>

            {/* value-row */}
            <div className="flex flex-row items-baseline p-0 gap-2 h-[32px]">
              <span className="font-['Geist_Mono'] font-semibold text-[28px] leading-[32px] text-[#E8EEF4] tracking-tight">
                {card.value}
              </span>
              <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA] whitespace-nowrap">
                {card.sub}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
