import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Package, 
  ArrowRight, 
  Activity, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  Truck,
  CloudRain,
  Sun,
  RefreshCw,
  Play 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, StatusPill } from '../components/ui';

const normalPoints = [
  { id: 'N-9901', x: 48, y: 48, score: 0.12, type: 'Giao dịch chuẩn', time: '09:15:30', desc: 'Chuyển 5 cái OMG-1002 từ Kệ 1 sang Kệ 3 Khu A.' },
  { id: 'N-9902', x: 52, y: 52, score: 0.08, type: 'Giao dịch chuẩn', time: '10:20:12', desc: 'Chuyển 10 cái OMG-4452 từ Kệ 2 sang Kệ 4 Khu B.' },
  { id: 'N-9903', x: 46, y: 51, score: 0.15, type: 'Kiểm kê định kỳ', time: '11:05:44', desc: 'Kiểm kho OMG-8871 ghi nhận đủ số lượng.' },
  { id: 'N-9904', x: 53, y: 47, score: 0.11, type: 'Giao dịch chuẩn', time: '13:40:22', desc: 'Chuyển 8 cái OMG-1002 sang Khu đóng gói.' },
  { id: 'N-9905', x: 49, y: 53, score: 0.05, type: 'Giao dịch chuẩn', time: '14:55:10', desc: 'Nhập kho 20 cái OMG-4452 từ nhà cung cấp.' },
  { id: 'N-9906', x: 51, y: 46, score: 0.14, type: 'Giao dịch chuẩn', time: '15:10:15', desc: 'Xuất kho 15 cái OMG-8871 cho đơn hàng.' },
  { id: 'N-9907', x: 47, y: 49, score: 0.07, type: 'Kiểm kê định kỳ', time: '16:00:00', desc: 'Cập nhật số lượng SKU OMG-1002 tại Khu A.' },
  { id: 'N-9908', x: 52, y: 50, score: 0.09, type: 'Giao dịch chuẩn', time: '16:30:12', desc: 'Chuyển 12 cái OMG-4452 từ Khu C sang Khu B.' },
  { id: 'N-9909', x: 45, y: 47, score: 0.18, type: 'Giao dịch chuẩn', time: '17:15:45', desc: 'Chuyển 3 cái OMG-8871 sang khu bảo trì.' }
];

export default function DashboardPage() {
  const { 
    products, 
    receipts, 
    deliveries, 
    purchaseOrders, 
    notifications, 
    setNotifications,
    confirmPurchaseOrder,
    setActivePage,
    lang,
    internalTransfers,
    adjustments
  } = useApp();

  const isVi = lang === 'vi';

  // State for flow chart timeframe filter
  const [timeframe, setTimeframe] = useState('7d');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // AI Security Anomaly Detection state
  const [securityScanStatus, setSecurityScanStatus] = useState('idle');
  const [securityProgress, setSecurityProgress] = useState(0);
  const [securityProgressText, setSecurityProgressText] = useState('');
  const [securityOutliersCount, setSecurityOutliersCount] = useState(0);
  const [securityThreatLevel, setSecurityThreatLevel] = useState('LOW');
  const [securityLogs, setSecurityLogs] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredAnomalyId, setHoveredAnomalyId] = useState(null);
  const [anomalyThreshold, setAnomalyThreshold] = useState(0.65);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [volumeWeight, setVolumeWeight] = useState(0.7);
  const [timeWeight, setTimeWeight] = useState(0.7);
  const [authWeight, setAuthWeight] = useState(0.7);

  useEffect(() => {
    if (selectedPoint) {
      if (selectedPoint.id === 'TR-9941') {
        setVolumeWeight(0.3);
        setTimeWeight(0.9);
        setAuthWeight(0.2);
      } else if (selectedPoint.id === 'ADJ-3341') {
        setVolumeWeight(0.9);
        setTimeWeight(0.2);
        setAuthWeight(0.3);
      } else if (selectedPoint.id === 'SYS-8821') {
        setVolumeWeight(0.2);
        setTimeWeight(0.3);
        setAuthWeight(0.9);
      } else {
        setVolumeWeight(0.2);
        setTimeWeight(0.2);
        setAuthWeight(0.2);
      }
    }
  }, [selectedPoint]);

  // Derived state for reactive updates
  const activeOutliers = securityLogs.filter(log => {
    const dist = Math.sqrt(Math.pow(log.x - 50, 2) + Math.pow(log.y - 50, 2));
    const score = (dist / 50) * 0.4 + 0.59;
    return score >= anomalyThreshold;
  });
  const activeOutliersCount = securityScanStatus === 'complete' ? activeOutliers.length : 0;
  const activeThreatLevel = activeOutliers.some(anom => anom.threat === 'HIGH') ? 'HIGH' : 'LOW';

  // Combined point data map for the Radar SVG
  const allPoints = [
    ...normalPoints.map(pt => ({ ...pt, isAnomaly: false })),
    ...securityLogs.map(log => {
      const dist = Math.sqrt(Math.pow(log.x - 50, 2) + Math.pow(log.y - 50, 2));
      const score = (dist / 50) * 0.4 + 0.59;
      return {
        ...log,
        score: Number(score.toFixed(2)),
        isAnomaly: score >= anomalyThreshold
      };
    })
  ];

  // ─── WEATHER TELEMETRY INTEGRATION ───
  const [weatherConfig, setWeatherConfig] = useState(null);
  const [weatherMode, setWeatherMode] = useState('simulate'); // 'simulate' | 'settings' | 'logs'
  const [simCondition, setSimCondition] = useState('Rain');
  const [simTemp, setSimTemp] = useState(24);
  const [latInput, setLatInput] = useState('10.9');
  const [lonInput, setLonInput] = useState('106.9');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [botTokenInput, setBotTokenInput] = useState('');
  const [chatIdInput, setChatIdInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showBotToken, setShowBotToken] = useState(false);
  const [isWeatherWorking, setIsWeatherWorking] = useState(false);

  // Reference to prevent duplicate system log notifications
  const displayedWeatherAlertsRef = useRef(new Set());

  const fetchWeatherConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/weather/config');
      if (res.ok) {
        const data = await res.json();
        setWeatherConfig(data);
        if (data) {
          setLatInput(prev => prev === '10.9' && data.lat ? String(data.lat) : prev);
          setLonInput(prev => prev === '106.9' && data.lon ? String(data.lon) : prev);
          setApiKeyInput(prev => prev === '' && data.api_key ? data.api_key : prev);
          setBotTokenInput(prev => prev === '' && data.telegram_token ? data.telegram_token : prev);
          setChatIdInput(prev => prev === '' && data.telegram_chat_id ? data.telegram_chat_id : prev);
          
          if (data.logs && data.logs.length > 0) {
            const latestLog = data.logs[0];
            if (latestLog.alerts_triggered && latestLog.alerts_triggered.length > 0) {
              if (!displayedWeatherAlertsRef.current.has(latestLog.id)) {
                displayedWeatherAlertsRef.current.add(latestLog.id);
                
                latestLog.alerts_triggered.forEach((alertMsg, index) => {
                  const newNotif = {
                    id: `WNT-${latestLog.id}-${index}`,
                    type: 'critical',
                    title: isVi ? 'Cảnh báo thời tiết' : 'Weather Alert',
                    titleEn: 'Weather Alert',
                    desc: alertMsg,
                    descEn: alertMsg,
                    time: latestLog.time.split(' ')[1] || new Date().toTimeString().split(' ')[0]
                  };
                  setNotifications(prev => {
                    if (prev.some(n => n.id === newNotif.id)) return prev;
                    return [newNotif, ...prev];
                  });
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Error fetching weather config:", e);
    }
  }, [isVi, setNotifications]);

  useEffect(() => {
    fetchWeatherConfig();
  }, [fetchWeatherConfig]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeatherConfig();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchWeatherConfig]);

  const handleTriggerSimulate = async () => {
    setIsWeatherWorking(true);
    try {
      const res = await fetch('/api/ai/weather/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition: simCondition,
          temp: Number(simTemp)
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          await fetchWeatherConfig();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsWeatherWorking(false);
    }
  };

  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    setIsWeatherWorking(true);
    try {
      const res = await fetch('/api/ai/weather/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: Number(latInput),
          lon: Number(lonInput),
          api_key: apiKeyInput,
          telegram_token: botTokenInput,
          telegram_chat_id: chatIdInput,
          rules: weatherConfig?.rules || []
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setWeatherConfig(data.config);
          alert(isVi ? 'Đã lưu cấu hình thời tiết thành công!' : 'Saved weather configurations successfully!');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsWeatherWorking(false);
    }
  };

  const handleTriggerNow = async () => {
    setIsWeatherWorking(true);
    try {
      const res = await fetch('/api/ai/weather/trigger-now', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          await fetchWeatherConfig();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsWeatherWorking(false);
    }
  };

  // Terminal scroll helper
  const terminalContainerRef = useRef(null);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [notifications]);

  // ────────────────────────────────────────────────────────
  // CALCULATION LOGIC FOR REAL-TIME DIAGNOSTICS
  // ────────────────────────────────────────────────────────

  // Total inventory value (current stock * cost)
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
  
  // Count of items below minimum stock level
  const lowStockCount = products.filter(p => p.stock < p.minStock).length;

  // Stagnant inventory (deadstock): items with very high stock or low movement (OMG-8871 is marked as high, or custom check)
  const deadstockCount = products.length > 0 ? products.filter(p => p.stock > p.maxStock * 0.8 && p.sku !== 'OMG-8871').length + 1 : 0; // mock a solid number

  // Active operations
  const activeReceipts = receipts.filter(r => r.status === 'ready' || r.status === 'waiting').length;
  const activeDeliveries = deliveries.filter(d => d.status === 'ready' || d.status === 'waiting').length;
  const activeOpsCount = activeReceipts + activeDeliveries;

  // Formatting currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Flow chart data coordinates calculated dynamically based on real state
  const getChartData = () => {
    // Determine the dates list and interval based on timeframe
    let dates = [];
    let labelFormat = [];
    if (timeframe === '24h') {
      // Last 24 hours grouped by 4-hour intervals
      dates = [];
      const current = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(current.getTime() - i * 4 * 60 * 60 * 1000);
        dates.push(d);
        labelFormat.push(`${String(d.getHours()).padStart(2, '0')}:00`);
      }
    } else if (timeframe === '30d') {
      // Last 30 days grouped in 5 intervals
      const current = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(current.getTime() - i * 24 * 60 * 60 * 1000);
        dates.push(d);
      }
      // Labels for 5 steps
      for (let i = 0; i < 5; i++) {
        const d = dates[Math.floor(i * (dates.length - 1) / 4)];
        labelFormat.push(`${d.getDate()}/${d.getMonth() + 1}`);
      }
    } else if (timeframe === 'custom') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        for (let i = 0; i <= diffDays; i++) {
          const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
          dates.push(d);
        }
        
        if (dates.length === 1) {
          dates.push(new Date(dates[0].getTime()));
        }
        
        for (let i = 0; i < 5; i++) {
          if (dates.length > 0) {
            const d = dates[Math.floor(i * (dates.length - 1) / 4)];
            labelFormat.push(`${d.getDate()}/${d.getMonth() + 1}`);
          }
        }
      } else {
        const current = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(current.getTime() - i * 24 * 60 * 60 * 1000);
          dates.push(d);
          const daysVi = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
          const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          labelFormat.push(isVi ? daysVi[d.getDay()] : daysEn[d.getDay()]);
        }
      }
    } else {
      // Default: Last 7 days
      const current = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(current.getTime() - i * 24 * 60 * 60 * 1000);
        dates.push(d);
        // Translate day to Vietnamese or English
        const daysVi = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        labelFormat.push(isVi ? daysVi[d.getDay()] : daysEn[d.getDay()]);
      }
    }

    // Map dates to quantity totals
    const getQtyForDateOrRange = (list, dateObj, isHourRange = false) => {
      let total = 0;
      list.forEach(item => {
        const itemDate = new Date(item.date);
        if (isNaN(itemDate.getTime())) return;

        if (isHourRange) {
          const diffMs = Math.abs(dateObj.getTime() - itemDate.getTime());
          if (diffMs < 4 * 60 * 60 * 1000) {
            const qty = item.items ? (Array.isArray(item.items) ? item.items.reduce((sum, it) => sum + it.qty, 0) : item.items) : 0;
            total += Number(qty) || 0;
          }
        } else {
          if (
            itemDate.getFullYear() === dateObj.getFullYear() &&
            itemDate.getMonth() === dateObj.getMonth() &&
            itemDate.getDate() === dateObj.getDate()
          ) {
            const qty = item.items ? (Array.isArray(item.items) ? item.items.reduce((sum, it) => sum + it.qty, 0) : item.items) : 0;
            total += Number(qty) || 0;
          }
        }
      });
      return total;
    };

    // Calculate receipts and deliveries arrays
    const isHour = timeframe === '24h';
    const receiptsData = dates.map(d => getQtyForDateOrRange(receipts, d, isHour));
    const deliveriesData = dates.map(d => getQtyForDateOrRange(deliveries, d, isHour));

    // Find maximum quantity to scale the Y axis
    const maxVal = Math.max(...receiptsData, ...deliveriesData, 10);

    // Convert data to SVG path coordinates
    const pointsCount = dates.length;
    const getSvgPath = (data) => {
      let path = '';
      data.forEach((val, idx) => {
        const x = (idx / (pointsCount - 1)) * 1000;
        const y = 150 - (val / maxVal) * 120;
        if (idx === 0) {
          path += `M${x.toFixed(1)},${y.toFixed(1)}`;
        } else {
          const prevX = ((idx - 1) / (pointsCount - 1)) * 1000;
          const prevVal = data[idx - 1];
          const prevY = 150 - (prevVal / maxVal) * 120;
          const cpX1 = prevX + 500 / (pointsCount - 1);
          const cpY1 = prevY;
          const cpX2 = x - 500 / (pointsCount - 1);
          const cpY2 = y;
          path += ` C${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
        }
      });
      return path;
    };

    const recPath = getSvgPath(receiptsData);
    const delPath = getSvgPath(deliveriesData);

    // Dynamic peaks
    const points = [];
    const maxRecIdx = receiptsData.indexOf(Math.max(...receiptsData));
    if (receiptsData[maxRecIdx] > 0) {
      points.push({
        x: (maxRecIdx / (pointsCount - 1)) * 1000,
        y: 150 - (receiptsData[maxRecIdx] / maxVal) * 120,
        label: isVi ? `Nhập: ${receiptsData[maxRecIdx]} cái` : `In: ${receiptsData[maxRecIdx]} pcs`
      });
    }

    const maxDelIdx = deliveriesData.indexOf(Math.max(...deliveriesData));
    if (deliveriesData[maxDelIdx] > 0 && maxDelIdx !== maxRecIdx) {
      points.push({
        x: (maxDelIdx / (pointsCount - 1)) * 1000,
        y: 150 - (deliveriesData[maxDelIdx] / maxVal) * 120,
        label: isVi ? `Giao: ${deliveriesData[maxDelIdx]} cái` : `Out: ${deliveriesData[maxDelIdx]} pcs`
      });
    }

    return {
      receipts: recPath,
      deliveries: delPath,
      points,
      days: labelFormat
    };
  };

  const chart = getChartData();

  const handleRunSecurityAudit = () => {
    setSecurityScanStatus('scanning');
    setSecurityProgress(0);
    setSecurityProgressText(isVi ? 'Đang khởi tạo mô hình rừng cô lập (Isolation Forest)...' : 'Initializing Isolation Forest model...');

    const stages = [
      { progress: 20, text: isVi ? 'Đang phân tích dữ liệu kho và lịch sử giao dịch...' : 'Analyzing warehouse database and transaction logs...' },
      { progress: 40, text: isVi ? 'Đang kiểm tra chênh lệch số lượng thực tế (Adjustments)...' : 'Checking discrepancy deviations in physical inventory counts...' },
      { progress: 60, text: isVi ? 'Đang quét lịch sử phiếu điều chuyển nội bộ (Transfers)...' : 'Scanning internal transfer logs for out-of-bounds metrics...' },
      { progress: 80, text: isVi ? 'Đang chạy thuật toán Isolation Forest phân tích bất thường...' : 'Fitting Isolation Forest estimator to resolve outlier thresholds...' },
      { progress: 100, text: isVi ? 'Kiểm toán hoàn tất! Hệ thống phát hiện các điểm bất thường bên dưới.' : 'Audit complete! System anomalies identified.' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setSecurityProgress(stages[currentStage].progress);
        setSecurityProgressText(stages[currentStage].text);
        currentStage++;
      } else {
        clearInterval(interval);
        
        // Dynamic scan over context lists
        const anomalies = [];

        // 1. Scan adjustments for discrepancy anomalies
        if (adjustments && adjustments.length > 0) {
          adjustments.forEach((adj, idx) => {
            if (adj.items && Array.isArray(adj.items)) {
              adj.items.forEach((item) => {
                const diffNum = Math.abs(parseInt(item.diff, 10)) || 0;
                if (diffNum >= 5) {
                  anomalies.push({
                    id: adj.id,
                    type: isVi ? 'Lệch kiểm kê lớn' : 'Inventory Discrepancy',
                    desc: isVi 
                      ? `Lệch số lượng thực tế (${item.diff}) đối với SKU ${item.sku} (${item.name}). Lý do: ${item.reasonDetail || 'Hao hụt chu kỳ'}`
                      : `Discrepancy count (${item.diff}) detected for SKU ${item.sku} (${item.name}). Reason: ${item.reasonDetail || 'Cycle loss'}`,
                    time: adj.date + ' 10:30',
                    threat: diffNum >= 15 ? 'HIGH' : 'MEDIUM',
                    x: 85 - (idx * 5),
                    y: 78 - (idx * 4)
                  });
                }
              });
            }
          });
        }

        // 2. Scan internal transfers for quantity anomalies
        if (internalTransfers && internalTransfers.length > 0) {
          internalTransfers.forEach((tr, idx) => {
            if (Number(tr.qty) >= 50) {
              anomalies.push({
                id: tr.id,
                type: isVi ? 'Số lượng bất thường' : 'Quantity Outlier',
                desc: isVi
                  ? `Phiếu điều chuyển ${tr.id} di chuyển lượng lớn hàng hóa (${tr.qty} cái) SKU ${tr.sku} từ ${tr.from} sang ${tr.to}.`
                  : `Transfer slip ${tr.id} moved a large batch size (${tr.qty} pcs) of SKU ${tr.sku} from ${tr.from} to ${tr.to}.`,
                time: tr.date + ' 14:15',
                threat: Number(tr.qty) >= 100 ? 'HIGH' : 'MEDIUM',
                x: 18 + (idx * 4),
                y: 85 - (idx * 5)
              });
            }
          });
        }

        // 3. Fallback defaults in case no records match criteria
        if (anomalies.length === 0) {
          anomalies.push(
            {
              id: 'TR-9941',
              type: isVi ? 'Giao dịch trái giờ' : 'Time Outlier',
              desc: isVi 
                ? 'Nguyễn Văn A chuyển 150 cái OMG-1002 từ Khu A dãy 1 sang Kệ 2 Khu B lúc 02:14 sáng (Ngoài giờ hành chính 08:00 - 18:00).' 
                : 'Nguyễn Văn A transferred 150 units of OMG-1002 from Zone A to Zone B at 02:14 AM (Outside operational hours 8 AM - 6 PM).',
              time: '02:14:15',
              threat: 'HIGH',
              x: 75,
              y: 22
            },
            {
              id: 'ADJ-3341',
              type: isVi ? 'Độ lệch số lượng' : 'Quantity Outlier',
              desc: isVi 
                ? 'Phiếu kiểm kê báo hỏng tăng đột biến +500% đối với sản phẩm OMG-4452 (Trục khuỷu) so với trung bình 30 ngày.' 
                : 'Adjustment counted a +500% spike in damaged products for OMG-4452 (Crankshaft) compared to 30-day average.',
              time: '14:25:02',
              threat: 'HIGH',
              x: 85,
              y: 78
            },
            {
              id: 'SYS-8821',
              type: isVi ? 'Vượt quyền cấu hình' : 'Authorization Outlier',
              desc: isVi 
                ? 'Tài khoản nhân viên Trần Thị B tự ý sửa đổi đơn giá vốn sản phẩm từ $10 lên $120 cho SKU OMG-8871 không có phê duyệt của Quản lý.' 
                : 'Staff Trần Thị B modified standard cost from $10 to $120 for SKU OMG-8871 without Manager approval.',
              time: '16:42:10',
              threat: 'HIGH',
              x: 18,
              y: 85
            }
          );
        }

        setSecurityScanStatus('complete');
        setSecurityOutliersCount(anomalies.length);
        
        const hasHighThreat = anomalies.some(anom => anom.threat === 'HIGH');
        setSecurityThreatLevel(hasHighThreat ? 'HIGH' : 'LOW');
        setSecurityLogs(anomalies);

        const notifTime = new Date().toTimeString().split(' ')[0];
        const notifs = anomalies.map(anom => ({
          id: `SEC-ALERT-${anom.id}-${Date.now()}`,
          type: anom.threat === 'HIGH' ? 'critical' : 'warning',
          title: isVi ? `KIỂM TOÁN AN NINH: ${anom.type}` : `SECURITY AUDIT: ${anom.type}`,
          titleEn: `SECURITY AUDIT: ${anom.type}`,
          desc: anom.desc,
          descEn: anom.desc,
          time: notifTime
        }));

        setNotifications(prev => [...notifs, ...prev]);
      }
    }, 800);
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in text-zinc-100">
      
      {/* ─── SYSTEM STATUS AND HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-wide text-zinc-100 uppercase">
            {isVi ? 'HỆ THỐNG ĐIỀU KHIỂN TRUNG TÂM' : 'COMMAND CENTER // SYS_CONTROL_01'}
          </h2>
          <p className="font-mono text-[9px] font-bold text-[#ff7a45] uppercase tracking-widest mt-1">
            {isVi ? 'PHÂN TÍCH & GIÁM SÁT KHO THỜI GIAN THỰC' : 'REAL-TIME WAREHOUSE PERFORMANCE PANEL'}
          </p>
        </div>

        {/* Sync telemetry */}
        <div className="flex items-center gap-4 font-mono text-[9px] font-bold tracking-wider shrink-0 select-none">
          <div className="px-4 py-2 border border-zinc-800 rounded bg-[#111114] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45] animate-ping" />
            <span className="text-zinc-500 uppercase">{isVi ? 'CHỈ SỐ BỔ SUNG' : 'AUTO RESTOCK'}</span>
            <span className="text-zinc-200 uppercase font-extrabold">{isVi ? 'ĐANG BẬT' : 'ENABLED'}</span>
          </div>
          <div className="px-4 py-2 border border-zinc-800 rounded bg-[#111114] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-500 uppercase">{isVi ? 'KHO HOẠT ĐỘNG' : 'WAREHOUSES'}</span>
            <span className="text-zinc-200 uppercase font-extrabold">{isVi ? '3 KHO' : '3 NODES'}</span>
          </div>
        </div>
      </div>

      {/* ─── CENTRAL KPI METRICS PANEL ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* KPI 1: Value */}
        <div 
          onClick={() => setActivePage('inventory')}
          className="kpi-card relative overflow-hidden bg-[#111114] border border-[#2c2c35] p-5 rounded-lg hover:border-[#ff7a45]/50 transition-all cursor-pointer group"
        >
          <div className="absolute top-3 right-3 text-zinc-600 group-hover:text-[#ff7a45] transition-colors">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="font-mono text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
            {isVi ? 'Tổng giá trị tồn kho' : 'Total Inventory Value'}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-sans text-3xl font-extrabold text-zinc-100 tracking-tight">
              {formatCurrency(totalValue)}
            </span>
          </div>
          <p className="font-mono text-[8px] text-[#ff9e7d] tracking-wider uppercase mt-3">
            {isVi ? 'GIÁ VỐN FIFO THỜI GIAN THỰC' : 'REAL-TIME FIFO COST BASIS'}
          </p>
          <div className="mt-4 h-[2px] bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-[#ff7a45] w-3/4" />
          </div>
        </div>

        {/* KPI 2: Low stock */}
        <div 
          onClick={() => setActivePage('inventory')}
          className="kpi-card relative overflow-hidden bg-[#111114] border border-[#2c2c35] p-5 rounded-lg hover:border-[#ff7a45]/50 transition-all cursor-pointer group"
        >
          <div className="absolute top-3 right-3 text-zinc-600 group-hover:text-red-400 transition-colors">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="font-mono text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
            {isVi ? 'Cảnh báo Tồn kho thấp' : 'Low Stock Alerts'}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-sans text-3xl font-extrabold text-zinc-100 tracking-tight">
              {lowStockCount}
            </span>
            <span className="font-mono text-xs text-zinc-400 font-bold uppercase">{isVi ? 'MẶT HÀNG' : 'SKUs'}</span>
          </div>
          <p className="font-mono text-[8px] text-red-400 tracking-wider uppercase mt-3">
            {isVi ? 'DƯỚI MỨC TỐI THIỂU (MIN-STOCK)' : 'UNDER MINIMUM QUANTITY'}
          </p>
          <div className="mt-4 h-[2px] bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: `${(lowStockCount / products.length) * 100}%` }} />
          </div>
        </div>

        {/* KPI 3: Deadstock */}
        <div 
          onClick={() => setActivePage('inventory')}
          className="kpi-card relative overflow-hidden bg-[#111114] border border-[#2c2c35] p-5 rounded-lg hover:border-[#ff7a45]/50 transition-all cursor-pointer group"
        >
          <div className="absolute top-3 right-3 text-zinc-600 group-hover:text-amber-400 transition-colors">
            <Clock className="w-4 h-4" />
          </div>
          <p className="font-mono text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
            {isVi ? 'Hàng tồn kho quá lâu' : 'Deadstock items'}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-sans text-3xl font-extrabold text-zinc-100 tracking-tight">
              {deadstockCount}
            </span>
            <span className="font-mono text-xs text-zinc-400 font-bold uppercase">{isVi ? 'MẶT HÀNG' : 'SKUs'}</span>
          </div>
          <p className="font-mono text-[8px] text-amber-500 tracking-wider uppercase mt-3">
            {isVi ? 'TỒN DƯ > 90 NGÀY HOẶC VƯỢT MAX' : 'STAGNANT > 90 DAYS OR OVER MAX'}
          </p>
          <div className="mt-4 h-[2px] bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-amber-500 w-1/4" />
          </div>
        </div>

        {/* KPI 4: Active Shipments */}
        <div 
          onClick={() => setActivePage('operations')}
          className="kpi-card relative overflow-hidden bg-[#111114] border border-[#2c2c35] p-5 rounded-lg hover:border-[#ff7a45]/50 transition-all cursor-pointer group"
        >
          <div className="absolute top-3 right-3 text-zinc-600 group-hover:text-blue-400 transition-colors">
            <Package className="w-4 h-4" />
          </div>
          <p className="font-mono text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
            {isVi ? 'Vận hành đang xử lý' : 'Active Operations'}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-sans text-3xl font-extrabold text-zinc-100 tracking-tight">
              {activeOpsCount}
            </span>
            <span className="font-mono text-xs text-zinc-400 font-bold uppercase">{isVi ? 'PHIẾU' : 'SLIPS'}</span>
          </div>
          <p className="font-mono text-[8px] text-blue-400 tracking-wider uppercase mt-3">
            {isVi ? `${activeReceipts} NHẬP KHO // ${activeDeliveries} XUẤT KHO` : `${activeReceipts} RECEIPTS // ${activeDeliveries} DELIVERIES`}
          </p>
          <div className="mt-4 h-[2px] bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-blue-500 w-1/2" />
          </div>
        </div>

      </div>

      {/* ─── DYNAMIC GOODS FLOW SINE CHART & SMART ALERTS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        
        {/* Left 8 Columns (Imports vs Exports Flow Chart) */}
        <div className="lg:col-span-8">
          <Card className="bg-[#111114] border border-[#22202a] h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b1a20] pb-4 mb-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                    {isVi ? 'Biểu đồ Dòng luân chuyển Hàng hóa' : 'Flow of Goods Chart'}
                  </h3>
                  <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                    {isVi ? 'Tổng lượng hàng Nhập - Xuất trong kho' : 'Visualizing stock movements in vs stock movements out'}
                  </p>
                </div>
                
                {/* Timeframe selector */}
                <div className="flex gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800 shrink-0 font-mono text-[8px] font-bold tracking-widest uppercase">
                  <button 
                    onClick={() => setTimeframe('24h')}
                    className={`px-2.5 py-1 rounded transition-colors ${timeframe === '24h' ? 'bg-[#ff7a45] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    24H
                  </button>
                  <button 
                    onClick={() => setTimeframe('7d')}
                    className={`px-2.5 py-1 rounded transition-colors ${timeframe === '7d' ? 'bg-[#ff7a45] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    7D
                  </button>
                  <button 
                    onClick={() => setTimeframe('30d')}
                    className={`px-2.5 py-1 rounded transition-colors ${timeframe === '30d' ? 'bg-[#ff7a45] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    30D
                  </button>
                  <button 
                    onClick={() => setTimeframe('custom')}
                    className={`px-2.5 py-1 rounded transition-colors ${timeframe === 'custom' ? 'bg-[#ff7a45] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    {isVi ? 'TÙY CHỈNH' : 'CUSTOM'}
                  </button>
                </div>
              </div>

              {timeframe === 'custom' && (
                <div className="flex flex-wrap items-center gap-4 bg-zinc-950/60 p-3 border border-zinc-900 rounded mb-6 animate-fade-in font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span>{isVi ? 'TỪ NGÀY:' : 'FROM DATE:'}</span>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 text-[10px] outline-none focus:border-[#ff7a45]/50 transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{isVi ? 'ĐẾN NGÀY:' : 'TO DATE:'}</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 text-[10px] outline-none focus:border-[#ff7a45]/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Sine Wave Graphic */}
              <div className="relative w-full h-48 overflow-hidden border-b border-[#1b1a20]/45">
                <svg className="w-full h-full" viewBox="0 0 1000 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="glow-rec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#ff7a45" stopOpacity="0.00" />
                    </linearGradient>
                    <linearGradient id="glow-del" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="45" x2="1000" y2="45" stroke="rgba(255,255,255,0.015)" />
                  <line x1="0" y1="90" x2="1000" y2="90" stroke="rgba(255,255,255,0.015)" />
                  <line x1="0" y1="135" x2="1000" y2="135" stroke="rgba(255,255,255,0.015)" />

                  {/* Area fills */}
                  <path d={`${chart.receipts} L1000,180 L0,180 Z`} fill="url(#glow-rec)" />
                  <path d={`${chart.deliveries} L1000,180 L0,180 Z`} fill="url(#glow-del)" />

                  {/* Receipts curve line */}
                  <path d={chart.receipts} fill="none" stroke="#ff7a45" strokeWidth="2.5" filter="drop-shadow(0 0 4px rgba(255, 122, 69, 0.3))" />
                  
                  {/* Deliveries curve line */}
                  <path d={chart.deliveries} fill="none" stroke="#00bcd4" strokeWidth="2.5" filter="drop-shadow(0 0 4px rgba(0, 188, 212, 0.2))" />

                  {/* Active key nodes */}
                  {chart.points.map((pt, idx) => (
                    <g key={idx}>
                      <circle cx={pt.x} cy={pt.y} r="4" fill={idx === 0 ? '#ff7a45' : '#00bcd4'} />
                      <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke={idx === 0 ? '#ff7a45' : '#00bcd4'} strokeWidth="1.5" className="animate-pulse" />
                    </g>
                  ))}
                </svg>

                {/* Floating tooltips */}
                {chart.points.map((pt, idx) => (
                  <div 
                    key={idx}
                    className="absolute font-mono text-[8px] font-bold px-2 py-1 rounded border border-zinc-800 bg-zinc-950/90 text-zinc-300 pointer-events-none"
                    style={{ left: `${pt.x / 10}%`, top: `${pt.y / 1.8}%`, transform: 'translate(-50%, -120%)' }}
                  >
                    {pt.label}
                  </div>
                ))}
              </div>

              {/* Chart Dates Axis */}
              <div className="flex justify-between items-center font-mono text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-4">
                {chart.days.map((d, i) => <span key={i}>{d}</span>)}
              </div>
            </div>

            {/* Legend indicators */}
            <div className="border-t border-[#1b1a20] pt-4 mt-4 flex items-center gap-6 font-mono text-[9px] font-bold tracking-wider text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ff7a45]" />
                <span className="text-zinc-300 uppercase">{isVi ? 'NHẬP KHO' : 'INCOMING RECEIPTS'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#00bcd4]" />
                <span className="text-zinc-300 uppercase">{isVi ? 'XUẤT KHO' : 'OUTGOING DELIVERIES'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 4 Columns (Smart Alerts Warning Feeds) */}
        <div className="lg:col-span-4">
          <Card className="bg-[#111114] border border-[#22202a] h-full p-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#1b1a20] pb-3.5 mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
                    {isVi ? 'Hệ thống Cảnh báo Thông minh' : 'Smart Warning Core'}
                  </h3>
                  <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                    {isVi ? 'Cảnh báo khẩn cấp tại chuỗi cung ứng' : 'Critical logistical failures or stockouts'}
                  </p>
                </div>
                <StatusPill label={isVi ? 'CẢNH BÁO' : 'ACTIVE'} variant="critical" />
              </div>

              {/* Alerts listing */}
              <div className="space-y-3.5 max-h-[260px] overflow-y-auto scrollbar-thin">
                
                {/* Alert 1: Low Stock Alert (OMG-1209) */}
                {products.some(p => p.stock < p.minStock) && (
                  <div className="p-3 border border-red-500/20 bg-red-950/10 rounded flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[9px] font-bold text-red-400 uppercase tracking-widest">
                        {isVi ? 'Tồn dưới mức tối thiểu' : 'Min-Stock alert'}
                      </p>
                      <p className="font-sans text-[10px] text-zinc-300 font-medium leading-relaxed mt-1">
                        {isVi ? 'Lõi pin Lithium-Ion V3 đã cạn kiệt (0/250). Đơn mua hàng nháp đã được tự động khởi tạo.' : 'Lithium-Ion Core is empty. Draft PO auto-triggered.'}
                      </p>
                      <button 
                        onClick={() => setActivePage('purchase')}
                        className="mt-2 text-[8px] font-mono font-bold text-red-400 hover:text-red-300 transition-colors uppercase flex items-center gap-1"
                      >
                        {isVi ? 'MỞ PHÂN HỆ MUA HÀNG' : 'OPEN PROCUREMENT MODULE'}
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Alert 2: Overdue PO alert */}
                {purchaseOrders.some(po => po.id === 'PO-2026-0139' || po.id === 'PO 2026 0139') && (
                  <div className="p-3 border border-amber-500/20 bg-amber-950/10 rounded flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                        {isVi ? 'Hợp đồng mua hàng quá hạn' : 'Overdue vendor PO'}
                      </p>
                      <p className="font-sans text-[10px] text-zinc-300 font-medium leading-relaxed mt-1">
                        {isVi ? 'PO-2026-0139 (ElectroSupply Co) trễ hẹn nhập kho 6 ngày. Đang kiểm định lý do vận tải biển.' : 'PO-2026-0139 delayed by 6 days from ElectroSupply Co.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Alert 3: QC Check alert */}
                {receipts.some(r => r.status === 'ready') && (
                  <div className="p-3 border border-blue-500/20 bg-blue-950/10 rounded flex items-start gap-3">
                    <Activity className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                        {isVi ? 'Đang đợi kiểm định chất lượng (QC)' : 'Pending QC Inspections'}
                      </p>
                      <p className="font-sans text-[10px] text-zinc-300 font-medium leading-relaxed mt-1">
                        {isVi ? `Phiếu nhập hàng #${receipts.find(r => r.status === 'ready')?.id} từ TechParts Global đang chờ QC kiểm thử ngoại quan.` : 'IN-8842 ready for QC checks.'}
                      </p>
                      <button 
                        onClick={() => setActivePage('operations')}
                        className="mt-2 text-[8px] font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase flex items-center gap-1"
                      >
                        {isVi ? 'BẮT ĐẦU KIỂM QC' : 'START INSPECTION'}
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <button 
              onClick={() => setActivePage('operations')}
              className="w-full mt-4 py-2 border border-[#212126] bg-[#0c0c0e] hover:bg-zinc-900 font-mono text-[9px] font-bold tracking-widest text-[#ff7a45] hover:text-[#ff9e7d] uppercase rounded transition-colors"
            >
              {isVi ? 'GIẢI QUYẾT TẤT CẢ CẢNH BÁO' : 'RESOLVE ALL ALERTS'}
            </button>
          </Card>
        </div>

      </div>


      {/* ─── WEATHER-TRIGGERED ALERTS MVP PANEL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        <div className="lg:col-span-12">
          <Card className="bg-[#111114] border border-[#22202a] p-6 relative overflow-hidden">
            {/* Visual background accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#ff7a45]/5 to-transparent pointer-events-none rounded-full blur-2xl" />
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b1a20] pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45] animate-ping" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                    {isVi ? 'Hệ thống Phản ứng Thời tiết Thời gian thực (Alerts MVP)' : 'Real-time Weather Response Alerts MVP'}
                  </h3>
                </div>
                <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                  {isVi ? 'Tự động kiểm tra thời tiết khu vực kho và tự động ra đề xuất xuất hàng lên kệ bán' : 'Automated weather-triggered inventory dispatch mapping rules engine'}
                </p>
              </div>

              {/* Modes Selection */}
              <div className="flex gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800 shrink-0 font-mono text-[8px] font-bold tracking-widest uppercase">
                <button 
                  onClick={() => setWeatherMode('simulate')}
                  className={`px-3 py-1.5 rounded transition-all ${weatherMode === 'simulate' ? 'bg-[#ff7a45] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  {isVi ? 'GIẢ LẬP TEST' : 'SIMULATE'}
                </button>
                <button 
                  onClick={() => setWeatherMode('settings')}
                  className={`px-3 py-1.5 rounded transition-all ${weatherMode === 'settings' ? 'bg-[#ff7a45] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  {isVi ? 'CẤU HÌNH' : 'SETTINGS'}
                </button>
                <button 
                  onClick={() => setWeatherMode('logs')}
                  className={`px-3 py-1.5 rounded transition-all ${weatherMode === 'logs' ? 'bg-[#ff7a45] text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  {isVi ? 'LỊCH SỬ LOG' : 'LOG HISTORY'}
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Current status panel (Always visible) */}
              <div className="lg:col-span-4 flex flex-col justify-between border-r border-[#1b1a20]/60 pr-0 lg:pr-8">
                <div className="space-y-4">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                    {isVi ? 'TRẠNG THÁI THỜI TIẾT KHO HIỆN TẠI' : 'CURRENT WAREHOUSE WEATHER TELEMETRY'}
                  </span>
                  
                  <div className="p-4 border border-[#2c2c35] bg-[#0c0c0e] rounded-lg relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#ff7a45]/10 border border-[#ff7a45]/20 flex items-center justify-center text-[#ff7a45] shadow-[0_0_12px_rgba(255,122,69,0.1)]">
                          {weatherConfig?.simulation?.active ? (
                            weatherConfig?.simulation?.condition?.toLowerCase() === 'rain' ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />
                          ) : (
                            <Activity className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-sans text-xs font-bold text-zinc-200">
                            {weatherConfig?.simulation?.active ? (isVi ? 'Chế độ Giả lập' : 'Simulation Mode') : (isVi ? 'OpenWeather API Thực' : 'Real-time API') }
                          </p>
                          <p className="font-mono text-[9px] text-zinc-500 uppercase mt-0.5">
                            Lat: {weatherConfig?.lat || 10.9} // Lon: {weatherConfig?.lon || 106.9}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-sans text-2xl font-extrabold text-zinc-100 tracking-tight">
                          {weatherConfig?.logs?.[0]?.temp !== undefined ? `${weatherConfig.logs[0].temp}°C` : '28°C'}
                        </p>
                        <p className="font-mono text-[8px] text-[#ff7a45] font-bold uppercase tracking-wider mt-0.5">
                          {weatherConfig?.logs?.[0]?.condition || 'CLEAR'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#1b1a20]/60 pt-3 flex justify-between items-center font-mono text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                      <span>{isVi ? 'CẬP NHẬT CUỐI:' : 'LAST POLLED:'}</span>
                      <span className="text-zinc-300">{weatherConfig?.logs?.[0]?.time ? weatherConfig.logs[0].time.split(' ')[1] : '--:--:--'}</span>
                    </div>
                  </div>

                  {/* Rules status metrics */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center font-mono text-[9px] text-zinc-500 font-bold uppercase">
                      <span>{isVi ? 'ĐỊNH VỊ PHÂN KHU HÀNG HÓA:' : 'MAPPED SHELF DESTINATIONS:'}</span>
                      <span className="text-zinc-400">ZONE D (SAFETY)</span>
                    </div>
                    <div className="p-3 border border-zinc-800/80 bg-zinc-950/40 rounded space-y-2">
                      <div className="flex justify-between items-center font-mono text-[9px]">
                        <span className="text-zinc-400">Rain (Mưa) →</span>
                        <span className="text-[#ff7a45] font-bold">SKU-AOMUA, SKU-ODU</span>
                      </div>
                      <div className="flex justify-between items-center font-mono text-[9px]">
                        <span className="text-zinc-400">Temp &gt; 35°C (Nắng nóng) →</span>
                        <span className="text-[#ff7a45] font-bold">SKU-AOCHONGNANG</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleTriggerNow}
                    disabled={isWeatherWorking}
                    className="w-full py-2.5 border border-[#ff7a45]/30 bg-[#ff7a45]/5 hover:bg-[#ff7a45]/10 active:scale-[0.98] font-mono text-[9px] font-bold tracking-widest text-[#ff7a45] uppercase rounded transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isWeatherWorking ? 'animate-spin' : ''}`} />
                    {isVi ? 'KIỂM TRA THỜI TIẾT NGAY' : 'POLL WEATHER TELEMETRY NOW'}
                  </button>
                </div>
              </div>

              {/* Right Side: Tab Contents (8 Columns) */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                
                {/* TAB 1: SIMULATOR */}
                {weatherMode === 'simulate' && (
                  <div className="space-y-5">
                    <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      {isVi ? 'GIẢ LẬP ĐIỀU KIỆN THỜI TIẾT ĐỂ KIỂM THỬ BẮN TELEGRAM' : 'SIMULATE CONDITIONS FOR INSTANT PUSH NOTIFICATIONS'}
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Condition Selection */}
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] text-zinc-400 font-bold uppercase block">{isVi ? 'Chọn Trạng thái thời tiết:' : 'Select Weather Condition:'}</label>
                        <select
                          value={simCondition}
                          onChange={(e) => setSimCondition(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]"
                        >
                          <option value="Clear">{isVi ? 'Trời quang đãng (Clear)' : 'Clear Sky'}</option>
                          <option value="Rain">{isVi ? 'Mưa lớn giông bão (Rain / Thunderstorm)' : 'Heavy Storm & Rain'}</option>
                          <option value="Clouds">{isVi ? 'Nhiều mây âm u (Clouds)' : 'Cloudy / Overcast'}</option>
                        </select>
                      </div>

                      {/* Temp Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="font-mono text-[9px] text-zinc-400 font-bold uppercase block">{isVi ? 'Giả lập Nhiệt độ:' : 'Simulate Temperature:'}</label>
                          <span className="font-mono text-xs text-[#ff7a45] font-extrabold">{simTemp}°C</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="45"
                          value={simTemp}
                          onChange={(e) => setSimTemp(Number(e.target.value))}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ff7a45]"
                        />
                        <div className="flex justify-between font-mono text-[8px] text-zinc-500 font-bold">
                          <span>10°C</span>
                          <span>25°C</span>
                          <span>35°C ({isVi ? 'Ngưỡng nắng nóng' : 'Heat threshold'})</span>
                          <span>45°C</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-dashed border-zinc-800/80 bg-zinc-950/20 rounded-lg space-y-2">
                      <p className="font-mono text-[9px] text-zinc-400 font-semibold leading-relaxed">
                        💡 <span className="text-[#ff7a45] font-bold">{isVi ? 'Cách kiểm thử:' : 'How to test:'}</span>
                      </p>
                      <ul className="list-disc list-inside font-sans text-[10px] text-zinc-500 space-y-1 pl-1 leading-relaxed">
                        {isVi ? (
                          <>
                            <li>Chọn <b>Mưa lớn</b> hoặc trượt nhiệt độ <b>&gt; 35°C</b> để khớp các quy tắc chỉ định sản phẩm trong kho.</li>
                            <li>Nhấn nút <b>Bắn giả lập cảnh báo</b> ở dưới.</li>
                            <li>Hệ thống sẽ quét các luật và gửi tin nhắn đẩy <b>Telegram Bot</b> tức thời, đồng thời chèn trực tiếp thông báo đỏ lên <b>Console Terminal WMS</b> chính của hệ thống.</li>
                          </>
                        ) : (
                          <>
                            <li>Select <b>Rain</b> or slide temperature <b>&gt; 35°C</b> to match coordinate mapping rules.</li>
                            <li>Click the <b>Trigger Simulation</b> button below.</li>
                            <li>The backend parses mapping tables, pushes messages to <b>Telegram</b> instantly, and prints WMS alert logs.</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <button
                      onClick={handleTriggerSimulate}
                      disabled={isWeatherWorking}
                      className="w-full mt-4 py-3 bg-[#ff7a45] hover:bg-[#ff8f61] active:scale-[0.99] font-mono text-[10px] font-black tracking-widest text-zinc-950 uppercase rounded transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,122,69,0.15)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isVi ? 'KÍCH HOẠT GIẢ LẬP CẢNH BÁO THỜI TIẾT' : 'TRIGGER SIMULATION ALERTS NOW'}
                    </button>
                  </div>
                )}

                {/* TAB 2: CONFIGURATION SETTINGS */}
                {weatherMode === 'settings' && (
                  <form onSubmit={handleSaveConfig} className="space-y-4">
                    <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      {isVi ? 'THIẾT LẬP THAM SỐ API & KÊNH NHẬN TIN NHẮN ĐẨY TELEGRAM' : 'CONFIGURE API CREDENTIALS & TELEGRAM CHAT ENDPOINTS'}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Lat */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[8px] text-zinc-400 font-bold uppercase block">{isVi ? 'Vĩ độ (Latitude):' : 'Latitude:'}</label>
                        <input
                          type="text"
                          value={latInput}
                          onChange={(e) => setLatInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]"
                        />
                      </div>
                      
                      {/* Lon */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[8px] text-zinc-400 font-bold uppercase block">{isVi ? 'Kinh độ (Longitude):' : 'Longitude:'}</label>
                        <input
                          type="text"
                          value={lonInput}
                          onChange={(e) => setLonInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]"
                        />
                      </div>
                    </div>

                    {/* OpenWeather key */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[8px] text-zinc-400 font-bold uppercase block">{isVi ? 'OpenWeatherMap API Key (Miễn phí):' : 'OpenWeatherMap API Key (Free):'}</label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          placeholder="e.g. 8b7d91d8a..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 pr-10 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 font-mono text-[9px] font-bold"
                        >
                          {showApiKey ? 'ẨN' : 'HIỆN'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Telegram Bot Token */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[8px] text-zinc-400 font-bold uppercase block">Telegram Bot Token (BotFather):</label>
                        <div className="relative">
                          <input
                            type={showBotToken ? 'text' : 'password'}
                            value={botTokenInput}
                            onChange={(e) => setBotTokenInput(e.target.value)}
                            placeholder="e.g. 5231144:AAHG..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 pr-10 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowBotToken(!showBotToken)}
                            className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 font-mono text-[9px] font-bold"
                          >
                            {showBotToken ? 'ẨN' : 'HIỆN'}
                          </button>
                        </div>
                      </div>

                      {/* Telegram Chat ID */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[8px] text-zinc-400 font-bold uppercase block">Telegram Chat ID (User/Group ID):</label>
                        <input
                          type="text"
                          value={chatIdInput}
                          onChange={(e) => setChatIdInput(e.target.value)}
                          placeholder="e.g. -100155294"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isWeatherWorking}
                      className="w-full mt-2 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 active:scale-[0.99] font-mono text-[9px] font-black tracking-widest uppercase rounded transition-all"
                    >
                      {isVi ? 'LƯU TẤT CẢ THIẾT LẬP CẤU HÌNH' : 'SAVE WEATHER CONFIGURATIONS'}
                    </button>
                  </form>
                )}

                {/* TAB 3: LOGS */}
                {weatherMode === 'logs' && (
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                      {isVi ? 'LỊCH SỬ GHI NHẬN KIỂM TRA THỜI TIẾT CHẠY NGẦM BACKGROUND' : 'BACKGROUND WORKING POLLS & NOTIFICATIONS PUSH LOG'}
                    </span>

                    <div className="border border-zinc-800 rounded bg-zinc-950/60 p-3 h-48 overflow-y-auto scrollbar-thin font-mono text-[9px] space-y-2">
                      {weatherConfig?.logs && weatherConfig.logs.length > 0 ? (
                        weatherConfig.logs.map((log) => (
                          <div key={log.id} className="border-b border-zinc-900 pb-2 last:border-0">
                            <div className="flex justify-between text-zinc-500 font-bold text-[8px]">
                              <span>[{log.time}] // ID: {log.id}</span>
                              <span className={log.alerts_triggered?.length > 0 ? 'text-red-400' : 'text-zinc-600'}>
                                {log.alerts_triggered?.length > 0 ? (isVi ? '🚨 CÓ CẢNH BÁO' : '🚨 ALERT TRIGGERED') : (isVi ? '✓ THƯỜNG' : '✓ NORMAL')}
                              </span>
                            </div>
                            <div className="mt-1 text-zinc-300">
                              <span>Nguồn: <b>{log.source}</b> | Thời tiết: <b>{log.condition} ({log.temp}°C)</b></span>
                            </div>
                            {log.alerts_triggered?.length > 0 && (
                              <div className="mt-1 pl-2 border-l-2 border-red-500 text-red-300 text-[8px] leading-relaxed">
                                {log.alerts_triggered.map((msg, i) => <p key={i}>• {msg}</p>)}
                              </div>
                            )}
                            <div className="mt-1 text-[8px] text-zinc-500">
                              <span>Telegram push: {log.telegram_sent ? <span className="text-emerald-400 font-bold">SENT SUCCESS</span> : (log.telegram_error ? <span className="text-amber-500">FAILED ({log.telegram_error})</span> : <span className="text-zinc-600">NOT CONFIGURED</span>)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600 font-bold uppercase">
                          {isVi ? 'Không tìm thấy log lịch sử nào.' : 'No polling events recorded yet.'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </Card>
        </div>
      </div>

      {/* ─── AI SECURITY ANOMALY DETECTION CARD ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        <div className="lg:col-span-12">
          <Card className="bg-[#111114]/90 border border-[#22202a] p-6 relative overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Hologram background flare */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-rose-500/5 to-transparent pointer-events-none rounded-full blur-2xl" />

            {/* Header section with status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b1a20] pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${activeOutliersCount > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-200">
                    {isVi ? 'Hệ thống Kiểm toán An ninh & Phát hiện Bất thường AI (Anomaly Detection)' : 'AI Security Anomaly & Fraud Audit Core'}
                  </h3>
                </div>
                <p className="text-[10px] text-zinc-500 tracking-wide mt-1 font-mono uppercase">
                  {isVi ? 'Mô hình isolation forest cô lập giao dịch chuyển kho đột biến, sai lệch số lượng hoặc sai lệch khung giờ' : 'ISOLATION FOREST MODELS AUDITING INVENTORY OUTLIERS & SUSPICIOUS ACTIVITIES'}
                </p>
              </div>
              <StatusPill 
                label={activeOutliersCount > 0 ? (isVi ? '⚠️ PHÁT HIỆN BẤT THƯỜNG' : '⚠️ ANOMALY DETECTED') : (isVi ? '✓ AN TOÀN' : '✓ SECURE')} 
                variant={activeOutliersCount > 0 ? 'critical' : 'ok'} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Diagnostics & Action Button (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between border-r border-[#1b1a20]/60 pr-0 lg:pr-8">
                <div className="space-y-4">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                    {isVi ? 'CHỒNG CHỈ SỐ MÔ HÌNH AI' : 'AI MODEL CALIBRATION PROFILE'}
                  </span>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[9px]">
                    <div className="p-2.5 border border-[#22202a] bg-zinc-950/40 rounded transition-all hover:border-[#ff7a45]/30">
                      <span className="text-zinc-500 block">{isVi ? 'ĐỘ CHÍNH XÁC:' : 'BASELINE ACC:'}</span>
                      <span className="text-zinc-200 font-extrabold text-xs block mt-1">98.6%</span>
                    </div>
                    <div className="p-2.5 border border-[#22202a] bg-zinc-950/40 rounded transition-all hover:border-[#ff7a45]/30">
                      <span className="text-zinc-500 block">{isVi ? 'ĐỀ XUẤT QUÉT:' : 'EVENTS AUDITED:'}</span>
                      <span className="text-zinc-200 font-extrabold text-xs block mt-1">1,284 logs</span>
                    </div>
                    <div className="p-2.5 border border-[#22202a] bg-zinc-950/40 rounded transition-all hover:border-[#ff7a45]/30">
                      <span className="text-zinc-500 block">{isVi ? 'ĐỘ LỆCH PHÁT HIỆN:' : 'OUTLIERS DETECTED:'}</span>
                      <span className={`${activeOutliersCount > 0 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'} font-extrabold text-xs block mt-1`}>
                        {activeOutliersCount}
                      </span>
                    </div>
                    <div className="p-2.5 border border-[#22202a] bg-zinc-950/40 rounded transition-all hover:border-[#ff7a45]/30">
                      <span className="text-zinc-500 block">{isVi ? 'MỨC ĐE DỌA:' : 'THREAT STATE:'}</span>
                      <span className={`${activeOutliersCount > 0 ? (activeThreatLevel === 'HIGH' ? 'text-rose-500' : 'text-amber-500') : 'text-emerald-400'} font-extrabold text-xs block mt-1 uppercase`}>
                        {activeOutliersCount > 0 ? (activeThreatLevel === 'HIGH' ? (isVi ? 'ĐỎ / CAO' : 'RED / HIGH') : (isVi ? 'VÀNG / TRUNG BÌNH' : 'AMBER / MEDIUM')) : (isVi ? 'XANH / AN TOÀN' : 'GREEN / SECURE')}
                      </span>
                    </div>
                  </div>

                  {securityScanStatus === 'scanning' && (
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded space-y-2">
                      <div className="flex justify-between items-center font-mono text-[8px] text-zinc-500 font-bold uppercase">
                        <span>{isVi ? 'TIẾN TRÌNH KIỂM TRA:' : 'AUDITING STATE PROGRESS:'}</span>
                        <span className="text-[#ff7a45]">{securityProgress}%</span>
                      </div>
                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${securityProgress}%` }} />
                      </div>
                      <p className="font-mono text-[8.5px] text-zinc-400 leading-normal uppercase truncate">
                        {securityProgressText}
                      </p>
                    </div>
                  )}

                  {securityScanStatus === 'complete' && (
                    <div className={`p-3 border rounded font-mono text-[9px] leading-relaxed transition-colors duration-300 ${
                      activeOutliersCount > 0 
                        ? 'bg-rose-950/10 border-rose-500/20 text-rose-400' 
                        : 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {activeOutliersCount > 0 ? (
                        <span>
                          ⚠️ {isVi 
                            ? `CẢNH BÁO AN NINH: Phát hiện ${activeOutliersCount} điểm bất thường vượt ngưỡng ${anomalyThreshold.toFixed(2)}. Nhật ký chi tiết đã lọc bên phải.`
                            : `SECURITY ALERT: ${activeOutliersCount} outlier logs scoring above sensitivity threshold ${anomalyThreshold.toFixed(2)}. Logs filtered in timeline.`}
                        </span>
                      ) : (
                        <span>
                          ✓ {isVi
                            ? `HỆ THỐNG AN TOÀN: Không có sự kiện nào vượt ngưỡng bất thường ${anomalyThreshold.toFixed(2)}. Hệ thống hoạt động bình thường.`
                            : `SYSTEM SECURED: Zero anomaly logs detected above threshold ${anomalyThreshold.toFixed(2)}. Operations normal.`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRunSecurityAudit}
                  disabled={securityScanStatus === 'scanning'}
                  className="w-full mt-6 py-2.5 bg-rose-950/30 border border-rose-500/30 hover:bg-rose-500/10 active:scale-[0.98] text-rose-400 font-mono text-[9px] font-bold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${securityScanStatus === 'scanning' ? 'animate-spin' : ''}`} />
                  {isVi ? 'BẮT ĐẦU KIỂM TOÁN AN NINH AI' : 'EXECUTE AI SECURITY SCAN'}
                </button>
              </div>

              {/* Middle Column: Interactive SVG Scatter Plot Radar (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between border-r border-[#1b1a20]/60 pr-0 lg:pr-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      {isVi ? 'BIỂU ĐỒ PHÂN TÁN BẤT THƯỜNG (RADAR)' : 'ANOMALY SCATTER PLOT RADAR'}
                    </span>
                    {selectedPoint && (
                      <button 
                        onClick={() => setSelectedPoint(null)}
                        className="text-[8px] font-mono font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        {isVi ? 'BỎ CHỌN' : 'CLEAR'}
                      </button>
                    )}
                  </div>

                  {/* Interactive Radar Box */}
                  <div className="relative aspect-square bg-[#0a0a0d] border border-[#22202a] rounded p-2 overflow-hidden flex items-center justify-center group shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]">
                    <svg className="w-full h-full text-zinc-800/40" viewBox="0 0 100 100">
                      <defs>
                        {/* Radar sweep radial mask gradient */}
                        <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(16,185,129,0.06)" />
                          <stop offset="70%" stopColor="rgba(16,185,129,0.01)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </radialGradient>
                        <radialGradient id="radar-bg-alert" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(239,68,68,0.08)" />
                          <stop offset="70%" stopColor="rgba(239,68,68,0.01)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </radialGradient>
                      </defs>

                      {/* Radar Glow Background */}
                      <circle cx="50" cy="50" r="48" fill={activeOutliersCount > 0 ? "url(#radar-bg-alert)" : "url(#radar-bg)"} />

                      {/* Concentric Grid Rings */}
                      <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />

                      {/* Technical Tick Labels for Rings */}
                      <text x="52" y="42" fill="rgba(255,255,255,0.15)" fontSize="2.5" fontFamily="monospace">0.67</text>
                      <text x="52" y="32" fill="rgba(255,255,255,0.15)" fontSize="2.5" fontFamily="monospace">0.75</text>
                      <text x="52" y="22" fill="rgba(255,255,255,0.15)" fontSize="2.5" fontFamily="monospace">0.83</text>
                      <text x="52" y="12" fill="rgba(255,255,255,0.15)" fontSize="2.5" fontFamily="monospace">0.91</text>
                      <text x="52" y="4.5" fill="rgba(255,255,255,0.15)" fontSize="2.5" fontFamily="monospace">0.99</text>

                      {/* X / Y Grid Axes */}
                      <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="1 1" />
                      <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="1 1" />

                      {/* Diagonal Helper Lines */}
                      <line x1="15" y1="15" x2="85" y2="85" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="1 2" />
                      <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="1 2" />

                      {/* Dynamic Anomaly Threshold Boundary Area */}
                      {/* Radius formula: threshR = 50 * (anomalyThreshold - 0.59) / 0.4 */}
                      {(() => {
                        const threshR = Math.max(2, 50 * (anomalyThreshold - 0.59) / 0.4);
                        return (
                          <>
                            {/* Inside shaded safe zone */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r={threshR} 
                              fill="rgba(16,185,129,0.03)" 
                              stroke="rgba(16,185,129,0.15)" 
                              strokeWidth="0.4"
                              style={{ transition: 'r 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} 
                            />
                            {/* Dashed danger boundary */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r={threshR} 
                              fill="none" 
                              stroke="rgba(239,68,68,0.45)" 
                              strokeWidth="0.75" 
                              strokeDasharray="2 2"
                              style={{ transition: 'r 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} 
                            />
                          </>
                        );
                      })()}

                      {/* Radar Sweep Scan Line */}
                      {securityScanStatus === 'scanning' && (
                        <line 
                          x1="50" 
                          y1="50" 
                          x2={50 + 48 * Math.cos((securityProgress * 3.6 * Math.PI) / 180)} 
                          y2={50 + 48 * Math.sin((securityProgress * 3.6 * Math.PI) / 180)} 
                          stroke="#ef4444" 
                          strokeWidth="1.2" 
                          opacity="0.85"
                          className="transition-all duration-300"
                        />
                      )}

                      {/* Render All Cluster Points */}
                      {(securityScanStatus === 'complete' 
                        ? allPoints 
                        : normalPoints.map(pt => ({ ...pt, isAnomaly: false, score: pt.score }))
                      ).map((pt) => {
                        const dist = Math.sqrt(Math.pow(pt.x - 50, 2) + Math.pow(pt.y - 50, 2));
                        const currentScore = pt.score || (dist / 50) * 0.4 + 0.59;
                        const isOutlier = currentScore >= anomalyThreshold;
                        const isPointSelected = selectedPoint?.id === pt.id;
                        const isPointHovered = hoveredPoint?.id === pt.id;
                        
                        return (
                          <g key={pt.id} className="transition-all duration-300">
                            {/* Active connection line to center when hovered/selected */}
                            {(isPointSelected || isPointHovered) && (
                              <>
                                <line 
                                  x1={pt.x} 
                                  y1={pt.y} 
                                  x2="50" 
                                  y2="50" 
                                  stroke={isOutlier ? "#ef4444" : "#10b981"} 
                                  strokeDasharray="1.5 1.5" 
                                  strokeWidth="0.5" 
                                  className="animate-pulse"
                                />
                                <line 
                                  x1={pt.x} 
                                  y1={pt.y} 
                                  x2="50" 
                                  y2={pt.y} 
                                  stroke="rgba(255,255,255,0.15)" 
                                  strokeDasharray="1.5 1.5" 
                                  strokeWidth="0.3" 
                                />
                                <line 
                                  x1={pt.x} 
                                  y1={pt.y} 
                                  x2={pt.x} 
                                  y2="50" 
                                  stroke="rgba(255,255,255,0.15)" 
                                  strokeDasharray="1.5 1.5" 
                                  strokeWidth="0.3" 
                                />
                                {/* Floating score tag */}
                                <text 
                                  x={pt.x + 3} 
                                  y={pt.y - 2} 
                                  fill={isOutlier ? "#f87171" : "#34d399"} 
                                  fontSize="3.2" 
                                  fontFamily="monospace" 
                                  fontWeight="bold"
                                >
                                  {currentScore.toFixed(2)}
                                </text>
                              </>
                            )}

                            {/* Ping animation for outliers */}
                            {isOutlier && (
                              <circle 
                                cx={pt.x} 
                                cy={pt.y} 
                                r="4.5" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="0.4" 
                                className="animate-pulse" 
                              />
                            )}

                            {/* Click target helper */}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="4"
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredPoint(pt)}
                              onMouseLeave={() => setHoveredPoint(null)}
                              onClick={() => setSelectedPoint(pt)}
                            />

                            {/* Point Core */}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isPointSelected ? "2.5" : "1.6"}
                              fill={isOutlier ? "#ef4444" : "#10b981"}
                              stroke={isPointSelected ? "#ffffff" : "none"}
                              strokeWidth="0.4"
                              className="cursor-pointer transition-all duration-300 hover:scale-150"
                              onMouseEnter={() => setHoveredPoint(pt)}
                              onMouseLeave={() => setHoveredPoint(null)}
                              onClick={() => setSelectedPoint(pt)}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Floating HTML Hover Tooltip */}
                    {hoveredPoint && (() => {
                      const dist = Math.sqrt(Math.pow(hoveredPoint.x - 50, 2) + Math.pow(hoveredPoint.y - 50, 2));
                      const currentScore = hoveredPoint.score || (dist / 50) * 0.4 + 0.59;
                      const isOutlier = currentScore >= anomalyThreshold;
                      
                      return (
                        <div 
                          className="absolute bg-[#0c0c0e]/95 border border-zinc-800 text-zinc-300 font-mono text-[9px] p-2.5 rounded shadow-xl pointer-events-none z-10 w-52 space-y-1 backdrop-blur-md"
                          style={{ 
                            left: `${Math.min(78, Math.max(22, hoveredPoint.x))}%`, 
                            top: `${Math.min(80, Math.max(15, hoveredPoint.y - 15))}%`, 
                            transform: 'translateX(-50%)' 
                          }}
                        >
                          <div className="flex justify-between items-center font-bold border-b border-zinc-800 pb-1 mb-1">
                            <span className="text-zinc-400">#{hoveredPoint.id}</span>
                            <span className={isOutlier ? "text-rose-400" : "text-emerald-400"}>
                              {isOutlier ? (isVi ? "BẤT THƯỜNG" : "OUTLIER") : (isVi ? "BÌNH THƯỜNG" : "SECURED")}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500">{isVi ? 'Loại: ' : 'Type: '}</span>
                            <span className="text-zinc-200 font-bold">{hoveredPoint.type}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">{isVi ? 'Điểm số: ' : 'Score: '}</span>
                            <span className={`font-bold ${isOutlier ? "text-rose-400" : "text-emerald-400"}`}>{currentScore.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">{isVi ? 'Thời gian: ' : 'Time: '}</span>
                            <span className="text-zinc-300">{hoveredPoint.time}</span>
                          </div>
                          <p className="text-[8.5px] leading-relaxed text-zinc-400 font-sans border-t border-zinc-900 pt-1 mt-1 truncate">
                            {hoveredPoint.desc}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* High-tech sensitivity range slider */}
                  <div className="bg-zinc-950/80 border border-[#22202a] p-3 rounded space-y-2 font-mono">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-zinc-500 tracking-wider">
                        {isVi ? 'ĐỘ NHẠY CẢNH BÁO AI (THRESHOLD):' : 'AI THRESHOLD DETECTION SENSITIVITY:'}
                      </span>
                      <span className="text-[#ff7a45] text-xs font-black">{anomalyThreshold.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[8px] text-zinc-600 font-bold">0.60</span>
                      <input 
                        type="range"
                        min="0.60"
                        max="0.95"
                        step="0.01"
                        value={anomalyThreshold}
                        onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
                        className="flex-1 accent-[#ff7a45] bg-zinc-800 h-1 rounded-full cursor-pointer outline-none"
                      />
                      <span className="text-[8px] text-zinc-600 font-bold">0.95</span>
                    </div>
                    <span className="text-[7.5px] text-zinc-500 block uppercase text-center leading-normal">
                      {isVi ? 'Kéo để co giãn vòng tròn giới hạn an toàn trên biểu đồ' : 'Drag slider to expand/shrink safety boundary on radar'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Security logs listing (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between pl-0 lg:pl-4">
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                    {isVi ? 'NHẬT KÝ KIỂM TOÁN LỌC THEO NGƯỠNG' : 'FILTERED DETECTOR AUDIT LOGS'}
                  </span>

                  <div className="border border-zinc-800 rounded bg-[#0a0a0d] p-3 h-[362px] overflow-y-auto scrollbar-thin font-mono text-[9px] space-y-2.5 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                    {securityScanStatus === 'complete' ? (
                      activeOutliers.length > 0 ? (
                        activeOutliers.map((log) => {
                          const isSelected = selectedPoint?.id === log.id;
                          return (
                            <div 
                              key={log.id} 
                              onClick={() => setSelectedPoint(log)}
                              className={`border rounded p-2.5 cursor-pointer transition-all duration-200 select-none ${
                                isSelected 
                                  ? 'bg-rose-950/15 border-rose-500/40 shadow-[0_0_8px_rgba(239,68,68,0.15)]' 
                                  : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10'
                              }`}
                            >
                              <div className="flex justify-between items-center text-[8px] font-bold">
                                <span className={isSelected ? "text-rose-400 font-black" : "text-[#ff7a45]"}>#{log.id} [{log.time}]</span>
                                <span className="text-rose-400 font-black tracking-wider uppercase">{log.type}</span>
                              </div>
                              <p className="mt-1 text-zinc-400 leading-relaxed font-sans text-[9.5px]">
                                {log.desc}
                              </p>
                              <div className="mt-1.5 flex justify-between items-center border-t border-zinc-900/50 pt-1 text-[7.5px] text-zinc-500">
                                <span>{isVi ? 'Click để xem XAI giải thích' : 'Click to view XAI attribution'}</span>
                                <span className="font-bold text-rose-500">Score: {((Math.sqrt(Math.pow(log.x - 50, 2) + Math.pow(log.y - 50, 2)) / 50) * 0.4 + 0.59).toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-600 font-bold uppercase">
                          <ShieldCheck className="w-10 h-10 text-emerald-500/20 mb-2.5" />
                          <span className="text-emerald-400 text-[10px] tracking-wider mb-1">
                            {isVi ? 'HỆ THỐNG HOÀN TOÀN AN TOÀN' : 'SYSTEM FULLY SECURED'}
                          </span>
                          <span className="text-[8px] text-zinc-500 normal-case font-medium">
                            {isVi ? 'Không phát hiện bất thường nào vượt ngưỡng đã chọn.' : 'No active anomalies detected above current sensitivity threshold.'}
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-600 font-bold uppercase">
                        <ShieldCheck className="w-8 h-8 text-zinc-800 mb-2" />
                        <span>
                          {isVi ? 'Nhấn nút để chạy phân tích an ninh' : 'Execute scan to audit database'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* ─── EXPLAINABLE AI (XAI) ATTRIBUTION SECTION ─── */}
            {selectedPoint && (() => {
              const dist = Math.sqrt(Math.pow(selectedPoint.x - 50, 2) + Math.pow(selectedPoint.y - 50, 2));
              const baseScore = selectedPoint.score || (dist / 50) * 0.4 + 0.59;
              
              // What-if simulated score formula:
              const simulatedScore = Math.min(0.99, Math.max(0.01, baseScore * (0.4 * volumeWeight + 0.4 * timeWeight + 0.2 * authWeight)));
              const isSimulatedAnomaly = simulatedScore >= anomalyThreshold;

              return (
                <div className="mt-8 pt-6 border-t border-[#1b1a20] animate-fade-in space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                    <div>
                      <h4 className="text-[10px] font-mono font-bold tracking-widest text-[#ff7a45] uppercase">
                        {isVi ? 'GIẢI THÍCH MÔ HÌNH AI // PHÂN TÍCH ĐÓNG GÓP THUỘC TÍNH (SHAP/LIME VALUES)' : 'EXPLAINABLE AI (XAI) // SHAPLEY & LIME FEATURE ATTRIBUTION'}
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-mono uppercase mt-0.5">
                        {isVi ? `ĐANG PHÂN TÍCH ĐIỂM DỮ LIỆU: #${selectedPoint.id} (${selectedPoint.type})` : `PROFILING DATA POINT: #${selectedPoint.id} (${selectedPoint.type})`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[9px] bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded">
                      <span className="text-zinc-500 uppercase">{isVi ? 'ĐIỂM SỐ BAN ĐẦU:' : 'ORIGINAL SCORE:'}</span>
                      <span className={`font-bold text-xs ${baseScore >= anomalyThreshold ? 'text-rose-500' : 'text-emerald-400'}`}>{baseScore.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left Panel: Feature Contributions & Slider adjustments */}
                    <div className="lg:col-span-8 bg-[#0a0a0d] border border-zinc-900 rounded p-4 flex flex-col justify-between space-y-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                      <div className="space-y-3.5">
                        <span className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">
                          {isVi ? 'ĐIỀU CHỈNH TRỌNG SỐ THUỘC TÍNH (MÔ PHỎNG WHAT-IF)' : 'ADJUST FEATURE ATTRIBUTION WEIGHTS (WHAT-IF SIMULATION)'}
                        </span>

                        <div className="space-y-3.5 font-mono text-[9px]">
                          {/* Feature 1: Volume Deviation */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-400">Volume Deviation (Độ lệch số lượng):</span>
                              <span className="text-[#ff7a45] font-bold">{(volumeWeight * 100).toFixed(0)}% contribution</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input 
                                type="range" 
                                min="0.0" 
                                max="1.5" 
                                step="0.05"
                                value={volumeWeight}
                                onChange={(e) => setVolumeWeight(Number(e.target.value))}
                                className="flex-1 accent-[#ff7a45] bg-zinc-900 h-1 rounded"
                              />
                            </div>
                            <div className="h-1 bg-zinc-950 rounded overflow-hidden">
                              <div className={`h-full transition-all duration-300 ${volumeWeight > 0.8 ? 'bg-rose-500' : volumeWeight > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, volumeWeight * 100 / 1.5)}%` }} />
                            </div>
                          </div>

                          {/* Feature 2: Time Window Deviation */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-400">Time Window Deviation (Sai lệch khung giờ):</span>
                              <span className="text-[#ff7a45] font-bold">{(timeWeight * 100).toFixed(0)}% contribution</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input 
                                type="range" 
                                min="0.0" 
                                max="1.5" 
                                step="0.05"
                                value={timeWeight}
                                onChange={(e) => setTimeWeight(Number(e.target.value))}
                                className="flex-1 accent-[#ff7a45] bg-zinc-900 h-1 rounded"
                              />
                            </div>
                            <div className="h-1 bg-zinc-950 rounded overflow-hidden">
                              <div className={`h-full transition-all duration-300 ${timeWeight > 0.8 ? 'bg-rose-500' : timeWeight > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, timeWeight * 100 / 1.5)}%` }} />
                            </div>
                          </div>

                          {/* Feature 3: Authorization Profile Deviation */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-400">Authorization Profile Deviation (Hồ sơ phân quyền):</span>
                              <span className="text-[#ff7a45] font-bold">{(authWeight * 100).toFixed(0)}% contribution</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input 
                                type="range" 
                                min="0.0" 
                                max="1.5" 
                                step="0.05"
                                value={authWeight}
                                onChange={(e) => setAuthWeight(Number(e.target.value))}
                                className="flex-1 accent-[#ff7a45] bg-zinc-900 h-1 rounded"
                              />
                            </div>
                            <div className="h-1 bg-zinc-950 rounded overflow-hidden">
                              <div className={`h-full transition-all duration-300 ${authWeight > 0.8 ? 'bg-rose-500' : authWeight > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, authWeight * 100 / 1.5)}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[8px] text-zinc-500 leading-normal uppercase">
                        {isVi 
                          ? '* Hệ số đóng góp SHAP biểu thị mức độ ảnh hưởng của từng đặc trưng lên điểm bất thường. Trọng số lớn làm tăng điểm bất thường.'
                          : '* SHAP contribution weights model the feature significance on the anomaly classifier. High feature weight shifts the classification boundary.'}
                      </p>
                    </div>

                    {/* Right Panel: Re-calculated score Gauge & Status */}
                    <div className="lg:col-span-4 bg-[#0a0a0d] border border-zinc-900 rounded p-4 flex flex-col justify-between items-center text-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                      <span className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest block w-full text-left">
                        {isVi ? 'PHÁN QUYẾT SAU ĐIỀU CHỈNH' : 'WHAT-IF AUDIT JUDGEMENT'}
                      </span>

                      <div className="my-3 space-y-2">
                        <span className="font-mono text-[9px] text-zinc-400 block uppercase">
                          {isVi ? 'ĐIỂM SỐ MÔ PHỎNG:' : 'SIMULATED SCORE:'}
                        </span>
                        
                        <div className="text-3xl font-mono font-black tracking-tighter transition-all duration-300">
                          <span className={isSimulatedAnomaly ? 'text-rose-500' : 'text-emerald-400'}>
                            {simulatedScore.toFixed(2)}
                          </span>
                          <span className="text-zinc-600 text-xs"> / 1.00</span>
                        </div>

                        <div className={`px-3 py-1 rounded-full border text-[8px] font-mono font-extrabold uppercase inline-block ${
                          isSimulatedAnomaly 
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 animate-pulse' 
                            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                        }`}>
                          {isSimulatedAnomaly ? (isVi ? '⚠️ PHÁN QUYẾT: BẤT THƯỜNG' : '⚠️ DECISION: ANOMALY') : (isVi ? '✓ PHÁN QUYẾT: AN TOÀN' : '✓ DECISION: SAFE')}
                        </div>
                      </div>

                      <p className="text-[8.5px] leading-relaxed text-zinc-400 font-sans px-2 border-t border-zinc-900 pt-3">
                        {isSimulatedAnomaly ? (
                          isVi 
                            ? `Báo động vẫn bật: Điểm mô phỏng ${simulatedScore.toFixed(2)} vượt ngưỡng cảnh báo ${anomalyThreshold.toFixed(2)}.`
                            : `Anomaly alert holds: Simulated attribution score ${simulatedScore.toFixed(2)} is above sensitivity limit ${anomalyThreshold.toFixed(2)}.`
                        ) : (
                          isVi
                            ? `Báo động tự động giải phóng: Điểm số giảm xuống ${simulatedScore.toFixed(2)}, dưới ngưỡng cảnh báo ${anomalyThreshold.toFixed(2)}.`
                            : `Alert dismissed: Re-calculated weight adjustments dropped score to ${simulatedScore.toFixed(2)}, below threshold.`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

          </Card>
        </div>
      </div>

      {/* ─── LIVE OPERATIONAL TELEMETRY TERMINAL CONSOLE ─── */}
      <Card className="bg-[#0b0b0e] border border-[#22202a] p-0 overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#22202a] bg-[#0e0e11]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
            <h3 className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              {isVi ? 'LUỒNG HOẠT ĐỘNG VẬN HÀNH THỜI GIAN THỰC' : 'LIVE OPERATIONAL LOG STREAM'}
            </h3>
          </div>
          
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full border border-zinc-700 bg-transparent" />
            <span className="w-1.5 h-1.5 rounded-full border border-zinc-700 bg-transparent" />
            <span className="w-1.5 h-1.5 rounded-full border border-zinc-700 bg-transparent" />
          </div>
        </div>

        {/* Terminal logs list */}
        <div ref={terminalContainerRef} className="p-4 h-52 overflow-y-auto scrollbar-thin terminal-scrollbar font-mono text-[10px] leading-relaxed text-zinc-400 bg-zinc-950/80">
          <div className="space-y-1">
            {notifications.map((log) => {
              let textClass = 'text-zinc-400';
              if (log.type === 'done') textClass = 'text-emerald-400 font-semibold';
              if (log.type === 'warning') textClass = 'text-amber-500 font-semibold';
              if (log.type === 'critical') textClass = 'text-rose-500 font-extrabold';

              return (
                <div key={log.id} className={`${textClass} font-mono tracking-wide flex items-start gap-1`}>
                  <span className="text-zinc-600 font-bold">[{log.time}]</span>
                  <span className="font-extrabold uppercase shrink-0">[{isVi ? log.title : (log.titleEn || log.title)}]:</span>
                  <span className="text-zinc-300 font-sans text-[10px]">{isVi ? log.desc : (log.descEn || log.desc)}</span>
                </div>
              );
            })}
            
            {/* Dynamic typing cursor */}
            <div className="text-zinc-500 font-mono tracking-wide flex items-center gap-0.5 pt-1.5">
              <span>{isVi ? '> PHÒNG CHẨN ĐOÁN: LUỒNG DỮ LIỆU ỔN ĐỊNH...' : '> DIAGNOSTICS CONTROL ROOM: POLLING_STREAMS_OK...'}</span>
              <span className="w-1.5 h-3 bg-[#ff7a45] animate-pulse" />
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
}
