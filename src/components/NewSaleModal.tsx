import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  Smartphone, 
  ShoppingBag, 
  CreditCard, 
  CalendarCheck, 
  UtensilsCrossed, 
  Globe 
} from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  preselectedProductId,
}) => {
  const { products, clients, currentUser, users, addSale, addClient } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    preselectedProductId || products[0]?.id || ''
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [selectedSellerId, setSelectedSellerId] = useState<string>(currentUser.id);
  
  // Custom price override or default
  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];
  const [customPrice, setCustomPrice] = useState<number>(activeProduct?.price || 180);
  const [customMaintFee, setCustomMaintFee] = useState<number>(activeProduct?.maintenanceFee || 15);
  const [paymentMethod, setPaymentMethod] = useState<string>('Transferencia Bancaria');
  const [notes, setNotes] = useState<string>('');

  // Inline Client Creation
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientLastName, setNewClientLastName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientBusiness, setNewClientBusiness] = useState('');
  const [newClientType, setNewClientType] = useState('Comercio Minorista');

  if (!isOpen) return null;

  const currentSeller = users.find(u => u.id === selectedSellerId) || currentUser;
  const estimatedCommission = ((customPrice * (currentSeller.commissionRate || 15)) / 100).toFixed(2);

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setCustomPrice(prod.price);
      setCustomMaintFee(prod.maintenanceFee);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetClientId = selectedClientId;

    // Create client on the fly if needed
    if (isCreatingClient) {
      if (!newClientName || !newClientPhone || !newClientBusiness) {
        alert('Por favor complete el nombre, WhatsApp y nombre del negocio del nuevo cliente.');
        return;
      }
      const created = addClient({
        firstName: newClientName,
        lastName: newClientLastName,
        phone: newClientPhone,
        email: newClientEmail || `${newClientName.toLowerCase()}@${newClientBusiness.toLowerCase().replace(/\s+/g, '')}.com`,
        businessName: newClientBusiness,
        businessType: newClientType,
        assignedSellerId: currentSeller.id,
        assignedSellerName: currentSeller.name,
      });
      targetClientId = created.id;
    }

    if (!targetClientId) {
      alert('Por favor seleccione o cree un cliente.');
      return;
    }

    addSale({
      clientId: targetClientId,
      productId: selectedProductId,
      amount: Number(customPrice),
      paymentMethod,
      notes,
      maintenanceFee: Number(customMaintFee),
      sellerId: currentSeller.id,
    });

    onClose();
  };

  const getProductIcon = (name: string) => {
    switch (name) {
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'CalendarCheck': return <CalendarCheck className="w-5 h-5" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </span>
              Registrar Nueva Venta
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ingresa los datos para registrar la app vendida y sumar tus comisiones.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Seller Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Vendedor Responsable
            </label>
            <select
              value={selectedSellerId}
              onChange={(e) => setSelectedSellerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.roleTitle} ({u.commissionRate}% comisión)
                </option>
              ))}
            </select>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Seleccionar Producto / Aplicación
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {products.map((p) => {
                const isSelected = p.id === selectedProductId;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleProductChange(p.id)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 ring-1 ring-indigo-500/30'
                        : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {getProductIcon(p.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <span className="text-xs font-extrabold text-emerald-400">${p.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{p.shortPitch}</p>
                      <p className="text-[10px] text-indigo-300 mt-1 font-medium">
                        Mant: ${p.maintenanceFee}/mes
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price & Maintenance Override */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Precio de Venta ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cuota Mensual Mantenimiento ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={customMaintFee}
                  onChange={(e) => setCustomMaintFee(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Client Selection / Inline Creation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Cliente Comprador
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingClient(!isCreatingClient)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {isCreatingClient ? 'Seleccionar existente' : '+ Crear nuevo cliente'}
              </button>
            </div>

            {!isCreatingClient ? (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} — {c.businessName} ({c.phone})
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-3 bg-slate-800/70 p-4 rounded-xl border border-slate-700">
                <p className="text-xs font-bold text-indigo-300">
                  Nuevo Cliente Rápido
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300">Nombre *</label>
                    <input
                      type="text"
                      placeholder="Ej. Rodrigo"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      required={isCreatingClient}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300">Apellido</label>
                    <input
                      type="text"
                      placeholder="Ej. Fernández"
                      value={newClientLastName}
                      onChange={(e) => setNewClientLastName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300">WhatsApp / Teléfono *</label>
                    <input
                      type="text"
                      placeholder="+54 9 11 1234-5678"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      required={isCreatingClient}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300">Nombre del Negocio *</label>
                    <input
                      type="text"
                      placeholder="Ej. Pizzería Bella Vista"
                      value={newClientBusiness}
                      onChange={(e) => setNewClientBusiness(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      required={isCreatingClient}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Método de Cobro
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                <option value="Tarjeta de Crédito / Débito">Tarjeta de Crédito / Débito</option>
                <option value="Arfa Pagos / Stripe">Arfa Pagos / Stripe</option>
                <option value="Efectivo en Mano">Efectivo en Mano</option>
                <option value="Cripto USDT / Binance">Cripto USDT / Binance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Notas / Acuerdos
              </label>
              <input
                type="text"
                placeholder="Ej. Requiere catálogo con 30 platos cargados"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Live Commission Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                $
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium">
                  Ganancia de Comisión Estimada ({currentSeller.commissionRate}%):
                </p>
                <p className="text-lg font-black text-emerald-400">
                  +${estimatedCommission}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/30">
              Pago Inmediato
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar y Cargar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
