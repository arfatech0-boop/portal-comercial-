import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Calendar, 
  Rocket, 
  Wrench, 
  BookOpen, 
  Plus, 
  ExternalLink, 
  Video, 
  MessageSquare, 
  Check, 
  Copy, 
  Smartphone, 
  ShoppingBag, 
  CreditCard, 
  Calculator, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search,
  Sparkles
} from 'lucide-react';
import { Product, CommercialShift, ResourceItem } from '../types';

interface HubViewProps {
  onOpenNewSaleWithProduct?: (productId: string) => void;
}

export const HubView: React.FC<HubViewProps> = ({ onOpenNewSaleWithProduct }) => {
  const { 
    products, 
    shifts, 
    addShift, 
    updateShiftStatus, 
    resources, 
    currentUser, 
    clients 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'turnos' | 'emprendimientos' | 'herramientas' | 'repositorio'>('turnos');

  // Turnos state
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [shiftTitle, setShiftTitle] = useState('');
  const [shiftClientName, setShiftClientName] = useState('');
  const [shiftPhone, setShiftPhone] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [shiftTime, setShiftTime] = useState('11:00');
  const [shiftType, setShiftType] = useState<CommercialShift['type']>('demo_miniapp');
  const [shiftMeetLink, setShiftMeetLink] = useState('');

  // Tools state (Commission Calculator & Quote Generator)
  const [calcPrice, setCalcPrice] = useState(350);
  const [calcPct, setCalcPct] = useState(currentUser.commissionRate || 15);
  const [calcMaintMonths, setCalcMaintMonths] = useState(1);
  const [calcMaintFee, setCalcMaintFee] = useState(25);

  const [quoteClient, setQuoteClient] = useState('');
  const [quoteProduct, setQuoteProduct] = useState(products[0]?.id || '');
  const [quoteDiscount, setQuoteDiscount] = useState(0);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Resource Viewer state
  const [selectedResource, setSelectedResource] = useState<ResourceItem>(resources[0]);
  const [copiedResource, setCopiedResource] = useState(false);

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftTitle || !shiftClientName || !shiftDate) {
      alert('Por favor complete los datos obligatorios del turno.');
      return;
    }

    addShift({
      title: shiftTitle,
      clientName: shiftClientName,
      clientPhone: shiftPhone || '+54 9 11 0000-0000',
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      date: shiftDate,
      time: shiftTime,
      type: shiftType,
      status: 'confirmed',
      meetLink: shiftMeetLink || 'https://meet.google.com/arf-demo-call',
    });

    setIsAddingShift(false);
    setShiftTitle('');
    setShiftClientName('');
    setShiftPhone('');
  };

  const generateQuoteText = () => {
    const prod = products.find(p => p.id === quoteProduct) || products[0];
    const finalPrice = Math.max(0, prod.price - quoteDiscount);

    return `*PROPUESTA COMERCIAL ARFA — ${prod.name.toUpperCase()}*

Hola ${quoteClient || '[Nombre del Cliente]'}, un placer saludarte. A continuación te detallamos la propuesta pensada para tu negocio:

*Solución:* ${prod.name}
*Descripción:* ${prod.description}

*¿Qué incluye tu aplicación?:*
${prod.features.map(f => `• ${f}`).join('\n')}

*Inversión Única de Configuración y Despliegue:*
${quoteDiscount > 0 ? `~$${prod.price}~ → *$${finalPrice}* (Bonificación especial aplicada)` : `*$${finalPrice}*`}

*Abono mensual de servidores, copias de seguridad y soporte:*
• $${prod.maintenanceFee} / mes

*Garantía & Plazos:*
• Activación y puesta en marcha en 48 a 72hs hábiles.
• Capacitación en video y soporte prioritario.

¿Te reservamos el cupo de lanzamiento para esta semana?`;
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(generateQuoteText());
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleCopyResource = () => {
    navigator.clipboard.writeText(selectedResource.content);
    setCopiedResource(true);
    setTimeout(() => setCopiedResource(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-400" />
            Hub Central de Recursos & Herramientas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma unificada de turnos, catálogo de emprendimientos, herramientas de cotización y base de conocimiento.
          </p>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('turnos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'turnos'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Sección de Turnos ({shifts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('emprendimientos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'emprendimientos'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>Emprendimientos & Apps ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('herramientas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'herramientas'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Tus Herramientas Personales</span>
        </button>

        <button
          onClick={() => setActiveSubTab('repositorio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'repositorio'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Repositorio, Manuales & Scripts</span>
        </button>
      </div>

      {/* SUBTAB 1: SECCIÓN DE TURNOS */}
      {activeSubTab === 'turnos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div>
              <h2 className="text-base font-bold text-white">Agenda Comercial y Demos con Clientes</h2>
              <p className="text-xs text-slate-400">Coordina videollamadas, demos de Miniapps y seguimientos comerciales.</p>
            </div>
            <button
              onClick={() => setIsAddingShift(!isAddingShift)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingShift ? 'Cancelar' : 'Agendar Nuevo Turno'}</span>
            </button>
          </div>

          {/* Form to add shift */}
          {isAddingShift && (
            <form onSubmit={handleCreateShift} className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-indigo-300">Nuevo Turno / Demo Comercial</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Título / Motivo *</label>
                  <input
                    type="text"
                    placeholder="Ej. Demo Miniapp Pro con Restaurante"
                    value={shiftTitle}
                    onChange={(e) => setShiftTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Nombre del Cliente *</label>
                  <input
                    type="text"
                    placeholder="Ej. Martín Soler"
                    value={shiftClientName}
                    onChange={(e) => setShiftClientName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">WhatsApp del Cliente</label>
                  <input
                    type="text"
                    placeholder="+54 9 11 5544-3322"
                    value={shiftPhone}
                    onChange={(e) => setShiftPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Fecha *</label>
                  <input
                    type="date"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Hora</label>
                  <input
                    type="time"
                    value={shiftTime}
                    onChange={(e) => setShiftTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Tipo de Turno</label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="demo_miniapp">Demo de Miniapp</option>
                    <option value="cierre_pagos">Cierre Comercial / Pagos</option>
                    <option value="onboarding">Onboarding / Entrega</option>
                    <option value="soporte">Soporte & Renovación</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Enlace Google Meet</label>
                  <input
                    type="text"
                    placeholder="https://meet.google.com/..."
                    value={shiftMeetLink}
                    onChange={(e) => setShiftMeetLink(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  Confirmar Turno
                </button>
              </div>
            </form>
          )}

          {/* Shifts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {shift.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {shift.date} • {shift.time} hs
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-sm mt-2">{shift.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Cliente: <strong className="text-white">{shift.clientName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Vendedor responsable: <strong className="text-slate-300">{shift.sellerName}</strong>
                  </p>
                  {shift.notes && (
                    <p className="text-[11px] text-slate-400 italic mt-2 bg-slate-800/40 p-2 rounded-lg">
                      "{shift.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {shift.meetLink && (
                      <a
                        href={shift.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold border border-indigo-500/30"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Unirse</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        const cleanPhone = shift.clientPhone.replace(/[^0-9]/g, '');
                        const msg = encodeURIComponent(`Hola ${shift.clientName}, te recordamos nuestro turno comercial programado para el día ${shift.date} a las ${shift.time}hs.`);
                        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
                      }}
                      className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                      title="Recordar turno por WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <select
                    value={shift.status}
                    onChange={(e) => updateShiftStatus(shift.id, e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                  >
                    <option value="confirmed">Confirmado</option>
                    <option value="pending">Pendiente</option>
                    <option value="completed">Realizado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SECCIÓN DE EMPRENDIMIENTOS */}
      {activeSubTab === 'emprendimientos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-base font-bold text-white">Catálogo de Emprendimientos & Aplicaciones</h2>
            <p className="text-xs text-slate-400">
              Conoce en profundidad cada producto de la empresa, sus características, márgenes de comisión y precios oficiales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base">{product.name}</h3>
                      <p className="text-xs text-indigo-400 font-semibold">{product.shortPitch}</p>
                    </div>
                    {product.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Precio Oficial</p>
                      <p className="text-lg font-black text-emerald-400">${product.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tu Comisión ({product.commissionPct}%)</p>
                      <p className="text-lg font-black text-indigo-300">
                        +${((product.price * product.commissionPct) / 100).toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Características:</p>
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Mant: <strong className="text-slate-200">${product.maintenanceFee}/mes</strong>
                  </span>

                  <button
                    onClick={() => {
                      if (onOpenNewSaleWithProduct) {
                        onOpenNewSaleWithProduct(product.id);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
                  >
                    Vender esta App
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TUS HERRAMIENTAS PERSONALES */}
      {activeSubTab === 'herramientas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Tool 1: Interactive Commission Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Calculadora de Ganancias</h3>
                <p className="text-xs text-slate-400">Calcula tu comisión neta en segundos</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Precio Acordado con Cliente</span>
                  <span className="font-bold text-white">${calcPrice}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="10"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full mt-1.5 accent-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Tu Porcentaje de Comisión</span>
                  <span className="font-bold text-indigo-400">{calcPct}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={calcPct}
                  onChange={(e) => setCalcPct(Number(e.target.value))}
                  className="w-full mt-1.5 accent-indigo-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Ganancia Inmediata por Cierre:</p>
                  <p className="text-2xl font-black text-emerald-400">
                    +${((calcPrice * calcPct) / 100).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Ingreso de Empresa:</p>
                  <p className="text-sm font-bold text-slate-200">
                    ${(calcPrice - (calcPrice * calcPct) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tool 2: 1-Click WhatsApp Quote Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generador de Presupuesto WhatsApp</h3>
                  <p className="text-xs text-slate-400">Arma un mensaje profesional en 1 clic</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Cliente o Negocio</label>
                  <input
                    type="text"
                    placeholder="Ej. Rodrigo de Café Deli"
                    value={quoteClient}
                    onChange={(e) => setQuoteClient(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Producto a Cotizar</label>
                  <select
                    value={quoteProduct}
                    onChange={(e) => setQuoteProduct(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 flex justify-between">
                  <span>Descuento Comercial de Cierre ($)</span>
                  <span className="text-emerald-400 font-bold">-${quoteDiscount}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={quoteDiscount}
                  onChange={(e) => setQuoteDiscount(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Text Preview */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={6}
                  value={generateQuoteText()}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono resize-none focus:outline-none"
                />
                <button
                  onClick={handleCopyQuote}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  {copiedQuote ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuote ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: REPOSITORIO & MANUALES */}
      {activeSubTab === 'repositorio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Resources List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white px-1">Guías & Manuales Comerciales</h3>
            {resources.map((res) => {
              const isSelected = res.id === selectedResource.id;
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {res.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{res.readTime}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white mt-1.5">{res.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                </button>
              );
            })}
          </div>

          {/* Resource Content Viewer */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {selectedResource.category}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2">{selectedResource.title}</h2>
                  <p className="text-xs text-slate-400">{selectedResource.description}</p>
                </div>

                <button
                  onClick={handleCopyResource}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {copiedResource ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedResource ? 'Copiado' : 'Copiar Texto'}</span>
                </button>
              </div>

              <div className="whitespace-pre-line text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                {selectedResource.content}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Actualizado: {selectedResource.updatedAt}</span>
              <span className="text-indigo-400 font-medium">Uso interno exclusivo para el equipo comercial Arfa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
