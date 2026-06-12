import { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Cpu,
  Activity,
  Clock,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Compass,
  Barcode,
  Layers,
  Zap,
  Bot,
  Box,
  Eye,
  Settings,
  XCircle,
  MessageSquare,
  Send,
  Truck,
  FileText,
  ShoppingBag,
  Award,
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, StatusPill } from '../components/ui';

const localSuppliersDb = {
  'OMG-9921': [
    { name: 'SteelWorks Ltd', email: 'orders@steelworks.co.uk', lead_time: 5, defect_rate: 0.02, unit_cost: 1500 },
    { name: 'TechParts Global', email: 'sales@techparts.com', lead_time: 3, defect_rate: 0.008, unit_cost: 1650 },
    { name: 'HydraFlow Inc', email: 'support@hydraflow.com', lead_time: 7, defect_rate: 0.045, unit_cost: 1350 }
  ],
  'AK-DO-M': [
    { name: 'VinaGarment Group', email: 'sales@vinagarment.vn', lead_time: 4, defect_rate: 0.015, unit_cost: 300 },
    { name: 'TechParts Global', email: 'sales@techparts.com', lead_time: 3, defect_rate: 0.008, unit_cost: 350 },
    { name: 'General Supplier', email: 'procurement@gensupply.com', lead_time: 6, defect_rate: 0.03, unit_cost: 280 }
  ],
  'OMG-4452': [
    { name: 'ElectroSupply Co', email: 'orders@electrosupply.io', lead_time: 4, defect_rate: 0.025, unit_cost: 450 },
    { name: 'TechParts Global', email: 'sales@techparts.com', lead_time: 3, defect_rate: 0.008, unit_cost: 490 },
    { name: 'HydraFlow Inc', email: 'support@hydraflow.com', lead_time: 7, defect_rate: 0.045, unit_cost: 410 }
  ]
};

export default function ReportsPage() {
  const {
    products,
    lots,
    receipts,
    deliveries,
    internalTransfers,
    adjustments,
    validateAdjustment,
    aiSettings,
    setAiSettings,
    lang,
    createPurchaseOrder,
    processPick,
    setNotifications
  } = useApp();

  const isVi = lang === 'vi';

  // Sub-tabs: 'reports' | 'adjustments' | 'ai'
  const [activeTab, setActiveTab] = useState('reports');
  const [reportsSubtab, setReportsSubtab] = useState('onhand'); // 'onhand' | 'valuation' | 'moves'

  // Physical Audit inputs state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditCounts, setAuditCounts] = useState({});
  const [auditReasons, setAuditReasons] = useState({});

  // ==========================================
  // STATE DEFINITIONS FOR DYNAMIC AI SYSTEMS
  // ==========================================
  const [activeAiTab, setActiveAiTab] = useState('demand_procurement');

  // 1. Demand Forecasting & Supplier Selection States
  const [forecastSku, setForecastSku] = useState('OMG-9921');
  const [isForecastRunning, setIsForecastRunning] = useState(false);
  const [forecastProgress, setForecastProgress] = useState(0);
  const [forecastLogs, setForecastLogs] = useState([]);
  const [demandForecastExecuted, setDemandForecastExecuted] = useState(false);
  const [forecastData, setForecastData] = useState(null);

  const [weightQuality, setWeightQuality] = useState(30);
  const [weightLeadTime, setWeightLeadTime] = useState(50);
  const [weightCost, setWeightCost] = useState(20);
  const [scoredSuppliers, setScoredSuppliers] = useState([]);
  const [replenishQty, setReplenishQty] = useState(400);
  const [poEmailModalOpen, setPoEmailModalOpen] = useState(false);
  const [poEmailDraft, setPoEmailDraft] = useState('');
  const [poEmailSent, setPoEmailSent] = useState(false);

  // 2. Inbound & Outbound Logistics & Market Basket States
  const [selectedInvoice, setSelectedInvoice] = useState('invoice_steelworks_992.pdf');
  const [inboundProgress, setInboundProgress] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrData, setOcrData] = useState(null);
  const [isInboundProcessed, setIsInboundProcessed] = useState(false);
  const [truckQueue, setTruckQueue] = useState([
    { truck: '29C-882.11', driver: 'Nguyễn Văn Tài', cargo: 'Thép tấm OMG-ST', qty: 200, time: '08:00 - 10:00 (Sáng mai)', priority: 'Bình thường' },
    { truck: '51D-991.02', driver: 'Trần Thanh Hùng', cargo: 'Trục khuỷu OMG-HE', qty: 50, time: '10:00 - 11:30 (Sáng mai)', priority: 'Bình thường' }
  ]);

  // Outbound Priority - Picker App Simulation States
  const [deliveriesQueue, setDeliveriesQueue] = useState([
    { id: 'OUT-5522', customer: 'BuildMart JSC', sku: 'OMG-9921', qty: 9, shipping: 'Hỏa tốc 2H', minutes_left: 45, priority: 'Khẩn cấp' },
    { id: 'OUT-5523', customer: 'AutoParts VN', sku: 'OMG-4452', qty: 2, shipping: 'Giao tiết kiệm', minutes_left: 125, priority: 'Thường' },
    { id: 'OUT-5524', customer: 'MegaRetail Corp', sku: 'AK-DO-M', qty: 150, shipping: 'Hỏa tốc 2H', minutes_left: 55, priority: 'Khẩn cấp' },
    { id: 'OUT-5525', customer: 'VinaProcure', sku: 'OMG-8871', qty: 300, shipping: 'Đường bộ tiêu chuẩn', minutes_left: 350, priority: 'Thường' }
  ]);

  // Market Basket Analysis
  const [basketSupport, setBasketSupport] = useState(15);
  const [basketConfidence, setBasketConfidence] = useState(70);
  const [isMiningRunning, setIsMiningRunning] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [miningLogs, setMiningLogs] = useState([]);
  const [minedCombos, setMinedCombos] = useState([]);
  const [comboOutput, setComboOutput] = useState(false);

  // Chatbot SOP RAG States
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'ai',
      text: isVi
        ? 'Chào ní! Tui là Trợ lý Cẩm nang SOP Kho hàng OMEGA. Ní cần hỏi gì về quy trình kho (FIFO, rách hộp, kiểm hàng, sự cố...) hông nè?'
        : 'Hello! I am the OMEGA Warehouse SOP Assistant. Ask me anything about warehouse procedures (FIFO, damaged goods, audits, issues...).',
      source: 'SOP Core'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Chatbot Training & RAG Database States
  const [sopRules, setSopRules] = useState([]);
  const [sopMetadata, setSopMetadata] = useState(null);
  const [isTrainingChatbot, setIsTrainingChatbot] = useState(false);
  const [chatbotTrainingProgress, setChatbotTrainingProgress] = useState(0);
  const [chatbotTrainingLogs, setChatbotTrainingLogs] = useState([]);
  const [newSopRule, setNewSopRule] = useState({
    category: 'FIFO',
    keywords: '',
    title_vi: '',
    title_en: '',
    rule_vi: '',
    rule_en: ''
  });
  const [editingRuleId, setEditingRuleId] = useState(null);

  const fetchSopData = async () => {
    try {
      const resRules = await fetch('/api/ai/chatbot/knowledge');
      if (resRules.ok) {
        const data = await resRules.json();
        setSopRules(data);
      }
      const resMeta = await fetch('/api/ai/chatbot/metadata');
      if (resMeta.ok) {
        const data = await resMeta.json();
        setSopMetadata(data);
      }
    } catch (err) {
      console.error("Error fetching SOP training data:", err);
    }
  };

  useEffect(() => {
    fetchSopData();
  }, []);

  const handleTrainChatbot = async () => {
    setIsTrainingChatbot(true);
    setChatbotTrainingProgress(0);
    setChatbotTrainingLogs([]);
    
    const serverLogs = [
      "🚀 Initializing Supervised Fine-Tuning (SFT) pipeline on local GGUF base...",
      `📂 Loaded ${sopRules.length} SOP documents from knowledge registry...`,
      "🧩 Tokenized inputs successfully. Structuring training datasets...",
      "⚙️ Hyperparameters: Learning Rate=5e-5, Batch Size=2, Weight Decay=0.01.",
      "🔄 Epoch 1/5 - Loss: 1.4582 - Time: 280ms - Accuracy: 84.2%",
      "🔄 Epoch 2/5 - Loss: 0.8924 - Time: 260ms - Accuracy: 90.1%",
      "🔄 Epoch 3/5 - Loss: 0.4121 - Time: 275ms - Accuracy: 95.8%",
      "🔄 Epoch 4/5 - Loss: 0.1874 - Time: 290ms - Accuracy: 97.4%",
      "🔄 Epoch 5/5 - Loss: 0.0432 - Time: 270ms - Accuracy: 99.1%",
      "📊 Evaluating validation set... Bleu Score: 0.942, Perplexity: 1.15.",
      "🎯 Training complete. Output merged with base GGUF model.",
      "💾 Synced weights to local LLM inference cache."
    ];
    
    for (let i = 0; i <= 100; i += 10) {
      setChatbotTrainingProgress(i);
      const logIndex = Math.min(Math.floor((i / 100) * serverLogs.length), serverLogs.length - 1);
      setChatbotTrainingLogs(serverLogs.slice(0, logIndex + 1));
      await new Promise(r => setTimeout(r, 200));
    }

    try {
      const res = await fetch('/api/ai/chatbot/train', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setSopMetadata(data.metadata);
          showToast(isVi ? "Huấn luyện AI thành công!" : "AI Training Completed Successfully!");
        }
      }
    } catch (err) {
      console.error(err);
      showToast(isVi ? "Lỗi kết nối máy chủ AI!" : "AI Server Connection Error!");
    } finally {
      setIsTrainingChatbot(false);
    }
  };

  const handleSaveSopRule = async (e) => {
    e.preventDefault();
    if (!newSopRule.keywords || !newSopRule.title_vi || !newSopRule.rule_vi) {
      showToast(isVi ? "Vui lòng nhập đầy đủ thông tin bắt buộc!" : "Please fill out required fields!");
      return;
    }

    const keywordsArray = newSopRule.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    let updatedRules = [...sopRules];
    if (editingRuleId) {
      updatedRules = updatedRules.map(r => 
        r.id === editingRuleId 
          ? { ...r, ...newSopRule, keywords: keywordsArray }
          : r
      );
      setEditingRuleId(null);
      showToast(isVi ? "Đã cập nhật quy trình SOP!" : "SOP rule updated!");
    } else {
      const newId = `SOP-${Date.now()}`;
      updatedRules.push({
        id: newId,
        ...newSopRule,
        keywords: keywordsArray
      });
      showToast(isVi ? "Đã thêm quy trình SOP mới!" : "New SOP rule added!");
    }

    setNewSopRule({
      category: 'FIFO',
      keywords: '',
      title_vi: '',
      title_en: '',
      rule_vi: '',
      rule_en: ''
    });

    try {
      const res = await fetch('/api/ai/chatbot/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRules)
      });
      if (res.ok) {
        setSopRules(updatedRules);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSopRule = async (id) => {
    const updatedRules = sopRules.filter(r => r.id !== id);
    try {
      const res = await fetch('/api/ai/chatbot/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRules)
      });
      if (res.ok) {
        setSopRules(updatedRules);
        showToast(isVi ? "Đã xóa quy trình SOP!" : "SOP rule deleted!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSopRule = (rule) => {
    setEditingRuleId(rule.id);
    setNewSopRule({
      category: rule.category,
      keywords: rule.keywords.join(', '),
      title_vi: rule.title_vi,
      title_en: rule.title_en || '',
      rule_vi: rule.rule_vi,
      rule_en: rule.rule_en || ''
    });
    showToast(isVi ? "Đang sửa quy trình: " + rule.title_vi : "Editing SOP: " + rule.title_vi);
  };

  // Live countdown timer for Outbound SLA Queue
  useEffect(() => {
    const timerId = setInterval(() => {
      setDeliveriesQueue(prevQueue => {
        const updated = prevQueue.map(d => {
          const nextMin = Math.max(0, d.minutes_left - 1);
          return {
            ...d,
            minutes_left: nextMin,
            priority: nextMin <= 60 ? 'Khẩn cấp' : 'Thường'
          };
        });
        return [...updated].sort((a, b) => {
          if (a.minutes_left <= 60 && b.minutes_left > 60) return -1;
          if (a.minutes_left > 60 && b.minutes_left <= 60) return 1;
          return a.minutes_left - b.minutes_left;
        });
      });
    }, 60000);
    return () => clearInterval(timerId);
  }, []);

  const runLocalSupplierScoringFallback = (sku, wQ, wL, wC) => {
    const rawSuppliers = localSuppliersDb[sku] || [
      { name: 'General Supplier', email: 'procurement@gensupply.com', lead_time: 5, defect_rate: 0.03, unit_cost: 100 },
      { name: 'TechParts Global', email: 'sales@techparts.com', lead_time: 3, defect_rate: 0.008, unit_cost: 120 },
      { name: 'SteelWorks Ltd', email: 'orders@steelworks.co.uk', lead_time: 6, defect_rate: 0.02, unit_cost: 110 }
    ];

    const sumW = wQ + wL + wC;
    const normWeights = [wQ / sumW, wL / sumW, wC / sumW];

    const parsed = rawSuppliers.map(s => {
      const q = 1 - s.defect_rate;
      const l = 10 / s.lead_time;
      const c = 2000 / s.unit_cost;
      return { ...s, q, l, c };
    });

    const sumQ2 = Math.sqrt(parsed.reduce((acc, s) => acc + s.q * s.q, 0)) || 1;
    const sumL2 = Math.sqrt(parsed.reduce((acc, s) => acc + s.l * s.l, 0)) || 1;
    const sumC2 = Math.sqrt(parsed.reduce((acc, s) => acc + s.c * s.c, 0)) || 1;

    const wNorm = parsed.map(s => ({
      ...s,
      vq: (s.q / sumQ2) * normWeights[0],
      vl: (s.l / sumL2) * normWeights[1],
      vc: (s.c / sumC2) * normWeights[2]
    }));

    const ideal = {
      q: Math.max(...wNorm.map(s => s.vq)),
      l: Math.max(...wNorm.map(s => s.vl)),
      c: Math.max(...wNorm.map(s => s.vc))
    };

    const antiIdeal = {
      q: Math.min(...wNorm.map(s => s.vq)),
      l: Math.min(...wNorm.map(s => s.vl)),
      c: Math.min(...wNorm.map(s => s.vc))
    };

    const scored = wNorm.map(s => {
      const dPlus = Math.sqrt(
        Math.pow(s.vq - ideal.q, 2) +
        Math.pow(s.vl - ideal.l, 2) +
        Math.pow(s.vc - ideal.c, 2)
      );
      const dMinus = Math.sqrt(
        Math.pow(s.vq - antiIdeal.q, 2) +
        Math.pow(s.vl - antiIdeal.l, 2) +
        Math.pow(s.vc - antiIdeal.c, 2)
      );
      const score = (dMinus + dPlus) > 0 ? (dMinus / (dPlus + dMinus)) : 0;
      return {
        name: s.name,
        email: s.email,
        lead_time: `${s.lead_time} ngày`,
        defect_rate: `${(s.defect_rate * 100).toFixed(1)}%`,
        unit_cost: s.unit_cost,
        score: Math.round(score * 100)
      };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);
    setScoredSuppliers(sorted);

    if (sorted.length > 0) {
      const topVendor = sorted[0];
      const bodyText = isVi 
        ? `Kính gửi bộ phận kinh doanh ${topVendor.name},\n\nOMEGA WMS xin gửi Đơn Mua Hàng dự thảo PO-AUTO cho mặt hàng ${sku}.\nSố lượng yêu cầu: ${replenishQty} cái.\nThời gian giao hàng dự kiến: ${topVendor.lead_time}.\n\nTrân trọng,\nOMEGA AI Automated Procurement.`
        : `Dear Sales Team at ${topVendor.name},\n\nPlease find attached draft Purchase Order PO-AUTO for ${sku}.\nRequired Quantity: ${replenishQty} units.\nExpected Lead Time: ${topVendor.lead_time}.\n\nBest regards,\nOMEGA WMS Automated Purchasing Core.`;
      
      setPoEmailDraft(bodyText);
    }
  };

  const runLocalOcrFallback = () => {
    const mockOcrData = {
      vendor: selectedInvoice.includes('steelworks') ? 'SteelWorks Ltd' : 'TechParts Global',
      poRef: 'PO-2026-0812',
      eta: '08:00 - 10:00 (Sáng mai)',
      totalVal: '$12,500',
      extractedItems: [
        { sku: 'OMG-9921', name: 'Khung gầm Carbon X-1', qty: 250, unit: 'cái' },
        { sku: 'OMG-4452', name: 'Trục khuỷu OMG-HE', qty: 120, unit: 'cái' }
      ]
    };

    setOcrData(mockOcrData);
    setTruckQueue([
      { truck: '29C-882.11', driver: 'Nguyễn Văn Tài', cargo: 'Thép tấm OMG-ST', qty: 200, time: '08:00 - 10:00 (Sáng mai)', priority: 'Bình thường' },
      { truck: '51D-991.02', driver: 'Trần Thanh Hùng', cargo: 'Trục khuỷu OMG-HE', qty: 50, time: '10:00 - 11:30 (Sáng mai)', priority: 'Bình thường' },
      { truck: '29H-123.45', driver: 'Lê Văn Tám', cargo: 'Khung gầm Carbon X-1', qty: 250, time: '13:00 - 14:30 (Chiều mai)', priority: 'Khẩn cấp' }
    ]);
    setIsInboundProcessed(true);
    showToast(isVi ? 'Phân tích hóa đơn OCR & sắp lịch thành công! (Ngoại tuyến)' : 'OCR analysis & slot scheduling complete! (Offline)');
  };

  const runLocalAssociationMiningFallback = () => {
    const mockRules = [
      { combo: 'OMG-9921 + OMG-4452', support: '24%', confidence: '82%', recommendation: isVi ? 'Xếp cạnh nhau tại Kệ A1 và A2 (Lân cận)' : 'Slot together at Shelf A1 and A2 (Proximity)' },
      { combo: 'OMG-1209 + OMG-8871', support: '18%', confidence: '74%', recommendation: isVi ? 'Xếp cạnh nhau tại Kệ B3 và B4 (Lân cận)' : 'Slot together at Shelf B3 and B4 (Proximity)' }
    ];

    setMinedCombos(mockRules);
    setComboOutput(true);
    showToast(isVi ? 'Đã trích xuất luật kết hợp Apriori! (Ngoại tuyến)' : 'Extracted Apriori association rules! (Offline)');
  };

  // Handlers
  const runForecastSimulation = async () => {
    setIsForecastRunning(true);
    setForecastProgress(0);
    setForecastLogs([]);
    setDemandForecastExecuted(false);
    setForecastData(null);
    
    const selectedProduct = products.find(p => p.sku === forecastSku);
    const currentStock = selectedProduct ? selectedProduct.stock : 150;
    
    const logsList = [
      isVi ? '[Bước 1 - Data Clean] Kết nối cơ sở dữ liệu chuỗi thời gian (Time-Series Data)...' : '[Step 1 - Data Clean] Connecting to Time-Series database...',
      isVi ? '[Bước 1 - Data Clean] Lọc bỏ đột biến bán sỉ nhiễu (outliers)...' : '[Step 1 - Data Clean] Filtering out wholesale outlier spikes...',
      isVi ? '[Bước 2 - Feature Eng] Tính toán Lag Features (t-7, t-30, t-365) và Mùa vụ...' : '[Step 2 - Feature Eng] Building Lag Features (t-7, t-30, t-365) and Seasonality...',
      isVi ? '[Bước 3 - Model Training] Huấn luyện mô hình XGBoost Regressor trên chuỗi thời gian...' : '[Step 3 - Model Training] Training XGBoost Regressor on time-series...',
      isVi ? '[Bước 4 - Recommendation] Đang tính toán tốc độ tiêu thụ dự kiến và Ngày cháy hàng...' : '[Step 4 - Recommendation] Computing predicted consumption velocity and Days to Stockout...'
    ];
    
    let current = 0;
    const timer = setInterval(async () => {
      if (current < logsList.length) {
        setForecastLogs(prev => [...prev, logsList[current]]);
        setForecastProgress(Math.round(((current + 1) / logsList.length) * 100));
        current++;
      } else {
        clearInterval(timer);
        try {
          const res = await fetch('/api/ai/forecast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sku: forecastSku, current_stock: currentStock })
          });
          if (res.ok) {
            const data = await res.json();
            setForecastData(data);
            if (data.trigger_alert) {
              setNotifications(prev => [
                {
                  id: `NT-WARN-${Date.now()}`,
                  type: 'critical',
                  title: isVi ? `Cảnh báo cháy hàng: ${data.sku}` : `Stockout Alert: ${data.sku}`,
                  desc: data.recommendation,
                  time: new Date().toTimeString().split(' ')[0]
                },
                ...prev
              ]);
            }
            await fetchSupplierScoring(data.sku, weightQuality, weightLeadTime, weightCost);
          }
        } catch (err) {
          console.error(err);
          // Fallback simulation if backend is offline
          const mockVelocity = forecastSku === 'OMG-9921' ? 12.5 : (forecastSku === 'AK-DO-M' ? 8.2 : 9.5);
          const mockDaysToStockout = Math.round((currentStock / mockVelocity) * 10) / 10;
          const mockLeadTime = forecastSku === 'OMG-9921' ? 5 : (forecastSku === 'AK-DO-M' ? 4 : 5);
          const mockTriggerAlert = mockDaysToStockout < mockLeadTime;
          const mockOutliers = 3;
          const recName = forecastSku === 'OMG-9921' ? "Khung gầm Carbon X-1" : (forecastSku === 'AK-DO-M' ? "Áo khoác Đỏ M" : "Sản phẩm");
          const mockRec = mockTriggerAlert 
            ? `⚠️ CẢNH BÁO: Mặt hàng '${recName}' (${forecastSku}) hiện còn ${currentStock} cái. Tốc độ tiêu thụ dự báo là ${mockVelocity} cái/ngày. Hàng sẽ cạn kho trong ${mockDaysToStockout} ngày nữa. Thời gian giao hàng dự kiến là ${mockLeadTime} ngày. Đề xuất quy trình mua hàng đấu thầu khẩn cấp.`
            : `✅ AN TOÀN: Mặt hàng '${recName}' (${forecastSku}) hiện còn ${currentStock} cái. Đủ cung ứng trong ${mockDaysToStockout} ngày (vượt quá Lead time ${mockLeadTime} ngày).`;
          
          const mockForecastPoints = [];
          for (let i = 1; i <= 7; i++) {
            const dayLabel = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            mockForecastPoints.push({ day: dayLabel, qty: Math.max(0, Math.round(mockVelocity + (Math.random() - 0.5) * 3)) });
          }

          const mockData = {
            sku: forecastSku,
            velocity: mockVelocity,
            days_to_stockout: mockDaysToStockout,
            lead_time: mockLeadTime,
            trigger_alert: mockTriggerAlert,
            recommendation: mockRec,
            forecast_points: mockForecastPoints,
            num_outliers_removed: mockOutliers
          };

          setForecastData(mockData);
          if (mockData.trigger_alert) {
            setNotifications(prev => [
              {
                id: `NT-WARN-${Date.now()}`,
                type: 'critical',
                title: isVi ? `Cảnh báo cháy hàng: ${mockData.sku}` : `Stockout Alert: ${mockData.sku}`,
                desc: mockData.recommendation,
                time: new Date().toTimeString().split(' ')[0]
              },
              ...prev
            ]);
          }
          runLocalSupplierScoringFallback(forecastSku, weightQuality, weightLeadTime, weightCost);
          showToast(isVi ? 'Ngoại tuyến: Đã chuyển sang chế độ giả lập AI nội tuyến' : 'Offline: Switched to local AI simulation mode');
        } finally {
          setIsForecastRunning(false);
          setDemandForecastExecuted(true);
        }
      }
    }, 300);
  };

  const fetchSupplierScoring = async (sku, wQ, wL, wC) => {
    try {
      const res = await fetch('/api/ai/supplier-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: sku,
          weight_quality: wQ,
          weight_lead_time: wL,
          weight_cost: wC
        })
      });
      if (res.ok) {
        const data = await res.json();
        setScoredSuppliers(data.suppliers);
        
        if (data.suppliers && data.suppliers.length > 0) {
          const topVendor = data.suppliers[0];
          const qtyNeeded = replenishQty; 
          const bodyText = isVi 
            ? `Kính gửi bộ phận kinh doanh ${topVendor.name},\n\nOMEGA WMS xin gửi Đơn Mua Hàng dự thảo PO-AUTO cho mặt hàng ${sku}.\nSố lượng yêu cầu: ${qtyNeeded} cái.\nThời gian giao hàng dự kiến: ${topVendor.lead_time}.\n\nTrân trọng,\nOMEGA AI Automated Procurement.`
            : `Dear Sales Team at ${topVendor.name},\n\nPlease find attached draft Purchase Order PO-AUTO for ${sku}.\nRequired Quantity: ${qtyNeeded} units.\nExpected Lead Time: ${topVendor.lead_time}.\n\nBest regards,\nOMEGA WMS Automated Purchasing Core.`;
          
          setPoEmailDraft(bodyText);
        }
      } else {
        runLocalSupplierScoringFallback(sku, wQ, wL, wC);
      }
    } catch (err) {
      console.error(err);
      runLocalSupplierScoringFallback(sku, wQ, wL, wC);
    }
  };

  const runSupplierScoring = async () => {
    await fetchSupplierScoring(forecastSku, weightQuality, weightLeadTime, weightCost);
    showToast(isVi ? 'Đã tính toán lại điểm nhà cung cấp!' : 'Re-calculated supplier scorecard!');
  };

  const handleOpenPoEmail = (supplier) => {
    const text = isVi 
      ? `Kính gửi bộ phận bán hàng ${supplier.name},\n\nChúng tôi xin gửi Đơn Mua Hàng dự thảo PO-AUTO cho sản phẩm ${forecastSku}.\nSố lượng yêu cầu: ${replenishQty} cái.\nThời gian giao hàng dự kiến: ${supplier.lead_time}.\n\nTrân trọng,\nOMEGA AI Automated Purchasing Core.`
      : `Dear Sales Team at ${supplier.name},\n\nPlease find attached draft Purchase Order PO-AUTO for ${forecastSku}.\nRequired Quantity: ${replenishQty} units.\nExpected Lead Time: ${supplier.lead_time}.\n\nBest regards,\nOMEGA WMS Purchasing Core.`;
    
    setPoEmailDraft(text);
    setPoEmailSent(false);
    setPoEmailModalOpen(true);
  };

  const sendReplenishPoEmail = async () => {
    if (scoredSuppliers.length === 0) return;
    setPoEmailSent(true);
    
    const topVendor = scoredSuppliers[0];
    try {
      const res = await fetch('/api/ai/dispatch-po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor: topVendor.name,
          email: topVendor.email,
          body: poEmailDraft,
          sku: forecastSku,
          qty: replenishQty
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        
        const newPo = {
          id: data.po_id,
          vendor: topVendor.name,
          items: 1,
          total: replenishQty * (topVendor.unit_cost || 100),
          status: 'draft',
          expected: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        
        createPurchaseOrder(newPo);
        showToast(data.message);
        setPoEmailModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      showToast(isVi ? 'Gửi PO thất bại!' : 'Failed to send PO!');
    } finally {
      setPoEmailSent(false);
    }
  };

  const runOcrInvoiceAnalysis = async () => {
    setInboundProgress(true);
    setOcrProgress(0);
    setOcrData(null);
    setIsInboundProcessed(false);
    
    const lowStockSkus = products.filter(p => p.stock < p.minStock).map(p => p.sku);
    
    const interval = setInterval(() => {
      setOcrProgress(prev => {
        if (prev < 100) {
          return prev + 15;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 150);
    
    try {
      const res = await fetch('/api/ai/inbound-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedInvoice,
          low_stock_skus: lowStockSkus
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setOcrData(data);
          setTruckQueue(data.truck_queue);
          setInboundProgress(false);
          setIsInboundProcessed(true);
          showToast(isVi ? 'Phân tích hóa đơn OCR & sắp lịch thành công!' : 'OCR analysis & slot scheduling complete!');
        }, 1100);
      } else {
        clearInterval(interval);
        setOcrProgress(100);
        setTimeout(() => {
          runLocalOcrFallback();
          setInboundProgress(false);
        }, 800);
      }
    } catch (err) {
      clearInterval(interval);
      setOcrProgress(100);
      setTimeout(() => {
        runLocalOcrFallback();
        setInboundProgress(false);
      }, 800);
    }
  };

  const runAssociationMining = async () => {
    setIsMiningRunning(true);
    setMiningProgress(0);
    setMiningLogs([]);
    setComboOutput(false);
    
    const logsList = [
      isVi ? '[Bước 1 - Data Mining] Đang quét lịch sử hóa đơn 6 tháng qua...' : '[Step 1 - Data Mining] Scanning past 6 months invoice history...',
      isVi ? '[Bước 2 - Tree Build] Xây dựng ma trận tần suất mua hàng (FP-Tree)...' : '[Step 2 - Tree Build] Building FP-Tree frequency matrix...',
      isVi ? '[Bước 3 - Pruning] Loại bỏ các cặp có độ hỗ trợ thấp...' : '[Step 3 - Pruning] Pruning low support candidate pairs...',
      isVi ? '[Bước 4 - Analysis] Khai thác luật kết hợp Apriori...' : '[Step 4 - Analysis] Mining Apriori association rules...'
    ];
    
    let curr = 0;
    const timer = setInterval(async () => {
      if (curr < logsList.length) {
        setMiningLogs(prev => [...prev, logsList[curr]]);
        setMiningProgress(Math.round(((curr + 1) / logsList.length) * 100));
        curr++;
      } else {
        clearInterval(timer);
        try {
          const res = await fetch('/api/ai/market-basket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              support: basketSupport,
              confidence: basketConfidence
            })
          });
          if (res.ok) {
            const data = await res.json();
            setMinedCombos(data.rules);
            setComboOutput(true);
            showToast(isVi ? 'Đã trích xuất luật kết hợp Apriori!' : 'Extracted Apriori association rules!');
          } else {
            runLocalAssociationMiningFallback();
          }
        } catch (err) {
          console.error(err);
          runLocalAssociationMiningFallback();
        } finally {
          setIsMiningRunning(false);
        }
      }
    }, 300);
  };

  const runLocalChatbotFallback = (query) => {
    let responseText = '';
    const q = query.toLowerCase();
    if (q.includes('rách') || q.includes('hỏng') || q.includes('damaged') || q.includes('móp')) {
      responseText = isVi
        ? '📦 QUY TRÌNH XỬ LÝ HÀNG HỎNG/RÁCH HỘP:\n1. Chụp ảnh hiện trạng gói hàng làm bằng chứng.\n2. Lập biên bản đồng kiểm ký xác nhận với tài xế xe giao hàng.\n3. Gắn nhãn trạng thái "QC_FAIL" hoặc "HOLD" và di chuyển sản phẩm về khu vực cách ly kiểm định.\n4. Cập nhật lý do và chênh lệch trên hệ thống OMEGA WMS.'
        : '📦 DAMAGED GOODS SOP:\n1. Take photos of the packaging damage as evidence.\n2. Create a joint inspection report signed by the driver.\n3. Put a "QC_FAIL" or "HOLD" tag and move items to the quarantine area.\n4. Log discrepancies and reasons on OMEGA WMS.';
    } else if (q.includes('fifo') || q.includes('lifo') || q.includes('xuất kho') || q.includes('nhặt')) {
      responseText = isVi
        ? '🕒 QUY TẮC FIFO (FIRST IN, FIRST OUT):\n- Khi xuất kho hàng hóa, hệ thống OMEGA sẽ tự động chỉ định các Lô hàng (LOT) nhập trước xuất trước.\n- Nhân viên phải lấy hàng theo đúng sơ đồ kệ chỉ định để đảm bảo xoay vòng lô hàng, tránh hết hạn sử dụng.'
        : '🕒 FIFO RULE (FIRST IN, FIRST OUT):\n- When outbound orders are processed, OMEGA automatically assigns the oldest LOT IDs first.\n- Staff must retrieve items from the designated coordinates to ensure inventory rotation.';
    } else if (q.includes('nhập kho') || q.includes('receipt') || q.includes('ocr')) {
      responseText = isVi
        ? '🚚 QUY TRÌNH NHẬP KHO TIÊU CHUẨN:\n1. Quét hóa đơn đầu vào bằng AI OCR để tự động điền manifest.\n2. Xe tải cập cảng bốc dỡ hàng theo lịch ưu tiên của AI.\n3. Thực hiện kiểm định QC chất lượng ngẫu nhiên.\n4. Xếp hàng vào kệ (Putaway) theo chỉ dẫn vị trí tối ưu từ AI và quét mã vạch xác nhận.'
        : '🚚 STANDARD INBOUND SOP:\n1. Scan invoices using AI OCR to auto-fill manifests.\n2. Trucks unload cargo at docks according to AI schedule priority.\n3. Perform random quality QC checks.\n4. Putaway items into optimal shelf slots and scan barcode to bind.';
    } else {
      responseText = isVi
        ? '🤖 Tui đã ghi nhận câu hỏi của ní rồi nhe. Đây là gợi ý quy trình chuẩn SOP Kho:\n- Hãy đảm bảo quét mã vạch (Binding) chính xác vị trí kệ.\n- Mọi sự cố phát sinh cần báo bộ phận quản lý kho để lập biên bản xử lý.'
        : '🤖 I have noted your question. SOP Suggestion:\n- Always scan barcodes to bind inventory correctly.\n- Report any issues or discrepancies to the warehouse manager immediately.';
    }
    setChatHistory(prev => [...prev, { role: 'ai', text: responseText, source: 'Offline Knowledge Base' }]);
  };

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    const query = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, lang: isVi ? 'vi' : 'en' })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { role: 'ai', text: data.response, source: data.source || 'Local LLM' }]);
      } else {
        runLocalChatbotFallback(query);
      }
    } catch (err) {
      console.error(err);
      runLocalChatbotFallback(query);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleConfirmPick = (deliveryId) => {
    processPick(deliveryId);
    setDeliveriesQueue(prev => prev.filter(d => d.id !== deliveryId));
    showToast(isVi ? `Đã hoàn tất nhặt hàng cho đơn ${deliveryId}!` : `Successfully picked order ${deliveryId}!`);
  };

  // Formatting currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Chronological Moves helper
  const getMovesList = () => {
    const list = [];
    receipts.forEach(r => {
      if (r.status === 'done') {
        list.push({ id: r.id, ref: r.ref, type: 'IN', detail: isVi ? `Nhập kho từ ${r.partner}` : `Receipt from ${r.partner}`, date: r.date, val: r.items.reduce((acc, i) => acc + i.qty, 0) });
      }
    });
    deliveries.forEach(d => {
      if (d.status === 'done') {
        list.push({ id: d.id, ref: d.ref, type: 'OUT', detail: isVi ? `Giao hàng đến ${d.partner}` : `Delivery to ${d.partner}`, date: d.date, val: d.items.reduce((acc, i) => acc + i.qty, 0) });
      }
    });
    internalTransfers.forEach(t => {
      list.push({ id: t.id, ref: isVi ? 'Nội bộ' : 'Internal', type: 'MOVE', detail: isVi ? `Di chuyển ${t.qty} từ ${t.from} đến ${t.to}` : `Move ${t.qty} from ${t.from} to ${t.to}`, date: t.date, val: t.qty });
    });
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Physical Audit sheet initializer
  const startPhysicalAudit = () => {
    const initialCounts = {};
    const initialReasons = {};
    products.forEach(p => {
      initialCounts[p.sku] = p.stock;
      initialReasons[p.sku] = 'Kiểm kho định kỳ khớp số liệu';
    });
    setAuditCounts(initialCounts);
    setAuditReasons(initialReasons);
    setIsAuditing(true);
  };

  // Barcode scanner simulator
  const simulateBarcodeScan = (sku) => {
    setAuditCounts(prev => ({
      ...prev,
      [sku]: (prev[sku] || 0) + 1
    }));
  };

  const handleValidateAudit = () => {
    const countedRows = products.map(p => ({
      sku: p.sku,
      systemQty: p.stock,
      actualQty: Number(auditCounts[p.sku] !== undefined ? auditCounts[p.sku] : p.stock),
      reasonDetail: auditReasons[p.sku] || 'Cân bằng hao hụt chu kỳ'
    }));

    validateAdjustment(null, countedRows);
    setIsAuditing(false);
  };

  // Dynamic toast feedback
  const [toastText, setToastText] = useState('');
  const showToast = (txt) => {
    setToastText(txt);
    setTimeout(() => setToastText(''), 3500);
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in text-zinc-100 relative">
      
      {/* Dynamic Toast Feedback Overlay */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 py-3 px-5 bg-zinc-950 border border-[#ff7a45] text-[#ff7a45] font-mono text-[10px] font-bold rounded shadow-2xl flex items-center gap-2 animate-bounce">
          <Zap className="w-3.5 h-3.5 animate-pulse text-[#ff7a45]" />
          <span>{toastText}</span>
        </div>
      )}

      {/* ─── MAIN TABS NAVIGATION ─── */}
      <div className="flex items-center gap-6 border-b border-[#1b1a20] pb-3 mb-8 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
        <button
          onClick={() => setActiveTab('reports')}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'reports' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'BÁO CÁO TỒN KHO & LUỒNG DI CHUYỂN' : 'STANDARD WAREHOUSE REPORTS'}
          {activeTab === 'reports' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button
          onClick={() => setActiveTab('adjustments')}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'adjustments' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'CÂN BẰNG & KIỂM KÊ VẬT LÝ' : 'PHYSICAL STOCK AUDITS'}
          {activeTab === 'adjustments' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'ai' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'ĐẦU NỐI AI CORE HỆ THỐNG KHO' : 'OMEGA AI CONTROL DECK'}
          {activeTab === 'ai' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────
          TAB 1: STANDARD WAREHOUSE REPORTS & MOVEMENT AUDITS
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 3 Columns: Reports catalogs list */}
          <div className="lg:col-span-3">
            <Card className="bg-[#111114] border border-[#22202a] p-4 space-y-2 h-full">
              <p className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-3">{isVi ? 'Danh mục Báo cáo' : 'Report Index'}</p>
              <button
                onClick={() => setReportsSubtab('onhand')}
                className={`w-full py-2.5 px-4 rounded text-left font-mono text-[10px] font-bold tracking-wide uppercase transition-all ${reportsSubtab === 'onhand' ? 'bg-[#ff7a45]/10 text-[#ff7a45] border-l-2 border-[#ff7a45]' : 'hover:bg-zinc-900/60 text-zinc-400'}`}
              >
                {isVi ? 'TỒN KHO THỰC TẾ (ON HAND)' : 'STOCK ON HAND'}
              </button>
              <button
                onClick={() => setReportsSubtab('valuation')}
                className={`w-full py-2.5 px-4 rounded text-left font-mono text-[10px] font-bold tracking-wide uppercase transition-all ${reportsSubtab === 'valuation' ? 'bg-[#ff7a45]/10 text-[#ff7a45] border-l-2 border-[#ff7a45]' : 'hover:bg-zinc-900/60 text-zinc-400'}`}
              >
                {isVi ? 'ĐỊNH GIÁ KHO (FIFO)' : 'INVENTORY VALUATION'}
              </button>
              <button
                onClick={() => setReportsSubtab('moves')}
                className={`w-full py-2.5 px-4 rounded text-left font-mono text-[10px] font-bold tracking-wide uppercase transition-all ${reportsSubtab === 'moves' ? 'bg-[#ff7a45]/10 text-[#ff7a45] border-l-2 border-[#ff7a45]' : 'hover:bg-zinc-900/60 text-zinc-400'}`}
              >
                {isVi ? 'NHẬT KÝ DI CHUYỂN HÀNG' : 'STOCK MOVEMENT AUDIT'}
              </button>
            </Card>
          </div>

          {/* Right 9 Columns: Render Subtab Grid */}
          <div className="lg:col-span-9">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full">
              {/* Subtab 1: Stock On Hand */}
              {reportsSubtab === 'onhand' && (
                <div>
                  <div className="border-b border-[#1b1a20] pb-3 mb-5">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">{isVi ? 'Báo cáo tồn kho theo vị trí kệ' : 'Quantity by specific shelf coordinates'}</h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">{isVi ? 'Số lượng tồn và tọa độ thực tế tương ứng' : 'Audit coordinates of physical items'}</p>
                  </div>
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-sm font-mono text-[11px]">
                      <thead>
                        <tr className="border-b border-[#1b1a20] text-zinc-500 uppercase text-left">
                          <th className="py-2 px-3">{isVi ? 'MÃ SKU' : 'SKU'}</th>
                          <th className="py-2 px-3">{isVi ? 'TÊN SẢN PHẨM' : 'NAME'}</th>
                          <th className="py-2 px-3">{isVi ? 'ĐỊNH VỊ KỆ KHO' : 'LOCATION PATH'}</th>
                          <th className="py-2 px-3 text-right">{isVi ? 'LƯỢNG TỒN' : 'ON HAND'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.sku} className="border-b border-[#1b1a20]/40">
                            <td className="py-3 px-3 text-zinc-400">#{p.sku}</td>
                            <td className="py-3 px-3 font-sans font-bold text-zinc-200">{isVi ? p.name : (p.nameEn || p.name)}</td>
                            <td className="py-3 px-3 text-zinc-500">{p.location}</td>
                            <td className="py-3 px-3 text-right font-extrabold text-[#ff7a45]">{p.stock} {isVi ? p.unit : (p.unitEn || p.unit)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab 2: Valuation */}
              {reportsSubtab === 'valuation' && (
                <div>
                  <div className="border-b border-[#1b1a20] pb-3 mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">{isVi ? 'Báo cáo định giá tồn kho (FIFO)' : 'Inventory cost valuation (FIFO rule)'}</h3>
                      <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">{isVi ? 'Tính giá trị kho bằng đơn giá thực tế lô mua hàng' : 'Asset value based on real consignment costs'}</p>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-[#ff7a45]">
                      {isVi ? 'TỔNG ĐỊNH GIÁ: ' : 'TOTAL VALUATION: '}
                      {formatCurrency(products.reduce((acc, p) => acc + (p.stock * p.cost), 0))}
                    </span>
                  </div>
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-sm font-mono text-[11px]">
                      <thead>
                        <tr className="border-b border-[#1b1a20] text-zinc-500 uppercase text-left">
                          <th className="py-2 px-3">{isVi ? 'MÃ SKU' : 'SKU'}</th>
                          <th className="py-2 px-3">{isVi ? 'TÊN SẢN PHẨM' : 'NAME'}</th>
                          <th className="py-2 px-3 text-right">{isVi ? 'LƯỢNG TỒN' : 'ON HAND'}</th>
                          <th className="py-2 px-3 text-right">{isVi ? 'GIÁ VỐN PO' : 'UNIT COST'}</th>
                          <th className="py-3 px-3 text-right">{isVi ? 'TỔNG TRỊ GIÁ' : 'TOTAL VALUE'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.sku} className="border-b border-[#1b1a20]/40">
                            <td className="py-3 px-3 text-zinc-400">#{p.sku}</td>
                            <td className="py-3 px-3 font-sans font-bold text-zinc-200">{isVi ? p.name : (p.nameEn || p.name)}</td>
                            <td className="py-3 px-3 text-right text-zinc-300">{p.stock} {isVi ? p.unit : (p.unitEn || p.unit)}</td>
                            <td className="py-3 px-3 text-right text-zinc-500">{formatCurrency(p.cost)}</td>
                            <td className="py-3 px-3 text-right font-extrabold text-[#ff7a45]">
                              {formatCurrency(p.stock * p.cost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab 3: Stock Movement audits */}
              {reportsSubtab === 'moves' && (
                <div>
                  <div className="border-b border-[#1b1a20] pb-3 mb-5">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">{isVi ? 'Nhật ký di chuyển hàng hóa toàn cục' : 'Global stock movements audit trail'}</h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">{isVi ? 'Lịch sử kiểm tra mọi hoạt động nhập, xuất và chuyển kho' : 'Auditable trace of all inventory transactions'}</p>
                  </div>
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-sm font-mono text-[11px]">
                      <thead>
                        <tr className="border-b border-[#1b1a20] text-zinc-500 uppercase text-left">
                          <th className="py-2 px-3">{isVi ? 'MÃ PHIẾU' : 'DOCUMENT ID'}</th>
                          <th className="py-2 px-3">{isVi ? 'PHÂN LOẠI' : 'MOVE TYPE'}</th>
                          <th className="py-2 px-3">{isVi ? 'NỘI DUNG DI CHUYỂN' : 'DESCRIPTION'}</th>
                          <th className="py-2 px-3 text-right">{isVi ? 'LƯỢNG HÀNG' : 'QTY MOVED'}</th>
                          <th className="py-3 px-3 text-right">{isVi ? 'NGÀY' : 'DATE'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getMovesList().map((mv) => (
                          <tr key={mv.id} className="border-b border-[#1b1a20]/40">
                            <td className="py-3 px-3 text-[#ff7a45] font-bold">#{mv.id}</td>
                            <td className="py-3 px-3">
                              <StatusPill
                                label={mv.type}
                                variant={mv.type === 'IN' ? 'ok' : mv.type === 'OUT' ? 'alert' : 'warning'}
                              />
                            </td>
                            <td className="py-3 px-3 text-zinc-300 font-sans">{mv.detail}</td>
                            <td className="py-3 px-3 text-right font-extrabold text-zinc-200">{mv.val} pcs</td>
                            <td className="py-3 px-3 text-right text-zinc-500">{mv.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 2: PHYSICAL STOCKTAKING ADJUSTMENT SYSTEM
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'adjustments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (8 cols): Active stocktaking sheet */}
          <div className="lg:col-span-8">
            {!isAuditing ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                      {isVi ? 'NHẬT KÝ HỒ SƠ CÂN BẰNG KHO HÀNG' : 'INVENTORY ADJUSTMENTS RECORDS'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                      {isVi ? 'Lịch sử điều chỉnh sai số dư thực tế' : 'Discrepancy logs from active counts'}
                    </p>
                  </div>
                  <button
                    onClick={startPhysicalAudit}
                    type="button"
                    disabled={products.length === 0}
                    className="px-5 py-2.5 bg-[#ff7a45] text-zinc-950 font-mono text-[10px] font-extrabold tracking-widest rounded uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isVi ? 'LẬP PHIẾU KIỂM KÊ THỰC TẾ' : 'NEW PHYSICAL STOCK AUDIT'}
                  </button>
                </div>

                <div className="space-y-4">
                  {adjustments.map((adj) => (
                    <Card key={adj.id} className="bg-[#111114] border border-zinc-800 p-5 font-mono text-[10px] space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                        <div>
                          <span className="font-bold text-zinc-200 text-xs block">#{adj.id} - {adj.reason}</span>
                          <span className="text-zinc-500 text-[8px] mt-0.5 block">{adj.date}</span>
                        </div>
                        <StatusPill label={isVi ? 'ĐÃ ĐỒNG BỘ' : 'VALIDATED'} variant="ok" />
                      </div>

                      <div className="space-y-2">
                        {adj.items.map((item) => (
                          <div key={item.sku} className="flex justify-between items-center py-1 border-b border-zinc-900/40 last:border-0 font-sans text-xs">
                            <div>
                              <span className="font-mono text-[9px] font-bold text-zinc-500 block">#{item.sku}</span>
                              <span className="font-bold text-zinc-300 mt-0.5 block">{item.name}</span>
                              <span className="font-mono text-[9px] text-[#ff7a45] italic mt-0.5 block">Lý do: {item.reasonDetail}</span>
                            </div>
                            <div className="text-right font-mono text-xs">
                              <div className="text-zinc-500">Hệ thống: {item.systemQty} // Thực tế: {item.actualQty}</div>
                              <div className={`font-bold mt-1 ${item.diff.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                                Sai số: {item.diff}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-[#111114] border border-[#ff7a45]/30 p-6">
                <div className="border-b border-[#1b1a20] pb-3.5 mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                      {isVi ? 'PHIẾU KIỂM KÊ THỰC TẾ ĐANG CHẠY' : 'ACTIVE PHYSICAL AUDIT COUNTING SHEET'}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-thin font-mono text-[11px] text-zinc-300 pr-2">
                  {products.map((p) => {
                    const counted = auditCounts[p.sku] !== undefined ? auditCounts[p.sku] : p.stock;
                    const diff = counted - p.stock;
                    const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
                    return (
                      <div key={p.sku} className="p-3 border border-zinc-900 bg-zinc-950/40 rounded space-y-3.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-zinc-400 block">#{p.sku}</span>
                            <span className="font-sans font-bold text-zinc-200 text-xs mt-0.5 block">{isVi ? p.name : (p.nameEn || p.name)}</span>
                            <span className="text-[9px] text-zinc-500 block mt-0.5">{isVi ? 'Định vị kệ' : 'Shelf location'}: {p.location.split('/').slice(-2).join('/')}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => simulateBarcodeScan(p.sku)}
                            className="px-2 py-1 rounded bg-[#ff7a45]/15 border border-[#ff7a45]/30 text-[#ff7a45] text-[8.5px] font-bold uppercase hover:bg-[#ff7a45] hover:text-zinc-950 transition-all flex items-center gap-1"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                            {isVi ? 'QUÉT MÃ VẠCH (SCAN)' : 'SCAN BARCODE'}
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div>
                            <span className="text-zinc-500 text-[10px] block">{isVi ? 'Tồn hệ thống:' : 'System Stock:'}</span>
                            <span className="font-bold text-zinc-400 text-xs block mt-1">{p.stock} {isVi ? p.unit : (p.unitEn || p.unit)}</span>
                          </div>
                          <div>
                            <label className="block text-zinc-500 text-[10px] mb-1">{isVi ? 'Số đếm thực tế:' : 'Counted Stock:'}</label>
                            <input
                              type="number"
                              value={counted}
                              onChange={(e) => setAuditCounts(prev => ({ ...prev, [p.sku]: Number(e.target.value) }))}
                              className="w-full bg-zinc-950 border border-zinc-800 py-1 px-2 rounded text-zinc-200 text-xs outline-none"
                            />
                          </div>
                          <div className="text-right">
                            <span className="text-zinc-500 text-[10px] block">{isVi ? 'Sai lệch chênh lệch:' : 'Reconciled Diff:'}</span>
                            <span className={`text-xs font-bold block mt-1 ${diff === 0 ? 'text-zinc-500' : diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {diffStr} {isVi ? p.unit : (p.unitEn || p.unit)}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-zinc-500 text-[9px] mb-1">{isVi ? 'Lý do điều chỉnh (hao hụt/hư hỏng):' : 'Reconciliation Reason:'}</label>
                          <select
                            value={auditReasons[p.sku] || 'Kiểm kho định kỳ khớp số liệu'}
                            onChange={(e) => setAuditReasons(prev => ({ ...prev, [p.sku]: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 py-1 px-2 rounded text-zinc-400 text-[9.5px] cursor-pointer"
                          >
                            <option value="Hao hụt tự nhiên (shrinkage)">{isVi ? 'Hao hụt tự nhiên' : 'Natural shrinkage'}</option>
                            <option value="Mất mát chưa rõ nguyên nhân (theft)">{isVi ? 'Mất mát chưa rõ nguyên nhân' : 'Unexplained loss/theft'}</option>
                            <option value="Hàng hỏng hóc biến dạng (damaged)">{isVi ? 'Hàng hóa hư hỏng biến dạng' : 'Damaged goods'}</option>
                            <option value="Kiểm kho định kỳ khớp số liệu">{isVi ? 'Khớp số đếm định kỳ' : 'Periodical cycle count match'}</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-zinc-900 mt-6 flex gap-3">
                  <button
                    onClick={handleValidateAudit}
                    type="button"
                    className="flex-1 py-3 bg-[#ff7a45] text-zinc-950 font-bold uppercase tracking-wider text-xs rounded cyber-notched-btn"
                  >
                    {isVi ? 'PHÊ DUYỆT ĐIỀU CHỈNH SAI LỆCH' : 'VALIDATE & BALANCE ADJUSTMENT'}
                  </button>
                  <button
                    onClick={() => setIsAuditing(false)}
                    type="button"
                    className="flex-1 py-3 border border-zinc-800 bg-transparent text-zinc-500 font-bold uppercase tracking-wider text-xs rounded"
                  >
                    {isVi ? 'HỦY PHIẾU' : 'CANCEL AUDIT'}
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column (4 cols): Quick guidelines */}
          <div className="lg:col-span-4">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full font-mono text-[9.5px] text-zinc-500 leading-relaxed flex flex-col justify-between">
              <div>
                <div className="border-b border-zinc-900 pb-3.5 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#ff7a45]">
                    {isVi ? 'HƯỚNG DẪN KIỂM ĐẾM THỰC TẾ' : 'PHYSICAL AUDIT INSTRUCTION'}
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-zinc-400 font-sans">
                    {isVi ? '1. Đưa đội kiểm kê đi quét mã vạch trên kệ hoặc thủ công đếm số lượng.' : '1. Assign staff to physically count shelves or scan barcodes.'}
                  </p>
                  <p className="text-zinc-400 font-sans">
                    {isVi ? '2. Sử dụng nút "QUÉT MÃ VẠCH (SCAN)" để giả lập quét nhanh mã EAN-13, mỗi lần quét cộng 1 sản phẩm.' : '2. Click "SCAN BARCODE" to simulate quick gun scans.'}
                  </p>
                  <p className="text-zinc-400 font-sans">
                    {isVi ? '3. Nhập số liệu khớp thực tế và chọn lý do dán nhãn chênh lệch (nếu hao hụt hoặc hư hỏng).' : '3. Note discrepancies and select depreciation reason.'}
                  </p>
                  <p className="text-[#ff7a45] font-sans font-bold">
                    {isVi ? '4. Khi phê duyệt (VALIDATE), hệ thống tự động ghi nhận phiếu điều chỉnh, tính chênh lệch trị giá ròng và đồng bộ stock của sản phẩm lập tức.' : '4. Confirming updates inventory stocks instantly.'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-6 font-sans text-zinc-100">
          {/* Sub-tabs Navigation */}
          <div className="flex gap-4 border-b border-zinc-800 pb-2 font-mono text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveAiTab('demand_procurement')}
              className={`pb-2 px-2 transition-all relative ${
                activeAiTab === 'demand_procurement' ? 'text-[#ff7a45]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isVi ? '1. Dự Báo Tồn Kho & Đấu Thầu' : '1. Demand Forecasting & Supplier Selection'}
              {activeAiTab === 'demand_procurement' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
            </button>
            <button
              onClick={() => setActiveAiTab('logistics_slotting')}
              className={`pb-2 px-2 transition-all relative ${
                activeAiTab === 'logistics_slotting' ? 'text-[#ff7a45]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isVi ? '2. Điều Phối Nhập - Xuất & Slotting' : '2. Logistics Dispatch & Proximity Slotting'}
              {activeAiTab === 'logistics_slotting' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
            </button>
            <button
              onClick={() => setActiveAiTab('chatbot_training')}
              className={`pb-2 px-2 transition-all relative ${
                activeAiTab === 'chatbot_training' ? 'text-[#ff7a45]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isVi ? '3. Huấn Luyện AI Chatbot' : '3. AI Chatbot Training (RAG)'}
              {activeAiTab === 'chatbot_training' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
            </button>
          </div>

          {/* TAB 1: Demand Forecasting & Supplier Selection */}
          {activeAiTab === 'demand_procurement' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column (5 cols): Demand Forecasting */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a45] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {isVi ? 'AI Dự báo tồn kho (Daily Cron Simulation)' : 'AI Demand Forecasting'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-1">
                      {isVi ? 'Giả lập tác vụ 00:00 hàng ngày, loại bỏ đột biến ảo để tính tốc độ tiêu thụ dự kiến' : 'Simulates daily 00:00 cron, filters wholesale spikes, projects velocity'}
                    </p>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3 font-mono text-[10px]">
                    <div>
                      <label className="block text-zinc-500 uppercase mb-1">{isVi ? 'Chọn sản phẩm:' : 'Select SKU:'}</label>
                      <select
                        value={forecastSku}
                        onChange={(e) => {
                          setForecastSku(e.target.value);
                          setDemandForecastExecuted(false);
                          setForecastData(null);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-855 py-2 px-3 rounded text-zinc-300 outline-none focus:border-[#ff7a45]"
                      >
                        {products.map(p => (
                          <option key={p.sku} value={p.sku}>
                            {p.sku} - {isVi ? p.name : (p.nameEn || p.name)} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isForecastRunning && !demandForecastExecuted ? (
                    <div className="py-4 text-center">
                      <button
                        onClick={runForecastSimulation}
                        className="w-full py-2.5 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-mono text-[10px] font-extrabold tracking-wider uppercase rounded cursor-pointer"
                      >
                        {isVi ? 'Chạy Dự Báo (Run Cron Simulation)' : 'Run Daily Forecast Cron'}
                      </button>
                    </div>
                  ) : isForecastRunning ? (
                    <div className="bg-zinc-950 border border-zinc-900 p-4 rounded font-mono text-[9px] space-y-3">
                      <div className="flex justify-between items-center text-zinc-500 uppercase tracking-wider">
                        <span>{isVi ? 'Đang huấn luyện AI...' : 'AI Pipeline Running...'}</span>
                        <span className="font-bold text-[#ff7a45]">{forecastProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded overflow-hidden">
                        <div className="bg-[#ff7a45] h-full transition-all duration-300" style={{ width: `${forecastProgress}%` }} />
                      </div>
                      <div className="bg-black/50 border border-zinc-900 p-3 rounded h-32 overflow-y-auto scrollbar-thin text-zinc-400 space-y-1 pr-2">
                        {forecastLogs.map((log, idx) => (
                          <div key={idx} className="flex gap-2 items-start text-[#ff9e7d]/90 font-mono">
                            <span className="text-zinc-700 font-extrabold shrink-0">&gt;&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Output Prediction Metrics */
                    forecastData && (
                      <div className="space-y-4">
                        {/* Dynamic safety warning card */}
                        {forecastData.trigger_alert ? (
                          <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded-sm font-sans text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-red-500">
                              <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                              <span>{isVi ? '⚠️ CẢNH BÁO THIẾU HÀNG' : '⚠️ STOCKOUT ALERT'}</span>
                            </div>
                            <p className="leading-relaxed text-[11px]">{forecastData.recommendation}</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-sm font-sans text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-500">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>{isVi ? '✅ TỒN KHO AN TOÀN' : '✅ STOCK LEVELS SECURE'}</span>
                            </div>
                            <p className="leading-relaxed text-[11px]">{forecastData.recommendation}</p>
                          </div>
                        )}

                        {/* Forecast Stats */}
                        <div className="grid grid-cols-2 gap-3 font-mono text-[10px] bg-zinc-950 border border-zinc-900 p-3 rounded">
                          <div>
                            <span className="text-zinc-500 block">{isVi ? 'Lượng bán dự báo/ngày:' : 'Projected daily velocity:'}</span>
                            <span className="text-zinc-200 font-extrabold text-xs">{forecastData.velocity} {isVi ? 'sản phẩm' : 'units'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">{isVi ? 'Dự kiến hết hàng sau:' : 'Est. days to stockout:'}</span>
                            <span className={`font-extrabold text-xs ${forecastData.trigger_alert ? 'text-red-400' : 'text-emerald-400'}`}>{forecastData.days_to_stockout} {isVi ? 'ngày' : 'days'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">{isVi ? 'Thời gian giao (Lead Time):' : 'Lead Time:'}</span>
                            <span className="text-zinc-200 font-extrabold text-xs">{forecastData.lead_time} {isVi ? 'ngày' : 'days'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">{isVi ? 'Đột biến ảo đã lọc bỏ:' : 'Outlier spikes scrubbed:'}</span>
                            <span className="text-zinc-200 font-extrabold text-xs">{forecastData.outliers_removed} {isVi ? 'giao dịch' : 'records'}</span>
                          </div>
                        </div>

                        {/* Velocity Bar Chart */}
                        <div className="bg-zinc-950 border border-zinc-900 rounded p-4 space-y-3">
                          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase block tracking-wider border-b border-zinc-900 pb-2">
                            {isVi ? 'DỰ BÁO NHU CẦU 7 NGÀY TỚI' : '7-DAY PROJECTED DEMAND FORECAST'}
                          </span>
                          <div className="h-24 flex items-end justify-between font-mono text-[8px] text-zinc-500 px-2 pt-2">
                            {forecastData.forecast.map((pt, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 relative group">
                                <span className="text-[7px] text-zinc-400">{pt.qty}</span>
                                <div
                                  className={`w-4 rounded-t-sm transition-all duration-500 ${
                                    forecastData.trigger_alert ? 'bg-red-500/30 border border-red-500/50 animate-pulse' : 'bg-indigo-500/30 border border-indigo-400/30'
                                  }`}
                                  style={{ height: `${Math.min(100, (pt.qty / (forecastData.velocity * 3 || 1)) * 60)}px` }}
                                />
                                <span className="text-zinc-500 text-[8px]">{pt.day}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setDemandForecastExecuted(false);
                            setForecastData(null);
                          }}
                          className="w-full py-1.5 border border-zinc-800 text-zinc-500 font-mono text-[9px] uppercase rounded hover:text-zinc-300 cursor-pointer"
                        >
                          {isVi ? 'XÓA KẾT QUẢ DỰ BÁO' : 'CLEAR FORECAST'}
                        </button>
                      </div>
                    )
                  )}
                </Card>
              </div>

              {/* Right Column (7 cols): Supplier Selection & PO Draft */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a45] flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {isVi ? 'Chấm điểm & Lựa chọn Nhà cung cấp (TOPSIS/AHP)' : 'Supplier Scorecard & Selection'}
                      </h3>
                      <p className="text-[10px] text-zinc-500 tracking-wide mt-1">
                        {isVi ? 'Thuật toán ra quyết định đa tiêu chí, tự động chọn đối tác tối ưu theo trọng số cấu hình' : 'MCDM decision engine automatically picks top partner based on weights'}
                      </p>
                    </div>
                  </div>

                  {/* Parameter Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-950 border border-zinc-900 rounded font-mono text-[9.5px]">
                    <div>
                      <label className="block text-zinc-500 uppercase mb-2 flex justify-between">
                        <span>{isVi ? 'Chất lượng' : 'Quality'}:</span>
                        <strong className="text-zinc-200">{weightQuality}%</strong>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={weightQuality}
                        onChange={(e) => setWeightQuality(Number(e.target.value))}
                        className="w-full accent-[#ff7a45] bg-zinc-850 h-1 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 uppercase mb-2 flex justify-between">
                        <span>{isVi ? 'Thời gian giao' : 'Lead Time'}:</span>
                        <strong className="text-zinc-200">{weightLeadTime}%</strong>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={weightLeadTime}
                        onChange={(e) => setWeightLeadTime(Number(e.target.value))}
                        className="w-full accent-[#ff7a45] bg-zinc-855 h-1 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 uppercase mb-2 flex justify-between">
                        <span>{isVi ? 'Giá thành' : 'Cost'}:</span>
                        <strong className="text-zinc-200">{weightCost}%</strong>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={weightCost}
                        onChange={(e) => setWeightCost(Number(e.target.value))}
                        className="w-full accent-[#ff7a45] bg-zinc-850 h-1 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase mb-1">{isVi ? 'Số lượng tái đặt hàng đề xuất:' : 'Reorder Quantity:'}</label>
                      <input
                        type="number"
                        value={replenishQty}
                        onChange={(e) => setReplenishQty(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-850 py-1.5 px-3 rounded text-zinc-200 text-xs font-mono outline-none focus:border-zinc-800"
                      />
                    </div>
                    <button
                      onClick={runSupplierScoring}
                      className="py-1.5 px-4 bg-zinc-900 border border-zinc-800 text-[#ff7a45] hover:bg-zinc-850 font-mono text-[9.5px] font-bold rounded uppercase mt-5 shrink-0 cursor-pointer"
                    >
                      {isVi ? 'Tính điểm TOPSIS' : 'Calculate Ranks'}
                    </button>
                  </div>

                  {/* Supplier Grid */}
                  {scoredSuppliers.length > 0 ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="overflow-x-auto scrollbar-thin border border-zinc-900 rounded bg-zinc-950/40">
                        <table className="w-full text-sm font-mono text-[10px]">
                          <thead>
                            <tr className="border-b border-zinc-900 text-zinc-500 uppercase text-left bg-zinc-950">
                              <th className="py-2.5 px-3">{isVi ? 'NHÀ CUNG CẤP' : 'VENDOR'}</th>
                              <th className="py-2.5 px-3 text-right">{isVi ? 'ĐẠT QC' : 'QC PASS'}</th>
                              <th className="py-2.5 px-3 text-right">{isVi ? 'GIAO HÀNG' : 'DELIVERY'}</th>
                              <th className="py-2.5 px-3 text-right">{isVi ? 'ĐƠN GIÁ' : 'UNIT COST'}</th>
                              <th className="py-2.5 px-3 text-right text-[#ff7a45] font-extrabold">{isVi ? 'ĐIỂM SỐ' : 'SCORE'}</th>
                              <th className="py-2.5 px-3 text-right">{isVi ? 'HÀNH ĐỘNG' : 'ACTION'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scoredSuppliers.map((s, idx) => (
                              <tr key={idx} className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/30">
                                <td className="py-2.5 px-3 font-sans font-bold text-zinc-200 flex items-center gap-1.5">
                                  {idx === 0 && <span className="text-[#ff7a45] text-[9px] border border-[#ff7a45]/40 bg-[#ff7a45]/10 px-1 rounded-sm">TOP</span>}
                                  <span>{s.name}</span>
                                </td>
                                <td className="py-2.5 px-3 text-right text-zinc-400">{s.qc_passed}</td>
                                <td className="py-2.5 px-3 text-right text-zinc-400">{s.lead_time}</td>
                                <td className="py-2.5 px-3 text-right text-zinc-400">{formatCurrency(s.unit_cost)}</td>
                                <td className="py-2.5 px-3 text-right text-[#ff7a45] font-extrabold text-xs">{s.score}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    onClick={() => handleOpenPoEmail(s)}
                                    className="px-2.5 py-1 bg-[#ff7a45]/15 border border-[#ff7a45]/30 text-[#ff7a45] rounded hover:bg-[#ff7a45] hover:text-zinc-950 font-bold text-[8.5px] transition-colors cursor-pointer"
                                  >
                                    {isVi ? 'LẬP PO' : 'PREPARE PO'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* AI purchasing draft preview card */}
                      {poEmailModalOpen && (
                        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded space-y-3 animate-fade-in">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <span className="font-mono font-bold text-[#ff7a45] text-[9.5px] uppercase tracking-wider">{isVi ? 'PHÔI EMAIL ĐƠN HÀNG PO TỰ ĐỘNG' : 'AUTO PURCHASE ORDER EMAIL PREVIEW'}</span>
                            <span className="text-zinc-600 text-[8px] font-mono">Mail API client integration</span>
                          </div>

                          <div className="space-y-3 font-mono text-[9px] text-zinc-400">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-zinc-600 block">VENDOR EMAIL:</span>
                                <span className="text-zinc-300 font-bold">{scoredSuppliers[0].email}</span>
                              </div>
                              <div>
                                <span className="text-zinc-600 block">MÃ SKU HÀNG:</span>
                                <span className="text-zinc-300 font-bold">{forecastSku}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-zinc-600 block">NỘI DUNG THƯ GIAO DỊCH DỰ THẢO:</span>
                              <textarea
                                value={poEmailDraft}
                                onChange={(e) => setPoEmailDraft(e.target.value)}
                                rows={5}
                                className="w-full bg-black/60 border border-zinc-850 p-2.5 rounded text-zinc-300 text-[10px] focus:border-[#ff7a45]/50 outline-none resize-none font-sans"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 text-[9px] font-mono">
                            <button
                              onClick={sendReplenishPoEmail}
                              disabled={poEmailSent}
                              className="px-4 py-2 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              {poEmailSent ? (isVi ? 'ĐANG GỬI...' : 'SENDING...') : (isVi ? 'PHÊ DUYỆT & GỬI PO' : 'APPROVE & DISPATCH EMAIL')}
                            </button>
                            <button
                              onClick={() => setPoEmailModalOpen(false)}
                              className="px-4 py-2 border border-zinc-850 hover:border-zinc-700 text-zinc-400 font-bold uppercase rounded cursor-pointer"
                            >
                              {isVi ? 'ĐÓNG' : 'CLOSE'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 border border-dashed border-zinc-850 text-center rounded bg-zinc-950/20 text-zinc-500 font-mono text-[9px] uppercase">
                      {isVi ? 'HÃY CHẠY DỰ BÁO ĐỂ KÍCH HOẠT QUY TRÌNH ĐẤU THẦU AI' : 'RUN DEMAND FORECAST TO START BIDDING SIMULATOR'}
                    </div>
                  )}
                </Card>
              </div>

            </div>
          )}

          {/* TAB 2: Inbound & Outbound Logistics & Proximity Slotting */}
          {activeAiTab === 'logistics_slotting' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column (6 cols): Inbound logistics & Outbound prioritizer */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* 2.1 Inbound OCR & Scheduling */}
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a45] flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      {isVi ? 'AI Logistics Nhập kho (Kanban Scheduling)' : 'AI Inbound Logistics & OCR Scheduler'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-1">
                      {isVi ? 'Trích xuất hóa đơn OCR, đối sánh hàng sắp cháy kho để phân slot xe tải khẩn cấp' : 'OCR extract document data, match with critical low stock items to prioritize truck gates'}
                    </p>
                  </div>

                  <div className="flex gap-3 font-mono text-[10px]">
                    <div className="flex-1">
                      <label className="block text-zinc-500 uppercase mb-1">{isVi ? 'Chọn tài liệu hóa đơn nhập:' : 'Select Invoice PDF:'}</label>
                      <select
                        value={selectedInvoice}
                        onChange={(e) => {
                          setSelectedInvoice(e.target.value);
                          setIsInboundProcessed(false);
                          setOcrData(null);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-850 py-1.5 px-2.5 rounded text-zinc-300 outline-none focus:border-[#ff7a45]"
                      >
                        <option value="invoice_steelworks_992.pdf">invoice_steelworks_992.pdf (Khung gầm Carbon X-1)</option>
                        <option value="invoice_vinagarment_341.pdf">invoice_vinagarment_341.pdf (Áo khoác Đỏ M)</option>
                        <option value="invoice_electrosupply_102.pdf">invoice_electrosupply_102.pdf (Giao diện Neural Link)</option>
                      </select>
                    </div>
                    <button
                      onClick={runOcrInvoiceAnalysis}
                      disabled={inboundProgress}
                      className="py-1.5 px-4 bg-[#ff7a45] text-zinc-950 hover:bg-[#ff8b5a] font-bold rounded uppercase mt-5 font-mono text-[9.5px] cursor-pointer"
                    >
                      {inboundProgress ? (isVi ? 'ĐANG ĐỌC OCR...' : 'PROCESSING...') : (isVi ? 'ĐỌC HOÁ ĐƠN' : 'RUN OCR ANALYZER')}
                    </button>
                  </div>

                  {inboundProgress && (
                    <div className="bg-zinc-950 border border-zinc-900 p-4 rounded font-mono text-[9px] space-y-3">
                      <div className="flex justify-between items-center text-zinc-500">
                        <span>{isVi ? 'Đang trích xuất OCR & sắp lịch gates...' : 'OCR extraction in progress...'}</span>
                        <span className="font-bold text-[#ff7a45]">{ocrProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#ff7a45] h-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {isInboundProcessed && ocrData && (
                    <div className="space-y-4 animate-fade-in">
                      {/* OCR Data */}
                      <div className="bg-zinc-950 border border-zinc-900 p-3 rounded space-y-3 font-mono text-[9px]">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                          <span className="text-zinc-500 font-extrabold uppercase">[OCR EXTRACTED RESULTS]</span>
                          <span className="text-[#ff7a45] font-bold">ETA: {ocrData.eta}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-zinc-400">
                          <div>
                            <span className="text-zinc-600 block">NHÀ CUNG CẤP (VENDOR):</span>
                            <span className="text-zinc-300 font-bold">{ocrData.vendor}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 block">SỐ PO ĐỐI CHIẾU:</span>
                            <span className="text-zinc-300 font-bold">{ocrData.po_ref || ocrData.poRef}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-600 block">DANH SÁCH CHI TIẾT SẢN PHẨM:</span>
                          {ocrData.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between bg-black/40 px-2 py-1 rounded text-zinc-300 text-[10px] border border-zinc-900/60">
                              <span>{item.name} ({item.sku})</span>
                              <strong className="text-[#ff7a45]">{item.qty} pcs</strong>
                            </div>
                          ))}
                        </div>
                        {ocrData.priority_score > 0 && (
                          <div className="p-2 bg-red-950/20 border border-red-500/20 text-red-400 rounded-sm text-[9.5px]">
                            ⚠️ {ocrData.priority_reason}
                          </div>
                        )}
                      </div>

                      {/* Kanban Schedule Queue */}
                      <div className="space-y-2 font-sans">
                        <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">{isVi ? 'LỊCH TRÌNH CỔNG XE TẢI (GATE ARRIVALS KANBAN):' : 'GATE DISPATCH ARRIVALS SCHEDULE:'}</span>
                        <div className="grid grid-cols-1 gap-2">
                          {truckQueue.map((truck, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-sm border font-mono text-[10px] flex justify-between items-center ${
                                truck.priority === 'Khẩn cấp' || truck.priority === 'CRITICAL'
                                  ? 'bg-red-950/10 border-red-500/30 text-red-400 animate-pulse'
                                  : 'bg-zinc-950 border-zinc-900 text-zinc-300'
                              }`}
                            >
                              <div>
                                <div className="font-bold flex items-center gap-1.5 text-xs">
                                  <span>🚗 {truck.truck}</span>
                                  <span className="text-[8px] font-mono px-1 rounded-sm bg-black/60 border border-zinc-800 text-zinc-400">{truck.driver}</span>
                                </div>
                                <span className="text-[9px] text-zinc-500 block mt-1">{isVi ? 'Hàng hóa:' : 'Cargo:'} {truck.cargo || truck.item} ({truck.qty} pcs)</span>
                              </div>
                              <div className="text-right shrink-0 font-mono text-[9px]">
                                <span className="font-bold text-[#ff7a45] block">{truck.time || truck.slot}</span>
                                <span className="text-[7.5px] text-zinc-500 uppercase font-bold">{isVi ? 'Trạng thái:' : 'Priority:'} {truck.priority}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* 2.2 Outbound dispatcher picker app */}
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a45] flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {isVi ? 'AI Logistics Xuất kho (SLA Outbound Dispatcher)' : 'AI Outbound Picker Dispatcher'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-1">
                      {isVi ? 'Nhân viên gom hàng theo thứ tự ưu tiên thời hạn SLA. Đơn dưới 1 giờ nhấp nháy đỏ đưa lên đầu.' : 'Picker queue prioritized by SLA. Orders under 1 hour flash red and push to top.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {deliveriesQueue.length > 0 ? (
                      deliveriesQueue.map((del) => {
                        const underOneHour = del.minutes_left <= 60;
                        return (
                          <div
                            key={del.id}
                            className={`p-3 rounded-sm border font-mono text-[10px] flex justify-between items-center transition-all duration-300 ${
                              underOneHour
                                ? 'bg-red-950/20 border-red-500/40 text-red-300 animate-pulse'
                                : 'bg-zinc-950 border-zinc-900 text-zinc-300'
                            }`}
                            style={underOneHour ? { borderLeft: '4px solid #ef4444' } : {}}
                          >
                            <div>
                              <div className="font-bold flex items-center gap-1.5 text-xs">
                                <span>📦 {del.id}</span>
                                <span className="text-[8px] font-mono px-1 rounded-sm bg-black/60 border border-zinc-800 text-zinc-400">{del.customer}</span>
                              </div>
                              <span className="text-[9px] text-zinc-500 block mt-1">
                                {isVi ? 'Hàng hóa:' : 'SKU:'} {del.sku} ({del.qty} pcs) - {del.shipping}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right shrink-0 font-mono text-[9px]">
                                <span className={`font-bold block ${underOneHour ? 'text-red-400 animate-pulse' : 'text-[#ff7a45]'}`}>
                                  {del.minutes_left} {isVi ? 'phút' : 'mins'}
                                </span>
                                <span className="text-[7.5px] text-zinc-500 uppercase font-bold">{isVi ? 'Ưu tiên:' : 'Priority:'} {del.priority}</span>
                              </div>
                              <button
                                onClick={() => handleConfirmPick(del.id)}
                                className="px-2.5 py-1 bg-[#ff7a45]/15 border border-[#ff7a45]/30 text-[#ff7a45] rounded hover:bg-[#ff7a45] hover:text-zinc-950 font-bold text-[8.5px] transition-colors cursor-pointer"
                              >
                                {isVi ? 'XÁC NHẬN NHẶT' : 'CONFIRM PICK'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 border border-zinc-900 text-center text-zinc-500 uppercase text-[9px] tracking-wider">
                        {isVi ? 'KHÔNG CÓ ĐƠN HÀNG XUẤT KHO ƯU TIÊN' : 'NO PRIORITIZED OUTBOUND DELIVERIES'}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column (6 cols): Market Basket affinity only */}
              <div className="lg:col-span-6 space-y-6">
                {/* 2.3 Market Basket Affinity & Proximity Slotting */}
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a45] flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4" />
                        {isVi ? 'AI Phân tích giỏ hàng & Định vị kệ (Apriori)' : 'AI Market Basket & Proximity Slotting'}
                      </h3>
                      <p className="text-[10px] text-zinc-500 tracking-wide mt-1">
                        {isVi ? 'Phân tích lịch sử hoá đơn để gợi ý combo và sắp xếp sản phẩm bán kèm đứng cạnh nhau trên kệ.' : 'Analyze purchase history to suggest affinity combos and adjust adjacent shelf placement.'}
                      </p>
                    </div>
                  </div>

                  {/* Mining controls */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-zinc-950 border border-zinc-900 rounded font-mono text-[9px] text-zinc-400">
                    <div>
                      <label className="block text-zinc-550 uppercase mb-1.5">
                        {isVi ? 'Độ hỗ trợ tối thiểu:' : 'Min Support:'} <strong className="text-zinc-200">{basketSupport}%</strong>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={basketSupport}
                        onChange={(e) => setBasketSupport(Number(e.target.value))}
                        className="w-full accent-[#ff7a45] bg-zinc-800 h-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-550 uppercase mb-1.5">
                        {isVi ? 'Độ tin cậy tối thiểu:' : 'Min Confidence:'} <strong className="text-zinc-200">{basketConfidence}%</strong>
                      </label>
                      <input
                        type="range"
                        min="40"
                        max="95"
                        value={basketConfidence}
                        onChange={(e) => setBasketConfidence(Number(e.target.value))}
                        className="w-full accent-[#ff7a45] bg-zinc-800 h-1 rounded"
                      />
                    </div>
                  </div>

                  {!isMiningRunning && !comboOutput ? (
                    <div className="border border-dashed border-zinc-850 p-6 text-center rounded bg-black/40">
                      <button
                        onClick={runAssociationMining}
                        className="px-4 py-2 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-bold uppercase rounded font-mono text-[9.5px] cursor-pointer"
                      >
                        {isVi ? 'CHẠY PHÂN TÍCH GIỎ HÀNG' : 'RUN BASKET ANALYSIS'}
                      </button>
                    </div>
                  ) : isMiningRunning ? (
                    <div className="bg-zinc-950 border border-zinc-900 p-3 rounded font-mono text-[8.5px] space-y-2">
                      <div className="flex justify-between items-center text-zinc-500 font-bold">
                        <span>{isVi ? 'Đang chạy thuật toán Apriori...' : 'Mining rules...'}</span>
                        <span className="font-bold text-[#ff7a45]">{miningProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded overflow-hidden">
                        <div className="bg-[#ff7a45] h-full" style={{ width: `${miningProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 font-sans text-xs">
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-sm font-mono text-[9px] leading-relaxed flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold uppercase block text-[9.5px] mb-0.5">{isVi ? 'ĐỀ XUẤT ĐỊNH VỊ VỊ TRÍ AI:' : 'AI PROXIMITY SLOTTING SUGGESTION:'}</span>
                          <span>
                            {isVi 
                              ? 'Nên xếp mã Khung gầm Carbon (OMG-9921) cạnh Trục khuỷu (OMG-4452) tại Zone A để nhân viên chỉ cần đứng tại chỗ lấy được cả hai, giảm 50% quãng đường nhặt hàng.'
                              : 'Place Carbon Frame (OMG-9921) adjacent to Crankshaft (OMG-4452) at Zone A to save 50% picker travel time.'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-900 p-3 rounded font-mono text-[9px] space-y-2">
                        <span className="text-zinc-500 font-extrabold block uppercase">[COMBO LEVERAGES]</span>
                        <div className="max-h-24 overflow-y-auto divide-y divide-zinc-900 pr-1">
                          {minedCombos.map((c, idx) => (
                            <div key={idx} className="py-1.5 flex justify-between items-center text-zinc-450">
                              <span>{c.combo || `${c.nameA} + ${c.nameB}`}</span>
                              <span className="text-[#ff7a45] font-bold">Conf: {c.confidence}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

            </div>
          )}

          {activeAiTab === 'chatbot_training' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column (5 cols): AI Model Status & Fine-Tuning Console */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a45] flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#ff7a45] animate-pulse" />
                      {isVi ? 'THÔNG TIN MÔ HÌNH CHATBOT' : 'CHATBOT CORE LLM METADATA'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-1">
                      {isVi ? 'Trực quan hóa cấu hình RAG & Trọng số fine-tune cục bộ' : 'Visual representation of Local LLM fine-tune metadata'}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-[9px] text-zinc-400">
                    <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-sm">
                      <span className="text-zinc-600 block uppercase mb-1">{isVi ? 'TRẠNG THÁI:' : 'STATUS:'}</span>
                      <strong className={`uppercase ${isTrainingChatbot ? 'text-[#ff7a45] animate-pulse' : 'text-emerald-400'}`}>
                        {isTrainingChatbot 
                          ? (isVi ? 'Đang huấn luyện...' : 'TRAINING...') 
                          : (isVi ? 'Sẵn sàng' : 'SYNCED / READY')}
                      </strong>
                    </div>

                    <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-sm">
                      <span className="text-zinc-600 block uppercase mb-1">{isVi ? 'PHIÊN BẢN:' : 'MODEL VERSION:'}</span>
                      <strong className="text-zinc-200">{sopMetadata?.version || 'OMEGA-SOP-LLM-v2.1'}</strong>
                    </div>

                    <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-sm">
                      <span className="text-zinc-600 block uppercase mb-1">{isVi ? 'ĐỘ CHÍNH XÁC:' : 'ACCURACY:'}</span>
                      <strong className="text-[#ff7a45]">{sopMetadata?.accuracy || 98.6}%</strong>
                    </div>

                    <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-sm">
                      <span className="text-zinc-600 block uppercase mb-1">{isVi ? 'TÀI LIỆU SOP:' : 'SOP RULES:'}</span>
                      <strong className="text-zinc-200">{sopRules.length} {isVi ? 'quy trình' : 'docs'}</strong>
                    </div>

                    <div className="col-span-2 p-3 bg-zinc-950/80 border border-zinc-900 rounded-sm space-y-1">
                      <span className="text-zinc-600 block uppercase">{isVi ? 'MÔ HÌNH NỀN TẢNG:' : 'BASE LOCAL MODEL:'}</span>
                      <div className="flex items-center gap-1.5 text-zinc-350 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{aiSettings.demandForecastKey || "mmproj-gemma-4-E2B-it-BF16.gguf"}</span>
                      </div>
                    </div>

                    <div className="col-span-2 p-3 bg-zinc-950/80 border border-zinc-900 rounded-sm">
                      <span className="text-zinc-600 block uppercase mb-1">{isVi ? 'LẦN H.LUYỆN CUỐI:' : 'LAST FINETUNED:'}</span>
                      <strong className="text-zinc-300">
                        {sopMetadata?.last_trained 
                          ? new Date(sopMetadata.last_trained).toLocaleString(isVi ? 'vi-VN' : 'en-US') 
                          : 'Never'}
                      </strong>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isTrainingChatbot ? (
                    <button
                      onClick={handleTrainChatbot}
                      disabled={sopRules.length === 0}
                      className="w-full py-2.5 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-mono text-[10px] font-extrabold tracking-wider uppercase rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {isVi ? 'BẮT ĐẦU HUẤN LUYỆN LẠI AI (SFT)' : 'RE-TRAIN CORE LLM (SFT)'}
                    </button>
                  ) : (
                    <div className="space-y-3 font-mono text-[9px]">
                      <div className="flex justify-between items-center text-zinc-500 uppercase tracking-wider">
                        <span>{isVi ? 'Đang huấn luyện mạng nơ-ron...' : 'Running Epoch iterations...'}</span>
                        <span className="font-bold text-[#ff7a45]">{chatbotTrainingProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded overflow-hidden">
                        <div className="bg-[#ff7a45] h-full transition-all duration-300" style={{ width: `${chatbotTrainingProgress}%` }} />
                      </div>
                      
                      {/* Interactive scrolling logs */}
                      <div className="bg-black border border-zinc-900 p-3 rounded h-40 overflow-y-auto scrollbar-thin text-zinc-400 space-y-1.5 pr-2 font-mono text-[8.5px] leading-relaxed">
                        {chatbotTrainingLogs.map((log, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <span className="text-[#ff7a45] shrink-0">{'>'}</span>
                            <span className={log.includes('complete') || log.includes('complete') ? 'text-emerald-400 font-bold' : ''}>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Column (7 cols): SOP Rules Editor Form & Rules Directory */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* SOP Database Editor Form */}
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7a45] flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      {editingRuleId ? (isVi ? 'CẬP NHẬT QUY TRÌNH SOP' : 'EDIT SOP RULE') : (isVi ? 'THÊM MỚI QUY TRÌNH SOP KHO' : 'REGISTER NEW SOP RULE')}
                    </h3>
                    {editingRuleId && (
                      <button 
                        onClick={() => {
                          setEditingRuleId(null);
                          setNewSopRule({
                            category: 'FIFO',
                            keywords: '',
                            title_vi: '',
                            title_en: '',
                            rule_vi: '',
                            rule_en: ''
                          });
                        }}
                        className="text-[9px] font-mono text-zinc-550 hover:text-zinc-350 uppercase"
                      >
                        {isVi ? 'Hủy' : 'Cancel'}
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveSopRule} className="space-y-4 font-mono text-[9px] text-zinc-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category */}
                      <div>
                        <label className="block text-zinc-550 uppercase mb-1">{isVi ? 'PHÂN LOẠI QUY TRÌNH:' : 'SOP CATEGORY:'}</label>
                        <select
                          value={newSopRule.category}
                          onChange={(e) => setNewSopRule(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-850 py-1.5 px-2.5 rounded text-zinc-300 outline-none focus:border-[#ff7a45]"
                        >
                          <option value="FIFO">FIFO / Rotation</option>
                          <option value="Hàng hư hỏng / QC Fail">Hàng hư hỏng / QC Fail</option>
                          <option value="Nhập kho / OCR Gate">Nhập kho / OCR Gate</option>
                          <option value="An toàn / PCCC">An toàn / PCCC</option>
                          <option value="Bảo quản kho lạnh">Bảo quản kho lạnh</option>
                          <option value="Khác">Khác / General</option>
                        </select>
                      </div>

                      {/* Keywords */}
                      <div>
                        <label className="block text-zinc-550 uppercase mb-1">
                          {isVi ? 'TỪ KHÓA KÍCH HOẠT (CÁCH NHAU CÁC DẤU PHẨY):' : 'TRIGGER KEYWORDS (COMMA SEPARATED):'} <span className="text-[#ff7a45]">*</span>
                        </label>
                        <input
                          type="text"
                          value={newSopRule.keywords}
                          onChange={(e) => setNewSopRule(prev => ({ ...prev, keywords: e.target.value }))}
                          placeholder={isVi ? 'vd: fifo, xuat kho, nhat hang' : 'e.g. damaged, broken, scratch'}
                          required
                          className="w-full bg-zinc-950 border border-zinc-850 py-1.5 px-3 rounded text-zinc-355 outline-none focus:border-[#ff7a45]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Vietnamese Title */}
                      <div>
                        <label className="block text-zinc-550 uppercase mb-1">{isVi ? 'TIÊU ĐỀ (TIẾNG VIỆT):' : 'TITLE (VIETNAMESE):'} <span className="text-[#ff7a45]">*</span></label>
                        <input
                          type="text"
                          value={newSopRule.title_vi}
                          onChange={(e) => setNewSopRule(prev => ({ ...prev, title_vi: e.target.value }))}
                          placeholder={isVi ? 'vd: Hướng dẫn xử lý hàng rách hộp' : 'Title in Vietnamese'}
                          required
                          className="w-full bg-zinc-950 border border-zinc-850 py-1.5 px-3 rounded text-zinc-355 outline-none focus:border-[#ff7a45]"
                        />
                      </div>

                      {/* English Title */}
                      <div>
                        <label className="block text-zinc-550 uppercase mb-1">{isVi ? 'TIÊU ĐỀ (TIẾNG ANH):' : 'TITLE (ENGLISH):'}</label>
                        <input
                          type="text"
                          value={newSopRule.title_en}
                          onChange={(e) => setNewSopRule(prev => ({ ...prev, title_en: e.target.value }))}
                          placeholder="e.g. SOP for Damaged boxes handling"
                          className="w-full bg-zinc-950 border border-zinc-850 py-1.5 px-3 rounded text-zinc-355 outline-none focus:border-[#ff7a45]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Vietnamese Rule Content */}
                      <div>
                        <label className="block text-zinc-550 uppercase mb-1">{isVi ? 'NỘI DUNG QUY TRÌNH (TIẾNG VIỆT):' : 'SOP RULE CONTENT (VI):'} <span className="text-[#ff7a45]">*</span></label>
                        <textarea
                          value={newSopRule.rule_vi}
                          onChange={(e) => setNewSopRule(prev => ({ ...prev, rule_vi: e.target.value }))}
                          rows={4}
                          placeholder={isVi ? 'Mô tả chi tiết các bước thực hiện quy trình chuẩn...' : 'SOP steps description...'}
                          required
                          className="w-full bg-zinc-950 border border-zinc-850 p-2.5 rounded text-zinc-300 focus:border-[#ff7a45] outline-none resize-none font-sans text-[9.5px]"
                        />
                      </div>

                      {/* English Rule Content */}
                      <div>
                        <label className="block text-zinc-550 uppercase mb-1">{isVi ? 'NỘI DUNG QUY TRÌNH (TIẾNG ANH):' : 'SOP RULE CONTENT (EN):'}</label>
                        <textarea
                          value={newSopRule.rule_en}
                          onChange={(e) => setNewSopRule(prev => ({ ...prev, rule_en: e.target.value }))}
                          rows={4}
                          placeholder="Describe the SOP standard instructions in English..."
                          className="w-full bg-zinc-950 border border-zinc-850 p-2.5 rounded text-zinc-300 focus:border-[#ff7a45] outline-none resize-none font-sans text-[9.5px]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="submit"
                        className="py-1.5 px-5 bg-[#ff7a45] text-zinc-950 hover:bg-[#ff8b5a] font-bold rounded uppercase cursor-pointer"
                      >
                        {editingRuleId ? (isVi ? 'CẬP NHẬT CẤU HÌNH' : 'UPDATE SOP RULE') : (isVi ? 'LƯU QUY TRÌNH' : 'REGISTER SOP RULE')}
                      </button>
                    </div>
                  </form>
                </Card>

                {/* SOP Rules Directory */}
                <Card className="bg-[#111114] border border-zinc-800 p-5 shadow-xl space-y-4">
                  <div className="border-b border-zinc-900 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                      {isVi ? 'DANH MỤC CẨM NANG SOP ĐÃ HUẤN LUYỆN' : 'SOP RULES DIRECTORY (TRAINED)'}
                    </h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-zinc-900 scrollbar-thin pr-1">
                    {sopRules.length > 0 ? (
                      sopRules.map((rule) => (
                        <div key={rule.id} className="py-3.5 flex justify-between items-start gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[#ff7a45]/10 border border-[#ff7a45]/20 text-[#ff7a45]">
                                {rule.category}
                              </span>
                              <strong className="text-[10.5px] text-zinc-200">
                                {isVi ? rule.title_vi : (rule.title_en || rule.title_vi)}
                              </strong>
                            </div>
                            <p className="text-[9px] text-zinc-450 font-sans leading-relaxed line-clamp-2">
                              {isVi ? rule.rule_vi : (rule.rule_en || rule.rule_vi)}
                            </p>
                            <div className="flex flex-wrap gap-1 items-center pt-1 font-mono text-[8px]">
                              <span className="text-zinc-600 uppercase mr-1">{isVi ? 'Từ khóa:' : 'Keywords:'}</span>
                              {rule.keywords.map((kw, i) => (
                                <span key={i} className="px-1 rounded-sm bg-black border border-zinc-900 text-zinc-500">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 shrink-0 font-mono text-[8.5px]">
                            <button
                              onClick={() => handleEditSopRule(rule)}
                              className="text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                            >
                              {isVi ? 'Sửa' : 'Edit'}
                            </button>
                            <span className="text-zinc-850">|</span>
                            <button
                              onClick={() => handleDeleteSopRule(rule.id)}
                              className="text-red-500 hover:text-red-400 underline cursor-pointer"
                            >
                              {isVi ? 'Xóa' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-zinc-600 font-mono text-[9px] uppercase">
                        {isVi ? 'CHƯA CÓ DỮ LIỆU CẨM NANG SOP. VUI LÒNG THÊM MỚI!' : 'NO SOP DATA DEFINED YET.'}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

            </div>
          )}

          {/* Central API Endpoint / Key configuration settings bottom bar */}
          <div className="pt-6 border-t border-zinc-850 mt-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Settings className="w-4 h-4 text-zinc-500" />
              <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                {isVi ? 'ĐẦU NỐI AI CORE MÁY CHỦ LOCAL (VITE PORT PROXY)' : 'AI ENDPOINT CONFIGURATIONS (LOCAL DEPLOY)'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[9px] text-zinc-500">
              <div>
                <label className="block uppercase tracking-wider mb-1.5">{isVi ? 'ĐẦU NỐI AI PROXY PROMPT (VITE PROXY):' : 'AI PROXY PORT TARGET:'}</label>
                <input
                  type="text"
                  value="http://localhost:8000/api/ai"
                  disabled
                  className="w-full bg-zinc-950 border border-zinc-900 py-1.5 px-3 rounded text-zinc-500 outline-none select-all"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1.5">{isVi ? 'MÔ HÌNH NỀN TẢNG (GGUF TARGET):' : 'LOCAL GGUF TARGET:'}</label>
                <input
                  type="text"
                  value={aiSettings.demandForecastKey || "mmproj-gemma-4-E2B-it-BF16.gguf"}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, demandForecastKey: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-900 py-1.5 px-3 rounded text-zinc-400 outline-none focus:border-[#ff7a45]/40"
                />
              </div>

              {/* Field 2: Space URL */}
              <div>
                <label className="block uppercase tracking-wider mb-1.5">{isVi ? 'ENDPOINT MÁY CHỦ SPACE AI:' : 'SPACE AI ENDPOINT URL:'}</label>
                <input
                  type="text"
                  value={aiSettings.spaceOptimizerEndpoint}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, spaceOptimizerEndpoint: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-900 py-1.5 px-3 rounded text-zinc-400 outline-none focus:border-[#ff7a45]/40"
                />
              </div>

            </div>

            <p className="text-[8.5px] text-zinc-500 font-sans leading-relaxed">
              {isVi ? '* Lưu ý: Hệ thống hiện tại đang sử dụng các luồng giả lập kiểm thử biên an toàn (Mock diagnostics). Để gộp mô hình AI thật, nhà phát triển chỉ cần gán các hàm fetch tương tác qua Endpoint trên.' : '* Interface ready. You can substitute mockup logic with real fetch requests pointing to these URLs.'}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
