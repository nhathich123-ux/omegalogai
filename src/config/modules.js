import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Building2,
  FileBarChart,
  Settings,
  Sparkles,
} from 'lucide-react';

/** Module apps — dùng chung sidebar & lưới trang chủ */
export const MODULE_APPS = [
  { id: 'dashboard', icon: LayoutDashboard, navKey: 'dashboard', color: '#875A7B', homeKey: 'dashboard' },
  { id: 'inventory', icon: Package, navKey: 'inventory', color: '#714B67', homeKey: 'inventory' },
  { id: 'purchase', icon: ShoppingCart, navKey: 'purchase', color: '#E08A1E', homeKey: 'purchase' },
  { id: 'operations', icon: Truck, navKey: 'operations', color: '#00A09D', homeKey: 'operations' },
  { id: 'warehouses', icon: Building2, navKey: 'warehouses', color: '#5B899E', homeKey: 'warehouses' },
  { id: 'reports', icon: FileBarChart, navKey: 'reports', color: '#6C757D', homeKey: 'reports' },
  { id: 'settings', icon: Settings, navKey: 'settings', color: '#7C7BAD', homeKey: 'settings' },
];

export const HOME_AI_APP = {
  id: 'ai',
  icon: Sparkles,
  color: '#ff6b00',
  homeKey: 'ai',
  disabled: true,
};
