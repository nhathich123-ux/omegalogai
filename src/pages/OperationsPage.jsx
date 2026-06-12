import { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  Boxes,
  Barcode,
  Navigation,
  Compass,
  Plus,
  Copy,
  Search,
  Check,
  X,
  Filter
} from 'lucide-react';

// Reusable Copy Text Action Button Component
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button 
      onClick={handleCopy}
      type="button" 
      className="inline-flex items-center justify-center p-1 rounded bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-[#ff7a45] transition-all cursor-pointer select-none"
      title="Copy to clipboard"
    >
      {copied ? (
        <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase tracking-wider animate-pulse">Copied!</span>
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}
import { useApp } from '../context/AppContext';
import { Card, StatusPill, DataTable } from '../components/ui';

export default function OperationsPage() {
  const { 
    receipts, 
    deliveries, 
    internalTransfers, 
    products, 
    processQC, 
    validateReceipt, 
    createReceipt,
    createDelivery,
    setStrategy, 
    processPick, 
    processPack, 
    processShip,
    createInternalTransfer,
    partners,
    lang,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useApp();

  const isVi = lang === 'vi';

  // Tabs: 'receipts' | 'deliveries' | 'transfers'
  const [activeTab, setActiveTab] = useState('receipts');

  // Search & Filter state for receipts/deliveries
  const receiptSearch = globalSearchQuery;
  const setReceiptSearch = setGlobalSearchQuery;
  const [receiptStatusFilter, setReceiptStatusFilter] = useState('ALL');
  const deliverySearch = globalSearchQuery;
  const setDeliverySearch = setGlobalSearchQuery;
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('ALL');

  // Detail Modal overlay state
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

  // Forms state for QC process
  const [qcNotes, setQcNotes] = useState('');
  const [qcInspections, setQcInspections] = useState({});

  // Forms state for Pack process
  const [selectedBox, setSelectedBox] = useState('Thùng gỗ Pallet (Heavy Pallet)');
  const [selectedPutaway, setSelectedPutaway] = useState('WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
  
  // Forms state for Internal Transfer
  const [transferSku, setTransferSku] = useState('OMG-9921');
  const [transferQty, setTransferQty] = useState(10);
  const [transferFrom, setTransferFrom] = useState('Warehouse A');
  const [transferTo, setTransferTo] = useState('WH-B/Zone B/Aisle 2/Shelf 3/Level 2');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Manual Receipt/Delivery Creation States
  const [isManualReceiptOpen, setIsManualReceiptOpen] = useState(false);
  const [manualRecVendor, setManualRecVendor] = useState('');
  const [manualRecSku, setManualRecSku] = useState('');
  const [manualRecQty, setManualRecQty] = useState(1);

  const [isManualDeliveryOpen, setIsManualDeliveryOpen] = useState(false);
  const [manualDelCustomer, setManualDelCustomer] = useState('');
  const [manualDelSku, setManualDelSku] = useState('');
  const [manualDelQty, setManualDelQty] = useState(1);
  const [manualDelStrategy, setManualDelStrategy] = useState('FIFO');

  const openManualReceiptModal = () => {
    const suppliers = partners.filter(p => p.type === 'supplier');
    if (suppliers.length > 0) {
      setManualRecVendor(suppliers[0].name);
    } else {
      setManualRecVendor('General Supplier');
    }
    if (products.length > 0) {
      setManualRecSku(products[0].sku);
    } else {
      setManualRecSku('');
    }
    setManualRecQty(1);
    setIsManualReceiptOpen(true);
  };

  const openManualDeliveryModal = () => {
    const customers = partners.filter(p => p.type === 'customer');
    if (customers.length > 0) {
      setManualDelCustomer(customers[0].name);
    } else {
      setManualDelCustomer('MegaRetail Corp');
    }
    if (products.length > 0) {
      setManualDelSku(products[0].sku);
    } else {
      setManualDelSku('');
    }
    setManualDelQty(1);
    setManualDelStrategy('FIFO');
    setIsManualDeliveryOpen(true);
  };

  const handleCreateManualReceipt = (e) => {
    e.preventDefault();
    if (!manualRecVendor || !manualRecSku || manualRecQty <= 0) return;
    const prod = products.find(p => p.sku === manualRecSku);
    if (!prod) return;
    
    createReceipt({
      ref: 'Manual',
      warehouse: 'Warehouse A',
      partner: manualRecVendor,
      items: [
        {
          sku: manualRecSku,
          name: prod.name,
          qty: Number(manualRecQty),
          cost: prod.cost,
          qcPassed: null,
          lotId: `LOT-${manualRecSku}-${Math.floor(100 + Math.random() * 900)}`
        }
      ],
      qcDetails: null,
      putawayLoc: 'Đang đợi kiểm định QC.'
    });
    
    setIsManualReceiptOpen(false);
    setManualRecQty(1);
  };

  const handleCreateManualDelivery = (e) => {
    e.preventDefault();
    if (!manualDelCustomer || !manualDelSku || manualDelQty <= 0) return;
    const prod = products.find(p => p.sku === manualDelSku);
    if (!prod) return;

    if (prod.stock < manualDelQty) {
      alert(isVi 
        ? `Không đủ hàng tồn! ${prod.name} chỉ còn ${prod.stock} sản phẩm.` 
        : `Insufficient stock! ${prod.nameEn || prod.name} only has ${prod.stock} units available.`);
      return;
    }

    createDelivery({
      ref: 'Manual',
      warehouse: 'Warehouse A',
      partner: manualDelCustomer,
      items: [
        {
          sku: manualDelSku,
          name: prod.name,
          qty: Number(manualDelQty)
        }
      ],
      strategy: manualDelStrategy
    });
    
    setIsManualDeliveryOpen(false);
    setManualDelQty(1);
  };

  // Active items
  const activeReceipt = receipts.find(r => r.id === selectedReceiptId);
  const activeDelivery = deliveries.find(d => d.id === selectedDeliveryId);
  const selectedTransferProduct = products.find(p => p.sku === transferSku);

  // Formatting currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Auto-generate Putaway Rule suggestion based on item traits
  const getPutawaySuggestion = (sku) => {
    const prod = products.find(p => p.sku === sku);
    if (!prod) return 'Khu vực Chung (General Zone)';
    
    // Rule 1: Heavy machinery items go to Floor Level 1
    if (prod.category === 'HEAVY MACHINERY') {
      return 'WH-A/Zone A/Aisle 1/Shelf 1/Level 1 (Gợi ý: Tải trọng nặng, Tầng trệt)';
    }
    // Rule 2: Electronics need static protection upper levels
    if (prod.category === 'ELECTRONICS') {
      return 'WH-A/Zone B/Aisle 1/Shelf 2/Level 3 (Gợi ý: Tránh ẩm, Tầng cao)';
    }
    // Rule 3: Fluids need dedicated containment zones
    if (prod.category === 'FLUIDS') {
      return 'WH-A/Zone D/Aisle 1/Shelf 1/Level 1 (Gợi ý: Chống rò rỉ, Khu an toàn)';
    }
    // Rule 4: Energy Units need thermal safety
    if (prod.category === 'ENERGY UNITS') {
      return 'WH-C/Zone C/Aisle 1/Shelf 2/Level 1 (Gợi ý: Lõi pin năng lượng)';
    }
    return prod.location;
  };

  // Executing internal transfer
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.sku === transferSku);
    if (!prod) return;
    const success = createInternalTransfer(transferSku, Number(transferQty), prod.location, transferTo);
    if (success) {
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 3000);
      setTransferQty(10);
    } else {
      alert(isVi ? 'Không đủ lượng tồn kho thực tế để chuyển khoản!' : 'Insufficient stock at source warehouse!');
    }
  };

  // Filter receipts
  const filteredReceipts = receipts.filter(rec => {
    const matchesSearch = rec.id.toLowerCase().includes(receiptSearch.toLowerCase()) ||
                          rec.ref.toLowerCase().includes(receiptSearch.toLowerCase()) ||
                          (rec.partner && rec.partner.toLowerCase().includes(receiptSearch.toLowerCase())) ||
                          (rec.items && rec.items.some(item => item.sku.toLowerCase().includes(receiptSearch.toLowerCase()) || item.name.toLowerCase().includes(receiptSearch.toLowerCase())));
    const matchesStatus = receiptStatusFilter === 'ALL' || rec.status === receiptStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(del => {
    const matchesSearch = del.id.toLowerCase().includes(deliverySearch.toLowerCase()) ||
                          del.ref.toLowerCase().includes(deliverySearch.toLowerCase()) ||
                          (del.partner && del.partner.toLowerCase().includes(deliverySearch.toLowerCase())) ||
                          (del.items && del.items.some(item => item.sku.toLowerCase().includes(deliverySearch.toLowerCase()) || item.name.toLowerCase().includes(deliverySearch.toLowerCase())));
    const matchesStatus = deliveryStatusFilter === 'ALL' || del.status === deliveryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 animate-fade-in text-zinc-100">
      
      {/* ─── TABS HEADER SUB-NAVIGATION ─── */}
      <div className="flex items-center gap-6 border-b border-[#1b1a20] pb-3 mb-8 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase select-none">
        <button 
          onClick={() => setActiveTab('receipts')}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'receipts' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? '1. NHẬP KHO (RECEIPTS)' : '1. INCOMING SHIPMENTS (RECEIPTS)'}
          {activeTab === 'receipts' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button 
          onClick={() => setActiveTab('deliveries')}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'deliveries' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? '2. XUẤT KHO (DELIVERIES)' : '2. OUTGOING SHIPMENTS (DELIVERIES)'}
          {activeTab === 'deliveries' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button 
          onClick={() => setActiveTab('transfers')}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'transfers' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? '3. CHUYỂN KHO NỘI BỘ (TRANSFERS)' : '3. INTERNAL WAREHOUSE TRANSFERS'}
          {activeTab === 'transfers' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────
          TAB 1: INCOMING SHIPMENTS / RECEIPTS
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'receipts' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-zinc-100">{isVi ? 'Phiếu nhập kho & kiểm tra chất lượng (QC)' : 'Incoming receipts & quality checks'}</h2>
              <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase tracking-widest mt-1">
                {isVi ? 'KIỂM THỬ QC TRƯỚC KHI ĐƯA VÀO VỊ TRÍ KỆ BẢO QUẢN' : 'RECEIPTS METRIC SYSTEM AND QUALITY TESTS'}
              </p>
            </div>
            <button 
              onClick={openManualReceiptModal}
              type="button" 
              className="px-4 py-2 bg-[#ff7a45] text-zinc-950 font-mono text-[10px] font-extrabold tracking-widest rounded uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              {isVi ? 'TẠO PHIẾU NHẬP THỦ CÔNG' : 'CREATE MANUAL RECEIPT'}
            </button>
          </div>

          {/* Search & Filter Bar for Receipts */}
          <div className="p-4 mb-6 rounded-lg bg-[#111114] border border-[#22202a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              
              {/* Search box */}
              <div className="flex flex-col items-start relative w-full">
                <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Search className="w-3 h-3 text-[#ff7a45]/60" />
                  {isVi ? 'TÌM PHIẾU NHẬP KHO' : 'SEARCH RECEIPTS'}
                </label>
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={receiptSearch}
                    onChange={(e) => setReceiptSearch(e.target.value)}
                    placeholder={isVi ? 'MÃ PHIẾU, NGUỒN PO, ĐỐI TÁC...' : 'RECEIPT ID, PO, VENDOR...'}
                    className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-1.5 px-3 pl-8 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none transition-all placeholder:text-zinc-500"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  {receiptSearch && (
                    <button 
                      type="button"
                      onClick={() => setReceiptSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#ff7a45] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status filter */}
              <div className="flex flex-col items-start relative w-full">
                <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Filter className="w-3 h-3 text-[#ff7a45]/60" />
                  {isVi ? 'TRẠNG THÁI PHIẾU' : 'RECEIPT STAGE'}
                </label>
                <div className="relative w-full">
                  <select 
                    value={receiptStatusFilter}
                    onChange={(e) => setReceiptStatusFilter(e.target.value)}
                    className="filter-select w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-1.5 px-3 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none cursor-pointer transition-all"
                  >
                    <option value="ALL">{isVi ? 'TẤT CẢ TRẠNG THÁI' : 'ALL STAGES'}</option>
                    <option value="waiting">{isVi ? 'ĐANG CHỜ HÀNG (WAITING)' : 'WAITING'}</option>
                    <option value="ready">{isVi ? 'CHỜ QC / PUTAWAY (READY)' : 'QC PENDING'}</option>
                    <option value="done">{isVi ? 'ĐÃ NHẬP KHO (DONE)' : 'DELIVERED/DONE'}</option>
                  </select>
                </div>
              </div>

              {/* Clear button / indicator */}
              <div className="flex items-center justify-end h-[30px] font-mono text-[9px] text-zinc-500 tracking-wider w-full">
                {(receiptSearch || receiptStatusFilter !== 'ALL') ? (
                  <button
                    onClick={() => { setReceiptSearch(''); setReceiptStatusFilter('ALL'); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff7a45]/10 border border-[#ff7a45]/20 hover:border-[#ff7a45]/40 text-[#ff7a45] rounded uppercase font-bold tracking-widest transition-all hover:bg-[#ff7a45]/15 w-full sm:w-auto justify-center"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {isVi ? 'Đặt lại bộ lọc' : 'Reset Filters'}
                  </button>
                ) : (
                  <div className="text-zinc-500 flex items-center gap-1.5 select-none font-bold justify-end w-full">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {isVi 
                      ? `ĐANG HIỂN THỊ ${filteredReceipts.length} PHIẾU NHẬP` 
                      : `SHOWING ${filteredReceipts.length} RECEIPTS`}
                  </div>
                )}
              </div>

            </div>
          </div>

          <Card noPadding className="overflow-hidden bg-[#111114] border border-[#22202a]">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#22202a] text-xs font-mono tracking-widest text-[#ff9e7d]/70 uppercase font-bold bg-[#0e0e11]/30">
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'MÃ PHIẾU' : 'RECEIPT ID'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'NGUỒN HỢP ĐỒNG' : 'SOURCE PO'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'ĐỐI TÁC CUNG CẤP' : 'VENDOR PARTNER'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'NGÀY HẸN' : 'EXP ETA'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'TRẠNG THÁI' : 'STAGE'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.map((rec) => (
                    <tr 
                      key={rec.id} 
                      onClick={() => { 
                        setSelectedReceiptId(rec.id); 
                        setQcNotes(''); 
                        setQcInspections({}); 
                        // Recommended default location based on first product category!
                        const firstItem = rec.items[0];
                        if (firstItem) {
                          const prod = products.find(p => p.sku === firstItem.sku);
                          if (prod) {
                            if (prod.category === 'HEAVY MACHINERY') {
                              setSelectedPutaway('WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
                            } else if (prod.category === 'ELECTRONICS') {
                              setSelectedPutaway('WH-A/Zone B/Aisle 1/Shelf 2/Level 3');
                            } else if (prod.category === 'FLUIDS') {
                              setSelectedPutaway('WH-A/Zone D/Aisle 1/Shelf 1/Level 1');
                            } else if (prod.category === 'ENERGY UNITS') {
                              setSelectedPutaway('WH-C/Zone C/Aisle 1/Shelf 2/Level 1');
                            } else {
                              setSelectedPutaway(prod.location || 'WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
                            }
                          } else {
                            setSelectedPutaway('WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
                          }
                        } else {
                          setSelectedPutaway('WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
                        }
                      }}
                      className="border-b border-[#1b1a20] hover:bg-zinc-900/40 cursor-pointer last:border-0"
                    >
                      <td className="py-3.5 px-5 font-mono text-xs font-bold text-zinc-300">
                        <div className="flex items-center gap-1">
                          <span>#{rec.id}</span>
                          <CopyButton text={rec.id} />
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-zinc-400">{rec.ref}</td>
                      <td className="py-3.5 px-5 font-sans text-xs font-bold text-zinc-300">{rec.partner}</td>
                      <td className="py-3.5 px-5 font-mono text-xs text-zinc-500">{rec.date}</td>
                      <td className="py-3.5 px-5">
                        <StatusPill 
                          label={rec.status === 'ready' ? (isVi ? 'CHỜ QC / PUTAWAY' : 'QC PENDING') : rec.status === 'waiting' ? (isVi ? 'ĐANG ĐỢI HÀNG' : 'WAITING') : (isVi ? 'ĐÃ NHẬP KHO' : 'DONE')}
                          variant={rec.status === 'ready' ? 'warning' : rec.status === 'waiting' ? 'zinc' : 'ok'} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 1: RECEIPTS DETAILED DRAWER (QC & PUTAWAY) ─── */}
      {activeTab === 'receipts' && activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs select-none">
          <div className="w-full max-w-xl h-full bg-[#0c0c0e] border-l border-zinc-800/80 flex flex-col shadow-2xl animate-fade-in">
            
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-100">
                  {isVi ? `Xử lý Nhập kho: #${activeReceipt.id}` : `Incoming Receipt: #${activeReceipt.id}`}
                </h3>
                <p className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1">
                  {isVi ? `ĐỐI TÁC: ${activeReceipt.partner} // NGUỒN PO: ${activeReceipt.ref}` : `PARTNER: ${activeReceipt.partner}`}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedReceiptId(null)} className="text-zinc-500 hover:text-zinc-200 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 pb-20 space-y-6">
              {/* 3 Steps Progress tracker visual */}
              <div className="grid grid-cols-3 gap-3 font-mono text-[9px] font-bold uppercase tracking-wider text-center select-none">
                <div className={`p-2 border rounded ${activeReceipt.status === 'waiting' ? 'border-[#ff7a45]/30 text-[#ff7a45] bg-[#ff7a45]/5 animate-pulse' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'}`}>
                  {isVi ? 'BƯỚC 1: ĐỢI HÀNG' : 'STEP 1: AWAITING'}
                </div>
                <div className={`p-2 border rounded ${activeReceipt.status === 'ready' ? 'border-[#ff7a45]/30 text-[#ff7a45] bg-[#ff7a45]/5 animate-pulse' : activeReceipt.qcDetails ? 'border-emerald-500/20 text-emerald-400 bg-emerald-950/10' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'}`}>
                  {isVi ? 'BƯỚC 2: KIỂM QC' : 'STEP 2: QC CHECK'}
                </div>
                <div className={`p-2 border rounded ${activeReceipt.status === 'done' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-950/10' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'}`}>
                  {isVi ? 'BƯỚC 3: XẾP KỆ' : 'STEP 3: PUTAWAY'}
                </div>
              </div>

              {/* Items Table */}
              <Card className="bg-zinc-950/60 p-4 border border-zinc-900 rounded">
                <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase mb-2">
                  {isVi ? 'Danh sách nguyên vật liệu hàng mua (BOL checklist)' : 'Inbound Purchase Manifest Items'}
                </p>
                <div className="space-y-3 font-mono text-[10px]">
                  {activeReceipt.items.map((item, idx) => (
                    <div key={item.sku} className="flex justify-between items-center py-1.5 border-b border-zinc-900 last:border-0 last:pb-0">
                      <div>
                        <span className="text-zinc-400 flex items-center gap-1 font-bold">
                          #{item.sku}
                          <CopyButton text={item.sku} />
                        </span>
                        <span className="text-zinc-500 text-[9px] block mt-0.5">{item.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-300 font-extrabold">{item.qty} pcs</span>
                        
                        {activeReceipt.status === 'ready' && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setQcInspections(prev => ({ ...prev, [idx]: true }))}
                              className={`px-2 py-0.5 font-mono text-[8px] font-bold rounded-sm border ${
                                qcInspections[idx] === true 
                                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                              }`}
                            >
                              PASS
                            </button>
                            <button
                              type="button"
                              onClick={() => setQcInspections(prev => ({ ...prev, [idx]: false }))}
                              className={`px-2 py-0.5 font-mono text-[8px] font-bold rounded-sm border ${
                                qcInspections[idx] === false 
                                  ? 'bg-red-950/20 text-red-400 border-red-500/30' 
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                              }`}
                            >
                              FAIL
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* QC Details logger inputs */}
              {activeReceipt.status === 'ready' && (
                <div className="space-y-4">
                  <div className="border border-zinc-850 p-4 bg-zinc-950/40 rounded">
                    <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase mb-2">
                      {isVi ? 'Quy tắc gợi ý vị trí xếp hàng (Putaway Rules)' : 'Putaway Location Suggestions'}
                    </p>
                    <div className="space-y-2 text-[10px] font-mono">
                      {activeReceipt.items.map((item) => (
                        <div key={item.sku} className="flex justify-between items-center py-1">
                          <span className="text-zinc-500 flex items-center gap-1">
                            #{item.sku}:
                            <CopyButton text={item.sku} />
                          </span>
                          <span className="font-bold text-[#ff9e7d] border-b border-dashed border-[#ff7a45]/30 flex items-center gap-1 select-all">
                            {getPutawaySuggestion(item.sku)}
                            <CopyButton text={getPutawaySuggestion(item.sku)} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="font-mono text-[11px]">
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Ghi chú kiểm định QC:' : 'QC Diagnostics Remarks:'}</label>
                    <textarea
                      value={qcNotes}
                      onChange={(e) => setQcNotes(e.target.value)}
                      rows="2"
                      placeholder={isVi ? 'Nhập nhận xét tình trạng mẫu thử ngoại quan, niêm phong nhiệt...' : 'Enter inspection feedback...'}
                      className="w-full bg-zinc-950 border border-zinc-800 py-2 px-3 rounded text-zinc-300 outline-none resize-none font-sans text-xs"
                    />
                    
                    <button
                      type="button"
                      onClick={() => processQC(activeReceipt.id, qcInspections, qcNotes)}
                      className="w-full mt-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold hover:text-white transition-colors rounded uppercase cursor-pointer"
                    >
                      {isVi ? 'CẬP NHẬT KẾT QUẢ QC HÀNG MUA' : 'COMMIT QC INSPECTIONS'}
                    </button>
                  </div>
                </div>
              )}

              {/* QC Summary log if already validated */}
              {activeReceipt.qcDetails && (
                <div className="p-4 border border-zinc-850 bg-zinc-950/30 rounded font-mono text-[10px] space-y-2">
                  <p className="text-zinc-500 font-bold uppercase">{isVi ? 'Kết quả kiểm nghiệm QC' : 'QC Diagnostics Record'}</p>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{isVi ? 'Đơn vị kiểm nghiệm:' : 'Assessor ID:'}</span>
                    <span className="text-zinc-300">{activeReceipt.qcDetails.checkedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{isVi ? 'Đánh giá chung:' : 'Result Assessment:'}</span>
                    <span className={`font-bold ${activeReceipt.qcDetails.result === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {activeReceipt.qcDetails.result}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{isVi ? 'Nhận xét vận tải:' : 'QC Auditor Notes:'}</span>
                    <span className="text-zinc-300 font-sans">{activeReceipt.qcDetails.notes}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-900/60 pt-2 text-[#ff7a45]">
                    <span>{isVi ? 'Định vị Xếp hàng (Putaway):' : 'Putaway Shelving Locked:'}</span>
                    <span className="text-zinc-300 font-sans">{activeReceipt.putawayLoc || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 2: OUTGOING DELIVERIES
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'deliveries' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-zinc-100">{isVi ? 'Quy trình xuất kho bán hàng (Pick-Pack-Ship)' : 'Sales outgoing shipments (Deliveries)'}</h2>
              <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase tracking-widest mt-1">
                {isVi ? 'ĐÓNG GÓI - GIAO VẬN VÀ QUẢN LÝ LỘ TRÌNH CHIẾN LƯỢC FIFO/LIFO' : '3-STEP LOGISTICS PIPELINE WITH FIFO/LIFO ALGORITHM'}
              </p>
            </div>
            <button 
              onClick={openManualDeliveryModal}
              type="button" 
              className="px-4 py-2 bg-[#ff7a45] text-zinc-950 font-mono text-[10px] font-extrabold tracking-widest rounded uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              {isVi ? 'TẠO PHIẾU XUẤT THỦ CÔNG' : 'CREATE MANUAL DELIVERY'}
            </button>
          </div>

          {/* Search & Filter Bar for Deliveries */}
          <div className="p-4 mb-6 rounded-lg bg-[#111114] border border-[#22202a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              
              {/* Search box */}
              <div className="flex flex-col items-start relative w-full">
                <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Search className="w-3 h-3 text-[#ff7a45]/60" />
                  {isVi ? 'TÌM PHIẾU XUẤT KHO' : 'SEARCH DELIVERIES'}
                </label>
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={deliverySearch}
                    onChange={(e) => setDeliverySearch(e.target.value)}
                    placeholder={isVi ? 'MÃ PHIẾU, SO, KHÁCH HÀNG...' : 'DELIVERY ID, SO, CUSTOMER...'}
                    className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-1.5 px-3 pl-8 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none transition-all placeholder:text-zinc-500"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  {deliverySearch && (
                    <button 
                      type="button"
                      onClick={() => setDeliverySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#ff7a45] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status filter */}
              <div className="flex flex-col items-start relative w-full">
                <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Filter className="w-3 h-3 text-[#ff7a45]/60" />
                  {isVi ? 'TRẠNG THÁI PHIẾU' : 'DELIVERY STAGE'}
                </label>
                <div className="relative w-full">
                  <select 
                    value={deliveryStatusFilter}
                    onChange={(e) => setDeliveryStatusFilter(e.target.value)}
                    className="filter-select w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-1.5 px-3 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none cursor-pointer transition-all"
                  >
                    <option value="ALL">{isVi ? 'TẤT CẢ TRẠNG THÁI' : 'ALL STAGES'}</option>
                    <option value="waiting">{isVi ? 'ĐANG CHỜ TỒN (WAITING)' : 'WAITING'}</option>
                    <option value="ready">{isVi ? 'CHỜ PICK-PACK (READY)' : 'READY'}</option>
                    <option value="done">{isVi ? 'ĐÃ GIAO HÀNG (DONE)' : 'SHIPPED/DONE'}</option>
                  </select>
                </div>
              </div>

              {/* Clear button / indicator */}
              <div className="flex items-center justify-end h-[30px] font-mono text-[9px] text-zinc-500 tracking-wider w-full">
                {(deliverySearch || deliveryStatusFilter !== 'ALL') ? (
                  <button
                    onClick={() => { setDeliverySearch(''); setDeliveryStatusFilter('ALL'); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff7a45]/10 border border-[#ff7a45]/20 hover:border-[#ff7a45]/40 text-[#ff7a45] rounded uppercase font-bold tracking-widest transition-all hover:bg-[#ff7a45]/15 w-full sm:w-auto justify-center"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {isVi ? 'Đặt lại bộ lọc' : 'Reset Filters'}
                  </button>
                ) : (
                  <div className="text-zinc-500 flex items-center gap-1.5 select-none font-bold justify-end w-full">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {isVi 
                      ? `ĐANG HIỂN THỊ ${filteredDeliveries.length} PHIẾU XUẤT` 
                      : `SHOWING ${filteredDeliveries.length} DELIVERIES`}
                  </div>
                )}
              </div>

            </div>
          </div>

          <Card noPadding className="overflow-hidden bg-[#111114] border border-[#22202a]">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#22202a] text-xs font-mono tracking-widest text-[#ff9e7d]/70 uppercase font-bold bg-[#0e0e11]/30">
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'MÃ PHIẾU' : 'DELIVERY ID'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'HỢP ĐỒNG SO' : 'SOURCE SO'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'ĐỐI TÁC KHÁCH HÀNG' : 'CUSTOMER PARTNER'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'HẠN GIAO' : 'SHIP DATE'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'CHIẾN LƯỢC' : 'STRATEGY'}</th>
                    <th className="py-3 px-5 text-left font-bold">{isVi ? 'TRẠNG THÁI' : 'STAGE'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map((del) => (
                    <tr 
                      key={del.id} 
                      onClick={() => { setSelectedDeliveryId(del.id); setSelectedBox('Thùng các-tông vừa (Standard Box)'); }}
                      className="border-b border-[#1b1a20] hover:bg-zinc-900/40 cursor-pointer last:border-0"
                    >
                      <td className="py-3.5 px-5 font-mono text-xs font-bold text-zinc-300">
                        <div className="flex items-center gap-1">
                          <span>#{del.id}</span>
                          <CopyButton text={del.id} />
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-zinc-400">{del.ref}</td>
                      <td className="py-3.5 px-5 font-sans text-xs font-bold text-zinc-300">{del.partner}</td>
                      <td className="py-3.5 px-5 font-mono text-xs text-zinc-500">{del.date}</td>
                      <td className="py-3.5 px-5">
                        {/* Strategy selector dropdown inside row */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={del.strategy}
                            disabled={del.status === 'done'}
                            onChange={(e) => setStrategy(del.id, e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 py-1 px-2 text-[#ff7a45] font-mono text-[9px] rounded tracking-wider uppercase outline-none cursor-pointer disabled:opacity-50"
                          >
                            <option value="FIFO">FIFO</option>
                            <option value="LIFO">LIFO</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusPill 
                          label={del.status === 'ready' ? (isVi ? 'CHỜ PICK-PACK' : 'READY') : del.status === 'waiting' ? (isVi ? 'ĐANG CHỜ TỒN' : 'WAITING') : (isVi ? 'ĐÃ GIAO HÀNG' : 'SHIPPED')}
                          variant={del.status === 'ready' ? 'warning' : del.status === 'waiting' ? 'zinc' : 'ok'} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 2: DELIVERIES DETAILED DRAWER (3-STEP PICK-PACK-SHIP) ─── */}
      {activeTab === 'deliveries' && activeDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl h-full bg-[#0c0c0e] border-l border-zinc-800/80 flex flex-col shadow-2xl animate-fade-in">
            
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-100">
                  {isVi ? `Xử lý xuất kho 3 Bước: #${activeDelivery.id}` : `3-Step Delivery Dispatch: #${activeDelivery.id}`}
                </h3>
                <p className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1">
                  {isVi ? `KHÁCH HÀNG: ${activeDelivery.partner} // CHIẾN LƯỢC: ${activeDelivery.strategy}` : `CUSTOMER: ${activeDelivery.partner}`}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedDeliveryId(null)} className="text-zinc-500 hover:text-zinc-200 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 pb-20 space-y-6">
              {/* 3-Step Process Steps visual status */}
              <div className="grid grid-cols-3 gap-3 font-mono text-[9px] font-bold uppercase tracking-wider text-center select-none">
                <div className={`p-2 border rounded ${activeDelivery.steps.pick ? 'border-emerald-500/20 text-emerald-400 bg-emerald-950/10' : activeDelivery.status !== 'waiting' ? 'border-[#ff7a45]/30 text-[#ff7a45] bg-[#ff7a45]/5 animate-pulse' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'}`}>
                  {isVi ? 'BƯỚC 1: PICK (GOM HÀNG)' : 'STEP 1: PICK GOODS'}
                </div>
                <div className={`p-2 border rounded ${activeDelivery.steps.pack ? 'border-emerald-500/20 text-emerald-400 bg-emerald-950/10' : activeDelivery.steps.pick && !activeDelivery.steps.pack ? 'border-[#ff7a45]/30 text-[#ff7a45] bg-[#ff7a45]/5 animate-pulse' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'}`}>
                  {isVi ? 'BƯỚC 2: PACK (ĐÓNG GÓI)' : 'STEP 2: PACK & LABEL'}
                </div>
                <div className={`p-2 border rounded ${activeDelivery.steps.ship ? 'border-emerald-500/20 text-emerald-400 bg-emerald-950/10' : activeDelivery.steps.pack && !activeDelivery.steps.ship ? 'border-[#ff7a45]/30 text-[#ff7a45] bg-[#ff7a45]/5 animate-pulse' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'}`}>
                  {isVi ? 'BƯỚC 3: SHIP (BÀN GIAO)' : 'STEP 3: CONFIRM SHIP'}
                </div>
              </div>

              {/* Detailed coordinates to Pick */}
              <Card className="bg-zinc-950/60 p-4 border border-zinc-900 rounded">
                <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase mb-2">
                  {isVi ? 'Sơ đồ định vị gom hàng kệ vị trí (Pick list)' : 'Consignment Picking Shelf Blueprint'}
                </p>
                <div className="space-y-3 font-mono text-[10px]">
                  {activeDelivery.items.map((item) => {
                    const prod = products.find(p => p.sku === item.sku);
                    const traceLot = lots.find(l => l.productSku === item.sku && l.qty > 0);
                    return (
                      <div key={item.sku} className="flex justify-between items-center py-1.5 border-b border-zinc-900 last:border-0 last:pb-0">
                        <div>
                          <span className="text-zinc-500 flex items-center gap-1 font-bold">
                            #{item.sku} ({prod ? (isVi ? prod.name : (prod.nameEn || prod.name)) : ''})
                            <CopyButton text={item.sku} />
                          </span>
                          <span className="text-xs font-bold text-zinc-200 mt-1 flex items-center gap-1">
                            {isVi ? 'Lấy từ Vị trí: ' : 'Retrieve location: '}
                            <span className="text-[#ff9e7d] border-b border-dashed border-[#ff7a45]/30 font-extrabold">{prod?.location || 'WH-A/Zone A'}</span>
                            {prod?.location && <CopyButton text={prod.location} />}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-300 font-extrabold block">{item.qty} pcs</span>
                          {/* Strategic Lot allocation badge */}
                          <span className="text-[7.5px] bg-[#ff7a45]/10 border border-[#ff7a45]/20 text-[#ff7a45] px-1.5 py-0.5 rounded-sm uppercase tracking-wide flex items-center gap-1 justify-end mt-1">
                            <span>{activeDelivery.strategy} LOT: {traceLot ? traceLot.id : 'N/A'}</span>
                            {traceLot && <CopyButton text={traceLot.id} />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pick Action buttons */}
                {!activeDelivery.steps.pick && activeDelivery.status !== 'waiting' && (
                  <button
                    type="button"
                    onClick={() => processPick(activeDelivery.id)}
                    className="w-full mt-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold hover:text-white rounded uppercase text-[10px] cursor-pointer"
                  >
                    {isVi ? 'XÁC NHẬN GOM HÀNG XONG (PICKED)' : 'CONFIRM RETRIEVAL COMPLETED'}
                  </button>
                )}
              </Card>

              {/* Step 2: Pack options and label rendering */}
              {activeDelivery.steps.pick && !activeDelivery.steps.pack && (
                <Card className="bg-zinc-950/60 p-4 border border-zinc-900 rounded font-mono text-[10px]">
                  <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase mb-3">
                    {isVi ? 'Cấu hình Đóng gói & Kích thước Hòm' : 'Packaging & Labeling Controls'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 items-end mb-4">
                    <div>
                      <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Loại hòm / Hộp:' : 'Box/Container Size:'}</label>
                      <select 
                        value={selectedBox}
                        onChange={(e) => setSelectedBox(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer text-[10px]"
                      >
                        <option value="Thùng các-tông vừa (Standard Box)">Standard Cardboard Box</option>
                        <option value="Thùng gỗ Pallet (Heavy Pallet)">Heavy Wooden Pallet</option>
                        <option value="Hòm bảo ôn cách nhiệt (Thermal Case)">Thermal Envelope</option>
                      </select>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => processPack(activeDelivery.id, selectedBox)}
                      className="py-2.5 bg-[#ff7a45] text-zinc-950 font-bold hover:bg-[#ff8b5a] transition-all rounded uppercase text-[9px] tracking-wider cyber-notched-btn cursor-pointer"
                    >
                      {isVi ? 'XÁC NHẬN IN NHÃN MÃ VẠCH (PACK & LABEL)' : 'PACK & PRINT BARCODE LABEL'}
                    </button>
                  </div>
                </Card>
              )}

              {/* Glowing High Tech Barcode label rendering if PACKED! */}
              {activeDelivery.steps.pack && (
                <div className="p-4 border border-dashed border-[#ff7a45]/30 bg-[#ff7a45]/5 rounded-sm flex flex-col items-center">
                  <div className="w-full text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex justify-between border-b border-zinc-900 pb-2 mb-3">
                    <span>OMEGA TRANSPORT LABEL</span>
                    <span className="text-[#ff7a45]">READY TO DISPATCH</span>
                  </div>
                  
                  <div className="flex gap-4 items-center w-full">
                    <div className="flex-1 font-mono text-[9px] space-y-1.5 text-zinc-400">
                      <div className="flex justify-between">
                        <span>{isVi ? 'Khách nhận:' : 'Consignee:'}</span>
                        <strong className="text-zinc-200 font-sans">{activeDelivery.partner}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>{isVi ? 'Bao gói đóng:' : 'Packaging:'}</span>
                        <strong className="text-zinc-300 font-sans">{activeDelivery.shippingDetails?.boxSize || selectedBox}</strong>
                      </div>
                      <div className="flex justify-between text-[#ff7a45] font-bold">
                        <span>TRACKING ID:</span>
                        <span className="flex items-center gap-1">
                          {activeDelivery.shippingDetails?.tracking || 'TRK-99042'}
                          <CopyButton text={activeDelivery.shippingDetails?.tracking || 'TRK-99042'} />
                        </span>
                      </div>
                    </div>

                    {/* Barcode SVG simulated */}
                    <div className="bg-white p-2.5 rounded flex flex-col items-center shrink-0 border border-zinc-200 shadow-lg">
                      <Barcode className="w-16 h-10 text-zinc-900" />
                      <span className="font-mono text-[8px] font-bold text-zinc-500 mt-1 flex items-center gap-1 select-all">
                        {activeDelivery.shippingDetails?.tracking || 'TRK-99042'}
                        <CopyButton text={activeDelivery.shippingDetails?.tracking || 'TRK-99042'} />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Validate/Confirm ship action */}
              <div className="pt-6 border-t border-zinc-850">
                {activeDelivery.status === 'ready' && activeDelivery.steps.pack ? (
                  <button
                    type="button"
                    onClick={() => { processShip(activeDelivery.id); setSelectedDeliveryId(null); }}
                    className="w-full py-3 bg-[#ff7a45] text-zinc-950 font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                    {isVi ? 'XÁC NHẬN BÀN GIAO GIAO VẬN (SHIP)' : 'CONFIRM CARRIER DISPATCH (SHIP)'}
                  </button>
                ) : activeDelivery.status === 'ready' ? (
                  <div className="p-3 bg-zinc-950/60 border border-zinc-900 text-center rounded text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                    {isVi ? 'CẦN GOM HÀNG VÀ ĐÓNG GÓI GÁN NHÃN MÃ VẠCH TRƯỚC KHI XUẤT SHIP' : 'COMPLETION OF STEP 1 & 2 REQUIRED TO DISPATCH'}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-center rounded text-emerald-400 font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    {isVi ? 'HÀNG HÓA ĐÃ ĐƯỢC XUẤT KHO VÀ ĐỐI TRỪ KHỎI KỆ BẢO QUẢN THÀNH CÔNG' : 'Goods successfully deducted from shelf logs.'}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 3: INTERNAL TRANSFERS
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'transfers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left 5 Columns: Transfer Form */}
          <div className="lg:col-span-5">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-[#1b1a20] pb-3.5 mb-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                    {isVi ? 'Lập phiếu chuyển kho nội bộ' : 'Internal warehouse transfer'}
                  </h3>
                  <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                    {isVi ? 'Điều chuyển hàng hóa qua lại giữa các kho bãi' : 'Move stock instantly between sub-zones or warehouses'}
                  </p>
                </div>

                <form onSubmit={handleTransferSubmit} className="space-y-4 font-mono text-[11px] text-zinc-300">
                  
                  {/* SKU Product selection */}
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'CHỌN SẢN PHẨM DI CHUYỂN:' : 'SELECT PRODUCT SKU:'}</label>
                    {products.length === 0 ? (
                      <div className="p-2 border border-dashed border-red-500/20 bg-red-950/10 rounded text-red-400 font-sans text-xs">
                        {isVi 
                          ? 'Chưa có sản phẩm nào để di chuyển. Hãy khai báo sản phẩm ở trang Kho hàng!' 
                          : 'No products available for transfer. Please add products in the Inventory catalog first!'}
                      </div>
                    ) : (
                      <select 
                        value={transferSku}
                        onChange={(e) => setTransferSku(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer"
                      >
                        {products.map((p) => (
                          <option key={p.sku} value={p.sku}>#{p.sku} - {isVi ? p.name : (p.nameEn || p.name)} ({isVi ? 'Tồn' : 'Stock'}: {p.stock})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'SỐ LƯỢNG ĐIỀU CHUYỂN:' : 'TRANSFER QUANTITY:'}</label>
                    <input 
                      type="number" 
                      value={transferQty}
                      onChange={(e) => setTransferQty(e.target.value)}
                      required
                      min="1"
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none"
                    />
                  </div>

                  {/* Warehouses From/To */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'VỊ TRÍ HIỆN TẠI (NGUỒN):' : 'CURRENT LOCATION (SOURCE):'}</label>
                      <div className="w-full bg-zinc-950/80 border border-zinc-900 py-2 px-3 rounded text-zinc-400 text-[10px] select-all truncate font-mono" title={selectedTransferProduct?.location || ''}>
                        {(selectedTransferProduct?.location || '').split('/').slice(-2).join('/') || (isVi ? 'Chưa xác định' : 'Unknown')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'ĐẾN PHÂN KHU ĐÍCH:' : 'TO DESTINATION ZONE:'}</label>
                      <select 
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-[#ff9e7d] font-bold outline-none cursor-pointer text-[10px]"
                      >
                        <option value="WH-A/Zone A/Aisle 1/Shelf 1/Level 1">WH-A/Zone A - Thiết bị nặng</option>
                        <option value="WH-A/Zone B/Aisle 1/Shelf 2/Level 3">WH-A/Zone B - Thiết bị điện tử</option>
                        <option value="WH-A/Zone D/Aisle 1/Shelf 1/Level 1">WH-A/Zone D - Chất lỏng</option>
                        <option value="WH-B/Zone B/Aisle 2/Shelf 3/Level 2">WH-B/Zone B - Phụ kiện điện tử</option>
                        <option value="WH-C/Zone C/Aisle 1/Shelf 2/Level 1">WH-C/Zone C - Năng lượng</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#ff7a45] text-zinc-950 font-bold uppercase tracking-widest rounded transition-opacity hover:opacity-90 mt-2 cyber-notched-btn"
                  >
                    {isVi ? 'XÁC NHẬN CHUYỂN KHO HÀNG (EXECUTE)' : 'CONFIRM INTERNAL TRANSFER (EXECUTE)'}
                  </button>

                  {transferSuccess && (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-center rounded">
                      {isVi ? 'Đã thực hiện di chuyển và đồng bộ hóa vị trí cây kho thành công!' : 'Transfer successfully syncronized to database nodes!'}
                    </div>
                  )}

                </form>
              </div>
            </Card>
          </div>

          {/* Right 7 Columns: Movements History list */}
          <div className="lg:col-span-7">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-[#1b1a20] pb-3.5 mb-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                    {isVi ? 'NHẬT KÝ ĐIỀU CHUYỂN NỘI BỘ' : 'INTERNAL TRANSFERS MOVE HISTORY LOGS'}
                  </h3>
                  <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                    {isVi ? 'Mọi thao tác di chuyển hàng hóa đã xác nhận' : 'Trace logs of verified stock location re-assignments'}
                  </p>
                </div>

                <div className="space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin">
                  {internalTransfers.map((tr) => {
                    const prod = products.find(p => p.sku === tr.sku);
                    return (
                      <div 
                        key={tr.id}
                        className="p-3 border border-zinc-800 bg-zinc-950/40 rounded flex items-center justify-between font-mono text-[10px]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#ff7a45]">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-zinc-300 block">{tr.id} // SKU: {tr.sku}</span>
                            <span className="text-zinc-500 text-[9px] block mt-0.5">
                              {tr.from} <ArrowRight className="w-2.5 h-2.5 inline mx-1" /> {tr.to}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-zinc-200 block">{tr.qty} pcs</span>
                          <span className="text-[8px] text-zinc-500 block mt-0.5">{tr.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* ─── MANUAL INCOMING RECEIPT CREATION MODAL ─── */}
      {isManualReceiptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <form 
            onSubmit={handleCreateManualReceipt} 
            className="w-full max-w-md bg-[#0c0c0e] border border-zinc-800 p-6 rounded shadow-2xl space-y-4 font-mono text-[11px] text-zinc-300 max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
                  {isVi ? 'TẠO PHIẾU NHẬP KHO THỦ CÔNG' : 'CREATE MANUAL RECEIPT'}
                </h3>
                <span className="text-[8px] text-zinc-500 font-bold uppercase block mt-0.5">
                  {isVi ? 'NHẬP TRỰC TIẾP HÀNG HÓA VÀO HỆ THỐNG KHO' : 'DIRECTLY CONSIGN ITEMS INTO WAREHOUSE'}
                </span>
              </div>
              <button type="button" onClick={() => setIsManualReceiptOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                ✕
              </button>
            </div>

            {/* Supplier selection */}
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'NHÀ CUNG CẤP (SUPPLIERS):' : 'SUPPLIER PARTNER:'}</label>
              <select
                value={manualRecVendor}
                onChange={(e) => setManualRecVendor(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer text-xs"
              >
                {partners.filter(p => p.type === 'supplier').map(p => (
                  <option key={p.id} value={p.name}>{p.name} (#{p.id})</option>
                ))}
              </select>
            </div>

            {/* Product SKU Selection */}
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'CHỌN SẢN PHẨM NHẬP KHO:' : 'SELECT PRODUCT SKU:'}</label>
              {products.length === 0 ? (
                <div className="p-2 border border-dashed border-red-500/20 bg-red-950/10 rounded text-red-400 font-sans text-xs">
                  {isVi ? 'Chưa khai báo sản phẩm!' : 'No products registered!'}
                </div>
              ) : (
                <select
                  value={manualRecSku}
                  onChange={(e) => setManualRecSku(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer text-xs font-sans"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>#{p.sku} - {p.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'SỐ LƯỢNG NHẬP:' : 'QUANTITY TO RECEIVE:'}</label>
              <input
                type="number"
                value={manualRecQty}
                onChange={(e) => setManualRecQty(Math.max(1, Number(e.target.value)))}
                min="1"
                required
                className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none font-mono text-xs"
              />
            </div>

            <div className="pt-4 border-t border-zinc-850 flex gap-2.5">
              <button 
                type="submit" 
                className="flex-1 py-2.5 bg-[#ff7a45] text-zinc-950 font-bold tracking-widest uppercase rounded hover:bg-[#ff8b5a] transition-all cyber-notched-btn cursor-pointer"
              >
                {isVi ? 'KHỞI TẠO PHIẾU' : 'CREATE SLIP'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsManualReceiptOpen(false)}
                className="flex-1 py-2.5 border border-zinc-800 bg-transparent text-zinc-500 font-bold tracking-widest uppercase rounded transition-colors cursor-pointer"
              >
                {isVi ? 'HỦY BỎ' : 'CANCEL'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── MANUAL OUTGOING DELIVERY CREATION MODAL ─── */}
      {isManualDeliveryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <form 
            onSubmit={handleCreateManualDelivery} 
            className="w-full max-w-md bg-[#0c0c0e] border border-zinc-800 p-6 rounded shadow-2xl space-y-4 font-mono text-[11px] text-zinc-300 max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
                  {isVi ? 'TẠO PHIẾU XUẤT KHO THỦ CÔNG' : 'CREATE OUTGOING DELIVERY'}
                </h3>
                <span className="text-[8px] text-zinc-500 font-bold uppercase block mt-0.5">
                  {isVi ? 'XUẤT HÀNG TRỰC TIẾP RA KHỎI BÃI CHỨA' : 'DIRECTLY DISPATCH ITEMS FROM WAREHOUSE'}
                </span>
              </div>
              <button type="button" onClick={() => setIsManualDeliveryOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                ✕
              </button>
            </div>

            {/* Customer selection */}
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'KHÁCH HÀNG ĐỐI TÁC:' : 'CUSTOMER PARTNER:'}</label>
              <select
                value={manualDelCustomer}
                onChange={(e) => setManualDelCustomer(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer text-xs"
              >
                {partners.filter(p => p.type === 'customer').map(p => (
                  <option key={p.id} value={p.name}>{p.name} (#{p.id})</option>
                ))}
              </select>
            </div>

            {/* Product SKU Selection */}
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'CHỌN SẢN PHẨM XUẤT KHO:' : 'SELECT PRODUCT SKU:'}</label>
              {products.length === 0 ? (
                <div className="p-2 border border-dashed border-red-500/20 bg-red-950/10 rounded text-red-400 font-sans text-xs">
                  {isVi ? 'Chưa khai báo sản phẩm!' : 'No products registered!'}
                </div>
              ) : (
                <select
                  value={manualDelSku}
                  onChange={(e) => setManualDelSku(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer text-xs font-sans"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>#{p.sku} - {p.name} ({isVi ? 'Tồn:' : 'Stock:'} {p.stock})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Strategy Selection */}
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'CHIẾN LƯỢC XUẤT KHO (FIFO/LIFO):' : 'LOT DISPATCH STRATEGY:'}</label>
              <select
                value={manualDelStrategy}
                onChange={(e) => setManualDelStrategy(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer text-xs"
              >
                <option value="FIFO">FIFO (First-In, First-Out - Nhập trước xuất trước)</option>
                <option value="LIFO">LIFO (Last-In, First-Out - Nhập sau xuất trước)</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'SỐ LƯỢNG XUẤT:' : 'QUANTITY TO DISPATCH:'}</label>
              <input
                type="number"
                value={manualDelQty}
                onChange={(e) => setManualDelQty(Math.max(1, Number(e.target.value)))}
                min="1"
                required
                className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none font-mono text-xs"
              />
            </div>

            <div className="pt-4 border-t border-zinc-850 flex gap-2.5">
              <button 
                type="submit" 
                className="flex-1 py-2.5 bg-[#ff7a45] text-zinc-950 font-bold tracking-widest uppercase rounded hover:bg-[#ff8b5a] transition-all cyber-notched-btn cursor-pointer"
              >
                {isVi ? 'KHỞI TẠO PHIẾU' : 'CREATE SLIP'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsManualDeliveryOpen(false)}
                className="flex-1 py-2.5 border border-zinc-800 bg-transparent text-zinc-500 font-bold tracking-widest uppercase rounded transition-colors cursor-pointer"
              >
                {isVi ? 'HỦY BỎ' : 'CANCEL'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
