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
  const { 
    lang, products, receipts, deliveries, purchaseOrders, currentUser,
    addProduct, createReceipt, createDelivery, createInternalTransfer, createPurchaseOrder 
  } = useApp();
  const isVi = lang === 'vi';
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const [lastMessageText, setLastMessageText] = useState('');
  const [spamCount, setSpamCount] = useState(0);
  const [pendingAction, setPendingAction] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const showLocalToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const [chatHistory, setChatHistory] = useState(() => {
    const isVi = lang === 'vi';
    const stored = localStorage.getItem('omega-chat-profile');
    let userRef = 'cậu';
    let botRef = 'tớ';
    if (stored) {
      try {
        const prof = JSON.parse(stored);
        userRef = prof.userRef || 'cậu';
        botRef = prof.botRef || 'tớ';
      } catch (e) {}
    }
    return [
      {
        role: 'ai',
        text: isVi
          ? `Chào ${userRef} nha! Chào mừng ${userRef} gia nhập đội ngũ kho OMEGA 🚀\n${botRef.charAt(0).toUpperCase() + botRef.slice(1)} là Tùng, người bạn đồng hành hỗ trợ ${userRef}. ${userRef.charAt(0).toUpperCase() + userRef.slice(1)} có thắc mắc gì về quy trình kho bãi, đóng gói, xe nâng, in mã vạch, hay bất kỳ thứ gì thì cứ hỏi ${botRef} nhé. ${userRef.charAt(0).toUpperCase() + userRef.slice(1)} gõ viết tắt hay thiếu dấu ${botRef} vẫn hiểu tuốt!`
          : 'Hello! Welcome to the OMEGA warehouse team 🚀\nI am Tung, your companion assistant. Feel free to ask me anything about warehouse procedures, packaging, forklifts, barcodes, or anything else.',
        source: 'SOP Core',
        ts: new Date()
      }
    ];
  });

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

  const executeAction = (action) => {
    if (!action) return;
    const { type, data } = action;
    try {
      if (type === 'ADD_PRODUCT') {
        addProduct({
          sku: data.sku,
          name: data.name,
          nameEn: data.nameEn || data.name,
          category: data.category || 'ELECTRONICS',
          stock: Number(data.stock) || 0,
          location: data.location || 'WH-A/Zone B/Aisle 1/Shelf 2/Level 3',
          minStock: Number(data.minStock) || 10,
          maxStock: Number(data.maxStock) || 100,
          price: Number(data.price) || 100,
          cost: Number(data.cost) || 50
        });
      } else if (type === 'CREATE_RECEIPT') {
        createReceipt({
          partner: data.partner,
          items: [{
            sku: data.sku,
            qty: Number(data.qty) || 1,
            location: data.location || 'WH-A/Zone B/Aisle 1/Shelf 2/Level 3'
          }]
        });
      } else if (type === 'CREATE_DELIVERY') {
        createDelivery({
          partner: data.partner,
          items: [{
            sku: data.sku,
            qty: Number(data.qty) || 1
          }]
        });
      } else if (type === 'CREATE_TRANSFER') {
        createInternalTransfer(data.sku, Number(data.qty) || 1, data.fromWh, data.toWh);
      } else if (type === 'CREATE_PO') {
        createPurchaseOrder({
          id: 'PO-' + Math.floor(1000 + Math.random() * 9000),
          vendor: data.vendor,
          items: [{
            sku: data.sku,
            qty: Number(data.qty) || 1,
            unitCost: Number(data.cost) || 50
          }],
          total: (Number(data.qty) || 1) * (Number(data.cost) || 50),
          status: 'draft',
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {
      console.error("Failed to execute action:", err);
    }
  };

  const runLocalChatbotFallback = (query, currentSpamCount = 1) => {
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    };

    const cleanTelex = (str) => {
      return str
        .replace(/aa/g, 'a')
        .replace(/ee/g, 'e')
        .replace(/oo/g, 'o')
        .replace(/uw/g, 'u')
        .replace(/ow/g, 'o')
        .replace(/dd/g, 'd')
        .replace(/([a-z])\1+/g, '$1')
        .replace(/\b([a-z]+)[sfrxj]\b/g, '$1');
    };

    const expandAbbreviations = (str) => {
      const map = {
        'k': 'khong', 'ko': 'khong', 'kop': 'khong', 'kho': 'khong', 'hok': 'khong', 'khg': 'khong',
        'hong': 'khong', 'honggg': 'khong',
        'bik': 'biet', 'bit': 'biet',
        'dc': 'duoc', 'dk': 'duoc', 'đc': 'duoc', 'đk': 'duoc',
        'j': 'gi', 'g': 'gi',
        'ntn': 'nhu the nao', 'sao': 'nhu the nao',
        'lm': 'lam',
        'r': 'roi', 'roi': 'roi',
        'vs': 'voi', 'v': 'vay',
        'trc': 'truoc', 'ns': 'noi',
        'cx': 'cung', 'cg': 'cung',
        'oke': 'ok', 'okie': 'ok',
        'ni': 'ban', 'cau': 'ban',
        'atld': 'an toan lao dong',
        'bhld': 'bao ho lao dong',
        'pccc': 'phong chay chua chay',
        'wms': 'he thong quan ly kho',
        'po': 'don mua hang',
        'pda': 'may quet pda',
        'fifo': 'nhap truoc xuat truoc',
        'fefo': 'het han truoc xuat truoc',
        'hsd': 'han su dung',
        'qc': 'kiem dinh chat luong',
        'qa': 'kiem soat chat luong',
        'outbound': 'xuat kho',
        'inbound': 'nhap kho',
        'sop': 'quy trinh chuan',
        'stock': 'ton kho',
        'lot': 'lo hang',
        'sku': 'ma san pham',
        'pallet': 'ke chua hang',
        'forklift': 'xe nang',
        'xenang': 'xe nang',
        'nhapkho': 'nhap kho',
        'xuatkho': 'xuat kho',
        'antoan': 'an toan'
      };
      return str.split(/\s+/).map(word => map[word] || map[cleanTelex(word)] || word).join(' ');
    };

    const isAuto = ["auto", "tu dong", "tự động", "lap tuc", "lập tức", "ngay", "luon", "tức thì", "tuc thi"].some(w => removeAccents(query.toLowerCase()).includes(w));

    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const getChatProfile = () => {
      const stored = localStorage.getItem('omega-chat-profile');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
      return {
        name: currentUser?.name || 'ní',
        botRef: 'tớ',
        userRef: 'cậu',
        style: 'friendly'
      };
    };

    const saveChatProfile = (prof) => {
      localStorage.setItem('omega-chat-profile', JSON.stringify(prof));
    };

    const updateChatProfileJS = (q) => {
      const prof = getChatProfile();
      const rawClean = removeAccents(q.toLowerCase());
      const cleanQ = cleanTelex(rawClean);
      const words = cleanQ.split(/\s+/);
      let introFound = false;

      // Introduction parsing
      for (const phrase of ["ten la", "ten tui la", "ten to la", "ten minh la", "ten em la", "goi la", "goi to la", "goi tui la", "goi minh la", "goi em la"]) {
        if (rawClean.includes(phrase)) {
          const idx = rawClean.indexOf(phrase) + phrase.length;
          let namePart = q.substring(idx).trim();
          namePart = namePart.split(/[.,!?\s\(\)]/)[0];
          if (namePart && namePart.length >= 2 && !["gi", "nhe", "nha", "nhao", "nao"].includes(namePart.toLowerCase())) {
            prof.name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            introFound = true;
            break;
          }
        }
      }

      if (!introFound) {
        for (const pronoun of ["tui la", "to la", "minh la", "em la", "tao la", "anh la", "to ten la", "tui ten la", "em ten la"]) {
          if (rawClean.includes(pronoun)) {
            const idx = rawClean.indexOf(pronoun) + pronoun.length;
            let namePart = q.substring(idx).trim();
            namePart = namePart.split(/[.,!?\s\(\)]/)[0];
            if (namePart && namePart.length >= 2 && !["gi", "nhe", "nha", "nhao", "nao"].includes(namePart.toLowerCase())) {
              prof.name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
              introFound = true;
              break;
            }
          }
        }
      }

      // Pronoun mapping
      if (words.includes('ni') || words.includes('ní') || rawClean.includes('chao ni') || rawClean.includes('yo ni')) {
        prof.botRef = 'tui';
        prof.userRef = 'ní';
        prof.style = 'ni';
      } else if (words.some(w => ['may', 'tao', 'mai', 'mày', 'mài'].includes(w))) {
        prof.botRef = 'tao';
        prof.userRef = 'mày';
        prof.style = 'bro';
      } else if (words.some(w => ['sep', 'boss', 'chutich', 'sếp'].includes(w))) {
        prof.botRef = 'em';
        prof.userRef = 'sếp';
        prof.style = 'respectful';
      } else if (rawClean.includes('dong chi') || rawClean.includes('dongchi')) {
        prof.botRef = 'tôi';
        prof.userRef = 'đồng chí';
        prof.style = 'military';
      } else if (words.some(w => ['cau', 'to', 'cậu', 'tớ'].includes(w))) {
        prof.botRef = 'tớ';
        prof.userRef = 'cậu';
        prof.style = 'friendly';
      } else if (words.some(w => ['ban', 'tui', 'minh', 'bạn', 'mình'].includes(w))) {
        prof.botRef = 'tui';
        prof.userRef = 'bạn';
        prof.style = 'casual';
      }

      saveChatProfile(prof);
      return { profile: prof, introFound };
    };

    const generateIntroAcknowledgmentJS = (prof) => {
      const name = prof.name || 'ní';
      const userRef = prof.userRef || 'cậu';
      const botRef = prof.botRef || 'tớ';
      const style = prof.style || 'friendly';
      
      let acks = [];
      if (style === 'ni') {
        acks = [
          `Chào ${name} nha! Ghê chưa, ${botRef} ghi nhận tên của ${userRef} là ${name} rồi nghen. Có gì cần ${botRef} hỗ trợ ca trực kho bãi hôm nay không nè?`,
          `Yo ${name}! Hế lo ${name} nha! 👋 ${botRef} đã lưu tên của ${userRef} vào bộ nhớ rồi. Có câu hỏi gì về WMS hay SOP cứ nhắn ${botRef} nha!`,
          `Chào ${name} thân yêu! Rất vui được đồng hành cùng ${name} trong ca trực này. Cần ${botRef} phụ giúp gì thì cứ nhắn nghen!`
        ];
      } else if (style === 'bro') {
        acks = [
          `Ok chào ${name} nha! Tao nhớ tên mày là ${name} rồi. Có việc gì cần tao thông não giùm không?`,
          `Yo ${name}! Tao biết tên mày rồi nha. Ca làm hôm nay thế nào, có gì khó khăn cứ hú tao nhé!`,
          `Chào ${name}! Tao lưu tên mày rồi. Giờ cần tao tra cứu SOP hay WMS gì không, lẹ đi tao chỉ cho!`
        ];
      } else if (style === 'respectful') {
        acks = [
          `Dạ chào ${userRef} ${name} ạ! em đã ghi nhận và lưu thông tin của ${userRef} vào hệ thống. em có thể giúp gì cho sếp trong ca vận hành hôm nay ạ?`,
          `Dạ chào ${userRef} ${name}! Chúc ${userRef} một ngày làm việc đầy năng lượng. em rất vinh hạnh được hỗ trợ sếp ${name} ca trực hôm nay ạ.`,
          `Chào ${userRef} ${name}! em đã lưu tên của sếp rồi ạ. Có quy trình nào cần kiểm định sếp cứ bảo em nhé.`
        ];
      } else if (style === 'military') {
        acks = [
          `Chào đồng chí ${name}! Báo cáo đồng chí ${name}, tôi đã cập nhật danh tính của đồng chí vào danh sách trực ban. Xin hãy giao nhiệm vụ!`,
          `Báo cáo đồng chí ${name}! Tôi đã ghi nhớ tên của đồng chí. Trực ban SOP kho hàng đã sẵn sàng hỗ trợ đồng chí ca trực hôm nay.`,
          `Chào đồng chí ${name}! Tôi đã lưu thông tin đồng chí. Nhiệm vụ hôm nay thế nào, tôi đã sẵn sàng chấp hành lệnh.`
        ];
      } else {
        acks = [
          `Chào ${name} nha! Rất vui được gặp lại ${name}. Hôm nay ca làm việc thế nào, có gì cần ${botRef} phụ giúp không?`,
          `Hế lo ${name}! Ngày làm việc mới thật hiệu quả nghen. ${botRef} đã nhớ tên của ${userRef} là ${name} rồi nè.`,
          `Chào ${name}! Cần ${botRef} chỉ cách nhặt hàng FIFO, xử lý hàng rách hộp hay in tem mã vạch thì cứ nhắn ${botRef} nhé.`
        ];
      }
      return randomChoice(acks);
    };

    const isQueryingNameJS = (q) => {
      const rawClean = removeAccents(q.toLowerCase());
      const words = rawClean.split(/\s+/);
      
      const patterns = [
        /\bten (tui|toi|tao|em|to|minh|cua tui|cua toi|cua tao|cua em|cua to|cua minh|cua ni|ni) la (gi|chi)\b/,
        /\bnhac lai ten\b/,
        /\bnho ten (tui|toi|tao|em|to|minh|cua tui|cua toi|cua tao|cua em|cua to|cua minh|cua ni|ni)\b/,
        /\bten (tui|toi|tao|em|to|minh|cua tui|cua toi|cua tao|cua em|cua to|cua minh|cua ni|ni) la gi\b/,
        /\bnho ten (tui|toi|tao|em|to|minh)\b/,
        /\bbiet ten (tui|toi|tao|em|to|minh) khong\b/,
        /\bbiet ten (tui|toi|tao|em|to|minh) ko\b/,
        /\bten (tui|toi|tao|em|to|minh) la\b.*\bgi\b/,
        /\bnhac lai ten tui\b/,
        /\bnhac lai ten tao\b/,
        /\bnhac lai ten to\b/,
        /\bnhac lai ten em\b/,
        /\bnhac lai ten minh\b/,
        /\bnho ten\b/
      ];
      
      for (const p of patterns) {
        if (p.test(rawClean)) return true;
      }
      
      const hasTen = words.includes("ten") || q.toLowerCase().includes("tên");
      const hasGi = words.includes("gi") || q.toLowerCase().includes("gì") || words.includes("nao") || q.toLowerCase().includes("nào") || words.includes("chi");
      const hasPronoun = words.some(w => ["tui", "toi", "tao", "em", "to", "minh", "ni"].includes(w));
      
      return hasTen && hasGi && hasPronoun;
    };

    const generateNameResponseJS = (prof) => {
      const name = prof.name || 'ní';
      const userRef = prof.userRef || 'cậu';
      const botRef = prof.botRef || 'tớ';
      const style = prof.style || 'friendly';
      
      let resps = [];
      if (style === 'ni') {
        resps = [
          `Tên của ${userRef} là ${name} nè, ${botRef} làm sao quên được! 😉 Có gì cần ${botRef} giúp nữa không?`,
          `Ní đùa ${botRef} hoài, tên của ${userRef} là ${name} chứ gì nữa! ${botRef} ghi nhớ kỹ lắm đó nha.`,
          `Là ${name} thân yêu của ${botRef} chứ ai vào đây nữa nè!`
        ];
      } else if (style === 'bro') {
        resps = [
          `Tên mày là ${name} chứ gì nữa, tao quên thế nào được! Có cần tao nhắc lại lần nữa không?`,
          `Mày là ${name} chứ ai! Đừng có thử trí nhớ của tao nha mày.`,
          `Tên mày là ${name} nè. Hỏi câu gì khó hơn đi!`
        ];
      } else if (style === 'respectful') {
        resps = [
          `Dạ, tên của ${userRef} là sếp ${name} ạ. em luôn ghi nhớ thông tin của sếp để hỗ trợ tốt nhất.`,
          `Dạ sếp ${name} ạ! em làm sao dám quên tên của sếp được ạ.`,
          `Thưa sếp, tên của sếp trên hệ thống kho OMEGA là ${name} ạ.`
        ];
      } else if (style === 'military') {
        resps = [
          `Báo cáo đồng chí! Tên của đồng chí là ${name}. Tôi đã đối soát và ghi nhớ chính xác.`,
          `Đồng chí là ${name}. Báo cáo đồng chí, thông tin quân số đã được cập nhật chính xác.`,
          `Đồng chí ${name}! Tôi đã lưu trữ hồ sơ của đồng chí trên hệ thống.`
        ];
      } else {
        resps = [
          `Tên của ${userRef} là ${name} nè, ${botRef} nhớ rõ mà! Có việc gì cần ${botRef} phụ giúp không?`,
          `Là ${name} chứ ai nè! ${botRef} lưu tên của ${userRef} rồi, không quên được đâu.`,
          `Tên ${userRef} là ${name} đúng không nè? ${botRef} nhớ như in luôn á.`
        ];
      }
      return randomChoice(resps);
    };

    const applyPronounsJS = (text, prof) => {
      let result = text;
      const botRef = prof.botRef || 'tớ';
      const userRef = prof.userRef || 'cậu';
      const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

      result = result.replace(/\b[tT]ớ\b/g, (m) => m[0] === m[0].toUpperCase() ? capitalize(botRef) : botRef);
      result = result.replace(/\b[tT]ui\b/g, (m) => m[0] === m[0].toUpperCase() ? capitalize(botRef) : botRef);
      result = result.replace(/\b[cC]ậu\b/g, (m) => m[0] === m[0].toUpperCase() ? capitalize(userRef) : userRef);
      result = result.replace(/\b[nN]í\b/g, (m) => m[0] === m[0].toUpperCase() ? capitalize(userRef) : userRef);
      result = result.replace(/\b[bB]ạn\b/g, (m) => m[0] === m[0].toUpperCase() ? capitalize(userRef) : userRef);

      return result;
    };

    const generateGreetingJS = (prof) => {
      const style = prof.style || 'friendly';
      const userRef = prof.userRef || 'cậu';
      const botRef = prof.botRef || 'tớ';

      let greetings = [];
      if (style === 'ni') {
        greetings = [
          `Chào ${userRef} nha! Yo ${userRef}, hế lo ${userRef}! 👋 Có gì cần ${botRef} hỗ trợ ca trực kho bãi hôm nay không nè?`,
          `Yo ${userRef}! Hôm nay có đơn hàng hay quy trình gì cần ${botRef} check giùm không sếp ơi? Hê lô ${userRef} nha!`,
          `Hế lo ${userRef} thân yêu! Rất vui được đồng hành cùng ${userRef} ca này nghen. ${botRef} trực chiến ở đây hỗ trợ ${userRef} nè!`
        ];
      } else if (style === 'bro') {
        greetings = [
          `Chào ${userRef} nha! ${botRef} nghe nè ${userRef}, có việc gì cần ${botRef} thông não giùm không?`,
          `Hế lo ${userRef}! Ca trực hôm nay sao rồi? Có đơn nào bị nghẽn hay cần tìm SKU cứ hú ${botRef} nha!`,
          `Yo ${userRef}! Ca này vất vả không mày? Cần ${botRef} tra cứu SOP hay WMS gì không, lẹ đi ${botRef} chỉ cho!`
        ];
      } else if (style === 'respectful') {
        greetings = [
          `Chào ${userRef} ạ! ${botRef} có thể giúp gì cho ${userRef} trong ca vận hành hôm nay ạ?`,
          `Dạ hế lo ${userRef}! Chúc ${userRef} một ngày làm việc đầy năng lượng. ${botRef} luôn sẵn sàng hỗ trợ ${userRef} tra cứu SOP và WMS ạ.`,
          `Chào ${userRef}! ${botRef} rất vinh hạnh được hỗ trợ sếp ca này. Có quy trình nào cần kiểm định sếp cứ bảo ${botRef} nhé.`
        ];
      } else if (style === 'military') {
        greetings = [
          `Chào ${userRef}! Báo cáo ${userRef}, tôi đã sẵn sàng trực ban hỗ trợ cẩm nang SOP kho bãi.`,
          `Chào ${userRef}! Ca trực hôm nay nhiệm vụ thế nào? Có quy trình nào cần đối soát cứ lệnh cho tôi.`,
          `Báo cáo ${userRef}! Hệ thống WMS và cẩm nang an toàn đã sẵn sàng. Xin hãy giao nhiệm vụ!`
        ];
      } else {
        greetings = [
          `Chào ${userRef} nha! Rất vui được gặp lại ${userRef}. Hôm nay ca làm việc thế nào, có gì cần ${botRef} phụ giúp không?`,
          `Hế lo ${userRef}! Ngày làm việc mới thật hiệu quả nghen. Cần tra cứu vị trí kệ hay SOP cứ hỏi ${botRef} nha.`,
          `Chào ${userRef}! Cần ${botRef} chỉ cách nhặt hàng FIFO, xử lý hàng rách hộp hay in tem mã vạch thì cứ nhắn ${botRef} nhé.`
        ];
      }
      return randomChoice(greetings);
    };

    const extractFieldsJS = (q) => {
      const data = {};
      
      const skuMatch = q.match(/\b(SKU-[A-Za-z0-9_-]+|OMG-[0-9]+|[A-Z0-9]{3,}-[A-Z0-9]+)\b/i);
      if (skuMatch) {
        data.sku = skuMatch[1].toUpperCase();
      } else {
        const skuKeywordMatch = q.match(/(?:sku|mã|ma)\s*[:\-]?\s*([A-Za-z0-9_-]+)/i);
        if (skuKeywordMatch) data.sku = skuKeywordMatch[1].toUpperCase();
      }

      const qtyMatch = q.match(/(?:số lượng|so luong|sl|qty|quantity|số lượng là|so luong la)\s*[:\-]?\s*(\d+)/i) || q.match(/\b(\d+)\b/);
      if (qtyMatch) {
        const val = parseInt(qtyMatch[1], 10);
        data.qty = val;
        data.stock = val;
      }

      const priceMatch = q.match(/(?:giá|gia|giá bán|price)\s*[:\-]?\s*(\d+)/i);
      if (priceMatch) data.price = parseInt(priceMatch[1], 10);

      const costMatch = q.match(/(?:giá vốn|gia von|cost|giá mua)\s*[:\-]?\s*(\d+)/i);
      if (costMatch) data.cost = parseInt(costMatch[1], 10);

      const catMatch = q.match(/(?:loại|danh mục|danh muc|category|nhóm|nhom)\s*[:\-]?\s*([A-Za-z0-9_\s]+)/i);
      if (catMatch) {
        const catStr = catMatch[1].trim().toLowerCase();
        if (catStr.includes('dien tu') || catStr.includes('điện tử') || catStr.includes('elect')) {
          data.category = 'ELECTRONICS';
        } else if (catStr.includes('nặng') || catStr.includes('nang') || catStr.includes('cơ khí') || catStr.includes('heavy') || catStr.includes('may moc') || catStr.includes('máy móc')) {
          data.category = 'HEAVY MACHINERY';
        } else if (catStr.includes('năng lượng') || catStr.includes('nang luong') || catStr.includes('pin') || catStr.includes('energy')) {
          data.category = 'ENERGY UNITS';
        } else if (catStr.includes('lỏng') || catStr.includes('long') || catStr.includes('nước') || catStr.includes('fluid') || catStr.includes('chất lỏng')) {
          data.category = 'FLUIDS';
        }
      }

      const locMatch = q.match(/\b([A-Z]-\d{2}-\d{2})\b/i);
      if (locMatch) data.location = locMatch[1].toUpperCase();

      const nameMatch = q.match(/(?:tên|ten|tên là|ten la)\s*[:\-]?\s*([^,.\n]+?)(?=\s*(?:số lượng|so luong|sl|giá|gia|loại|loai|danh mục|danh muc|sku|vị trí|vi tri|$))/i);
      if (nameMatch) {
        const nameVal = nameMatch[1].trim();
        if (!["gì", "gi", "sản phẩm", "san pham"].includes(nameVal.toLowerCase())) {
          data.name = nameVal;
          data.nameEn = nameVal;
        }
      }

      const partnerMatch = q.match(/(?:đối tác|doi tac|nhà cung cấp|nha cung cap|vendor|partner|khách hàng|khach hang|cho|từ|tu)\s*[:\-]?\s*([A-Za-z0-9_-]+)/i);
      if (partnerMatch) {
        const pName = partnerMatch[1].trim();
        if (!["đối", "tác", "nhập", "xuất", "nhap", "xuat", "kho", "sản", "phẩm", "san", "pham", "sku", "số", "lượng", "so", "luong", "giá", "gia"].includes(pName.toLowerCase())) {
          data.partner = pName;
          data.vendor = pName;
        }
      }

      const fromMatch = q.match(/(?:từ kho|tu kho|từ|tu)\s+([A-Za-z0-9_\s]+?)(?=\s*(?:sang kho|sang|đến kho|den kho|đến|den|sku|số lượng|so luong|sl|$))/i);
      if (fromMatch) data.fromWh = fromMatch[1].trim();

      const toMatch = q.match(/(?:sang kho|sang|đến kho|den kho|đến|den)\s+([A-Za-z0-9_\s]+?)(?=\s*(?:từ kho|tu kho|từ|tu|sku|số lượng|so luong|sl|$))/i);
      if (toMatch) data.toWh = toMatch[1].trim();

      return data;
    };

    const { profile: prof, introFound } = updateChatProfileJS(query);
    const botRef = prof.botRef || 'tớ';
    const userRef = prof.userRef || 'cậu';
    
    // Offline Spam check
    if (currentSpamCount >= 4) {
      let spamMsg = '';
      if (currentSpamCount === 4) {
        spamMsg = `Ní ơi, đừng spam ${botRef} nha! Một câu hỏi mà gửi tới 4 lần là ${botRef} nhức đầu lắm đó! 🙄`;
      } else if (currentSpamCount === 5) {
        spamMsg = `Ủa ${userRef} bị kẹt phím hay bị lag mạng hả? Hỏi gì hỏi hoài một câu vậy, ${botRef} không trả lời nữa đâu nha! 😠`;
      } else if (currentSpamCount === 6) {
        spamMsg = `Này! Lì lợm vừa vừa thôi nha ${userRef}. Coi chừng ${botRef} khóa tài khoản PDA của ${userRef} bây giờ á! Đừng có giỡn mặt nha! 😡`;
      } else if (currentSpamCount === 7) {
        spamMsg = `Bực mình rồi nha! Không lo đi kiểm kho đi, suốt ngày ngồi spam robot. ${userRef} có tin ${botRef} báo cáo lên sếp tổng cho ăn biên bản không?! 😤`;
      } else {
        spamMsg = `Cạn lời! ${botRef.charAt(0).toUpperCase() + botRef.slice(1)} từ chối tiếp chuyện với ${userRef} luôn. Đi quét mã vạch đi, đừng quấy rối nữa! Đồ lì lợm! ❌`;
      }
      setChatHistory(prev => [...prev, { role: 'ai', text: spamMsg, source: 'Offline (Spam Control)', ts: new Date() }]);
      return;
    }

    // Offline Action Execution State Machine
    if (pendingAction) {
      const actionType = pendingAction.type;
      const data = { ...pendingAction.data };
      const step = pendingAction.step;
      const isAutoAction = pendingAction.isAuto || isAuto;

      const isYes = ["có", "co", "muốn", "muon", "ok", "yes", "duyệt", "thực hiện", "chạy đi", "yup", "uh", "uhm", "đồng ý", "dong y", "agree", "auto", "tự động", "tu dong", "lập tức", "lap tuc", "ngay", "luon", "tức thì", "tuc thi"].some(w => query.toLowerCase().includes(w));
      const isNo = ["không", "khong", "đéo", "deo", "no", "nah", "cancel", "hủy", "huy", "dẹp đi", "dep di", "không muốn", "khong muon", "đếch", "bỏ", "bo"].some(w => query.toLowerCase().includes(w));

      if (step === 'confirming') {
        if (isYes) {
          const actionNames = {
            "ADD_PRODUCT": "Thêm sản phẩm mới",
            "CREATE_RECEIPT": "Tạo phiếu nhập kho",
            "CREATE_DELIVERY": "Tạo phiếu xuất kho",
            "CREATE_TRANSFER": "Điều chuyển kho nội bộ",
            "CREATE_PO": "Tạo đơn mua hàng (PO)"
          };
          executeAction({ type: actionType, data });
          setPendingAction(null);
          showLocalToast(isVi ? 'Đã thực thi thành công trên hệ thống!' : 'Executed successfully on the system!');
          
          setChatHistory(prev => [...prev, {
            role: 'ai',
            text: applyPronounsJS(`🚀 Tuyệt vời! Tớ tiến hành thực thi hành động **${actionNames[actionType]}** thành công trên hệ thống rồi nhé!`, prof),
            source: 'Offline Action Executor',
            ts: new Date()
          }]);
          return;
        } else if (isNo) {
          const manualGuides = {
            "ADD_PRODUCT": (
              "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn thao tác thủ công:\n\n" +
              "1️⃣ Vào trang **Kho hàng** (Inventory) từ thanh menu chính bên trái.\n" +
              "2️⃣ Click nút **+ Thêm sản phẩm** ở góc trên bên phải màn hình.\n" +
              "3️⃣ Nhập các thông tin như SKU, Tên sản phẩm, Danh mục, Vị trí kệ, Số lượng tồn kho ban đầu.\n" +
              "4️⃣ Bấm **Lưu** để hoàn tất đăng ký sản phẩm."
            ),
            "CREATE_RECEIPT": (
              "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn thao tác thủ công:\n\n" +
              "1️⃣ Vào trang **Vận hành** (Operations) từ menu, click tab **Nhập kho** (Receipts).\n" +
              "2️⃣ Bấm nút **+ Tạo phiếu nhập**.\n" +
              "3️⃣ Chọn Đối tác (Nhà cung cấp), nhập mã SKU và Số lượng muốn nhập kho.\n" +
              "4️⃣ Bấm **Xác nhận** để tạo phiếu nhập ở trạng thái Chờ kiểm định chất lượng (QC)."
            ),
            "CREATE_DELIVERY": (
              "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn thao tác xuất kho thủ công:\n\n" +
              "1️⃣ Vào trang **Vận hành** (Operations) từ menu, click tab **Xuất kho** (Deliveries).\n" +
              "2️⃣ Bấm nút **+ Tạo yêu cầu xuất**.\n" +
              "3️⃣ Chọn Khách hàng (Đối tác nhận), nhập mã SKU và Số lượng cần xuất kho.\n" +
              "4️⃣ Bấm **Tạo phiếu** để lưu phiếu xuất ở trạng thái chuẩn bị lấy hàng (Pick/Pack)."
            ),
            "CREATE_TRANSFER": (
              "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn chuyển kho thủ công:\n\n" +
              "1️⃣ Vào trang **Vận hành** (Operations) hoặc click **Nhà kho** (Warehouses).\n" +
              "2️⃣ Tìm và click nút **Điều chuyển nội bộ** (Internal Transfer).\n" +
              "3️⃣ Nhập mã SKU, Số lượng hàng, chọn Kho xuất (From) và Kho nhận (To).\n" +
              "4️⃣ Bấm **Xác nhận** để hệ thống tự động cập nhật số dư tồn kho giữa hai kho."
            ),
            "CREATE_PO": (
              "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn tạo đơn mua hàng (PO) thủ công:\n\n" +
              "1️⃣ Vào trang **Mua hàng** (Purchase) từ menu chính.\n" +
              "2️⃣ Bấm nút **+ Tạo yêu cầu báo giá (RFQ)**.\n" +
              "3️⃣ Chọn Nhà cung cấp phù hợp, thêm mã SKU sản phẩm và số lượng mua.\n" +
              "4️⃣ Bấm **Lưu bản nháp** hoặc **Xác nhận đơn hàng** để gửi PO sang bên nhà cung cấp."
            )
          };
          setPendingAction(null);
          
          setChatHistory(prev => [...prev, {
            role: 'ai',
            text: applyPronounsJS(manualGuides[actionType], prof),
            source: 'Offline Action Executor',
            ts: new Date()
          }]);
          return;
        } else {
          setChatHistory(prev => [...prev, {
            role: 'ai',
            text: applyPronounsJS(`Tớ đang đợi xác nhận thực thi của cậu. Cậu có muốn tớ tự động làm trên hệ thống không? (Trả lời 'Có' hoặc 'Không')`, prof),
            source: 'Offline Action Executor',
            ts: new Date()
          }]);
          return;
        }
      }

      // If step is collecting, extract new values and update data
      const extracted = extractFieldsJS(query);
      Object.assign(data, extracted);

      const missing = pendingAction.missing_fields || [];
      if (missing.length > 0) {
        const first = missing[0];
        if (!(first in data)) {
          if (['qty', 'stock'].includes(first)) {
            const numMatch = query.match(/\b(\d+)\b/);
            if (numMatch) data[first] = parseInt(numMatch[1], 10);
          } else if (first === 'sku') {
            const val = query.trim().toUpperCase();
            if (val.length > 2) data.sku = val;
          } else {
            const val = query.trim();
            if (val.length >= 2 && !isYes && !isNo) data[first] = val;
          }
        }
      }

      // Re-calculate missing fields
      const newMissing = [];
      if (actionType === "ADD_PRODUCT") {
        if (!data.sku) newMissing.push('sku');
        if (!data.name) newMissing.push('name');
      } else if (actionType === "CREATE_RECEIPT") {
        if (!data.partner) newMissing.push('partner');
        if (!data.sku) newMissing.push('sku');
        if (!data.qty) newMissing.push('qty');
      } else if (actionType === "CREATE_DELIVERY") {
        if (!data.partner) newMissing.push('partner');
        if (!data.sku) newMissing.push('sku');
        if (!data.qty) newMissing.push('qty');
      } else if (actionType === "CREATE_TRANSFER") {
        if (!data.sku) newMissing.push('sku');
        if (!data.qty) newMissing.push('qty');
        if (!data.fromWh) newMissing.push('fromWh');
        if (!data.toWh) newMissing.push('toWh');
      } else if (actionType === "CREATE_PO") {
        if (!data.vendor) newMissing.push('vendor');
        if (!data.sku) newMissing.push('sku');
        if (!data.qty) newMissing.push('qty');
      }

      if (newMissing.length === 0) {
        if (isAutoAction) {
          const actionNames = {
            "ADD_PRODUCT": "Thêm sản phẩm mới",
            "CREATE_RECEIPT": "Tạo phiếu nhập kho",
            "CREATE_DELIVERY": "Tạo phiếu xuất kho",
            "CREATE_TRANSFER": "Điều chuyển kho nội bộ",
            "CREATE_PO": "Tạo đơn mua hàng (PO)"
          };
          executeAction({ type: actionType, data });
          setPendingAction(null);
          showLocalToast(isVi ? 'Đã thực thi thành công trên hệ thống!' : 'Executed successfully on the system!');
          
          setChatHistory(prev => [...prev, {
            role: 'ai',
            text: applyPronounsJS(`🚀 [AUTO EXECUTE] Tớ đã tự động thực thi hành động **${actionNames[actionType]}** thành công trên hệ thống rồi nhé!`, prof),
            source: 'Offline Action Executor - Auto',
            ts: new Date()
          }]);
          return;
        }

        let summary = "";
        if (actionType === "ADD_PRODUCT") {
          summary = `Thêm sản phẩm mới:\n• SKU: ${data.sku}\n• Tên: ${data.name}\n• Danh mục: ${data.category || 'ELECTRONICS'}\n• Tồn kho ban đầu: ${data.stock || 0} cái tại vị trí ${data.location || 'A-01-01'}`;
        } else if (actionType === "CREATE_RECEIPT") {
          summary = `Tạo phiếu NHẬP KHO (Receipt):\n• Nhà cung cấp/Đối tác: ${data.partner}\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái`;
        } else if (actionType === "CREATE_DELIVERY") {
          summary = `Tạo phiếu XUẤT KHO (Delivery):\n• Khách hàng/Đối tác nhận: ${data.partner}\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái`;
        } else if (actionType === "CREATE_TRANSFER") {
          summary = `Tạo lệnh ĐIỀU CHUYỂN nội bộ:\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái\n• Từ kho: ${data.fromWh} ➔ Đến kho: ${data.toWh}`;
        } else if (actionType === "CREATE_PO") {
          summary = `Tạo ĐƠN MUA HÀNG (Purchase Order):\n• Nhà cung cấp: ${data.vendor}\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái`;
        }

        const promptText = applyPronounsJS(`📝 **Xác nhận yêu cầu:**\nTớ đã chuẩn bị thông tin:\n\n${summary}\n\nCậu có muốn tớ tự động thực hiện hành động này trên hệ thống không? (Trả lời 'Có' hoặc 'Không')`, prof);
        setPendingAction({
          type: actionType,
          data,
          step: 'confirming',
          missing_fields: [],
          isAuto: isAutoAction
        });
        setChatHistory(prev => [...prev, { role: 'ai', text: promptText, source: 'Offline Action Executor', ts: new Date() }]);
        return;
      } else {
        const nextField = newMissing[0];
        const fieldPrompts = {
          sku: "Vui lòng cung cấp mã **SKU** sản phẩm để thực hiện.",
          name: "Cho tớ xin **Tên sản phẩm** cần thêm nhé.",
          partner: "Vui lòng nhập tên **Đối tác/Khách hàng** cho lô hàng.",
          vendor: "Vui lòng nhập tên **Nhà cung cấp**.",
          qty: "Vui lòng cung cấp **Số lượng** là bao nhiêu cái.",
          fromWh: "Vui lòng nhập tên **Kho nguồn (From)**.",
          toWh: "Vui lòng nhập tên **Kho đích (To)**."
        };
        const promptText = applyPronounsJS(fieldPrompts[nextField] || `Vui lòng điền thông tin '${nextField}'.`, prof);
        setPendingAction({
          type: actionType,
          data,
          step: 'collecting',
          missing_fields: newMissing,
          isAuto: isAutoAction
        });
        setChatHistory(prev => [...prev, { role: 'ai', text: promptText, source: 'Offline Action Executor', ts: new Date() }]);
        return;
      }
    }

    // Check for new action intents in offline fallback
    let localActionType = null;
    const cleanQ = cleanTelex(removeAccents(query.toLowerCase()));
    
    if (["them san pham", "tao san pham", "them sp", "tao sp", "add product"].some(w => cleanQ.includes(w))) {
      localActionType = "ADD_PRODUCT";
    } else if (["nhap kho", "nhap hang", "tao phieu nhap", "create receipt", "inbound"].some(w => cleanQ.includes(w))) {
      localActionType = "CREATE_RECEIPT";
    } else if (["xuat kho", "xuat hang", "tao phieu xuat", "create delivery", "outbound"].some(w => cleanQ.includes(w))) {
      localActionType = "CREATE_DELIVERY";
    } else if (["chuyen kho", "chuyen hang", "dieu chuyen", "transfer"].some(w => cleanQ.includes(w))) {
      localActionType = "CREATE_TRANSFER";
    } else if (["tao po", "mua hang", "don mua hang", "create po", "purchase order"].some(w => cleanQ.includes(w))) {
      localActionType = "CREATE_PO";
    }

    if (localActionType) {
      const data = extractFieldsJS(query);
      const isAutoAction = isAuto;
      const missing = [];
      if (localActionType === "ADD_PRODUCT") {
        if (!data.sku) missing.push('sku');
        if (!data.name) missing.push('name');
      } else if (localActionType === "CREATE_RECEIPT") {
        if (!data.partner) missing.push('partner');
        if (!data.sku) missing.push('sku');
        if (!data.qty) missing.push('qty');
      } else if (localActionType === "CREATE_DELIVERY") {
        if (!data.partner) missing.push('partner');
        if (!data.sku) missing.push('sku');
        if (!data.qty) missing.push('qty');
      } else if (localActionType === "CREATE_TRANSFER") {
        if (!data.sku) missing.push('sku');
        if (!data.qty) missing.push('qty');
        if (!data.fromWh) missing.push('fromWh');
        if (!data.toWh) missing.push('toWh');
      } else if (localActionType === "CREATE_PO") {
        if (!data.vendor) missing.push('vendor');
        if (!data.sku) missing.push('sku');
        if (!data.qty) missing.push('qty');
      }

      if (missing.length === 0) {
        if (isAutoAction) {
          const actionNames = {
            "ADD_PRODUCT": "Thêm sản phẩm mới",
            "CREATE_RECEIPT": "Tạo phiếu nhập kho",
            "CREATE_DELIVERY": "Tạo phiếu xuất kho",
            "CREATE_TRANSFER": "Điều chuyển kho nội bộ",
            "CREATE_PO": "Tạo đơn mua hàng (PO)"
          };
          executeAction({ type: localActionType, data });
          setPendingAction(null);
          showLocalToast(isVi ? 'Đã thực thi thành công trên hệ thống!' : 'Executed successfully on the system!');
          
          setChatHistory(prev => [...prev, {
            role: 'ai',
            text: applyPronounsJS(`🚀 [AUTO EXECUTE] Tớ đã tự động thực thi hành động **${actionNames[localActionType]}** thành công trên hệ thống rồi nhé!`, prof),
            source: 'Offline Action Executor - Auto',
            ts: new Date()
          }]);
          return;
        }

        let summary = "";
        if (localActionType === "ADD_PRODUCT") {
          summary = `Thêm sản phẩm mới:\n• SKU: ${data.sku}\n• Tên: ${data.name}\n• Danh mục: ${data.category || 'ELECTRONICS'}\n• Tồn kho ban đầu: ${data.stock || 0} cái tại vị trí ${data.location || 'A-01-01'}`;
        } else if (localActionType === "CREATE_RECEIPT") {
          summary = `Tạo phiếu NHẬP KHO (Receipt):\n• Nhà cung cấp/Đối tác: ${data.partner}\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái`;
        } else if (localActionType === "CREATE_DELIVERY") {
          summary = `Tạo phiếu XUẤT KHO (Delivery):\n• Khách hàng/Đối tác nhận: ${data.partner}\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái`;
        } else if (localActionType === "CREATE_TRANSFER") {
          summary = `Tạo lệnh ĐIỀU CHUYỂN nội bộ:\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái\n• Từ kho: ${data.fromWh} ➔ Đến kho: ${data.toWh}`;
        } else if (localActionType === "CREATE_PO") {
          summary = `Tạo ĐƠN MUA HÀNG (Purchase Order):\n• Nhà cung cấp: ${data.vendor}\n• Sản phẩm SKU: ${data.sku}\n• Số lượng: ${data.qty} cái`;
        }

        const promptText = applyPronounsJS(`📝 **Xác nhận yêu cầu:**\nTớ đã chuẩn bị thông tin:\n\n${summary}\n\nCậu có muốn tớ tự động thực hiện hành động này trên hệ thống không? (Trả lời 'Có' hoặc 'Không')`, prof);
        setPendingAction({
          type: localActionType,
          data,
          step: 'confirming',
          missing_fields: [],
          isAuto: isAutoAction
        });
        setChatHistory(prev => [...prev, { role: 'ai', text: promptText, source: 'Offline Action Executor', ts: new Date() }]);
        return;
      } else {
        const nextField = missing[0];
        const fieldPrompts = {
          sku: "Vui lòng cung cấp mã **SKU** sản phẩm để thực hiện.",
          name: "Cho tớ xin **Tên sản phẩm** cần thêm nhé.",
          partner: "Vui lòng nhập tên **Đối tác/Khách hàng** cho lô hàng.",
          vendor: "Vui lòng nhập tên **Nhà cung cấp**.",
          qty: "Vui lòng cung cấp **Số lượng** là bao nhiêu cái.",
          fromWh: "Vui lòng nhập tên **Kho nguồn (From)**.",
          toWh: "Vui lòng nhập tên **Kho đích (To)**."
        };
        const promptText = applyPronounsJS(fieldPrompts[nextField] || `Vui lòng điền thông tin '${nextField}'.`, prof);
        setPendingAction({
          type: localActionType,
          data,
          step: 'collecting',
          missing_fields: missing,
          isAuto: isAutoAction
        });
        setChatHistory(prev => [...prev, { role: 'ai', text: promptText, source: 'Offline Action Executor', ts: new Date() }]);
        return;
      }
    }

    let responseText = '';

    if (introFound) {
      responseText = isVi ? generateIntroAcknowledgmentJS(prof) : `Hello ${prof.name}! Nice to meet you. How can I help you with WMS/SOP today?`;
    } else if (isQueryingNameJS(query)) {
      responseText = isVi ? generateNameResponseJS(prof) : `Your name is ${prof.name}! I remember you.`;
    } else {
      const rawClean = removeAccents(query.toLowerCase());
      const telexClean = cleanTelex(rawClean);
      const expandedQuery = expandAbbreviations(rawClean);
      const cleanQuery = expandedQuery + ' ' + telexClean;

      // Weather check
      if (cleanQuery.includes('thoi tiet') || cleanQuery.includes('mua khong') || cleanQuery.includes('troi dep khong') || cleanQuery.includes('nhiet do')) {
        responseText = applyPronounsJS(`Thời tiết hôm nay khá mát mẻ và trong lành nhé ${prof.userRef}! Rất thích hợp để vận hành kho bãi an toàn và hiệu quả nè!`, prof);
        setChatHistory(prev => [...prev, { role: 'ai', text: responseText, source: 'Offline Weather Engine', ts: new Date() }]);
        return;
      }

      // Friend chitchat check
      if (cleanQuery.includes('khoe khong') || cleanQuery.includes('dieu gi moi') || cleanQuery.includes('khoe ko') || cleanQuery.includes('khoe re') || cleanQuery.includes('khoe chu')) {
        const replies = [
          `${prof.botRef} khỏe re hà! Suốt ngày ngồi quét mã vạch hỗ trợ các ${prof.userRef} là vui rồi. Hôm nay của ${prof.userRef} thế nào?`,
          `Cảm ơn nhé, ${prof.botRef} siêu khỏe luôn! Ca làm việc của ${prof.userRef} hôm nay suôn sẻ hết chứ?`,
          `${prof.botRef} lúc nào cũng sẵn sàng 100% sức mạnh! ${prof.userRef} nay mệt không, nhớ uống nước nghỉ ngơi xíu nha.`
        ];
        responseText = applyPronounsJS(randomChoice(replies), prof);
        setChatHistory(prev => [...prev, { role: 'ai', text: responseText, source: 'Offline Companion Engine', ts: new Date() }]);
        return;
      }

      // 1. GREETINGS
      if (cleanQuery.includes('chao') || cleanQuery.includes('hello') || cleanQuery.includes('hi') || cleanQuery.includes('he lo') || cleanQuery.includes('yo') || cleanQuery.includes('alo') || cleanQuery.includes('helo')) {
        responseText = isVi ? generateGreetingJS(prof) : '👋 Hello! I am Tung. How can I help you with warehouse procedures, packaging, forklifts, or barcode printers?';
      }
      // 2. THANKS
      else if (cleanQuery.includes('cam on') || cleanQuery.includes('thank') || cleanQuery.includes('tks')) {
        const viThanks = [
          `😊 Không có gì đâu nè! Chúc ${prof.userRef} làm việc vui vẻ nhé, có gì cần cứ nhắn ${prof.botRef}.`,
          `Hề hề không có chi. Chúc ${prof.userRef} làm việc vui vẻ, gặp vấn đề gì nhớ gọi ${prof.botRef} nha.`,
          `Có gì đâu nè! Anh em hỗ trợ nhau là chính. Cố gắng hoàn thành tốt ca trực nha ${prof.userRef}!`,
          `Ok ${prof.userRef}, giúp được ${prof.userRef} là ${prof.botRef} thấy phấn khởi rồi. Hẹn ca làm việc tiếp theo nhé!`
        ];
        const enThanks = [
          '😊 You are welcome! Have a great shift, feel free to ask if you need anything.',
          'No problem! Glad I could help. Stay safe!',
          'Anytime! Let me know if you need anything else.'
        ];
        responseText = isVi ? randomChoice(viThanks) : randomChoice(enThanks);
      } 
      // 3. GOODBYE
      else if (cleanQuery.includes('tam biet') || cleanQuery.includes('bye') || cleanQuery.includes('bai bai') || cleanQuery.includes('ve day') || cleanQuery.includes('het ca')) {
        const viGoodbye = [
          `👋 Tạm biệt ${prof.userRef} nhé! Chúc ${prof.userRef} ca làm việc suôn sẻ và an toàn.`,
          `Tạm biệt ${prof.userRef} nhé! Chúc ${prof.userRef} ca làm suôn sẻ, có gì cứ quay lại hỏi ${prof.botRef} nha.`,
          `Hết ca rồi hả ${prof.userRef}? Về nghỉ ngơi ăn uống tẩm bổ lấy sức mai chiến tiếp nha!`,
          `Chào ${prof.userRef} nghen! Đi đường cẩn thận, về tới nhà an toàn nha.`
        ];
        const enGoodbye = [
          '👋 Goodbye! Wish you a safe and smooth shift.',
          'Bye! Remember to check out and stay safe on the way home.',
          'See you next time! Don\'t forget to complete your shift handover log.'
        ];
        responseText = isVi ? randomChoice(viGoodbye) : randomChoice(enGoodbye);
      } 
      // 4. TIREDNESS / STRESS
      else if (cleanQuery.includes('met') || cleanQuery.includes('moi') || cleanQuery.includes('oai') || cleanQuery.includes('stress') || cleanQuery.includes('ap luc') || cleanQuery.includes('ca dem') || cleanQuery.includes('ot') || cleanQuery.includes('duoi')) {
        const viTired = [
          `Thương ${prof.userRef} ghê á! Công việc kho bãi đi ca, rồi OT liên tục vất vả lắm ${prof.botRef} biết mà. ${prof.userRef.charAt(0).toUpperCase() + prof.userRef.slice(1)} nhớ uống nhiều nước, nghỉ tay 5 phút làm ngụm trà đá đi nha. An toàn và sức khỏe của ${prof.userRef} là trên hết đó!`,
          `Ui da, làm kho mệt lắm đúng không sếp? Đi lại, bốc xếp suốt ca cực kỳ đuối luôn. Cố lên nha đồng chí, hết ca về tẩm bổ bữa lẩu hay làm giấc ngủ thật ngon cho lại sức nghen!`,
          `Nè ${prof.userRef} ơi, mệt thì cứ từ từ mà làm, đừng ráng quá nha. WMS với SOP thì quan trọng thật, nhưng sức khỏe ${prof.userRef} mới là số một. Cần ${prof.botRef} kể chuyện vui hay đố vui cho đỡ buồn ngủ ca đêm không nè?`
        ];
        const enTired = [
          'I feel you! Warehouse work is tough, especially during night shifts or OT. Please take a 5-minute break, drink some water, and stay safe. Your health is priority #1!',
          'Tired already? Take it easy. Take deep breaths, rest a bit, and do not rush. Safety first, my friend!'
        ];
        responseText = isVi ? randomChoice(viTired) : randomChoice(enTired);
      } 
      // 5. PRAISE / COMPLIMENT
      else if (cleanQuery.includes('gioi') || cleanQuery.includes('ngoan') || cleanQuery.includes('thong minh') || cleanQuery.includes('cute') || cleanQuery.includes('de thuong') || cleanQuery.includes('tuyet voi') || cleanQuery.includes('dot') || cleanQuery.includes('ngu') || cleanQuery.includes('li')) {
        const viPraise = [
          `Hi hi, được ${prof.userRef} khen làm ${prof.botRef} vui muốn bay màu luôn á! Có ${prof.userRef} đồng hành làm việc chung ${prof.botRef} cũng thấy phấn khởi lây nè. 🥰`,
          `Ngại ghê ta ơi! ${prof.botRef.charAt(0).toUpperCase() + prof.botRef.slice(1)} chỉ cố gắng học thuộc SOP với WMS để giúp ${prof.userRef} làm việc trơn tru thui. ${prof.userRef.charAt(0).toUpperCase() + prof.userRef.slice(1)} cũng giỏi và chăm chỉ lắm đó nha!`,
          `Ui, sao ${prof.userRef} nói ${prof.botRef} dốt/ngu vậy, tủi thân ghê á. 🥺 Có chỗ nào ${prof.botRef} trả lời chưa chuẩn ${prof.userRef} cứ chỉ bảo nha, ${prof.botRef} sẽ nâng cấp thuật toán liền!`
        ];
        const enPraise = [
          'Haha, thank you! Glad I can help. You are awesome too!',
          'Aww, you\'re making me blush! Let\'s keep up the good work together.',
          'Oops, did I make a mistake? Sorry about that, please let me know how I can improve!'
        ];
        responseText = isVi ? randomChoice(viPraise) : randomChoice(enPraise);
      } 
      // 6. LOGISTICS SLANG
      else if (cleanQuery.includes('cross dock') || cleanQuery.includes('lead time') || cleanQuery.includes('putaway') || cleanQuery.includes('lot hang') || cleanQuery.includes('pick hang') || cleanQuery.includes('pack hang')) {
        responseText = isVi
          ? '💡 THUẬT NGỮ LOGISTICS KHO HÀNG:\n• **Cross-docking**: Nhập kho là xuất đi ngay cho khách, không cần xếp kệ.\n• **Lead time**: Thời gian từ lúc lên đơn đặt hàng đến khi hàng thực tế về tới kho.\n• **Putaway**: Quy trình cất hàng vào vị trí kệ.\n• **Pick & Pack**: Nhặt hàng từ kệ (picking) rồi đóng gói (packing).'
          : '💡 WAREHOUSE TERMINOLOGY:\n• **Cross-docking**: Outbound straight from receipt, bypassing shelf storage.\n• **Lead time**: Total time from PO creation to physical warehouse receipt.\n• **Putaway**: Storing received goods into designated shelves.\n• **Pick & Pack**: Retrieving items (picking) and packaging them (packing).';
      } 
      // 7. RIDDLES
      else if (cleanQuery.includes('do vui') || cleanQuery.includes('cau do') || cleanQuery.includes('riddle')) {
        const viRiddles = [
          `Có ngay câu đố kho hàng cho ${prof.userRef}: "Cái gì càng nhiều trong kho thì thủ kho càng lo, nhưng giám đốc thì lại càng thích?"\n\n*(Gợi ý: Liên quan đến hàng tồn kho và dòng tiền nè!)*`,
          `Đố ${prof.userRef} nha: "Xe gì trong kho không bao giờ đi trên đường quốc lộ, nặng cả tấn nhưng lại rất sợ cua gấp ở tốc độ cao?"\n\n*(Bật mí: Là xe nâng forklift đó ${prof.userRef}! Ôm cua gấp khi chở hàng cao rất dễ lật xe cực kỳ nguy hiểm nha!)*`
        ];
        const enRiddles = [
          'Here is a riddle for you: "What has teeth but cannot bite, and is used every single time we seal a box?"\n\n*(Answer: The tape dispenser tape cutter!)*',
          'Riddle time: "What gets bigger the more you take away from it?"\n\n*(Answer: A hole! Just like a vacancy slot in a warehouse shelf!)*'
        ];
        responseText = isVi ? randomChoice(viRiddles) : randomChoice(enRiddles);
      } 
      // 8. BREAK TIME
      else if (cleanQuery.includes('giao lao') || cleanQuery.includes('nghi ngoi') || cleanQuery.includes('ca phe') || cleanQuery.includes('an trua') || cleanQuery.includes('an chieu') || cleanQuery.includes('tra da') || cleanQuery.includes('break time')) {
        const viBreak = [
          `Yé ye, tới giờ giải lao rồi thì buông PDA xuống làm ngụm trà đá, ly cà phê cho tỉnh táo nha ${prof.userRef}! Làm việc cật lực cả ca rồi, nghỉ ngơi xíu đi.`,
          `Nghỉ ngơi tí đi ${prof.userRef} ơi! Ngồi xuống nghỉ chân, kéo áo phản quang ra cho mát. Ăn cái bánh uống hộp sữa lấy sức tí làm tiếp cho năng suất nè.`,
          `Nghỉ tí đi ${prof.userRef}, làm việc an toàn là trên hết. Đừng quên cắm sạc máy PDA vào dock lúc nghỉ giải lao để lúc vào ca lại đầy pin nhé!`
        ];
        const enBreak = [
          'Break time! Put down the PDA, grab a coffee or tea, and relax. You\'ve been working hard!',
          'Time to recharge! Rest your feet, stay hydrated, and take a quick break. Work safe!'
        ];
        responseText = isVi ? randomChoice(viBreak) : randomChoice(enBreak);
      } 
      // 9. DAMAGED GOODS
      else if (cleanQuery.includes('rach') || cleanQuery.includes('hong') || cleanQuery.includes('damaged') || cleanQuery.includes('mop') || cleanQuery.includes('vo') || cleanQuery.includes('be') || cleanQuery.includes('loi')) {
        responseText = isVi
          ? '📦 QUY TRÌNH XỬ LÝ HÀNG HỎNG/RÁCH HỘP:\n\n① Chụp ảnh hiện trạng gói hàng làm bằng chứng.\n② Lập biên bản đồng kiểm ký xác nhận với tài xế xe giao hàng.\n③ Gắn nhãn trạng thái "QC_FAIL" hoặc "HOLD" và di chuyển sản phẩm về khu vực cách ly kiểm định.\n④ Cập nhật lý do và chênh lệch trên hệ thống OMEGA WMS.'
          : '📦 DAMAGED GOODS SOP:\n\n① Take photos of the packaging damage as evidence.\n② Create a joint inspection report signed by the driver.\n③ Put a "QC_FAIL" or "HOLD" tag and move items to the quarantine area.\n④ Log discrepancies and reasons on OMEGA WMS.';
      } 
      // 10. FIFO / OUTBOUND
      else if (cleanQuery.includes('fifo') || cleanQuery.includes('fefo') || cleanQuery.includes('xuat kho') || cleanQuery.includes('nhat') || cleanQuery.includes('pick') || cleanQuery.includes('xuat hang')) {
        responseText = isVi
          ? '🕒 QUY TẮC FIFO (FIRST IN, FIRST OUT):\n\n• Khi xuất kho hàng hóa, hệ thống OMEGA sẽ tự động chỉ định các Lô hàng (LOT) nhập trước xuất trước.\n• Nhân viên phải lấy hàng theo đúng sơ đồ kệ chỉ định để đảm bảo xoay vòng lô hàng, tránh hết hạn sử dụng.'
          : '🕒 FIFO RULE (FIRST IN, FIRST OUT):\n\n• When outbound orders are processed, OMEGA automatically assigns the oldest LOT IDs first.\n• Staff must retrieve items from the designated coordinates to ensure inventory rotation.';
      } 
      // 11. INBOUND
      else if (cleanQuery.includes('nhap kho') || cleanQuery.includes('receipt') || cleanQuery.includes('ocr') || cleanQuery.includes('nhap hang') || cleanQuery.includes('inbound')) {
        responseText = isVi
          ? '🚚 QUY TRÌNH NHẬP KHO TIÊU CHUẨN:\n\n① Quét hóa đơn đầu vào bằng AI OCR để tự động điền manifest.\n② Xe tải cập cảng bốc dỡ hàng theo lịch ưu tiên của AI.\n③ Thực hiện kiểm định QC chất lượng ngẫu nhiên.\n④ Xếp hàng vào kệ (Putaway) theo chỉ dẫn vị trí tối ưu từ AI và quét mã vạch xác nhận.'
          : '🚚 STANDARD INBOUND SOP:\n\n① Scan invoices using AI OCR to auto-fill manifests.\n② Trucks unload cargo at docks according to AI schedule priority.\n③ Perform random quality QC checks.\n④ Putaway items into optimal shelf slots and scan barcode to bind.';
      } 
      // 12. FORKLIFT
      else if (cleanQuery.includes('xe nang') || cleanQuery.includes('forklift') || cleanQuery.includes('lai xe') || cleanQuery.includes('xenang')) {
        responseText = isVi
          ? '🚜 QUY ĐỊNH XE NÂNG:\n• Chỉ người có chứng chỉ mới được lái xe nâng.\n• Tốc độ tối đa trong kho là 10 km/h, cua rẽ 5 km/h và phải bóp còi.\n• Hạ càng nâng (15-20cm cách đất) và nghiêng khung nâng về phía sau khi di chuyển.'
          : '🚜 FORKLIFT SAFETY:\n• Only certified operators can drive.\n• Max speed 10 km/h, 5 km/h at corners with horn.\n• Keep forks low (15-20cm) and tilt back during movement.';
      } 
      // 13. BARCODE
      else if (cleanQuery.includes('in tem') || cleanQuery.includes('ma vach') || cleanQuery.includes('barcode') || cleanQuery.includes('may in') || cleanQuery.includes('mavach') || cleanQuery.includes('intem')) {
        responseText = isVi
          ? '🖨️ MÁY IN MÃ VẠCH:\n• Kiểm tra lắp decal và mực ribbon đúng chiều.\n• Mở Bartender trên máy tính, chọn mẫu tem chuẩn và in thử 1 tem trước.\n• Nếu bị lỗi nhấp nháy đỏ hoặc lệch giấy, giữ nút Feed vài giây để Calibrate.'
          : '🖨️ BARCODE PRINTER:\n• Load paper/ribbon correctly.\n• Open Bartender, select template, and test print 1 copy.\n• If error light blinks, hold Feed button to Calibrate.';
      } 
      // 14. DEFAULT FALLBACK
      else {
        responseText = isVi
          ? `🤖 ${prof.botRef.charAt(0).toUpperCase() + prof.botRef.slice(1)} chưa hiểu rõ câu hỏi này lắm ${prof.userRef} ơi!\n\nGợi ý một vài quy tắc chuẩn SOP Kho:\n• Đảm bảo mặc đầy đủ bảo hộ (PPE) như áo phản quang, giày mũi sắt khi vào kho.\n• Luôn dùng máy PDA quét mã vạch (SKU và vị trí kệ) khi nhập xuất, không gõ tay tránh sai số.\n• Hãy thử gõ ngắn gọn hơn hoặc hỏi về "xe nâng", "FIFO", "mệt mỏi", hay "đố vui" nha!`
          : '🤖 I didn\'t quite catch that!\n\nSOP Suggestion:\n• Wear proper PPE (reflective vest, steel-toe boots) inside the warehouse.\n• Always scan barcodes on your PDA instead of manual entry to avoid errors.\n• Try asking about "forklift", "FIFO", "tired", or ask for a "riddle"!';
      }
    }
    setChatHistory(prev => [...prev, { role: 'ai', text: responseText, source: 'Offline Knowledge Base', ts: new Date() }]);
  };

  const handleChatSend = async (e, directText = '') => {
    if (e) e.preventDefault();
    const query = (directText || chatInput).trim();
    if (!query) return;

    let currentSpamCount = 1;
    if (query.toLowerCase() === lastMessageText.toLowerCase()) {
      currentSpamCount = spamCount + 1;
    } else {
      currentSpamCount = 1;
    }
    setLastMessageText(query);
    setSpamCount(currentSpamCount);

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
          user: currentUser,
          spam_count: currentSpamCount,
          pending_action: pendingAction,
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
        
        // Update pending action state
        if (data.pending_action) {
          setPendingAction(data.pending_action);
        } else {
          setPendingAction(null);
        }

        // Execute action if returned
        if (data.execute_action) {
          executeAction(data.execute_action);
          showLocalToast(isVi ? 'Đã thực thi thành công trên hệ thống!' : 'Executed successfully on the system!');
        }
      } else {
        runLocalChatbotFallback(query, currentSpamCount);
      }
    } catch (err) {
      console.error(err);
      runLocalChatbotFallback(query, currentSpamCount);
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

          {/* Glowing local toast notification */}
          {toastMessage && (
            <div className="sop-chatbot-toast">
              <span>{toastMessage}</span>
              <span className="sop-chatbot-toast-dot" />
            </div>
          )}

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
