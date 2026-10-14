import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Sparkles, 
  Medal, 
  TrendingUp, 
  Flame, 
  Target, 
  Award, 
  Star, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export const RankingView: React.FC = () => {
  const { users, sales, triggerCelebration } = useApp();

  // Calculate detailed stats per seller
  const sellerStats = users.map((user) => {
    const userSales = sales.filter((s) => s.sellerId === user.id);
    const volume = userSales.reduce((acc, s) => acc + s.amount, 0);
    const commission = userSales.reduce((acc, s) => acc + s.commissionAmount, 0);
    const miniappCount = userSales.filter((s) => s.productId.includes('miniapp')).length;
    const overdueCount = userSales.filter((s) => s.maintenanceStatus === 'overdue').length;
    const progressPct = Math.min(100, Math.round((volume / (user.monthlyTarget || 1500)) * 100));

    // Dynamic badges
    const badges: { label: string; color: string }[] = [];
    if (userSales.length >= 2) badges.push({ label: '🔥 Racha Comercial', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' });
    if (miniappCount >= 1) badges.push({ label: '📱 Experto Miniapp', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' });
    if (overdueCount === 0 && userSales.length > 0) badges.push({ label: '🛡️ Cartera Sin Mora', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' });

    return {
      user,
      salesCount: userSales.length,
      volume,
      commission,
      progressPct,
      badges,
    };
  }).sort((a, b) => b.volume - a.volume);

  const top1 = sellerStats[0];
  const top2 = sellerStats[1];
  const top3 = sellerStats[2];

  const totalTeamVolume = sellerStats.reduce((acc, s) => acc + s.volume, 0);
  const totalTeamTarget = sellerStats.reduce((acc, s) => acc + s.user.monthlyTarget, 0);
  const teamGoalPct = Math.round((totalTeamVolume / (totalTeamTarget || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Ranking Comercial y Metas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Espacio de reconocimiento y competencia sana entre los vendedores de Arfa.
          </p>
        </div>

        <button
          onClick={triggerCelebration}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>¡Celebrar Logros! 🎉</span>
        </button>
      </div>

      {/* Team Goal Progress Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Meta Colectiva del Mes</h3>
              <p className="text-xs text-slate-400">Objetivo grupal de ventas y nuevos lanzamientos</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xl font-black text-white">${totalTeamVolume.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-semibold"> / ${totalTeamTarget.toLocaleString()} ({teamGoalPct}%)</span>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${Math.min(100, teamGoalPct)}%` }}
          />
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
        {/* Silver (2nd) */}
        {top2 && (
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative flex flex-col items-center text-center order-2 md:order-1 hover:border-slate-600 transition-all">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-400 text-slate-200 flex items-center justify-center font-bold text-sm shadow-md">
              2º
            </div>
            <img
              src={top2.user.avatar}
              alt={top2.user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-400 shadow-lg mt-3"
            />
            <h3 className="font-extrabold text-white text-sm mt-3">{top2.user.name}</h3>
            <p className="text-[11px] text-slate-400">{top2.user.roleTitle}</p>
            
            <div className="mt-4 w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 space-y-1">
              <p className="text-lg font-black text-slate-200">${top2.volume.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 font-medium">{top2.salesCount} ventas cerradas</p>
              <p className="text-[11px] text-indigo-400 font-semibold">+${top2.commission.toFixed(0)} de comisión</p>
            </div>
          </div>
        )}

        {/* Gold (1st) */}
        {top1 && (
          <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 shadow-2xl relative flex flex-col items-center text-center order-1 md:order-2 md:-translate-y-2 hover:border-amber-400 transition-all">
            <div className="absolute -top-5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              LÍDER #1
            </div>
            <div className="relative mt-3">
              <img
                src={top1.user.avatar}
                alt={top1.user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 text-2xl">👑</span>
            </div>
            <h3 className="font-extrabold text-white text-base mt-3">{top1.user.name}</h3>
            <p className="text-xs text-amber-300 font-medium">{top1.user.roleTitle}</p>

            <div className="mt-4 w-full bg-amber-500/10 rounded-xl p-3.5 border border-amber-500/30 space-y-1">
              <p className="text-2xl font-black text-amber-400">${top1.volume.toLocaleString()}</p>
              <p className="text-xs text-slate-200 font-bold">{top1.salesCount} aplicaciones vendidas</p>
              <p className="text-xs text-emerald-400 font-semibold">+${top1.commission.toFixed(0)} en comisiones</p>
            </div>
          </div>
        )}

        {/* Bronze (3rd) */}
        {top3 && (
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative flex flex-col items-center text-center order-3 hover:border-slate-600 transition-all">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-800 border-2 border-amber-600 text-amber-200 flex items-center justify-center font-bold text-sm shadow-md">
              3º
            </div>
            <img
              src={top3.user.avatar}
              alt={top3.user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-700 shadow-lg mt-3"
            />
            <h3 className="font-extrabold text-white text-sm mt-3">{top3.user.name}</h3>
            <p className="text-[11px] text-slate-400">{top3.user.roleTitle}</p>

            <div className="mt-4 w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 space-y-1">
              <p className="text-lg font-black text-slate-200">${top3.volume.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 font-medium">{top3.salesCount} ventas cerradas</p>
              <p className="text-[11px] text-indigo-400 font-semibold">+${top3.commission.toFixed(0)} de comisión</p>
            </div>
          </div>
        )}
      </div>

      {/* Full Classification Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Tabla General de Desempeño</h3>
          <p className="text-xs text-slate-400">Desglose individual de ventas, comisiones y badges ganados</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Posición</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-4">Apps Vendidas</th>
                <th className="py-3 px-4">Total Facturado</th>
                <th className="py-3 px-4">Comisión Ganada</th>
                <th className="py-3 px-4">Cumplimiento Meta</th>
                <th className="py-3 px-4">Insignias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sellerStats.map((item, index) => (
                <tr key={item.user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-extrabold ${
                      index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-400 text-slate-950' : index === 2 ? 'bg-amber-700 text-white' : 'text-slate-400'
                    }`}>
                      #{index + 1}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-white">{item.user.name}</p>
                        <p className="text-[10px] text-slate-400">{item.user.roleTitle}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {item.salesCount} apps
                  </td>

                  <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                    ${item.volume.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-indigo-400">
                    +${item.commission.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{item.progressPct}%</span>
                        <span>Meta ${item.user.monthlyTarget}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${item.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.badges.map((b, i) => (
                        <span
                          key={i}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${b.color}`}
                        >
                          {b.label}
                        </span>
                      ))}
                      {item.badges.length === 0 && (
                        <span className="text-[10px] text-slate-500">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
