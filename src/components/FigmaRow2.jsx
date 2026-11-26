import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function FigmaRow2({ trafficData, compositionData, activeFilter = '24 Jam' }) {
  // Figma mockup default chart points:
  const default24hChartData = [
    { hour: '00:00', total: 4200, attack: 450 },
    { hour: '04:00', total: 6800, attack: 1100 },
    { hour: '08:00', total: 9500, attack: 2800 },
    { hour: '12:00', total: 11800, attack: 5200 },
    { hour: '14:00', total: 12400, attack: 7330 }, // Peak in Figma!
    { hour: '16:00', total: 10200, attack: 4100 },
    { hour: '20:00', total: 5800, attack: 1200 },
  ];

  const default7dChartData = [
    { hour: '16/11', total: 138000, attack: 15400 },
    { hour: '17/11', total: 145000, attack: 16800 },
    { hour: '18/11', total: 152000, attack: 17200 },
    { hour: '19/11', total: 148000, attack: 16900 },
    { hour: '20/11', total: 162000, attack: 18500 },
    { hour: '21/11', total: 155000, attack: 17100 },
    { hour: '22/11', total: 149900, attack: 17330 },
  ];

  const default1hChartData = [
    { hour: '13:40', total: 850, attack: 95 },
    { hour: '13:50', total: 980, attack: 110 },
    { hour: '14:00', total: 1240, attack: 220 },
    { hour: '14:10', total: 1150, attack: 140 },
    { hour: '14:20', total: 1020, attack: 115 },
    { hour: '14:30', total: 1000, attack: 40 },
  ];

  const fallbackData = activeFilter === '7 Hari' 
    ? default7dChartData 
    : (activeFilter === '1 Jam' ? default1hChartData : default24hChartData);

  const chartData = (trafficData && trafficData.length > 0) ? trafficData : fallbackData;

  // Dynamic titles based on activeFilter
  const chartTitle = activeFilter === '7 Hari' 
    ? 'Traffic per Hari' 
    : (activeFilter === '1 Jam' ? 'Traffic per 10 Menit' : 'Traffic per Jam');

  const chartSubtitle = activeFilter === '7 Hari'
    ? '7 hari terakhir • WIB'
    : (activeFilter === '1 Jam' ? '1 jam terakhir • WIB' : '24 jam terakhir • WIB');

  // Find peak attack point dynamically
  const peakItem = chartData.reduce(
    (max, item) => ((item.attack || 0) > (max.attack || 0) ? item : max),
    chartData[0] || { hour: '14:00', attack: 7330 }
  );
  const peakText = `${peakItem.hour} • ${(peakItem.attack || 0).toLocaleString('id-ID')} serangan`;

  const benignCount = compositionData?.benignCount || '132.570';
  const benignPct = compositionData?.benignPct || '88,4%';
  const benignPctNumber = parseFloat(benignPct.replace(',', '.')) || 88.4;

  const malignantCount = compositionData?.malignantCount || '17.330';
  const malignantPct = compositionData?.malignantPct || '11,6%';
  const malignantPctNumber = parseFloat(malignantPct.replace(',', '.')) || 11.6;

  return (
    <div className="flex flex-row items-start p-0 gap-4 w-full h-[254px]">
      
      {/* 1. Panel / Traffic per Jam (Width: 976px / flex-1) */}
      <div className="box-border flex flex-col items-start p-4 gap-3 flex-1 h-[254px] bg-[#111A22] border border-[#243241] rounded-[8px] overflow-hidden">
        
        {/* Chart Header */}
        <div className="flex flex-row justify-between items-center w-full h-[20px]">
          {/* Left Title Group */}
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-2">
              <div className="w-[2px] h-[8px] bg-[#2DD4BF]" />
              <span className="font-['Geist'] font-semibold text-[14px] leading-[20px] text-[#E8EEF4]">
                {chartTitle}
              </span>
            </div>
            <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
              {chartSubtitle}
            </span>
          </div>

          {/* Right Legenda */}
          <div className="flex flex-row items-center gap-4 h-[16px]">
            {/* Total traffic */}
            <div className="flex flex-row items-center gap-2">
              <div className="w-[16px] h-[2px] bg-[#98A9BA]" />
              <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
                Total traffic
              </span>
            </div>
            {/* Traffic serangan */}
            <div className="flex flex-row items-center gap-2">
              <div className="w-[16px] h-[2px] bg-[#2DD4BF]" />
              <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#E8EEF4]">
                Traffic serangan
              </span>
            </div>
          </div>
        </div>

        {/* Plot Area with exact custom SVG canvas */}
        <div className="relative w-full h-[190px] pt-1">
          {/* Peak Tooltip Callout (exact replica of Figma box: 170px x 26px, left ~45%) */}
          <div className="absolute top-[8px] left-[42%] z-10 box-border flex flex-row items-center px-2 py-1 h-[26px] bg-[#18242F] border border-[#35485A] rounded-[4px] shadow-lg pointer-events-none">
            <span className="font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#E8EEF4] whitespace-nowrap">
              {peakText}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="figmaAttackFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B2E2B" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0B2E2B" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#243241" vertical={false} strokeDasharray="0" />

              <XAxis
                dataKey="hour"
                stroke="transparent"
                tick={{ fill: '#98A9BA', fontSize: 12, fontFamily: 'Geist Mono' }}
                interval={activeFilter === '7 Hari' ? 0 : 'preserveStartEnd'}
                dy={6}
              />
              <YAxis
                stroke="transparent"
                tick={{ fill: '#98A9BA', fontSize: 12, fontFamily: 'Geist Mono' }}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)} rb` : `${v}`)}
                dx={-4}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const total = payload.find(p => p.dataKey === 'total')?.value || 0;
                    const attack = payload.find(p => p.dataKey === 'attack')?.value || 0;
                    return (
                      <div className="box-border flex flex-col p-2 bg-[#18242F] border border-[#35485A] rounded-[4px] text-[12px] font-['Geist_Mono'] text-[#E8EEF4] shadow-xl">
                        <span className="text-[#98A9BA] text-[11px] mb-1">{label} WIB</span>
                        <div className="flex justify-between gap-3 text-[#98A9BA]">
                          <span>Total:</span>
                          <span className="text-white font-semibold">{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-3 text-[#2DD4BF]">
                          <span>Serangan:</span>
                          <span className="font-semibold">{attack.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Total Traffic Line (Gray) */}
              <Line
                type="monotone"
                dataKey="total"
                stroke="#98A9BA"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#98A9BA' }}
              />

              {/* Attack Area (Teal border + Dark Teal #0B2E2B fill) */}
              <Area
                type="monotone"
                dataKey="attack"
                stroke="#2DD4BF"
                strokeWidth={2}
                fill="url(#figmaAttackFill)"
                dot={(props) => {
                  // Highlight peak at 14:00
                  if (props.payload.hour === '14:00' || props.index === 4) {
                    return (
                      <circle
                        key={props.key}
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill="#2DD4BF"
                        stroke="#111A22"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <React.Fragment key={props.key} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 2. Panel / Komposisi Request (Width: 400px) */}
      <div className="box-border flex flex-col items-start p-4 gap-3 w-[400px] h-[254px] bg-[#111A22] border border-[#243241] rounded-[8px] shrink-0">
        
        {/* Header */}
        <div className="flex flex-row justify-between items-center w-full h-[20px]">
          <div className="flex flex-row items-center gap-2">
            <div className="w-[2px] h-[8px] bg-[#2DD4BF]" />
            <span className="font-['Geist'] font-semibold text-[14px] leading-[20px] text-[#E8EEF4]">
              Komposisi Request
            </span>
          </div>
          <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
            benign vs malignant
          </span>
        </div>

        {/* Daftar Komposisi */}
        <div className="flex flex-col justify-center items-start p-0 gap-6 w-full flex-1">
          
          {/* Benign */}
          <div className="flex flex-col items-start p-0 gap-1 w-full h-[32px]">
            <div className="flex flex-row justify-between items-center w-full h-[20px]">
              <span className="font-['Geist'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
                Benign
              </span>
              <div className="flex flex-row items-baseline gap-2">
                <span className="font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
                  {benignCount}
                </span>
                <span className="font-['Geist_Mono'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
                  {benignPct}
                </span>
              </div>
            </div>
            {/* Track */}
            <div className="w-full h-[8px] bg-[#18242F] rounded-[4px] overflow-hidden">
              <div
                className="h-[8px] bg-[#98A9BA] rounded-[4px] transition-all duration-500"
                style={{ width: `${benignPctNumber}%` }}
              />
            </div>
          </div>

          {/* Malignant */}
          <div className="flex flex-col items-start p-0 gap-1 w-full h-[32px]">
            <div className="flex flex-row justify-between items-center w-full h-[20px]">
              <span className="font-['Geist'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
                Malignant
              </span>
              <div className="flex flex-row items-baseline gap-2">
                <span className="font-['Geist_Mono'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
                  {malignantCount}
                </span>
                <span className="font-['Geist_Mono'] font-normal text-[13px] leading-[20px] text-[#E8EEF4]">
                  {malignantPct}
                </span>
              </div>
            </div>
            {/* Track */}
            <div className="w-full h-[8px] bg-[#18242F] rounded-[4px] overflow-hidden">
              <div
                className="h-[8px] bg-[#2DD4BF] rounded-[4px] transition-all duration-500"
                style={{ width: `${malignantPctNumber}%` }}
              />
            </div>
          </div>

          {/* Catatan Footer */}
          <span className="font-['Geist'] font-normal text-[12px] leading-[16px] text-[#98A9BA]">
            Klasifikasi otomatis oleh model CNN (CIC-IDS2017)
          </span>

        </div>

      </div>

    </div>
  );
}
