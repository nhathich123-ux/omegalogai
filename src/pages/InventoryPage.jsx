import { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Edit, 
  ChevronLeft, 
  Download, 
  ShoppingCart, 
  RefreshCw, 
  AlertCircle, 
  FileText, 
  Settings, 
  Layers, 
  Activity, 
  Trash, 
  X,
  MapPin,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Camera,
  Upload,
  Printer,
  Check,
  Scan,
  AlertTriangle,
  Copy,
  Search
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
import { Card, StatusPill, SegmentedStockBar, DataTable } from '../components/ui';

export default function InventoryPage() {
  const { 
    products, 
    lots, 
    locationsTree, 
    setLocationsTree,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    deleteLocationNode,
    renameLocationNode,
    lang,
    notifications,
    setNotifications
  } = useApp();

  const isVi = lang === 'vi';

  // Flat helper to extract all node options from hierarchical tree
  const getFlatLocations = (node, result = []) => {
    if (!node) return result;
    result.push({ id: node.id, name: node.name });
    if (node.children) {
      node.children.forEach(c => getFlatLocations(c, result));
    }
    return result;
  };

  // Local localized currency formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Tabs: 'products' | 'locations' | 'lots' | 'slotting'
  const [activeTab, setActiveTab] = useState('products');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // SKU Detail State
  const [selectedSku, setSelectedSku] = useState(null);

  // CRUD Forms Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' | 'edit'
  
  // SKU CRUD Form fields state
  const [formSku, setFormSku] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('HEAVY MACHINERY');
  const [formUnit, setFormUnit] = useState('cái');
  const [formCost, setFormCost] = useState(0);
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formMinStock, setFormMinStock] = useState(10);
  const [formMaxStock, setFormMaxStock] = useState(100);
  const [formLocation, setFormLocation] = useState('WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [webcamError, setWebcamError] = useState(false);

  // Warehouse tree expansion
  const [expandedNodes, setExpandedNodes] = useState({ 'root': true, 'WH-A': true });
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [newLocationParent, setNewLocationParent] = useState('');
  const [newLocationName, setNewLocationName] = useState('');
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);

  // Delete location confirmation state
  const [deleteLocationTarget, setDeleteLocationTarget] = useState(null); // { id, name, hasChildren, productCount }

  // Rename location state
  const [editLocationTarget, setEditLocationTarget] = useState(null); // { id, name }
  const [editLocationName, setEditLocationName] = useState('');

  // Search lots state
  const [lotSearchQuery, setLotSearchQuery] = useState('');

  // Barcode Slotting state variables
  const [slottingProductSku, setSlottingProductSku] = useState('');
  const [slottingLocationId, setSlottingLocationId] = useState('');
  const [slottingScanStatus, setSlottingScanStatus] = useState('idle'); // 'idle' | 'scanning' | 'success' | 'warning'
  const [slottingProgress, setSlottingProgress] = useState(0);
  const [slottingLabelProduct, setSlottingLabelProduct] = useState(null);
  const [isSlottingLabelOpen, setIsSlottingLabelOpen] = useState(false);
  const [mismatchTarget, setMismatchTarget] = useState(null); // { product, locationId }

  // ────────────────────────────────────────────────────────
  // SKU DATA FILTERING
  // ────────────────────────────────────────────────────────
  const categories = ['ALL', 'HEAVY MACHINERY', 'ELECTRONICS', 'ENERGY UNITS', 'FLUIDS'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.barcode && p.barcode.includes(searchQuery));
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeItem = products.find(p => p.sku === selectedSku);

  // Open Add Product Drawer
  const openAddDrawer = () => {
    setDrawerMode('add');
    setFormSku(`OMG-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormBarcode(Math.floor(8930000000000 + Math.random() * 999999).toString());
    setFormName('');
    setFormCategory('HEAVY MACHINERY');
    setFormUnit('cái');
    setFormCost(10);
    setFormPrice(20);
    setFormStock(0);
    setFormMinStock(10);
    setFormMaxStock(100);
    setFormLocation('WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
    setFormDescription('');
    setFormImage(null);
    setIsDrawerOpen(true);
  };

  // Open Edit Product Drawer
  const openEditDrawer = (prod) => {
    setDrawerMode('edit');
    setFormSku(prod.sku);
    setFormBarcode(prod.barcode || '');
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormUnit(prod.unit);
    setFormCost(prod.cost);
    setFormPrice(prod.price);
    setFormStock(prod.stock);
    setFormMinStock(prod.minStock);
    setFormMaxStock(prod.maxStock);
    setFormLocation(prod.location);
    setFormDescription(prod.description || '');
    setFormImage(prod.image || null);
    setIsDrawerOpen(true);
  };

  // Handle Form Submit
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productPayload = {
      sku: formSku,
      barcode: formBarcode,
      name: formName,
      nameEn: formName, // simple mapping for Vietnamese focus
      category: formCategory,
      unit: formUnit,
      cost: Number(formCost),
      price: Number(formPrice),
      stock: Number(formStock),
      minStock: Number(formMinStock),
      maxStock: Number(formMaxStock),
      location: formLocation,
      description: formDescription,
      image: formImage
    };

    if (drawerMode === 'add') {
      addProduct(productPayload);
    } else {
      updateProduct(productPayload);
    }
    setIsDrawerOpen(false);
  };

  // ────────────────────────────────────────────────────────
  // TREE VIEW COMPONENT LOGIC
  // ────────────────────────────────────────────────────────
  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Query products belonging to a tree location node (either exact matches or nested)
  const getProductsInTreeNode = (nodeId) => {
    return products.filter(p => p.location.startsWith(nodeId));
  };

  // Graphical Tree Node rendering
  const renderTreeNode = (node) => {
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedTreeNode === node.id;
    const nodeItemsCount = getProductsInTreeNode(node.id).reduce((acc, i) => acc + i.stock, 0);

    return (
      <div key={node.id} className="ml-4 font-mono select-none">
        <div 
          onClick={() => setSelectedTreeNode(node.id)}
          className={`flex items-center gap-2 py-1.5 px-3.5 rounded transition-all cursor-pointer group ${
            isSelected ? 'bg-[#ff7a45]/15 text-[#ff7a45] border-l-2 border-[#ff7a45]' : 'hover:bg-zinc-900/60 text-zinc-300'
          }`}
        >
          {hasChildren ? (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
              className="text-zinc-500 hover:text-zinc-300"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-3.5 h-3.5" />
          )}

          <Layers className="w-3.5 h-3.5 text-[#ff7a45]/60" />
          <span className="text-[11px] font-bold tracking-wide">{node.name}</span>
          <span className="text-[9px] text-zinc-500 font-normal">({node.id})</span>
          
          {nodeItemsCount > 0 && (
            <span className="ml-auto font-sans font-bold text-[8px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400">
              {nodeItemsCount} {isVi ? 'Tồn' : 'Stock'}
            </span>
          )}

          {/* Quick Add Subzone shortcut */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setNewLocationParent(node.id);
              setIsAddLocationOpen(true);
            }}
            className="hidden group-hover:block ml-2 text-[8px] text-[#ff7a45]/80 hover:text-white uppercase font-bold tracking-wider"
          >
            + CON
          </button>

          {/* Edit name shortcut (not for root) */}
          {node.id !== 'root' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditLocationTarget({ id: node.id, name: node.name });
                setEditLocationName(node.name);
              }}
              className="hidden group-hover:block ml-1 text-[8px] text-blue-400/80 hover:text-blue-300 uppercase font-bold tracking-wider"
              title={isVi ? 'Đổi tên vị trí' : 'Rename location'}
            >
              ✎
            </button>
          )}

          {/* Delete shortcut (not for root) */}
          {node.id !== 'root' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const childCount = node.children ? node.children.length : 0;
                const prodCount = getProductsInTreeNode(node.id).length;
                setDeleteLocationTarget({ id: node.id, name: node.name, hasChildren: childCount > 0, productCount: prodCount });
              }}
              className="hidden group-hover:block ml-1 text-[8px] text-red-500/80 hover:text-red-400 uppercase font-bold tracking-wider"
              title={isVi ? 'Xóa vị trí này' : 'Delete this location'}
            >
              ✕
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-zinc-800/80 ml-2.5 pl-1 mt-1 space-y-1">
            {node.children.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  // Add location helper (Recursive tree insertion)
  const addNodeToTree = (tree, parentId, newNode) => {
    if (tree.id === parentId) {
      if (!tree.children) tree.children = [];
      tree.children.push(newNode);
      return true;
    }
    if (tree.children) {
      for (let child of tree.children) {
        if (addNodeToTree(child, parentId, newNode)) return true;
      }
    }
    return false;
  };

  const handleAddLocationSubmit = (e) => {
    e.preventDefault();
    if (!newLocationName) return;
    
    const newId = `${newLocationParent}/${newLocationName.replace(/\s+/g, '')}`;
    const newNode = { id: newId, name: newLocationName, children: [] };
    
    const treeCopy = JSON.parse(JSON.stringify(locationsTree));
    addNodeToTree(treeCopy, newLocationParent, newNode);
    
    // Properly update state via setter
    setLocationsTree(treeCopy);
    setIsAddLocationOpen(false);
    setNewLocationName('');
    setExpandedNodes(prev => ({ ...prev, [newLocationParent]: true }));
  };

  // ────────────────────────────────────────────────────────
  // LOTS SEARCHING & DURATION COUNTDOWNS
  // ────────────────────────────────────────────────────────
  const filteredLots = lots.filter(lot => {
    return lot.id.toLowerCase().includes(lotSearchQuery.toLowerCase()) ||
           lot.productSku.toLowerCase().includes(lotSearchQuery.toLowerCase());
  });

  // Table Columns
  const columns = [
    { 
      key: 'sku', 
      label: 'SKU ID', 
      render: (r) => (
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs font-bold text-zinc-500">#{r.sku}</span>
          <CopyButton text={r.sku} />
        </div>
      ) 
    },
    { 
      key: 'name', 
      label: isVi ? 'TÊN SẢN PHẨM' : 'ITEM NAME', 
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0">
            {r.image ? (
              <img src={r.image} alt={r.name} className="w-full h-full object-cover animate-fade-in" />
            ) : (
              <span className="font-mono text-[7px] text-zinc-500 font-bold uppercase">SKU</span>
            )}
          </div>
          <span className="font-sans font-bold text-zinc-100">{isVi ? r.name : (r.nameEn || r.name)}</span>
        </div>
      )
    },
    { 
      key: 'category', 
      label: isVi ? 'DANH MỤC' : 'CATEGORY', 
      render: (r) => <span className="font-mono text-[9px] tracking-widest font-semibold text-zinc-400 uppercase">{isVi ? (r.categoryVi || r.category) : r.category}</span> 
    },
    { 
      key: 'stock', 
      label: isVi ? 'TỒN KHO THỰC TẾ' : 'STOCK LEVEL', 
      render: (r) => (
        <SegmentedStockBar stock={r.stock} maxStock={r.maxStock} unit={isVi ? r.unit : (r.unitEn || r.unit)} status={r.status} />
      )
    },
    { 
      key: 'status', 
      label: isVi ? 'TRẠNG THÁI' : 'STATUS', 
      render: (r) => <StatusPill label={r.stock < r.minStock ? (isVi ? 'TỒN THẤP' : 'LOW STOCK') : (isVi ? 'ĐỦ HÀNG' : 'OK')} variant={r.stock < r.minStock ? 'warning' : 'ok'} /> 
    },
    { 
      key: 'actions', 
      label: isVi ? 'THAO TÁC' : 'ACTIONS', 
      render: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => openEditDrawer(r)}
            type="button" 
            className="p-1 rounded bg-zinc-950 border border-zinc-800 text-[#ff7a45] hover:text-[#ff9e7d] transition-colors"
            title={isVi ? 'Sửa sản phẩm' : 'Edit details'}
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => deleteProduct(r.sku)}
            type="button" 
            className="p-1 rounded bg-zinc-950 border border-zinc-800 text-red-500 hover:text-red-400 transition-colors"
            title={isVi ? 'Xóa sản phẩm' : 'Delete SKU'}
          >
            <Trash className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
  ];

  const handlePerformSlotting = (productSku, locationId, force = false) => {
    const product = products.find(p => p.sku === productSku);
    if (!product) {
      setSlottingScanStatus('error');
      return;
    }

    // Check category mismatch
    const zoneMapping = {
      'Zone A': 'HEAVY MACHINERY',
      'Zone B': 'ELECTRONICS',
      'Zone C': 'ENERGY UNITS',
      'Zone D': 'FLUIDS',
      'Khu A': 'HEAVY MACHINERY',
      'Khu B': 'ELECTRONICS',
      'Khu C': 'ENERGY UNITS',
      'Khu D': 'FLUIDS'
    };

    let matchedZone = null;
    Object.keys(zoneMapping).forEach(key => {
      if (locationId.includes(key)) {
        matchedZone = zoneMapping[key];
      }
    });

    if (matchedZone && !force) {
      const prodCat = product.category;
      if (prodCat !== matchedZone) {
        setMismatchTarget({ product, locationId });
        setSlottingScanStatus('warning');
        return;
      }
    }

    setSlottingScanStatus('scanning');
    setSlottingProgress(0);

    const interval = setInterval(() => {
      setSlottingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          updateProduct({
            ...product,
            location: locationId
          });

          const title = isVi ? 'Quét liên kết kệ kho' : 'Barcode Bin Binding';
          const desc = isVi 
            ? `Thiết bị quét PDA gán sản phẩm ${product.name} (#${product.sku}) vào kệ ${locationId.split('/').pop()} (${locationId}) thành công.` 
            : `PDA scanner successfully bound product ${product.nameEn || product.name} (#${product.sku}) to shelf ${locationId.split('/').pop()} (${locationId}).`;

          const newNotif = {
            id: `NT-SLOT-${Date.now()}`,
            type: 'done',
            title,
            titleEn: 'Barcode Bin Binding',
            desc,
            descEn: desc,
            time: new Date().toTimeString().split(' ')[0]
          };

          setNotifications(prev => [newNotif, ...prev]);
          setSlottingScanStatus('success');
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in text-zinc-100">
      
      {/* ─── TABS NAVIGATION BAR ─── */}
      <div className="flex items-center gap-6 border-b border-[#1b1a20] pb-3 mb-8 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase select-none">
        <button 
          onClick={() => { setActiveTab('products'); setSelectedSku(null); }}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'products' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'DANH MỤC SKU & SẢN PHẨM' : 'SKU PRODUCTS CATALOG'}
          {activeTab === 'products' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button 
          onClick={() => { setActiveTab('locations'); setSelectedTreeNode(null); }}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'locations' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'CẤU HÌNH VỊ TRÍ KHO (MÔ HÌNH CÂY)' : 'LOCATION GRAPH (TREE MODEL)'}
          {activeTab === 'locations' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button 
          onClick={() => setActiveTab('lots')}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'lots' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'TRUY XUẤT LÔ & SỐ SÊ-RI (LOTS)' : 'LOTS & SERIAL TRACER'}
          {activeTab === 'lots' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button 
          onClick={() => {
            setActiveTab('slotting');
            // Select default product and location if empty
            if (products.length > 0 && !slottingProductSku) {
              setSlottingProductSku(products[0].sku);
            }
            const flatLocs = getFlatLocations(locationsTree).filter(l => l.id !== 'root');
            if (flatLocs.length > 0 && !slottingLocationId) {
              setSlottingLocationId(flatLocs[0].id);
            }
            setSlottingScanStatus('idle');
          }}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'slotting' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'LIÊN KẾT MÃ VẠCH (SLOTTING)' : 'BARCODE BIN BINDING'}
          {activeTab === 'slotting' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────
          TAB 1: SKU PRODUCTS LIST (WITH HUD & CRUD DRAWER)
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'products' && !selectedSku && (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-zinc-100">{isVi ? 'TỔNG QUAN DANH MỤC SẢN PHẨM' : 'INVENTORY OVERVIEW'}</h2>
              <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase tracking-widest mt-1">
                {isVi ? 'QUẢN LÝ DỮ LIỆU SẢN PHẨM - TÁI CUNG ỨNG VÀ ĐỊNH GIÁ' : 'PRODUCTS SPECIFICATIONS AND LOGISTICAL CONTROL'}
              </p>
            </div>
            <button 
              onClick={openAddDrawer}
              type="button" 
              className="px-5 py-2.5 bg-[#ff7a45] text-zinc-950 font-mono text-[10px] font-extrabold tracking-widest rounded uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              {isVi ? 'KHAI BÁO SKU MỚI' : 'ADD NEW SKU'}
            </button>
          </div>

          {/* Search, Filter Bar */}
          <div className="p-5 mb-6 rounded-lg bg-[#111114] border border-[#22202a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-end">
              
              {/* Category Filter */}
              <div className="flex flex-col items-start relative w-full">
                <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Layers className="w-3 h-3 text-[#ff7a45]/60" />
                  {isVi ? 'BỘ LỌC DANH MỤC' : 'CATEGORY FILTER'}
                </label>
                <div className="relative w-full">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="filter-select w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-2 px-3 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none cursor-pointer transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{isVi && cat === 'ALL' ? 'TẤT CẢ DANH MỤC' : cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU Search */}
              <div className="flex flex-col items-start relative w-full">
                <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                  <Search className="w-3 h-3 text-[#ff7a45]/60" />
                  {isVi ? 'TÌM TÊN / MÃ SKU' : 'SEARCH NAME / BARCODE'}
                </label>
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isVi ? 'NHẬP SKU / TÊN / BARCODE...' : 'SKU ID OR NAME...'}
                    className="w-full bg-zinc-950 border border-zinc-800/80 focus:border-[#ff7a45]/50 focus:ring-1 focus:ring-[#ff7a45]/20 py-2 px-3 pl-8 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none transition-all placeholder:text-zinc-500"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#ff7a45] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Reset/Indicator Panel */}
              <div className="flex items-center justify-end h-[34px] font-mono text-[9px] text-zinc-500 tracking-wider w-full">
                {(categoryFilter !== 'ALL' || searchQuery) ? (
                  <button
                    onClick={() => { setCategoryFilter('ALL'); setSearchQuery(''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff7a45]/10 border border-[#ff7a45]/20 hover:border-[#ff7a45]/40 text-[#ff7a45] rounded uppercase font-bold tracking-widest transition-all hover:bg-[#ff7a45]/15 w-full sm:w-auto justify-center"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {isVi ? 'ĐẶT LẠI BỘ LỌC' : 'RESET FILTERS'}
                  </button>
                ) : (
                  <div className="text-zinc-500 flex items-center gap-1.5 select-none font-bold justify-end w-full">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {isVi ? 'ĐANG HIỂN THỊ TẤT CẢ HÀNG HÓA' : 'SHOWING FULL CATALOG'}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Data Table */}
          <Card noPadding className="overflow-hidden bg-[#111114] border border-[#22202a]">
            <DataTable 
              columns={columns} 
              rows={filteredProducts} 
              rowKey="sku" 
              onRowClick={(row) => setSelectedSku(row.sku)}
            />
            
            {/* Pagination footer */}
            <div className="flex items-center justify-between border-t border-[#22202a] p-4 text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase select-none">
              <span>{isVi ? `ĐANG HIỂN THỊ 1-${filteredProducts.length} TRÊN ${products.length} BẢN GHI` : `SHOWING 1-${filteredProducts.length} OF ${products.length} RESULTS`}</span>
              <div className="flex items-center gap-1.5">
                <button type="button" className="px-2 py-1 rounded border border-zinc-800 text-zinc-500">&lt;</button>
                <button type="button" className="px-2.5 py-1 rounded border border-[#ff7a45] bg-[#ff7a45]/5 text-[#ff7a45]">1</button>
                <button type="button" className="px-2 py-1 rounded border border-zinc-800 text-zinc-500">&gt;</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── SKU DETAILED HUD OVERVIEW ─── */}
      {activeTab === 'products' && selectedSku && activeItem && (
        <div className="animate-fade-in text-zinc-100">
          
          {/* Breadcrumb Navigation Header */}
          <div className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-6">
            <span onClick={() => setSelectedSku(null)} className="cursor-pointer hover:text-[#ff7a45] transition-colors">{isVi ? 'KHO SKU' : 'INVENTORY'}</span> 
            <span>/</span> 
            <span className="text-[#ff7a45]">#{activeItem.sku}</span>
          </div>

          {/* Header Panel */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold font-sans text-zinc-100">{isVi ? activeItem.name : (activeItem.nameEn || activeItem.name)}</h2>
                <span className="px-2 py-0.5 border border-[#ff7a45]/30 bg-[#ff7a45]/5 text-[#ff7a45] text-[8px] font-mono tracking-widest font-bold rounded">
                  {isVi ? 'PHÂN ĐỘ ĐỘC QUYỀN OMEGA' : 'CRITICAL ASSET'}
                </span>
              </div>
              <p className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-2 flex flex-wrap items-center gap-1">
                <span>SKU: {activeItem.sku}</span>
                <CopyButton text={activeItem.sku} />
                <span className="mx-1">//</span>
                <span>Barcode: {activeItem.barcode}</span>
                <CopyButton text={activeItem.barcode} />
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openEditDrawer(activeItem)}
                className="px-4 py-2 border border-[#ff7a45] text-[#ff7a45] font-mono text-[10px] font-bold tracking-wider rounded uppercase hover:bg-[#ff7a45] hover:text-zinc-950 transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                {isVi ? 'CHỈNH SỬA SKU' : 'EDIT SKU'}
              </button>
              <button 
                onClick={() => setSelectedSku(null)} 
                className="px-4 py-2 border border-zinc-700 font-mono text-[10px] font-bold tracking-wider rounded uppercase hover:border-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                {isVi ? 'QUAY LẠI' : 'BACK TO LIST'}
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: visual visualizer & lots & AI predict */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Asset description & Visual box */}
              <Card className="p-4 relative bg-[#111114] border border-zinc-800">
                <p className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-3">
                  {isVi ? 'Bản vẽ Kỹ thuật / Đặc tính sản phẩm' : 'Asset Specification Visualizer'}
                </p>
                
                <div className="relative border border-zinc-950 rounded bg-[#09090b] overflow-hidden flex items-center justify-center aspect-video group">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,130,90,0.02)_0%,transparent_75%)]" />
                  {activeItem.image ? (
                    <img 
                      src={activeItem.image} 
                      alt={activeItem.name} 
                      className="h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <img 
                      src="/omega-logo.png" 
                      alt="Asset Visual" 
                      className="w-24 h-24 object-contain brightness-95 opacity-40 transition-transform duration-500 group-hover:scale-105" 
                    />
                  )}
                  <div className="absolute bottom-4 left-4 font-mono text-[8px] text-zinc-500">
                    DIAGNOSTIC CORE // SKU_VER: 1.0.4
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed mt-4 bg-zinc-950/40 p-3 rounded border border-zinc-900">
                  <strong>{isVi ? 'Mô tả chi tiết:' : 'Description:'}</strong> {activeItem.description || (isVi ? 'Chưa cấu hình mô tả chi tiết sản phẩm.' : 'No detailed description available.')}
                </p>
              </Card>

              {/* Lots tracked inside this product */}
              <Card className="bg-[#111114] border border-[#22202a]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4 pb-2 border-b border-[#1b1a20]">
                  {isVi ? 'Các Lô (Lots) lưu trữ thực tế sản phẩm này' : 'Active Lots Tracked for this Product'}
                </h3>
                
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left font-mono text-[9px] tracking-wide border-collapse">
                    <thead>
                      <tr className="border-b border-[#1b1a20] text-zinc-500 uppercase">
                        <th className="py-2 px-3 font-bold">{isVi ? 'MÃ LÔ (LOT/SN)' : 'LOT/SN ID'}</th>
                        <th className="py-2 px-3 font-bold">{isVi ? 'TỒN TRÊN KỆ' : 'SHELF QTY'}</th>
                        <th className="py-2 px-3 font-bold">{isVi ? 'HẠN SỬ DỤNG' : 'EXPIRY DATE'}</th>
                        <th className="py-2 px-3 font-bold">{isVi ? 'NGUỒN NHẬP' : 'RECEIPT SOURCE'}</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-400">
                      {lots.filter(l => l.productSku === activeItem.sku).length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-4 text-center text-zinc-600">
                            {isVi ? 'Sản phẩm này chưa được gán bất kỳ Lô hàng nào.' : 'No Lots tracked for this SKU.'}
                          </td>
                        </tr>
                      ) : (
                        lots.filter(l => l.productSku === activeItem.sku).map((lot) => (
                          <tr key={lot.id} className="border-b border-[#1b1a20]/40">
                            <td className="py-2.5 px-3 text-[#ff7a45] font-bold flex items-center gap-1">
                              {lot.id}
                              <CopyButton text={lot.id} />
                            </td>
                            <td className="py-2.5 px-3 text-zinc-200 font-extrabold">{lot.qty} {isVi ? activeItem.unit : (activeItem.unitEn || activeItem.unit)}</td>
                            <td className="py-2.5 px-3 text-zinc-300">{lot.expiry}</td>
                            <td className="py-2.5 px-3 text-zinc-500">#{lot.receiptRef}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

            </div>

            {/* Right 5 Columns: Specs, Stock Health, PO reorder triggers */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Product Stock parameters overview */}
              <Card className="bg-[#111114] border border-[#ff7a45]/30 shadow-[0_0_20px_rgba(232,130,90,0.02)]">
                <p className="font-mono text-[9px] font-bold text-zinc-500 tracking-widest uppercase">{isVi ? 'Tổng quan định lượng tồn' : 'Logistical Stock Parameters'}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="border-l-2 border-[#ff7a45] pl-4">
                    <p className="text-[28px] font-extrabold text-zinc-100 font-sans tracking-tight">
                      {activeItem.stock} <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">{isVi ? activeItem.unit : (activeItem.unitEn || activeItem.unit)}</span>
                    </p>
                    <p className="text-[9px] font-mono font-bold text-[#ff7a45] mt-1.5 uppercase tracking-widest">
                      {isVi ? 'TỒN KHO THỰC TẾ' : 'CURRENT ON HAND'}
                    </p>
                  </div>
                  <div className="border-l-2 border-zinc-800 pl-4">
                    <p className="text-[28px] font-extrabold text-zinc-500 font-sans tracking-tight">
                      {formatCurrency(activeItem.stock * activeItem.cost)}
                    </p>
                    <p className="text-[9px] font-mono font-bold text-zinc-500 mt-1.5 uppercase tracking-widest">
                      {isVi ? 'ĐỊNH GIÁ KHO' : 'VALUATION'}
                    </p>
                  </div>
                </div>

                {/* Automation Rules */}
                <div className="mt-6 pt-4 border-t border-[#1b1a20] space-y-3 font-mono text-[10px]">
                  <p className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                    {isVi ? 'QUY TẮC ĐẶT HÀNG TỰ ĐỘNG (REORDER RULES)' : 'AUTOMATION REORDERING RULES'}
                  </p>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">{isVi ? 'Mức tối thiểu (Min-Stock):' : 'Minimum Safety Margin (Min):'}</span>
                    <span className="font-bold text-[#ff7a45]">{activeItem.minStock} {isVi ? activeItem.unit : (activeItem.unitEn || activeItem.unit)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-[#1b1a20]/40">
                    <span className="text-zinc-500">{isVi ? 'Mức tối đa (Max-Stock):' : 'Maximum Cap (Max):'}</span>
                    <span className="font-bold text-zinc-200">{activeItem.maxStock} {isVi ? activeItem.unit : (activeItem.unitEn || activeItem.unit)}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded text-[9px] leading-relaxed text-zinc-400 mt-2 font-sans">
                    {isVi ? `* Nếu tồn kho rớt xuống dưới ${activeItem.minStock} cái, hệ thống sẽ tự động phát sinh một Yêu cầu báo giá đơn mua hàng nháp (Draft PO) đặt mua thêm để lượng tồn đạt mức tối đa ${activeItem.maxStock} cái.` : `* If stock falls below ${activeItem.minStock}, a draft PO will automatically buy up to ${activeItem.maxStock}.`}
                  </div>
                </div>
              </Card>

              {/* Technical Specifications */}
              <Card className="bg-[#111114] border border-[#22202a]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4 pb-2 border-b border-[#1b1a20]">
                  {isVi ? 'Thông số Tài chính & Cấu hình' : 'Financial Specs & Configuration'}
                </h3>
                
                <div className="tech-spec-grid space-y-2 font-mono text-[10px] text-zinc-300">
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                    <span className="text-zinc-500">{isVi ? 'GIÁ VỐN HÀNG HÓA:' : 'UNIT COST:'}</span>
                    <span className="font-extrabold text-zinc-200">{formatCurrency(activeItem.cost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                    <span className="text-zinc-500">{isVi ? 'GIÁ BÁN NIÊM YẾT:' : 'SALE PRICE:'}</span>
                    <span className="font-extrabold text-[#ff7a45]">{formatCurrency(activeItem.price)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
                    <span className="text-zinc-500">{isVi ? 'MÃ VẠCH (BARCODE):' : 'BARCODE EAN-13:'}</span>
                    <span className="text-zinc-400 flex items-center gap-1">
                      {activeItem.barcode}
                      <CopyButton text={activeItem.barcode} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-zinc-500">{isVi ? 'VỊ TRÍ KHO HIỆN TẠI:' : 'WAREHOUSE NODE:'}</span>
                    <span className="text-zinc-400 flex items-center gap-1 select-all truncate max-w-[200px]" title={activeItem.location}>
                      {activeItem.location.split('/').slice(-2).join('/')}
                      <CopyButton text={activeItem.location} />
                    </span>
                  </div>
                </div>
              </Card>

            </div>

          </div>

        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 2: WAREHOUSE & MULTI-LOCATION TREE VIEW
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left 5 Columns: Graphical interactive tree view */}
          <div className="lg:col-span-6">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-[#1b1a20] pb-3 mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                      {isVi ? 'Định vị phân khu trong Kho (Cấu trúc cây)' : 'Warehouses Hierarchical Tree'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                      {isVi ? 'Cây phân khu định vị vị trí sắp xếp kệ hàng' : 'Drill down to specific aisles, shelves, or levels'}
                    </p>
                  </div>
                </div>

                {/* Tree graph parent */}
                <div className="space-y-2 mt-4 bg-zinc-950/60 p-4 border border-zinc-900/60 rounded">
                  {renderTreeNode(locationsTree)}
                </div>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-500 font-mono text-[9px] rounded-sm leading-relaxed mt-4">
                {isVi ? '* Di chuột vào phân khu và chọn "+ CON" để thêm tiểu khu mới. Cấu trúc cây giúp hệ thống gợi ý Putaway Rules xếp hàng nặng tầng dưới, hàng nhẹ tầng trên tối ưu diện tích.' : '* Hover over a node and click "+ CON" to append a subzone.'}
              </div>
            </Card>
          </div>

          {/* Right 7 Columns: Items stored in selected tree node */}
          <div className="lg:col-span-6">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-[#1b1a20] pb-3 mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                      {isVi ? 'Hàng hóa nằm tại Vị trí được chọn' : 'Inventory Stored in Selected Node'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                      {selectedTreeNode 
                        ? `${isVi ? 'Đang lọc theo' : 'Filtering by'} ${selectedTreeNode}`
                        : (isVi ? 'Chọn một vị trí bên sơ đồ cây để truy vấn sản phẩm' : 'Select a partition node on the left map to query products')
                      }
                    </p>
                  </div>
                </div>

                {/* Items query listing */}
                <div className="space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin">
                  {!selectedTreeNode ? (
                    <div className="text-center py-12 text-zinc-600 font-mono text-[11px]">
                      {isVi ? 'CHƯA CHỌN PHÂN KHU KHO' : 'AWAITING NODE LOCK'}
                    </div>
                  ) : getProductsInTreeNode(selectedTreeNode).length === 0 ? (
                    <div className="text-center py-12 text-zinc-600 font-mono text-[11px]">
                      {isVi ? 'KHÔNG CÓ SKU NÀO NẰM TẠI KHU VỰC NÀY' : 'NO PRODUCTS DETECTED IN THIS LOCATION'}
                    </div>
                  ) : (
                    getProductsInTreeNode(selectedTreeNode).map((prod) => (
                      <div 
                        key={prod.sku}
                        onClick={() => { setSelectedSku(prod.sku); setActiveTab('products'); }}
                        className="p-3 border border-zinc-800 bg-zinc-950/40 rounded hover:border-[#ff7a45]/30 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-[9px] font-bold text-zinc-500 block">#{prod.sku}</span>
                          <span className="font-sans font-bold text-zinc-200 text-xs truncate block mt-0.5">{isVi ? prod.name : (prod.nameEn || prod.name)}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-extrabold text-zinc-100 block">{prod.stock} {isVi ? prod.unit : (prod.unitEn || prod.unit)}</span>
                          <span className="font-mono text-[8px] text-[#ff7a45] uppercase tracking-wider block mt-0.5">
                            {formatCurrency(prod.stock * prod.cost)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 3: LOTS & SERIAL NUMBERS TRACIBILITY
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'lots' && (
        <div>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold font-sans text-zinc-100">{isVi ? 'TRUY XUẤT NGUỒN GỐC LÔ & SỐ SÊ-RI' : 'TRACEABILITY MATRIX (LOTS / SERIAL NUMBERS)'}</h2>
            <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase tracking-widest mt-1">
              {isVi ? 'TRUY VẾT LỊCH SỬ CHUỖI CUNG ỨNG VÀ HẠN SỬ DỤNG SẢN PHẨM PHỨC TẠP' : 'END-TO-END SUPPLY CHAIN ORIGIN TRACKING'}
            </p>
          </div>

          {/* Search box */}
          <div className="flex items-center gap-4 p-4 mb-6 rounded-lg bg-[#111114] border border-[#22202a]">
            <div className="flex flex-col items-start w-full max-w-sm">
              <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{isVi ? 'TÌM KIẾM MÃ LÔ / SỐ SERIAL / MÃ SẢN PHẨM' : 'SEARCH LOT ID OR PRODUCT SKU'}</label>
              <input 
                type="text" 
                value={lotSearchQuery}
                onChange={(e) => setLotSearchQuery(e.target.value)}
                placeholder={isVi ? 'NHẬP MÃ LÔ HÀNG (LOT-XXX / SN-XXX)...' : 'ENTER LOT ID OR SKU...'}
                className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none"
              />
            </div>
          </div>

          {/* Graphical timeline tracer layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Lots data list */}
            <div className="lg:col-span-7">
              <Card noPadding className="overflow-hidden bg-[#111114] border border-[#22202a]">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[#22202a] text-xs font-mono tracking-widest text-[#ff9e7d]/70 uppercase font-bold bg-[#0e0e11]/30">
                        <th className="py-3 px-5 text-left font-bold">{isVi ? 'MÃ LÔ/SÊ-RI' : 'LOT/SN REF'}</th>
                        <th className="py-3 px-5 text-left font-bold">{isVi ? 'SẢN PHẨM' : 'PRODUCT'}</th>
                        <th className="py-3 px-5 text-left font-bold">{isVi ? 'SỐ LƯỢNG' : 'QTY'}</th>
                        <th className="py-3 px-5 text-left font-bold">{isVi ? 'HẠN SỬ DỤNG' : 'EXPIRY'}</th>
                        <th className="py-3 px-5 text-left font-bold">{isVi ? 'TRẠNG THÁI' : 'STATUS'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLots.map((lot) => {
                        const product = products.find(p => p.sku === lot.productSku);
                        const isExpired = new Date(lot.expiry) < new Date();
                        const statusLabel = lot.status === 'used' ? (isVi ? 'ĐÃ XUẤT HẾT' : 'USED') : (isExpired ? (isVi ? 'HẾT HẠN' : 'EXPIRED') : (isVi ? 'ĐANG DÙNG' : 'ACTIVE'));
                        const statusVariant = lot.status === 'used' ? 'zinc' : (isExpired ? 'alert' : 'ok');

                        return (
                          <tr key={lot.id} className="border-b border-[#1b1a20] hover:bg-zinc-900/40 cursor-pointer">
                            <td className="py-3 px-5 font-mono text-xs font-bold text-[#ff7a45]">{lot.id}</td>
                            <td className="py-3 px-5 font-sans font-bold text-zinc-100 text-xs">
                              {product ? (isVi ? product.name : (product.nameEn || product.name)) : lot.productSku}
                            </td>
                            <td className="py-3 px-5 font-mono font-extrabold text-zinc-300 text-xs">
                              {lot.qty} {product ? (isVi ? product.unit : (product.unitEn || product.unit)) : ''}
                            </td>
                            <td className="py-3 px-5 font-mono text-zinc-400 text-xs">{lot.expiry}</td>
                            <td className="py-3 px-5">
                              <StatusPill label={statusLabel} variant={statusVariant} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right 5 Columns: Graphical Trace timeline flow */}
            <div className="lg:col-span-5">
              <Card className="bg-[#111114] border border-[#22202a] p-6">
                <div className="border-b border-[#1b1a20] pb-3.5 mb-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                    {isVi ? 'Biểu đồ dòng Traceability dòng đời' : 'End-to-End Traceability Timeline'}
                  </h3>
                  <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                    {isVi ? 'Hồ sơ đường đi chi tiết của Lô hàng' : 'Auditable path of the selected serial unit'}
                  </p>
                </div>

                {/* Simulated Timeline Steps */}
                <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                  
                  {/* Step 1: Procurement Creation */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center font-mono text-[6px] text-zinc-500">1</span>
                    <h4 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                      {isVi ? 'Khởi tạo Đơn mua hàng (PO)' : 'Purchase Order Triggered'}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-sans mt-0.5">
                      {isVi ? 'Cung ứng phê duyệt đơn mua PO-2026-0142 từ nhà cung cấp.' : 'PO confirmed by procurement officer.'}
                    </p>
                  </div>

                  {/* Step 2: Quality Inspection */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-[#ff7a45] flex items-center justify-center font-mono text-[6px] text-[#ff7a45]">2</span>
                    <h4 className="font-mono text-[10px] font-bold text-zinc-200 uppercase tracking-wide">
                      {isVi ? 'Hàng nhập & Kiểm định chất lượng QC' : 'QC Inspection Pass'}
                    </h4>
                    <p className="text-[9px] text-[#ff9e7d] font-sans mt-0.5">
                      {isVi ? 'Nhận hàng, lập Lô mã vạch, QC đánh dấu PASS mẫu và đưa vào kệ.' : 'Assigned barcode lot number, marked passed, and stored.'}
                    </p>
                  </div>

                  {/* Step 3: Location Assignment */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-blue-400 flex items-center justify-center font-mono text-[6px] text-blue-400">3</span>
                    <h4 className="font-mono text-[10px] font-bold text-zinc-200 uppercase tracking-wide">
                      {isVi ? 'Sắp xếp Vị trí lưu kho (Putaway Rules)' : 'Putaway location locked'}
                    </h4>
                    <p className="text-[9px] text-zinc-300 font-sans mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>WH-A/Zone A/Aisle 1/Shelf 1/Level 1</span>
                    </p>
                  </div>

                  {/* Step 4: Dispatch / Delivery */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center font-mono text-[6px] text-zinc-600">4</span>
                    <h4 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                      {isVi ? 'Xuất kho / Giao hàng Khách hàng' : 'Dispatched to customer'}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-sans mt-0.5">
                      {isVi ? 'Bán hàng xuất kho theo chiến lược FIFO cho khách MegaRetail Corp.' : 'Deducted based on FIFO rule for sales delivery.'}
                    </p>
                  </div>

                </div>
              </Card>
            </div>

          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 4: BARCODE SLOTTING & BIN BINDING SIMULATOR
          ──────────────────────────────────────────────────────── */}
      {activeTab === 'slotting' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in text-zinc-100">
          {/* Left 6 Columns: Interactive PDA Scanner simulation */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-[#1b1a20] pb-3 mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                      {isVi ? 'Thiết bị quét mã vạch PDA (PDA Scanner)' : 'PDA Handheld Scanner Terminal'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                      {isVi ? 'Liên kết mã vạch sản phẩm vào vị trí kệ kho tương ứng' : 'Link product SKU barcodes to coordinate locations'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-[11px]">
                  {/* Select Product Dropdown */}
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Chọn sản phẩm cần liên kết (SKU):' : 'Select Product SKU:'}</label>
                    <select
                      value={slottingProductSku}
                      onChange={(e) => {
                        setSlottingProductSku(e.target.value);
                        setSlottingScanStatus('idle');
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200 outline-none focus:border-[#ff7a45] cursor-pointer"
                    >
                      {products.map(p => (
                        <option key={p.sku} value={p.sku}>
                          #{p.sku} - {isVi ? p.name : (p.nameEn || p.name)} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Location Dropdown */}
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Chọn vị trí kệ kho đích (Bin/Shelf):' : 'Select Target Storage Bin:'}</label>
                    <select
                      value={slottingLocationId}
                      onChange={(e) => {
                        setSlottingLocationId(e.target.value);
                        setSlottingScanStatus('idle');
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-200 outline-none focus:border-[#ff7a45] cursor-pointer"
                    >
                      {getFlatLocations(locationsTree).filter(l => l.id !== 'root').map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.id} ({loc.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Webcam viewport animation */}
                <div className="mt-5 relative h-48 bg-zinc-950 border border-zinc-900 rounded overflow-hidden flex flex-col items-center justify-center group">
                  {slottingScanStatus === 'scanning' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                      <div className="w-8 h-8 rounded-full border-2 border-[#ff7a45]/20 border-t-[#ff7a45] animate-spin mb-3" />
                      <span className="text-[10px] font-mono font-bold text-[#ff7a45] uppercase tracking-widest animate-pulse">
                        {isVi ? `Đang đối chiếu dữ liệu... ${slottingProgress}%` : `Verifying coordinates... ${slottingProgress}%`}
                      </span>
                    </div>
                  ) : slottingScanStatus === 'success' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/20 text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center mb-3">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        {isVi ? 'ĐÃ LIÊN KẾT THÀNH CÔNG!' : 'BINDING COMPLETED SUCCESSFULLY!'}
                      </span>
                      <p className="text-[9px] text-zinc-400 font-sans mt-1">
                        {isVi ? 'Hàng hóa đã được định vị tại kệ.' : 'Inventory balances now tied to shelf.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Laser scanner grid line */}
                      <div className="absolute left-0 right-0 h-[1.5px] bg-[#ff7a45]/60 animate-bounce top-1/2" />
                      
                      {/* Interactive Camera Target corners */}
                      <div className="w-32 h-20 border border-[#ff7a45]/30 rounded-sm relative flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff7a45]" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff7a45]" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff7a45]" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff7a45]" />
                        
                        <Scan className="w-8 h-8 text-[#ff7a45]/40 animate-pulse" />
                      </div>

                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-3">
                        {isVi ? 'Căn chỉnh mã vạch vào khung ảnh' : 'Align EAN-13 barcode inside viewfinder'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Print barcode & Bind actions */}
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const prod = products.find(p => p.sku === slottingProductSku);
                    if (prod) {
                      setSlottingLabelProduct(prod);
                      setIsSlottingLabelOpen(true);
                    }
                  }}
                  className="flex-1 py-2.5 border border-zinc-800 bg-[#0c0c0e] hover:bg-zinc-900/60 text-zinc-300 font-mono text-[9px] uppercase tracking-widest font-extrabold rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {isVi ? 'Tạo nhãn mã vạch AI' : 'Generate AI Label'}
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePerformSlotting(slottingProductSku, slottingLocationId)}
                  disabled={slottingScanStatus === 'scanning'}
                  className="flex-1 py-2.5 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-mono text-[9px] uppercase tracking-widest font-black rounded flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,122,69,0.1)] transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {isVi ? 'Quét & liên kết kệ' : 'Scan & Bind Bin'}
                </button>
              </div>
            </Card>
          </div>

          {/* Right 6 Columns: Shelf items query & Anomaly detection */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Card className="bg-[#111114] border border-[#22202a] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-[#1b1a20] pb-3 mb-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7a45]">
                    {isVi ? 'Bộ kiểm soát bất thường & Truy vấn kệ' : 'Shelf Query & Anomaly Monitor'}
                  </h3>
                  <p className="text-[10px] text-zinc-500 tracking-wide mt-0.5">
                    {isVi ? `Đang truy vấn kệ: ${slottingLocationId || '...'}` : `Active shelf coordinate: ${slottingLocationId || '...'}`}
                  </p>
                </div>

                {/* Compatibility Rules HUD */}
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded font-mono text-[10px] space-y-2 mb-4">
                  <span className="text-zinc-500 uppercase tracking-wider text-[8px] font-bold block">{isVi ? 'Phân loại Zone tương thích quy định:' : 'Allowed Category compatibility rules:'}</span>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-zinc-400">WH-A/Zone A (HCM) →</span>
                    <span className="text-zinc-200 font-bold uppercase">HEAVY MACHINERY</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] border-t border-zinc-900/60 pt-1.5">
                    <span className="text-zinc-400">WH-A/Zone B (HCM) →</span>
                    <span className="text-zinc-200 font-bold uppercase">ELECTRONICS</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] border-t border-zinc-900/60 pt-1.5">
                    <span className="text-zinc-400">WH-C/Zone C (Đà Nẵng) →</span>
                    <span className="text-zinc-200 font-bold uppercase">ENERGY UNITS</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] border-t border-zinc-900/60 pt-1.5">
                    <span className="text-zinc-400">WH-A/Zone D (HCM) →</span>
                    <span className="text-zinc-200 font-bold uppercase">FLUIDS</span>
                  </div>
                </div>

                {/* Items currently on shelf */}
                <div className="space-y-2.5">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                    {isVi ? 'Hàng hóa đang xếp ở kệ này:' : 'SKUs currently stored in this bin:'}
                  </span>
                  
                  <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                    {products.filter(p => p.location === slottingLocationId).length === 0 ? (
                      <div className="text-center py-6 text-zinc-600 font-mono text-[10px] border border-dashed border-zinc-900 rounded bg-zinc-950/20">
                        {isVi ? 'KỆ TRỐNG - CHƯA CÓ SẢN PHẨM NÀO' : 'SHELF EMPTY - NO PRODUCTS DETECTED'}
                      </div>
                    ) : (
                      products.filter(p => p.location === slottingLocationId).map(p => (
                        <div key={p.sku} className="p-2.5 border border-zinc-800 bg-zinc-950/40 rounded flex items-center justify-between font-mono text-[10px]">
                          <div>
                            <span className="text-zinc-500 font-bold">#{p.sku}</span>
                            <span className="text-zinc-200 font-sans ml-2 text-xs font-bold">{isVi ? p.name : (p.nameEn || p.name)}</span>
                          </div>
                          <span className="text-[#ff7a45] font-extrabold">{p.stock} {isVi ? p.unit : (p.unitEn || p.unit)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          PRODUCT ADD/EDIT FORM DRAWER MODAL
          ──────────────────────────────────────────────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg h-full bg-[#0c0c0e] border-l border-zinc-800/80 flex flex-col shadow-2xl animate-fade-in">
            
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-100">
                {drawerMode === 'add' ? (isVi ? 'KHAI BÁO SKU SẢN PHẨM MỚI' : 'REGISTER NEW PRODUCT SKU') : (isVi ? 'CẬP NHẬT CẤU HÌNH SẢN PHẨM' : 'EDIT PRODUCT SPECIFICATIONS')}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 pb-20">
              {/* Form elements */}
              <form onSubmit={handleSaveProduct} className="space-y-4 font-mono text-[11px] text-zinc-300">
                
                {/* SKU & Barcode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'MÃ SKU ID (DUY NHẤT):' : 'SKU ID (UNIQUE):'}</label>
                    <input 
                      type="text" 
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      required
                      disabled={drawerMode === 'edit'}
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'MÃ VẠCH (BARCODE):' : 'BARCODE EAN-13:'}</label>
                    <input 
                      type="text" 
                      value={formBarcode}
                      onChange={(e) => setFormBarcode(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'TÊN SẢN PHẨM CHI TIẾT:' : 'DETAILED PRODUCT NAME:'}</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                  />
                </div>

                {/* Category & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'DANH MỤC PHÂN PHỐI:' : 'PRODUCT CATEGORY:'}</label>
                    <select 
                      value={formCategory}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setFormCategory(newCat);
                        if (drawerMode === 'add') {
                          if (newCat === 'HEAVY MACHINERY') {
                            setFormLocation('WH-A/Zone A/Aisle 1/Shelf 1/Level 1');
                          } else if (newCat === 'ELECTRONICS') {
                            setFormLocation('WH-A/Zone B/Aisle 2/Shelf 3/Level 2');
                          } else if (newCat === 'FLUIDS') {
                            setFormLocation('WH-A/Zone D/Aisle 1/Shelf 1/Level 1');
                          } else if (newCat === 'ENERGY UNITS') {
                            setFormLocation('WH-C/Zone C/Aisle 1/Shelf 2/Level 1');
                          }
                        }
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50 cursor-pointer"
                    >
                      <option value="HEAVY MACHINERY">{isVi ? 'THIẾT BỊ HẠNG NẶNG' : 'HEAVY MACHINERY'}</option>
                      <option value="ELECTRONICS">{isVi ? 'ĐIỆN TỬ' : 'ELECTRONICS'}</option>
                      <option value="ENERGY UNITS">{isVi ? 'NĂNG LƯỢNG' : 'ENERGY UNITS'}</option>
                      <option value="FLUIDS">{isVi ? 'CHẤT LỎNG' : 'FLUIDS'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'ĐƠN VỊ TÍNH:' : 'UNIT OF MEASURE:'}</label>
                    <input 
                      type="text" 
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                      placeholder="cái, kg, lít, thùng..."
                    />
                  </div>
                </div>

                {/* Cost & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'GIÁ VỐN HÀNG MUA (USD - TỰ ĐỘNG ĐỔI VNĐ):' : 'STANDARD COST (USD - AUTO VND):'}</label>
                    <input 
                      type="number" 
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                      required
                      min="0"
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'GIÁ BÁN NIÊM YẾT (USD - TỰ ĐỘNG ĐỔI VNĐ):' : 'LIST PRICE (USD - AUTO VND):'}</label>
                    <input 
                      type="number" 
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      required
                      min="0"
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                    />
                  </div>
                </div>

                {/* Stock Initial & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'TỒN KHO BAN ĐẦU:' : 'INITIAL ON HAND:'}</label>
                    <input 
                      type="number" 
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      required
                      min="0"
                      disabled={drawerMode === 'edit'}
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'ĐỊNH VỊ KỆ KHO TREE:' : 'WAREHOUSE SHELF PATH:'}</label>
                    <select 
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 py-2 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50 cursor-pointer text-xs font-mono"
                    >
                      {getFlatLocations(locationsTree).map(loc => {
                        const depth = loc.id.split('/').length - 1;
                        const indent = '\u00A0\u00A0'.repeat(depth);
                        const label = loc.id === 'root' ? loc.name : `${loc.id.split('/').pop()} (${loc.name})`;
                        return (
                          <option key={loc.id} value={loc.id} className="bg-zinc-950 text-zinc-200 py-1 font-mono text-[11px]">
                            {indent}{label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Reordering automation rules Min/Max */}
                <div className="grid grid-cols-2 gap-4 border border-[#ff7a45]/20 p-3 bg-[#ff7a45]/5 rounded-sm">
                  <div>
                    <label className="block text-[#ff7a45] uppercase tracking-wider mb-1.5">{isVi ? 'MỨC TỒN MIN (ĐẶT HÀNG):' : 'MIN LEVEL (SAFETY):'}</label>
                    <input 
                      type="number" 
                      value={formMinStock}
                      onChange={(e) => setFormMinStock(e.target.value)}
                      required
                      min="0"
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#ff7a45] uppercase tracking-wider mb-1.5">{isVi ? 'MỨC TỒN MAX (HẠN TRÊN):' : 'MAX LEVEL (CAPACITY):'}</label>
                    <input 
                      type="number" 
                      value={formMaxStock}
                      onChange={(e) => setFormMaxStock(e.target.value)}
                      required
                      min="0"
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'MÔ TẢ SẢN PHẨM:' : 'PRODUCT DESCRIPTION:'}</label>
                  <textarea 
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows="3"
                    className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50 resize-none font-sans text-xs"
                    placeholder={isVi ? 'Nhập ghi chú kỹ thuật, hướng dẫn bảo quản...' : 'Add notes...'}
                  />
                </div>

                {/* Product Image Selection & Optical Scanner Camera */}
                <div className="space-y-2.5">
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1">{isVi ? 'HÌNH ẢNH SẢN PHẨM:' : 'PRODUCT IMAGING:'}</label>
                  
                  {formImage ? (
                    <div className="relative w-full h-32 border border-[#22202a] rounded overflow-hidden bg-zinc-950 flex items-center justify-center">
                      <img src={formImage} alt="Product" className="h-full object-contain animate-fade-in" />
                      <button 
                        type="button" 
                        onClick={() => setFormImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold font-mono text-[10px] flex items-center justify-center transition-colors cursor-pointer shadow-md"
                        title={isVi ? 'Xóa ảnh' : 'Remove image'}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <label 
                        htmlFor="prod-image-upload"
                        className="h-20 border border-dashed border-zinc-800 hover:border-[#ff7a45]/30 rounded flex flex-col items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-300 bg-zinc-950/40 cursor-pointer transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="font-mono text-[8px] uppercase tracking-widest font-bold">{isVi ? 'Tải ảnh lên' : 'Upload Image'}</span>
                      </label>
                      <input 
                        type="file" 
                        id="prod-image-upload" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setFormImage(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden" 
                      />

                      <button 
                        type="button"
                        onClick={() => {
                          setIsCameraActive(true);
                          setWebcamError(false);
                        }}
                        className="h-20 border border-dashed border-zinc-800 hover:border-[#ff7a45]/30 rounded flex flex-col items-center justify-center gap-1.5 text-zinc-500 hover:text-[#ff9e7d] bg-zinc-950/40 cursor-pointer transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span className="font-mono text-[8px] uppercase tracking-widest font-bold">{isVi ? 'Mở Camera' : 'Use Camera'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-850 flex gap-3 pb-8">
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-[#ff7a45] text-zinc-950 font-bold uppercase tracking-wider rounded transition-opacity hover:opacity-90 cyber-notched-btn cursor-pointer"
                  >
                    {isVi ? 'LƯU SKU HỆ THỐNG' : 'SAVE TO DATABASE'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 py-2.5 border border-zinc-800 bg-transparent text-zinc-400 font-bold uppercase tracking-wider rounded hover:text-white transition-colors cursor-pointer"
                  >
                    {isVi ? 'HỦY BỎ' : 'CANCEL'}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          ADD LOCATION NODE MODAL DIALOG
          ──────────────────────────────────────────────────────── */}
      {isAddLocationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#111114] border border-zinc-800 p-6 rounded-lg w-full max-w-sm max-h-[90vh] overflow-y-auto scrollbar-thin">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff7a45] mb-4 pb-2 border-b border-zinc-900">
              {isVi ? 'Khai báo Phân khu Kho con' : 'Create Sub-location Node'}
            </h3>
            <form onSubmit={handleAddLocationSubmit} className="space-y-4 font-mono text-[11px] text-zinc-300">
              <div>
                <span className="text-zinc-500 block">{isVi ? 'Vị trí cha:' : 'Parent Node:'}</span>
                <span className="text-zinc-300 text-xs font-bold block mt-1 select-all">{newLocationParent}</span>
              </div>
              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Tên phân khu (Ví dụ: Tầng 4, Kệ 3):' : 'Sub-location Name (e.g. Shelf 3, Level 4):'}</label>
                <input 
                  type="text" 
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  required
                  placeholder={isVi ? 'NHẬP TÊN TIỂU KHU...' : 'ENTER SUBZONE NAME...'}
                  className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/50"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-zinc-900">
                <button type="submit" className="flex-1 py-2 bg-[#ff7a45] text-zinc-950 font-bold uppercase tracking-wider rounded cyber-notched-btn">
                  {isVi ? 'THÊM KHU VỰC' : 'APPEND NODE'}
                </button>
                <button type="button" onClick={() => setIsAddLocationOpen(false)} className="flex-1 py-2 border border-zinc-800 bg-transparent text-zinc-500 font-bold uppercase tracking-wider rounded">
                  {isVi ? 'ĐÓNG' : 'CLOSE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          DELETE LOCATION CONFIRMATION MODAL
          ──────────────────────────────────────────────────────── */}
      {deleteLocationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#111114] border border-red-500/30 p-6 rounded-lg w-full max-w-sm shadow-[0_0_30px_rgba(239,68,68,0.05)] max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-red-500/15">
              <div className="w-8 h-8 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center">
                <Trash className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-red-400">
                {isVi ? 'Xác nhận Xóa vị trí kho' : 'Confirm Location Deletion'}
              </h3>
            </div>

            <div className="space-y-3 mb-5">
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded">
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{isVi ? 'Vị trí sẽ bị xóa:' : 'Location to delete:'}</p>
                <p className="font-mono text-xs font-bold text-zinc-200">{deleteLocationTarget.name}</p>
                <p className="font-mono text-[9px] text-zinc-500 mt-0.5 select-all">{deleteLocationTarget.id}</p>
              </div>

              {deleteLocationTarget.hasChildren && (
                <div className="p-2.5 bg-red-950/20 border border-red-500/20 rounded flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <p className="font-sans text-[10px] text-red-300 leading-relaxed">
                    {isVi
                      ? 'Vị trí này chứa các phân khu con. Tất cả phân khu con sẽ bị xóa đồng thời.'
                      : 'This location contains child zones. All sub-locations will also be removed.'}
                  </p>
                </div>
              )}

              {deleteLocationTarget.productCount > 0 && (
                <div className="p-2.5 bg-amber-950/20 border border-amber-500/20 rounded flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="font-sans text-[10px] text-amber-300 leading-relaxed">
                    {isVi
                      ? `Có ${deleteLocationTarget.productCount} sản phẩm đang được gán tại vị trí này. Sản phẩm sẽ giữ nguyên nhưng vị trí kho sẽ trở nên không hợp lệ.`
                      : `${deleteLocationTarget.productCount} product(s) are assigned to this location. Products will remain but their warehouse path will become invalid.`}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => {
                  deleteLocationNode(deleteLocationTarget.id);
                  // If the deleted node was selected, deselect it
                  if (selectedTreeNode && selectedTreeNode.startsWith(deleteLocationTarget.id)) {
                    setSelectedTreeNode(null);
                  }
                  setDeleteLocationTarget(null);
                }}
                className="flex-1 py-2.5 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 font-mono font-bold tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash className="w-3.5 h-3.5" />
                {isVi ? 'XÓA VỊ TRÍ' : 'DELETE LOCATION'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteLocationTarget(null)}
                className="flex-1 py-2.5 border border-zinc-800 bg-transparent text-zinc-400 font-mono font-bold uppercase tracking-widest text-[10px] rounded hover:text-white transition-colors cursor-pointer"
              >
                {isVi ? 'HỦY BỎ' : 'CANCEL'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          RENAME LOCATION MODAL DIALOG
          ──────────────────────────────────────────────────────── */}
      {editLocationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#111114] border border-blue-500/20 p-6 rounded-lg w-full max-w-sm shadow-[0_0_30px_rgba(59,130,246,0.05)] max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-blue-500/15">
              <div className="w-8 h-8 rounded-full bg-blue-950/40 border border-blue-500/30 flex items-center justify-center">
                <Edit className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                {isVi ? 'Chỉnh sửa tên Vị trí kho' : 'Rename Warehouse Location'}
              </h3>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editLocationName.trim() && editLocationName !== editLocationTarget.name) {
                renameLocationNode(editLocationTarget.id, editLocationName.trim());
              }
              setEditLocationTarget(null);
            }} className="space-y-4 font-mono text-[11px] text-zinc-300">
              
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded">
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{isVi ? 'Vị trí đang chỉnh sửa:' : 'Editing location:'}</p>
                <p className="font-mono text-[9px] text-zinc-500 select-all">{editLocationTarget.id}</p>
              </div>

              <div>
                <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">
                  {isVi ? 'Tên mới cho phân khu:' : 'New location name:'}
                </label>
                <input 
                  type="text" 
                  value={editLocationName}
                  onChange={(e) => setEditLocationName(e.target.value)}
                  required
                  autoFocus
                  placeholder={isVi ? 'NHẬP TÊN MỚI...' : 'ENTER NEW NAME...'}
                  className="w-full bg-zinc-950 border border-zinc-800 py-2 px-3 rounded text-zinc-200 outline-none focus:border-blue-500/50 text-xs"
                />
              </div>

              {editLocationName.trim() && editLocationName !== editLocationTarget.name && (
                <div className="p-2.5 bg-blue-950/15 border border-blue-500/15 rounded">
                  <p className="font-sans text-[10px] text-blue-300 leading-relaxed">
                    {isVi
                      ? <>Sẽ đổi <span className="font-bold text-zinc-300">"{editLocationTarget.name}"</span> thành <span className="font-bold text-blue-200">"{editLocationName.trim()}"</span>. Tất cả ID và vị trí sản phẩm liên quan sẽ được cập nhật tự động.</>
                      : <>Will rename <span className="font-bold text-zinc-300">"{editLocationTarget.name}"</span> to <span className="font-bold text-blue-200">"{editLocationName.trim()}"</span>. All child IDs and product locations will be updated automatically.</>}
                  </p>
                </div>
              )}

              <div className="flex gap-2.5 pt-3 border-t border-zinc-900">
                <button 
                  type="submit" 
                  disabled={!editLocationName.trim() || editLocationName === editLocationTarget.name}
                  className="flex-1 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 font-mono font-bold tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Edit className="w-3.5 h-3.5" />
                  {isVi ? 'LƯU TÊN MỚI' : 'SAVE CHANGES'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditLocationTarget(null)}
                  className="flex-1 py-2.5 border border-zinc-800 bg-transparent text-zinc-400 font-mono font-bold uppercase tracking-widest text-[10px] rounded hover:text-white transition-colors cursor-pointer"
                >
                  {isVi ? 'HỦY BỎ' : 'CANCEL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── FUTURISTIC WEBCAM OPTICAL SCANNER MODAL ─── */}
      {isCameraActive && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/85 backdrop-blur-xs select-none">
          <div className="bg-[#0c0c0e] border border-[#22202a] w-full max-w-sm rounded-lg p-6 overflow-hidden relative border-t-4 border-t-[#ff7a45] shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
            <button 
              onClick={() => {
                setIsCameraActive(false);
                const video = document.getElementById('omega-webcam-stream');
                if (video && video.srcObject) {
                  video.srcObject.getTracks().forEach(t => t.stop());
                }
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-bold font-mono text-sm cursor-pointer transition-colors z-50 animate-pulse"
            >
              ✕
            </button>

            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff7a45] mb-2 border-b border-[#22202a] pb-2">
              {isVi ? 'CAMERA QUÉT QUANG HỌC OMEGA' : 'OMEGA OPTICAL SCANNER'}
            </h3>
            <p className="text-[8.5px] text-zinc-500 leading-relaxed font-sans mb-4 uppercase tracking-widest">
              {isVi ? 'Nhận diện hình ảnh sản phẩm và đưa vào cơ sở dữ liệu' : 'Capture raw product image frame for catalogue log'}
            </p>

            {/* Viewfinder Area */}
            <div className="relative w-full h-56 bg-zinc-950 border border-zinc-900 rounded overflow-hidden flex items-center justify-center mb-5 group">
              
              {/* Actual HTML5 Webcam stream */}
              <video 
                id="omega-webcam-stream"
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
                style={{ display: webcamError ? 'none' : 'block' }}
              />

              {/* High-tech targeting grid overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-40 h-40 border border-[#ff7a45]/30 rounded-sm relative">
                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#ff7a45]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#ff7a45]" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#ff7a45]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#ff7a45]" />
                  
                  {/* Neon pulsing line */}
                  <div className="absolute left-0 right-0 h-[1.5px] bg-[#ff7a45]/70 animate-bounce top-1/2" />
                </div>
              </div>

              {/* Webcam state effects loader */}
              <WebcamStreamInitializer 
                onSuccess={() => setWebcamError(false)} 
                onFailure={() => setWebcamError(true)} 
                active={isCameraActive} 
              />

              {/* If Webcam access fails, display futuristic blueprint fallback scanner! */}
              {webcamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-zinc-950 text-center font-mono">
                  <div className="w-10 h-10 rounded-full border border-dashed border-[#ff7a45] flex items-center justify-center mb-3 animate-spin">
                    <Camera className="w-4 h-4 text-[#ff7a45]" />
                  </div>
                  <span className="text-[9px] font-black text-[#ff7a45] uppercase tracking-wider mb-1.5 animate-pulse">
                    {isVi ? 'QUÉT MÔ PHỎNG HOLOGRAPHIC...' : 'Awaiting manual trigger...'}
                  </span>
                  <p className="text-[8px] text-zinc-600 leading-normal max-w-xs uppercase">
                    {isVi ? 'Không phát hiện webcam vật lý hoặc quyền truy cập bị từ chối. Bấm nút bên dưới để chụp mô phỏng.' : 'Physical webcam not detected. Click below to generate mock product blueprint snapshot.'}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => {
                  setIsCameraActive(false);
                  const video = document.getElementById('omega-webcam-stream');
                  if (video && video.srcObject) {
                    video.srcObject.getTracks().forEach(t => t.stop());
                  }
                }}
                className="flex-1 py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 text-zinc-400 font-mono text-[9px] uppercase tracking-widest font-bold rounded transition-colors cursor-pointer"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  const video = document.getElementById('omega-webcam-stream');
                  if (video && video.srcObject && !webcamError) {
                    // Actual canvas snapshot capture!
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    setFormImage(canvas.toDataURL('image/jpeg'));
                    
                    // Stop stream
                    video.srcObject.getTracks().forEach(t => t.stop());
                  } else {
                    // Fallback mock category-specific high-tech blueprint Base64 image!
                    const mockBlueprintImage = getMockBlueprintImage(formCategory);
                    setFormImage(mockBlueprintImage);
                  }
                  
                  setIsCameraActive(false);
                }}
                className="flex-1 py-2 bg-[#ff7a45] hover:bg-[#ff9e7d] text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                {isVi ? 'Chụp ảnh' : 'Capture frame'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CATEGORY MISMATCH WARNING MODAL ─── */}
      {mismatchTarget && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/75 backdrop-blur-xs select-none">
          <div className="bg-[#111114] border border-amber-500/30 p-6 rounded-lg w-full max-w-sm shadow-[0_0_20px_rgba(245,158,11,0.05)]">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-amber-500/15">
              <div className="w-8 h-8 rounded-full bg-amber-950/40 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
                {isVi ? 'Phát hiện Bất thường Kệ kho (Anomaly)' : 'Storage Slotting Anomaly Warning'}
              </h3>
            </div>

            <div className="space-y-3 mb-5 font-mono text-[10px] text-zinc-300">
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded leading-relaxed space-y-1.5">
                <p>
                  <span className="text-zinc-500">{isVi ? 'Sản phẩm:' : 'Product:'}</span>{' '}
                  <span className="text-zinc-100 font-bold">{mismatchTarget.product.sku} ({isVi ? mismatchTarget.product.name : mismatchTarget.product.nameEn})</span>
                </p>
                <p>
                  <span className="text-zinc-500">{isVi ? 'Danh mục sản phẩm:' : 'Product Category:'}</span>{' '}
                  <span className="text-zinc-100 font-bold uppercase">{mismatchTarget.product.category}</span>
                </p>
                <p>
                  <span className="text-zinc-500">{isVi ? 'Kệ đích đã chọn:' : 'Target Shelf:'}</span>{' '}
                  <span className="text-zinc-100 font-bold">{mismatchTarget.locationId}</span>
                </p>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded text-amber-300 leading-relaxed font-sans text-[10px]">
                {isVi 
                  ? 'CẢNH BÁO AI: Sai kệ chứa! Bạn đang cố tình xếp một sản phẩm khác chủng loại vào phân khu được cấu hình riêng. Việc này có thể vi phạm quy định ATLD hoặc cản trước khả năng gom hàng tối ưu.'
                  : 'AI COMPATIBILITY ALERT: Slotting mismatch! You are attempting to store a product in a warehouse zone reserved for a different category. This may disrupt automated picking paths or violate warehouse regulations.'}
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => {
                  const targetSku = mismatchTarget.product.sku;
                  const targetLoc = mismatchTarget.locationId;
                  setMismatchTarget(null);
                  handlePerformSlotting(targetSku, targetLoc, true);
                }}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isVi ? 'Bỏ qua & Vẫn lưu' : 'Bypass & Bind'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMismatchTarget(null);
                  setSlottingScanStatus('idle');
                }}
                className="flex-1 py-2.5 border border-zinc-800 bg-transparent text-zinc-400 font-mono font-bold uppercase tracking-widest text-[9px] rounded hover:text-white transition-colors cursor-pointer"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── AI BARCODE LABEL MODAL ─── */}
      {isSlottingLabelOpen && slottingLabelProduct && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/80 backdrop-blur-xs select-none">
          <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-lg w-full max-w-sm shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative border-t-4 border-t-[#ff7a45]">
            <button
              onClick={() => {
                setIsSlottingLabelOpen(false);
                setSlottingLabelProduct(null);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-350 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff7a45] mb-4 pb-2 border-b border-zinc-850">
              {isVi ? 'IN NHÃN MÃ VẠCH THÔNG MINH' : 'AI SMART BARCODE LABEL'}
            </h3>

            {/* Printable Label View */}
            <div id="omega-printable-label" className="p-4 border border-zinc-800 bg-zinc-950/60 rounded text-center space-y-4 text-zinc-300 font-mono">
              <div className="border-b border-zinc-850 pb-2">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">OMEGA SMART LOGISTICS LABEL</span>
                <span className="text-xs font-sans font-bold text-zinc-150 uppercase block mt-1">
                  {isVi ? slottingLabelProduct.name : (slottingLabelProduct.nameEn || slottingLabelProduct.name)}
                </span>
              </div>

              {/* SVG EAN-13 Barcode */}
              <div className="py-2 bg-white text-zinc-950 rounded flex items-center justify-center p-2">
                {renderEan13Svg(slottingLabelProduct.barcode)}
              </div>

              {/* Extra details */}
              <div className="grid grid-cols-2 gap-2 text-left text-[8px] tracking-wider uppercase border-t border-zinc-850 pt-3">
                <div>
                  <span className="text-zinc-500 block">SKU:</span>
                  <span className="text-zinc-300 font-bold block">#{slottingLabelProduct.sku}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Category:</span>
                  <span className="text-zinc-300 font-bold block truncate">{slottingLabelProduct.category}</span>
                </div>
                <div className="col-span-2 mt-1.5">
                  <span className="text-zinc-500 block">Location Path:</span>
                  <span className="text-[#ff7a45] font-bold block select-all truncate text-[9px]">{slottingLabelProduct.location}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  const btn = document.getElementById('print-mock-btn');
                  if (btn) {
                    btn.innerText = isVi ? 'ĐANG GỬI LỆNH IN...' : 'SENDING TO PRINT...';
                    setTimeout(() => {
                      btn.innerText = isVi ? 'IN NHÃN THÀNH CÔNG!' : 'LABEL PRINTED!';
                      setTimeout(() => {
                        setIsSlottingLabelOpen(false);
                        setSlottingLabelProduct(null);
                      }, 850);
                    }, 1000);
                  }
                }}
                id="print-mock-btn"
                className="flex-1 py-2 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer"
              >
                {isVi ? 'Gửi lệnh in nhãn' : 'Send Print Command'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSlottingLabelOpen(false);
                  setSlottingLabelProduct(null);
                }}
                className="flex-1 py-2 border border-zinc-800 bg-transparent text-zinc-400 font-mono font-bold uppercase tracking-widest text-[9px] rounded hover:text-white transition-colors cursor-pointer"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ────────────────────────────────────────────────────────
// WEBCAM HARDWARE INTERACTION HELPER
// ────────────────────────────────────────────────────────
function WebcamStreamInitializer({ active, onSuccess, onFailure }) {
  useEffect(() => {
    if (!active) return;
    const video = document.getElementById('omega-webcam-stream');
    if (!video) return;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          video.srcObject = stream;
          onSuccess();
        })
        .catch(err => {
          console.warn('Webcam permission denied or unavailable:', err);
          onFailure();
        });
    } else {
      onFailure();
    }
  }, [active, onSuccess, onFailure]);

  return null;
}

// ────────────────────────────────────────────────────────
// HIGH-TECH HOLOGRAPHIC MOCK BLUEPRINT IMAGING
// ────────────────────────────────────────────────────────
const getMockBlueprintImage = (category) => {
  let color = '%23ff7a45'; // orange
  let paths = '';
  let title = 'GENERIC SKU SCAN';
  
  if (category === 'HEAVY MACHINERY') {
    color = '%23ff7a45';
    title = 'CHASSIS STRUCTURE X1';
    paths = '%3Cpath d%3D%22M20 40 h160 v120 h-160 z M40 60 h120 v80 h-120 z%22 fill%3D%22none%22 stroke%3D%22' + color + '%22 stroke-width%3D%222%22/%3E%3Cpath d%3D%22M0 100 h200 M100 0 v200%22 stroke%3D%22' + color + '%22 stroke-width%3D%220.5%22 stroke-dasharray%3D%224 4%22/%3E';
  } else if (category === 'ELECTRONICS') {
    color = '%2310b981'; // emerald
    title = 'INTEGRATED CIRCUIT V3';
    paths = '%3Crect x%3D%2250%22 y%3D%2250%22 width%3D%22100%22 height%3D%22100%22 rx%3D%2210%22 fill%3D%22none%22 stroke%3D%22' + color + '%22 stroke-width%3D%222%22/%3E%3Ccircle cx%3D%22100%22 cy%3D%22100%22 r%3D%2225%22 fill%3D%22none%22 stroke%3D%22' + color + '%22 stroke-width%3D%222%22/%3E%3Cpath d%3D%22M30 100 h40 M130 100 h40 M100 30 v40 M100 130 v40%22 stroke%3D%22' + color + '%22 stroke-width%3D%222%22/%3E';
  } else if (category === 'FLUIDS') {
    color = '%23f59e0b'; // amber
    title = 'INDUSTRIAL FLUID DENS';
    paths = '%3Cpath d%3D%22M60 160 L90 70 V30 H110 V70 L140 160 Z%22 fill%3D%22none%22 stroke%3D%22' + color + '%22 stroke-width%3D%222%22/%3E%3Ccircle cx%3D%22100%22 cy%3D%22120%22 r%3D%2215%22 fill%3D%22' + color + '%22 fill-opacity%3D%220.3%22/%3E';
  } else if (category === 'ENERGY UNITS') {
    color = '%233b82f6'; // blue
    title = 'LITHIUM CELL MATRIX';
    paths = '%3Crect x%3D%2260%22 y%3D%2240%22 width%3D%2280%22 height%3D%22130%22 rx%3D%225%22 fill%3D%22none%22 stroke%3D%22' + color + '%22 stroke-width%3D%222%22/%3E%3Cpath d%3D%22M90 20 h20 v20 h-20 z%22 fill%3D%22' + color + '%22/%3E%3Cpath d%3D%22M80 80 h40 M100 60 v40%22 stroke%3D%22' + color + '%22 stroke-width%3D%222%22/%3E';
  }
  
  const svg = '%3Csvg xmlns%3D%22http://www.w3.org/2000/svg%22 width%3D%22200%22 height%3D%22200%22 viewBox%3D%220 0 200 200%22%3E%3Crect width%3D%22200%22 height%3D%22200%22 fill%3D%22%2308080a%22/%3E' + paths + '%3Ctext x%3D%2210%22 y%3D%22190%22 font-family%3D%22monospace%22 font-size%3D%228%22 fill%3D%22' + color + '%22 font-weight%3D%22bold%22%3EOMEGA LOGISTICS // ' + title + '%3C/text%3E%3C/svg%3E';
  return 'data:image/svg+xml;utf8,' + svg;
};
/* function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
} */

const renderEan13Svg = (barcode) => {
  const bars = [];
  let x = 10;
  const barcodeStr = barcode || "8930000000000";
  for (let i = 0; i < barcodeStr.length; i++) {
    const digit = parseInt(barcodeStr[i], 10) || 0;
    const w1 = (digit % 3) + 1;
    const w2 = ((digit + 2) % 3) + 1;
    bars.push(<rect key={`b1-${i}`} x={x} y={10} width={w1} height={50} fill="black" />);
    x += w1 + 1.5;
    bars.push(<rect key={`b2-${i}`} x={x} y={10} width={w2} height={50} fill="black" />);
    x += w2 + 1.5;
  }
  return (
    <svg width="220" height="75" viewBox="0 0 220 75" className="text-zinc-900 mx-auto">
      {bars}
      <text x="110" y="70" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="black" letterSpacing="3">
        {barcodeStr}
      </text>
    </svg>
  );
};
