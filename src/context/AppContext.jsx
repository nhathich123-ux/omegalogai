import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { translations } from '../i18n/translations';
import {
  demoProducts,
  demoLots,
  demoReceipts,
  demoDeliveries,
  demoInternalTransfers,
  demoAdjustments,
  demoPurchaseOrders,
  demoNotifications,
  demoReorderHistory
} from '../data/demoData';

const getLocalStorageItem = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  try {
    if (!stored) return defaultValue;
    const parsed = JSON.parse(stored);
    if (parsed === null || parsed === undefined) return defaultValue;
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
    if (typeof defaultValue === 'object' && parsed !== null && typeof parsed !== 'object') return defaultValue;
    return parsed;
  } catch (e) {
    return defaultValue;
  }
};

const AppContext = createContext(null);

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

const defaultAccounts = [
  {
    name: 'Nhà Thích Admin',
    email: 'nhathich123@gmail.com',
    password: '19001560aS@',
    role: 'admin',
    date: '2026-05-28'
  },
  {
    name: 'Nguyễn Văn A',
    email: 'nguyena@omega.io',
    password: 'staff123',
    role: 'staff',
    date: '2026-05-20'
  },
  {
    name: 'Trần Thị B',
    email: 'tranb@omega.io',
    password: 'staff456',
    role: 'staff',
    date: '2026-05-25'
  }
];

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('omega-theme') || 'dark');
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('omega-lang');
    return (stored === 'en' || stored === 'vi') ? stored : 'vi';
  });
  const [activePage, setActivePage] = useState('landing'); // Default is landing (welcome page)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Auth Modal and Face ID Biometric States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileMode, setProfileMode] = useState('view');
  const [faceIdScanMode, setFaceIdScanMode] = useState('none');
  const [pendingUser, setPendingUser] = useState(null);
  const [showFaceIdPrompt, setShowFaceIdPrompt] = useState(false);

  const t = translations[lang] || translations['vi'];

  // ────────────────────────────────────────────────────────
  // CENTRALIZED WAREHOUSE DATABASE STATE
  // ────────────────────────────────────────────────────────

  // 1. Products List
  const [products, setProducts] = useState(() => getLocalStorageItem('omega-products', []));

  // 2. Warehouses
  const [warehouses, setWarehouses] = useState([
    { id: 'WH-A', name: 'Kho miền Nam (A)', nameEn: 'South Warehouse (A)', location: 'TP. Hồ Chí Minh', locationEn: 'Ho Chi Minh City', zones: 12, utilization: 78, skus: 8420 },
    { id: 'WH-B', name: 'Kho miền Bắc (B)', nameEn: 'North Warehouse (B)', location: 'Hà Nội', locationEn: 'Hanoi', zones: 8, utilization: 62, skus: 4030 },
    { id: 'WH-C', name: 'Kho miền Trung (C)', nameEn: 'Central Warehouse (C)', location: 'Đà Nẵng', locationEn: 'Da Nang', zones: 5, utilization: 45, skus: 2100 },
  ]);

  // 3. Hierarchical Location Tree Path (Odoo-like)
  const [locationsTree, setLocationsTree] = useState({
    id: 'root',
    name: 'Tất cả Kho hàng',
    children: [
      {
        id: 'WH-A',
        name: 'Warehouse A (HCM)',
        children: [
          {
            id: 'WH-A/Zone A',
            name: 'Khu A (Thiết bị nặng)',
            children: [
              {
                id: 'WH-A/Zone A/Aisle 1',
                name: 'Dãy 1',
                children: [
                  { id: 'WH-A/Zone A/Aisle 1/Shelf 1', name: 'Kệ 1', children: [{ id: 'WH-A/Zone A/Aisle 1/Shelf 1/Level 1', name: 'Tầng 1 (Heavy Floor)' }, { id: 'WH-A/Zone A/Aisle 1/Shelf 1/Level 2', name: 'Tầng 2' }] }
                ]
              }
            ]
          },
          {
            id: 'WH-A/Zone B',
            name: 'Khu B (Điện tử)',
            children: [
              {
                id: 'WH-A/Zone B/Aisle 1',
                name: 'Dãy 1',
                children: [
                  { id: 'WH-A/Zone B/Aisle 1/Shelf 2', name: 'Kệ 2', children: [{ id: 'WH-A/Zone B/Aisle 1/Shelf 2/Level 3', name: 'Tầng 3' }] }
                ]
              }
            ]
          },
          {
            id: 'WH-A/Zone D',
            name: 'Khu D (Chất lỏng)',
            children: [
              {
                id: 'WH-A/Zone D/Aisle 1',
                name: 'Dãy 1',
                children: [
                  { id: 'WH-A/Zone D/Aisle 1/Shelf 1', name: 'Kệ 1', children: [{ id: 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1', name: 'Tầng 1' }] }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'WH-B',
        name: 'Warehouse B (Hà Nội)',
        children: [
          {
            id: 'WH-B/Zone B',
            name: 'Khu B (Phụ kiện điện tử)',
            children: [
              {
                id: 'WH-B/Zone B/Aisle 2',
                name: 'Dãy 2',
                children: [
                  { id: 'WH-B/Zone B/Aisle 2/Shelf 3', name: 'Kệ 3', children: [{ id: 'WH-B/Zone B/Aisle 2/Shelf 3/Level 2', name: 'Tầng 2' }] }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'WH-C',
        name: 'Warehouse C (Đà Nẵng)',
        children: [
          {
            id: 'WH-C/Zone C',
            name: 'Khu C (Năng lượng)',
            children: [
              {
                id: 'WH-C/Zone C/Aisle 1',
                name: 'Dãy 1',
                children: [
                  { id: 'WH-C/Zone C/Aisle 1/Shelf 2', name: 'Kệ 2', children: [{ id: 'WH-C/Zone C/Aisle 1/Shelf 2/Level 1', name: 'Tầng 1' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  // 4. Lots / Serial Numbers Tracker database
  const [lots, setLots] = useState(() => getLocalStorageItem('omega-lots', []));

  // 5. Incoming Shipments / Receipts
  const [receipts, setReceipts] = useState(() => getLocalStorageItem('omega-receipts', []));

  // 6. Outgoing Shipments / Deliveries (with 3-step: Pick -> Pack -> Ship)
  const [deliveries, setDeliveries] = useState(() => getLocalStorageItem('omega-deliveries', []));

  // 7. Internal Transfers
  const [internalTransfers, setInternalTransfers] = useState(() => getLocalStorageItem('omega-transfers', []));

  // 8. Inventory Adjustments (Physical Inventory)
  const [adjustments, setAdjustments] = useState(() => getLocalStorageItem('omega-adjustments', []));

  // 9. Purchase Orders (triggered by rules or manual)
  const [purchaseOrders, setPurchaseOrders] = useState(() => getLocalStorageItem('omega-purchase-orders', []));

  // 10. Real-time Alarm / Notification Logs Stream
  const [notifications, setNotifications] = useState(() => getLocalStorageItem('omega-notifications', [
    {
      id: '1',
      type: 'info',
      title: 'Hệ thống đã reset',
      titleEn: 'System Reset Successful',
      desc: 'Hệ thống đã được dọn dẹp hoàn toàn. Hãy thêm sản phẩm mới hoặc nạp dữ liệu mẫu để bắt đầu.',
      descEn: 'The system has been completely cleared. Please register a new product or load demo data to start.',
      time: new Date().toTimeString().split(' ')[0]
    }
  ]));

  // 11. Custom reordering log to review reorder rules triggers
  const [reorderHistory, setReorderHistory] = useState(() => getLocalStorageItem('omega-reorder-history', []));

  // 12. Current Logged-in User Account Profile
  const [currentUser, setCurrentUser] = useState(() => getLocalStorageItem('omega-current-user', {
    name: 'Admin Omega',
    email: 'admin@omega.io',
    avatar: null
  }));

  // 13. Registered Employee and Developer Accounts Directory
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    return getLocalStorageItem('omega-registered-accounts', defaultAccounts);
  });

  // 13b. Registered Face ID Accounts Directory (shared cross-browser database)
  const [faceIdAccounts, setFaceIdAccounts] = useState(() => {
    return getLocalStorageItem('omega-faceid-accounts', []);
  });

  // 15. Registered Partners (Suppliers & Customers)
  const [partners, setPartners] = useState(() => {
    const defaultPartners = [
      { id: 'PRT-001', name: 'TechParts Global', type: 'supplier', contact: 'sales@techparts.com', address: 'Tokyo, Japan', date: '2026-01-10' },
      { id: 'PRT-002', name: 'SteelWorks Ltd', type: 'supplier', contact: 'info@steelworks.co.uk', address: 'London, UK', date: '2026-02-15' },
      { id: 'PRT-003', name: 'HydraFlow Inc', type: 'supplier', contact: 'support@hydraflow.com', address: 'California, USA', date: '2026-03-01' },
      { id: 'PRT-004', name: 'ElectroSupply Co', type: 'supplier', contact: 'orders@electrosupply.io', address: 'Seoul, South Korea', date: '2026-03-20' },
      { id: 'PRT-005', name: 'General Supplier', type: 'supplier', contact: 'procurement@gensupply.com', address: 'Ho Chi Minh City, VN', date: '2026-04-05' },
      { id: 'PRT-006', name: 'MegaRetail Corp', type: 'customer', contact: 'fulfillment@megaretail.com', address: 'Singapore', date: '2026-01-12' },
      { id: 'PRT-007', name: 'BuildMart JSC', type: 'customer', contact: 'contact@buildmart.vn', address: 'Ha Noi, VN', date: '2026-02-18' },
      { id: 'PRT-008', name: 'AutoParts VN', type: 'customer', contact: 'sales@autopartsvn.com', address: 'Binh Duong, VN', date: '2026-03-15' },
      { id: 'PRT-009', name: 'IndoTrans Log', type: 'customer', contact: 'shipping@indotrans.co.id', address: 'Jakarta, Indonesia', date: '2026-04-10' },
      { id: 'PRT-010', name: 'VinaProcure', type: 'customer', contact: 'admin@vinaprocure.vn', address: 'Da Nang, VN', date: '2026-04-25' }
    ];
    return getLocalStorageItem('omega-partners', defaultPartners);
  });

  // 14. Smart AI configurations (Empty modules API keys)
  const [aiSettings, setAiSettings] = useState({
    demandForecastKey: 'AI_DEMAND_FORECASTER_V4',
    spaceOptimizerEndpoint: 'http://omega-ai-edge.local/spatial-opt',
    supplierNegotiationAgent: 'GPT-4-Turbo-Logistics',
    visualInspectionKey: 'ROBO_EYE_QC_PRO'
  });

  // ────────────────────────────────────────────────────────
  // CORE DATABASE ACTIONS & TRANSACTIONAL LOGIC
  // ────────────────────────────────────────────────────────

  // --- Reordering Rules Automator ---
  const checkReorderingRules = (sku) => {
    const prod = products.find(p => p.sku === sku);
    if (!prod) return;

    if (prod.stock < prod.minStock) {
      // Check if a draft PO for this SKU already exists
      const alreadyDraft = purchaseOrders.some(
        po => po.status === 'draft' && po.vendor === getVendorForCategory(prod.category)
      );

      if (!alreadyDraft) {
        const orderQty = prod.maxStock - prod.stock;
        const poId = `PO-2026-0${Math.floor(100 + Math.random() * 900)}`;
        const costTotal = orderQty * prod.cost;

        // 1. Append Purchase Order
        const newPO = {
          id: poId,
          vendor: getVendorForCategory(prod.category),
          items: 1,
          total: costTotal,
          status: 'draft',
          expected: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        setPurchaseOrders(prev => [newPO, ...prev]);

        // 2. Add to Reorder Rules History Log
        setReorderHistory(prev => [
          {
            id: `RL-${Math.floor(9000 + Math.random() * 1000)}`,
            sku: prod.sku,
            name: prod.name,
            min: prod.minStock,
            max: prod.maxStock,
            current: prod.stock,
            orderedQty: orderQty,
            poId: poId,
            date: new Date().toLocaleString()
          },
          ...prev
        ]);

        // 3. Post Notification Alert
        setNotifications(prev => [
          {
            id: generateId('NT'),
            type: 'critical',
            title: `Quy tắc tái cung ứng: #${prod.sku}`,
            titleEn: `Reordering Rule: #${prod.sku}`,
            desc: `Số lượng (${prod.stock}) < mức tối thiểu (${prod.minStock}). Tự động tạo Đơn mua hàng nháp ${poId} đặt hàng ${orderQty} ${prod.unit}.`,
            descEn: `Quantity (${prod.stock}) < minimum safety level (${prod.minStock}). Auto-created draft PO ${poId} for ${orderQty} ${prod.unitEn}.`,
            time: new Date().toTimeString().split(' ')[0]
          },
          ...prev
        ]);
      }
    }
  };

  const getVendorForCategory = (cat) => {
    if (cat === 'HEAVY MACHINERY') return 'SteelWorks Ltd';
    if (cat === 'ELECTRONICS') return 'TechParts Global';
    if (cat === 'ENERGY UNITS') return 'HydraFlow Inc';
    if (cat === 'FLUIDS') return 'Industrial Fluids Corp';
    return 'General Supplier';
  };

  // --- Product CRUD ---
  const addProduct = (newProd) => {
    const prod = {
      ...newProd,
      stock: Number(newProd.stock) || 0,
      cost: Number(newProd.cost) || 0,
      price: Number(newProd.price) || 0,
      minStock: Number(newProd.minStock) || 0,
      maxStock: Number(newProd.maxStock) || 0,
      lots: []
    };
    setProducts(prev => [...prev, prod]);
    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'info',
        title: 'Sản phẩm mới',
        titleEn: 'New Product',
        desc: `Đã khai báo SKU #${prod.sku} (${prod.name}) thành công tại hệ thống.`,
        descEn: `Successfully registered SKU #${prod.sku} (${prod.nameEn}) in the system.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  const updateProduct = (updatedProd) => {
    const currentProd = products.find(p => p.sku === updatedProd.sku);
    let finalProd = { ...updatedProd };
    let relocated = false;
    let fromLoc = '';
    let toLoc = '';

    if (currentProd && currentProd.category !== updatedProd.category) {
      const categoryMapping = {
        'HEAVY MACHINERY': 'WH-A/Zone A/Aisle 1/Shelf 1/Level 1',
        'ELECTRONICS': 'WH-A/Zone B/Aisle 1/Shelf 2/Level 3',
        'ENERGY UNITS': 'WH-C/Zone C/Aisle 1/Shelf 2/Level 1',
        'FLUIDS': 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1',
        'THIẾT BỊ HẠNG NẶNG': 'WH-A/Zone A/Aisle 1/Shelf 1/Level 1',
        'ĐIỆN TỬ': 'WH-A/Zone B/Aisle 1/Shelf 2/Level 3',
        'NĂNG LƯỢNG': 'WH-C/Zone C/Aisle 1/Shelf 2/Level 1',
        'CHẤT LỎNG': 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1'
      };

      const newLoc = categoryMapping[updatedProd.category];
      if (newLoc) {
        finalProd.location = newLoc;
        fromLoc = currentProd.location || 'Chưa định vị';
        toLoc = newLoc;
        relocated = true;

        if (currentProd.stock > 0) {
          const fromWhName = fromLoc.includes('/') ? fromLoc.split('/').slice(-2).join('/') : fromLoc;
          const toWhName = toLoc.includes('/') ? toLoc.split('/').slice(-2).join('/') : toLoc;
          const newTransfer = {
            id: generateId('TR'),
            sku: updatedProd.sku,
            qty: currentProd.stock,
            from: fromWhName,
            to: toWhName,
            status: 'done',
            date: new Date().toISOString().split('T')[0]
          };
          setInternalTransfers(prev => [newTransfer, ...prev]);
        }
      }
    }

    setProducts(prev => prev.map(p => p.sku === finalProd.sku ? { ...p, ...finalProd } : p));
    
    setNotifications(prev => {
      const newNotifs = [
        {
          id: generateId('NT'),
          type: 'info',
          title: 'Cập nhật sản phẩm',
          titleEn: 'Product Updated',
          desc: `Thay đổi cấu hình sản phẩm SKU #${updatedProd.sku} đã lưu thành công.`,
          descEn: `Successfully saved updates for SKU #${updatedProd.sku}.`,
          time: new Date().toTimeString().split(' ')[0]
        }
      ];

      if (relocated) {
        const catNamesVi = {
          'HEAVY MACHINERY': 'Thiết bị hạng nặng',
          'ELECTRONICS': 'Điện tử',
          'ENERGY UNITS': 'Năng lượng',
          'FLUIDS': 'Chất lỏng',
          'THIẾT BỊ HẠNG NẶNG': 'Thiết bị hạng nặng',
          'ĐIỆN TỬ': 'Điện tử',
          'NĂNG LƯỢNG': 'Năng lượng',
          'CHẤT LỎNG': 'Chất lỏng'
        };
        const catNameVi = catNamesVi[finalProd.category] || finalProd.category;
        
        newNotifs.unshift({
          id: generateId('NT'),
          type: 'done',
          title: 'Tự động chuyển hàng AI',
          titleEn: 'AI Auto-Relocation',
          desc: `Đã đổi danh mục sang "${catNameVi}". Tự động chuyển vị trí sản phẩm từ "${fromLoc}" sang "${toLoc}" và tạo phiếu chuyển kho nội bộ cho ${currentProd.stock} sản phẩm.`,
          descEn: `Changed category to "${finalProd.category}". Automatically relocated stock from "${fromLoc}" to "${toLoc}" and generated internal transfer for ${currentProd.stock} units.`,
          time: new Date().toTimeString().split(' ')[0]
        });
      }

      return [...newNotifs, ...prev];
    });

    // check rules in case min changed
    setTimeout(() => checkReorderingRules(finalProd.sku), 200);
  };

  const deleteProduct = (sku) => {
    setProducts(prev => prev.filter(p => p.sku !== sku));
    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'warning',
        title: 'Xóa sản phẩm',
        titleEn: 'Product Deleted',
        desc: `Đã xóa thông tin SKU #${sku} ra khỏi danh mục hệ thống.`,
        descEn: `Removed SKU #${sku} from the catalog system.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  // --- Incoming Shipments / Receipts Flow ---
  const createReceipt = (receipt) => {
    const newRec = {
      ...receipt,
      id: generateId('IN'),
      status: 'ready',
      date: new Date().toISOString().split('T')[0]
    };
    setReceipts(prev => [newRec, ...prev]);
  };

  const processQC = (receiptId, results, operatorNotes) => {
    setReceipts(prev => prev.map(rec => {
      if (rec.id === receiptId) {
        const updatedItems = rec.items.map((item, idx) => ({
          ...item,
          qcPassed: results[idx] !== undefined ? results[idx] : true
        }));
        const allPassed = updatedItems.every(i => i.qcPassed === true);
        return {
          ...rec,
          items: updatedItems,
          status: 'ready', // keeping ready for putaway approval
          qcDetails: {
            checkedBy: 'QC_AGENT_AUTO',
            result: allPassed ? 'PASS' : 'FAIL_HOLD',
            notes: operatorNotes || 'Kiểm thử ngoại quan cơ học bình thường.'
          }
        };
      }
      return rec;
    }));

    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'info',
        title: 'Kiểm định chất lượng QC',
        titleEn: 'QC Inspection',
        desc: `Hồ sơ nhập hàng #${receiptId} hoàn tất kiểm tra chất lượng.`,
        descEn: `Incoming receipt #${receiptId} has completed QC checks.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  const validateReceipt = (receiptId, selectedPutawayLoc) => {
    const targetReceipt = receipts.find(r => r.id === receiptId);
    if (!targetReceipt) return;

    // 1. Update status to done and set putaway location
    setReceipts(prev => prev.map(r => r.id === receiptId ? { ...r, status: 'done', putawayLoc: selectedPutawayLoc || r.putawayLoc } : r));

    // 2. Increment stock for all QC Passed products in specific shelf locations
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const item = targetReceipt.items.find(i => i.sku === p.sku);
        if (item && item.qcPassed !== false) {
          // Increment stock and update location to the selected putaway shelf zone!
          return {
            ...p,
            stock: p.stock + item.qty,
            location: selectedPutawayLoc || p.location,
            status: p.stock + item.qty > p.minStock ? 'ok' : p.stock + item.qty > 0 ? 'warning' : 'alert'
          };
        }
        return p;
      });
    });

    // 3. Create active LOTS records for products
    const newLots = [];
    targetReceipt.items.forEach(item => {
      if (item.qcPassed !== false) {
        const lotId = item.lotId || `LOT-${item.sku}-${Math.floor(100 + Math.random() * 900)}`;
        newLots.push({
          id: lotId,
          productSku: item.sku,
          status: 'active',
          qty: item.qty,
          expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 yr default
          dateCreated: new Date().toISOString().split('T')[0],
          receiptRef: receiptId
        });
      }
    });
    setLots(prev => [...prev, ...newLots]);

    // 4. Update the products' lots references
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const item = targetReceipt.items.find(i => i.sku === p.sku);
        if (item && item.qcPassed !== false) {
          const lotId = item.lotId || newLots.find(l => l.productSku === p.sku)?.id;
          if (lotId && !p.lots.includes(lotId)) {
            return { ...p, lots: [...p.lots, lotId] };
          }
        }
        return p;
      });
    });

    // 5. Post notification
    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'done',
        title: `Nhập kho hoàn tất: #${receiptId}`,
        titleEn: `Receipt Completed: #${receiptId}`,
        desc: `Hàng hóa đã được xếp vào vị trí kệ. Nhập ${targetReceipt.items.reduce((acc, i) => acc + i.qty, 0)} sản phẩm.`,
        descEn: `Goods moved to shelves. Received total of ${targetReceipt.items.reduce((acc, i) => acc + i.qty, 0)} units.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  // --- Outgoing Shipments / Deliveries Flow (with Pick-Pack-Ship + FIFO/LIFO strategies) ---
  const createDelivery = (delivery) => {
    const newDel = {
      ...delivery,
      id: generateId('OUT'),
      status: 'ready',
      steps: { pick: false, pack: false, ship: false },
      strategy: delivery.strategy || 'FIFO',
      date: new Date().toISOString().split('T')[0]
    };
    setDeliveries(prev => [newDel, ...prev]);
  };

  const setStrategy = (deliveryId, strategy) => {
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, strategy } : d));
  };

  const processPick = (deliveryId) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          steps: { ...d.steps, pick: true },
          status: 'ready' // keeping active stage
        };
      }
      return d;
    }));

    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'info',
        title: 'Hoạt động Gom hàng',
        titleEn: 'Picking Activity',
        desc: `Phiếu xuất kho #${deliveryId}: Đã thực hiện gom hàng từ kệ vị trí thành công.`,
        descEn: `Delivery #${deliveryId}: Successfully picked from coordinate shelves.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  const processPack = (deliveryId, boxSize) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          steps: { ...d.steps, pack: true },
          shippingDetails: {
            boxSize: boxSize || 'Thùng các-tông vừa (Standard Box)',
            carrier: 'Giao Hàng Nhanh',
            tracking: `TRK-${Math.floor(100000 + Math.random() * 900000)}`
          }
        };
      }
      return d;
    }));

    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'info',
        title: 'Khâu Đóng gói',
        titleEn: 'Packing Activity',
        desc: `Phiếu xuất kho #${deliveryId}: Đã dán nhãn vạch vận chuyển và kiểm định hòm đóng gói.`,
        descEn: `Delivery #${deliveryId}: Shipping label printed and container packaging verified.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  const processShip = (deliveryId) => {
    const targetDel = deliveries.find(d => d.id === deliveryId);
    if (!targetDel) return;

    // 1. Mark as done and fully shipped
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          steps: { ...d.steps, ship: true },
          status: 'done'
        };
      }
      return d;
    }));

    // 2. Reduce stock of products in specific locations (based on FIFO / LIFO)
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const item = targetDel.items.find(i => i.sku === p.sku);
        if (item) {
          const finalStock = Math.max(0, p.stock - item.qty);
          return {
            ...p,
            stock: finalStock,
            status: finalStock > p.minStock ? 'ok' : finalStock > 0 ? 'warning' : 'alert'
          };
        }
        return p;
      });
    });

    // 3. Deduct from Lots counts using strategy (FIFO: oldest lot first, LIFO: newest lot first)
    setLots(prevLots => {
      return prevLots.map(lot => {
        const item = targetDel.items.find(i => i.sku === lot.productSku);
        if (item && lot.qty > 0) {
          // Simplistic deduction for lots
          const deduct = Math.min(lot.qty, item.qty);
          return {
            ...lot,
            qty: lot.qty - deduct,
            status: lot.qty - deduct === 0 ? 'used' : 'active'
          };
        }
        return lot;
      });
    });

    // 4. Trigger auto reorder check for the products
    targetDel.items.forEach(item => {
      setTimeout(() => checkReorderingRules(item.sku), 300);
    });

    // 5. Post notification
    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'done',
        title: `Xuất kho hoàn tất: #${deliveryId}`,
        titleEn: `Delivery Completed: #${deliveryId}`,
        desc: `Đã giao gói hàng cho đơn vị vận chuyển. Giảm ${targetDel.items.reduce((acc, i) => acc + i.qty, 0)} sản phẩm.`,
        descEn: `Package handed over to carrier. Deducted total of ${targetDel.items.reduce((acc, i) => acc + i.qty, 0)} units.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  // --- Inventory Adjustments & Internal Transfers ---
  const validateAdjustment = (adjId, countedRows) => {
    // countedRows: Array of { sku, systemQty, actualQty, reasonDetail }
    const updatedAdjItems = [];

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const count = countedRows.find(c => c.sku === p.sku);
        if (count) {
          const diff = count.actualQty - count.systemQty;
          const diffStr = diff > 0 ? `+${diff}` : `${diff}`;

          updatedAdjItems.push({
            sku: p.sku,
            name: p.name,
            systemQty: count.systemQty,
            actualQty: count.actualQty,
            diff: diffStr,
            reasonDetail: count.reasonDetail || 'Cân bằng hao hụt chu kỳ kiểm định'
          });

          return {
            ...p,
            stock: count.actualQty,
            status: count.actualQty > p.minStock ? 'ok' : count.actualQty > 0 ? 'warning' : 'alert'
          };
        }
        return p;
      });
    });

    // Append to adjustments list
    const newAdj = {
      id: adjId || generateId('ADJ'),
      warehouse: 'Warehouse A',
      reason: 'Physical Inventory (Điều chỉnh kiểm kê)',
      date: new Date().toISOString().split('T')[0],
      status: 'validated',
      items: updatedAdjItems
    };

    setAdjustments(prev => [newAdj, ...prev]);

    // Triggers rules in case stocks are below limits
    countedRows.forEach(row => {
      setTimeout(() => checkReorderingRules(row.sku), 300);
    });

    // Post notification
    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'done',
        title: `Phê duyệt Kiểm kê: ${newAdj.id}`,
        titleEn: `Adjustment Validated: ${newAdj.id}`,
        desc: `Đã lưu hồ sơ chênh lệch thực tế hệ thống. Tồn kho sản phẩm cập nhật.`,
        descEn: `Discrepancy logs saved. Inventory balances updated.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  const createInternalTransfer = (sku, qty, fromWh, toWh) => {
    const prod = products.find(p => p.sku === sku);
    if (!prod || prod.stock < qty) return false;

    // Create the transfer record
    const newTransfer = {
      id: generateId('TR'),
      sku,
      qty,
      from: fromWh.split('/').slice(-2).join('/') || fromWh,
      to: toWh.split('/').slice(-2).join('/') || toWh,
      status: 'done',
      date: new Date().toISOString().split('T')[0]
    };

    setInternalTransfers(prev => [newTransfer, ...prev]);

    // Instantly reflect location change (simulated between warehousing zones)
    setProducts(prev => prev.map(p => {
      if (p.sku === sku) {
        return {
          ...p,
          location: toWh // EXACT selected zone shelf path!
        };
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'done',
        title: `Chuyển kho nội bộ: ${newTransfer.id}`,
        titleEn: `Internal Transfer: ${newTransfer.id}`,
        desc: `Chuyển ${qty} mặt hàng từ ${newTransfer.from} đến ${newTransfer.to} thành công.`,
        descEn: `Successfully transferred ${qty} items from ${newTransfer.from} to ${newTransfer.to}.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);

    return true;
  };

  // --- Delete Location Node from Tree ---
  const removeNodeFromTree = (tree, targetId) => {
    if (!tree.children) return false;
    const idx = tree.children.findIndex(c => c.id === targetId);
    if (idx !== -1) {
      tree.children.splice(idx, 1);
      return true;
    }
    for (let child of tree.children) {
      if (removeNodeFromTree(child, targetId)) return true;
    }
    return false;
  };

  // Collect all node IDs under a given node (including itself)
  const collectNodeIds = (node) => {
    let ids = [node.id];
    if (node.children) {
      for (let child of node.children) {
        ids = ids.concat(collectNodeIds(child));
      }
    }
    return ids;
  };

  // Find a node in the tree by its ID
  const findNodeInTree = (tree, targetId) => {
    if (tree.id === targetId) return tree;
    if (tree.children) {
      for (let child of tree.children) {
        const found = findNodeInTree(child, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const deleteLocationNode = (nodeId) => {
    if (nodeId === 'root') return; // Cannot delete root

    // Find the node first to get its name and all descendant IDs
    const targetNode = findNodeInTree(locationsTree, nodeId);
    if (!targetNode) return;

    const allAffectedIds = collectNodeIds(targetNode);

    // Check how many products are using these locations
    const affectedProducts = products.filter(p => allAffectedIds.some(id => p.location && p.location.startsWith(id)));

    const treeCopy = JSON.parse(JSON.stringify(locationsTree));
    const removed = removeNodeFromTree(treeCopy, nodeId);

    if (removed) {
      setLocationsTree(treeCopy);

      // Post notification
      setNotifications(prev => [
        {
          id: generateId('NT'),
          type: 'warning',
          title: `Xóa vị trí kho: ${targetNode.name}`,
          titleEn: `Location Deleted: ${targetNode.name}`,
          desc: `Đã xóa phân khu "${targetNode.name}" (${nodeId}) khỏi sơ đồ cây vị trí kho.${affectedProducts.length > 0 ? ` Cảnh báo: ${affectedProducts.length} sản phẩm đang thuộc vị trí này.` : ''}`,
          descEn: `Removed location "${targetNode.name}" (${nodeId}) from the warehouse tree.${affectedProducts.length > 0 ? ` Warning: ${affectedProducts.length} product(s) are assigned to this location.` : ''}`,
          time: new Date().toTimeString().split(' ')[0]
        },
        ...prev
      ]);
    }
  };

  // --- Rename Location Node in Tree ---
  const updateNodeIdsRecursive = (node, oldIdPrefix, newIdPrefix) => {
    node.id = node.id.replace(oldIdPrefix, newIdPrefix);
    if (node.children) {
      for (let child of node.children) {
        updateNodeIdsRecursive(child, oldIdPrefix, newIdPrefix);
      }
    }
  };

  const renameLocationNode = (nodeId, newName) => {
    if (nodeId === 'root' || !newName.trim()) return;

    const treeCopy = JSON.parse(JSON.stringify(locationsTree));
    const targetNode = findNodeInTree(treeCopy, nodeId);
    if (!targetNode) return;

    const oldName = targetNode.name;
    const oldId = targetNode.id;

    // Build new ID: replace the last segment of the path
    const idParts = oldId.split('/');
    idParts[idParts.length - 1] = newName.replace(/\s+/g, '');
    const newId = idParts.join('/');

    // Update name
    targetNode.name = newName;

    // Update this node's ID and all children's IDs recursively
    updateNodeIdsRecursive(targetNode, oldId, newId);

    setLocationsTree(treeCopy);

    // Update all products that reference the old location path
    setProducts(prev => prev.map(p => {
      if (p.location && p.location.startsWith(oldId)) {
        return { ...p, location: p.location.replace(oldId, newId) };
      }
      return p;
    }));

    // Post notification
    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'info',
        title: `Đổi tên vị trí kho`,
        titleEn: `Location Renamed`,
        desc: `Đã đổi tên phân khu "${oldName}" thành "${newName}" (${oldId} → ${newId}).`,
        descEn: `Renamed location "${oldName}" to "${newName}" (${oldId} → ${newId}).`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  const createPurchaseOrder = (newPo) => {
    setPurchaseOrders(prev => [newPo, ...prev]);
    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'info',
        title: 'Đơn mua hàng mới',
        titleEn: 'New Purchase Order',
        desc: `Yêu cầu báo giá #${newPo.id} cho đối tác ${newPo.vendor} đã được khởi tạo thành công.`,
        descEn: `Draft PO/RFQ #${newPo.id} for partner ${newPo.vendor} has been successfully created.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  // --- Purchase Flow to Receipt Odoo Logic ---
  const confirmPurchaseOrder = (poId) => {
    let targetPO = null;

    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        targetPO = po;
        return { ...po, status: 'confirmed' };
      }
      return po;
    }));

    if (!targetPO) return;

    // Find the products and map to Incoming Receipt items
    const matchingProducts = products.filter(p => getVendorForCategory(p.category) === targetPO.vendor);

    // Automatically spawn corresponding Incoming Receipt in ready/waiting QC status!
    const newReceipt = {
      id: `IN-${targetPO.id.split('-')[2] || Math.floor(1000 + Math.random() * 9000)}`,
      ref: targetPO.id,
      warehouse: 'Warehouse A',
      partner: targetPO.vendor,
      items: matchingProducts.map(p => {
        const orderQty = p.maxStock - p.stock;
        return {
          sku: p.sku,
          name: p.name,
          qty: orderQty > 0 ? orderQty : 100, // safety fallback
          cost: p.cost,
          qcPassed: null,
          lotId: `LOT-${p.sku}-${Math.floor(100 + Math.random() * 900)}`
        };
      }),
      status: 'ready',
      date: new Date().toISOString().split('T')[0],
      qcDetails: null,
      putawayLoc: 'Đang đợi kiểm định QC.'
    };

    setReceipts(prev => [newReceipt, ...prev]);

    setNotifications(prev => [
      {
        id: generateId('NT'),
        type: 'info',
        title: 'Mới: Chờ Nhập Kho',
        titleEn: 'New: Pending Receipt',
        desc: `Đã xác nhận đơn mua ${poId}. Tạo phiếu nhập kho hàng tương ứng ${newReceipt.id} chờ QC.`,
        descEn: `Purchase order ${poId} confirmed. Generated incoming receipt ${newReceipt.id} awaiting QC.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
  };

  useEffect(() => {
    localStorage.setItem('omega-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('omega-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Persist State Lists to LocalStorage
  useEffect(() => {
    localStorage.setItem('omega-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('omega-lots', JSON.stringify(lots));
  }, [lots]);

  useEffect(() => {
    localStorage.setItem('omega-receipts', JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem('omega-deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('omega-transfers', JSON.stringify(internalTransfers));
  }, [internalTransfers]);

  useEffect(() => {
    localStorage.setItem('omega-adjustments', JSON.stringify(adjustments));
  }, [adjustments]);

  useEffect(() => {
    localStorage.setItem('omega-purchase-orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('omega-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('omega-reorder-history', JSON.stringify(reorderHistory));
  }, [reorderHistory]);

  useEffect(() => {
    localStorage.setItem('omega-current-user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('omega-registered-accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    localStorage.setItem('omega-faceid-accounts', JSON.stringify(faceIdAccounts));
  }, [faceIdAccounts]);

  const lastSyncedRef = useRef({
    registeredAccounts: getLocalStorageItem('omega-registered-accounts', defaultAccounts),
    faceIdAccounts: getLocalStorageItem('omega-faceid-accounts', [])
  });
  const isFirstRenderRef = useRef(true);

  // Load initial database from Vite API Server
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    fetch('/api/db', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeoutId);
        if (data) {
          // Merge logic to prevent losing previously created accounts in localstorage
          const localAccs = getLocalStorageItem('omega-registered-accounts', []);
          const localFaceIds = getLocalStorageItem('omega-faceid-accounts', []);

          // Find accounts in localstorage that are not in the database
          const serverAccEmails = new Set((data.registeredAccounts || []).map(acc => acc.email));
          const newLocalAccs = localAccs.filter(acc => !serverAccEmails.has(acc.email));

          const serverFaceEmails = new Set((data.faceIdAccounts || []).map(f => f.email));
          const newLocalFaces = localFaceIds.filter(f => !serverFaceEmails.has(f.email));

          let finalAccs = data.registeredAccounts || [];
          let finalFaces = data.faceIdAccounts || [];
          let needsUpdate = false;

          if (newLocalAccs.length > 0) {
            finalAccs = [...finalAccs, ...newLocalAccs];
            needsUpdate = true;
          }
          if (newLocalFaces.length > 0) {
            finalFaces = [...finalFaces, ...newLocalFaces];
            needsUpdate = true;
          }

          setRegisteredAccounts(finalAccs);
          setFaceIdAccounts(finalFaces);

          localStorage.setItem('omega-registered-accounts', JSON.stringify(finalAccs));
          localStorage.setItem('omega-faceid-accounts', JSON.stringify(finalFaces));

          lastSyncedRef.current = {
            registeredAccounts: finalAccs,
            faceIdAccounts: finalFaces
          };

          // If we merged local accounts, update the server immediately
          if (needsUpdate) {
            const updateController = new AbortController();
            const updateTimeoutId = setTimeout(() => updateController.abort(), 1500);
            fetch('/api/db', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ registeredAccounts: finalAccs, faceIdAccounts: finalFaces }),
              signal: updateController.signal
            })
            .then(() => clearTimeout(updateTimeoutId))
            .catch(err => {});
          }
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.log('Vite DB API not active. Falling back to LocalStorage.');
      });
  }, []);

  // Poll Vite API Server every 5 seconds to sync data from other browsers in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      fetch('/api/db', { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          clearTimeout(timeoutId);
          if (!data) return;
          const currentAccStr = localStorage.getItem('omega-registered-accounts') || '[]';
          const currentFaceStr = localStorage.getItem('omega-faceid-accounts') || '[]';
          
          const incomingAccStr = JSON.stringify(data.registeredAccounts || []);
          const incomingFaceStr = JSON.stringify(data.faceIdAccounts || []);

          if (incomingAccStr !== currentAccStr || incomingFaceStr !== currentFaceStr) {
            if (incomingAccStr !== currentAccStr) {
              setRegisteredAccounts(data.registeredAccounts);
              localStorage.setItem('omega-registered-accounts', incomingAccStr);
            }
            if (incomingFaceStr !== currentFaceStr) {
              setFaceIdAccounts(data.faceIdAccounts);
              localStorage.setItem('omega-faceid-accounts', incomingFaceStr);
            }
            lastSyncedRef.current = {
              registeredAccounts: data.registeredAccounts || [],
              faceIdAccounts: data.faceIdAccounts || []
            };
          }
        })
        .catch(err => {
          clearTimeout(timeoutId);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Push changes to Vite API Server
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    const currentAccStr = JSON.stringify(registeredAccounts);
    const currentFaceStr = JSON.stringify(faceIdAccounts);
    
    const lastAccStr = JSON.stringify(lastSyncedRef.current.registeredAccounts);
    const lastFaceStr = JSON.stringify(lastSyncedRef.current.faceIdAccounts);
    
    if (currentAccStr !== lastAccStr || currentFaceStr !== lastFaceStr) {
      lastSyncedRef.current = {
        registeredAccounts,
        faceIdAccounts
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registeredAccounts, faceIdAccounts }),
        signal: controller.signal
      })
      .then(() => clearTimeout(timeoutId))
      .catch(err => {
        clearTimeout(timeoutId);
      });
    }
  }, [registeredAccounts, faceIdAccounts]);

  useEffect(() => {
    localStorage.setItem('omega-partners', JSON.stringify(partners));
  }, [partners]);

  const loadDemoData = () => {
    setProducts(demoProducts);
    setLots(demoLots);
    setReceipts(demoReceipts);
    setDeliveries(demoDeliveries);
    setInternalTransfers(demoInternalTransfers);
    setAdjustments(demoAdjustments);
    setPurchaseOrders(demoPurchaseOrders);
    setNotifications(demoNotifications);
    setReorderHistory(demoReorderHistory);
  };

  const clearAllData = () => {
    setProducts([]);
    setLots([]);
    setReceipts([]);
    setDeliveries([]);
    setInternalTransfers([]);
    setAdjustments([]);
    setPurchaseOrders([]);
    setNotifications([
      {
        id: generateId('NT'),
        type: 'info',
        title: 'Hệ thống đã reset',
        titleEn: 'System Reset Successful',
        desc: 'Hệ thống đã được dọn dẹp hoàn toàn. Hãy thêm sản phẩm mới hoặc nạp dữ liệu mẫu để bắt đầu.',
        descEn: 'The system has been completely cleared. Please register a new product or load demo data to start.',
        time: new Date().toTimeString().split(' ')[0]
      }
    ]);
    setReorderHistory([]);
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        lang,
        setLang,
        t,
        activePage,
        setActivePage,
        sidebarOpen,
        setSidebarOpen,
        isProfileOpen,
        setIsProfileOpen,
        profileMode,
        setProfileMode,
        faceIdScanMode,
        setFaceIdScanMode,
        pendingUser,
        setPendingUser,
        showFaceIdPrompt,
        setShowFaceIdPrompt,

        // Core central state lists
        products,
        warehouses,
        locationsTree,
        setLocationsTree,
        lots,
        receipts,
        deliveries,
        internalTransfers,
        adjustments,
        purchaseOrders,
        notifications,
        setNotifications,
        reorderHistory,
        currentUser,
        setCurrentUser,
        registeredAccounts,
        setRegisteredAccounts,
        faceIdAccounts,
        setFaceIdAccounts,
        partners,
        setPartners,
        aiSettings,
        setAiSettings,

        // Admin actions
        loadDemoData,
        clearAllData,

        // Transaction actions
        addProduct,
        updateProduct,
        deleteProduct,
        processQC,
        validateReceipt,
        createReceipt,
        createDelivery,
        setStrategy,
        processPick,
        processPack,
        processShip,
        validateAdjustment,
        createInternalTransfer,
        confirmPurchaseOrder,
        createPurchaseOrder,
        checkReorderingRules,
        deleteLocationNode,
        renameLocationNode
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
