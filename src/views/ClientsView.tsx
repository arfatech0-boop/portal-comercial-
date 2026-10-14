import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  MessageSquare, 
  Mail, 
  Building, 
  MapPin, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Client } from '../types';

interface ClientsViewProps {
  onOpenNewClient: () => void;
  onOpenNewSale: () => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ onOpenNewClient, onOpenNewSale }) => {
  const { clients, sales, users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRubro, setSelectedRubro] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState('all');

  const rubros = Array.from(new Set(clients.map(c => c.businessType)));

  const filteredClients = clients.filter(c => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      c.firstName.toLowerCase().includes(query) ||
      c.lastName.toLowerCase().includes(query) ||
      c.businessName.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query);

    const matchesRubro = selectedRubro === 'all' || c.businessType === selectedRubro;
    const matchesSeller = selectedSeller === 'all' || c.assignedSellerId === selectedSeller;

    return matchesSearch && matchesRubro && matchesSeller;
  });

  const openWhatsApp = (phone: string, clientName: string, businessName: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `¡Hola ${clientName}! Te escribimos del equipo de soporte y atención de Arfa para ${businessName}. ¿Cómo viene funcionando todo hoy?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Directorio Centralizado de Clientes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Listado completo de clientes a quienes se les ha vendido, datos de contacto y aplicaciones asignadas.
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Agregar Cliente</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por cliente, empresa, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedRubro}
              onChange={(e) => setSelectedRubro(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todos los Rubros ({rubros.length})</option>
              {rubros.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todos los Vendedores Asignados</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const clientSales = sales.filter(s => s.clientId === client.id);
          const totalSpent = clientSales.reduce((acc, s) => acc + s.amount, 0);
          const hasOverdue = clientSales.some(s => s.maintenanceStatus === 'overdue');

          return (
            <div
              key={client.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">
                      {client.firstName} {client.lastName}
                    </h3>
                    <p className="text-xs font-bold text-indigo-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5" />
                      {client.businessName}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {client.businessType}
                  </span>
                </div>

                {/* Contact items */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.city && (
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{client.city}</span>
                    </div>
                  )}
                </div>

                {/* Applications and purchases */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Apps Compradas:</span>
                    <span className="font-bold text-white">{clientSales.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Invertido:</span>
                    <span className="font-black text-emerald-400">${totalSpent.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Vendedor:</span>
                    <span className="text-indigo-300 font-medium truncate">{client.assignedSellerName}</span>
                  </div>

                  {hasOverdue && (
                    <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-[11px] text-rose-300 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Cuota de mantenimiento en mora</span>
                    </div>
                  )}

                  {client.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-800/40 p-2 rounded-lg">
                      "{client.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => openWhatsApp(client.phone, client.firstName, client.businessName)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={`tel:${client.phone}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Llamar"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  onClick={onOpenNewSale}
                  className="px-2.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-colors"
                  title="Cargar nueva venta a este cliente"
                >
                  + Vender
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-semibold">No se encontraron clientes</p>
          <p className="text-xs text-slate-500 mt-1">Prueba cambiando los términos de búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
};
