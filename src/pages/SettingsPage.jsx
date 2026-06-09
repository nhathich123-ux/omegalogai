import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, Card } from '../components/ui';
import { ShieldCheck, Trash2, RefreshCw, AlertTriangle, Check, Home, Smile } from 'lucide-react';

export default function SettingsPage() {
  const { 
    t, 
    lang, 
    clearAllData, 
    loadDemoData, 
    setActivePage, 
    currentUser,
    isProfileOpen,
    setIsProfileOpen,
    setFaceIdScanMode,
    setPendingUser,
    setShowFaceIdPrompt,
    faceIdAccounts,
    setFaceIdAccounts
  } = useApp();
  const s = t.settings;
  const isVi = lang === 'vi';

  const [message, setMessage] = useState(null);

  const handleClear = () => {
    if (window.confirm(isVi ? "Bạn có chắc chắn muốn xóa tất cả thông tin, sản phẩm, và đơn hàng trong hệ thống không? Hành động này không thể hoàn tác." : "Are you sure you want to delete all information, products, and orders in the system? This action cannot be undone.")) {
      clearAllData();
      setMessage({ type: 'success', text: isVi ? "Đã xóa toàn bộ dữ liệu hệ thống thành công!" : "Completely cleared all system database!" });
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setMessage({ type: 'success', text: isVi ? "Đã nạp toàn bộ dữ liệu mẫu thành công!" : "Loaded pre-populated demo database!" });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl animate-fade-in text-zinc-100">
      <PageHeader title={s.title} subtitle={s.description} />

      {message && (
        <div className="mb-6 p-4 rounded border border-emerald-500/20 bg-emerald-950/15 text-emerald-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-2.5 animate-pulse">
          <Check className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* System Administration Card */}
        <Card className="bg-[#111114] border border-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.01)]">
          <div className="flex items-center gap-3 border-b border-[#1b1a20] pb-3 mb-4">
            <AlertTriangle className="w-4 h-4 text-[#ff7a45]" />
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                {isVi ? 'QUẢN TRỊ CƠ SỞ DỮ LIỆU' : 'SYSTEM DATABASE ADMINISTRATION'}
              </h3>
              <p className="text-[9px] text-zinc-500 tracking-wide mt-0.5">
                {isVi ? 'Điều chỉnh trạng thái dữ liệu hoạt động hoặc phục hồi hệ thống trống' : 'Clear or pre-populate system records'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
              {isVi 
                ? 'Để thuận tiện cho kiểm thử hoặc bắt đầu sử dụng thực tế, bạn có thể xóa sạch mọi giao dịch/sản phẩm để tự nhập dữ liệu trống hoặc khôi phục lại dữ liệu mẫu của Omega bất kỳ lúc nào.'
                : 'For testing or clean deployment, you can clear all active listings/slips or restore Omega pre-populated demo records.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2.5 px-4 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 font-mono font-bold tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isVi ? 'XÓA SẠCH DỮ LIỆU KHO' : 'CLEAR ENTIRE SLATE'}
              </button>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex-1 py-2.5 px-4 bg-[#ff7a45]/5 hover:bg-[#ff7a45]/15 border border-[#ff7a45]/30 text-[#ff7a45] font-mono font-bold tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isVi ? 'NẠP DỮ LIỆU ĐỂ KIỂM THỬ' : 'LOAD DEMO DATASET'}
              </button>
            </div>
          </div>
        </Card>

        {/* Account Profile and Face ID Settings Card */}
        {currentUser && (() => {
          const hasFaceId = faceIdAccounts.some(acc => acc.email === currentUser.email);
          
          const handleFaceIdToggle = () => {
            setPendingUser(currentUser);
            setFaceIdScanMode('scan_enroll');
            setIsProfileOpen(true);
          };

          const handleFaceIdRemove = () => {
            if (window.confirm(isVi ? "Bạn có chắc chắn muốn xóa dữ liệu Face ID đã liên kết với tài khoản này?" : "Are you sure you want to remove Face ID link for this account?")) {
              const updatedList = faceIdAccounts.filter(acc => acc.email !== currentUser.email);
              setFaceIdAccounts(updatedList);
              localStorage.removeItem('omega-faceid-auth'); // Completely delete legacy biometric session token
              setMessage({ type: 'success', text: isVi ? "Đã xóa liên kết Face ID thành công!" : "Successfully removed Face ID credentials!" });
              setTimeout(() => setMessage(null), 4000);
            }
          };

          return (
            <Card className="bg-[#111114] border border-[#22202a] shadow-[0_0_15px_rgba(255,122,69,0.01)]">
              <div className="flex items-center gap-3 border-b border-[#1b1a20] pb-3 mb-4">
                <Smile className="w-4 h-4 text-[#ff7a45]" />
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {isVi ? 'BẢO MẬT TÀI KHOẢN & FACE ID' : 'ACCOUNT SECURITY & FACE ID'}
                  </h3>
                  <p className="text-[9px] text-zinc-500 tracking-wide mt-0.5">
                    {isVi ? 'Quản lý xác thực sinh trắc học gương mặt cho tài khoản hiện tại' : 'Manage face biometric credentials for current active profile'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-900 rounded-sm">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">
                      {isVi ? 'TÀI KHOẢN HOẠT ĐỘNG' : 'ACTIVE USER'}
                    </span>
                    <span className="text-zinc-200 text-xs font-extrabold uppercase tracking-wide truncate block mt-0.5 text-[#ff7a45]">
                      {currentUser.name} ({currentUser.email})
                    </span>
                  </div>
                  <span className={`status-badge shrink-0 ${hasFaceId ? 'status-badge--in-stock' : 'status-badge--critical'}`}>
                    {hasFaceId 
                      ? (isVi ? 'ĐÃ LIÊN KẾT FACE ID' : 'FACE ID ACTIVE') 
                      : (isVi ? 'CHƯA CÓ FACE ID' : 'NO BIOMETRICS')
                    }
                  </span>
                </div>

                <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                  {isVi 
                    ? 'Tính năng Face ID giúp đăng nhập nhanh chóng bằng camera mà không cần gõ mật khẩu. Bạn có thể kích hoạt, cập nhật hoặc gỡ bỏ thông tin nhận diện sinh trắc học của tài khoản này bất cứ lúc nào.'
                    : 'Face ID allows you to log in instantly using the camera. You can configure, update or completely remove your biometric signature for this account here.'
                  }
                </p>



                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleFaceIdToggle}
                    className="flex-1 py-2.5 px-4 bg-[#ff7a45]/5 hover:bg-[#ff7a45]/15 border border-[#ff7a45]/30 text-[#ff7a45] font-mono font-bold tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    {hasFaceId 
                      ? (isVi ? 'CẬP NHẬT FACE ID MỚI' : 'THIẾT LẬP FACE ID') 
                      : (isVi ? 'THIẾT LẬP FACE ID' : 'THIẾT LẬP FACE ID')
                    }
                  </button>

                  {hasFaceId && (
                    <button
                      type="button"
                      onClick={handleFaceIdRemove}
                      className="flex-1 py-2.5 px-4 bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 text-red-400 font-mono font-bold tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isVi ? 'GỠ FACE ID TÀI KHOẢN' : 'REMOVE FACE BIOMETRICS'}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          )})()}

        {/* Active Modules */}
        <Card className="bg-[#111114] border border-[#22202a]">
          <div className="flex items-center gap-3 border-b border-[#1b1a20] pb-3 mb-4">
            <ShieldCheck className="w-4 h-4 text-[#ff7a45]" />
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">{s.modulesTitle}</h3>
              <p className="text-[9px] text-zinc-500 tracking-wide mt-0.5">{s.modulesDesc}</p>
            </div>
          </div>
          
          <ul className="space-y-3 font-mono text-[10px] font-bold tracking-widest uppercase">
            {s.modules.map((mod) => (
              <li key={mod} className="flex items-center gap-2.5 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45] shadow-[0_0_8px_#ff7a45]" />
                {mod}
              </li>
            ))}
          </ul>
        </Card>

        {/* Simplified Portal Return Button Card */}
        <Card className="bg-[#111114] border border-[#22202a] shadow-[0_0_15px_rgba(255,122,69,0.01)] p-4">
          <button
            type="button"
            onClick={() => setActivePage('landing')}
            className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-[#ff7a45]/5 border border-zinc-800 hover:border-[#ff7a45]/30 text-zinc-400 hover:text-[#ff9e7d] font-mono font-bold tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            {isVi ? 'TRỞ VỀ TRANG CHỦ ĐẦU' : 'RETURN TO LANDING PAGE'}
          </button>
        </Card>
      </div>
    </div>
  );
}
