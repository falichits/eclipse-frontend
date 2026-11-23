import React, { useState, useEffect, useCallback } from 'react';
import FigmaHeader from './components/FigmaHeader';
import FigmaStatCards from './components/FigmaStatCards';
import FigmaRow2 from './components/FigmaRow2';
import FigmaRow3 from './components/FigmaRow3';
import FigmaRow4 from './components/FigmaRow4';
import UploadModal from './components/UploadModal';
import ApiSettingsModal from './components/ApiSettingsModal';
import { apiService, getBaseUrl } from './services/api';

function App() {
  const [activeFilter, setActiveFilter] = useState('24 Jam');
  const [isLiveMode, setIsLiveMode] = useState(true); // Default to LIVE NEON DATA!
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('14:32 WIB');

  // Live data states
  const [liveSummary, setLiveSummary] = useState(null);
  const [liveHourly, setLiveHourly] = useState(null);
  const [liveTopIps, setLiveTopIps] = useState(null);
  const [liveLogs, setLiveLogs] = useState(null);
  const [liveMetrics, setLiveMetrics] = useState(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Convert filter chip to query param
  const getTimeRangeParam = (filter) => {
    switch (filter) {
      case '1 Jam': return '1h';
      case '7 Hari': return '7d';
      case '24 Jam':
      default: return '24h';
    }
  };

  // Fetch live backend data
  const fetchLiveData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    const timeRange = getTimeRangeParam(activeFilter);

    try {
      const health = await apiService.checkHealth();
      setIsOnline(health.online);

      if (health.online) {
        const [sum, hourly, top, logs, metrics] = await Promise.all([
          apiService.getSummary(timeRange),
          apiService.getTrafficHourly(timeRange),
          apiService.getTopIps(5, timeRange),
          apiService.getLogs({ timeRange, page: 1, limit: 10 }),
          apiService.getModelMetrics(),
        ]);

        setLiveSummary(sum);
        setLiveHourly(hourly);
        setLiveTopIps(top);
        setLiveLogs(logs);
        setLiveMetrics(metrics);

        // Format updated time (HH:MM WIB)
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setLastUpdatedTime(`${hours}:${minutes} WIB`);
      }
    } catch (err) {
      console.warn('API connection error:', err);
      setIsOnline(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Periodic polling every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  // Map data depending on isLiveMode
  // 1. Stat cards data
  const statCardsData = isLiveMode && liveSummary && Number(liveSummary.total_traffic || 0) > 0 ? {
    totalRequest: Number(liveSummary.total_traffic).toLocaleString('id-ID'),
    detectedAttacks: Number(liveSummary.total_attack).toLocaleString('id-ID'),
    attackPercentage: `${Number(liveSummary.attack_percentage || 0).toFixed(1).replace('.', ',')}%`,
    activeAlerts: Number(liveSummary.unique_attackers_count || 0).toLocaleString('id-ID'),
  } : (
    activeFilter === '7 Hari' ? {
      totalRequest: '1.049.300',
      detectedAttacks: '121.310',
      attackPercentage: '11,6%',
      activeAlerts: '42',
    } : (activeFilter === '1 Jam' ? {
      totalRequest: '6.240',
      detectedAttacks: '720',
      attackPercentage: '11,5%',
      activeAlerts: '4',
    } : {
      totalRequest: '149.900',
      detectedAttacks: '17.330',
      attackPercentage: '11,6%',
      activeAlerts: '17',
    })
  );

  // 2. Composition data
  const compositionData = isLiveMode && liveSummary && Number(liveSummary.total_traffic || 0) > 0 ? {
    benignCount: Number(liveSummary.total_benign || 0).toLocaleString('id-ID'),
    benignPct: `${(100 - Number(liveSummary.attack_percentage || 0)).toFixed(1).replace('.', ',')}%`,
    malignantCount: Number(liveSummary.total_attack || 0).toLocaleString('id-ID'),
    malignantPct: `${Number(liveSummary.attack_percentage || 0).toFixed(1).replace('.', ',')}%`,
  } : (
    activeFilter === '7 Hari' ? {
      benignCount: '927.990',
      benignPct: '88,4%',
      malignantCount: '121.310',
      malignantPct: '11,6%',
    } : (activeFilter === '1 Jam' ? {
      benignCount: '5.520',
      benignPct: '88,5%',
      malignantCount: '720',
      malignantPct: '11,5%',
    } : {
      benignCount: '132.570',
      benignPct: '88,4%',
      malignantCount: '17.330',
      malignantPct: '11,6%',
    })
  );

  // 3. Traffic hourly chart data
  const trafficChartData = isLiveMode && liveHourly?.data?.length > 0 ? (() => {
    if (activeFilter === '7 Hari') {
      const dailyMap = {};
      liveHourly.data.forEach(item => {
        const raw = item.hour || '';
        let dayKey = raw;
        if (raw.includes('-')) {
          const datePart = raw.split(' ')[0];
          const parts = datePart.split('-');
          dayKey = parts.length >= 3 ? `${parts[2]}/${parts[1]}` : datePart;
        } else if (raw.includes('/')) {
          dayKey = raw;
        }
        if (!dailyMap[dayKey]) {
          dailyMap[dayKey] = { hour: dayKey, total: 0, attack: 0 };
        }
        dailyMap[dayKey].total += Number(item.total) || 0;
        dailyMap[dayKey].attack += Number(item.attack_count) || 0;
      });
      return Object.values(dailyMap);
    }

    return liveHourly.data.map(item => {
      const rawHour = item.hour || '00:00';
      const displayHour = rawHour.includes(' ') ? rawHour.split(' ')[1] : rawHour;
      return {
        hour: displayHour.length === 2 ? `${displayHour}:00` : displayHour,
        total: Number(item.total) || 0,
        attack: Number(item.attack_count) || 0,
      };
    });
  })() : null;

  // 4. Targeted assets data
  const serviceMap = {
    '10.0.4.12': 'Web Gateway',
    '10.0.7.31': 'API Auth',
    '10.0.2.8': 'Database Utama',
    '10.0.5.15': 'Payment Service',
    '10.0.1.1': 'DNS Gateway',
  };
  const targetedAssetsData = isLiveMode && liveTopIps?.targeted_assets?.length > 0 ? liveTopIps.targeted_assets.map(t => ({
    ip: t.ip_address,
    service: serviceMap[t.ip_address] || (t.targeted_ports?.length ? `Port :${t.targeted_ports[0]}` : 'Internal Service'),
    count: Number(t.attack_count) || 0,
  })) : null;

  // 5. Top attackers data
  const originMap = {
    '203.0.113.44': 'Rusia',
    '198.51.100.17': 'Brazil',
    '192.0.2.88': 'Vietnam',
    '192.0.2.14': 'China',
    '203.0.113.99': 'Rusia',
  };
  const topAttackersData = isLiveMode && liveTopIps?.top_attackers?.length > 0 ? liveTopIps.top_attackers.map(a => {
    const conf = Number(a.max_confidence || 0);
    const status = conf >= 0.9 ? 'Kritis' : conf >= 0.8 ? 'Tinggi' : conf >= 0.6 ? 'Sedang' : 'Rendah';
    return {
      ip: a.ip_address,
      origin: originMap[a.ip_address] || 'External Proxy',
      attempts: Number(a.attack_count) || 0,
      status,
    };
  }) : null;

  // 6. Recent alerts data
  const recentAlertsData = isLiveMode && liveLogs?.data?.length > 0 ? liveLogs.data.slice(0, 4).map(log => {
    const prob = Number(log.attack_probability || 0);
    const severity = prob >= 0.9 ? 'Kritis' : prob >= 0.8 ? 'Tinggi' : prob >= 0.6 ? 'Sedang' : 'Rendah';
    const score = prob.toFixed(2).replace('.', ',');
    const time = log.flow_timestamp ? log.flow_timestamp.substring(11, 19) : '14:32:00';
    return {
      time,
      src: log.src_ip,
      dst: log.dst_ip,
      score,
      severity,
    };
  }) : null;

  // 7. Model performance
  const modelPerformanceData = isLiveMode && liveMetrics ? {
    accuracy: liveMetrics.accuracy || '[REAL DATA: 800/1000]',
    fpr: liveMetrics.fpr || '[REAL DATA: 400/1000]',
    dailyPredictions: Number(liveMetrics.daily_predictions || 0).toLocaleString('id-ID'),
  } : {
    accuracy: '[REAL DATA: 800/1000]',
    fpr: '[REAL DATA: 400/1000]',
    dailyPredictions: '48.330',
  };

  return (
    <div className="relative flex flex-col items-start p-0 w-full min-h-screen bg-[#0A1016]">
      
      {/* Desktop 1440 container */}
      <div className="w-full max-w-[1440px] mx-auto min-h-[900px] flex flex-col">
        
        {/* Header */}
        <FigmaHeader
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          isLiveMode={isLiveMode}
          setIsLiveMode={setIsLiveMode}
          lastUpdatedTime={lastUpdatedTime}
          onRefresh={() => fetchLiveData(false)}
          isRefreshing={isRefreshing}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOnline={isOnline}
        />

        {/* Content Container (padding: 16px 24px, gap: 16px) */}
        <main className="flex flex-col items-start px-6 py-4 gap-4 w-full flex-1">
          
          {/* Row 1 / Ringkasan (height: 80px) */}
          <section className="w-full">
            <FigmaStatCards data={statCardsData} activeFilter={activeFilter} />
          </section>

          {/* Row 2 / Traffic dan Jenis (height: 254px) */}
          <section className="w-full">
            <FigmaRow2
              trafficData={trafficChartData}
              compositionData={compositionData}
              activeFilter={activeFilter}
            />
          </section>

          {/* Row 3 / Aset dan Penyerang (height: 194px) */}
          <section className="w-full">
            <FigmaRow3
              targetedAssets={targetedAssetsData}
              topAttackers={topAttackersData}
              activeFilter={activeFilter}
            />
          </section>

          {/* Row 4 / Alert dan Model (height: 226px) */}
          <section className="w-full">
            <FigmaRow4
              recentAlerts={recentAlertsData}
              modelPerformance={modelPerformanceData}
            />
          </section>

        </main>

      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          setIsLiveMode(true);
          fetchLiveData(false);
        }}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isOnline={isOnline}
        isDemoMode={!isLiveMode}
        setIsDemoMode={(val) => setIsLiveMode(!val)}
        onTriggerRefresh={() => fetchLiveData(false)}
      />

    </div>
  );
}

export default App;

