import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ─────────────────────────────────────────────
   PREMIUM HUD ORB ICON — SVG-based rotating rings
   with the custom ram-head logo at center
   ───────────────────────────────────────────── */
function HudOrbIcon({ size = 56, pulse = true }) {
  const r1 = size * 0.44;
  const r2 = size * 0.36;
  const r3 = size * 0.28;
  const cx = size / 2;
  const cy = size / 2;
  const imgSize = size * 0.52;

  return (
    <div className="sop-hud-orb" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="sop-hud-svg">
        {/* Outer glow ring */}
        <circle cx={cx} cy={cy} r={r1} className="sop-ring sop-ring--outer" />
        {/* Middle dashed ring — counter-rotate */}
        <circle cx={cx} cy={cy} r={r2} className="sop-ring sop-ring--mid" />
        {/* Inner subtle ring */}
        <circle cx={cx} cy={cy} r={r3} className="sop-ring sop-ring--inner" />
        {/* Tick marks on outer ring */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1t = cx + r1 * Math.cos(rad);
          const y1t = cy + r1 * Math.sin(rad);
          const x2t = cx + (r1 - 3) * Math.cos(rad);
          const y2t = cy + (r1 - 3) * Math.sin(rad);
          return (
            <line key={deg} x1={x1t} y1={y1t} x2={x2t} y2={y2t} className="sop-tick" />
          );
        })}
      </svg>
      {/* Central logo image */}
      <img
        src="/omega-ai-chat-icon.png"
        alt="Ω AI"
        className="sop-hud-logo"
        style={{ width: imgSize, height: imgSize }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback if image missing */}
      <div className="sop-hud-fallback" style={{ display: 'none', width: imgSize, height: imgSize }}>
        <span>Ω</span>
      </div>
      {/* Ambient pulse ring */}
      {pulse && <div className="sop-hud-pulse" />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TYPING DOTS ANIMATION
   ───────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="sop-typing">
      <span /><span /><span />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN WIDGET
   ───────────────────────────────────────────── */
export default function SopChatbotWidget() {
  const { lang, products, receipts, deliveries, purchaseOrders } = useApp();
  const isVi = lang === 'vi';
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    {
      role: 'ai',
      text: isVi
        ? 'Chào cậu nha! Chào mừng cậu gia nhập đội ngũ kho OMEGA 🚀\nTớ là Tùng, người bạn đồng hành hỗ trợ cậu. Cậu có thắc mắc gì về quy trình kho bãi, đóng gói, xe nâng, in mã vạch, hay bất kỳ thứ gì thì cứ hỏi tớ nhé. Cậu gõ viết tắt hay thiếu dấu tớ vẫn hiểu tuốt!'
        : 'Hello! Welcome to the OMEGA warehouse team 🚀\nI am Tung, your companion assistant. Feel free to ask me anything about warehouse procedures, packaging, forklifts, barcodes, or anything else.',
      source: 'SOP Core',
      ts: new Date()
    }
  ]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatLoading, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const runLocalChatbotFallback = (query) => {
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    };

    let responseText = '';
    const cleanQuery = removeAccents(query.toLowerCase());

    if (cleanQuery.includes('chao') || cleanQuery.includes('hello') || cleanQuery.includes('hi') || cleanQuery.includes('he lo') || cleanQuery.includes('yo')) {
      responseText = isVi
        ? '👋 Chào cậu nha! Tớ là Tùng đây. Cậu cần tớ hỗ trợ gì về quy trình kho bãi, đóng gói, xe nâng, hay in mã vạch không nè?'
        : '👋 Hello! I am here. How can I help you with warehouse procedures, packaging, forklifts, or barcode printers?';
    } else if (cleanQuery.includes('cam on') || cleanQuery.includes('thank')) {
      responseText = isVi
        ? '😊 Không có gì đâu nè! Chúc cậu làm việc vui vẻ nhé, có gì cần cứ nhắn tớ.'
        : '😊 You are welcome! Have a great shift, feel free to ask if you need anything.';
    } else if (cleanQuery.includes('tam biet') || cleanQuery.includes('bye')) {
      responseText = isVi
        ? '👋 Tạm biệt cậu nhé! Chúc cậu ca làm việc suôn sẻ và an toàn.'
        : '👋 Goodbye! Wish you a safe and smooth shift.';
    } else if (cleanQuery.includes('rach') || cleanQuery.includes('hong') || cleanQuery.includes('damaged') || cleanQuery.includes('mop') || cleanQuery.includes('vo') || cleanQuery.includes('be')) {
      responseText = isVi
        ? '📦 QUY TRÌNH XỬ LÝ HÀNG HỎNG/RÁCH HỘP:\n\n① Chụp ảnh hiện trạng gói hàng làm bằng chứng.\n② Lập biên bản đồng kiểm ký xác nhận với tài xế xe giao hàng.\n③ Gắn nhãn trạng thái "QC_FAIL" hoặc "HOLD" và di chuyển sản phẩm về khu vực cách ly kiểm định.\n④ Cập nhật lý do và chênh lệch trên hệ thống OMEGA WMS.'
        : '📦 DAMAGED GOODS SOP:\n\n① Take photos of the packaging damage as evidence.\n② Create a joint inspection report signed by the driver.\n③ Put a "QC_FAIL" or "HOLD" tag and move items to the quarantine area.\n④ Log discrepancies and reasons on OMEGA WMS.';
    } else if (cleanQuery.includes('fifo') || cleanQuery.includes('lifo') || cleanQuery.includes('xuat kho') || cleanQuery.includes('nhat') || cleanQuery.includes('pick')) {
      responseText = isVi
        ? '🕒 QUY TẮC FIFO (FIRST IN, FIRST OUT):\n\n• Khi xuất kho hàng hóa, hệ thống OMEGA sẽ tự động chỉ định các Lô hàng (LOT) nhập trước xuất trước.\n• Nhân viên phải lấy hàng theo đúng sơ đồ kệ chỉ định để đảm bảo xoay vòng lô hàng, tránh hết hạn sử dụng.'
        : '🕒 FIFO RULE (FIRST IN, FIRST OUT):\n\n• When outbound orders are processed, OMEGA automatically assigns the oldest LOT IDs first.\n• Staff must retrieve items from the designated coordinates to ensure inventory rotation.';
    } else if (cleanQuery.includes('nhap kho') || cleanQuery.includes('receipt') || cleanQuery.includes('ocr')) {
      responseText = isVi
        ? '🚚 QUY TRÌNH NHẬP KHO TIÊU CHUẨN:\n\n① Quét hóa đơn đầu vào bằng AI OCR để tự động điền manifest.\n② Xe tải cập cảng bốc dỡ hàng theo lịch ưu tiên của AI.\n③ Thực hiện kiểm định QC chất lượng ngẫu nhiên.\n④ Xếp hàng vào kệ (Putaway) theo chỉ dẫn vị trí tối ưu từ AI và quét mã vạch xác nhận.'
        : '🚚 STANDARD INBOUND SOP:\n\n① Scan invoices using AI OCR to auto-fill manifests.\n② Trucks unload cargo at docks according to AI schedule priority.\n③ Perform random quality QC checks.\n④ Putaway items into optimal shelf slots and scan barcode to bind.';
    } else if (cleanQuery.includes('xe nang') || cleanQuery.includes('forklift') || cleanQuery.includes('lai xe')) {
      responseText = isVi
        ? '🚜 QUY ĐỊNH XE NÂNG:\n\n• Chỉ người có chứng chỉ mới được lái xe nâng.\n• Tốc độ tối đa trong kho là 10 km/h, cua rẽ 5 km/h và phải bóp còi.\n• Hạ thấp càng nâng (15-20cm cách đất) và nghiêng về phía sau khi di chuyển.'
        : '🚜 FORKLIFT SAFETY:\n\n• Only certified operators can drive.\n• Max speed 10 km/h, 5 km/h at corners with horn.\n• Keep forks low (15-20cm) and tilt back during movement.';
    } else if (cleanQuery.includes('in tem') || cleanQuery.includes('ma vach') || cleanQuery.includes('barcode') || cleanQuery.includes('may in')) {
      responseText = isVi
        ? '🖨️ MÁY IN MÃ VẠCH:\n\n• Kiểm tra lắp decal và mực ribbon đúng chiều.\n• Mở Bartender trên máy tính, chọn mẫu tem chuẩn và in thử 1 tem trước.\n• Nếu bị lỗi nhấp nháy đỏ hoặc lệch giấy, giữ nút Feed vài giây để Calibrate.'
        : '🖨️ BARCODE PRINTER:\n\n• Load paper/ribbon correctly.\n• Open Bartender, select template, and test print 1 copy.\n• If error light blinks, hold Feed button to Calibrate.';
    } else {
      responseText = isVi
        ? '🤖 Tớ đã ghi nhận câu hỏi của cậu rồi nhe!\n\nGợi ý quy trình chuẩn SOP Kho:\n• Hãy đảm bảo quét mã vạch (Binding) chính xác vị trí kệ.\n• Mọi sự cố phát sinh cần báo bộ phận quản lý kho để lập biên bản xử lý.'
        : '🤖 I have noted your question!\n\nSOP Suggestion:\n• Always scan barcodes to bind inventory correctly.\n• Report any issues or discrepancies to the warehouse manager immediately.';
    }
    setChatHistory(prev => [...prev, { role: 'ai', text: responseText, source: 'Offline Knowledge Base', ts: new Date() }]);
  };

  const handleChatSend = async (e, directText = '') => {
    if (e) e.preventDefault();
    const query = (directText || chatInput).trim();
    if (!query) return;

    const userMsg = { role: 'user', text: query, ts: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query, 
          lang: isVi ? 'vi' : 'en',
          wms_state: {
            products: products.map(p => ({ sku: p.sku, name: p.name, stock: p.stock, location: p.location, minStock: p.minStock })),
            receipts: receipts.map(r => ({ id: r.id, partner: r.partner, status: r.status, items: r.items })),
            deliveries: deliveries.map(d => ({ id: d.id, partner: d.partner, status: d.status, items: d.items })),
            purchaseOrders: purchaseOrders.map(p => ({ id: p.id, vendor: p.vendor, status: p.status, total: p.total }))
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { role: 'ai', text: data.response, source: data.source || 'Local LLM', ts: new Date() }]);
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

  const quickActions = [
    { emoji: '🕒', label: 'FIFO', query: isVi ? 'Quy tắc xuất kho FIFO là gì?' : 'What is FIFO rule?' },
    { emoji: '📦', label: isVi ? 'Rách hộp' : 'Damaged', query: isVi ? 'Xử lý hàng bị rách hộp như thế nào?' : 'How to process damaged boxes?' },
    { emoji: '🚜', label: isVi ? 'Xe nâng' : 'Forklift', query: isVi ? 'Quy định chạy xe nâng trong kho như thế nào?' : 'What are forklift safety rules?' },
    { emoji: '🖨️', label: isVi ? 'Mã vạch' : 'Barcode', query: isVi ? 'Cách sử dụng máy in mã vạch thế nào?' : 'How to use the barcode printer?' },
  ];

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="sop-widget-root">
      {/* ════════ FLOATING ACTION BUTTON ════════ */}
      {!isOpen && (
        <button onClick={handleOpen} className="sop-fab" title={isVi ? 'Trợ lý AI SOP' : 'AI SOP Assistant'}>
          <HudOrbIcon size={48} pulse />
          <span className="sop-fab-badge" />
          <span className="sop-fab-ripple" />
        </button>
      )}

      {/* ════════ CHAT PANEL ════════ */}
      {isOpen && (
        <div className={`sop-panel ${isClosing ? 'sop-panel--closing' : 'sop-panel--opening'}`}>
          {/* Decorative corner accents */}
          <div className="sop-corner sop-corner--tl" />
          <div className="sop-corner sop-corner--tr" />
          <div className="sop-corner sop-corner--bl" />
          <div className="sop-corner sop-corner--br" />

          {/* ─── HEADER ─── */}
          <div className="sop-header">
            <div className="sop-header-left">
              <div className="sop-header-orb">
                <HudOrbIcon size={32} pulse={false} />
              </div>
              <div className="sop-header-info">
                <span className="sop-header-title">
                  {isVi ? 'OMEGA AI Assistant' : 'OMEGA AI Assistant'}
                </span>
                <div className="sop-header-status">
                  <span className="sop-status-dot" />
                  <span className="sop-status-text">SOP Knowledge Engine</span>
                </div>
              </div>
            </div>
            <div className="sop-header-actions">
              <button onClick={handleClose} className="sop-close-btn" aria-label="Close">
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ─── MESSAGES ─── */}
          <div className="sop-messages scrollbar-thin">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`sop-msg ${msg.role === 'ai' ? 'sop-msg--ai' : 'sop-msg--user'}`}>
                {msg.role === 'ai' && (
                  <div className="sop-msg-avatar">
                    <div className="sop-msg-avatar-inner">Ω</div>
                  </div>
                )}
                <div className="sop-msg-content">
                  <div className={`sop-bubble ${msg.role === 'ai' ? 'sop-bubble--ai' : 'sop-bubble--user'}`}>
                    {msg.text}
                  </div>
                  <span className="sop-msg-time">{formatTime(msg.ts)}</span>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="sop-msg sop-msg--ai">
                <div className="sop-msg-avatar">
                  <div className="sop-msg-avatar-inner sop-msg-avatar--loading">
                    <Sparkles size={10} />
                  </div>
                </div>
                <div className="sop-msg-content">
                  <div className="sop-bubble sop-bubble--ai sop-bubble--typing">
                    <TypingDots />
                    <span className="sop-typing-label">
                      {isVi ? 'Đang phân tích dữ liệu SOP...' : 'Analyzing SOP data...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ─── QUICK ACTIONS ─── */}
          <div className="sop-quick-actions">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={(e) => handleChatSend(e, qa.query)}
                className="sop-quick-btn"
              >
                <span className="sop-quick-emoji">{qa.emoji}</span>
                <span>{qa.label}</span>
              </button>
            ))}
          </div>

          {/* ─── INPUT ─── */}
          <form onSubmit={handleChatSend} className="sop-input-area">
            <div className="sop-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isVi ? 'Hỏi trợ lý AI về quy trình SOP...' : 'Ask about warehouse SOP...'}
                className="sop-input"
              />
              <button
                type="submit"
                className="sop-send-btn"
                disabled={!chatInput.trim()}
              >
                <Send size={14} strokeWidth={2.5} />
              </button>
            </div>
            <span className="sop-input-hint">
              {isVi ? 'Nhấn Enter để gửi • RAG Offline Mode' : 'Press Enter to send • RAG Offline Mode'}
            </span>
          </form>
        </div>
      )}
    </div>
  );
}
