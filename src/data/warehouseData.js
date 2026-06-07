/** Mock data inspired by Odoo Inventory / Purchase / Operations (no AI) */

export const warehouses = [
  { id: 'WH-A', name: 'Warehouse A', location: 'Ho Chi Minh City', zones: 12, utilization: 78, skus: 8420 },
  { id: 'WH-B', name: 'Warehouse B', location: 'Hanoi', zones: 8, utilization: 62, skus: 4030 },
  { id: 'WH-C', name: 'Warehouse C', location: 'Da Nang', zones: 5, utilization: 45, skus: 2100 },
];

export const purchaseOrders = [
  { id: 'PO 2026 0142', vendor: 'TechParts Global', items: 24, total: '$18,420', status: 'confirmed', expected: '2026-05-22' },
  { id: 'PO 2026 0141', vendor: 'SteelWorks Ltd', items: 8, total: '$6,750', status: 'received', expected: '2026-05-18' },
  { id: 'PO 2026 0140', vendor: 'HydraFlow Inc', items: 15, total: '$9,200', status: 'draft', expected: '2026-05-25' },
  { id: 'PO 2026 0139', vendor: 'ElectroSupply Co', items: 42, total: '$31,100', status: 'confirmed', expected: '2026-05-20' },
  { id: 'PO 2026 0138', vendor: 'MechCore Vietnam', items: 11, total: '$4,890', status: 'cancelled', expected: '—' },
];

export const receipts = [
  { id: 'IN 8841', ref: 'PO 2026 0141', warehouse: 'Warehouse A', partner: 'SteelWorks Ltd', items: 8, status: 'done', date: '2026-05-17' },
  { id: 'IN 8842', ref: 'PO 2026 0142', warehouse: 'Warehouse A', partner: 'TechParts Global', items: 24, status: 'ready', date: '2026-05-22' },
  { id: 'IN 8843', ref: 'PO 2026 0139', warehouse: 'Warehouse B', partner: 'ElectroSupply Co', items: 42, status: 'waiting', date: '2026-05-20' },
];

export const deliveries = [
  { id: 'OUT 5521', ref: 'SO 7782', warehouse: 'Warehouse A', partner: 'MegaRetail Corp', items: 16, status: 'done', date: '2026-05-17' },
  { id: 'OUT 5522', ref: 'SO 7785', warehouse: 'Warehouse A', partner: 'BuildMart JSC', items: 9, status: 'ready', date: '2026-05-18' },
  { id: 'OUT 5523', ref: 'SO 7790', warehouse: 'Warehouse B', partner: 'AutoParts VN', items: 22, status: 'waiting', date: '2026-05-19' },
];

export const internalTransfers = [
  { id: 'TR 1201', from: 'Warehouse A', to: 'Warehouse B', items: 120, status: 'in_transit', date: '2026-05-16' },
  { id: 'TR 1202', from: 'Warehouse B', to: 'Warehouse C', items: 45, status: 'draft', date: '2026-05-21' },
  { id: 'TR 1203', from: 'Warehouse A', to: 'Warehouse C', items: 80, status: 'done', date: '2026-05-15' },
];

export const stockAdjustments = [
  { id: 'ADJ 301', warehouse: 'Warehouse A', reason: 'Physical inventory', diff: '+24', date: '2026-05-14', status: 'validated' },
  { id: 'ADJ 302', warehouse: 'Warehouse B', reason: 'Damaged goods', diff: '-8', date: '2026-05-16', status: 'validated' },
];

export const reportCatalog = [
  { id: 'stock-on-hand', icon: 'inventory', records: 12450 },
  { id: 'stock-valuation', icon: 'valuation', records: 12450 },
  { id: 'movement-history', icon: 'history', records: 3842 },
  { id: 'forecasted', icon: 'forecast', records: 890, comingSoon: true },
];

export const warehouseAlerts = [
  { type: 'low_stock', severity: 'urgent' },
  { type: 'overdue_po', severity: 'warning' },
  { type: 'pending_receipt', severity: 'info' },
];
