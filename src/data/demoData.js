export const demoProducts = [
  { 
    sku: 'OMG-9921', 
    barcode: '8930000000011',
    name: 'Khung gầm Carbon X-1', 
    nameEn: 'X-1 Carbon Chassis',
    category: 'HEAVY MACHINERY', 
    categoryVi: 'THIẾT BỊ HẠNG NẶNG',
    stock: 780, 
    minStock: 100,
    maxStock: 1000, 
    unit: 'cái',
    unitEn: 'pcs',
    cost: 1500,
    price: 2500,
    location: 'WH-A/Zone A/Aisle 1/Shelf 1/Level 1', 
    status: 'ok',
    description: 'Khung xe hợp kim siêu bền chịu lực va đập cực cao.',
    lots: ['LOT-9921-A1', 'LOT-9921-A2']
  },
  { 
    sku: 'OMG-4452', 
    barcode: '8930000000022',
    name: 'Giao diện Neural Link', 
    nameEn: 'Neural Link Interface',
    category: 'ELECTRONICS', 
    categoryVi: 'ĐIỆN TỬ',
    stock: 12, 
    minStock: 50,
    maxStock: 500, 
    unit: 'cái',
    unitEn: 'pcs',
    cost: 450,
    price: 890,
    location: 'WH-B/Zone B/Aisle 2/Shelf 3/Level 2', 
    status: 'warning',
    description: 'Chip điện tử thu phát sóng điện não tần số cực cao.',
    lots: ['SN-4452-001', 'SN-4452-002']
  },
  { 
    sku: 'OMG-1209', 
    barcode: '8930000000033',
    name: 'Lõi pin Lithium-Ion V3', 
    nameEn: 'Lithium-Ion Core V3',
    category: 'ENERGY UNITS', 
    categoryVi: 'NĂNG LƯỢNG',
    stock: 0, 
    minStock: 30,
    maxStock: 250, 
    unit: 'cái',
    unitEn: 'pcs',
    cost: 120,
    price: 220,
    location: 'WH-C/Zone C/Aisle 1/Shelf 2/Level 1', 
    status: 'alert',
    description: 'Lõi pin lithium mật độ năng lượng cao dùng cho xe nâng điện.',
    lots: []
  },
  { 
    sku: 'OMG-8871', 
    barcode: '8930000000044',
    name: 'Chất làm mát Công nghiệp', 
    nameEn: 'Industrial Grade Coolant',
    category: 'FLUIDS', 
    categoryVi: 'CHẤT LỎNG',
    stock: 4500, 
    minStock: 500,
    maxStock: 5000, 
    unit: 'Lít',
    unitEn: 'L',
    cost: 15,
    price: 30,
    location: 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1', 
    status: 'ok',
    description: 'Chất lỏng tản nhiệt cao cấp chống ăn mòn hệ thống động cơ.',
    lots: ['LOT-8871-01']
  },
  { 
    sku: 'X-10492-PS', 
    barcode: '8930000000055',
    name: 'Cảm biến Chính xác X-1', 
    nameEn: 'Precision Sensor X-1',
    category: 'ELECTRONICS', 
    categoryVi: 'ĐIỆN TỬ',
    stock: 1429, 
    minStock: 200,
    maxStock: 2000, 
    unit: 'cái',
    unitEn: 'pcs',
    cost: 95,
    price: 180,
    location: 'WH-A/Zone B/Aisle 1/Shelf 2/Level 3', 
    status: 'ok',
    description: 'Cảm biến quang học siêu chính xác đo khoảng cách hồng ngoại.',
    lots: ['SN-10492-P1', 'SN-10492-P2']
  },
  { 
    sku: 'SKU-AOMUA', 
    barcode: '8930000000066',
    name: 'Áo mưa tiện lợi OMEGA', 
    nameEn: 'OMEGA Raincoat',
    category: 'SAFETY APPAREL', 
    categoryVi: 'ĐỒ BẢO HỘ',
    stock: 120, 
    minStock: 50,
    maxStock: 500, 
    unit: 'cái',
    unitEn: 'pcs',
    cost: 5,
    price: 15,
    location: 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1', 
    status: 'ok',
    description: 'Áo mưa tiện lợi siêu nhẹ chống thấm nước tuyệt đối.',
    lots: []
  },
  { 
    sku: 'SKU-ODU', 
    barcode: '8930000000077',
    name: 'Ô dù cầm tay OMEGA', 
    nameEn: 'OMEGA Umbrella',
    category: 'SAFETY APPAREL', 
    categoryVi: 'ĐỒ BẢO HỘ',
    stock: 80, 
    minStock: 20,
    maxStock: 300, 
    unit: 'cái',
    unitEn: 'pcs',
    cost: 15,
    price: 35,
    location: 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1', 
    status: 'ok',
    description: 'Ô dù cầm tay cán dài gấp gọn có in logo OMEGA WMS.',
    lots: []
  },
  { 
    sku: 'SKU-AOCHONGNANG', 
    barcode: '8930000000088',
    name: 'Áo khoác chống nắng UV OMEGA', 
    nameEn: 'OMEGA UV Sunscreen Jacket',
    category: 'SAFETY APPAREL', 
    categoryVi: 'ĐỒ BẢO HỘ',
    stock: 150, 
    minStock: 30,
    maxStock: 400, 
    unit: 'cái',
    unitEn: 'pcs',
    cost: 45,
    price: 95,
    location: 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1', 
    status: 'ok',
    description: 'Áo khoác bảo hộ chống tia cực tím UV cực cao ngoài trời.',
    lots: []
  }
];

export const demoLots = [
  { id: 'LOT-9921-A1', productSku: 'OMG-9921', status: 'active', qty: 500, expiry: '2027-10-15', dateCreated: '2026-04-10', receiptRef: 'IN 8841' },
  { id: 'LOT-9921-A2', productSku: 'OMG-9921', status: 'active', qty: 280, expiry: '2027-12-01', dateCreated: '2026-05-17', receiptRef: 'IN 8842' },
  { id: 'SN-4452-001', productSku: 'OMG-4452', status: 'active', qty: 1, expiry: '2029-05-20', dateCreated: '2026-05-20', receiptRef: 'IN 8843' },
  { id: 'SN-4452-002', productSku: 'OMG-4452', status: 'active', qty: 1, expiry: '2029-05-20', dateCreated: '2026-05-20', receiptRef: 'IN 8843' },
  { id: 'LOT-8871-01', productSku: 'OMG-8871', status: 'active', qty: 4500, expiry: '2028-01-20', dateCreated: '2026-03-01', receiptRef: 'IN 8841' },
  { id: 'SN-10492-P1', productSku: 'X-10492-PS', status: 'active', qty: 1000, expiry: '2030-05-25', dateCreated: '2026-05-25', receiptRef: 'IN 8842' },
  { id: 'SN-10492-P2', productSku: 'X-10492-PS', status: 'active', qty: 429, expiry: '2030-05-25', dateCreated: '2026-05-25', receiptRef: 'IN 8842' }
];

export const demoReceipts = [
  { 
    id: 'IN 8841', 
    ref: 'PO-2026-0141', 
    warehouse: 'Warehouse A', 
    partner: 'SteelWorks Ltd', 
    items: [
      { sku: 'OMG-9921', name: 'Khung gầm Carbon X-1', qty: 500, cost: 1500, qcPassed: true, lotId: 'LOT-9921-A1' },
      { sku: 'OMG-8871', name: 'Chất làm mát Công nghiệp', qty: 4500, cost: 15, qcPassed: true, lotId: 'LOT-8871-01' }
    ], 
    status: 'done', 
    date: '2026-05-17',
    qcDetails: { checkedBy: 'QC_CHIP_01', result: 'PASS', notes: 'Tất cả thông số tải trọng và độ giãn nở kim loại danh nghĩa ổn định.' },
    putawayLoc: 'WH-A/Zone A/Aisle 1/Shelf 1/Level 1'
  },
  { 
    id: 'IN 8842', 
    ref: 'PO-2026-0142', 
    warehouse: 'Warehouse A', 
    partner: 'TechParts Global', 
    items: [
      { sku: 'OMG-9921', name: 'Khung gầm Carbon X-1', qty: 280, cost: 1500, qcPassed: null, lotId: 'LOT-9921-A2' },
      { sku: 'X-10492-PS', name: 'Cảm biến Chính xác X-1', qty: 1429, cost: 95, qcPassed: null, lotId: 'SN-10492-P1' }
    ], 
    status: 'ready', 
    date: '2026-05-22',
    qcDetails: null,
    putawayLoc: 'Gợi ý: Khu A (Heavy) cho Khung gầm; Khu B (Electronics) cho Cảm biến.'
  },
  { 
    id: 'IN 8843', 
    ref: 'PO-2026-0139', 
    warehouse: 'Warehouse B', 
    partner: 'ElectroSupply Co', 
    items: [
      { sku: 'OMG-4452', name: 'Giao diện Neural Link', qty: 10, cost: 450, qcPassed: null, lotId: 'SN-4452-003' }
    ], 
    status: 'waiting', 
    date: '2026-05-20',
    qcDetails: null,
    putawayLoc: 'Gợi ý: Khu B (Phụ kiện điện tử).'
  }
];

export const demoDeliveries = [
  { 
    id: 'OUT 5521', 
    ref: 'SO-7782', 
    warehouse: 'Warehouse A', 
    partner: 'MegaRetail Corp', 
    items: [{ sku: 'OMG-9921', name: 'Khung gầm Carbon X-1', qty: 16 }], 
    status: 'done', 
    date: '2026-05-17',
    steps: { pick: true, pack: true, ship: true },
    strategy: 'FIFO',
    shippingDetails: { carrier: 'DHL Express', tracking: 'TRK-DHL-99241', boxSize: 'Thùng gỗ pallet' }
  },
  { 
    id: 'OUT 5522', 
    ref: 'SO-7785', 
    warehouse: 'Warehouse A', 
    partner: 'BuildMart JSC', 
    items: [{ sku: 'OMG-9921', name: 'Khung gầm Carbon X-1', qty: 9 }], 
    status: 'ready', 
    date: '2026-05-28',
    steps: { pick: false, pack: false, ship: false },
    strategy: 'FIFO',
    shippingDetails: null
  },
  { 
    id: 'OUT 5523', 
    ref: 'SO-7790', 
    warehouse: 'Warehouse B', 
    partner: 'AutoParts VN', 
    items: [{ sku: 'OMG-4452', name: 'Giao diện Neural Link', qty: 2 }], 
    status: 'waiting', 
    date: '2026-05-29',
    steps: { pick: false, pack: false, ship: false },
    strategy: 'LIFO',
    shippingDetails: null
  }
];

export const demoInternalTransfers = [
  { id: 'TR 1201', sku: 'OMG-9921', qty: 120, from: 'Warehouse A', to: 'Warehouse B', status: 'in_transit', date: '2026-05-16' },
  { id: 'TR 1202', sku: 'OMG-8871', qty: 45, from: 'Warehouse B', to: 'Warehouse C', status: 'draft', date: '2026-05-21' },
  { id: 'TR 1203', sku: 'X-10492-PS', qty: 80, from: 'Warehouse A', to: 'Warehouse C', status: 'done', date: '2026-05-15' },
];

export const demoAdjustments = [
  { id: 'ADJ 301', warehouse: 'Warehouse A', reason: 'Kiểm kê định kỳ Q2', date: '2026-05-14', status: 'validated', items: [{ sku: 'OMG-9921', name: 'Khung gầm Carbon X-1', systemQty: 756, actualQty: 780, diff: '+24', reasonDetail: 'Điều chỉnh lượng dôi dư không dán nhãn' }] },
  { id: 'ADJ 302', warehouse: 'Warehouse B', reason: 'Hao hụt thiết bị hỏng', date: '2026-05-16', status: 'validated', items: [{ sku: 'OMG-4452', name: 'Giao diện Neural Link', systemQty: 20, actualQty: 12, diff: '-8', reasonDetail: 'Linh kiện cháy hỏng trong khâu kiểm tra mẫu' }] },
];

export const demoPurchaseOrders = [
  { id: 'PO-2026-0142', vendor: 'TechParts Global', items: 2, total: 605000, status: 'confirmed', expected: '2026-05-22' },
  { id: 'PO-2026-0141', vendor: 'SteelWorks Ltd', items: 2, total: 817500, status: 'received', expected: '2026-05-18' },
  { id: 'PO-2026-0140', vendor: 'HydraFlow Inc', items: 1, total: 9200, status: 'draft', expected: '2026-05-25' },
  { id: 'PO-2026-0139', vendor: 'ElectroSupply Co', items: 1, total: 4500, status: 'confirmed', expected: '2026-05-20' },
];

export const demoNotifications = [
  { id: '1', type: 'info', title: 'Hệ thống khởi chạy', titleEn: 'System Initiated', desc: 'Hệ thống điều khiển kho hàng Omega sẵn sàng hoạt động.', descEn: 'Omega warehouse control system is operational and ready.', time: '20:58:16' },
  { id: '2', type: 'warning', title: 'Tồn kho thấp', titleEn: 'Low Stock Alert', desc: 'SKU OMG-4452 (Giao diện Neural Link) đang dưới hạn tối thiểu (12/50). Đề xuất tái cung ứng.', descEn: 'SKU OMG-4452 (Neural Link Interface) is below minimum safety level (12/50). Reorder recommended.', time: '20:59:00' },
  { id: '3', type: 'critical', title: 'Cháy hàng!', titleEn: 'Stockout!', desc: 'SKU OMG-1209 (Lõi pin Lithium-Ion V3) đã cạn kiệt (0/250). Đơn hàng tự động đã tạo.', descEn: 'SKU OMG-1209 (Lithium-Ion Core V3) is out of stock (0/250). Auto-purchase triggered.', time: '21:00:12' }
];

export const demoReorderHistory = [
  { id: 'RL-9901', sku: 'OMG-1209', name: 'Lõi pin Lithium-Ion V3', min: 30, max: 250, current: 0, orderedQty: 250, poId: 'PO-2026-0140', date: '2026-05-26 21:00:12' }
];
