import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Percent, 
  Server, 
  UserX,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function KpiCards({ summary, isLoading }) {
  const totalTraffic = summary?.total_traffic ?? 0;
  const totalAttack = summary?.total_attack ?? 0;
  const totalBenign = summary?.total_benign ?? 0;
  const attackPct = Number(summary?.attack_percentage ?? 0).toFixed(1);
  const affectedAssets = summary?.affected_assets_count ?? 0;
  const uniqueAttackers = summary?.unique_attackers_count ?? 0;

  const cards = [
    {
      title: 'Total Traffic Analyzed',
      value: totalTraffic.toLocaleString(),
      subtitle: 'Total network packet flows recorded',
      icon: Activity,
      borderColor: 'border-slate-800',
      iconBg: 'bg-slate-900 border-slate-700/60 text-slate-300',
      valueColor: 'text-slate-100',
      badge: 'Live Flows',
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      title: 'Malicious Intrusions',
      value: totalAttack.toLocaleString(),
      subtitle: `${attackPct}% of overall network traffic`,
      icon: ShieldAlert,
      borderColor: 'border-rose-900/40 hover:border-rose-700/60',
      iconBg: 'bg-rose-950/40 border-rose-800/40 text-rose-400',
      valueColor: 'text-rose-400',
      badge: 'Threat Detected',
      badgeColor: 'bg-rose-950 text-rose-300 border border-rose-800/40',
    },
    {
      title: 'Benign / Safe Flows',
      value: totalBenign.toLocaleString(),
      subtitle: 'Verified clean communication',
      icon: ShieldCheck,
      borderColor: 'border-emerald-900/40 hover:border-emerald-700/60',
      iconBg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400',
      valueColor: 'text-emerald-400',
      badge: 'Normal Traffic',
      badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800/40',
    },
    {
      title: 'Attack Ratio',
      value: `${attackPct}%`,
      subtitle: 'Threat density across infrastructure',
      icon: Percent,
      borderColor: 'border-amber-900/40 hover:border-amber-700/60',
      iconBg: 'bg-amber-950/40 border-amber-800/40 text-amber-400',
      valueColor: 'text-amber-400',
      badge: attackPct > 25 ? 'High Risk' : 'Guarded',
      badgeColor: attackPct > 25 ? 'bg-amber-950 text-amber-300 border border-amber-800/40' : 'bg-slate-800 text-slate-300',
      hasProgress: true,
      progressValue: attackPct,
    },
    {
      title: 'Affected Assets',
      value: affectedAssets.toLocaleString(),
      subtitle: 'Target server hosts experiencing attack',
      icon: Server,
      borderColor: 'border-indigo-900/40 hover:border-indigo-700/60',
      iconBg: 'bg-indigo-950/40 border-indigo-800/40 text-indigo-400',
      valueColor: 'text-indigo-300',
      badge: 'Target Hosts',
      badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-800/40',
    },
    {
      title: 'Unique Threat Actors',
      value: uniqueAttackers.toLocaleString(),
      subtitle: 'Distinct hostile source IP addresses',
      icon: UserX,
      borderColor: 'border-cyan-900/40 hover:border-cyan-700/60',
      iconBg: 'bg-cyan-950/40 border-cyan-800/40 text-cyan-400',
      valueColor: 'text-cyan-300',
      badge: 'Identified IPs',
      badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-800/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-slate-900/60 border ${card.borderColor} p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2 my-1">
              <div className={`text-2xl font-black font-mono tracking-tight ${card.valueColor}`}>
                {isLoading ? (
                  <div className="h-7 w-20 bg-slate-800 animate-pulse rounded"></div>
                ) : (
                  card.value
                )}
              </div>
            </div>

            {card.hasProgress && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 my-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(card.progressValue, 100)}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span className="truncate">{card.subtitle}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ml-1 shrink-0 ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
