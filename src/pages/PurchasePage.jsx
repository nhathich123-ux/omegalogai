import { useState } from 'react';
import { Plus, Check, Clock, TrendingUp, Cpu, XCircle, ShoppingBag, Search, RefreshCw, X, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, Card, TableToolbar, StatusPill, DataTable } from '../components/ui';

export default function PurchasePage() {
  const { 
    purchaseOrders, 
    products, 
    confirmPurchaseOrder, 
    createPurchaseOrder,
    reorderHistory,
    lang 
  } = useApp();

  const isVi = lang === 'vi';

  // State for manual PO Creation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('TechParts Global');
  const [selectedSku, setSelectedSku] = useState('OMG-9921');
  const [purchaseQty, setPurchaseQty] = useState(100);

  // Search & Filter state
  const [poSearch, setPoSearch] = useState('');
  const [poStatusFilter, setPoStatusFilter] = useState('ALL');

  // Formatting currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Vendors list
  const vendors = ['TechParts Global', 'SteelWorks Ltd', 'HydraFlow Inc', 'General Supplier'];

  // Manual PO submit
  const handleCreatePO = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.sku === selectedSku);
    if (!prod) return;

    const poId = `PO-2026-0${Math.floor(100 + Math.random() * 900)}`;
    const costTotal = Number(purchaseQty) * prod.cost;

    // Direct state append (Central context manages purchaseOrders)
    const newPO = {
      id: poId,
      vendor: selectedVendor,
      items: 1,
      total: costTotal,
      status: 'draft',
      expected: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    createPurchaseOrder(newPO);
    setIsModalOpen(false);
  };

  // Table Columns
  const columns = [
    { 
      key: 'id', 
      label: isVi ? 'SỐ ĐƠN (PO ID)' : 'PO NUMBER', 
      render: (r) => <span className="font-mono text-xs font-bold text-zinc-300">#{r.id}</span> 
    },
    { 
      key: 'vendor', 
      label: isVi ? 'NHÀ CUNG CẤP' : 'VENDOR PARTNER' 
    },
    { 
      key: 'items', 
      label: isVi ? 'MẶT HÀNG' : 'ITEMS COUNT',
      render: (r) => <span className="font-mono text-xs text-zinc-200">{r.items} SKUs</span>
    },
    { 
      key: 'total', 
      label: isVi ? 'TỔNG TIỀN' : 'TOTAL VALUE', 
      render: (r) => <span className="font-mono text-xs font-bold text-[#ff7a45]">{formatCurrency(r.total)}</span> 
    },
    { 
      key: 'status', 
      label: isVi ? 'TRẠNG THÁI' : 'STAGE STATUS', 
      render: (r) => <StatusPill label={r.status === 'draft' ? (isVi ? 'YÊU CẦU BÁO GIÁ' : 'RFQ/DRAFT') : r.status === 'confirmed' ? (isVi ? 'ĐÃ PHÊ DUYỆT' : 'CONFIRMED') : (isVi ? 'ĐÃ NHẬP KHO' : 'RECEIVED')} variant={r.status} /> 
    },
    { 
      key: 'expected', 
      label: isVi ? 'DỰ KIẾN NHẬN' : 'EXPECTED DATE', 
      render: (r) => <span className="font-mono text-xs text-zinc-500">{r.expected}</span>
    },
    {
      key: 'actions',
      label: isVi ? 'PHÊ DUYỆT' : 'APPROVE',
      render: (r) => (
        r.status === 'draft' ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              confirmPurchaseOrder(r.id);
            }}
            className="px-2.5 py-1 rounded bg-[#ff7a45] text-zinc-950 text-[9px] font-bold font-mono tracking-wider uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn flex items-center gap-1"
          >
            <Check className="w-2.5 h-2.5" />
            {isVi ? 'XÁC NHẬN MUA' : 'CONFIRM PO'}
          </button>
        ) : (
          <span className="text-[9px] font-mono text-zinc-600 font-bold uppercase">{isVi ? 'HOÀN THÀNH' : 'LOCKED'}</span>
        )
      )
    }
  ];

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(poSearch.toLowerCase()) ||
                          po.vendor.toLowerCase().includes(poSearch.toLowerCase());
    const matchesStatus = poStatusFilter === 'ALL' || po.status === poStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 animate-fade-in text-zinc-100">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-wide text-zinc-100">{isVi ? 'Quản lý cung ứng & mua hàng (Procurement)' : 'Purchase procurement suite'}</h2>
          <p className="font-mono text-[9px] font-bold text-[#ff7a45] uppercase tracking-widest mt-1">
            {isVi ? 'HOẠT ĐỘNG THƯƠNG LƯỢNG MUA HÀNG VÀ CHU TRÌNH TÁI CUNG ỨNG' : 'SUPPLIER PROCUREMENT FLOW AND REORDER ENGINE'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          type="button" 
          className="px-5 py-2.5 bg-[#ff7a45] text-zinc-950 font-mono text-[10px] font-extrabold tracking-widest rounded uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {isVi ? 'LẬP ĐƠN MUA HÀNG MỚI' : 'CREATE PURCHASE ORDER'}
        </button>
      </div>

      {/* Grid split: PO matrix vs Auto reorder triggers history */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        
        {/* Left 8 Columns: PO catalog list */}
        <div className="lg:col-span-8">
          {/* Search & Filter Bar for PO */}
          <div className="p-4 mb-4 rounded-lg bg-[#111114] border border-[#22202a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              
              {/* Search box */}
              <div className="flex flex-col items-start relative w-full">
                <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Search className="w-3 h-3 text-[#ff7a45]/60" />
                  {isVi ? 'TÌM KIẾM ĐƠN HÀNG (PO)' : 'SEARCH PO CATALOG'}
                </label>
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={poSearch}
                    onChange={(e) => setPoSearch(e.target.value)}
                    placeholder={isVi ? 'MÃ ĐƠN PO, NHÀ CUNG CẤP...' : 'PO NUMBER, VENDOR PARTNER...'}
                    className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-1.5 px-3 pl-8 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none transition-all placeholder:text-zinc-500"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  {poSearch && (
                    <button 
                      type="button"
                      onClick={() => setPoSearch('')}
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
                  {isVi ? 'LỌC TRẠNG THÁI PO' : 'PO STAGE FILTER'}
                </label>
                <div className="relative w-full">
                  <select 
                    value={poStatusFilter}
                    onChange={(e) => setPoStatusFilter(e.target.value)}
                    className="filter-select w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-1.5 px-3 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none cursor-pointer transition-all"
                  >
                    <option value="ALL">{isVi ? 'TẤT CẢ TRẠNG THÁI' : 'ALL STAGES'}</option>
                    <option value="draft">{isVi ? 'YÊU CẦU BÁO GIÁ (RFQ)' : 'RFQ/DRAFT'}</option>
                    <option value="confirmed">{isVi ? 'ĐÃ PHÊ DUYỆT (CONFIRMED)' : 'CONFIRMED'}</option>
                    <option value="received">{isVi ? 'ĐÃ NHẬP KHO (RECEIVED)' : 'RECEIVED'}</option>
                  </select>
                </div>
              </div>

            </div>
            
            {/* Reset / indicator row */}
            {(poSearch || poStatusFilter !== 'ALL') && (
              <div className="flex items-center justify-between border-t border-[#1b1a20]/60 mt-3 pt-3 font-mono text-[9px]">
                <span className="text-zinc-500 uppercase">
                  {isVi ? `Đã tìm thấy ${filteredPOs.length} kết quả phù hợp` : `Found ${filteredPOs.length} matching POs`}
                </span>
                <button
                  onClick={() => { setPoSearch(''); setPoStatusFilter('ALL'); }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#ff7a45]/10 border border-[#ff7a45]/20 hover:border-[#ff7a45]/40 text-[#ff7a45] rounded uppercase font-bold tracking-widest transition-all"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  {isVi ? 'Đặt lại' : 'Reset'}
                </button>
              </div>
            )}
          </div>

          <Card noPadding className="overflow-hidden bg-[#111114] border border-[#22202a]">
            <DataTable columns={columns} rows={filteredPOs} rowKey="id" />
          </Card>
        </div>

        {/* Right 4 Columns: Auto Reorder trigger history logs */}
        <div className="lg:col-span-4">
          <Card className="bg-[#111114] border border-[#22202a] p-6 h-full flex flex-col justify-between">
            <div>
              <div className="border-b border-[#1b1a20] pb-3.5 mb-5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                  {isVi ? 'Nhật ký Kích hoạt Quy tắc Tái cung ứng' : 'Reordering Automation Log'}
                </h3>
                <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                  {isVi ? 'Các lệnh mua hàng nháp được tạo bởi máy chủ' : 'Automatic PO triggers when stock < safety level'}
                </p>
              </div>

              {/* Log items */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto scrollbar-thin">
                {reorderHistory.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 font-mono text-[10px]">
                    {isVi ? 'CHƯA CÓ LỆNH KÍCH HOẠT NÀO' : 'NO TRIGGER LOGS YET'}
                  </div>
                ) : (
                  reorderHistory.map((log) => (
                    <div 
                      key={log.id}
                      className="p-3 border border-zinc-800 bg-zinc-950/40 rounded font-mono text-[9px] space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-[#ff7a45] font-bold uppercase">
                        <span>RULE MATCH: #{log.sku}</span>
                        <span>{log.poId}</span>
                      </div>
                      
                      <p className="text-zinc-300 font-sans text-[10px] leading-relaxed">
                        {isVi 
                          ? `Tồn thực tế (${log.current}) rớt dưới Min (${log.min}). Tự động kích hoạt Đơn nháp đặt mua +${log.orderedQty} cái.`
                          : `Stock (${log.current}) dropped below Min (${log.min}). Spawned draft PO for +${log.orderedQty} units.`
                        }
                      </p>

                      <div className="flex justify-between text-zinc-500 text-[8px]">
                        <span>ID: {log.id}</span>
                        <span>{log.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-500 font-mono text-[8.5px] rounded-sm leading-relaxed mt-4">
              {isVi ? '* Khi bạn duyệt xác nhận (CONFIRM PO) một đơn nháp mua hàng, hệ thống sẽ tự động phát sinh phiếu "Chờ nhận hàng" (Incoming Receipt) tương ứng bên Vận hành kèm theo danh mục QC.' : '* Confirming a PO automatically generates the corresponding Incoming Receipt slip.'}
            </div>
          </Card>
        </div>

      </div>

      {/* ─── MANUAL PURCHASE ORDER MODAL FORM ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#111114] border border-zinc-800 p-6 rounded-lg w-full max-w-sm">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff7a45]">
                {isVi ? 'Lập Đơn Mua Hàng Mới' : 'Create Purchase Order'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePO} className="space-y-4 font-mono text-[11px] text-zinc-300">
              
              {/* Vendor select */}
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Nhà cung cấp đối tác:' : 'Select Vendor Partner:'}</label>
                <select 
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer"
                >
                  {vendors.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* SKU select */}
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Chọn sản phẩm thu mua:' : 'Select Product SKU:'}</label>
                {products.length === 0 ? (
                  <div className="p-2 border border-dashed border-red-500/20 bg-red-950/10 rounded text-red-400 font-sans text-xs">
                    {isVi 
                      ? 'Không có sản phẩm nào trong danh mục. Hãy thêm sản phẩm ở trang Kho hàng trước!' 
                      : 'No products in inventory. Please add products in the Inventory catalog first!'}
                  </div>
                ) : (
                  <select 
                    value={selectedSku}
                    onChange={(e) => setSelectedSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none cursor-pointer EAN-13"
                  >
                    {products.map((p) => (
                      <option key={p.sku} value={p.sku}>#{p.sku} - {isVi ? p.name : (p.nameEn || p.name)}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Số lượng mua:' : 'Purchase Quantity:'}</label>
                <input 
                  type="number" 
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(e.target.value)}
                  required
                  min="1"
                  className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-zinc-900">
                <button type="submit" className="flex-1 py-2.5 bg-[#ff7a45] text-zinc-950 font-bold uppercase tracking-wider rounded cyber-notched-btn">
                  {isVi ? 'TẠO ĐƠN MUA HÀNG' : 'SUBMIT PO'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-zinc-800 bg-transparent text-zinc-500 font-bold uppercase tracking-wider rounded">
                  {isVi ? 'ĐÓNG' : 'CLOSE'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
