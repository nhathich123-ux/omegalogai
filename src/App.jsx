import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  Search,
  Bell,
  User,
  Plus,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Mail,
  Lock,
  Camera,
  Upload,
  Key,
  LayoutDashboard,
  Warehouse,
  Users,
  ShoppingCart,
  ArrowLeftRight,
  Brain,
  TrendingUp,
  Settings,
  Terminal,
} from 'lucide-react';
import { useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import SopChatbotWidget from './components/SopChatbotWidget';

// Lazy load page modules to speed up initial load time
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const PurchasePage = lazy(() => import('./pages/PurchasePage'));
const OperationsPage = lazy(() => import('./pages/OperationsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const AiFilePage = lazy(() => import('./pages/AiFilePage'));

const OMEGA_LOGO_SRC = '/omega-logo.png';

function OmegaLogo({ className = '' }) {
  return (
    <img
      src={OMEGA_LOGO_SRC}
      alt="Omega"
      className={`rounded object-cover shrink-0 ${className}`}
      draggable={false}
    />
  );
}

const PAGES = {
  landing: LandingPage,
  dashboard: DashboardPage,
  inventory: InventoryPage,
  purchase: PurchasePage,
  operations: OperationsPage,
  reports: ReportsPage,
  settings: SettingsPage,
  developer: DeveloperPage,
  partners: PartnersPage,
  aifile: AiFilePage,
};

function Sidebar() {
  const { activePage, setActivePage, setSidebarOpen, lang, currentUser } = useApp();

  const go = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  const isVi = lang === 'vi';

  // Sidebar navigation groups ordered logically in business workflow:
  // 1. Giám sát (Overview)
  // 2. Dữ liệu nền tảng (Master Data)
  // 3. Nghiệp vụ kho (Core Logistics)
  // 4. Trí tuệ nhân tạo (Advanced AI)
  // 5. Cấu hình (System)
  const sidebarGroups = [
    {
      title: isVi ? 'GIÁM SÁT' : 'MONITORING',
      items: [
        { id: 'dashboard', label: isVi ? 'TRUNG TÂM ĐIỀU KHIỂN' : 'DASHBOARD', icon: LayoutDashboard },
      ]
    },
    {
      title: isVi ? 'DỮ LIỆU NỀN TẢNG' : 'MASTER DATA',
      items: [
        { id: 'inventory', label: isVi ? 'KHO HÀNG' : 'INVENTORY', icon: Warehouse },
        { id: 'partners', label: isVi ? 'ĐỐI TÁC' : 'PARTNERS', icon: Users },
      ]
    },
    {
      title: isVi ? 'NGHIỆP VỤ KHO' : 'LOGISTICS FLOW',
      items: [
        { id: 'purchase', label: isVi ? 'MUA HÀNG' : 'PROCUREMENT', icon: ShoppingCart },
        { id: 'operations', label: isVi ? 'VẬN HÀNH' : 'OPERATIONS', icon: ArrowLeftRight },
      ]
    },
    {
      title: isVi ? 'TRÍ TUỆ NHÂN TẠO' : 'AI COGNITIVE',
      items: [
        { id: 'aifile', label: isVi ? 'TRÍCH XUẤT TÀI LIỆU AI' : 'AI DOC EXTRACTOR', icon: Brain },
        { id: 'reports', label: isVi ? 'DỰ BÁO & BÁO CÁO AI' : 'AI PREDICTOR & REPORTS', icon: TrendingUp },
      ]
    },
    {
      title: isVi ? 'CẤU HÌNH' : 'SYSTEM',
      items: [
        { id: 'settings', label: isVi ? 'CÀI ĐẶT' : 'SETTINGS', icon: Settings },
        ...(currentUser && currentUser.email === 'nhathich123@gmail.com'
          ? [{ id: 'developer', label: isVi ? 'CÀI ĐẶT PHÁT TRIỂN' : 'DEVELOPER SETTINGS', icon: Terminal }]
          : [])
      ]
    }
  ];

  return (
    <aside
      className="flex flex-col w-60 min-h-screen shrink-0 border-r border-[var(--border)] select-none"
      style={{ background: 'var(--bg-sidebar)' }}
    >
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 p-0.5 border border-[#ff7a45]/30 rounded bg-[#ff7a45]/5 flex items-center justify-center shrink-0">
            <OmegaLogo className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="font-sans font-bold text-2xl leading-none text-[var(--text-primary)]" style={{ letterSpacing: '0.04em' }}>OMEGA</h1>
            <p className="font-mono text-[11px] font-bold tracking-wider text-[#ff7a45] uppercase mt-1.5">
              {isVi ? 'HỆ THỐNG KHO AI' : 'AI WAREHOUSE CORE'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto scrollbar-thin">
        {sidebarGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-4 block select-none opacity-80">
              {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon }) => {
                const isActive = activePage === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => go(id)}
                    className={`group w-full flex items-center gap-3 px-4 py-2 text-[10px] font-mono font-bold tracking-wider rounded transition-all text-left uppercase ${isActive
                      ? 'text-[#ff7a45] bg-[#ff7a45]/5 border-l-2 border-l-[#ff7a45]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border-l-2 border-l-transparent'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#ff7a45]' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 pb-6 space-y-4 mt-auto">
        <div className="flex flex-col gap-0.5 pt-2 border-t border-[var(--border)]">
          <button type="button" className="flex items-center gap-2 px-2 py-2 text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            {isVi ? 'TRỢ GIÚP' : 'SUPPORT'}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-2 py-2 text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => go('landing')}
          >
            {isVi ? 'ĐĂNG XUẤT' : 'SIGN OUT'}
          </button>
        </div>
      </div>
    </aside>
  );
}

function TopHeader() {
  const {
    activePage,
    lang,
    setLang,
    theme,
    toggleTheme,
    notifications,
    setNotifications,
    currentUser,
    setCurrentUser,
    registeredAccounts,
    setRegisteredAccounts,
    faceIdAccounts,
    setFaceIdAccounts,
    go,
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
    globalSearchQuery,
    setGlobalSearchQuery
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Login / Register / Forgot Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [visiblePassIds, setVisiblePassIds] = useState({});

  const isVi = lang === 'vi';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // AI Security Support State
  const [showAiSupport, setShowAiSupport] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'bot',
      text: isVi
        ? 'Chào ní nha! Tui là Trợ lý Bảo mật OMEGA AI của ní đây. Ní đang gặp khó khăn hay sự cố gì liên quan tới tài khoản bảo mật của mình hông nè? Hãy chọn một tùy chọn bên dưới hoặc gõ trực tiếp câu hỏi cho tui biết nhe!'
        : 'Hello! I am the OMEGA AI Security Assistant. Are you having trouble with your account? Please choose a topic below or type your question.'
    }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');

  // HUD Face ID metrics states
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [scanPercentage, setScanPercentage] = useState(0);
  const [matchConfidence, setMatchConfidence] = useState(0);
  const [faceStatusText, setFaceStatusText] = useState('');

  // Multi-stage enrollment states
  const [enrollStage, setEnrollStage] = useState('straight'); // 'straight' | 'left' | 'right'
  const [straightSig, setStraightSig] = useState(null);
  const [leftSig, setLeftSig] = useState(null);
  const [straightPhoto, setStraightPhoto] = useState(null);
  const [leftPhoto, setLeftPhoto] = useState(null);
  const [cooldown, setCooldown] = useState(0); // Cooldown countdown timer in seconds

  // Transition countdown timer hook
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (faceIdScanMode === 'none') {
      setIsFaceDetected(false);
      setScanPercentage(0);
      setMatchConfidence(0);
      setFaceStatusText('');
      setEnrollStage('straight');
      setStraightSig(null);
      setLeftSig(null);
      setStraightPhoto(null);
      setLeftPhoto(null);
      setCooldown(0);
    }
  }, [faceIdScanMode]);

  // Video element and media stream references
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Real webcam video stream controller hook
  useEffect(() => {
    if (faceIdScanMode === 'scan_enroll' || faceIdScanMode === 'scan_login') {
      // Access user webcam camera stream
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 200, height: 200 } })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Safari/iOS compatibility play
            videoRef.current.play().catch(e => console.log("Video auto play prevented", e));
          }
        })
        .catch(err => {
          console.warn("Real Camera is unavailable or permission denied. Graceful fallback activated.", err);
        });
    }

    // Return cleanup: stop camera tracks immediately when scanning closes
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [faceIdScanMode]);

  // Real skin-tone biometric analyzer & Multi-User Chromatic Vector Matcher hook
  useEffect(() => {
    if (faceIdScanMode === 'none') return;

    let scanAttempts = 0;
    let successfulFaceChecks = 0;
    let lastExtractedSignature = null;

    // Helper: Extract L2-Normalized Spatial 8x8 Grid Signature focusing on central 70% of face region
    const extractFacialSignature = (ctx, width, height) => {
      const startX = Math.floor(width * 0.15);
      const endX = Math.floor(width * 0.85);
      const startY = Math.floor(height * 0.15);
      const endY = Math.floor(height * 0.85);

      const faceW = endX - startX;
      const faceH = endY - startY;

      const gridCols = 8;
      const gridRows = 8;
      const cellW = faceW / gridCols;
      const cellH = faceH / gridRows;

      const Y = [];
      const rChrom = [];
      const gChrom = [];

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const cx = Math.floor(startX + col * cellW);
          const cy = Math.floor(startY + row * cellH);
          const cw = Math.ceil(cellW);
          const ch = Math.ceil(cellH);

          const cellData = ctx.getImageData(cx, cy, cw, ch).data;

          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          for (let i = 0; i < cellData.length; i += 4) {
            sumR += cellData[i];
            sumG += cellData[i + 1];
            sumB += cellData[i + 2];
            count++;
          }

          const avgR = count > 0 ? sumR / count : 0;
          const avgG = count > 0 ? sumG / count : 0;
          const avgB = count > 0 ? sumB / count : 0;

          // Standard relative luminance
          const lum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
          const sumColor = avgR + avgG + avgB + 0.0001;

          Y.push(lum);
          rChrom.push(avgR / sumColor);
          gChrom.push(avgG / sumColor);
        }
      }

      // Mean-Centering & L2 Unit Vector Normalization for complete lighting invariance
      const meanY = Y.reduce((a, b) => a + b, 0) / Y.length;
      const centeredY = Y.map(y => y - meanY);
      const l2Norm = Math.sqrt(centeredY.reduce((sum, val) => sum + val * val, 0));
      const normY = centeredY.map(y => y / (l2Norm + 0.0001));

      // Color Chromaticity Mean-Centering
      const meanR = rChrom.reduce((a, b) => a + b, 0) / rChrom.length;
      const centeredR = rChrom.map(r => r - meanR);
      const meanG = gChrom.reduce((a, b) => a + b, 0) / gChrom.length;
      const centeredG = gChrom.map(g => g - meanG);

      return {
        lum: normY,
        rChrom: centeredR,
        gChrom: centeredG
      };
    };

    // Helper: Calculate combined structure + color Euclidean distance
    const matchFacialSignature = (currentSig, enrolledAccounts) => {
      let bestMatch = null;
      let minDistance = Infinity;

      const getVectorDistance = (v1, v2) => {
        let sum = 0;
        for (let i = 0; i < v1.length; i++) {
          sum += Math.pow(v1[i] - v2[i], 2);
        }
        return Math.sqrt(sum);
      };

      const evaluateMatchAngle = (savedAngleSig) => {
        if (!savedAngleSig || !savedAngleSig.lum) return Infinity;
        const distLum = getVectorDistance(currentSig.lum, savedAngleSig.lum);
        const distR = getVectorDistance(currentSig.rChrom, savedAngleSig.rChrom);
        const distG = getVectorDistance(currentSig.gChrom, savedAngleSig.gChrom);
        const distChrom = Math.sqrt(distR * distR + distG * distG);
        return distLum * 0.85 + distChrom * 0.15;
      };

      for (let account of enrolledAccounts) {
        const savedSig = account.signature;
        if (!savedSig) continue;

        let dist = Infinity;

        // Support for new 3-angle signature format
        if (savedSig.straight || savedSig.left || savedSig.right) {
          const distStraight = evaluateMatchAngle(savedSig.straight);
          const distLeft = evaluateMatchAngle(savedSig.left);
          const distRight = evaluateMatchAngle(savedSig.right);

          // Match the minimum distance across the three angles
          dist = Math.min(distStraight, distLeft, distRight);
        } else if (savedSig.lum) {
          // Backward compatibility for single-angle signatures
          dist = evaluateMatchAngle(savedSig);
        }

        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = account;
        }
      }

      // Return both matched account and its spatial distance for real-time confidence HUD
      return { matchedAccount: minDistance < 0.52 ? bestMatch : null, distance: minDistance };
    };

    const interval = setInterval(() => {
      if (cooldown > 0) {
        // Paused for countdown cooldown transition
        return;
      }
      scanAttempts++;

      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Perform standard RGB skin color segmentation to verify a human presence
        let skinPixels = 0;
        const totalPixels = canvas.width * canvas.height;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const isSkin = r > 95 && g > 40 && b > 20 &&
            (Math.max(r, g, b) - Math.min(r, g, b) > 15) &&
            Math.abs(r - g) > 15 && r > g && r > b;
          if (isSkin) skinPixels++;
        }

        const skinRatio = skinPixels / totalPixels;

        // 8% skin density threshold guarantees face presence
        if (skinRatio > 0.08) {
          setIsFaceDetected(true);
          successfulFaceChecks++;

          // Extract advanced chromatic-spatial signature
          lastExtractedSignature = extractFacialSignature(ctx, canvas.width, canvas.height);
          const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          if (faceIdScanMode === 'scan_enroll') {
            // Calculate percentage based on current stage: 3 checks per stage (approx 0.9s of stable face presence)
            setScanPercentage(Math.min(100, Math.round(successfulFaceChecks / 3 * 100)));

            if (enrollStage === 'straight') {
              setFaceStatusText(isVi ? 'GIỮ THẲNG: GHI NHẬN ĐẶC TRƯNG...' : 'LOOK STRAIGHT: CAPTURING...');
            } else if (enrollStage === 'left') {
              setFaceStatusText(isVi ? 'QUAY TRÁI: GHI NHẬN ĐẶC TRƯNG...' : 'TURN LEFT: CAPTURING...');
            } else if (enrollStage === 'right') {
              setFaceStatusText(isVi ? 'QUAY PHẢI: GHI NHẬN ĐẶC TRƯNG...' : 'TURN RIGHT: CAPTURING...');
            }

            // Move to next stage once 3 stable checks are done
            if (successfulFaceChecks >= 3) {
              if (enrollStage === 'straight') {
                setStraightSig(lastExtractedSignature);
                setStraightPhoto(photoDataUrl);
                setEnrollStage('left');
                setCooldown(3); // Pauses scanning for 3s to let the user turn head!
                successfulFaceChecks = 0;
                setScanPercentage(0);
                showToast(isVi ? 'Đã chụp góc thẳng! Hãy quay mặt sang TRÁI.' : 'Straight captured! Turn face LEFT.');
              } else if (enrollStage === 'left') {
                setLeftSig(lastExtractedSignature);
                setLeftPhoto(photoDataUrl);
                setEnrollStage('right');
                setCooldown(3); // Pauses scanning for 3s to let user turn head!
                successfulFaceChecks = 0;
                setScanPercentage(0);
                showToast(isVi ? 'Đã chụp góc trái! Hãy quay mặt sang PHẢI.' : 'Left captured! Turn face RIGHT.');
              } else if (enrollStage === 'right') {
                // Combine and save multi-angle signature and real snapshots!
                const updatedList = faceIdAccounts.filter(acc => acc.email !== pendingUser.email);
                updatedList.push({
                  email: pendingUser.email,
                  name: pendingUser.name,
                  avatar: pendingUser.avatar,
                  signature: {
                    straight: straightSig,
                    left: leftSig,
                    right: lastExtractedSignature
                  },
                  photos: {
                    straight: straightPhoto,
                    left: leftPhoto,
                    right: photoDataUrl
                  }
                });

                localStorage.setItem('omega-faceid-auth', JSON.stringify({
                  email: pendingUser.email,
                  name: pendingUser.name,
                  avatar: pendingUser.avatar
                }));

                setFaceIdAccounts(updatedList);

                setCurrentUser(pendingUser);

                setNotifications(prev => [
                  {
                    id: `NT-FACEID-REG-${Date.now()}`,
                    type: 'done',
                    title: isVi ? 'Đã liên kết Face ID 3D' : 'Face ID 3D Configured',
                    desc: isVi ? `Đã chụp và lưu 3 ảnh thật thẳng, trái, phải thành công cho ${pendingUser.email}.` : `Captured and saved 3 real photos (straight, left, right) for ${pendingUser.email}.`,
                    time: new Date().toTimeString().split(' ')[0]
                  },
                  ...prev
                ]);

                clearInterval(interval);
                setFaceIdScanMode('none');
                setShowFaceIdPrompt(false);
                setPendingUser(null);
                showToast(isVi ? 'Đăng ký Face ID đa góc & Đăng nhập thành công!' : 'Registered multi-angle Face ID & Logged in successfully!');
                setProfileMode('view');
              }
            }
          } else if (faceIdScanMode === 'scan_login') {
            setScanPercentage(Math.min(100, Math.round(successfulFaceChecks / 4 * 100)));

            const { matchedAccount, distance } = matchFacialSignature(lastExtractedSignature, faceIdAccounts);
            if (distance !== Infinity) {
              const confidenceScore = Math.max(0, Math.min(100, Math.round((1 - distance / 0.65) * 100)));
              setMatchConfidence(confidenceScore);
              if (matchedAccount) {
                setFaceStatusText(isVi ? `KHỚP: ${matchedAccount.name.toUpperCase()}` : `MATCH: ${matchedAccount.name.toUpperCase()}`);
              } else {
                setFaceStatusText(isVi ? 'ĐANG QUÉT ĐỐI CHIẾU...' : 'SCANNING FOR BIOMETRICS...');
              }
            }

            if (successfulFaceChecks >= 4) {
              clearInterval(interval);
              if (matchedAccount) {
                setCurrentUser({
                  name: matchedAccount.name,
                  email: matchedAccount.email,
                  avatar: matchedAccount.avatar
                });

                localStorage.setItem('omega-faceid-auth', JSON.stringify({
                  email: matchedAccount.email,
                  name: matchedAccount.name,
                  avatar: matchedAccount.avatar
                }));

                setNotifications(prev => [
                  {
                    id: `NT-FACEID-LOGIN-${Date.now()}`,
                    type: 'info',
                    title: isVi ? 'Đăng nhập Face ID' : 'Biometric Sign-In',
                    desc: isVi ? `Đã đối khớp thành công góc mặt cho tài khoản ${matchedAccount.email}.` : `Successfully matched biometric angle for ${matchedAccount.email}.`,
                    time: new Date().toTimeString().split(' ')[0]
                  },
                  ...prev
                ]);

                setFaceIdScanMode('none');
                showToast(isVi ? `Đã nhận diện: ${matchedAccount.name}!` : `Recognized: ${matchedAccount.name}!`);
                setProfileMode('view');
              } else {
                setFaceIdScanMode('none');
                showToast(isVi ? 'Lỗi: Gương mặt không khớp với bất kỳ tài khoản nào!' : 'Error: Face does not match any registered accounts!');
              }
            }
          }
        } else {
          setIsFaceDetected(false);
          setFaceStatusText(isVi ? 'VUI LÒNG ĐƯA MẶT VÀO KHUNG' : 'ALIGN FACE IN FRAME');
        }
      }

      // If we attempt for 12 seconds (40 iterations) and fail to complete stages: trigger warning and abort
      if (scanAttempts >= 40) {
        clearInterval(interval);
        setFaceIdScanMode('none');
        showToast(isVi
          ? 'Quá thời gian quét! Vui lòng làm theo hướng dẫn quay mặt thẳng, trái, phải và thử lại.'
          : 'Scanning timed out! Please follow instructions to scan straight, left, right angles and try again.'
        );
      }
    }, 300);

    return () => clearInterval(interval);
  }, [faceIdScanMode, pendingUser, enrollStage, straightSig, leftSig, straightPhoto, leftPhoto, cooldown]);

  // AI Security Support Chat Engine
  const handleSendAiMessage = (customText = '') => {
    const query = customText.trim() || aiChatInput.trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query };
    setAiChatHistory(prev => [...prev, userMsg]);
    setAiChatInput('');

    setTimeout(() => {
      let replyText = '';
      const lowercaseQuery = query.toLowerCase();

      if (lowercaseQuery.includes('mật khẩu') || lowercaseQuery.includes('password') || lowercaseQuery.includes('quên') || lowercaseQuery.includes('forgot')) {
        replyText = isVi
          ? '🔑 KHÔI PHỤC MẬT KHẨU NÈ NÍ:\n1️⃣ Nhấp vào nút "Quên mật khẩu?" ở khung đăng nhập nhe.\n2️⃣ Điền địa chỉ email của ní vào.\n3️⃣ Tui sẽ tức tốc gửi hướng dẫn lấy lại mật khẩu về hòm thư cho ní ngay lập tức nha!'
          : '🔑 PASSWORD RECOVERY:\n1. Click "Forgot password?" in the sign-in form.\n2. Input your registered email.\n3. The system will dispatch recovery guidelines to your inbox immediately.';
      } else if (lowercaseQuery.includes('đăng ký') || lowercaseQuery.includes('tạo') || lowercaseQuery.includes('register') || lowercaseQuery.includes('signup')) {
        replyText = isVi
          ? '📝 ĐĂNG KÝ TÀI KHOẢN MỚI CỰC DỄ:\n1️⃣ Ní nhấp qua tab "Đăng ký" kế bên nhe.\n2️⃣ Nhập đầy đủ Tên, Email với Mật khẩu ní chọn.\n3️⃣ Bấm nút "Khởi tạo tài khoản" là tui lập tài khoản rồi tự động đăng nhập đưa ní vào kho hàng làm việc luôn á!'
          : '📝 ACCOUNT REGISTRATION:\n1. Select the "Register" tab in this modal.\n2. Provide your Name, Email, and password.\n3. Click "Register Profile" to automatically log into the workspace.';
      } else if (lowercaseQuery.includes('face id') || lowercaseQuery.includes('khuôn mặt') || lowercaseQuery.includes('biometric') || lowercaseQuery.includes('gương mặt')) {
        replyText = isVi
          ? '👤 ĐĂNG NHẬP FACE ID SIÊU TỐC:\n1️⃣ Lần đầu ní cứ đăng nhập bằng Email bình thường nhe.\n2️⃣ Khi hệ thống hỏi, ní bấm "KÍCH HOẠT NGAY" để tui quét gương mặt liên kết.\n3️⃣ Lần sau, ní chỉ việc nhấp nút quét gương mặt màu cam (Face ID) là vèo một cái vào thẳng hệ thống luôn, khỏi gõ mật khẩu mỏi tay nhe ní iu!'
          : '👤 FACE ID AUTHENTICATION:\n1. Authenticate manually via Email for the first time.\n2. Click "ACTIVATE NOW" when prompted to save Face ID credentials.\n3. On future logins, click the orange Face Scan button to sign in instantly.';
      } else {
        replyText = isVi
          ? '🤖 Sự cố của ní tui đã ghi nhận rồi nhe. Tui đã gửi trực tiếp cho Ban kỹ thuật OMEGA Core để hỗ trợ ní. Ní cũng có thể gửi mail cho support@omega.io để được các bạn kỹ thuật hỗ trợ thủ công, hoặc nhấp nút Gmail liên kết bên ngoài để đăng nhập siêu tốc nha!'
          : '🤖 Your query has been routed to the OMEGA Core engineers. Feel free to contact support@omega.io for manual recovery, or use the Gmail quick connect button to access the demo data.';
      }

      setAiChatHistory(prev => [...prev, { sender: 'bot', text: replyText }]);
    }, 600);
  };

  // Avatar Upload Helper
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser(prev => ({
          ...prev,
          avatar: reader.result
        }));
        showToast(isVi ? 'Đã cập nhật ảnh đại diện!' : 'Avatar updated successfully!');

        // Push notification log
        setNotifications(prev => [
          {
            id: `NT-AVATAR-${Date.now()}`,
            type: 'done',
            title: isVi ? 'Cập nhật ảnh đại diện' : 'Avatar Changed',
            desc: isVi ? `Người dùng ${currentUser.name || 'Admin'} đã thay đổi ảnh đại diện tài khoản.` : `User ${currentUser.name || 'Admin'} updated their profile avatar.`,
            time: new Date().toTimeString().split(' ')[0]
          },
          ...prev
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manual Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    const username = loginEmail.split('@')[0].toUpperCase();
    const targetUser = {
      name: username,
      email: loginEmail,
      avatar: currentUser?.avatar || null
    };

    // Verify password for registered accounts
    const foundAcc = registeredAccounts.find(acc => acc.email === loginEmail);
    if (foundAcc) {
      if (foundAcc.password !== loginPassword) {
        showToast(isVi ? 'Mật khẩu bảo mật không chính xác!' : 'Incorrect password!');
        return;
      }
      // Update name to matching registered name
      targetUser.name = foundAcc.name;
    } else {
      // Auto register new staff account to populate developer logs on-the-fly
      const newAcc = {
        name: username,
        email: loginEmail,
        password: loginPassword,
        role: 'staff',
        date: new Date().toISOString().split('T')[0]
      };
      setRegisteredAccounts(prev => [...prev, newAcc]);
    }

    // Check if Face ID is already set up for this email
    const faceIdEnrolled = localStorage.getItem('omega-faceid-auth');
    let parsedEnroll = null;
    try {
      parsedEnroll = faceIdEnrolled ? JSON.parse(faceIdEnrolled) : null;
    } catch (err) { }

    if (parsedEnroll && parsedEnroll.email === loginEmail) {
      setCurrentUser(targetUser);
      setNotifications(prev => [
        {
          id: `NT-LOGIN-${Date.now()}`,
          type: 'info',
          title: isVi ? 'Đăng nhập thành công' : 'User Logged In',
          desc: isVi ? `Tài khoản ${loginEmail} đã kết nối phiên làm việc mới.` : `Session initialized for account ${loginEmail}.`,
          time: new Date().toTimeString().split(' ')[0]
        },
        ...prev
      ]);
      showToast(isVi ? 'Đăng nhập thành công!' : 'Logged in successfully!');
      setProfileMode('view');
    } else {
      setPendingUser(targetUser);
      setShowFaceIdPrompt(true);
    }
  };

  // Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirmPassword) return;
    if (regPassword !== regConfirmPassword) {
      showToast(isVi ? 'Mật khẩu xác nhận không khớp!' : 'Passwords do not match!');
      return;
    }

    // Check if email already registered
    if (registeredAccounts.some(acc => acc.email === regEmail)) {
      showToast(isVi ? 'Email này đã được đăng ký!' : 'Email already registered!');
      return;
    }

    const targetUser = {
      name: regName,
      email: regEmail,
      avatar: null
    };

    // Save to registered accounts directory
    const newAcc = {
      name: regName,
      email: regEmail,
      password: regPassword,
      role: 'staff',
      date: new Date().toISOString().split('T')[0]
    };
    setRegisteredAccounts(prev => [...prev, newAcc]);

    setPendingUser(targetUser);
    setShowFaceIdPrompt(true);
  };

  // Gmail OAuth mock
  const handleGmailOAuth = () => {
    setCurrentUser({
      name: 'Google Member',
      email: 'member.omega@gmail.com',
      avatar: null
    });

    setNotifications(prev => [
      {
        id: `NT-GMAIL-${Date.now()}`,
        type: 'info',
        title: isVi ? 'Liên kết Google' : 'Google Log In',
        desc: isVi ? 'Đăng nhập thông qua tài khoản Google Gmail thành công.' : 'Successfully authenticated via Gmail credentials.',
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);

    showToast(isVi ? 'Đã liên kết Gmail và Đăng nhập!' : 'Gmail connected successfully!');
    setProfileMode('view');
  };

  // Password Recovery mock
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    showToast(isVi ? `Yêu cầu khôi phục mật khẩu đã gửi tới: ${forgotEmail}` : `Password recovery link dispatched to ${forgotEmail}`);
    setShowForgot(false);
    setForgotEmail('');
  };

  // Handle Logout
  const handleLogoutAction = () => {
    setCurrentUser({
      name: 'Guest User',
      email: 'guest@omega.io',
      avatar: null
    });
    setNotifications(prev => [
      {
        id: `NT-LOGOUT-${Date.now()}`,
        type: 'warning',
        title: isVi ? 'Đã Đăng Xuất' : 'User Signed Out',
        desc: isVi ? 'Đã đóng phiên làm việc của tài khoản.' : 'Active profile session has been closed.',
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);
    setIsProfileOpen(false);
    go('landing');
  };

  // High-tech breadcrumbs based on page ID
  const getBreadcrumb = () => {
    if (activePage === 'dashboard') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Màn hình điều khiển trung tâm' : 'Command center'}
        </span>
      );
    }
    if (activePage === 'inventory') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Quản lý kho & SKU' : 'Inventory management'}
        </span>
      );
    }
    if (activePage === 'purchase') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Quản lý cung ứng (Procurement)' : 'Purchase procurement'}
        </span>
      );
    }
    if (activePage === 'operations') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Vận hành xuất nhập kho' : 'Stock movements'}
        </span>
      );
    }
    if (activePage === 'reports') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Báo cáo & phân tích AI' : 'AI predictor & reports'}
        </span>
      );
    }
    if (activePage === 'partners') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Quản lý đối tác & khách hàng' : 'Partners & clients'}
        </span>
      );
    }
    if (activePage === 'settings') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Cài đặt hệ thống' : 'System settings'}
        </span>
      );
    }
    if (activePage === 'developer') {
      return (
        <span className="font-sans font-bold text-sm text-zinc-200">
          {isVi ? 'Cài đặt phát triển' : 'Developer settings'}
        </span>
      );
    }
    return <span className="font-sans font-bold text-sm text-zinc-200">Omega Logistics</span>;
  };

  return (
    <header
      className="flex items-center justify-between gap-4 px-8 py-3.5 border-b border-[var(--border)] sticky top-0 z-30 select-none"
      style={{ background: 'var(--header-bg)' }}
    >
      <div className="flex items-center gap-4">
        {getBreadcrumb()}
        <span className="w-1.5 h-0.5 bg-[#ff7a45]/30 rounded hidden sm:inline" />
        <p className="font-mono text-[9px] font-bold text-[#ff7a45]/60 tracking-wider hidden sm:block">
          SYS_READY // v1.0
        </p>
      </div>

      <div className="flex-1 max-w-sm mx-auto w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="search"
            placeholder={isVi ? 'TÌM KIẾM...' : 'SEARCH...'}
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="w-full pl-9 pr-4 py-1.5 font-mono text-[10px] tracking-wider rounded border border-[var(--border)] outline-none focus:border-[#ff7a45]/50 transition-colors"
            style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 text-zinc-400">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center hover:opacity-75 transition-opacity text-zinc-400 cursor-pointer"
          style={{ background: 'var(--bg-input)' }}
          title={theme === 'dark' ? (isVi ? 'Chuyển sang Nền Sáng' : 'Switch to Light Mode') : (isVi ? 'Chuyển sang Nền Tối' : 'Switch to Dark Mode')}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#ff7a45]" /> : <Moon className="w-3.5 h-3.5 text-[#ff7a45]" />}
        </button>

        {/* Language Toggle Button */}
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
          className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center hover:opacity-75 transition-opacity font-mono text-[10px] font-bold text-[#ff7a45] uppercase cursor-pointer"
          style={{ background: 'var(--bg-input)' }}
          title={lang === 'en' ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
        >
          {lang === 'en' ? 'EN' : 'VI'}
        </button>

        {/* Dynamic Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center hover:opacity-75 transition-opacity text-zinc-400 cursor-pointer relative"
            style={{ background: 'var(--bg-input)' }}
            aria-label="Notifications"
            title={isVi ? 'Thông báo hệ thống' : 'System Notifications'}
          >
            <Bell className="w-3.5 h-3.5" />
            {notifications && notifications.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1 min-w-[15px] h-[15px] rounded-full bg-[#ff7a45] text-zinc-950 font-mono font-black text-[8px] flex items-center justify-center border border-[#0c0c0e]">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <>
              {/* Invisible backdrop to dismiss dropdown on click outside */}
              <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsNotifOpen(false)} />

              <div className="absolute right-0 mt-2.5 w-80 bg-[#0c0c0e] border border-[#22202a] rounded shadow-[0_8px_32px_rgba(0,0,0,0.9)] z-50 text-left overflow-hidden font-sans border-t-2 border-t-[#ff7a45]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#22202a] bg-[#0e0e11]">
                  <span className="font-mono text-[9px] font-extrabold text-[#ff7a45] uppercase tracking-wider">
                    {isVi ? 'Thông báo hệ thống' : 'System Alerts'}
                  </span>
                  {notifications && notifications.length > 0 && (
                    <button
                      onClick={() => {
                        setNotifications([]);
                        setIsNotifOpen(false);
                      }}
                      className="font-mono text-[8px] font-black text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      {isVi ? 'Dọn sạch' : 'Clear all'}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-[#1b1a20]">
                  {!notifications || notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                      {isVi ? 'Không có thông báo mới' : 'No new notifications'}
                    </div>
                  ) : (
                    notifications.map((n) => {
                      let borderClass = 'border-l-2 border-l-zinc-700';
                      let typeColor = 'text-zinc-500';
                      if (n.type === 'done') { borderClass = 'border-l-2 border-l-emerald-500'; typeColor = 'text-emerald-400'; }
                      if (n.type === 'warning') { borderClass = 'border-l-2 border-l-amber-500'; typeColor = 'text-amber-400'; }
                      if (n.type === 'critical') { borderClass = 'border-l-2 border-l-rose-500'; typeColor = 'text-rose-400 font-black'; }
                      if (n.type === 'info') { borderClass = 'border-l-2 border-l-[#ff7a45]'; typeColor = 'text-[#ff9e7d]'; }

                      return (
                        <div key={n.id} className={`px-4 py-3.5 bg-zinc-950/20 hover:bg-zinc-900/20 transition-colors ${borderClass}`}>
                          <div className="flex justify-between items-start gap-3">
                            <span className={`text-[9px] font-mono uppercase tracking-wider font-extrabold ${typeColor}`}>
                              {isVi ? n.title : (n.titleEn || n.title)}
                            </span>
                            <span className="font-mono text-[8px] text-zinc-500 font-semibold shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-relaxed mt-1 font-sans">
                            {isVi ? n.desc : (n.descEn || n.desc)}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dynamic User Profile Avatar Button */}
        <button
          type="button"
          onClick={() => {
            // If user is guest or unlogged, open directly inside login tab
            if (!currentUser || currentUser.name === 'Guest User') {
              setProfileMode('login');
            } else {
              setProfileMode('view');
            }
            setIsProfileOpen(true);
          }}
          className="w-8 h-8 rounded-full border border-[var(--border)] hover:border-[#ff7a45]/50 flex items-center justify-center hover:opacity-75 transition-all cursor-pointer overflow-hidden relative shrink-0"
          title={isVi ? 'Tài khoản người dùng' : 'User Account Profile'}
        >
          {currentUser && currentUser.avatar ? (
            <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono font-black text-[9px] text-[#ff7a45] bg-[#ff7a45]/5 uppercase">
              {currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-zinc-500" />}
            </div>
          )}
        </button>
      </div>

      {/* ─── DYNAMIC ACCOUNT LOGIN / REGISTER & PROFILE MODAL ─── */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs select-none">
          <div className="bg-[#0c0c0e] border border-[#22202a] w-full max-w-sm rounded-lg p-6 overflow-hidden relative border-t-4 border-t-[#ff7a45] shadow-[0_8px_32px_rgba(0,0,0,0.85)] font-sans">

            {/* Close Button */}
            <button
              onClick={() => {
                setIsProfileOpen(false);
                setShowForgot(false);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-bold font-mono text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            {/* Glowing toast notification in modal */}
            {toastMessage && (
              <div className="absolute top-4 left-4 right-12 bg-[#ff7a45]/10 border border-[#ff7a45]/40 text-[#ff9e7d] text-[10px] font-mono font-bold tracking-wider py-2 px-3 rounded flex items-center justify-between animate-pulse z-50 shadow-md">
                <span>{toastMessage}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            )}

            {/* ────────── FACE ID SCANNING ANIMATION OVERLAY ────────── */}
            {faceIdScanMode !== 'none' && (
              <div className="absolute inset-0 bg-[#0c0c0e]/97 z-50 flex flex-col items-center justify-center p-6 text-center select-none font-sans border-t-4 border-t-[#ff7a45] animate-fade-in">

                {/* Biometric Multi-Stage Header Checklist */}
                {faceIdScanMode === 'scan_enroll' && (
                  <div className="flex items-center justify-center gap-4 mb-4 font-mono text-[8px] uppercase tracking-wider font-extrabold select-none">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 text-[8px] ${straightSig
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold shadow-[0_0_5px_#10b981]'
                        : enrollStage === 'straight'
                          ? 'bg-[#ff7a45]/10 border-[#ff7a45] text-[#ff7a45] animate-pulse shadow-[0_0_5px_#ff7a45]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                        }`}>
                        {straightSig ? '✓' : '1'}
                      </span>
                      <span className={straightSig ? 'text-emerald-400 font-bold' : enrollStage === 'straight' ? 'text-[#ff9e7d] font-bold' : 'text-zinc-500'}>
                        {isVi ? 'Thẳng' : 'Straight'}
                      </span>
                    </div>

                    <span className="w-4 h-px bg-zinc-800" />

                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 text-[8px] ${leftSig
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold shadow-[0_0_5px_#10b981]'
                        : enrollStage === 'left'
                          ? 'bg-[#ff7a45]/10 border-[#ff7a45] text-[#ff7a45] animate-pulse shadow-[0_0_5px_#ff7a45]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                        }`}>
                        {leftSig ? '✓' : '2'}
                      </span>
                      <span className={leftSig ? 'text-emerald-400 font-bold' : enrollStage === 'left' ? 'text-[#ff9e7d] font-bold' : 'text-zinc-500'}>
                        {isVi ? 'Trái' : 'Left'}
                      </span>
                    </div>

                    <span className="w-4 h-px bg-zinc-800" />

                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 text-[8px] ${enrollStage === 'right' && scanPercentage === 100
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold shadow-[0_0_5px_#10b981]'
                        : enrollStage === 'right'
                          ? 'bg-[#ff7a45]/10 border-[#ff7a45] text-[#ff7a45] animate-pulse shadow-[0_0_5px_#ff7a45]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                        }`}>
                        {enrollStage === 'right' && scanPercentage === 100 ? '✓' : '3'}
                      </span>
                      <span className={enrollStage === 'right' && scanPercentage === 100 ? 'text-emerald-400 font-bold' : enrollStage === 'right' ? 'text-[#ff9e7d] font-bold' : 'text-zinc-500'}>
                        {isVi ? 'Phải' : 'Right'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative w-28 h-28 border border-[#ff7a45]/30 rounded-full flex items-center justify-center bg-zinc-950/80 mb-4 shadow-[0_0_25px_rgba(255,122,69,0.2)] overflow-hidden">
                  <div className="absolute inset-0 border border-dashed border-[#ff7a45]/30 rounded-full animate-spin" style={{ animationDuration: '12s' }} />

                  {/* Real-time HTML5 webcam stream */}
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover rounded-full scale-x-[-1] z-10"
                    muted
                    playsInline
                  />

                  {/* Cyber Glowing 8x8 Point Scanning Mesh Overlay */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5 p-2 z-20 pointer-events-none opacity-85">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-0.5 h-0.5 rounded-full transition-all duration-300 ${isFaceDetected
                          ? 'bg-emerald-400 shadow-[0_0_5px_#34d399] scale-125'
                          : 'bg-[#ff7a45]/20 scale-90'
                          }`}
                      />
                    ))}
                  </div>

                  {/* High-tech Glowing Countdown Overlay inside video sphere */}
                  {cooldown > 0 && (
                    <div className="absolute inset-0 bg-[#0c0c0e]/92 flex flex-col items-center justify-center z-40 select-none pointer-events-none animate-fade-in">
                      <span className="text-[7.5px] text-[#ff7a45] font-black tracking-widest uppercase mb-1">
                        {isVi ? 'ĐỔI GÓC MẶT' : 'ROTATE HEAD'}
                      </span>
                      <span className="text-3xl font-mono text-[#ff9e7d] font-black animate-ping">
                        {cooldown}
                      </span>
                    </div>
                  )}

                  {/* Fallback User silhouette under stream */}
                  <User className="w-12 h-12 text-[#ff7a45]/30 animate-pulse absolute z-0" />

                  {/* Cyber Laser line animation overlay */}
                  <div className="absolute left-0 right-0 h-0.5 bg-[#ff7a45] shadow-[0_0_12px_#ff7a45] animate-bounce top-1/2 z-30" />
                </div>

                <h4 className="font-mono text-xs font-bold text-zinc-200 uppercase tracking-widest animate-pulse">
                  {faceIdScanMode === 'scan_enroll'
                    ? (isVi ? `ĐĂNG KÝ FACE ID: BƯỚC ${enrollStage === 'straight' ? '1/3' : enrollStage === 'left' ? '2/3' : '3/3'}` : `FACE ID ENROLL: STEP ${enrollStage === 'straight' ? '1/3' : enrollStage === 'left' ? '2/3' : '3/3'}`)
                    : (isVi ? 'ĐANG QUÉT GƯƠNG MẶT...' : 'VERIFYING FACE ID...')}
                </h4>
                <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-wider mt-1 mb-4">
                  {faceIdScanMode === 'scan_enroll'
                    ? (cooldown > 0
                      ? (enrollStage === 'left'
                        ? (isVi ? 'Hãy chuẩn bị xoay mặt sang TRÁI' : 'Prepare to rotate face LEFT')
                        : (isVi ? 'Hãy chuẩn bị xoay mặt sang PHẢI' : 'Prepare to rotate face RIGHT'))
                      : (enrollStage === 'straight'
                        ? (isVi ? 'Vui lòng nhìn thẳng trực diện' : 'Please look straight into camera')
                        : enrollStage === 'left'
                          ? (isVi ? 'Nghiêng mặt nhẹ sang bên TRÁI' : 'Turn your face slightly LEFT')
                          : (isVi ? 'Nghiêng mặt nhẹ sang bên PHẢI' : 'Turn your face slightly RIGHT')))
                    : (isVi ? 'Vui lòng nhìn thẳng vào camera' : 'Please look straight into the camera')}
                </p>

                {/* Cyber Scanner HUD Panel */}
                <div className="w-full max-w-[240px] font-mono space-y-2 text-left">
                  {/* Progress bar line */}
                  <div className="w-full bg-zinc-900 border border-zinc-800/80 h-1.5 rounded-full overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-[#ff7a45] to-[#ff9e7d] h-full transition-all duration-300 shadow-[0_0_8px_#ff7a45]"
                      style={{ width: `${scanPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[8px] uppercase tracking-wider font-extrabold">
                    <span className={isFaceDetected ? "text-emerald-400 font-extrabold" : "text-zinc-500 animate-pulse"}>
                      {cooldown > 0
                        ? (isVi ? '⌛ ĐANG ĐỆM TẠM DỪNG' : '⌛ PAUSED FOR ROTATION')
                        : isFaceDetected
                          ? (isVi ? '● ĐÃ PHÁT HIỆN KHUÔN MẶT' : '● FACE DETECTED')
                          : (isVi ? '○ ĐANG DÒ TÌM GƯƠNG MẶT' : '○ POSITIONING FACE...')}
                    </span>
                    <span className="text-zinc-400 font-bold">{scanPercentage}%</span>
                  </div>

                  <div className="p-2 bg-zinc-950/90 border border-zinc-900/60 rounded flex flex-col items-center justify-center min-h-[44px]">
                    <span className={`text-[8.5px] font-black tracking-widest uppercase transition-colors text-center ${cooldown > 0 ? 'text-[#ff7a45]' : isFaceDetected ? 'text-[#ff9e7d]' : 'text-zinc-500'
                      }`}>
                      {cooldown > 0
                        ? (isVi ? `CHUYỂN TƯ THẾ TRONG ${cooldown}s...` : `ROTATION WINDOW: ${cooldown}s...`)
                        : faceStatusText || (isVi ? 'ĐANG PHÂN TÍCH LƯỚI 64-ĐIỂM...' : 'ANALYZING 64-POINT GRID...')}
                    </span>
                    {isFaceDetected && matchConfidence > 0 && faceIdScanMode === 'scan_login' && (
                      <span className="text-[7.5px] text-emerald-400 font-extrabold mt-1 tracking-wider uppercase animate-pulse">
                        {isVi ? `ĐỘ PHÙ HỢP KHÔNG GIAN: ${matchConfidence}%` : `SPATIAL COMPATIBILITY: ${matchConfidence}%`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ────────── BIOMETRIC FACE ID ACTIVATE PROMPT ────────── */}
            {showFaceIdPrompt && faceIdScanMode === 'none' && (
              <div className="text-center pt-4 font-sans">
                <div className="w-16 h-16 border border-[#ff7a45]/30 rounded-full flex items-center justify-center bg-zinc-950 mx-auto mb-5 shadow-[0_0_15px_rgba(255,122,69,0.08)]">
                  {/* Biometric Face scanner icon simulation */}
                  <div className="relative w-10 h-10 border border-dashed border-[#ff7a45]/40 rounded-full flex items-center justify-center animate-pulse">
                    <User className="w-5 h-5 text-[#ff7a45]" />
                  </div>
                </div>

                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff7a45] mb-2.5">
                  {isVi ? 'KÍCH HOẠT FACE ID?' : 'ACTIVATE FACE ID?'}
                </h3>
                <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-wider mb-6 font-mono px-2">
                  {isVi
                    ? 'Bạn có muốn lưu thông tin tài khoản để liên kết với nhận diện khuôn mặt (Face ID) cho các lần đăng nhập siêu tốc tiếp theo không?'
                    : 'Would you like to link this account with Face ID to enable secure biometric sign-in in future sessions?'
                  }
                </p>

                <div className="flex flex-col gap-2 border-t border-zinc-900 pt-4">
                  <button
                    onClick={() => setFaceIdScanMode('scan_enroll')}
                    className="w-full py-2.5 bg-[#ff7a45] hover:bg-[#ff9e7d] text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer"
                  >
                    {isVi ? 'KÍCH HOẠT NGAY' : 'ACTIVATE SECURE FACE ID'}
                  </button>
                  <button
                    onClick={() => {
                      // Reject Face ID, login normally
                      setCurrentUser(pendingUser);
                      setNotifications(prev => [
                        {
                          id: `NT-LOGIN-${Date.now()}`,
                          type: 'info',
                          title: isVi ? 'Đăng nhập thành công' : 'User Logged In',
                          desc: isVi ? `Tài khoản ${pendingUser.email} đã kết nối phiên làm việc mới.` : `Session initialized for account ${pendingUser.email}.`,
                          time: new Date().toTimeString().split(' ')[0]
                        },
                        ...prev
                      ]);
                      showToast(isVi ? 'Đăng nhập thành công!' : 'Logged in successfully!');
                      setShowFaceIdPrompt(false);
                      setPendingUser(null);
                      setProfileMode('view');
                    }}
                    className="w-full py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300 font-mono text-[9px] uppercase tracking-widest rounded transition-colors cursor-pointer"
                  >
                    {isVi ? 'BỎ QUA LẦN NÀY' : 'SKIP FOR NOW'}
                  </button>
                </div>
              </div>
            )}

            {/* ────────── AI SECURITY DIRECT SUPPORT CHAT PANEL ────────── */}
            {!showFaceIdPrompt && showAiSupport && faceIdScanMode === 'none' && (
              <div className="pt-2 font-sans text-left">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff7a45] mb-1.5 flex items-center gap-1.5">
                  <span className="animate-pulse">💬</span>
                  {isVi ? 'TRỢ LÝ BẢO MẬT AI' : 'AI SECURITY COMPANION'}
                </h3>
                <p className="text-[8px] text-zinc-500 leading-relaxed uppercase tracking-wider mb-4 font-mono">
                  {isVi ? 'Giải quyết sự cố tài khoản, mật khẩu và sinh trắc học' : 'Biometric, credential and account support'}
                </p>

                {/* Simulated chat message window */}
                <div className="bg-zinc-950/60 border border-zinc-900 rounded p-3 h-48 overflow-y-auto font-mono text-[9px] mb-3 space-y-3 scrollbar-thin">
                  {aiChatHistory.map((chat, idx) => {
                    const isBot = chat.sender === 'bot';
                    return (
                      <div key={idx} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                        <span className="text-[7px] text-zinc-600 block mb-0.5 uppercase tracking-widest font-black">
                          {isBot ? 'OMEGA SECURITY AI' : 'YOU'}
                        </span>
                        <div className={`p-2 rounded max-w-[85%] whitespace-pre-line leading-relaxed ${isBot ? 'bg-zinc-900 border border-zinc-850 text-zinc-300' : 'bg-[#ff7a45]/10 border border-[#ff7a45]/30 text-[#ff9e7d]'
                          }`}>
                          {chat.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Topic quick selectors */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <button
                    onClick={() => handleSendAiMessage(isVi ? 'Tôi quên mật khẩu tài khoản' : 'I forgot my password')}
                    className="border border-zinc-800 bg-zinc-900/30 hover:bg-[#ff7a45]/5 hover:border-[#ff7a45]/30 rounded py-1 px-2 text-[8px] cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors uppercase tracking-wider font-mono font-bold"
                  >
                    🔑 {isVi ? 'Quên mật khẩu' : 'Forgot Password'}
                  </button>
                  <button
                    onClick={() => handleSendAiMessage(isVi ? 'Cách đăng ký tài khoản mới' : 'How to register a new account')}
                    className="border border-zinc-800 bg-zinc-900/30 hover:bg-[#ff7a45]/5 hover:border-[#ff7a45]/30 rounded py-1 px-2 text-[8px] cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors uppercase tracking-wider font-mono font-bold"
                  >
                    📝 {isVi ? 'Cách đăng ký' : 'How to Register'}
                  </button>
                  <button
                    onClick={() => handleSendAiMessage(isVi ? 'Làm sao đăng nhập bằng Face ID' : 'How to use Face ID sign-in')}
                    className="border border-zinc-800 bg-zinc-900/30 hover:bg-[#ff7a45]/5 hover:border-[#ff7a45]/30 rounded py-1 px-2 text-[8px] cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors uppercase tracking-wider font-mono font-bold"
                  >
                    👤 {isVi ? 'Kích hoạt Face ID' : 'Setup Face ID'}
                  </button>
                </div>

                {/* Chat Custom input form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiMessage();
                  }}
                  className="flex gap-2 mb-4"
                >
                  <input
                    type="text"
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    placeholder={isVi ? 'Nhập nội dung sự cố bảo mật...' : 'Type account security issue...'}
                    className="flex-1 bg-zinc-950 border border-zinc-850 focus:border-[#ff7a45]/50 outline-none rounded py-1.5 px-3 font-mono text-[9px] text-zinc-200"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-3.5 bg-[#ff7a45] hover:bg-[#ff9e7d] text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer shrink-0"
                  >
                    {isVi ? 'GỬI' : 'SEND'}
                  </button>
                </form>

                {/* Action back */}
                <div className="border-t border-zinc-900 pt-3">
                  <button
                    onClick={() => setShowAiSupport(false)}
                    className="w-full py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 text-zinc-400 font-mono text-[9px] uppercase tracking-widest font-bold rounded transition-colors cursor-pointer"
                  >
                    {isVi ? 'Quay lại cổng đăng nhập' : 'Return to Login'}
                  </button>
                </div>
              </div>
            )}

            {/* ────────── VIEW MODE: USER LOGGED IN PROFILE ────────── */}
            {profileMode === 'view' && currentUser && currentUser.name !== 'Guest User' && !showFaceIdPrompt && !showAiSupport && (
              <div className="text-center pt-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff7a45] mb-6">
                  {isVi ? 'TÀI KHOẢN HỆ THỐNG' : 'USER SECURITY PROFILE'}
                </h3>

                {/* File Upload Trigger for Avatar */}
                <div className="flex flex-col items-center justify-center gap-3.5 mb-6 group relative">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-[#ff7a45]/40 flex items-center justify-center bg-zinc-950 shadow-lg">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono font-black text-2xl text-zinc-200 bg-gradient-to-tr from-zinc-900 to-zinc-950">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Camera hover overlay */}
                    <label
                      htmlFor="avatar-upload-input"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-[#ff7a45]"
                    >
                      <Camera className="w-5 h-5 animate-pulse" />
                    </label>
                  </div>

                  <input
                    type="file"
                    id="avatar-upload-input"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  <label
                    htmlFor="avatar-upload-input"
                    className="text-[9px] font-mono font-bold text-zinc-500 hover:text-[#ff7a45] cursor-pointer transition-colors border border-zinc-800 hover:border-[#ff7a45]/30 rounded py-1 px-3 bg-zinc-950/40 uppercase tracking-widest"
                  >
                    {isVi ? 'Thay đổi ảnh đại diện' : 'Change Avatar'}
                  </label>
                </div>

                {/* Profile Details */}
                <div className="space-y-3.5 text-left mb-6 font-mono">
                  <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-sm">
                    <label className="text-[8px] font-bold text-zinc-600 block mb-0.5 uppercase tracking-widest">{isVi ? 'HỌ VÀ TÊN' : 'USER FULLNAME'}</label>
                    <span className="text-zinc-200 text-[11px] font-extrabold uppercase tracking-wide">{currentUser.name}</span>
                  </div>
                  <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-sm">
                    <label className="text-[8px] font-bold text-zinc-600 block mb-0.5 uppercase tracking-widest">{isVi ? 'ĐỊA CHỈ EMAIL' : 'EMAIL ACCOUNT'}</label>
                    <span className="text-zinc-400 text-[11px] font-mono">{currentUser.email}</span>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900">
                  <button
                    onClick={() => setProfileMode('login')}
                    className="w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-[#ff7a45]/30 text-zinc-400 hover:text-[#ff9e7d] font-mono text-[9px] uppercase tracking-widest font-bold rounded transition-colors cursor-pointer"
                  >
                    {isVi ? 'Đăng nhập tài khoản khác' : 'Switch accounts'}
                  </button>
                  <button
                    onClick={handleLogoutAction}
                    className="w-full py-2 bg-[#ff7a45]/5 hover:bg-rose-500/5 border border-dashed border-[#ff7a45]/30 hover:border-rose-500/30 text-[#ff7a45] hover:text-rose-400 font-mono text-[9px] uppercase tracking-widest font-black rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3 h-3" />
                    {isVi ? 'ĐĂNG XUẤT PHIÊN LÀM VIỆC' : 'TERMINATE ACTIVE SESSION'}
                  </button>
                </div>
              </div>
            )}

            {/* ────────── LOGIN MODE ────────── */}
            {profileMode === 'login' && !showForgot && !showFaceIdPrompt && !showAiSupport && (
              <div>
                {/* Tab selectors */}
                <div className="flex border-b border-zinc-900 mb-6 text-[10px] font-mono tracking-widest font-bold">
                  <button
                    className="flex-1 pb-3 text-center border-b-2 border-[#ff7a45] text-[#ff7a45] uppercase font-bold"
                  >
                    {isVi ? 'Đăng nhập' : 'Sign In'}
                  </button>
                  <button
                    onClick={() => {
                      setProfileMode('register');
                      setShowForgot(false);
                    }}
                    className="flex-1 pb-3 text-center text-zinc-500 hover:text-zinc-300 uppercase transition-colors font-bold"
                  >
                    {isVi ? 'Đăng ký' : 'Register'}
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="email"
                      placeholder={isVi ? 'Nhập tài khoản email...' : 'Enter your email...'}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 font-mono text-[10px] bg-zinc-950 border border-zinc-800 rounded outline-none focus:border-[#ff7a45]/50 text-zinc-200"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="password"
                      placeholder={isVi ? 'Nhập mật khẩu bảo mật...' : 'Enter your password...'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 font-mono text-[10px] bg-zinc-950 border border-zinc-800 rounded outline-none focus:border-[#ff7a45]/50 text-zinc-200"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-wider">
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-zinc-500 hover:text-[#ff9e7d] transition-colors cursor-pointer"
                    >
                      {isVi ? 'Quên mật khẩu?' : 'Forgot password?'}
                    </button>

                    {/* Direct AI Support Trigger button inside credentials forms */}
                    <button
                      type="button"
                      onClick={() => setShowAiSupport(true)}
                      className="text-[#ff7a45] hover:text-[#ff9e7d] transition-colors cursor-pointer flex items-center gap-1 uppercase"
                    >
                      <span>💬 AI TRỢ GIÚP</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#ff7a45] hover:bg-[#ff9e7d] text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer"
                    >
                      {isVi ? 'Đăng nhập hệ thống' : 'Authenticate Session'}
                    </button>

                    {/* Face ID Quick Authentication click trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        if (faceIdAccounts.length > 0) {
                          setFaceIdScanMode('scan_login');
                        } else {
                          // Fallback to check legacy omega-faceid-auth just in case
                          const legacy = localStorage.getItem('omega-faceid-auth');
                          if (legacy) {
                            setFaceIdScanMode('scan_login');
                          } else {
                            showToast(isVi ? 'Chưa có Face ID được đăng ký trên thiết bị!' : 'No registered Face ID found on this device!');
                          }
                        }
                      }}
                      className="w-full py-2 bg-zinc-950 hover:bg-[#ff7a45]/5 border border-zinc-850 hover:border-[#ff7a45]/30 flex items-center justify-center gap-2 font-mono text-[9px] text-[#ff7a45] font-bold uppercase tracking-widest rounded transition-all cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#ff7a45] inline-block shadow-[0_0_6px_#ff7a45] animate-pulse" />
                      {isVi ? 'ĐĂNG NHẬP BẰNG FACE ID' : 'SIGN IN WITH FACE ID'}
                    </button>
                  </div>
                </form>

                {/* Third-Party Gmail Login Option */}
                <div className="mt-5 pt-4 border-t border-zinc-900 text-center">
                  <span className="text-[8px] font-mono font-bold text-zinc-600 block mb-3.5 uppercase tracking-widest">
                    {isVi ? 'Hoặc kết nối bên thứ ba' : 'Or connect credentials via'}
                  </span>
                  <button
                    onClick={handleGmailOAuth}
                    className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-855 hover:border-zinc-800 flex items-center justify-center gap-2 font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-widest rounded transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_4px_#ef4444]" />
                    {isVi ? 'Đăng nhập bằng Gmail' : 'Log in with Gmail'}
                  </button>
                </div>
              </div>
            )}

            {/* ────────── REGISTER MODE ────────── */}
            {profileMode === 'register' && !showForgot && !showFaceIdPrompt && !showAiSupport && (
              <div>
                {/* Tab selectors */}
                <div className="flex border-b border-zinc-900 mb-6 text-[10px] font-mono tracking-widest font-bold">
                  <button
                    onClick={() => {
                      setProfileMode('login');
                      setShowForgot(false);
                    }}
                    className="flex-1 pb-3 text-center text-zinc-500 hover:text-zinc-300 uppercase transition-colors font-bold"
                  >
                    {isVi ? 'Đăng nhập' : 'Sign In'}
                  </button>
                  <button
                    className="flex-1 pb-3 text-center border-b-2 border-[#ff7a45] text-[#ff7a45] uppercase font-bold"
                  >
                    {isVi ? 'Đăng ký' : 'Register'}
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder={isVi ? 'Họ và tên của bạn...' : 'Your fullname...'}
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 font-mono text-[10px] bg-zinc-950 border border-zinc-800 rounded outline-none focus:border-[#ff7a45]/50 text-zinc-200"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="email"
                      placeholder={isVi ? 'Địa chỉ tài khoản email...' : 'Enter your email...'}
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 font-mono text-[10px] bg-zinc-950 border border-zinc-800 rounded outline-none focus:border-[#ff7a45]/50 text-zinc-200"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="password"
                      placeholder={isVi ? 'Thiết lập mật khẩu bảo mật...' : 'Choose a password...'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 font-mono text-[10px] bg-zinc-950 border border-zinc-800 rounded outline-none focus:border-[#ff7a45]/50 text-zinc-200"
                    />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="password"
                      placeholder={isVi ? 'Xác nhận lại mật khẩu...' : 'Confirm your password...'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 font-mono text-[10px] bg-zinc-950 border border-zinc-800 rounded outline-none focus:border-[#ff7a45]/50 text-zinc-200"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-wider">
                    <div />
                    <button
                      type="button"
                      onClick={() => setShowAiSupport(true)}
                      className="text-[#ff7a45] hover:text-[#ff9e7d] transition-colors cursor-pointer flex items-center gap-1 uppercase"
                    >
                      <span>💬 AI TRỢ GIÚP</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#ff7a45] hover:bg-[#ff9e7d] text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer"
                  >
                    {isVi ? 'Khởi tạo tài khoản' : 'Register Profile'}
                  </button>
                </form>

                {/* Third-Party Gmail Register Option */}
                <div className="mt-5 pt-3 border-t border-zinc-900 text-center">
                  <span className="text-[8px] font-mono font-bold text-zinc-600 block mb-2.5 uppercase tracking-widest">
                    {isVi ? 'Hoặc tạo tài khoản nhanh qua' : 'Or fast register with'}
                  </span>
                  <button
                    onClick={handleGmailOAuth}
                    className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-850 flex items-center justify-center gap-2 font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-widest rounded transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_4px_#ef4444]" />
                    {isVi ? 'Đăng ký bằng Gmail' : 'Register with Gmail'}
                  </button>
                </div>
              </div>
            )}

            {/* ────────── FORGOT PASSWORD MODAL ────────── */}
            {showForgot && (
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff7a45] mb-2.5">
                  {isVi ? 'KHÔI PHỤC MẬT KHẨU' : 'PASSWORD RECOVERY'}
                </h3>
                <p className="text-[9px] text-zinc-500 leading-relaxed font-sans mb-5 uppercase tracking-wider">
                  {isVi ? 'Nhập tài khoản email để nhận liên kết khôi phục khóa bảo mật.' : 'Enter your registered email below to receive key instructions.'}
                </p>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="email"
                      placeholder={isVi ? 'Nhập tài khoản email...' : 'Enter your email...'}
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 font-mono text-[10px] bg-zinc-950 border border-zinc-800 rounded outline-none focus:border-[#ff7a45]/50 text-zinc-200"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="flex-1 py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 text-zinc-400 font-mono text-[9px] uppercase tracking-widest rounded transition-colors cursor-pointer"
                    >
                      {isVi ? 'Quay lại' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#ff7a45] hover:bg-[#ff9e7d] text-zinc-950 font-mono font-bold tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer"
                    >
                      {isVi ? 'Gửi yêu cầu' : 'Submit request'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
}

function App() {
  const { activePage, sidebarOpen, setSidebarOpen } = useApp();
  const Page = PAGES[activePage] || LandingPage;

  const isLandingPage = activePage === 'landing';

  return (
    <div className="min-h-screen flex relative" style={{ background: 'var(--bg-root)' }}>
      {/* Cyber grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {sidebarOpen && !isLandingPage && (
        <button
          type="button"
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Renders Left Sidebar if not on landing page */}
      {!isLandingPage && (
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <Sidebar />
          <button
            type="button"
            className="absolute top-4 right-4 p-1.5 lg:hidden rounded border border-zinc-800 bg-zinc-900 text-zinc-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Mobile Header Bar */}
        {!isLandingPage && (
          <div className="lg:hidden flex items-center justify-between px-6 py-3 border-b border-[var(--border)]" style={{ background: 'var(--bg-sidebar)' }}>
            <button type="button" onClick={() => setSidebarOpen(true)} className="text-zinc-300">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-sm tracking-wide text-zinc-100">Omega</span>
            </div>
            <div className="w-5" />
          </div>
        )}

        {/* Workspace Top Header Bar */}
        {!isLandingPage && <TopHeader />}

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 select-none">
              <div className="w-8 h-8 border-2 border-dashed border-[#ff7a45] rounded-full animate-spin" />
              <span className="font-mono text-[9px] text-[#ff7a45] uppercase tracking-widest animate-pulse">Loading system module...</span>
            </div>
          }>
            <Page />
          </Suspense>
        </main>
      </div>

      {!isLandingPage && <SopChatbotWidget />}
    </div>
  );
}

export default App;
