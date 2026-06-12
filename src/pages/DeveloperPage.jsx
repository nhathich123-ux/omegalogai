import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, Card } from '../components/ui';
import { 
  Users, 
  Eye, 
  EyeOff, 
  Trash2, 
  ShieldAlert, 
  Activity, 
  Fingerprint, 
  Key, 
  Check, 
  Search, 
  Server,
  Edit3
} from 'lucide-react';

export default function DeveloperPage() {
  const { 
    lang, 
    registeredAccounts, 
    setRegisteredAccounts, 
    faceIdAccounts,
    setFaceIdAccounts,
    currentUser,
    setCurrentUser,
    setNotifications 
  } = useApp();
  
  const isVi = lang === 'vi';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePassIds, setVisiblePassIds] = useState({});
  const [message, setMessage] = useState(null);

  const showToast = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const togglePassword = (email) => {
    setVisiblePassIds(prev => ({ ...prev, [email]: !prev[email] }));
  };

  const [editingAccount, setEditingAccount] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('staff');

  const handleEditClick = (acc) => {
    setEditingAccount(acc);
    setEditName(acc.name);
    setEditEmail(acc.email);
    setEditPassword(acc.password);
    setEditRole(acc.role);
  };

  const handleUpdateAccountSubmit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim() || !editPassword.trim()) {
      showToast(isVi ? 'Vui lòng điền đầy đủ thông tin!' : 'Please fill out all fields!');
      return;
    }

    const oldEmail = editingAccount.email;

    if (editEmail !== oldEmail && registeredAccounts.some(acc => acc.email === editEmail)) {
      showToast(isVi ? 'Email này đã tồn tại trên hệ thống!' : 'Email already exists!');
      return;
    }

    // 1. Update registeredAccounts
    const updatedAccounts = registeredAccounts.map(acc => {
      if (acc.email === oldEmail) {
        return {
          ...acc,
          name: editName,
          email: editEmail,
          password: editPassword,
          role: editRole
        };
      }
      return acc;
    });
    setRegisteredAccounts(updatedAccounts);

    // 2. Update faceIdAccounts
    const updatedFaceIds = faceIdAccounts.map(f => {
      if (f.email === oldEmail) {
        return {
          ...f,
          email: editEmail,
          name: editName
        };
      }
      return f;
    });
    setFaceIdAccounts(updatedFaceIds);

    // 3. Update current user if editing self
    if (currentUser && currentUser.email === oldEmail) {
      setCurrentUser(prev => ({
        ...prev,
        name: editName,
        email: editEmail
      }));
    }

    // 4. Update session token
    const currentAuth = localStorage.getItem('omega-faceid-auth');
    if (currentAuth) {
      try {
        const parsed = JSON.parse(currentAuth);
        if (parsed.email === oldEmail) {
          localStorage.setItem('omega-faceid-auth', JSON.stringify({
            email: editEmail,
            name: editName,
            avatar: parsed.avatar
          }));
        }
      } catch(e) {}
    }

    // 5. Post notification log
    setNotifications(prev => [
      {
        id: `NT-DEV-UPDATE-${Date.now()}`,
        type: 'info',
        title: isVi ? 'Cập nhật tài khoản' : 'Account Updated',
        desc: isVi 
          ? `Tài khoản ${oldEmail} đã được cập nhật bởi nhà phát triển.` 
          : `Account ${oldEmail} was updated in core registry.`,
        time: new Date().toTimeString().split(' ')[0]
      },
      ...prev
    ]);

    showToast(isVi ? 'Cập nhật tài khoản thành công!' : 'Account updated successfully!');
    setEditingAccount(null);
  };

  const handleRemoveAccount = (email) => {
    if (email === 'nhathich123@gmail.com') {
      showToast(isVi ? 'Không thể xóa tài khoản Admin Nhà phát triển!' : 'Cannot terminate Developer Admin account!');
      return;
    }
    if (window.confirm(isVi ? `Bạn có chắc chắn muốn xóa nhân viên ${email} khỏi hệ thống?` : `Are you sure you want to terminate ${email}?`)) {
      const updated = registeredAccounts.filter(acc => acc.email !== email);
      setRegisteredAccounts(updated);

      // Wipe biometric link as well
      const filteredFaceId = faceIdAccounts.filter(acc => acc.email !== email);
      setFaceIdAccounts(filteredFaceId);

      // Post notification log
      setNotifications(prev => [
        {
          id: `NT-DEV-DELETE-${Date.now()}`,
          type: 'warning',
          title: isVi ? 'Xóa tài khoản nhân viên' : 'Employee Terminated',
          desc: isVi ? `Admin đã xóa tài khoản ${email} khỏi hệ thống.` : `Admin terminated account ${email} from core registry.`,
          time: new Date().toTimeString().split(' ')[0]
        },
        ...prev
      ]);

      showToast(isVi ? 'Đã xóa tài khoản thành công!' : 'Successfully terminated account!');
    }
  };

  const handleClearFaceId = (email) => {
    if (window.confirm(isVi ? `Bạn có chắc chắn muốn gỡ toàn bộ Face ID liên kết với ${email}?` : `Wipe Face ID biometrics for ${email}?`)) {
      const filtered = faceIdAccounts.filter(acc => acc.email !== email);
      setFaceIdAccounts(filtered);

      // Wipe current biometrics token if it matches
      const currentAuth = localStorage.getItem('omega-faceid-auth');
      if (currentAuth) {
        try {
          const parsed = JSON.parse(currentAuth);
          if (parsed.email === email) {
            localStorage.removeItem('omega-faceid-auth');
          }
        } catch(e) {}
      }

      showToast(isVi ? 'Đã xóa liên kết Face ID thành công!' : 'Face ID biometrics wiped!');
    }
  };

  // Get Face ID list to verify biometric status
  const faceIdList = faceIdAccounts;

  const filteredAccounts = registeredAccounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in text-zinc-100 font-sans">
      <PageHeader 
        title={isVi ? 'QUẢN TRỊ NHÀ PHÁT TRIỂN' : 'DEVELOPER ADMINISTRATION'} 
        subtitle={isVi ? 'Cổng kiểm tra thông tin tài khoản nhân viên, chữ ký sinh trắc học và quản trị cơ sở dữ liệu cốt lõi' : 'Inspect registered staff profiles, biometric states, and core database nodes'} 
      />

      {message && (
        <div className="mb-6 p-4 rounded border border-orange-500/25 bg-orange-950/10 text-orange-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-2.5 animate-pulse shadow-lg">
          <Check className="w-4 h-4 shrink-0 text-orange-500" />
          <span>{message}</span>
        </div>
      )}

      {/* Grid of system telemetry cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-[#111114] border border-[#22202a] flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">
              {isVi ? 'TỔNG TÀI KHOẢN' : 'REGISTERED STAFF'}
            </span>
            <span className="text-xl font-mono font-extrabold text-zinc-100">{registeredAccounts.length}</span>
          </div>
        </Card>

        <Card className="bg-[#111114] border border-[#22202a] flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">
              {isVi ? 'FACE ID LIÊN KẾT' : 'FACE ID ENROLLED'}
            </span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">
              {registeredAccounts.filter(acc => faceIdList.some(f => f.email === acc.email)).length}
            </span>
          </div>
        </Card>

        <Card className="bg-[#111114] border border-[#22202a] flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">
              {isVi ? 'TRẠNG THÁI CORE' : 'TELEMETRY STATUS'}
            </span>
            <span className="text-xl font-mono font-extrabold text-indigo-400 flex items-center gap-1.5">
              ONLINE
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_#10b981] animate-ping" />
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Explorer Directory */}
        <Card className="lg:col-span-2 bg-[#111114] border border-[#22202a] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b1a20] pb-4 mb-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                {isVi ? 'DANH MỤC TÀI KHOẢN NHÂN VIÊN' : 'STAFF CREDENTIALS REGISTRY'}
              </h3>
              <p className="text-[9px] text-zinc-500 tracking-wide mt-0.5">
                {isVi ? 'Kiểm tra mật khẩu dạng rõ, ngày khởi tạo và chỉnh sửa cơ sở dữ liệu' : 'Inspect plain text passwords, registrations and biometrics link state'}
              </p>
            </div>

            {/* Live Registry Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input 
                type="text" 
                placeholder={isVi ? 'TÌM TÀI KHOẢN...' : 'SEARCH EMAIL/NAME...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded pl-8 pr-3 py-1.5 font-mono text-[9px] text-zinc-300 uppercase tracking-widest outline-none focus:border-[#ff7a45]/40 transition-colors"
              />
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAccounts.map((acc) => {
              const hasFaceId = faceIdList.some(f => f.email === acc.email);
              const isPassVisible = visiblePassIds[acc.email];

              return (
                <div 
                  key={acc.email} 
                  className="p-4 bg-zinc-950/60 border border-zinc-900 rounded hover:border-zinc-800 transition-colors relative flex flex-col gap-3 group"
                >
                  <div className="flex justify-between items-start gap-2 pr-4">
                    <div className="min-w-0">
                      <span className="text-[11px] font-black text-zinc-200 block truncate uppercase tracking-wider">{acc.name}</span>
                      <span className="text-[9px] font-mono text-zinc-500 block truncate mt-0.5">{acc.email}</span>
                    </div>
                    <span className={`status-badge text-[7.5px] px-1.5 py-0.5 shrink-0 ${acc.role === 'admin' ? 'status-badge--in-stock text-orange-400 border-orange-500/20 bg-orange-950/15' : 'status-badge--on-order'}`}>
                      {acc.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900/60">
                    {/* Password explorer segment */}
                    <div className="flex items-center gap-2 text-zinc-400 bg-zinc-900/40 px-2.5 py-1.5 rounded border border-zinc-850 justify-between">
                      <div className="flex items-center gap-1.5 min-w-0 font-mono text-[9px]">
                        <Key className="w-3 h-3 text-[#ff7a45] shrink-0" />
                        <span className="text-zinc-500 font-extrabold shrink-0">PASS:</span>
                        <span className="font-bold tracking-wider text-zinc-300 truncate">
                          {isPassVisible ? acc.password : '••••••••'}
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => togglePassword(acc.email)}
                        className="text-[8px] font-black text-zinc-500 hover:text-[#ff7a45] uppercase tracking-widest cursor-pointer transition-colors"
                      >
                        {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Biometrics and custom reset tools */}
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className={`flex items-center gap-1 font-bold ${hasFaceId ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        <Fingerprint className="w-3.5 h-3.5 shrink-0" />
                        {hasFaceId ? 'FACE ID: LINKED' : 'NO BIOMETRICS'}
                      </span>

                      {hasFaceId && (
                        <button
                          type="button"
                          onClick={() => handleClearFaceId(acc.email)}
                          className="text-[8.5px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest cursor-pointer transition-colors"
                        >
                          WIPE FACE ID
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Account creation timestamp metadata */}
                  <span className="text-[7.5px] font-mono text-zinc-600 self-end mt-1 uppercase">
                    {isVi ? `Đăng ký: ${acc.date}` : `Registered: ${acc.date}`}
                  </span>

                  {/* Edit Account action */}
                  <button
                    type="button"
                    onClick={() => handleEditClick(acc)}
                    className="absolute top-2.5 right-8 w-5 h-5 rounded hover:bg-orange-500/10 border border-transparent hover:border-orange-500/20 text-zinc-500 hover:text-[#ff7a45] flex items-center justify-center cursor-pointer transition-all"
                    title={isVi ? 'Chỉnh sửa tài khoản nhân viên' : 'Edit Account'}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  {/* Terminal Terminate action */}
                  {acc.email !== 'nhathich123@gmail.com' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAccount(acc.email)}
                      className="absolute top-2.5 right-2.5 w-5 h-5 rounded hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-zinc-600 hover:text-red-400 flex items-center justify-center cursor-pointer transition-all"
                      title={isVi ? 'Gỡ bỏ tài khoản nhân viên' : 'Terminate Account'}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}

            {filteredAccounts.length === 0 && (
              <div className="col-span-2 py-8 text-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                {isVi ? 'Không tìm thấy tài khoản nhân viên nào' : 'No staff profiles match query'}
              </div>
            )}
          </div>
        </Card>

        {/* Right Column: Console Node telemetry */}
        <div className="space-y-6">
          <Card className="bg-[#111114] border border-[#22202a] p-5">
            <div className="flex items-center gap-3 border-b border-[#1b1a20] pb-3 mb-4">
              <Server className="w-4 h-4 text-orange-400" />
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isVi ? 'BỘ KIỂM SOÁT AI & HỆ THỐNG' : 'AI MODELS & NODE CONFIG'}
                </h3>
                <p className="text-[9px] text-zinc-500 tracking-wide mt-0.5">
                  {isVi ? 'Thông số liên kết API & Tự động reset' : 'Network channels & model parameters'}
                </p>
              </div>
            </div>

            <ul className="space-y-3 font-mono text-[9px] uppercase tracking-wider text-zinc-400 leading-relaxed">
              <li className="p-2 bg-zinc-950/40 border border-zinc-900 rounded">
                <span className="text-[7.5px] text-zinc-500 block">DEMAND_FORECASTER_VERSION</span>
                <span className="text-orange-400 font-bold block mt-0.5">AI_DEMAND_FORECASTER_V4</span>
              </li>
              <li className="p-2 bg-zinc-950/40 border border-zinc-900 rounded">
                <span className="text-[7.5px] text-zinc-500 block">FACE_REGISTRATION_GRID</span>
                <span className="text-zinc-200 block mt-0.5">120x120 UNIT L2 (8x8 SPATIAL)</span>
              </li>
              <li className="p-2 bg-zinc-950/40 border border-zinc-900 rounded">
                <span className="text-[7.5px] text-zinc-500 block">L2_MATCH_THRESHOLD</span>
                <span className="text-emerald-400 font-bold block mt-0.5">0.52 MAXIMUM DISTANCE</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-[#111114] border border-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.01)] p-5">
            <div className="flex items-center gap-3 border-b border-[#1b1a20] pb-3 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                  {isVi ? 'TRUNG TÂM CẢNH BÁO ĐỎ' : 'RED ZONE CONTROLS'}
                </h3>
                <p className="text-[9px] text-zinc-500 tracking-wide mt-0.5">
                  {isVi ? 'Hành động can thiệp khẩn cấp' : 'High-risk telemetry overrides'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm(isVi ? "CẢNH BÁO: Hành động này sẽ xóa sạch TOÀN BỘ tài khoản nhân viên (trừ Admin) và Face ID trên hệ thống. Bạn có chắc muốn tiếp tục?" : "WARNING: This will wipe ALL registered employee accounts (except Developer Admin) and Face ID linkages. Continue?")) {
                  const devAcc = registeredAccounts.filter(acc => acc.email === 'nhathich123@gmail.com');
                  setRegisteredAccounts(devAcc);
                  setFaceIdAccounts([]);
                  localStorage.removeItem('omega-faceid-auth');
                  showToast(isVi ? 'Đã dọn sạch cơ sở dữ liệu nhân viên!' : 'Wiped all staff registries!');
                }
              }}
              className="w-full py-2.5 px-4 bg-red-950/20 hover:bg-red-900/30 border border-red-500/25 text-red-400 font-mono font-bold tracking-widest text-[9.5px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isVi ? 'DỌN SẠCH TẤT CẢ NHÂN VIÊN' : 'RESET STAFF DATABASE'}
            </button>

            {/* Glassmorphic Edit Modal */}
            {editingAccount && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md animate-fade-in p-4">
                <div className="w-full max-w-md bg-[#111114] border border-[#ff7a45]/30 rounded-lg p-6 shadow-2xl animate-scale-up relative">
                  <button
                    onClick={() => setEditingAccount(null)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="flex items-center gap-3 border-b border-zinc-900 pb-3 mb-5">
                    <div className="w-9 h-9 rounded bg-[#ff7a45]/10 border border-[#ff7a45]/30 flex items-center justify-center text-[#ff7a45]">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                        {isVi ? 'CẬP NHẬT TÀI KHOẢN NHÂN VIÊN' : 'EDIT STAFF PROFILE'}
                      </h3>
                      <p className="text-[9px] text-zinc-500 tracking-wide mt-0.5 font-mono">
                        {editingAccount.email}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateAccountSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[8px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">
                        {isVi ? 'TÊN NHÂN VIÊN' : 'EMPLOYEE NAME'}
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-2 font-sans text-xs text-zinc-200 outline-none focus:border-[#ff7a45]/50 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">
                        {isVi ? 'ĐỊA CHỈ EMAIL (TÀI KHOẢN)' : 'EMAIL (USERNAME)'}
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]/50 transition-colors"
                        required
                        disabled={editingAccount.email === 'nhathich123@gmail.com'}
                        title={editingAccount.email === 'nhathich123@gmail.com' ? (isVi ? 'Không thể đổi email của tài khoản phát triển gốc' : 'Cannot edit core developer email') : ''}
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">
                        {isVi ? 'MẬT KHẨU' : 'PASSWORD'}
                      </label>
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]/50 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest mb-1.5">
                        {isVi ? 'VAI TRÒ QUYỀN HẠN' : 'ACCESS PERMISSIONS'}
                      </label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-[#ff7a45]/50 transition-colors cursor-pointer"
                        disabled={editingAccount.email === 'nhathich123@gmail.com'}
                      >
                        <option value="staff">{isVi ? 'STAFF (Nhân viên vận hành)' : 'STAFF (Operations)'}</option>
                        <option value="admin">{isVi ? 'ADMIN (Quản trị hệ thống)' : 'ADMIN (System Admin)'}</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-zinc-900 mt-5">
                      <button
                        type="button"
                        onClick={() => setEditingAccount(null)}
                        className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 font-mono text-[9px] uppercase tracking-wider rounded transition-colors cursor-pointer"
                      >
                        {isVi ? 'HỦY BỎ' : 'CANCEL'}
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-[#ff7a45] hover:bg-[#ff9e7d] text-zinc-950 font-mono text-[9px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                      >
                        {isVi ? 'LƯU THAY ĐỔI' : 'SAVE CHANGES'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
