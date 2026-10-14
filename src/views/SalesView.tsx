import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BadgePercent, 
  Search, 
  PlusCircle, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  Phone,
  DollarSign,
  Smartphone,
  Eye
} from 'lucide-react';
import { Sale } from '../types';

interface SalesViewProps {
  onOpenNewSale: () => void;
  onOpenNewClient: () => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ onOpenNewSale }) => {
  const { sales, users, products, currentUser, registerMaintenancePayment } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSellerFilter, setSelectedSellerFilter] = useState('all');
  const [selectedProductFilter, setSelectedProductFilter] = useState('all');
  const [selectedMaintFilter, setSelectedMaintFilter] = useState('all');
  const [selectedSaleForDetail, setSelectedSaleForDetail] = useState<Sale | null>(null);

  // Filters
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.clientBusiness.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeller =
      selectedSellerFilter === 'all' || sale.sellerId === selectedSellerFilter;

    const matchesProduct =
      selectedProductFilter === 'all' || sale.productId === selectedProductFilter;

    const matchesMaint =
      selectedMaintFilter === 'all' || sale.maintenanceStatus === selectedMaintFilter;

    return matchesSearch && matchesSeller && matchesProduct && matchesMaint;
  });

  const totalVolume = filteredSales.reduce((acc, s) => acc + s.amount, 0);
  const totalCommissions = filteredSales.reduce((acc, s) => acc + s.commissionAmount, 0);

  const getMaintenanceBadge = (status: Sale['maintenanceStatus']) => {
    switch (status) {
      case 'up_to_date':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Al Día
          </span>
        );
      case 'due_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Próx. a vencer
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> En Mora
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Suspendido
          </span>
        );
    }
  };

  const openWhatsApp = (phone: string, text: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  const exportSalesCsv = () => {
    const headers = ['Codigo', 'Cliente', 'Negocio', 'Telefono', 'Producto', 'Monto_ARS', 'Vendedor', 'Comision_ARS', 'Fecha', 'Estado_Mantenimiento'];
    const rows = filteredSales.map(s => [
      s.code,
      `"${s.clientName}"`,
      `"${s.clientBusiness}"`,
      s.clientPhone,
      `"${s.productName}"`,
      s.amount,
      `"${s.sellerName}"`,
      s.commissionAmount,
      s.date,
      s.maintenanceStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ventas_arfa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BadgePercent className="w-6 h-6 text-indigo-400" />
            Carga y Control de Ventas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historial de aplicaciones vendidas, comisiones liquidadas y estado de cobros de mantenimiento.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportSalesCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewSale}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cargar Nueva Venta</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Transacciones</p>
          <p className="text-2xl font-black text-white mt-1">{filteredSales.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Aplicaciones y servicios registrados</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volumen Facturado</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">${totalVolume.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Ticket promedio: ${(totalVolume / (filteredSales.length || 1)).toFixed(0)}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Comisiones Totales</p>
          <p className="text-2xl font-black text-indigo-400 mt-1">${totalCommissions.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Repartidas entre los vendedores</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por cliente, negocio, código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Seller Filter */}
          <div>
            <select
              value={selectedSellerFilter}
              onChange={(e) => setSelectedSellerFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todos los Vendedores</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todos los Productos</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Maintenance Filter */}
          <div>
            <select
              value={selectedMaintFilter}
              onChange={(e) => setSelectedMaintFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Estado Mantenimiento (Todos)</option>
              <option value="overdue">⚠️ En Mora / Vencido</option>
              <option value="due_soon">⏳ Próximo a vencer</option>
              <option value="up_to_date">✅ Al Día</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Código / Fecha</th>
                <th className="py-3 px-4">Cliente & Negocio</th>
                <th className="py-3 px-4">Producto / App</th>
                <th className="py-3 px-4">Monto Venta</th>
                <th className="py-3 px-4">Vendedor & Comisión</th>
                <th className="py-3 px-4">Mantenimiento</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Code & Date */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-200">{sale.code}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{sale.date}</span>
                  </td>

                  {/* Client & Business */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{sale.clientName}</p>
                    <p className="text-[11px] text-indigo-300 font-medium">{sale.clientBusiness}</p>
                    <p className="text-[10px] text-slate-400">{sale.clientPhone}</p>
                  </td>

                  {/* Product */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{sale.productName}</p>
                        <p className="text-[10px] text-slate-400">{sale.paymentMethod}</p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <p className="font-extrabold text-emerald-400 text-sm">${sale.amount.toLocaleString()}</p>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-semibold">
                      Cobrado
                    </span>
                  </td>

                  {/* Seller & Commission */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{sale.sellerName}</p>
                    <p className="text-[11px] text-indigo-400 font-bold">
                      +${sale.commissionAmount} ganados
                    </p>
                  </td>

                  {/* Maintenance Status */}
                  <td className="py-3.5 px-4">
                    {getMaintenanceBadge(sale.maintenanceStatus)}
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Cuota: ${sale.maintenanceFee}/m • Vence: {sale.nextMaintenanceDate}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openWhatsApp(
                          sale.clientPhone,
                          `Hola ${sale.clientName}, te escribimos de Arfa respecto a tu ${sale.productName}. ¡Esperamos que esté funcionando de maravillas!`
                        )}
                        title="Enviar WhatsApp"
                        className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => registerMaintenancePayment(sale.id)}
                        title="Registrar cobro de cuota mantenimiento"
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[10px] font-bold border border-slate-700 transition-colors"
                      >
                        Cobrar Cuota
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No se encontraron ventas con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
