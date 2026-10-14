import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  BadgePercent, 
  Users, 
  AlertTriangle, 
  Trophy, 
  Compass, 
  ShieldCheck, 
  Bot, 
  PlusCircle, 
  ChevronDown, 
  Sparkles,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewSale: () => void;
  onOpenNewClient: () => void;
  onOpenArfi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewSale,
  onOpenNewClient,
  onOpenArfi,
}) => {
  const { currentUser, users, setCurrentUser, sales } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Overdue count for alert badge
  const overdueCount = sales.filter(s => s.maintenanceStatus === 'overdue').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Ventas', icon: BadgePercent },
    { id: 'clients', label: 'Clientes', icon: Users },
    { 
      id: 'maintenance', 
      label: 'Mantenimiento', 
      icon: AlertTriangle, 
      badge: overdueCount > 0 ? overdueCount : undefined 
    },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'hub', label: 'Hub Central', icon: Compass },
    { id: 'users', label: 'Equipo & Roles', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight">ARFA</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    PORTAL COMERCIAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Ventas & Miniapps</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons & User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Arfi Coach Button */}
            <button
              onClick={onOpenArfi}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-102"
              title="Abrir Asistente Arfi"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Arfi IA</span>
            </button>

            {/* Quick Sale button */}
            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Cargar Venta</span>
            </button>

            {/* User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                />
                <div className="hidden xl:block max-w-[120px] truncate">
                  <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-indigo-400 truncate">{currentUser.roleTitle}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Vendedor Activo
                      </p>
                      <p className="text-xs font-medium text-slate-300">
                        Cambia de perfil para operar como otro miembro
                      </p>
                    </div>

                    <div className="py-1 max-h-60 overflow-y-auto">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUser(u);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold truncate">{u.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{u.roleTitle}</p>
                            </div>
                          </div>
                          {u.id === currentUser.id && (
                            <UserCheck className="w-4 h-4 text-indigo-400 shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 px-1">
                      <button
                        onClick={() => {
                          setCurrentTab('users');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-center text-xs py-1.5 font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Gestionar permisos y vendedores →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
