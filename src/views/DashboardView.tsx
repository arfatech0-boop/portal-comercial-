import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Bot, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Smartphone,
  ExternalLink,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewSale: () => void;
  onOpenNewClient: () => void;
  onOpenArfi: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewSale,
  onOpenNewClient,
  onOpenArfi,
  onNavigateTab,
}) => {
  const { currentUser, sales, clients, users, products, getArfiRecommendations } = useApp();

  const [aiTipLoading, setAiTipLoading] = useState(false);
  const [aiTip, setAiTip] = useState<string>(
    '💡 **Tip Arfi de Hoy:** Enfócate en los clientes que consultaron por Miniapp la semana pasada. Ofrecer la bonificación del primer mes de mantenimiento acelera un 60% la decisión de compra.'
  );

  // Filter current user's sales and metrics
  const mySales = sales.filter(s => s.sellerId === currentUser.id);
  const myTotalCommission = mySales.reduce((sum, s) => sum + s.commissionAmount, 0);
  const myTotalVolume = mySales.reduce((sum, s) => sum + s.amount, 0);
  
  // Overall company stats
  const totalCompanySalesCount = sales.length;
  const totalCompanyVolume = sales.reduce((sum, s) => sum + s.amount, 0);
  const overdueSales = sales.filter(s => s.maintenanceStatus === 'overdue');
  const dueSoonSales = sales.filter(s => s.maintenanceStatus === 'due_soon');

  // Seller Leaderboard Top 3
  const sellerRankings = users.map(user => {
    const userSales = sales.filter(s => s.sellerId === user.id);
    const volume = userSales.reduce((sum, s) => sum + s.amount, 0);
    const commission = userSales.reduce((sum, s) => sum + s.commissionAmount, 0);
    return {
      user,
      salesCount: userSales.length,
      volume,
      commission,
    };
  }).sort((a, b) => b.volume - a.volume);

  const handleRefreshAiTip = async () => {
    setAiTipLoading(true);
    const tip = await getArfiRecommendations();
    setAiTip(tip);
    setAiTipLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 border border-indigo-500/30 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Portal Centralizado Arfa
              </span>
              <span className="text-xs text-slate-400">
                • {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido de nuevo, <span className="text-indigo-400">{currentUser.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Estás conectado con el rol de <strong className="text-white">{currentUser.roleTitle}</strong> ({currentUser.commissionRate}% de comisión directa). Revisa tus métricas, cuotas de mantenimiento y recomendaciones de Arfi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              Cargar Venta
            </button>
            <button
              onClick={onOpenArfi}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-102"
            >
              <Bot className="w-4 h-4" />
              Consultar a Arfi
            </button>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: My Commissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tus Ganancias</p>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">${myTotalCommission.toFixed(2)}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{mySales.length} ventas tuyas registradas</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Volume Handled */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volumen Personal</p>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">${myTotalVolume.toLocaleString()}</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, (myTotalVolume / currentUser.monthlyTarget) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Meta: ${currentUser.monthlyTarget.toLocaleString()} ({Math.round((myTotalVolume / currentUser.monthlyTarget) * 100)}%)
            </p>
          </div>
        </div>

        {/* KPI 3: Clients Directory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Clientes Empresa</p>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{clients.length}</p>
            <p className="text-xs text-slate-400 mt-1">
              Directorio unificado con WhatsApp y contactos centralizados
            </p>
          </div>
        </div>

        {/* KPI 4: Maintenance Status */}
        <div 
          onClick={() => onNavigateTab('maintenance')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-rose-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Control Mantenimiento</p>
            <div className={`p-2 rounded-xl ${overdueSales.length > 0 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className={`text-2xl font-black ${overdueSales.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {overdueSales.length} {overdueSales.length === 1 ? 'cuenta morosa' : 'cuentas morosas'}
            </p>
            <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
              <span>{dueSoonSales.length} próximas a vencer</span>
              <span className="text-indigo-400 group-hover:underline">Revisar →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arfi Coach Live Recommendation Box */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Recomendación Estratégica de Arfi</h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  Optimización de Procesos
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {aiTip}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={handleRefreshAiTip}
              disabled={aiTipLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiTipLoading ? 'animate-spin' : 'text-purple-400'}`} />
              <span>{aiTipLoading ? 'Analizando...' : 'Actualizar'}</span>
            </button>
            <button
              onClick={onOpenArfi}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
            >
              Chatear con Arfi
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Sales & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Sales */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Ventas y Aplicaciones Recientes</h2>
              <p className="text-xs text-slate-400">Últimos registros comerciales del equipo</p>
            </div>
            <button
              onClick={() => onNavigateTab('sales')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Ver todas ({sales.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {sales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{sale.productName}</p>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {sale.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      Cliente: <span className="text-slate-200 font-medium">{sale.clientName} ({sale.clientBusiness})</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-emerald-400">${sale.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">
                    Vendedor: <span className="text-indigo-300">{sale.sellerName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Leaderboard Preview & Fast Access */}
        <div className="space-y-6">
          {/* Top Sellers Podio preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Ranking del Mes</h3>
              </div>
              <button
                onClick={() => onNavigateTab('ranking')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Tabla completa →
              </button>
            </div>

            <div className="space-y-3">
              {sellerRankings.slice(0, 3).map((item, idx) => {
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div
                    key={item.user.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      idx === 0 
                        ? 'bg-amber-500/10 border-amber-500/30' 
                        : 'bg-slate-800/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base">{medals[idx]}</span>
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.salesCount} ventas cerradas</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-emerald-400">${item.volume.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Hub Launchers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white">Accesos Rápidos del Hub</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('hub')}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <Calendar className="w-4 h-4 text-indigo-400 mb-1" />
                <p className="text-xs font-bold text-white">Turnera & Demos</p>
                <p className="text-[10px] text-slate-400">Agenda con clientes</p>
              </button>

              <button
                onClick={() => onNavigateTab('hub')}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <Smartphone className="w-4 h-4 text-purple-400 mb-1" />
                <p className="text-xs font-bold text-white">Emprendimientos</p>
                <p className="text-[10px] text-slate-400">Catálogo Miniapps</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
