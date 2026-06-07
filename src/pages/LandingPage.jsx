import { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, Navigation, Globe, Shield, Terminal, Zap, 
  ShieldAlert, Cpu, Sun, Moon, MapPin, Activity, Radar, Search, X, Loader 
} from 'lucide-react';
import { 
  EtchZap, EtchNavigation, EtchTerminal, EtchGlobe, 
  EtchSparkles, EtchArrowRight 
} from '../components/EtchIcons';
import { useApp } from '../context/AppContext';

const OMEGA_LOGO_SRC = '/omega-logo.png';

export default function LandingPage() {
  const { setActivePage, lang, setLang, theme, toggleTheme } = useApp();

  // State for interactive features
  const [activeHub, setActiveHub] = useState(null);
  
  // Tracking Modal State
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [trackingLogs, setTrackingLogs] = useState([]);
  
  // Initiate / Boot System State
  const [isBooting, setIsBooting] = useState(false);
  const [bootingLogs, setBootingLogs] = useState([]);

  const isVi = lang === 'vi';

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Initiate / Boot System sequence
  const handleStartBooting = () => {
    setIsBooting(true);
    setBootingLogs([]);

    const logs = isVi ? [
      "> KHỞI ĐỘNG HỆ THỐNG KHO VẬN TỰ HÀNH OMEGA v1.0.8...",
      "> THIẾT LẬP KẾT NỐI BẢO MẬT ĐA TẦNG QUANTUM SHIELD... OK",
      "> ĐỒNG BỘ DỮ LIỆU ĐỘI XE TỰ HÀNH & DRONES TOÀN CẦU... OK",
      "> KẾT NỐI CƠ SỞ DỮ LIỆU NƠ-RON TRUNG TÂM PHÂN PHỐI... OK",
      "> KHỞI CHẠY THUẬT TOÁN ĐỊNH TUYẾN THÍCH ỨNG... HOÀN TẤT [100%]",
      "> ỦY QUYỀN TRUY CẬP ĐÃ PHÊ DUYỆT. DI CHUYỂN TỚI PHÂN KHU..."
    ] : [
      "> BOOTING OMEGA AUTONOMOUS LOGISTICS v1.0.8...",
      "> ESTABLISHING MULTI-LAYER SECURE QUANTUM SHIELD... OK",
      "> SYNCHRONIZING GLOBAL AUTONOMOUS FLEET & DRONES... OK",
      "> CONNECTING NEURAL FULFILLMENT NETWORK CORE DATABASE... OK",
      "> SPINNING UP ADAPTIVE PATHFINDING ROUTER... MOUNTED [100%]",
      "> ACCESS AUTHORIZATION APPROVED. DIRECTING TO COMMAND CENTER..."
    ];

    let index = 0;
    const timer = setInterval(() => {
      if (index < logs.length) {
        setBootingLogs(prev => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setIsBooting(false);
          setActivePage('dashboard');
        }, 600);
      }
    }, 280);
  };

  // Fake tracking search logic
  const handleSearchTracking = (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setTrackingLoading(true);
    setTrackingProgress(0);
    setTrackingLogs([]);

    const logsList = isVi ? [
      { text: "> KẾT NỐI: Đang liên kết tới Cổng Hệ thống Vệ tinh OMEGA...", pct: 20 },
      { text: `> GIẢI MÃ: Đang giải mật mã định vị chuỗi cung ứng [${trackingCode.toUpperCase()}]... OK`, pct: 40 },
      { text: "> ĐỊNH VỊ: Xác định tọa độ vệ tinh GPS trạm trung chuyển khu vực... OK", pct: 60 },
      { text: "> BÁO CÁO: Phân khu vận chuyển B4 và Drone trinh sát liên kết thành công... OK", pct: 80 },
      { text: `> HOÀN TẤT: Đơn hàng [${trackingCode.toUpperCase()}] đang được phân loại tự động tại Kho HN-01 (Tọa độ: 21.0285° N, 105.8542° E). Vận tốc dự báo: Tối ưu (98.4%).`, pct: 100 }
    ] : [
      { text: "> CONNECTING: Linking to secure OMEGA satellite uplink portal...", pct: 20 },
      { text: `> DECRYPTING: Decrypting supply chain code [${trackingCode.toUpperCase()}]... OK`, pct: 40 },
      { text: "> GEOLOCATING: PIN-pointing GPS coordinates on regional transit maps... OK", pct: 60 },
      { text: "> TELEMETRY: Autonomous Drone links & cameras activated successfully... OK", pct: 80 },
      { text: `> DELIVERED: Shipment [${trackingCode.toUpperCase()}] is actively sorted at Hub HN-01 (Coordinates: 21.0285° N, 105.8542° E). Efficiency rating: 98.4%.`, pct: 100 }
    ];

    logsList.forEach((log, idx) => {
      setTimeout(() => {
        setTrackingLogs(prev => [...prev, log.text]);
        setTrackingProgress(log.pct);
        if (log.pct === 100) {
          setTrackingLoading(false);
        }
      }, (idx + 1) * 450);
    });
  };

  const handleEnterWorkspace = handleStartBooting;

  return (
    <div className="min-h-screen text-zinc-100 font-sans relative selection:bg-[#ff7a45]/30 selection:text-[#ff9e7d]" style={{ background: 'var(--bg-root)' }}>

      {/* ─── STANDALONE CYBER HEADER ─── */}
      <header className="border-b border-[var(--border)] px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-[var(--header-bg)]/95 backdrop-blur z-50 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 p-0.5 border border-[#ff7a45]/30 rounded bg-[#ff7a45]/5 flex items-center justify-center shrink-0">
            <img src={OMEGA_LOGO_SRC} alt="Omega" className="w-full h-full object-contain" />
          </div>
          <span className="font-sans font-bold text-sm tracking-widest uppercase text-zinc-100">
            {isVi ? 'Hệ thống Kho vận Omega AI' : 'Omega Logistics AI'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-[9px] font-bold tracking-widest text-zinc-400">
          <button 
            onClick={() => scrollToSection('network')} 
            className="hover:text-zinc-100 transition-colors uppercase bg-transparent border-0 cursor-pointer p-0 font-bold font-mono tracking-widest text-[9px]"
          >
            {isVi ? 'Mạng lưới' : 'Network'}
          </button>
          <button 
            onClick={() => scrollToSection('intelligence')} 
            className="hover:text-zinc-100 transition-colors uppercase bg-transparent border-0 cursor-pointer p-0 font-bold font-mono tracking-widest text-[9px]"
          >
            {isVi ? 'Trí tuệ' : 'Intelligence'}
          </button>
          <button 
            onClick={() => scrollToSection('solutions')} 
            className="hover:text-zinc-100 transition-colors uppercase bg-transparent border-0 cursor-pointer p-0 font-bold font-mono tracking-widest text-[9px]"
          >
            {isVi ? 'Giải pháp' : 'Solutions'}
          </button>
          <button 
            onClick={() => setIsTrackingOpen(true)} 
            className="hover:text-zinc-100 transition-colors uppercase bg-transparent border-0 cursor-pointer p-0 font-bold font-mono tracking-widest text-[9px]"
          >
            {isVi ? 'Truy vết' : 'Tracking'}
          </button>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]/20" />
          <button 
            onClick={handleStartBooting} 
            className="text-[#ff7a45] hover:text-[#ff9e7d] transition-colors uppercase bg-transparent border-0 cursor-pointer p-0 font-bold font-mono tracking-widest text-[9px]"
          >
            INITIATE
          </button>
        </nav>

        {/* Header Actions (Toggles + Command Center) */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded border border-zinc-800 flex items-center justify-center hover:opacity-75 transition-opacity text-zinc-400 cursor-pointer"
            style={{ background: 'var(--bg-card-alt)' }}
            title={theme === 'dark' ? (isVi ? 'Chuyển sang Nền Sáng' : 'Switch to Light Mode') : (isVi ? 'Chuyển sang Nền Tối' : 'Switch to Dark Mode')}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#ff7a45]" /> : <Moon className="w-3.5 h-3.5 text-[#ff7a45]" />}
          </button>

          {/* Language Toggle Button */}
          <button 
            type="button"
            onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
            className="w-8 h-8 rounded border border-zinc-800 flex items-center justify-center hover:opacity-75 transition-opacity font-mono text-[10px] font-bold text-[#ff7a45] uppercase cursor-pointer"
            style={{ background: 'var(--bg-card-alt)' }}
            title={lang === 'en' ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
          >
            {lang === 'en' ? 'EN' : 'VI'}
          </button>

          {/* Command Center Action */}
          <button
            type="button"
            onClick={handleEnterWorkspace}
            className="px-4 py-1.5 border border-[#ff7a45] text-zinc-950 text-[10px] font-bold font-mono tracking-wider rounded uppercase hover:bg-[#ff7a45] hover:text-zinc-950 transition-all cyber-notched-btn cursor-pointer"
            style={{ background: '#ff7a45' }}
          >
            {isVi ? 'MÀN HÌNH ĐIỀU KHIỂN' : 'COMMAND CENTER'}
          </button>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="px-6 md:px-16 lg:px-24 py-20 lg:py-28 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
        {/* Futuristic Tactical Overlay Behind Hero Text */}
        <div className="absolute top-10 left-10 w-24 h-24 border-l border-t border-zinc-800/40 pointer-events-none hidden md:block">
          <span className="absolute top-1 left-2 font-mono text-[6px] text-zinc-600 select-none">GRID_COORDINATES_SYS // 44.1E</span>
        </div>
        <div className="absolute bottom-10 left-24 w-12 h-12 border-l border-b border-zinc-800/40 pointer-events-none hidden md:block" />
        <div className="absolute top-1/3 left-1/2 w-4 h-4 border border-zinc-800/30 flex items-center justify-center pointer-events-none hidden lg:flex select-none">
          <span className="font-mono text-[5px] text-zinc-700">+</span>
        </div>

        {/* "Long Tranh Hổ Đấu" Cosmic Swirling Vortex Background SVG */}
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none select-none">
          <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <radialGradient id="vortex-cyan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="vortex-orange" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.25" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Swirling paths removed for clean, uncluttered text background */}


            {/* Glowing colliding energy points in center */}
            <circle cx="500" cy="300" r="120" fill="url(#vortex-cyan)" filter="blur(20px)" />
            <circle cx="500" cy="300" r="100" fill="url(#vortex-orange)" filter="blur(20px)" />
            <circle cx="500" cy="300" r="6" fill="#ffffff" className="animate-pulse" />
          </svg>
        </div>
        
        <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10 select-none">
          {/* Status Badge with Glowing Pulse */}
          <div className="status-hud-badge mb-4 font-mono text-[9px] uppercase tracking-widest font-black text-[#ff9e7d] flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
            <EtchSparkles className="w-3.5 h-3.5 text-[#ff7a45] shrink-0" />
            <span>{isVi ? 'TRẠNG THÁI HỆ THỐNG: TỐI ƯU' : 'SYSTEM STATUS: OPTIMAL'}</span>
          </div>

          {/* Heading with Epic Metallic and Fire Glow Gradients */}
          <h1 className="font-sans font-black text-[2.75rem] sm:text-5xl lg:text-[4.75rem] leading-[1.15] tracking-tight mb-4 overflow-visible">
            {isVi ? (
              <>
                <span className="text-glow-silver block">
                  THẾ HỆ MỚI CỦA
                </span> 
                <span className="text-glow-amber block mt-2">
                  LOGISTICS AI.
                </span>
              </>
            ) : (
              <>
                <span className="text-glow-silver block">
                  THE NEW SPECIES OF
                </span> 
                <span className="text-glow-amber block mt-2">
                  LOGISTICS AI.
                </span>
              </>
            )}
          </h1>

          {/* High-Tech Radar Sweeping Grid Divider */}
          <div className="cyber-grid-divider" />

          {/* Paragraph with full high-tech glass container outline */}
          <div className="hero-desc-box select-none">
            {isVi ? (
              <>
                Trí tuệ nhân tạo tự hành. Độ chính xác tuyệt đối. Vượt đỉnh hiệu suất chuỗi cung ứng toàn cầu với công nghệ dự báo học máy tối tân thế hệ mới.
              </>
            ) : (
              <>
                Autonomous Intelligence. Unstoppable precision. Scaling the peaks of supply chain efficiency with next-generation machine forecasting parameters.
              </>
            )}
          </div>

          {/* Sci-Fi Tactical Control Action Buttons */}
          <div className="flex flex-wrap gap-4 select-none w-full mt-1.5">
            {/* Primary Action: Command Center Switch */}
            <button
              type="button"
              onClick={handleEnterWorkspace}
              className="px-8 py-3.5 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-mono font-black tracking-widest text-[9px] transition-all flex items-center gap-2.5 cyber-notched-btn cyber-bracket-btn btn-shimmer-cyber cyber-primary-glow-btn cursor-pointer border-0"
            >
              <span>{isVi ? 'MÀN HÌNH ĐIỀU KHIỂN' : 'COMMAND CENTER'}</span>
              <EtchArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>

            {/* Secondary Action: watchlist deployment with bracket borders */}
            <button
              type="button"
              onClick={handleEnterWorkspace}
              className="px-8 py-3.5 border border-zinc-800 hover:border-[#ff7a45]/40 bg-zinc-950/45 text-zinc-300 hover:text-zinc-100 font-mono font-bold tracking-widest text-[9px] transition-all flex items-center gap-2.5 cyber-notched-btn cyber-bracket-btn btn-shimmer-cyber cursor-pointer relative overflow-hidden group"
            >
              {/* Micro green LED link status indicator */}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] shrink-0" />
              <span>{isVi ? 'XEM HOẠT ĐỘNG THỰC TẾ' : 'WATCH LIVE DEPLOYMENT'}</span>
            </button>
          </div>
        </div>


        {/* Ram Head Glowing Image Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end select-none">
          <div className="ram-head-glow p-3 w-full max-w-[340px] cursor-pointer" onClick={handleEnterWorkspace}>
            <div className="border border-[#ff7a45]/20 rounded-lg overflow-hidden bg-[#07070a]/90 p-2">
              <img
                src={OMEGA_LOGO_SRC}
                alt="Omega Mechanical Ram"
                className="w-full aspect-square object-cover object-top rounded brightness-95 hover:brightness-100 transition-all duration-500"
                draggable={false}
              />
            </div>
          </div>
        </div>

      </section>

      {/* ─── READY TO DEPLOY ─── */}
      <section className="px-6 md:px-16 py-16 text-center border-b border-[var(--border)] select-none" style={{ background: 'var(--bg-sidebar)' }}>
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight uppercase mb-8 text-zinc-100">
          {isVi ? 'SẴN SÀNG TRIỂN KHAI?' : 'READY TO DEPLOY?'}
        </h2>
        <button
          onClick={handleEnterWorkspace}
          type="button"
          className="px-8 py-3.5 bg-[#ff7a45] text-zinc-950 font-mono font-bold tracking-widest text-xs hover:bg-[#ff8b5a] transition-all inline-flex items-center gap-2 cyber-notched-btn cursor-pointer"
        >
          {isVi ? 'BẮT ĐẦU NGAY' : 'GET STARTED'}
          <EtchSparkles className="w-4 h-4 text-zinc-950" />
        </button>
        <p className="font-mono text-[8px] tracking-widest uppercase text-zinc-500 mt-4">
          {isVi ? 'TĂNG TỐC HIỆU SUẤT CHUỒI CUNG ỨNG' : 'AMPLIFYING SUPPLY CHAIN VELOCITY'}
        </p>
      </section>

      {/* ─── METRICS GRID SECTION ─── */}
      <section className="border-y border-[var(--border)] py-8 bg-[var(--bg-card-alt)]">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-l-2 border-[#ff7a45] pl-6 py-2">
            <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              {isVi ? 'HIỆU SUẤT TỐI ƯU' : 'EFFICIENCY RATING'}
            </p>
            <p className="font-sans text-3xl font-extrabold text-zinc-100 mt-2 flex items-baseline gap-1">
              99.9% <span className="text-xs text-[#ff7a45]">★</span>
            </p>
            <p className="font-mono text-[8px] text-[#ff9e7d] tracking-wider uppercase mt-1">
              {isVi ? 'TỐI ƯU HÓA TUYẾN PHÂN PHỐI' : 'OPTIMIZED NODE ROUTING'}
            </p>
          </div>
          <div className="border-l-2 border-[#ff7a45] pl-6 py-2">
            <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              {isVi ? 'TỐC ĐỘ GIAO VẬN' : 'DEPLOYMENT SPEED'}
            </p>
            <p className="font-sans text-3xl font-extrabold text-zinc-100 mt-2 flex items-baseline gap-1">
              24% <span className="text-xs text-[#ff7a45]">⚡</span>
            </p>
            <p className="font-mono text-[8px] text-[#ff9e7d] tracking-wider uppercase mt-1">
              {isVi ? 'BIÊN ĐỘ GIAO HÀNG VƯỢT TRỘI' : 'STERLING DELIVERY MARGIN'}
            </p>
          </div>
          <div className="border-l-2 border-[#ff7a45] pl-6 py-2">
            <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              {isVi ? 'ĐỘ TIN CẬY CỐT LÕI' : 'RELIABILITY CORE'}
            </p>
            <p className="font-sans text-3xl font-extrabold text-zinc-100 mt-2">
              ZERO
            </p>
            <p className="font-mono text-[8px] text-[#ff9e7d] tracking-wider uppercase mt-1">
              {isVi ? 'KHÔNG GHI NHẬN SỰ CỐ' : 'SYSTEM FAILURE RECORD'}
            </p>
          </div>
        </div>
      </section>

      {/* ─── NETWORKING MAP SECTION ─── */}
      <section id="network" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto border-t border-[var(--border)] relative grid-bg-effects">
        <div className="mb-12 flex flex-col items-start">
          <p className="font-mono text-[9px] text-[#ff7a45] tracking-widest uppercase font-bold mb-2">
            {isVi ? '03 // HỆ THỐNG PHÂN PHỐI QUỐC GIA' : '03 // NATIONAL LOGISTICS GRID'}
          </p>
          <h2 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wide text-zinc-100">
            {isVi ? 'Mạng Lưới Logistics OMEGA' : 'OMEGA Logistics Network'}
          </h2>
          <p className="text-xs text-zinc-400 mt-2 max-w-2xl">
            {isVi ? 'Hover lên các điểm kho tổng của OMEGA trên bản đồ để xem số liệu vận hành và hiệu suất hoạt động thời gian thực.' : 'Hover over OMEGA core warehouse hubs on the map to monitor live operational telemetry and drone count.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Map Column */}
          <div className="lg:col-span-7 flex justify-center bg-zinc-950/40 border border-zinc-800 rounded-lg p-6 relative overflow-hidden min-h-[480px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,130,90,0.03)_0%,transparent_75%)] pointer-events-none" />
            
            {/* Vietnam SVG Map */}
            <div className="w-full max-w-[320px] relative select-none">
              <svg viewBox="0 0 320 500" className="w-full h-full">
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="cosmic-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.75" class="svg-grid-dot" />
                    <path d="M 32 0 L 0 0 0 32" fill="none" class="svg-grid-line" strokeWidth="0.5" />
                  </pattern>
                  {/* Glow filter for high-tech HUD */}
                  <filter id="glow-cosmic" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <radialGradient id="nebula-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(232, 130, 90, 0.18)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#cosmic-grid)" />
                
                {/* Galactic Nebula Background */}
                <circle cx="160" cy="250" r="180" fill="url(#nebula-glow)" filter="blur(10px)" />

                {/* Satellite Orbital Tracking Rings (Macro Cosmos) */}
                <ellipse cx="160" cy="250" rx="140" ry="210" fill="none" class="svg-axis-line" strokeWidth="1" />
                <ellipse cx="160" cy="250" rx="140" ry="210" fill="none" class="svg-orange-orbit" strokeWidth="0.75" strokeDasharray="6 12" className="animate-spin" style={{ transformOrigin: '160px 250px', animationDuration: '40s' }} />
                
                <ellipse cx="160" cy="250" rx="150" ry="110" fill="none" class="svg-green-orbit" strokeWidth="0.75" strokeDasharray="3 9" className="animate-spin" style={{ transformOrigin: '160px 250px', animationDuration: '30s' }} />

                {/* Coastal Line Silhouette Path (Vietnam Constellation) */}
                <path
                  d="M 120 30 Q 135 25 150 45 T 160 110 T 145 170 T 175 220 T 225 270 T 215 320 T 185 370 T 145 420 T 125 470"
                  fill="none"
                  stroke="rgba(232, 130, 90, 0.08)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 120 30 Q 135 25 150 45 T 160 110 T 145 170 T 175 220 T 225 270 T 215 320 T 185 370 T 145 420 T 125 470"
                  fill="none"
                  stroke="rgba(232, 130, 90, 0.3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                />
                
                {/* Aerospace/Satellite shipping lanes (Global linkages) */}
                <path d="M 150 45 Q 280 250 125 470" fill="none" class="svg-green-orbit" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 150 45 Q 60 250 125 470" fill="none" class="svg-orange-orbit" strokeWidth="1" strokeDasharray="6 6" />
                <path d="M 150 45 Q 180 150 225 270" fill="none" class="svg-orange-orbit" strokeWidth="0.75" strokeDasharray="3 3" />
                <path d="M 225 270 Q 180 370 125 470" fill="none" class="svg-green-orbit" strokeWidth="0.75" strokeDasharray="3 3" />
                
                {/* Core ground distribution logistics vector paths */}
                <path
                  d="M 150 45 L 225 270 L 125 470"
                  fill="none"
                  class="svg-orange-main-path"
                  strokeWidth="2.5"
                  className="glow-line"
                />
                
                {/* Cosmic glowing stars (Faint clusters) */}
                <circle cx="50" cy="120" r="1.5" fill="#fff" opacity="0.3" className="animate-pulse" />
                <circle cx="280" cy="80" r="1.2" fill="#ff7a45" opacity="0.4" className="animate-pulse" />
                <circle cx="90" cy="340" r="1.8" fill="#4ade80" opacity="0.3" className="animate-pulse" />
                <circle cx="270" cy="420" r="1" fill="#fff" opacity="0.5" className="animate-pulse" />

                {/* Hub 1: HN (NODE_ALPHA_HN) */}
                <g 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveHub('hn')}
                  onMouseLeave={() => setActiveHub(null)}
                  onClick={() => setActiveHub('hn')}
                >
                  {/* Target Brackets */}
                  <path d="M 136 31 L 136 45 L 150 45" fill="none" stroke="rgba(232,130,90,0.5)" strokeWidth="1" />
                  <path d="M 164 59 L 164 45 L 150 45" fill="none" stroke="rgba(232,130,90,0.5)" strokeWidth="1" />
                  
                  <circle cx="150" cy="45" r="22" fill="none" stroke="rgba(232, 130, 90, 0.25)" strokeWidth="0.5" strokeDasharray="3 3" className="animate-spin" style={{ transformOrigin: '150px 45px', animationDuration: '10s' }} />
                  <circle cx="150" cy="45" r="15" fill="rgba(232, 130, 90, 0.12)" className="animate-pulse" />
                  <circle cx="150" cy="45" r="7" fill="#ff7a45" className="pulse-glow-orange" filter="url(#glow-cosmic)" />
                  <circle cx="150" cy="45" r="3" fill="#ffffff" />
                  <text x="174" y="49" class="svg-text-primary" className="font-mono text-[7.5px] tracking-widest font-bold">NODE_ALPHA_HN</text>
                </g>

                {/* Hub 2: DN (NODE_BETA_DN) */}
                <g 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveHub('dn')}
                  onMouseLeave={() => setActiveHub(null)}
                  onClick={() => setActiveHub('dn')}
                >
                  {/* Target Brackets */}
                  <path d="M 211 256 L 211 270 L 225 270" fill="none" stroke="rgba(232,130,90,0.5)" strokeWidth="1" />
                  <path d="M 239 284 L 239 270 L 225 270" fill="none" stroke="rgba(232,130,90,0.5)" strokeWidth="1" />
                  
                  <circle cx="225" cy="270" r="22" fill="none" stroke="rgba(232, 130, 90, 0.25)" strokeWidth="0.5" strokeDasharray="3 3" className="animate-spin" style={{ transformOrigin: '225px 270px', animationDuration: '10s' }} />
                  <circle cx="225" cy="270" r="15" fill="rgba(232, 130, 90, 0.12)" className="animate-pulse" />
                  <circle cx="225" cy="270" r="7" fill="#ff7a45" className="pulse-glow-orange" filter="url(#glow-cosmic)" />
                  <circle cx="225" cy="270" r="3" fill="#ffffff" />
                  <text x="249" y="274" class="svg-text-primary" className="font-mono text-[7.5px] tracking-widest font-bold">NODE_BETA_DN</text>
                </g>

                {/* Hub 3: HCM (NODE_OMEGA_HCM) */}
                <g 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveHub('hcm')}
                  onMouseLeave={() => setActiveHub(null)}
                  onClick={() => setActiveHub('hcm')}
                >
                  {/* Target Brackets */}
                  <path d="M 111 456 L 111 470 L 125 470" fill="none" stroke="rgba(232,130,90,0.5)" strokeWidth="1" />
                  <path d="M 139 484 L 139 470 L 125 470" fill="none" stroke="rgba(232,130,90,0.5)" strokeWidth="1" />
                  
                  <circle cx="125" cy="470" r="22" fill="none" stroke="rgba(232, 130, 90, 0.25)" strokeWidth="0.5" strokeDasharray="3 3" className="animate-spin" style={{ transformOrigin: '125px 470px', animationDuration: '10s' }} />
                  <circle cx="125" cy="470" r="15" fill="rgba(232, 130, 90, 0.12)" className="animate-pulse" />
                  <circle cx="125" cy="470" r="7" fill="#ff7a45" className="pulse-glow-orange" filter="url(#glow-cosmic)" />
                  <circle cx="125" cy="470" r="3" fill="#ffffff" />
                  <text x="149" y="474" class="svg-text-primary" className="font-mono text-[7.5px] tracking-widest font-bold">NODE_OMEGA_HCM</text>
                </g>
              </svg>
            </div>
          </div>


          {/* Telemetry Display Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="border border-zinc-800 bg-[#0e0e12] rounded-lg p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-3 font-mono text-[7px] text-[#ff7a45]/45 select-none">
                SYS_STATUS: ACTIVE // v1.8
              </div>

              {activeHub ? (
                <div className="text-left font-mono space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-xs font-bold text-[#ff7a45] uppercase tracking-wider">
                      {activeHub === 'hn' && (isVi ? 'OMEGA HUB MIỀN BẮC (HÀ NỘI)' : 'OMEGA NORTHERN HUB (HANOI)')}
                      {activeHub === 'dn' && (isVi ? 'OMEGA HUB MIỀN TRUNG (ĐÀ NẴNG)' : 'OMEGA CENTRAL HUB (DANANG)')}
                      {activeHub === 'hcm' && (isVi ? 'OMEGA HUB MIỀN NAM (TP.HCM)' : 'OMEGA SOUTHERN HUB (HCM CITY)')}
                    </span>
                  </div>

                  <div className="border-t border-zinc-800/80 my-2" />

                  <div className="grid grid-cols-2 gap-4 text-[10px] text-zinc-400">
                    <div>
                      <div className="text-zinc-500 text-[8px] uppercase tracking-wider">{isVi ? 'Tốc độ xử lý' : 'THROUGHPUT'}</div>
                      <div className="text-zinc-100 font-bold text-sm mt-1">
                        {activeHub === 'hn' && '14,250 c/h'}
                        {activeHub === 'dn' && '8,400 c/h'}
                        {activeHub === 'hcm' && '19,800 c/h'}
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[8px] uppercase tracking-wider">{isVi ? 'Đội xe tự hành' : 'DRONE FLEET'}</div>
                      <div className="text-zinc-100 font-bold text-sm mt-1">
                        {activeHub === 'hn' && '45 Active'}
                        {activeHub === 'dn' && '22 Active'}
                        {activeHub === 'hcm' && '65 Active'}
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[8px] uppercase tracking-wider">{isVi ? 'Hiệu năng truyền tải' : 'LOAD INDEX'}</div>
                      <div className="text-zinc-100 font-bold text-sm mt-1">
                        {activeHub === 'hn' && '84% (Optimal)'}
                        {activeHub === 'dn' && '62% (Optimal)'}
                        {activeHub === 'hcm' && '91% (Peak)'}
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[8px] uppercase tracking-wider">{isVi ? 'Liên kết vệ tinh' : 'SAT LINK'}</div>
                      <div className="text-emerald-400 font-bold text-sm mt-1">
                        SECURE_GPS
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800/80 my-2" />
                  
                  <div className="text-[8px] text-zinc-500 leading-relaxed font-mono">
                    {activeHub === 'hn' && (isVi ? 'Vận hành tối ưu dưới nhiệt độ khu vực Bắc Bộ. Không phát hiện sai số phân loại vật lý.' : 'Operating efficiently under Northern ambient telemetry. Zero hardware classification delta recorded.')}
                    {activeHub === 'dn' && (isVi ? 'Nút trung chuyển bưu kiện liên miền. Điều phối vận hành drone trong bán kính 100km.' : 'Inter-regional transit gateway. Core coordinates manage continuous UAV delivery grids.')}
                    {activeHub === 'hcm' && (isVi ? 'Khu vực hoạt động mật độ cao. Kích hoạt dự báo nơ-ron bậc 3 để lọc nhiễu vận tải.' : 'High-density terminal zone. Actively deploys tier-3 neural network routing to solve congestion spikes.')}
                  </div>
                </div>
              ) : (
                <div className="text-center font-mono py-12">
                  <div className="w-12 h-12 rounded-full border border-dashed border-[#ff7a45]/30 flex items-center justify-center mx-auto mb-4 animate-spin" style={{ animationDuration: '8s' }}>
                    <EtchGlobe className="w-5 h-5 text-[#ff7a45]/60" />
                  </div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                    {isVi ? 'ĐANG THEO DÕI HỆ THỐNG' : 'MONITORING SENSOR LOGS'}
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-2">
                    {isVi ? 'Di chuột lên điểm sáng bản đồ để lấy thông tin cơ sở hạ tầng' : 'Hover over any map node to extract live structural stats'}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between font-mono text-[7px] text-zinc-600 border-t border-zinc-900 pt-4">
                <span>COORD_GRID: 21.0N // 105.8E</span>
                <span>SYSTEM VERSION: v1.0.8</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE AI INTEL SECTION ─── */}
      <section id="intelligence" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto border-t border-[var(--border)]">
        <div className="mb-12 flex flex-col items-start">
          <p className="font-mono text-[9px] text-[#ff7a45] tracking-widest uppercase font-bold mb-2">
            {isVi ? '04 // CÔNG NGHỆ CỐT LÕI AI' : '04 // CORE INTELLIGENCE'}
          </p>
          <h2 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wide text-zinc-100">
            {isVi ? 'Sức Mạnh Thuật Toán Tối Ưu' : 'Autonomous AI Capabilities'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Box 1: Adaptive Pathfinding */}
          <div className="bg-[#111114] border border-[#212126] hover:border-[#ff7a45]/30 transition-all rounded-lg p-8 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[9px] text-[#ff7a45] tracking-wider uppercase font-bold bg-[#ff7a45]/5 px-2.5 py-1 border border-[#ff7a45]/20 rounded">
                  {isVi ? 'ĐỊNH TUYẾN THÍCH ỨNG' : 'NEURAL PATH ROUTING'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="font-sans font-bold text-lg text-zinc-100 uppercase tracking-wide mb-3">
                {isVi ? 'Thuật toán Định tuyến Tự hành' : 'Autonomous Routing Fleet'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
                {isVi ? 
                  'Hệ thống mạng nơ-ron tự động tính toán, cập nhật và dẫn hướng đội xe tự động theo thời gian thực. Giảm thiểu 30% quãng đường di chuyển và loại bỏ hoàn toàn các điểm nghẽn giao thông.' : 
                  'The neural core dynamically maps out and guides autonomous logistics fleets in real-time, decreasing overall transport overhead by 30% and avoiding all localized traffic blocks.'
                }
              </p>
            </div>

            {/* Pathfinding SVG animation (Cosmic Quantum Lattice) */}
            <div className="w-full h-36 bg-zinc-950 border border-zinc-900 rounded p-2 relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 400 120" className="w-full h-full select-none">
                <defs>
                  <pattern id="chart-grid-cosmic" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" class="svg-grid-line" strokeWidth="1" />
                  </pattern>
                  <radialGradient id="quantum-core" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(232, 130, 90, 0.4)" />
                    <stop offset="60%" stopColor="rgba(232, 130, 90, 0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#chart-grid-cosmic)" />
                
                {/* Central Quantum Computing Core */}
                <circle cx="200" cy="60" r="30" fill="url(#quantum-core)" />
                <circle cx="200" cy="60" r="6" fill="#ff7a45" className="animate-pulse" />
                <circle cx="200" cy="60" r="2" fill="#fff" />
                
                {/* Concentric high-tech orbital paths representing galactic logistics dimensions */}
                {/* Orbit 1 (Horizontal) */}
                <ellipse cx="200" cy="60" rx="150" ry="40" fill="none" class="svg-orange-orbit" strokeWidth="1" strokeDasharray="6 6" />
                
                {/* Orbit 2 (Diagonal Positive) */}
                <g transform="rotate(18, 200, 60)">
                  <ellipse cx="200" cy="60" rx="140" ry="32" fill="none" class="svg-green-orbit" strokeWidth="1" strokeDasharray="4 4" />
                </g>
                
                {/* Orbit 3 (Diagonal Negative) */}
                <g transform="rotate(-18, 200, 60)">
                  <ellipse cx="200" cy="60" rx="140" ry="32" fill="none" class="svg-blue-orbit" strokeWidth="1" strokeDasharray="4 4" />
                </g>
                
                {/* Orbital Lattice Interconnection Lines */}
                <line x1="50" y1="60" x2="350" y2="60" class="svg-axis-line" strokeWidth="0.75" />
                <line x1="200" y1="10" x2="200" y2="110" class="svg-axis-line" strokeWidth="0.75" />

                {/* Node Intersections */}
                <circle cx="50" cy="60" r="4" fill="#18181b" stroke="#ff7a45" strokeWidth="1" />
                <circle cx="350" cy="60" r="4" fill="#18181b" stroke="#ff7a45" strokeWidth="1" />
                <circle cx="200" cy="20" r="3.5" fill="#18181b" stroke="#4ade80" strokeWidth="1" />
                <circle cx="200" cy="100" r="3.5" fill="#18181b" stroke="#4ade80" strokeWidth="1" />

                {/* Quantum/Aerospace fleet packets gliding concurrently */}
                {/* Packet 1 (Orange, main path) */}
                <circle cx="0" cy="0" r="4.5" fill="#ff7a45" className="pulse-glow-orange">
                  <animateMotion dur="8s" repeatCount="indefinite" path="M 50 60 Q 200 20 350 60 T 50 60" />
                </circle>
                
                {/* Packet 2 (Green, diagonal positive orbit) */}
                <g transform="rotate(18, 200, 60)">
                  <circle cx="0" cy="0" r="4" fill="#4ade80" className="pulse-glow-green">
                    <animateMotion dur="6s" repeatCount="indefinite" path="M 60 60 C 130 28 270 28 340 60 C 270 92 130 92 60 60" />
                  </circle>
                </g>

                {/* Packet 3 (Cyan, diagonal negative orbit) */}
                <g transform="rotate(-18, 200, 60)">
                  <circle cx="0" cy="0" r="4" fill="#22d3ee" className="pulse-glow-blue">
                    <animateMotion dur="10s" repeatCount="indefinite" path="M 340 60 C 270 28 130 28 60 60 C 130 92 270 92 340 60" />
                  </circle>
                </g>
                
                {/* Star-fleet HUD markings */}
                <text x="15" y="18" class="svg-text-muted" className="font-mono text-[6px] tracking-widest font-bold">GRID_SEC: SYS_LATTICE</text>
                <text x="325" y="18" class="svg-text-muted" className="font-mono text-[6px] tracking-widest font-bold">CORE: STABLE</text>
              </svg>
            </div>
          </div>

          {/* Box 2: Noise Reduction (Signal wave) */}
          <div className="bg-[#111114] border border-[#212126] hover:border-[#ff7a45]/30 transition-all rounded-lg p-8 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[9px] text-[#ff7a45] tracking-wider uppercase font-bold bg-[#ff7a45]/5 px-2.5 py-1 border border-[#ff7a45]/20 rounded">
                  {isVi ? 'XỬ LÝ NHIỄU DỮ LIỆU' : 'DATA DE-NOISING SIGNAL'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="font-sans font-bold text-lg text-zinc-100 uppercase tracking-wide mb-3">
                {isVi ? 'Dự Báo Nhu Cầu Tối Ưu' : 'De-noised Predictive Demand'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
                {isVi ? 
                  'Biểu đồ mô tả quá trình AI chuyển hóa dữ liệu nhiễu thô của chuỗi cung ứng ngoài thị trường (đường gấp khúc màu đỏ) thành một biểu đồ sóng cung cầu mượt mà, chính xác (đường cong màu xanh), giúp dự trữ hàng hợp lý.' : 
                  'Visualizing how OMEGA AI converts messy, unpredictable raw demand signals (rugged orange curve) into a purified, smoothed demand projection wave (flowing green curve) to scale inventories efficiently.'
                }
              </p>
            </div>

            {/* Waveform Animation SVG (Cosmic Particle Frequency Scope) */}
            <div className="w-full h-36 bg-zinc-950 border border-zinc-900 rounded p-2 relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 400 120" className="w-full h-full select-none">
                <defs>
                  {/* Scope Grid */}
                  <pattern id="scope-grid-cosmic" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" class="svg-grid-line" strokeWidth="0.75" />
                  </pattern>
                  {/* Glowing gradient under the clean wave */}
                  <radialGradient id="glow-emerald-area-cosmic-radial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#scope-grid-cosmic)" />
                
                {/* Horizontal reference axis */}
                <line x1="10" y1="70" x2="390" y2="70" class="svg-axis-line" strokeWidth="1" />
                
                {/* Jagged Raw signal (Red-orange, noisy) */}
                <path 
                  d="M 10 70 L 40 40 L 70 90 L 100 20 L 130 80 L 160 50 L 190 100 L 220 30 L 250 85 L 280 40 L 310 95 L 340 30 L 390 70" 
                  fill="none" 
                  class="svg-red-wave" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                />
                
                {/* Area Fill for Clean Wave */}
                <path
                  d="M 10 70 Q 55 25 100 50 T 190 70 T 280 60 T 390 70 L 390 120 L 10 120 Z"
                  fill="url(#glow-emerald-area-cosmic-radial)"
                  opacity="0.3"
                />

                {/* Triple overlapping harmonic waves for premium aesthetic */}
                {/* Wave 3 (Gold, faint background support wave) */}
                <path 
                  d="M 10 70 Q 60 20 110 40 T 200 60 T 290 70 T 390 70" 
                  fill="none" 
                  class="svg-gold-wave" 
                  strokeWidth="1" 
                  opacity="0.3" 
                />

                {/* Wave 2 (Cyan, secondary support wave) */}
                <path 
                  d="M 10 70 Q 50 30 90 60 T 180 80 T 270 50 T 390 70" 
                  fill="none" 
                  class="svg-cyan-wave" 
                  strokeWidth="1.2" 
                  opacity="0.5" 
                  strokeDasharray="4 4"
                />

                {/* Wave 1 (Emerald, primary de-noised forecast) */}
                <path 
                  d="M 10 70 Q 55 25 100 50 T 190 70 T 280 60 T 390 70" 
                  fill="none" 
                  class="svg-green-wave" 
                  strokeWidth="2.5" 
                  className="glow-line"
                />
                
                {/* Double Sweeping Laser Scanners */}
                {/* Laser 1 (Green, Sweeping Left to Right) */}
                <line x1="0" y1="5" x2="0" y2="115" stroke="rgba(74, 222, 128, 0.45)" strokeWidth="1.5" strokeDasharray="3 3">
                  <animate attributeName="x1" values="10;390;10" dur="5.5s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="10;390;10" dur="5.5s" repeatCount="indefinite" />
                </line>

                {/* Laser 2 (Cyan, Sweeping Right to Left) */}
                <line x1="0" y1="5" x2="0" y2="115" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" strokeDasharray="2 4">
                  <animate attributeName="x1" values="390;10;390" dur="7s" repeatCount="indefinite" />
                  <animate attributeName="x2" values="390;10;390" dur="7s" repeatCount="indefinite" />
                </line>

                {/* Cosmic processing telemetry overlay labels */}
                <text x="15" y="20" class="svg-red-text" className="font-mono text-[7px] uppercase font-bold tracking-wider">
                  {isVi ? '▲ NHIỄU KHÔNG GIAN THÔ (NOISY)' : '▲ RAW SIGNAL NOISE'}
                </text>
                <text x="15" y="106" class="svg-green-text" className="font-mono text-[7px] uppercase font-bold tracking-wider">
                  {isVi ? '▼ TẦN SỐ DỰ BÁO ĐỒNG BỘ OMEGA' : '▼ DE-NOISED FORECAST'}
                </text>
                
                <text x="290" y="20" class="svg-text-muted" className="font-mono text-[7px] uppercase font-bold tracking-wider">
                  SYNC: 99.999%
                </text>
                <text x="290" y="106" class="svg-text-muted" className="font-mono text-[7px] uppercase font-bold tracking-wider">
                  ENTROPY: 0.001%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI SOLUTIONS ─── */}
      <section id="solutions" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto border-t border-[var(--border)]">
        <div className="mb-12 flex flex-col items-start">
          <p className="font-mono text-[9px] text-[#ff7a45] tracking-widest uppercase font-bold mb-2">
            {isVi ? '01 // CƠ SỞ HẠ TẦNG DOANH NGHIỆP' : '01 // CORP INFRASTRUCTURE'}
          </p>
          <h2 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wide text-zinc-100">
            {isVi ? 'Giải pháp AI Tích hợp' : 'AI Solutions'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#111114] border border-[#212126] p-8 hover:border-[#ff7a45]/30 transition-all cyber-notched-card group cursor-pointer" onClick={handleEnterWorkspace}>
            <div className="w-10 h-10 border border-zinc-800 rounded bg-zinc-950 flex items-center justify-center text-[#ff7a45] group-hover:bg-[#ff7a45] group-hover:text-zinc-950 transition-all mb-6">
              <EtchZap className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-base text-zinc-100 uppercase tracking-wide mb-3">
              {isVi ? 'Dự báo Nhu cầu' : 'Predictive Scaling'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {isVi ? 
                'Dự báo nhu cầu thời gian thực giúp điều phối tài nguyên chuỗi cung ứng trước khi đạt đỉnh. Tối ưu hóa tuyệt đối.' : 
                'Real-time demand forecasting that adapts supply chain resources before the peak hits. Absolute resource optimization.'
              }
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111114] border border-[#212126] p-8 hover:border-[#ff7a45]/30 transition-all cyber-notched-card group cursor-pointer" onClick={handleEnterWorkspace}>
            <div className="w-10 h-10 border border-zinc-800 rounded bg-zinc-950 flex items-center justify-center text-[#ff7a45] group-hover:bg-[#ff7a45] group-hover:text-zinc-950 transition-all mb-6">
              <EtchNavigation className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-base text-zinc-100 uppercase tracking-wide mb-3">
              {isVi ? 'Định tuyến Thích ứng' : 'Adaptive Routing'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {isVi ? 
                'Thuật toán tìm đường linh hoạt cho đội xe tự hành. Vượt qua tắc nghẽn với trí tuệ dẫn đường chính xác đến mili-giây.' : 
                'Dynamic pathfinding for autonomous fleets. Bypasses congestion with millisecond-accurate navigation intelligence.'
              }
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111114] border border-[#212126] p-8 hover:border-[#ff7a45]/30 transition-all cyber-notched-card group cursor-pointer" onClick={handleEnterWorkspace}>
            <div className="w-10 h-10 border border-zinc-800 rounded bg-zinc-950 flex items-center justify-center text-[#ff7a45] group-hover:bg-[#ff7a45] group-hover:text-zinc-950 transition-all mb-6">
              <EtchTerminal className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-base text-zinc-100 uppercase tracking-wide mb-3">
              {isVi ? 'Logic Phân loại Hub' : 'Terminal Logic'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {isVi ? 
                'Tự động hóa hoàn toàn quy trình phân loại và phân phối. Độ chính xác tuyệt đối không cần con người tại các trung tâm trung chuyển.' : 
                'Fully automated sorting and distribution. Human-free accuracy at the point of fulfillment and transit hubs.'
              }
            </p>
          </div>
        </div>

        {/* Pricing Sub-Section */}
        <div className="mt-20">
          <div className="mb-10 flex flex-col items-center text-center">
            <p className="font-mono text-[9px] text-[#ff7a45] tracking-widest uppercase font-bold mb-2">
              {isVi ? 'PHÂN QUYỀN HỘI VIÊN // SUBSCRIPTIONS' : 'MEMBERSHIP TIERS // SUBSCRIPTIONS'}
            </p>
            <h3 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-wide text-zinc-100">
              {isVi ? 'Gói Cước Dịch Vụ OMEGA' : 'OMEGA Deployment Plans'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Plan 1: Starter */}
            <div className="glass-card rounded-lg p-8 flex flex-col justify-between border border-zinc-800">
              <div>
                <span className="font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-bold border border-zinc-700 px-2 py-0.5 rounded">
                  {isVi ? 'CƠ BẢN' : 'STARTER'}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-zinc-100">1.500.000</span>
                  <span className="text-[10px] text-zinc-400 font-mono">VNĐ / {isVi ? 'Tháng' : 'Mo'}</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono">{isVi ? 'Phù hợp cho các cửa hàng, nhà kho quy mô vừa và nhỏ.' : 'Best suited for smaller warehouses & retail storefronts.'}</p>
                <div className="border-t border-zinc-800/80 my-6" />
                <ul className="space-y-3 font-sans text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Quản lý tối đa 500 SKU sản phẩm' : 'Up to 500 product SKUs'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Dự báo nhu cầu hàng tuần' : 'Weekly predictive forecasting'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Báo cáo xuất nhập kho cơ bản' : 'Basic stock analytics logs'}
                  </li>
                  <li className="flex items-center gap-2 text-zinc-500 line-through">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-750" />
                    {isVi ? 'Hệ thống định tuyến Drone tự động' : 'Autonomous Drone route planning'}
                  </li>
                </ul>
              </div>
              <button 
                onClick={handleEnterWorkspace} 
                className="mt-8 w-full py-2.5 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-100 text-zinc-400 font-mono text-[10px] font-bold tracking-wider rounded uppercase transition-all bg-transparent cursor-pointer"
              >
                {isVi ? 'Đăng Ký Triển Khai' : 'Deploy Starter'}
              </button>
            </div>

            {/* Plan 2: Pro (Active/Glowing) */}
            <div className="glass-card-active rounded-lg p-8 flex flex-col justify-between border border-[#ff7a45]/30 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#ff7a45] text-zinc-950 font-mono text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                POPULAR
              </div>
              <div>
                <span className="font-mono text-[8px] text-[#ff7a45] tracking-wider uppercase font-bold border border-[#ff7a45]/30 px-2 py-0.5 rounded">
                  {isVi ? 'CHUYÊN NGHIỆP' : 'PRO SYSTEM'}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#ff7a45]">5.000.000</span>
                  <span className="text-[10px] text-zinc-400 font-mono">VNĐ / {isVi ? 'Tháng' : 'Mo'}</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 font-mono">{isVi ? 'Giải pháp tối ưu cho chuỗi phân phối & quản lý kho vận lớn.' : 'Perfect scaling for fast-growing logistics & mid-sized supply chain.'}</p>
                <div className="border-t border-[#ff7a45]/20 my-6" />
                <ul className="space-y-3 font-sans text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Không giới hạn số lượng SKU' : 'Unlimited active product SKUs'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Dự báo cung cầu thời gian thực' : 'Real-time neural demand projections'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Tự động định tuyến xe & Drone' : 'Full autonomous fleet route solver'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Hỗ trợ kỹ thuật 24/7 từ OMEGA' : 'Priority 24/7 dedicated support'}
                  </li>
                </ul>
              </div>
              <button 
                onClick={handleEnterWorkspace} 
                className="mt-8 w-full py-2.5 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-mono text-[10px] font-bold tracking-wider rounded uppercase transition-all border-0 cursor-pointer"
              >
                {isVi ? 'Kích Hoạt Hệ Thống' : 'Launch Pro'}
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="glass-card rounded-lg p-8 flex flex-col justify-between border border-zinc-800">
              <div>
                <span className="font-mono text-[8px] text-zinc-400 tracking-wider uppercase font-bold border border-zinc-700 px-2 py-0.5 rounded">
                  {isVi ? 'TẬP ĐOÀN' : 'ENTERPRISE'}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-zinc-100">CUSTOM</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono">{isVi ? 'Cơ sở hạ tầng chuyên biệt toàn cầu, tích hợp ERP đa tầng.' : 'Customized global setups with deep ERP integrations & dedicated onsite.'}</p>
                <div className="border-t border-zinc-800/80 my-6" />
                <ul className="space-y-3 font-sans text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Giải pháp AI độc quyền may đo riêng' : 'Bespoke custom-trained machine models'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Kết nối trực tiếp API hệ thống nội bộ' : 'Direct on-premise hardware API integration'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Kỹ sư hạ tầng OMEGA onsite hỗ trợ' : 'Dedicated support engineers assigned onsite'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                    {isVi ? 'Hạ tầng máy chủ AI dự phòng đa tầng' : 'Tier-1 high availability failover infrastructure'}
                  </li>
                </ul>
              </div>
              <button 
                onClick={handleEnterWorkspace} 
                className="mt-8 w-full py-2.5 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-100 text-zinc-400 font-mono text-[10px] font-bold tracking-wider rounded uppercase transition-all bg-transparent cursor-pointer"
              >
                {isVi ? 'Liên Hệ Khảo Sát' : 'Contact Sales'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE OMEGA ADVANTAGE ─── */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-card-alt)] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Grid Lines Map Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] aspect-video border border-zinc-800 bg-[#0e0e12] rounded p-4 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,130,90,0.06)_0%,transparent_70%)]" />
              <div className="w-full h-full border border-dashed border-zinc-800 rounded flex flex-col justify-between p-4 relative font-mono text-[7px] text-[#ff7a45]">
                <div className="flex justify-between">
                  <span>COORD_X: 99.41</span>
                  <span>SYS: ACTIVE</span>
                </div>
                {/* Simulated high-tech grid shapes */}
                <div className="my-auto flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full border border-zinc-800 border-dashed animate-spin flex items-center justify-center" style={{ animationDuration: '20s' }}>
                    <div className="w-10 h-10 rounded-full border border-[#ff7a45]/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-[#ff7a45]/60" />
                    </div>
                  </div>
                  <span className="font-mono text-[#ff7a45]/80 text-[6px] tracking-widest uppercase">{isVi ? 'MẠNG LƯỚI GIAO VẬN TOÀN CẦU' : 'GLOBAL TRANSIT NET'}</span>
                </div>
                <div className="flex justify-between">
                  <span>SEC_07 // OPTIMAL</span>
                  <span>v1.0.8 // ENG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Block */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <p className="font-mono text-[9px] text-[#ff7a45] tracking-widest uppercase font-bold mb-2">
              {isVi ? '02 // TẦM NHÌN CHIẾN LƯỢC' : '02 // STRATEGIC COGNIZANCE'}
            </p>
            <h2 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wide text-zinc-100">
              {isVi ? 'LỢI THẾ CỦA OMEGA' : "THE 'OMEGA' ADVANTAGE"}
            </h2>

            <p className="mt-4 text-xs text-zinc-400 leading-relaxed max-w-xl font-sans">
              {isVi ? 
                'Mạng lưới nơ-ron của chúng tôi không chỉ quản lý kho vận mà còn làm chủ chúng. Bằng cách kết hợp khả năng phục hồi bền bỉ với công nghệ mở rộng dự báo tiên tiến, OMEGA nhận diện các đỉnh điểm và suy thoái trước khi chúng xảy ra.' : 
                "Our neural network doesn't just manage logistics, it masters them. By integrating the raw resilience of the mountain goat with advanced predictive scaling, OMEGA identifies peaks and troughs before they manifest."
              }
            </p>

            <ul className="mt-6 space-y-3 font-mono text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                {isVi ? 'ĐỒNG BỘ HÓA ĐỘI XE TOÀN CẦU' : 'GLOBAL FLEET SYNCHRONIZATION'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                {isVi ? 'TỐI ƯU HÓA TUYẾN ĐƯỜNG NƠ-RON' : 'NEURAL ROUTE OPTIMIZATION'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
                {isVi ? 'LƯỚI KHO HÀNG TỰ HÀNH' : 'AUTONOMOUS WAREHOUSE GRID'}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-card-alt)] px-6 md:px-16 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col items-start text-left max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 p-0.5 border border-[#ff7a45]/30 rounded bg-[#ff7a45]/5 flex items-center justify-center shrink-0">
                <img src={OMEGA_LOGO_SRC} alt="Omega" className="w-full h-full object-contain" />
              </div>
              <span className="font-sans font-bold text-xs tracking-wider uppercase text-zinc-100">
                {isVi ? 'HỆ THỐNG KHO VẬN OMEGA AI' : 'OMEGA LOGISTICS AI'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed mt-3">
              {isVi ? 
                'Trí tuệ kho vận tự hành cho thời đại công nghiệp hiện đại. Được xây dựng để chinh phục các đỉnh cao hiệu suất, hợp lý hóa đội xe và tối ưu hóa các điểm nút.' : 
                'Autonomous logistics intelligence for the modern industrial age. Built to conquer peaks, streamline fleets, and optimize nodes.'
              }
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[9px] font-bold text-zinc-500">
            <span>&copy; 2026 OMEGA LOGISTICS INC.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">
              {isVi ? 'TOÀN BỘ HỆ THỐNG HOẠT ĐỘNG ỔN ĐỊNH' : 'ALL SYSTEMS OPERATIONAL'}
            </span>
          </div>
        </div>
      </footer>

      {/* ─── HIGH-TECH RADAR TRACKING MODAL ─── */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
          <div className="bg-[#0e0e12] border-2 border-zinc-800 rounded-lg max-w-2xl w-full p-6 relative shadow-2xl flex flex-col gap-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold tracking-wider">
                <Radar className="w-4 h-4 animate-pulse" />
                <span>{isVi ? 'CỔNG ĐỊNH VỊ CHUỖI CUNG ỨNG // OMEGA SYSTEM' : 'OMEGA TRACKING INTERFACE // SATELLITE'}</span>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setIsTrackingOpen(false);
                  setTrackingCode('');
                  setTrackingLogs([]);
                  setTrackingProgress(0);
                }} 
                className="w-7 h-7 rounded border border-zinc-800 flex items-center justify-center hover:opacity-75 transition-opacity text-zinc-400 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Left Column: Visual Radar Sweeper */}
              <div className="flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 rounded-lg p-6 min-h-[220px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.02)_0%,transparent_75%)] pointer-events-none" />
                
                {/* SVG Radar */}
                <div className="w-40 h-40 relative">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Concentric rings */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(74, 222, 128, 0.08)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(74, 222, 128, 0.12)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(74, 222, 128, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(74, 222, 128, 0.2)" strokeWidth="1" />
                    
                    {/* Crosshair lines */}
                    <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(74, 222, 128, 0.12)" strokeWidth="1" />
                    <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(74, 222, 128, 0.12)" strokeWidth="1" />
                    
                    {/* Intermittent flashing target dot (shows when completed) */}
                    {trackingProgress === 100 && (
                      <g className="animate-pulse">
                        <circle cx="140" cy="70" r="10" fill="rgba(74, 222, 128, 0.15)" />
                        <circle cx="140" cy="70" r="5" fill="#4ade80" className="pulse-glow-green" />
                      </g>
                    )}

                    {/* Rotating sweeps line */}
                    <line 
                      x1="100" y1="100" x2="190" y2="100" 
                      stroke="rgba(74, 222, 128, 0.7)" 
                      strokeWidth="1.5" 
                      className="animate-radar-sweep" 
                    />
                  </svg>
                </div>
              </div>

              {/* Right Column: Search Inputs & Logs Terminal */}
              <div className="flex flex-col gap-4">
                <form onSubmit={handleSearchTracking} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#ff7a45] font-bold">&gt;</span>
                    <input 
                      type="text" 
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder={isVi ? "Mã: OMG-9921, PO-4560..." : "Code: OMG-9921, PO-4560..."}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 pl-6 font-mono text-[10px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#ff7a45]/60 transition-colors uppercase"
                      disabled={trackingLoading}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={trackingLoading || !trackingCode.trim()} 
                    className="px-4 py-2 bg-[#ff7a45] hover:bg-[#ff8b5a] text-zinc-950 font-mono text-[10px] font-bold tracking-wider rounded uppercase transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
                  >
                    {trackingLoading ? <Loader className="w-3 h-3 animate-spin text-zinc-950" /> : <Search className="w-3 h-3 text-zinc-950" />}
                    <span>{isVi ? 'QUÉT' : 'LOCATE'}</span>
                  </button>
                </form>

                {/* Tracking Progress Bar */}
                {trackingProgress > 0 && (
                  <div className="h-1 bg-zinc-900 rounded overflow-hidden relative">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-300" 
                      style={{ width: `${trackingProgress}%` }}
                    />
                  </div>
                )}

                {/* Logs Terminal */}
                <div className="bg-zinc-950 border border-zinc-900 rounded p-4 min-h-[140px] flex flex-col justify-between font-mono text-[8px] leading-relaxed text-zinc-400 overflow-y-auto">
                  <div className="space-y-1">
                    {trackingLogs.length > 0 ? (
                      trackingLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className={log.startsWith("> HOÀN TẤT") || log.startsWith("> DELIVERED") ? "text-emerald-400 font-bold" : "text-zinc-400"}
                        >
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-600 animate-pulse italic text-center py-6">
                        {isVi ? 'Chờ kích hoạt tín hiệu định vị chuỗi cung ứng...' : 'Awaiting tracking signal code input...'}
                      </div>
                    )}
                  </div>
                  {trackingLoading && (
                    <div className="flex items-center gap-1 text-[#ff7a45] font-bold mt-2 animate-pulse">
                      <span>ACCESSING SATELLITE CHANNELS</span>
                      <span className="terminal-cursor" />
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center font-mono text-[7px] text-zinc-600">
              <span>GPS_SENSORS: LINKED [98%]</span>
              <span>OMEGA SECURE GATE v1.8</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── FULLSCREEN RETRO TERMINAL BOOTING OVERLAY ─── */}
      {isBooting && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col justify-between p-8 md:p-16 font-mono text-emerald-400 select-none animate-fade-in">
          {/* Top Info Banner */}
          <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4 text-[9px] md:text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>OMEGA COGNITIVE SYSTEM v1.0.8 // CLI CORE</span>
            </div>
            <span>SECURE GATEWAY ENCRYPTED</span>
          </div>

          {/* Typing log screen */}
          <div className="flex-1 my-8 overflow-y-auto flex flex-col justify-start text-[10px] md:text-sm space-y-2 leading-relaxed text-emerald-300">
            {bootingLogs.map((log, index) => (
              <div key={index} className="animate-fade-in font-mono">
                {log}
              </div>
            ))}
            
            <div className="flex items-center gap-1">
              <span className="terminal-cursor" />
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="border-t border-emerald-900/50 pt-4 flex justify-between items-center text-[8px] md:text-[10px] text-emerald-600">
            <span>SYSTEM DIRECTORY: ACCESS APPROVED</span>
            <span>CLOCK: {new Date().toISOString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
