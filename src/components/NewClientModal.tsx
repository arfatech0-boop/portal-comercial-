import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Building, Phone, Mail, MapPin } from 'lucide-react';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient, currentUser, users } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Gastronomía');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedSellerId, setAssignedSellerId] = useState(currentUser.id);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone || !businessName) {
      alert('Por favor complete los campos obligatorios (*)');
      return;
    }

    const assignedSeller = users.find(u => u.id === assignedSellerId) || currentUser;

    addClient({
      firstName,
      lastName,
      phone,
      email: email || `${firstName.toLowerCase()}@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
      businessName,
      businessType,
      city: city || 'Sin especificar',
      notes,
      assignedSellerId: assignedSeller.id,
      assignedSellerName: assignedSeller.name,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </span>
              Nuevo Cliente Comercial
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Agrega un cliente al directorio centralizado de ventas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre *</label>
              <input
                type="text"
                placeholder="Ej. Martín"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Apellido</label>
              <input
                type="text"
                placeholder="Ej. González"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp / Teléfono Móvil *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="+54 9 11 5555-1234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Incluye código de país y área para habilitar el botón de WhatsApp directo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre de la Empresa / Negocio *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ej. Pizzería Roma"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rubro / Categoría</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Gastronomía & Bares">Gastronomía & Bares</option>
                <option value="Indumentaria & Calzado">Indumentaria & Calzado</option>
                <option value="Estética & Peluquería">Estética & Peluquería</option>
                <option value="Salud & Consultorios">Salud & Consultorios</option>
                <option value="Comercio & Ferretería">Comercio & Ferretería</option>
                <option value="Servicios Profesionales">Servicios Profesionales</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="contacto@pizzeriaroma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad / Zona</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ej. CABA, Buenos Aires"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Vendedor Asignado</label>
            <select
              value={assignedSellerId}
              onChange={(e) => setAssignedSellerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.roleTitle})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notas Comerciales</label>
            <textarea
              rows={2}
              placeholder="Detalles de interés, objeciones previas, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
