import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, Card, StatusPill, DataTable } from '../components/ui';
import { Plus, Edit, Trash2, Search, UserCheck, Briefcase, Mail, MapPin, Check } from 'lucide-react';

export default function PartnersPage() {
  const { partners, setPartners, lang, setNotifications } = useApp();
  const isVi = lang === 'vi';

  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' | 'customers'
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  // Form states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' | 'edit'
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formAddress, setFormAddress] = useState('');

  const showToast = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const openAddDrawer = () => {
    setDrawerMode('add');
    setFormId(`PRT-0${Math.floor(100 + Math.random() * 900)}`);
    setFormName('');
    setFormContact('');
    setFormAddress('');
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (partner) => {
    setDrawerMode('edit');
    setFormId(partner.id);
    setFormName(partner.name);
    setFormContact(partner.contact || '');
    setFormAddress(partner.address || '');
    setIsDrawerOpen(true);
  };

  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (drawerMode === 'add') {
      const newPartner = {
        id: formId,
        name: formName,
        type: activeTab === 'suppliers' ? 'supplier' : 'customer',
        contact: formContact,
        address: formAddress,
        date: new Date().toISOString().split('T')[0]
      };
      setPartners(prev => [...prev, newPartner]);

      setNotifications(prev => [
        {
          id: `NT-PARTNER-ADD-${Date.now()}`,
          type: 'info',
          title: isVi ? 'Đã thêm đối tác' : 'Partner Registered',
          desc: isVi 
            ? `Thêm mới ${activeTab === 'suppliers' ? 'nhà cung cấp' : 'khách hàng'} ${formName} vào hệ thống.` 
            : `Successfully registered new ${activeTab === 'suppliers' ? 'vendor' : 'client'} ${formName}.`,
          time: new Date().toTimeString().split(' ')[0]
        },
        ...prev
      ]);
      showToast(isVi ? 'Đã thêm đối tác mới thành công!' : 'Successfully registered new partner!');
    } else {
      setPartners(prev => prev.map(p => p.id === formId ? { 
        ...p, 
        name: formName, 
        contact: formContact, 
        address: formAddress 
      } : p));
      showToast(isVi ? 'Đã cập nhật thông tin đối tác!' : 'Partner details updated!');
    }
    setIsDrawerOpen(false);
  };

  const handleDeletePartner = (id, name) => {
    if (window.confirm(isVi ? `Bạn có chắc chắn muốn xóa đối tác ${name} khỏi hệ thống?` : `Are you sure you want to delete partner ${name}?`)) {
      setPartners(prev => prev.filter(p => p.id !== id));
      
      setNotifications(prev => [
        {
          id: `NT-PARTNER-DEL-${Date.now()}`,
          type: 'warning',
          title: isVi ? 'Xóa đối tác' : 'Partner Removed',
          desc: isVi ? `Đã xóa đối tác ${name} khỏi cơ sở dữ liệu.` : `Removed partner ${name} from core registry.`,
          time: new Date().toTimeString().split(' ')[0]
        },
        ...prev
      ]);
      showToast(isVi ? 'Đã gỡ bỏ đối tác thành công!' : 'Partner deleted successfully!');
    }
  };

  // Filter based on selected tab and search query
  const filteredList = partners.filter(p => {
    const isCorrectType = activeTab === 'suppliers' ? p.type === 'supplier' : p.type === 'customer';
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.contact && p.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    return isCorrectType && matchesSearch;
  });

  // Table Columns
  const columns = [
    { 
      key: 'id', 
      label: 'ID Partner', 
      render: (r) => <span className="font-mono text-xs font-bold text-zinc-500">#{r.id}</span> 
    },
    { 
      key: 'name', 
      label: isVi ? 'TÊN ĐỐI TÁC' : 'PARTNER NAME',
      render: (r) => <span className="font-sans font-bold text-zinc-200">{r.name}</span>
    },
    { 
      key: 'contact', 
      label: isVi ? 'LIÊN HỆ / EMAIL' : 'CONTACT INFO',
      render: (r) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
          <Mail className="w-3.5 h-3.5 text-[#ff7a45]/60" />
          <span>{r.contact || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'address', 
      label: isVi ? 'ĐỊA CHỈ' : 'ADDRESS LOCATION',
      render: (r) => (
        <div className="flex items-center gap-1.5 font-sans text-xs text-zinc-400">
          <MapPin className="w-3.5 h-3.5 text-zinc-650" />
          <span>{r.address || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'date', 
      label: isVi ? 'NGÀY TẠO' : 'DATE CREATED',
      render: (r) => <span className="font-mono text-xs text-zinc-500">{r.date}</span>
    },
    { 
      key: 'actions', 
      label: isVi ? 'THAO TÁC' : 'ACTIONS', 
      render: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => openEditDrawer(r)}
            type="button" 
            className="p-1 rounded bg-zinc-950 border border-zinc-800 text-[#ff7a45] hover:text-[#ff9e7d] transition-colors cursor-pointer"
            title={isVi ? 'Sửa thông tin' : 'Edit Partner'}
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => handleDeletePartner(r.id, r.name)}
            type="button" 
            className="p-1 rounded bg-zinc-950 border border-zinc-800 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            title={isVi ? 'Xóa đối tác' : 'Delete Partner'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in text-zinc-100 select-none font-sans">
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-[#1b1a20] pb-3 mb-8 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
        <button 
          onClick={() => { setActiveTab('suppliers'); setSearchTerm(''); }}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'suppliers' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'NHÀ CUNG CẤP (VENDORS / SUPPLIERS)' : 'SUPPLIERS & VENDORS'}
          {activeTab === 'suppliers' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
        <button 
          onClick={() => { setActiveTab('customers'); setSearchTerm(''); }}
          className={`hover:text-[#ff7a45] transition-colors uppercase relative py-1 ${activeTab === 'customers' ? 'text-[#ff7a45]' : ''}`}
        >
          {isVi ? 'KHÁCH HÀNG (CUSTOMERS / CLIENTS)' : 'CLIENTS & CUSTOMERS'}
          {activeTab === 'customers' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7a45]" />}
        </button>
      </div>

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans text-zinc-100">
            {activeTab === 'suppliers' 
              ? (isVi ? 'Quản lý Nhà cung cấp' : 'Suppliers Directory')
              : (isVi ? 'Quản lý Đối tác Khách hàng' : 'Customers Directory')}
          </h2>
          <p className="font-mono text-[9px] text-[#ff7a45] font-bold uppercase tracking-widest mt-1">
            {isVi 
              ? 'DANH SÁCH CHI TIẾT THÔNG TIN LIÊN LẠC ĐỐI TÁC THƯƠNG MẠI CỐT LÕI' 
              : 'COMMERCIAL PARTNERS REGISTRY AND CORRESPONDENCE DETAILS'}
          </p>
        </div>
        <button 
          onClick={openAddDrawer}
          type="button" 
          className="px-5 py-2.5 bg-[#ff7a45] text-zinc-950 font-mono text-[10px] font-extrabold tracking-widest rounded uppercase hover:bg-[#ff8b5a] transition-all cyber-notched-btn flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {isVi ? 'THÊM ĐỐI TÁC MỚI' : 'ADD NEW PARTNER'}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded border border-orange-500/25 bg-orange-950/10 text-orange-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-2.5 animate-pulse">
          <Check className="w-4 h-4 shrink-0 text-orange-500" />
          <span>{message}</span>
        </div>
      )}

      {/* Telemetry quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-[#111114] border border-[#22202a] flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">
              {isVi ? 'TỔNG NHÀ CUNG CẤP' : 'TOTAL SUPPLIERS'}
            </span>
            <span className="text-xl font-mono font-extrabold text-zinc-100">
              {partners.filter(p => p.type === 'supplier').length}
            </span>
          </div>
        </Card>

        <Card className="bg-[#111114] border border-[#22202a] flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">
              {isVi ? 'TỔNG KHÁCH HÀNG' : 'TOTAL CUSTOMERS'}
            </span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">
              {partners.filter(p => p.type === 'customer').length}
            </span>
          </div>
        </Card>

        <Card className="bg-[#111114] border border-[#22202a] flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">
              {isVi ? 'KHU VỰC THƯƠNG MẠI' : 'COMMERCE HUBS'}
            </span>
            <span className="text-xl font-mono font-extrabold text-indigo-400">
              GLOBAL KERNEL
            </span>
          </div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 p-4 mb-6 rounded-lg bg-[#111114] border border-[#22202a]">
        <div className="flex flex-col items-start w-full max-w-xs">
          <label className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{isVi ? 'Tìm theo tên / ID' : 'Search name / partner ID'}</label>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isVi ? 'NHẬP TÊN HOẶC ID...' : 'ENTER PARTNER NAME...'}
              className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 pl-8 text-zinc-300 font-mono text-[10px] rounded tracking-wider uppercase outline-none"
            />
          </div>
        </div>
      </div>

      {/* DataTable */}
      <Card noPadding className="overflow-hidden bg-[#111114] border border-[#22202a]">
        <DataTable columns={columns} rows={filteredList} rowKey="id" />
        
        <div className="flex items-center justify-between border-t border-[#22202a] p-4 text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase select-none">
          <span>
            {isVi 
              ? `HIỂN THỊ 1-${filteredList.length} TRÊN TỔNG SỐ ${partners.filter(p => activeTab === 'suppliers' ? p.type === 'supplier' : p.type === 'customer').length} ĐỐI TÁC` 
              : `SHOWING 1-${filteredList.length} OF ${partners.filter(p => activeTab === 'suppliers' ? p.type === 'supplier' : p.type === 'customer').length} PARTNERS`}
          </span>
        </div>
      </Card>

      {/* Add / Edit Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs select-none">
          <form 
            onSubmit={handleSavePartner} 
            className="w-full max-w-md h-full bg-[#0c0c0e] border-l border-zinc-800/80 p-6 flex flex-col justify-between overflow-y-auto scrollbar-thin"
          >
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-6">
                <div>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-100">
                    {drawerMode === 'add' 
                      ? (isVi ? 'Thêm Đối Tác Mới' : 'Register Partner')
                      : (isVi ? `Sửa Đối Tác: #${formId}` : `Edit Partner: #${formId}`)}
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1">
                    {isVi 
                      ? `DANH PHÁP PHÂN LOẠI: ${activeTab === 'suppliers' ? 'NHÀ CUNG CẤP' : 'KHÁCH HÀNG'}` 
                      : `PARTNER TYPE: ${activeTab.toUpperCase()}`}
                  </p>
                </div>
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                  ✕
                </button>
              </div>

              <div className="space-y-4 font-mono text-[11px] text-zinc-300">
                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">ID Partner:</label>
                  <input 
                    type="text" 
                    value={formId}
                    disabled 
                    className="w-full bg-zinc-950 border border-zinc-900 py-1.5 px-3 rounded text-zinc-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Tên đối tác thương mại:' : 'Partner Corporate Name:'}</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder={isVi ? 'Nhập tên doanh nghiệp / cá nhân...' : 'Enter partner legal name...'}
                    className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/40 transition-colors font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Thông tin liên hệ (Email/SĐT):' : 'Correspondence Info (Email/Phone):'}</label>
                  <input 
                    type="text" 
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    required
                    placeholder={isVi ? 'sales@company.com hoặc số điện thoại...' : 'sales@company.com or phone number...'}
                    className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/40 transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase tracking-wider mb-1.5">{isVi ? 'Địa chỉ trụ sở chính:' : 'Headquarters Address:'}</label>
                  <textarea 
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    required
                    rows="3"
                    placeholder={isVi ? 'Nhập chi tiết địa chỉ giao nhận...' : 'Enter location coordinates / address...'}
                    className="w-full bg-zinc-950 border border-zinc-800 py-2 px-3 rounded text-zinc-200 outline-none focus:border-[#ff7a45]/40 transition-colors font-sans text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-850 flex gap-2.5">
              <button 
                type="submit" 
                className="flex-1 py-3 bg-[#ff7a45] text-zinc-950 font-mono font-bold tracking-widest text-[11px] uppercase rounded hover:bg-[#ff8b5a] transition-all cyber-notched-btn cursor-pointer"
              >
                {drawerMode === 'add' ? (isVi ? 'THÊM MỚI' : 'SAVE PARTNER') : (isVi ? 'LƯU THAY ĐỔI' : 'UPDATE DETAILS')}
              </button>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-3 border border-zinc-800 bg-transparent text-zinc-500 font-mono font-bold tracking-widest text-[11px] uppercase rounded transition-colors cursor-pointer"
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
