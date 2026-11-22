import React from 'react';
import { Crosshair, ShieldCheck, Flame, Server, AlertOctagon } from 'lucide-react';

export default function TopIpsCard({ topIpsData, isLoading }) {
  const topAttackers = topIpsData?.top_attackers || [];
  const targetedAssets = topIpsData?.targeted_assets || [];

  const maxAttackerCount = topAttackers.length > 0 
    ? Math.max(...topAttackers.map(a => a.attack_count || 1)) 
    : 1;

  const maxTargetCount = targetedAssets.length > 0 
    ? Math.max(...targetedAssets.map(t => t.attack_count || 1)) 
    : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* 1. TOP ATTACKERS (src_ip) */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 tracking-wide font-mono">
                TOP THREAT ACTORS
              </h3>
              <p className="text-xs text-slate-400">
                Hostile source IPs (src_ip) generating malicious flows
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/30">
            Ranked by Volume
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-slate-800/60 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : topAttackers.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-800 rounded-lg">
            <p className="text-xs font-mono text-slate-500">No attacker records currently stored.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topAttackers.map((attacker, idx) => {
              const confidence = attacker.max_confidence != null 
                ? (attacker.max_confidence * 100).toFixed(1) 
                : null;
              const barWidth = Math.min((attacker.attack_count / maxAttackerCount) * 100, 100);

              return (
                <div 
                  key={idx}
                  className="group relative p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/50 border border-slate-800/80 transition"
                >
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 text-[10px] font-mono font-bold text-slate-300">
                        #{idx + 1}
                      </span>
                      <span className="font-mono font-bold text-slate-200 group-hover:text-rose-400 transition">
                        {attacker.ip_address}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 font-mono">
                      {confidence && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                          {confidence}% Conf.
                        </span>
                      )}
                      <span className="text-slate-300 font-bold">
                        {attacker.attack_count.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-500 font-normal">attacks</span>
                      </span>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. TARGETED ASSETS (dst_ip) */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-400">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 tracking-wide font-mono">
                MOST TARGETED ASSETS
              </h3>
              <p className="text-xs text-slate-400">
                Destination servers (dst_ip) & attacked service ports
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/30">
            Target Hosts
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-slate-800/60 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : targetedAssets.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-800 rounded-lg">
            <p className="text-xs font-mono text-slate-500">No targeted asset records currently stored.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {targetedAssets.map((target, idx) => {
              const barWidth = Math.min((target.attack_count / maxTargetCount) * 100, 100);
              const ports = Array.isArray(target.targeted_ports) ? target.targeted_ports : [];

              return (
                <div 
                  key={idx}
                  className="group relative p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/50 border border-slate-800/80 transition"
                >
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 text-[10px] font-mono font-bold text-slate-300">
                        #{idx + 1}
                      </span>
                      <span className="font-mono font-bold text-slate-200 group-hover:text-indigo-400 transition">
                        {target.ip_address}
                      </span>
                    </div>

                    <div className="font-mono text-slate-300 font-bold">
                      {target.attack_count.toLocaleString()}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">hits</span>
                    </div>
                  </div>

                  {/* Targeted Ports Badges */}
                  <div className="flex items-center space-x-1.5 mb-2 overflow-x-auto">
                    <span className="text-[10px] text-slate-500 font-mono">Ports:</span>
                    {ports.length === 0 ? (
                      <span className="text-[10px] font-mono text-slate-600">None</span>
                    ) : (
                      ports.slice(0, 6).map((port, pIdx) => (
                        <span 
                          key={pIdx}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/40"
                        >
                          :{port}
                        </span>
                      ))
                    )}
                    {ports.length > 6 && (
                      <span className="text-[10px] font-mono text-slate-500">+{ports.length - 6}</span>
                    )}
                  </div>

                  {/* Relative bar */}
                  <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
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
