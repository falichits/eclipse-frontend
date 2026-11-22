// Helper to generate a valid test CSV file with the 77 network features expected by Hilal's ML model
export const CSV_COLUMNS = [
  'src_ip', 'dst_ip', 'src_port', 'dst_port', 'timestamp',
  'protocol', 'flow_duration', 'tot_fwd_pkts', 'tot_bwd_pkts',
  'totlen_fwd_pkts', 'totlen_bwd_pkts', 'fwd_pkt_len_max', 'fwd_pkt_len_min',
  'fwd_pkt_len_mean', 'fwd_pkt_len_std', 'bwd_pkt_len_max', 'bwd_pkt_len_min',
  'bwd_pkt_len_mean', 'bwd_pkt_len_std', 'flow_byts_s', 'flow_pkts_s',
  'flow_iat_mean', 'flow_iat_std', 'flow_iat_max', 'flow_iat_min',
  'fwd_iat_tot', 'fwd_iat_mean', 'fwd_iat_std', 'fwd_iat_max', 'fwd_iat_min',
  'bwd_iat_tot', 'bwd_iat_mean', 'bwd_iat_std', 'bwd_iat_max', 'bwd_iat_min',
  'fwd_psh_flags', 'bwd_psh_flags', 'fwd_urg_flags', 'bwd_urg_flags',
  'fwd_header_len', 'bwd_header_len', 'fwd_pkts_s', 'bwd_pkts_s',
  'pkt_len_min', 'pkt_len_max', 'pkt_len_mean', 'pkt_len_std', 'pkt_len_var',
  'fin_flag_cnt', 'syn_flag_cnt', 'rst_flag_cnt', 'psh_flag_cnt', 'ack_flag_cnt',
  'urg_flag_cnt', 'cwr_flag_count', 'ece_flag_cnt', 'down_up_ratio',
  'pkt_size_avg', 'fwd_seg_size_avg', 'bwd_seg_size_avg', 'fwd_byts_b_avg',
  'fwd_pkts_b_avg', 'fwd_blk_rate_avg', 'bwd_byts_b_avg', 'bwd_pkts_b_avg',
  'bwd_blk_rate_avg', 'subflow_fwd_pkts', 'subflow_fwd_byts', 'subflow_bwd_pkts',
  'subflow_bwd_byts', 'init_fwd_win_byts', 'init_bwd_win_byts', 'fwd_act_data_pkts',
  'fwd_seg_size_min', 'active_mean', 'active_std', 'active_max', 'active_min',
  'idle_mean', 'idle_std', 'idle_max', 'idle_min'
];

export const generateSampleCsvBlob = (rowCount = 20) => {
  const header = CSV_COLUMNS.join(',');
  const rows = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const isAttack = i % 3 === 0;
    const srcIp = isAttack ? `192.168.1.${100 + (i % 5)}` : `192.168.1.${20 + (i % 15)}`;
    const dstIp = isAttack ? `192.168.1.1` : `10.0.0.${10 + (i % 8)}`;
    const srcPort = 40000 + i * 23;
    const dstPort = isAttack ? (i % 2 === 0 ? 80 : 443) : (i % 2 === 0 ? 53 : 8080);
    const timeStr = new Date(now.getTime() - (rowCount - i) * 60000).toISOString().replace('T', ' ').substring(0, 19);

    const rowObj = {
      src_ip: srcIp,
      dst_ip: dstIp,
      src_port: srcPort,
      dst_port: dstPort,
      timestamp: timeStr,
      protocol: 6,
      flow_duration: isAttack ? 0.05 : 1.45,
      tot_fwd_pkts: isAttack ? 150 : 25,
      tot_bwd_pkts: isAttack ? 5 : 20,
      totlen_fwd_pkts: isAttack ? 6000 : 1200,
      totlen_bwd_pkts: isAttack ? 250 : 8000,
      fwd_pkt_len_max: isAttack ? 40 : 1460,
      fwd_pkt_len_min: 0,
      fwd_pkt_len_mean: isAttack ? 40 : 540,
      fwd_pkt_len_std: 12.5,
      bwd_pkt_len_max: 1460,
      bwd_pkt_len_min: 0,
      bwd_pkt_len_mean: 450,
      bwd_pkt_len_std: 85.2,
      flow_byts_s: isAttack ? 125000 : 6400,
      flow_pkts_s: isAttack ? 3100 : 32,
      flow_iat_mean: 0.002,
      flow_iat_std: 0.001,
      flow_iat_max: 0.01,
      flow_iat_min: 0.0001,
      fwd_iat_tot: 0.05,
      fwd_iat_mean: 0.001,
      fwd_iat_std: 0.0005,
      fwd_iat_max: 0.005,
      fwd_iat_min: 0.0001,
      bwd_iat_tot: 0.02,
      bwd_iat_mean: 0.004,
      bwd_iat_std: 0.001,
      bwd_iat_max: 0.008,
      bwd_iat_min: 0.0002,
      fwd_psh_flags: 0,
      bwd_psh_flags: 0,
      fwd_urg_flags: 0,
      bwd_urg_flags: 0,
      fwd_header_len: 32,
      bwd_header_len: 32,
      fwd_pkts_s: isAttack ? 3000 : 18,
      bwd_pkts_s: isAttack ? 100 : 14,
      pkt_len_min: 0,
      pkt_len_max: 1460,
      pkt_len_mean: isAttack ? 40.5 : 420.0,
      pkt_len_std: 45.2,
      pkt_len_var: 2043.0,
      fin_flag_cnt: 0,
      syn_flag_cnt: isAttack ? 1 : 0,
      rst_flag_cnt: 0,
      psh_flag_cnt: isAttack ? 0 : 1,
      ack_flag_cnt: 1,
      urg_flag_cnt: 0,
      cwr_flag_count: 0,
      ece_flag_cnt: 0,
      down_up_ratio: isAttack ? 0.03 : 1.2,
      pkt_size_avg: isAttack ? 40 : 410,
      fwd_seg_size_avg: isAttack ? 40 : 540,
      bwd_seg_size_avg: 450,
      fwd_byts_b_avg: 0,
      fwd_pkts_b_avg: 0,
      fwd_blk_rate_avg: 0,
      bwd_byts_b_avg: 0,
      bwd_pkts_b_avg: 0,
      bwd_blk_rate_avg: 0,
      subflow_fwd_pkts: isAttack ? 150 : 25,
      subflow_fwd_byts: isAttack ? 6000 : 1200,
      subflow_bwd_pkts: isAttack ? 5 : 20,
      subflow_bwd_byts: isAttack ? 250 : 8000,
      init_fwd_win_byts: 65535,
      init_bwd_win_byts: 65535,
      fwd_act_data_pkts: isAttack ? 140 : 18,
      fwd_seg_size_min: 32,
      active_mean: 0,
      active_std: 0,
      active_max: 0,
      active_min: 0,
      idle_mean: 0,
      idle_std: 0,
      idle_max: 0,
      idle_min: 0,
    };

    const rowValues = CSV_COLUMNS.map(col => rowObj[col] ?? 0);
    rows.push(rowValues.join(','));
  }

  const csvContent = [header, ...rows].join('\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const downloadSampleCsv = (filename = 'eclipse_sample_traffic.csv') => {
  const blob = generateSampleCsvBlob(30);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
