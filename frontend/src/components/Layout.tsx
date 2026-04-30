import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Package, ShoppingCart, ReceiptText, LogOut, Store } from 'lucide-react';

const SidebarLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        isActive
          ? 'bg-blue-50 text-blue-600 shadow-sm'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Store size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">အိမ်ဈေး POS</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="ပင်မစာမျက်နှာ" />
          <SidebarLink to="/sales" icon={<ShoppingCart size={20} />} label="အရောင်းမှတ်တမ်း" />
          <SidebarLink to="/products" icon={<Package size={20} />} label="ကုန်ပစ္စည်းများ" />
          <SidebarLink to="/invoices" icon={<ReceiptText size={20} />} label="ဘောက်ချာများ" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role === 'ADMIN' ? 'အက်ဒမင်' : 'အရောင်းစရေး'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
          >
            <LogOut size={20} />
            <span>ထွက်မည်</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="text-blue-600" size={24} />
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">အိမ်ဈေး POS</h1>
          </div>
          <button onClick={handleLogout} className="text-red-600 p-2">
            <LogOut size={20} />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
