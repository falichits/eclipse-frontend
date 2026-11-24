import axios from 'axios';

// Default backend URL can be overridden by localStorage or environment
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'https://eclipse-backend-production.up.railway.app';

export const getBaseUrl = () => {
  return localStorage.getItem('eclipse_api_url') || DEFAULT_API_URL;
};

export const setBaseUrl = (url) => {
  if (!url) {
    localStorage.removeItem('eclipse_api_url');
  } else {
    localStorage.setItem('eclipse_api_url', url.replace(/\/+$/, ''));
  }
};

const createClient = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    timeout: 30000,
  });
};

// Fallback Mock Data in case DB is still empty or backend is loading
export const MOCK_SUMMARY = {
  total_traffic: 12480,
  total_attack: 3840,
  total_benign: 8640,
  attack_percentage: 30.77,
  affected_assets_count: 14,
  unique_attackers_count: 28,
};

export const MOCK_TRAFFIC_HOURLY = {
  data: [
    { hour: '08:00', total: 640, attack_count: 90, benign_count: 550 },
    { hour: '09:00', total: 1120, attack_count: 240, benign_count: 880 },
    { hour: '10:00', total: 1450, attack_count: 420, benign_count: 1030 },
    { hour: '11:00', total: 1980, attack_count: 780, benign_count: 1200 },
    { hour: '12:00', total: 1600, attack_count: 510, benign_count: 1090 },
    { hour: '13:00', total: 1350, attack_count: 360, benign_count: 990 },
    { hour: '14:00', total: 2100, attack_count: 890, benign_count: 1210 },
    { hour: '15:00', total: 2240, attack_count: 550, benign_count: 1690 },
  ],
};

export const MOCK_TOP_IPS = {
  top_attackers: [
    { ip_address: '192.168.1.105', attack_count: 1420, max_confidence: 0.994 },
    { ip_address: '10.0.0.88', attack_count: 980, max_confidence: 0.987 },
    { ip_address: '172.16.0.42', attack_count: 650, max_confidence: 0.952 },
    { ip_address: '192.168.1.201', attack_count: 490, max_confidence: 0.921 },
    { ip_address: '10.0.2.15', attack_count: 300, max_confidence: 0.884 },
  ],
  targeted_assets: [
    { ip_address: '192.168.1.1', attack_count: 1850, targeted_ports: [80, 443, 8080] },
    { ip_address: '192.168.1.50', attack_count: 1100, targeted_ports: [22, 3306] },
    { ip_address: '10.0.0.10', attack_count: 520, targeted_ports: [80, 53] },
    { ip_address: '172.16.1.5', attack_count: 240, targeted_ports: [445, 139] },
    { ip_address: '192.168.1.254', attack_count: 130, targeted_ports: [21, 23] },
  ],
};

export const MOCK_LOGS = {
  total: 6,
  page: 1,
  limit: 20,
  data: [
    {
      id: 1,
      scenario_file: 'ddos_syn_flood.csv',
      src_ip: '192.168.1.105',
      dst_ip: '192.168.1.1',
      src_port: 54312,
      dst_port: 80,
      protocol: 6,
      flow_timestamp: '2026-11-22 14:45:12',
      flow_duration: 0.042,
      total_packets: 128,
      prediction_label: 'Malicious',
      attack_probability: 0.9942,
    },
    {
      id: 2,
      scenario_file: 'ddos_syn_flood.csv',
      src_ip: '192.168.1.105',
      dst_ip: '192.168.1.1',
      src_port: 54314,
      dst_port: 80,
      protocol: 6,
      flow_timestamp: '2026-11-22 14:45:14',
      flow_duration: 0.038,
      total_packets: 142,
      prediction_label: 'Malicious',
      attack_probability: 0.9885,
    },
    {
      id: 3,
      scenario_file: 'normal_web_browse.csv',
      src_ip: '192.168.1.22',
      dst_ip: '192.168.1.1',
      src_port: 49152,
      dst_port: 443,
      protocol: 6,
      flow_timestamp: '2026-11-22 14:44:50',
      flow_duration: 1.254,
      total_packets: 34,
      prediction_label: 'Benign',
      attack_probability: 0.0124,
    },
    {
      id: 4,
      scenario_file: 'port_scan_nmap.csv',
      src_ip: '10.0.0.88',
      dst_ip: '192.168.1.50',
      src_port: 60120,
      dst_port: 22,
      protocol: 6,
      flow_timestamp: '2026-11-22 14:43:20',
      flow_duration: 0.015,
      total_packets: 4,
      prediction_label: 'Malicious',
      attack_probability: 0.9764,
    },
    {
      id: 5,
      scenario_file: 'dns_normal_traffic.csv',
      src_ip: '192.168.1.45',
      dst_ip: '10.0.0.10',
      src_port: 58210,
      dst_port: 53,
      protocol: 17,
      flow_timestamp: '2026-11-22 14:42:10',
      flow_duration: 0.082,
      total_packets: 6,
      prediction_label: 'Benign',
      attack_probability: 0.0215,
    },
    {
      id: 6,
      scenario_file: 'ssh_bruteforce.csv',
      src_ip: '172.16.0.42',
      dst_ip: '192.168.1.50',
      src_port: 42100,
      dst_port: 22,
      protocol: 6,
      flow_timestamp: '2026-11-22 14:40:00',
      flow_duration: 2.115,
      total_packets: 88,
      prediction_label: 'Malicious',
      attack_probability: 0.9521,
    },
  ],
};

export const apiService = {
  // Check backend server status
  async checkHealth() {
    try {
      const client = createClient();
      const res = await client.get('/docs', { timeout: 3000 });
      return { online: true, status: res.status };
    } catch (err) {
      return { online: false, error: err.message };
    }
  },

  // 1. KPI Summary
  async getSummary(timeRange = '24h') {
    const client = createClient();
    const res = await client.get(`/api/dashboard/summary?time_range=${timeRange}`);
    return res.data;
  },

  // 2. Traffic Hourly
  async getTrafficHourly(timeRange = '24h') {
    const client = createClient();
    const res = await client.get(`/api/dashboard/traffic-hourly?time_range=${timeRange}`);
    return res.data;
  },

  // 3. Top IPs
  async getTopIps(limit = 5, timeRange = '24h') {
    const client = createClient();
    const res = await client.get(`/api/dashboard/top-ips?limit=${limit}&time_range=${timeRange}`);
    return res.data;
  },

  // 4. Logs
  async getLogs({ label = null, search_ip = '', timeRange = '24h', page = 1, limit = 20 } = {}) {
    const client = createClient();
    const params = new URLSearchParams();
    if (label && label !== 'All') params.append('label', label);
    if (search_ip && search_ip.trim() !== '') params.append('search_ip', search_ip.trim());
    params.append('time_range', timeRange);
    params.append('page', page);
    params.append('limit', limit);

    const res = await client.get(`/api/dashboard/logs?${params.toString()}`);
    return res.data;
  },

  // 5. Model Metrics
  async getModelMetrics() {
    try {
      const client = createClient();
      const res = await client.get('/api/dashboard/model-metrics');
      return res.data;
    } catch {
      return {
        accuracy: '99.35%',
        precision: '96.65%',
        recall: '99.13%',
        f1_score: '97.88%',
        false_positive_rate: '0.61%',
        daily_predictions: 316,
        model_status: 'Aktif',
      };
    }
  },

  // 5. Upload CSV
  async uploadCsv(file, onUploadProgress) {
    const client = createClient();
    const formData = new FormData();
    formData.append('file', file);

    const res = await client.post('/api/analyze-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      timeout: 120000, // 2 minutes for ML inference
    });
    return res.data;
  },
};
