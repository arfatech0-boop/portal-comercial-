import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Shield, Check } from 'lucide-react';
import { RoleId, UserPermissions } from '../types';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose }) => {
  const { addUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleId>('junior_seller');
  const [roleTitle, setRoleTitle] = useState('Vendedor Comercial');
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [monthlyTarget, setMonthlyTarget] = useState<number>(1800);
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );

  const [permissions, setPermissions] = useState<UserPermissions>({
    canCreateSales: true,
    canManageClients: true,
    canManageMaintenance: false,
    canManageUsers: false,
    canViewLeaderboard: true,
    canAccessHub: true,
    canConsultArfi: true,
  });

  if (!isOpen) return null;

  const handleRolePreset = (selectedRole: RoleId) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setRoleTitle('Administrador General & Pagos');
      setCommissionRate(20);
      setPermissions({
        canCreateSales: true,
        canManageClients: true,
        canManageMaintenance: true,
        canManageUsers: true,
        canViewLeaderboard: true,
        canAccessHub: true,
        canConsultArfi: true,
      });
    } else if (selectedRole === 'senior_seller') {
      setRoleTitle('Vendedor Senior');
      setCommissionRate(18);
      setPermissions({
        canCreateSales: true,
        canManageClients: true,
        canManageMaintenance: true,
        canManageUsers: false,
        canViewLeaderboard: true,
        canAccessHub: true,
        canConsultArfi: true,
      });
    } else if (selectedRole === 'miniapp_payments') {
      setRoleTitle('Operador Miniapp & Pagos');
      setCommissionRate(15);
      setPermissions({
        canCreateSales: true,
        canManageClients: true,
        canManageMaintenance: true,
        canManageUsers: false,
        canViewLeaderboard: true,
        canAccessHub: true,
        canConsultArfi: true,
      });
    } else if (selectedRole === 'junior_seller') {
      setRoleTitle('Vendedor Junior');
      setCommissionRate(12);
      setPermissions({
        canCreateSales: true,
        canManageClients: true,
        canManageMaintenance: false,
        canManageUsers: false,
        canViewLeaderboard: true,
        canAccessHub: true,
        canConsultArfi: true,
      });
    } else {
      setRoleTitle('Soporte & Cobranzas');
      setCommissionRate(10);
      setPermissions({
        canCreateSales: false,
        canManageClients: true,
        canManageMaintenance: true,
        canManageUsers: false,
        canViewLeaderboard: false,
        canAccessHub: true,
        canConsultArfi: true,
      });
    }
  };

  const togglePermission = (key: keyof UserPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Por favor complete el nombre y correo del nuevo vendedor.');
      return;
    }

    addUser({
      name,
      email,
      phone: phone || '+54 9 11 0000-0000',
      role,
      roleTitle,
      avatar,
      permissions,
      commissionRate: Number(commissionRate),
      monthlyTarget: Number(monthlyTarget),
      active: true,
    });

    onClose();
  };

  const permissionLabels: { key: keyof UserPermissions; label: string; desc: string }[] = [
    { key: 'canCreateSales', label: 'Cargar y registrar ventas', desc: 'Permite registrar transacciones y sumar comisiones' },
    { key: 'canManageClients', label: 'Directorio de clientes', desc: 'Acceso a datos de contacto y WhatsApp directo' },
    { key: 'canManageMaintenance', label: 'Control de mantenimiento', desc: 'Ver alertas de mora y registrar cuotas' },
    { key: 'canViewLeaderboard', label: 'Ranking y metas', desc: 'Visualizar podio de vendedores y progreso del mes' },
    { key: 'canAccessHub', label: 'Hub de Herramientas y Turnos', desc: 'Acceso a catálogo, scripts y turnera' },
    { key: 'canConsultArfi', label: 'Asistente IA Arfi', desc: 'Consultas de objeciones y recomendaciones en tiempo real' },
    { key: 'canManageUsers', label: 'Administrar vendedores y roles', desc: 'Capacidad de dar de alta usuarios y modificar permisos' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </span>
              Incorporar Nuevo Vendedor
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Crea un usuario único, define su rol y gestiona permisos de forma dinámica.
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
              <input
                type="text"
                placeholder="Ej. Lucas Benítez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Corporativo *</label>
              <input
                type="email"
                placeholder="lucas@arfa.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Teléfono</label>
              <input
                type="text"
                placeholder="+54 9 11 2233-4455"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Plantilla de Rol</label>
              <select
                value={role}
                onChange={(e) => handleRolePreset(e.target.value as RoleId)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="junior_seller">Vendedor Junior</option>
                <option value="senior_seller">Vendedor Senior</option>
                <option value="miniapp_payments">Miniapp & Cobranzas</option>
                <option value="admin">Administrador General</option>
                <option value="support">Soporte Técnico</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título de Cargo</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">% Comisión Directa</label>
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Mensual ($)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Dynamic Permissions Matrix */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Permisos Dinámicos del Usuario
              </label>
            </div>
            <div className="space-y-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700 max-h-48 overflow-y-auto">
              {permissionLabels.map(({ key, label, desc }) => (
                <label
                  key={key}
                  className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={permissions[key]}
                    onChange={() => togglePermission(key)}
                    className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{label}</p>
                    <p className="text-[10px] text-slate-400">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
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
              Crear Vendedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
