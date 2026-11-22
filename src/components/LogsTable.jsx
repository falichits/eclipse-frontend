import React from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function LogsTable({
  logsData,
  isLoading,
  labelFilter,
  setLabelFilter,
  searchIp,
  setSearchIp,
  page,
  setPage,
  limit,
  setLimit
}) {
  const logs = logsData?.data || [];
  const totalLogs = logsData?.total || 0;
  const totalPages = Math.max(Math.ceil(totalLogs / limit), 1);

  const getProtocolName = (proto) => {
    switch (Number(proto)) {
      case 6: return { name: 'TCP', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40' };
      case 17: return { name: 'UDP', color: 'text-amber-400 bg-amber-950/60 border-amber-800/40' };
      case 1: return { name: 'ICMP', color: 'text-purple-400 bg-purple-950/60 border-purple-800/40' };
      default: return { name: `IP:${proto}`, color: 'text-slate-400 bg-slate-900 border-slate-800' };
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 shadow-sm backdrop-blur-sm">
      
      {/* Top Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 tracking-wide font-mono">
              INTRUSION DETECTION LOGS
            </h3>
            <p className="text-xs text-slate-400">
              Flow-level inspection with AI classification & probability scores ({totalLogs.toLocaleString()} total entries)
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchIp}
              onChange={(e) => {
                setSearchIp(e.target.value);
                setPage(1);
              }}
              placeholder="Search IP (src or dst)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition"
            />
          </div>

          {/* Classification Label Filter Tabs */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {['All', 'Malicious', 'Benign'].map((lbl) => {
              const active = (labelFilter === null && lbl === 'All') || labelFilter === lbl;
              return (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => {
                    setLabelFilter(lbl === 'All' ? null : lbl);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-md transition ${
                    active
                      ? lbl === 'Malicious'
                        ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800/60'
                        : lbl === 'Benign'
                          ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/60'
                          : 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>

          {/* Rows per page */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
            <span>Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs font-mono text-slate-300 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Scenario / Origin</th>
              <th className="py-2.5 px-3">Source IP : Port</th>
              <th className="py-2.5 px-1 text-center">&rarr;</th>
              <th className="py-2.5 px-3">Destination IP : Port</th>
              <th className="py-2.5 px-3">Proto</th>
              <th className="py-2.5 px-3">Packets / Dur.</th>
              <th className="py-2.5 px-3">AI Verdict</th>
              <th className="py-2.5 px-3">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={9} className="py-3 px-3">
                    <div className="h-4 bg-slate-800/60 rounded"></div>
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                  No matching log entries found.
                </td>
              </tr>
            ) : (
              logs.map((row) => {
                const isMalicious = row.prediction_label?.toLowerCase() === 'malicious';
                const protoInfo = getProtocolName(row.protocol);
                const prob = row.attack_probability != null 
                  ? (row.attack_probability * 100).toFixed(1) 
                  : 0;

                return (
                  <tr 
                    key={row.id}
                    className="hover:bg-slate-900/60 transition group"
                  >
                    {/* Timestamp */}
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {row.flow_timestamp ? row.flow_timestamp.substring(0, 19) : '-'}
                    </td>

                    {/* Scenario File */}
                    <td className="py-2.5 px-3 text-slate-400 max-w-[140px] truncate" title={row.scenario_file}>
                      <span className="font-sans text-[11px] text-slate-300">
                        {row.scenario_file || 'live_capture'}
                      </span>
                    </td>

                    {/* Source IP:Port */}
                    <td className="py-2.5 px-3 text-slate-200 whitespace-nowrap">
                      <span className="font-bold text-slate-100">{row.src_ip}</span>
                      <span className="text-slate-500 text-[10px]">:{row.src_port}</span>
                    </td>

                    {/* Flow arrow */}
                    <td className="py-2.5 px-1 text-center text-slate-600">
                      <ArrowRight className="w-3 h-3 mx-auto" />
                    </td>

                    {/* Destination IP:Port */}
                    <td className="py-2.5 px-3 text-slate-200 whitespace-nowrap">
                      <span className="font-bold text-slate-100">{row.dst_ip}</span>
                      <span className="text-cyan-400/90 text-[10px]">:{row.dst_port}</span>
                    </td>

                    {/* Protocol */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${protoInfo.color}`}>
                        {protoInfo.name}
                      </span>
                    </td>

                    {/* Packets & Duration */}
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      <span className="text-slate-300 font-bold">{row.total_packets ?? 1} pkts</span>
                      <span className="text-[10px] text-slate-500 block">
                        {row.flow_duration != null ? `${Number(row.flow_duration).toFixed(3)}s` : '-'}
                      </span>
                    </td>

                    {/* AI Prediction Badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {isMalicious ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          <span>MALICIOUS</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>BENIGN</span>
                        </span>
                      )}
                    </td>

                    {/* Confidence bar */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-14 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${isMalicious ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(prob, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-bold ${isMalicious ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {prob}%
                        </span>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs font-mono text-slate-400">
        <div>
          Showing page <span className="font-bold text-slate-200">{page}</span> of{' '}
          <span className="font-bold text-slate-200">{totalPages}</span> ({totalLogs.toLocaleString()} rows total)
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-bold">
            {page}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
