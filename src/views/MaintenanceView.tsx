import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  Send, 
  Search, 
  Smartphone,
  ShieldCheck,
  Building,
  RotateCcw
} from 'lucide-react';
import { Sale } from '../types';

export const MaintenanceView: React.FC = () => {
  const { sales, registerMaintenancePayment } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'overdue' | 'due_soon' | 'up_to_date'>('overdue');
  const [searchTerm, setSearchTerm] = useState('');

  const overdueList = sales.filter(s => s.maintenanceStatus === 'overdue');
  const dueSoonList = sales.filter(s => s.maintenanceStatus === 'due_soon');
  const upToDateList = sales.filter(s => s.maintenanceStatus === 'up_to_date');

  const totalMonthlyRecurring = sales.reduce((sum, s) => sum + s.maintenanceFee, 0);

  const filteredSales = sales.filter(sale => {
    const matchesFilter = activeFilter === 'all' || sale.maintenanceStatus === activeFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      sale.clientName.toLowerCase().includes(query) ||
      sale.clientBusiness.toLowerCase().includes(query) ||
      sale.productName.toLowerCase().includes(query) ||
      sale.code.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const sendWhatsAppReminder = (sale: Sale) => {
    const cleanPhone = sale.clientPhone.replace(/[^0-9]/g, '');
    const isOverdue = sale.maintenanceStatus === 'overdue';

    const text = isOverdue
      ? `¡Hola ${sale.clientName}! Te escribimos de la administración de Arfa respecto al servicio de tu ${sale.productName} (${sale.clientBusiness}). Te recordamos que la cuota de mantenimiento mensual ($${sale.maintenanceFee}) venció el ${sale.nextMaintenanceDate}. Para evitar la interrupción de servidores y mantener la app activa, por favor infórmanos tu comprobante o escríbenos para abonar. ¡Muchas gracias!`
      : `¡Hola ${sale.clientName}! Te escribimos de Arfa. Te avisamos con anticipación que el próximo ${sale.nextMaintenanceDate} vence el abono mensual de hosting y soporte de tu ${sale.productName} ($${sale.maintenanceFee}). ¡Que tengas una excelente semana de ventas!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Control de Mantenimiento y Cobranzas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitoreo preventivo y alertas automáticas de cobro mensual de servidores, apps y licencias.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            $
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Recurrente Mensual</p>
            <p className="text-sm font-black text-white">${totalMonthlyRecurring.toLocaleString()} / mes</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overdue Alert Card */}
        <button
          onClick={() => setActiveFilter('overdue')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'overdue'
              ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-rose-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              En Mora / Vencidos
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 mt-2">{overdueList.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Requieren aviso de cobranza urgente
          </p>
        </button>

        {/* Due soon */}
        <button
          onClick={() => setActiveFilter('due_soon')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'due_soon'
              ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-amber-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Próximos a Vencer
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{dueSoonList.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Vencimiento dentro de los próximos 5 días
          </p>
        </button>

        {/* Up to date */}
        <button
          onClick={() => setActiveFilter('up_to_date')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'up_to_date'
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-emerald-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Al Día
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{upToDateList.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Servidores activos sin deuda
          </p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por cliente o app..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Todos ({sales.length})
          </button>
          <button
            onClick={() => setActiveFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'overdue'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            En Mora ({overdueList.length})
          </button>
          <button
            onClick={() => setActiveFilter('due_soon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'due_soon'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Próximos ({dueSoonList.length})
          </button>
          <button
            onClick={() => setActiveFilter('up_to_date')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'up_to_date'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Al Día ({upToDateList.length})
          </button>
        </div>
      </div>

      {/* Maintenance Cards List */}
      <div className="space-y-3">
        {filteredSales.map((sale) => {
          const isOverdue = sale.maintenanceStatus === 'overdue';
          const isDueSoon = sale.maintenanceStatus === 'due_soon';

          return (
            <div
              key={sale.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isOverdue
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/10'
                  : isDueSoon
                  ? 'bg-amber-950/15 border-amber-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Client & App info */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isOverdue
                      ? 'bg-rose-500/20 text-rose-400'
                      : isDueSoon
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{sale.clientName}</h3>
                    <span className="text-xs font-semibold text-indigo-300">
                      • {sale.clientBusiness}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isOverdue
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                          : isDueSoon
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {isOverdue ? '⚠️ Cuota Vencida' : isDueSoon ? '⏳ Próximo Vencimiento' : '✅ Al Día'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">
                    App: <strong className="text-white">{sale.productName}</strong> ({sale.code})
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>
                      Vencimiento: <strong className={isOverdue ? 'text-rose-400 font-bold' : 'text-slate-200'}>{sale.nextMaintenanceDate}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Vendedor a cargo: <strong className="text-slate-300">{sale.sellerName}</strong>
                    </span>
                    {sale.lastPaymentDate && (
                      <>
                        <span>•</span>
                        <span>Último pago: {sale.lastPaymentDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Fee & Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0">
                <div className="text-left md:text-right">
                  <p className="text-base font-black text-white">${sale.maintenanceFee.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Cuota mensual</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* WhatsApp Reminder Button */}
                  <button
                    onClick={() => sendWhatsAppReminder(sale)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Aviso WhatsApp</span>
                  </button>

                  {/* Register Payment Button */}
                  <button
                    onClick={() => registerMaintenancePayment(sale.id, 1)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acreditar Pago</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSales.length === 0 && (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">
              No hay cuentas en este estado
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Todos los clientes bajo este filtro se encuentran regulares.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
