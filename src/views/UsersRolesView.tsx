import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  UserPlus, 
  Check, 
  UserCheck, 
  Phone, 
  Mail, 
  Percent, 
  Target, 
  Calendar,
  Lock,
  Unlock,
  Sparkles
} from 'lucide-react';
import { User, UserPermissions } from '../types';

interface UsersRolesViewProps {
  onOpenNewUser: () => void;
}

export const UsersRolesView: React.FC<UsersRolesViewProps> = ({ onOpenNewUser }) => {
  const { users, currentUser, setCurrentUser, updateUserPermissions, updateUserRole } = useApp();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const permissionList: { key: keyof UserPermissions; label: string; desc: string }[] = [
    { key: 'canCreateSales', label: 'Cargar y registrar ventas', desc: 'Permite registrar transacciones de Miniapps y productos' },
    { key: 'canManageClients', label: 'Directorio de clientes', desc: 'Acceso a datos de contacto y WhatsApp directo' },
    { key: 'canManageMaintenance', label: 'Control de mantenimiento', desc: 'Alertas de mora y gestión de cuotas mensuales' },
    { key: 'canViewLeaderboard', label: 'Ranking y metas', desc: 'Visualizar tabla de vendedores y podio del mes' },
    { key: 'canAccessHub', label: 'Hub central (Turnos & Guías)', desc: 'Acceso a la turnera, catálogo y scripts de venta' },
    { key: 'canConsultArfi', label: 'Asistente IA Arfi', desc: 'Interacción con el coach comercial y sugerencias' },
    { key: 'canManageUsers', label: 'Administrar vendedores y roles', desc: 'Crear nuevos vendedores y asignar permisos' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            Gestión de Usuarios, Vendedores y Roles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Crea usuarios únicos para cada vendedor (ej. Miniapp, Pagos, nuevos integrantes) y modula sus permisos en tiempo real.
          </p>
        </div>

        <button
          onClick={onOpenNewUser}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Nuevo Vendedor</span>
        </button>
      </div>

      {/* Active Profile Info */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">{currentUser.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                Perfil en Uso
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-semibold">{currentUser.roleTitle}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Comisión: <strong className="text-white">{currentUser.commissionRate}%</strong> • Meta mensual: <strong className="text-white">${currentUser.monthlyTarget.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-xs">
          Puedes cambiar de usuario en cualquier momento desde la esquina superior derecha o haciendo clic en los perfiles abajo.
        </p>
      </div>

      {/* Users Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {users.map((user) => {
          const isActive = user.id === currentUser.id;

          return (
            <div
              key={user.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4 transition-all ${
                isActive ? 'border-indigo-500/60 ring-1 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-sm">{user.name}</h3>
                      {isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-400 font-medium">{user.roleTitle}</p>
                  </div>
                </div>

                {!isActive && (
                  <button
                    onClick={() => setCurrentUser(user)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    Usar este perfil
                  </button>
                )}
              </div>

              {/* Contact info & parameters */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-400 block">Comisión Directa</span>
                  <span className="font-extrabold text-emerald-400">{user.commissionRate}% de cada venta</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Meta Comercial</span>
                  <span className="font-extrabold text-white">${user.monthlyTarget.toLocaleString()} / mes</span>
                </div>
                <div className="col-span-2 text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/40">
                  <span>{user.email}</span>
                  <span className="font-mono">{user.phone}</span>
                </div>
              </div>

              {/* Dynamic Permissions Toggles */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Permisos Dinámicos:
                </p>
                <div className="space-y-1.5">
                  {permissionList.map(({ key, label }) => {
                    const hasPerm = user.permissions[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          const updated = {
                            ...user.permissions,
                            [key]: !user.permissions[key],
                          };
                          updateUserPermissions(user.id, updated);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                          hasPerm
                            ? 'bg-indigo-600/10 text-slate-200 border border-indigo-500/20'
                            : 'bg-slate-800/20 text-slate-500 border border-transparent'
                        }`}
                      >
                        <span className={hasPerm ? 'font-medium' : 'line-through text-slate-500'}>
                          {label}
                        </span>
                        {hasPerm ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Habilitado
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Restringido
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
