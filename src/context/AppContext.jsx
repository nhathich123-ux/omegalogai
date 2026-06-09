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

const defaultLocationsTree = {
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
};

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
  const [locationsTree, setLocationsTree] = useState(() => getLocalStorageItem('omega-locations-tree', defaultLocationsTree));

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
  const productsRef = useRef(products);
  const purchaseOrdersRef = useRef(purchaseOrders);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    purchaseOrdersRef.current = purchaseOrders;
  }, [purchaseOrders]);

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
    const prod = productsRef.current.find(p => p.sku === sku);
    if (!prod) return;

    if (Number(prod.stock) < Number(prod.minStock)) {
      // Check if a draft PO for this SKU already exists
      const alreadyDraft = purchaseOrdersRef.current.some(
        po => po.status === 'draft' && po.vendor === getVendorForCategory(prod.category)
      );

      if (!alreadyDraft) {
        const orderQty = Number(prod.maxStock) - Number(prod.stock);
        const poId = `PO-2026-0${Math.floor(100 + Math.random() * 900)}`;
        const costTotal = orderQty * Number(prod.cost);

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
            min: Number(prod.minStock),
            max: Number(prod.maxStock),
            current: Number(prod.stock),
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
    let finalProd = { 
      ...updatedProd,
      stock: Number(updatedProd.stock) || 0,
      cost: Number(updatedProd.cost) || 0,
      price: Number(updatedProd.price) || 0,
      minStock: Number(updatedProd.minStock) || 0,
      maxStock: Number(updatedProd.maxStock) || 0
    };
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
          const newStock = Number(p.stock) + Number(item.qty);
          return {
            ...p,
            stock: newStock,
            location: selectedPutawayLoc || p.location,
            status: newStock > Number(p.minStock) ? 'ok' : newStock > 0 ? 'warning' : 'alert'
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
          const finalStock = Math.max(0, Number(p.stock) - Number(item.qty));
          return {
            ...p,
            stock: finalStock,
            status: finalStock > Number(p.minStock) ? 'ok' : finalStock > 0 ? 'warning' : 'alert'
          };
        }
        return p;
      });
    });

    // 3. Deduct from Lots counts using strategy (FIFO: oldest lot first, LIFO: newest lot first)
    setLots(prevLots => {
      return prevLots.map(lot => {
        const item = targetDel.items.find(i => i.sku === lot.productSku);
        if (item && Number(lot.qty) > 0) {
          // Simplistic deduction for lots
          const deduct = Math.min(Number(lot.qty), Number(item.qty));
          return {
            ...lot,
            qty: Math.max(0, Number(lot.qty) - deduct),
            status: Number(lot.qty) - deduct === 0 ? 'used' : 'active'
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
        desc: `Đã giao gói hàng cho đơn vị vận chuyển. Giảm ${targetDel.items.reduce((acc, i) => acc + Number(i.qty || 0), 0)} sản phẩm.`,
        descEn: `Package handed over to carrier. Deducted total of ${targetDel.items.reduce((acc, i) => acc + Number(i.qty || 0), 0)} units.`,
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

  // Persist Locations Tree to LocalStorage
  useEffect(() => {
    localStorage.setItem('omega-locations-tree', JSON.stringify(locationsTree));
  }, [locationsTree]);

  const mergeLists = (localList, serverList, idKey = 'id') => {
    const serverIds = new Set((serverList || []).map(item => item[idKey]));
    const newLocal = (localList || []).filter(item => !serverIds.has(item[idKey]));
    return [...(serverList || []), ...newLocal];
  };

  const lastSyncedRef = useRef({
    registeredAccounts: getLocalStorageItem('omega-registered-accounts', defaultAccounts),
    faceIdAccounts: getLocalStorageItem('omega-faceid-accounts', []),
    products: getLocalStorageItem('omega-products', []),
    lots: getLocalStorageItem('omega-lots', []),
    receipts: getLocalStorageItem('omega-receipts', []),
    deliveries: getLocalStorageItem('omega-deliveries', []),
    internalTransfers: getLocalStorageItem('omega-transfers', []),
    adjustments: getLocalStorageItem('omega-adjustments', []),
    purchaseOrders: getLocalStorageItem('omega-purchase-orders', []),
    notifications: getLocalStorageItem('omega-notifications', []),
    reorderHistory: getLocalStorageItem('omega-reorder-history', []),
    partners: getLocalStorageItem('omega-partners', []),
    locationsTree: getLocalStorageItem('omega-locations-tree', defaultLocationsTree)
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
          let needsUpdate = false;

          // 1. Registered Accounts
          const localAccs = getLocalStorageItem('omega-registered-accounts', defaultAccounts);
          const finalAccs = mergeLists(localAccs, data.registeredAccounts, 'email');
          if (JSON.stringify(finalAccs) !== JSON.stringify(data.registeredAccounts || [])) needsUpdate = true;
          setRegisteredAccounts(finalAccs);
          localStorage.setItem('omega-registered-accounts', JSON.stringify(finalAccs));

          // 2. FaceID Accounts
          const localFaceIds = getLocalStorageItem('omega-faceid-accounts', []);
          const finalFaceIds = mergeLists(localFaceIds, data.faceIdAccounts, 'email');
          if (JSON.stringify(finalFaceIds) !== JSON.stringify(data.faceIdAccounts || [])) needsUpdate = true;
          setFaceIdAccounts(finalFaceIds);
          localStorage.setItem('omega-faceid-accounts', JSON.stringify(finalFaceIds));

          // 3. Products
          const localProducts = getLocalStorageItem('omega-products', []);
          const finalProducts = mergeLists(localProducts, data.products, 'sku');
          if (JSON.stringify(finalProducts) !== JSON.stringify(data.products || [])) needsUpdate = true;
          setProducts(finalProducts);
          localStorage.setItem('omega-products', JSON.stringify(finalProducts));

          // 4. Lots
          const localLots = getLocalStorageItem('omega-lots', []);
          const finalLots = mergeLists(localLots, data.lots, 'id');
          if (JSON.stringify(finalLots) !== JSON.stringify(data.lots || [])) needsUpdate = true;
          setLots(finalLots);
          localStorage.setItem('omega-lots', JSON.stringify(finalLots));

          // 5. Receipts
          const localReceipts = getLocalStorageItem('omega-receipts', []);
          const finalReceipts = mergeLists(localReceipts, data.receipts, 'id');
          if (JSON.stringify(finalReceipts) !== JSON.stringify(data.receipts || [])) needsUpdate = true;
          setReceipts(finalReceipts);
          localStorage.setItem('omega-receipts', JSON.stringify(finalReceipts));

          // 6. Deliveries
          const localDeliveries = getLocalStorageItem('omega-deliveries', []);
          const finalDeliveries = mergeLists(localDeliveries, data.deliveries, 'id');
          if (JSON.stringify(finalDeliveries) !== JSON.stringify(data.deliveries || [])) needsUpdate = true;
          setDeliveries(finalDeliveries);
          localStorage.setItem('omega-deliveries', JSON.stringify(finalDeliveries));

          // 7. Internal Transfers
          const localTransfers = getLocalStorageItem('omega-transfers', []);
          const finalTransfers = mergeLists(localTransfers, data.internalTransfers, 'id');
          if (JSON.stringify(finalTransfers) !== JSON.stringify(data.internalTransfers || [])) needsUpdate = true;
          setInternalTransfers(finalTransfers);
          localStorage.setItem('omega-transfers', JSON.stringify(finalTransfers));

          // 8. Adjustments
          const localAdjustments = getLocalStorageItem('omega-adjustments', []);
          const finalAdjustments = mergeLists(localAdjustments, data.adjustments, 'id');
          if (JSON.stringify(finalAdjustments) !== JSON.stringify(data.adjustments || [])) needsUpdate = true;
          setAdjustments(finalAdjustments);
          localStorage.setItem('omega-adjustments', JSON.stringify(finalAdjustments));

          // 9. Purchase Orders
          const localPO = getLocalStorageItem('omega-purchase-orders', []);
          const finalPO = mergeLists(localPO, data.purchaseOrders, 'id');
          if (JSON.stringify(finalPO) !== JSON.stringify(data.purchaseOrders || [])) needsUpdate = true;
          setPurchaseOrders(finalPO);
          localStorage.setItem('omega-purchase-orders', JSON.stringify(finalPO));

          // 10. Notifications
          const localNotifs = getLocalStorageItem('omega-notifications', []);
          const finalNotifs = mergeLists(localNotifs, data.notifications, 'id');
          if (JSON.stringify(finalNotifs) !== JSON.stringify(data.notifications || [])) needsUpdate = true;
          setNotifications(finalNotifs);
          localStorage.setItem('omega-notifications', JSON.stringify(finalNotifs));

          // 11. Reorder History
          const localReorder = getLocalStorageItem('omega-reorder-history', []);
          const finalReorder = mergeLists(localReorder, data.reorderHistory, 'id');
          if (JSON.stringify(finalReorder) !== JSON.stringify(data.reorderHistory || [])) needsUpdate = true;
          setReorderHistory(finalReorder);
          localStorage.setItem('omega-reorder-history', JSON.stringify(finalReorder));

          // 12. Partners
          const localPartners = getLocalStorageItem('omega-partners', []);
          const finalPartners = mergeLists(localPartners, data.partners, 'id');
          if (JSON.stringify(finalPartners) !== JSON.stringify(data.partners || [])) needsUpdate = true;
          setPartners(finalPartners);
          localStorage.setItem('omega-partners', JSON.stringify(finalPartners));

          // 13. Locations Tree
          let finalTree = data.locationsTree;
          if (!finalTree || !finalTree.id) {
            finalTree = getLocalStorageItem('omega-locations-tree', defaultLocationsTree);
            needsUpdate = true;
          }
          setLocationsTree(finalTree);
          localStorage.setItem('omega-locations-tree', JSON.stringify(finalTree));

          lastSyncedRef.current = {
            registeredAccounts: finalAccs,
            faceIdAccounts: finalFaceIds,
            products: finalProducts,
            lots: finalLots,
            receipts: finalReceipts,
            deliveries: finalDeliveries,
            internalTransfers: finalTransfers,
            adjustments: finalAdjustments,
            purchaseOrders: finalPO,
            notifications: finalNotifs,
            reorderHistory: finalReorder,
            partners: finalPartners,
            locationsTree: finalTree
          };

          // If we merged local accounts, update the server immediately
          if (needsUpdate) {
            const updateController = new AbortController();
            const updateTimeoutId = setTimeout(() => updateController.abort(), 1500);
            fetch('/api/db', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lastSyncedRef.current),
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

          const syncKey = (key, setter, localKey) => {
            const currentStr = localStorage.getItem(localKey) || (key === 'locationsTree' ? '{}' : '[]');
            const incomingStr = JSON.stringify(data[key] || (key === 'locationsTree' ? null : []));
            if (incomingStr !== currentStr) {
              setter(data[key]);
              localStorage.setItem(localKey, incomingStr);
              lastSyncedRef.current[key] = data[key];
            }
          };

          syncKey('registeredAccounts', setRegisteredAccounts, 'omega-registered-accounts');
          syncKey('faceIdAccounts', setFaceIdAccounts, 'omega-faceid-accounts');
          syncKey('products', setProducts, 'omega-products');
          syncKey('lots', setLots, 'omega-lots');
          syncKey('receipts', setReceipts, 'omega-receipts');
          syncKey('deliveries', setDeliveries, 'omega-deliveries');
          syncKey('internalTransfers', setInternalTransfers, 'omega-transfers');
          syncKey('adjustments', setAdjustments, 'omega-adjustments');
          syncKey('purchaseOrders', setPurchaseOrders, 'omega-purchase-orders');
          syncKey('notifications', setNotifications, 'omega-notifications');
          syncKey('reorderHistory', setReorderHistory, 'omega-reorder-history');
          syncKey('partners', setPartners, 'omega-partners');

          // Sync locationsTree
          if (data.locationsTree && data.locationsTree.id) {
            const currentTreeStr = localStorage.getItem('omega-locations-tree') || '{}';
            const incomingTreeStr = JSON.stringify(data.locationsTree);
            if (incomingTreeStr !== currentTreeStr) {
              setLocationsTree(data.locationsTree);
              localStorage.setItem('omega-locations-tree', incomingTreeStr);
              lastSyncedRef.current.locationsTree = data.locationsTree;
            }
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

    const payload = {
      registeredAccounts,
      faceIdAccounts,
      products,
      lots,
      receipts,
      deliveries,
      internalTransfers,
      adjustments,
      purchaseOrders,
      notifications,
      reorderHistory,
      partners,
      locationsTree
    };

    let hasChanged = false;
    for (const key of Object.keys(payload)) {
      if (JSON.stringify(payload[key]) !== JSON.stringify(lastSyncedRef.current[key])) {
        hasChanged = true;
        break;
      }
    }

    if (hasChanged) {
      lastSyncedRef.current = { ...payload };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
      .then(() => clearTimeout(timeoutId))
      .catch(err => {
        clearTimeout(timeoutId);
      });
    }
  }, [
    registeredAccounts, faceIdAccounts, products, lots, receipts, deliveries,
    internalTransfers, adjustments, purchaseOrders, notifications, reorderHistory, partners, locationsTree
  ]);

  useEffect(() => {
    localStorage.setItem('omega-partners', JSON.stringify(partners));
  }, [partners]);

  const loadDemoData = () => {
    const getRandomDateStr = (daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    // 1. Randomize Products stock, min, max, cost, price, status
    const randomProducts = demoProducts.map(p => {
      let stock = Math.floor(Math.random() * 200) + 15;
      if (p.sku === 'OMG-1209') {
        stock = Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 50) + 5;
      }
      if (p.sku === 'OMG-8871') {
        stock = Math.floor(Math.random() * 1500) + 1000;
      }
      
      const minStock = Math.floor(Math.random() * 30) + 15;
      const maxStock = Math.floor(Math.random() * 400) + 200;
      
      // Cost & Price slightly randomized to nearest 1,000 VND
      const cost = Math.round(p.cost * (0.85 + Math.random() * 0.3) / 1000) * 1000;
      const price = Math.round(cost * (1.5 + Math.random() * 0.6) / 1000) * 1000;
      const status = stock === 0 ? 'alert' : stock < minStock ? 'warning' : 'ok';
      
      const possibleLocations = [
        'WH-A/Zone A/Aisle 1/Shelf 1/Level 1',
        'WH-A/Zone A/Aisle 1/Shelf 1/Level 2',
        'WH-A/Zone B/Aisle 1/Shelf 2/Level 3',
        'WH-A/Zone D/Aisle 1/Shelf 1/Level 1',
        'WH-B/Zone B/Aisle 2/Shelf 3/Level 2',
        'WH-C/Zone C/Aisle 1/Shelf 2/Level 1'
      ];
      const randomLoc = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];

      return {
        ...p,
        stock,
        minStock,
        maxStock,
        cost,
        price,
        status,
        location: randomLoc,
        lots: []
      };
    });

    // 2. Generate matching active Lots dynamically based on product stocks
    const randomLots = [];
    randomProducts.forEach(p => {
      if (p.stock > 0) {
        const numLots = Math.random() < 0.4 || p.stock === 1 ? 1 : 2;
        if (numLots === 1) {
          const lotId = `LOT-${p.sku}-${Math.floor(100 + Math.random() * 900)}`;
          randomLots.push({
            id: lotId,
            productSku: p.sku,
            status: 'active',
            qty: p.stock,
            expiry: getRandomDateStr(-Math.floor(180 + Math.random() * 360)),
            dateCreated: getRandomDateStr(Math.floor(10 + Math.random() * 60)),
            receiptRef: `IN-${Math.floor(1000 + Math.random() * 9000)}`
          });
          p.lots.push(lotId);
        } else {
          const qty1 = Math.floor(p.stock / 2) + (p.stock % 2);
          const qty2 = p.stock - qty1;
          
          const lotId1 = `LOT-${p.sku}-${Math.floor(100 + Math.random() * 900)}`;
          const lotId2 = `LOT-${p.sku}-${Math.floor(100 + Math.random() * 900)}`;
          
          randomLots.push({
            id: lotId1,
            productSku: p.sku,
            status: 'active',
            qty: qty1,
            expiry: getRandomDateStr(-Math.floor(180 + Math.random() * 360)),
            dateCreated: getRandomDateStr(Math.floor(30 + Math.random() * 60)),
            receiptRef: `IN-${Math.floor(1000 + Math.random() * 9000)}`
          });
          randomLots.push({
            id: lotId2,
            productSku: p.sku,
            status: 'active',
            qty: qty2,
            expiry: getRandomDateStr(-Math.floor(200 + Math.random() * 360)),
            dateCreated: getRandomDateStr(Math.floor(5 + Math.random() * 25)),
            receiptRef: `IN-${Math.floor(1000 + Math.random() * 9000)}`
          });
          p.lots.push(lotId1, lotId2);
        }
      }
    });

    // 3. Generate randomized Receipts
    const supplierPartners = partners.filter(pr => pr.type === 'supplier');
    const supplierNames = supplierPartners.length > 0 ? supplierPartners.map(pr => pr.name) : ['SteelWorks Ltd', 'TechParts Global', 'ElectroSupply Co', 'HydraFlow Inc'];
    
    const numReceipts = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const randomReceipts = [];
    
    for (let rIndex = 0; rIndex < numReceipts; rIndex++) {
      const recId = `IN-${Math.floor(1000 + Math.random() * 9000)}`;
      const poRef = `PO-2026-0${Math.floor(100 + Math.random() * 900)}`;
      const partnerName = supplierNames[Math.floor(Math.random() * supplierNames.length)];
      const date = getRandomDateStr(Math.floor(2 + Math.random() * 25));
      
      const itemsCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const selectedProds = [];
      const usedSkus = new Set();
      
      while (selectedProds.length < itemsCount) {
        const pRandom = randomProducts[Math.floor(Math.random() * randomProducts.length)];
        if (!usedSkus.has(pRandom.sku)) {
          selectedProds.push(pRandom);
          usedSkus.add(pRandom.sku);
        }
      }
      
      const items = selectedProds.map(p => {
        const qty = Math.floor(Math.random() * 150) + 10;
        return {
          sku: p.sku,
          name: p.name,
          qty,
          cost: p.cost,
          qcPassed: Math.random() < 0.95 ? true : false,
          lotId: p.lots[Math.floor(Math.random() * p.lots.length)] || `LOT-${p.sku}-${Math.floor(100 + Math.random() * 900)}`
        };
      });
      
      const status = Math.random() < 0.6 ? 'done' : Math.random() < 0.5 ? 'ready' : 'waiting';
      const allPassed = items.every(it => it.qcPassed === true);
      const qcDetails = status === 'done' ? {
        checkedBy: `QC_AGENT_0${Math.floor(Math.random() * 5) + 1}`,
        result: allPassed ? 'PASS' : 'FAIL_HOLD',
        notes: allPassed ? 'Tất cả thông số đo đạc vật lý danh nghĩa hoàn toàn ổn định.' : 'Phát hiện một số sản phẩm có vết xước ngoại quan, chuyển phòng kiểm định tiếp theo.'
      } : null;
      
      const possibleLocs = [
        'WH-A/Zone A/Aisle 1/Shelf 1/Level 1',
        'WH-A/Zone B/Aisle 1/Shelf 2/Level 3',
        'WH-C/Zone C/Aisle 1/Shelf 2/Level 1',
        'WH-A/Zone D/Aisle 1/Shelf 1/Level 1'
      ];
      const putawayLoc = status === 'done' ? possibleLocs[Math.floor(Math.random() * possibleLocs.length)] : 'Chờ kiểm định QC.';
      
      randomReceipts.push({
        id: recId,
        ref: poRef,
        warehouse: Math.random() < 0.6 ? 'Warehouse A' : Math.random() < 0.5 ? 'Warehouse B' : 'Warehouse C',
        partner: partnerName,
        items,
        status,
        date,
        qcDetails,
        putawayLoc
      });
    }

    // 4. Generate randomized Deliveries
    const customerPartners = partners.filter(pr => pr.type === 'customer');
    const customerNames = customerPartners.length > 0 ? customerPartners.map(pr => pr.name) : ['MegaRetail Corp', 'BuildMart JSC', 'AutoParts VN', 'IndoTrans Log'];
    
    const numDeliveries = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const randomDeliveries = [];
    
    for (let dIndex = 0; dIndex < numDeliveries; dIndex++) {
      const delId = `OUT-${Math.floor(1000 + Math.random() * 9000)}`;
      const soRef = `SO-${Math.floor(7000 + Math.random() * 900)}`;
      const partnerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const date = getRandomDateStr(Math.floor(1 + Math.random() * 20));
      
      const itemsCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 items
      const selectedProds = [];
      const usedSkus = new Set();
      
      while (selectedProds.length < itemsCount) {
        const pRandom = randomProducts[Math.floor(Math.random() * randomProducts.length)];
        if (!usedSkus.has(pRandom.sku)) {
          selectedProds.push(pRandom);
          usedSkus.add(pRandom.sku);
        }
      }
      
      const items = selectedProds.map(p => {
        const qty = Math.floor(Math.random() * 20) + 2;
        return {
          sku: p.sku,
          name: p.name,
          qty
        };
      });
      
      const status = Math.random() < 0.5 ? 'done' : Math.random() < 0.5 ? 'ready' : 'waiting';
      const steps = {
        pick: status === 'done' ? true : Math.random() < 0.5,
        pack: status === 'done' ? true : Math.random() < 0.3,
        ship: status === 'done'
      };
      
      const carriers = ['DHL Express', 'Giao Hàng Nhanh', 'FedEx', 'Viettel Post'];
      const carrier = carriers[Math.floor(Math.random() * carriers.length)];
      const boxSizes = ['Thùng gỗ pallet', 'Thùng các-tông vừa', 'Thùng nhựa WMS', 'Hộp thư tiêu chuẩn'];
      const boxSize = boxSizes[Math.floor(Math.random() * boxSizes.length)];
      
      const shippingDetails = status === 'done' ? {
        carrier,
        tracking: `TRK-${carrier.slice(0,3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        boxSize
      } : null;
      
      randomDeliveries.push({
        id: delId,
        ref: soRef,
        warehouse: Math.random() < 0.6 ? 'Warehouse A' : Math.random() < 0.5 ? 'Warehouse B' : 'Warehouse C',
        partner: partnerName,
        items,
        status,
        date,
        steps,
        strategy: Math.random() < 0.5 ? 'FIFO' : 'LIFO',
        shippingDetails
      });
    }

    // 5. Generate randomized transfers
    const numTransfers = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const randomInternalTransfers = [];
    const whOptions = ['Warehouse A', 'Warehouse B', 'Warehouse C'];
    
    for (let tIndex = 0; tIndex < numTransfers; tIndex++) {
      const transId = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
      const pRandom = randomProducts[Math.floor(Math.random() * randomProducts.length)];
      const qty = Math.floor(Math.random() * 40) + 10;
      
      const fromWh = whOptions[Math.floor(Math.random() * whOptions.length)];
      let toWh = whOptions[Math.floor(Math.random() * whOptions.length)];
      if (fromWh === toWh) {
        toWh = whOptions[(whOptions.indexOf(fromWh) + 1) % whOptions.length];
      }
      
      const status = Math.random() < 0.5 ? 'done' : Math.random() < 0.5 ? 'in_transit' : 'draft';
      const date = getRandomDateStr(Math.floor(1 + Math.random() * 15));
      
      randomInternalTransfers.push({
        id: transId,
        sku: pRandom.sku,
        qty,
        from: fromWh,
        to: toWh,
        status,
        date
      });
    }

    // 6. Generate randomized adjustments
    const numAdjustments = Math.floor(Math.random() * 2) + 2; // 2 to 3
    const randomAdjustments = [];
    const reasons = ['Kiểm kê định kỳ Q2', 'Hao hụt thiết bị hỏng', 'Điều chỉnh sau chuyển giao', 'Điều tra chênh lệch'];
    
    for (let aIndex = 0; aIndex < numAdjustments; aIndex++) {
      const adjId = `ADJ-${Math.floor(100 + Math.random() * 900)}`;
      const pRandom = randomProducts[Math.floor(Math.random() * randomProducts.length)];
      const systemQty = pRandom.stock;
      
      const diffVal = Math.floor(Math.random() * 20) - 10;
      const actualQty = Math.max(0, systemQty + diffVal);
      const finalDiffVal = actualQty - systemQty;
      const diff = finalDiffVal >= 0 ? `+${finalDiffVal}` : `${finalDiffVal}`;
      const reasonDetail = finalDiffVal === 0 ? 'Không có chênh lệch thực tế' : finalDiffVal < 0 ? 'Phát hiện hao hụt mài mòn cơ khí / mất mát' : 'Phát hiện dư lượng nhãn dán sai sót của nhà cung cấp';
      
      randomAdjustments.push({
        id: adjId,
        warehouse: Math.random() < 0.6 ? 'Warehouse A' : 'Warehouse B',
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        date: getRandomDateStr(Math.floor(1 + Math.random() * 12)),
        status: 'validated',
        items: [
          {
            sku: pRandom.sku,
            name: pRandom.name,
            systemQty,
            actualQty,
            diff,
            reasonDetail
          }
        ]
      });
    }

    // 7. Generate randomized Purchase Orders
    const numPOs = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const randomPurchaseOrders = [];
    const poStatuses = ['confirmed', 'received', 'draft'];
    
    for (let pIndex = 0; pIndex < numPOs; pIndex++) {
      const poId = `PO-2026-0${Math.floor(100 + Math.random() * 900)}`;
      const vendor = supplierNames[Math.floor(Math.random() * supplierNames.length)];
      const items = Math.floor(Math.random() * 3) + 1;
      const total = Math.round((Math.floor(Math.random() * 400000000) + 10000000) / 1000) * 1000;
      const status = poStatuses[Math.floor(Math.random() * poStatuses.length)];
      const expected = getRandomDateStr(-Math.floor(1 + Math.random() * 7));
      
      randomPurchaseOrders.push({
        id: poId,
        vendor,
        items,
        total,
        status,
        expected
      });
    }

    // 8. Generate dynamic Notifications
    const randomNotifications = [
      { 
        id: '1', 
        type: 'info', 
        title: 'Hệ thống khởi chạy', 
        titleEn: 'System Initiated', 
        desc: 'Hệ thống điều khiển kho hàng Omega sẵn sàng hoạt động.', 
        descEn: 'Omega warehouse control system is operational and ready.', 
        time: new Date().toTimeString().split(' ')[0] 
      }
    ];

    randomProducts.forEach(p => {
      if (p.status === 'alert') {
        randomNotifications.push({
          id: `NT-${p.sku}-${Math.floor(Math.random()*1000000)}`,
          type: 'critical',
          title: 'Cháy hàng!',
          titleEn: 'Stockout!',
          desc: `SKU ${p.sku} (${p.name}) đã cạn kiệt (0/${p.maxStock}). Đơn hàng tự động đã tạo.`,
          descEn: `SKU ${p.sku} (${p.nameEn || p.name}) is out of stock (0/${p.maxStock}). Auto-purchase triggered.`,
          time: new Date().toTimeString().split(' ')[0]
        });
      } else if (p.status === 'warning') {
        randomNotifications.push({
          id: `NT-${p.sku}-${Math.floor(Math.random()*1000000)}`,
          type: 'warning',
          title: 'Tồn kho thấp',
          titleEn: 'Low Stock Alert',
          desc: `SKU ${p.sku} (${p.name}) đang dưới hạn tối thiểu (${p.stock}/${p.minStock}). Đề xuất tái cung ứng.`,
          descEn: `SKU ${p.sku} (${p.nameEn || p.name}) is below minimum safety level (${p.stock}/${p.minStock}). Reorder recommended.`,
          time: new Date().toTimeString().split(' ')[0]
        });
      }
    });

    // 9. Generate dynamic reordering rules history logs
    const randomReorderHistory = [];
    randomProducts.forEach(p => {
      if (p.stock < p.minStock) {
        const orderQty = p.maxStock - p.stock;
        randomReorderHistory.push({
          id: `RL-${Math.floor(9000 + Math.random() * 1000)}`,
          sku: p.sku,
          name: p.name,
          min: p.minStock,
          max: p.maxStock,
          current: p.stock,
          orderedQty,
          poId: `PO-2026-0${Math.floor(100 + Math.random() * 900)}`,
          date: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toLocaleString()
        });
      }
    });

    setProducts(randomProducts);
    setLots(randomLots);
    setReceipts(randomReceipts);
    setDeliveries(randomDeliveries);
    setInternalTransfers(randomInternalTransfers);
    setAdjustments(randomAdjustments);
    setPurchaseOrders(randomPurchaseOrders);
    setNotifications(randomNotifications);
    setReorderHistory(randomReorderHistory.length > 0 ? randomReorderHistory : demoReorderHistory);
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
