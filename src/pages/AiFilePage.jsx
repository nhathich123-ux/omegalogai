import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, Card } from '../components/ui';
import { 
  FileText, 
  FileUp, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  Copy, 
  Plus, 
  AlertTriangle, 
  Cpu, 
  Database, 
  Sparkles,
  ArrowRight,
  FileCheck
} from 'lucide-react';

export default function AiFilePage() {
  const { 
    lang, 
    addProduct, 
    createReceipt, 
    createDelivery, 
    createPurchaseOrder, 
    createInternalTransfer,
    products,
    partners
  } = useApp();
  
  const isVi = lang === 'vi';
  
  // State variables
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [clipboardText, setClipboardText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(-1);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [isImported, setIsImported] = useState(false);
  const [showDemoFiles, setShowDemoFiles] = useState(true);

  // File upload input ref
  const fileInputRef = useRef(null);

  // Simulated typing logs hook
  useEffect(() => {
    if (isAnalyzing && analysisResult && currentLogIndex < analysisResult.logs.length) {
      const timer = setTimeout(() => {
        setAnalysisLogs(prev => [...prev, analysisResult.logs[currentLogIndex]]);
        setCurrentLogIndex(prev => prev + 1);
      }, 400 + Math.random() * 500); // realistic typing latency
      return () => clearTimeout(timer);
    } else if (isAnalyzing && analysisResult && currentLogIndex === analysisResult.logs.length) {
      setIsAnalyzing(false);
      // Populate edited data depending on structure
      if (Array.isArray(analysisResult.data)) {
        setEditedData([...analysisResult.data]);
      } else if (analysisResult.data && Array.isArray(analysisResult.data.items)) {
        setEditedData([...analysisResult.data.items]);
      }
    }
  }, [isAnalyzing, currentLogIndex, analysisResult]);

  // Demo file definitions
  const demoFiles = [
    {
      name: 'danh_sach_san_pham_moi_cong_nghe.xlsx',
      type: '.xlsx',
      desc: isVi ? 'Khai báo các dòng sản phẩm linh kiện công nghệ mới' : 'New tech gadgets catalog listing'
    },
    {
      name: 'hoa_don_nhap_kho_FastCorp_lot9.pdf',
      type: '.pdf',
      desc: isVi ? 'Phiếu nhập lô hàng từ đối tác FastCorp' : 'Inbound purchase invoice from FastCorp'
    },
    {
      name: 'yeu_cau_xuat_kho_Lazada_v3.docx',
      type: '.docx',
      desc: isVi ? 'Yêu cầu xuất đơn vận chuyển cho sàn Lazada' : 'Outbound dispatch slip for Lazada platform'
    },
    {
      name: 'photo_kiem_ke_ke_A2.jpg',
      type: '.jpg',
      desc: isVi ? 'Ảnh chụp chụp thực tế kệ hàng A2 để kiểm kho' : 'Visual audit photo of physical rack A2'
    }
  ];

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.name.substring(file.name.lastIndexOf('.'))
    });
    setClipboardText('');
    setAnalysisResult(null);
    setAnalysisLogs([]);
    setIsImported(false);
  };

  const selectDemoFile = (file) => {
    setSelectedFile({
      name: file.name,
      size: '154 KB',
      type: file.type
    });
    setClipboardText('');
    setAnalysisResult(null);
    setAnalysisLogs([]);
    setIsImported(false);
  };

  // Main analyze function calling backend simulator
  const handleAnalyze = async () => {
    if (!selectedFile && !clipboardText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisLogs([]);
    setCurrentLogIndex(0);
    setAnalysisResult(null);
    setIsImported(false);

    try {
      const res = await fetch('/api/ai/analyze-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedFile ? selectedFile.name : 'pasted_text_manifest.txt',
          filetype: selectedFile ? selectedFile.type : '.txt',
          content: clipboardText
        })
      });

      if (res.ok) {
        const result = await res.json();
        setAnalysisResult(result);
      } else {
        // Fallback mockup if backend fails
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  // Handle value change for cell edit
  const handleCellEdit = (index, field, value) => {
    setEditedData(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Inject parsed results into AppContext global database
  const handleApplyToSystem = () => {
    if (!analysisResult) return;

    const type = analysisResult.detected_type;

    if (type === 'PRODUCT_LIST') {
      editedData.forEach(prod => {
        addProduct({
          sku: prod.sku,
          name: prod.name,
          category: prod.category || 'ELECTRONICS',
          stock: Number(prod.stock) || 0,
          location: prod.location || 'A-01-01',
          cost: Number(prod.cost) || 0,
          price: Number(prod.price) || 0,
          minStock: Number(prod.minStock) || 10,
          maxStock: Number(prod.maxStock) || 500
        });
      });
    } else if (type === 'INBOUND_RECEIPT') {
      const partner = analysisResult.data.partner || 'FastCorp Ltd';
      createReceipt({
        partner: partner,
        items: editedData.map(item => ({
          sku: item.sku,
          qty: Number(item.qty) || 50
        }))
      });
    } else if (type === 'OUTBOUND_DELIVERY') {
      const partner = analysisResult.data.partner || 'Lazada Logistics';
      createDelivery({
        partner: partner,
        items: editedData.map(item => ({
          sku: item.sku,
          qty: Number(item.qty) || 10
        }))
      });
    } else if (type === 'PURCHASE_ORDER') {
      const vendor = analysisResult.data.vendor || 'TechParts Distribution';
      createPurchaseOrder({
        vendor: vendor,
        items: editedData.map(item => ({
          sku: item.sku,
          qty: Number(item.qty) || 100
        }))
      });
    } else if (type === 'INTERNAL_TRANSFER') {
      const fromWh = analysisResult.data.fromWh || 'Kho Chính HCMC';
      const toWh = analysisResult.data.toWh || 'Kho Phụ Bình Dương';
      editedData.forEach(item => {
        createInternalTransfer(item.sku, Number(item.qty) || 10, fromWh, toWh);
      });
    }

    setIsImported(true);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-zinc-100 animate-fade-in">
      <PageHeader 
        title={isVi ? "TRÍCH XUẤT TÀI LIỆU AI" : "AI DOCUMENT PARSER"} 
        subtitle={isVi ? "Tải lên file Excel, Word, PDF hoặc Ảnh và để AI tự phân tích cấu trúc, sau đó import thẳng vào hệ thống kho." : "Upload Excel, Word, PDF, or photos. OMEGA AI extracts tabular WMS records and imports them directly."} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: UPLOAD ZONE & RAW INPUT (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#111114] border border-[#22202a]">
            <div className="flex items-center gap-3 border-b border-[#1b1a20] pb-3 mb-4">
              <FileCheck className="w-4 h-4 text-[#ff7a45]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                {isVi ? 'Tải lên Tài liệu' : 'Document Ingestion Zone'}
              </h3>
            </div>

            {/* Drag and Drop Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                dragActive 
                  ? 'border-[#ff7a45] bg-[#ff7a45]/5' 
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950/60'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.docx,.doc,.pdf,.png,.jpg,.jpeg,.csv,.txt"
                className="hidden"
              />
              <FileUp className={`w-8 h-8 ${dragActive ? 'text-[#ff7a45] animate-bounce' : 'text-zinc-500'}`} />
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-300">
                  {isVi ? 'Kéo thả file vào đây hoặc bấm để chọn' : 'Drag & drop file here or click to browse'}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide mt-1">
                  EXCEL, WORD, PDF, IMAGE, CSV (Max 10MB)
                </p>
              </div>
            </div>

            {/* Selected File Badge */}
            {selectedFile && (
              <div className="mt-4 p-3 bg-zinc-950/60 border border-zinc-900 rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-[#ff7a45]/10 flex items-center justify-center text-[#ff7a45] shrink-0 font-mono font-bold text-[10px]">
                    {selectedFile.type.toUpperCase().replace('.', '')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-300 truncate">{selectedFile.name}</p>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{selectedFile.size}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="text-[9px] font-mono font-bold tracking-wider text-red-400 hover:text-red-300 px-2 py-1 uppercase"
                >
                  {isVi ? 'Hủy' : 'Clear'}
                </button>
              </div>
            )}

            {/* Clipboard Paste Alternative */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  {isVi ? 'Hoặc dán văn bản từ Clipboard' : 'Or paste raw manifest data'}
                </span>
                {clipboardText && (
                  <button 
                    onClick={() => setClipboardText('')}
                    className="text-[9px] font-mono text-zinc-600 hover:text-zinc-400"
                  >
                    {isVi ? 'Xóa văn bản' : 'Clear text'}
                  </button>
                )}
              </div>
              <textarea
                value={clipboardText}
                onChange={(e) => {
                  setClipboardText(e.target.value);
                  setSelectedFile(null); // Clear file selection if typing
                }}
                placeholder={isVi ? "Ví dụ: nhập kho ngay SKU-OMG-9921 số lượng 120 cái..." : "Paste raw text here... e.g. Inbound SKU-OMG-9921 Qty 120"}
                className="w-full h-24 p-2.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-[10px] text-zinc-300 focus:outline-none focus:border-[#ff7a45]/50 scrollbar-thin resize-none"
              />
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleAnalyze}
              disabled={(!selectedFile && !clipboardText.trim()) || isAnalyzing}
              className={`w-full mt-4 py-3 px-4 rounded font-mono font-bold tracking-wider text-[11px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                (!selectedFile && !clipboardText.trim()) || isAnalyzing
                  ? 'bg-zinc-800/50 border border-zinc-900 text-zinc-600 cursor-not-allowed'
                  : 'bg-[#ff7a45] hover:bg-[#ff7a45]/90 border border-[#ff7a45]/30 text-white shadow-[0_0_15px_rgba(255,122,69,0.2)]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {isVi ? 'ĐANG PHÂN TÍCH TÀI LIỆU...' : 'ANALYZING DOCUMENT...'}
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isVi ? 'KHỞI CHẠY PHÂN TÍCH AI' : 'RUN AI ANALYZER'}
                </>
              )}
            </button>
          </Card>

          {/* Quick Demo Files Selector */}
          {showDemoFiles && (
            <Card className="bg-[#111114] border border-[#22202a]">
              <div className="flex items-center justify-between border-b border-[#1b1a20] pb-2 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider">
                  {isVi ? 'File mẫu để test thử' : 'Test Sandbox Demo Files'}
                </span>
                <button 
                  onClick={() => setShowDemoFiles(false)} 
                  className="text-[9px] font-mono text-zinc-600 hover:text-zinc-400 uppercase"
                >
                  {isVi ? 'Ẩn' : 'Hide'}
                </button>
              </div>
              <div className="space-y-2">
                {demoFiles.map((file, i) => (
                  <button
                    key={i}
                    onClick={() => selectDemoFile(file)}
                    className="w-full text-left p-2.5 rounded bg-zinc-950/40 hover:bg-[#ff7a45]/5 border border-zinc-900 hover:border-[#ff7a45]/20 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[10px] font-mono font-bold text-zinc-300 group-hover:text-[#ff7a45] truncate">
                        {file.name}
                      </p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 truncate">{file.desc}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-700 group-hover:text-[#ff7a45] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT PANEL: CONSOLE LOGS & TABLE PREVIEW (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Terminal Scanning Logs */}
          {(isAnalyzing || analysisLogs.length > 0) && (
            <Card className="bg-zinc-950 border border-zinc-900 font-mono text-[10px] p-4 text-emerald-500 space-y-1.5 shadow-[inset_0_0_15px_rgba(16,185,129,0.02)]">
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2 mb-2 text-zinc-500 text-[9px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5 font-bold">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  OMEGA OCR & NLP Processing Log Terminal
                </span>
                <span className="status-badge status-badge--in-stock animate-pulse">
                  {isAnalyzing ? 'ACTIVE' : 'COMPLETED'}
                </span>
              </div>
              <div className="space-y-1.5 h-44 overflow-y-auto scrollbar-thin pr-1">
                {analysisLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-emerald-700">[{i+1}]</span>
                    <span className="leading-relaxed">{log}</span>
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex items-center gap-1.5 text-emerald-400 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="animate-pulse">Analyzing matrix layout...</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Structured Output Preview Table */}
          {analysisResult && !isAnalyzing && (
            <Card className="bg-[#111114] border border-[#22202a] flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between border-b border-[#1b1a20] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff7a45] shadow-[0_0_8px_#ff7a45]" />
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                      {isVi ? 'Dữ liệu AI trích xuất được' : 'AI Extracted Structured Grid'}
                    </h3>
                    <p className="text-[9px] text-[#ff7a45] font-mono uppercase tracking-wider mt-0.5">
                      {analysisResult.summary} • Confidence: {analysisResult.confidence}%
                    </p>
                  </div>
                </div>

                {!isImported && (
                  <button
                    onClick={handleApplyToSystem}
                    className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 border border-emerald-500/20 text-white font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isVi ? 'ĐỒNG BỘ VÀO KHO' : 'APPLY & COMMIT DATA'}
                  </button>
                )}
              </div>

              {isImported ? (
                /* Success Screen */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-bold text-zinc-200">
                      {isVi ? 'Đồng bộ Dữ liệu thành công!' : 'WMS Sync Committed Successfully!'}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono tracking-wide mt-1 uppercase">
                      {isVi 
                        ? `Đã tạo / Cập nhật các bản ghi tương ứng trên cơ sở dữ liệu WMS.` 
                        : 'Updated WMS ledger with extracted document entries.'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Interactive Grid Editor Table */
                <div className="flex-1 flex flex-col">
                  <p className="text-[10px] text-zinc-500 font-sans leading-relaxed mb-4">
                    ⚠️ {isVi 
                      ? 'Ní xem qua đối soát dữ liệu bên dưới nha. Bạn có thể sửa trực tiếp số lượng, tên hoặc SKU ngay trên bảng này trước khi đồng bộ chính thức.' 
                      : 'Please verify the parsed values below. Cells are editable to allow correction before merging into the live DB.'
                    }
                  </p>

                  <div className="flex-1 overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[#22202a] text-zinc-500 text-[9px] font-mono uppercase tracking-wider">
                          <th className="pb-2 pl-1">SKU</th>
                          <th className="pb-2 pl-3">Tên sản phẩm (Product Name)</th>
                          {analysisResult.detected_type === 'PRODUCT_LIST' ? (
                            <>
                              <th className="pb-2 pl-3">Danh mục</th>
                              <th className="pb-2 pl-3">Vị trí kệ</th>
                              <th className="pb-2 pl-3 text-right">Tồn kho</th>
                            </>
                          ) : (
                            <>
                              <th className="pb-2 pl-3 text-right">Số lượng</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {editedData.map((row, idx) => (
                          <tr key={idx} className="border-b border-zinc-900/60 hover:bg-zinc-950/20 text-zinc-300 font-mono text-[10px] transition-colors">
                            <td className="py-2.5 pl-1">
                              <input 
                                type="text"
                                value={row.sku || ''}
                                onChange={(e) => handleCellEdit(idx, 'sku', e.target.value.toUpperCase())}
                                className="bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-[#ff7a45]/50 px-1 py-0.5 w-24 text-zinc-100 focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 pl-3">
                              <input 
                                type="text"
                                value={row.name || ''}
                                onChange={(e) => handleCellEdit(idx, 'name', e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-[#ff7a45]/50 px-1 py-0.5 w-full text-zinc-100 focus:outline-none truncate"
                              />
                            </td>

                            {analysisResult.detected_type === 'PRODUCT_LIST' ? (
                              <>
                                <td className="py-2.5 pl-3">
                                  <select
                                    value={row.category || 'ELECTRONICS'}
                                    onChange={(e) => handleCellEdit(idx, 'category', e.target.value)}
                                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[9px] rounded px-1 py-0.5 focus:outline-none"
                                  >
                                    <option value="ELECTRONICS">ELECTRONICS</option>
                                    <option value="HEAVY MACHINERY">HEAVY MACHINERY</option>
                                    <option value="FLUIDS">FLUIDS</option>
                                    <option value="ENERGY UNITS">ENERGY UNITS</option>
                                  </select>
                                </td>
                                <td className="py-2.5 pl-3">
                                  <input 
                                    type="text"
                                    value={row.location || ''}
                                    onChange={(e) => handleCellEdit(idx, 'location', e.target.value)}
                                    className="bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-[#ff7a45]/50 px-1 py-0.5 w-16 text-zinc-400 focus:outline-none text-center"
                                  />
                                </td>
                                <td className="py-2.5 pl-3 text-right">
                                  <input 
                                    type="number"
                                    value={row.stock === undefined ? '' : row.stock}
                                    onChange={(e) => handleCellEdit(idx, 'stock', Number(e.target.value))}
                                    className="bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-[#ff7a45]/50 px-1 py-0.5 w-16 text-zinc-100 focus:outline-none text-right"
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-2.5 pl-3 text-right">
                                  <input 
                                    type="number"
                                    value={row.qty === undefined ? '' : row.qty}
                                    onChange={(e) => handleCellEdit(idx, 'qty', Number(e.target.value))}
                                    className="bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-[#ff7a45]/50 px-1 py-0.5 w-16 text-zinc-100 focus:outline-none text-right font-extrabold"
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Context specific details */}
                  <div className="mt-4 p-3 bg-zinc-950/40 border border-zinc-900 rounded-sm flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase tracking-wider">
                      {isVi ? 'Đối tác / Bên liên quan:' : 'Associated Partner / Vendor:'}
                    </span>
                    <span className="text-[#ff7a45] font-extrabold uppercase tracking-wide">
                      {analysisResult.data.partner || analysisResult.data.vendor || (isVi ? 'Cập nhật danh mục sản phẩm' : 'WMS Core catalog')}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Welcome instructions card shown when no file is selected */}
          {!analysisResult && !isAnalyzing && (
            <Card className="bg-[#111114] border border-[#22202a] flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[400px]">
              <div className="w-12 h-12 rounded bg-[#ff7a45]/5 border border-[#ff7a45]/15 flex items-center justify-center text-[#ff7a45] animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
                  {isVi ? 'Đang đợi nạp dữ liệu tài liệu' : 'Awaiting Inbound Documents'}
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed mt-2">
                  {isVi 
                    ? 'Bạn có thể tải file hoặc sao chép văn bản thô để AI trích xuất các cột thông tin và tự động lưu vào cơ sở dữ liệu. Nhấn các file test nhanh bên góc trái để chạy thử demo của hệ thống.'
                    : 'Ingest active logistics docs or use the sandbox test files on the left to simulate LayoutLM document structural segmentation and entity extraction.'
                  }
                </p>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
