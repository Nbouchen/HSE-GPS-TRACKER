import React from 'react';
import { Activity, UserCheck, Map, Flame, TrendingUp, AlertTriangle } from 'lucide-react';
import { MovementRecord } from '../types';

interface KpiCardsProps {
  records: MovementRecord[];
  onSelectFilterQuick: (type: 'all' | 'presence_in' | 'risk_only') => void;
  activePresenceFilter: string;
  activeRiskFilter: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  records,
  onSelectFilterQuick,
  activePresenceFilter,
  activeRiskFilter
}) => {
  const totalEntries = records.length;
  
  // Currently IN zone (timeOut is null)
  const activePresence = records.filter(
    (r) => !r.timeOut || r.timeOut.trim() === ''
  ).length;

  // Unique active zones
  const activeZones = new Set(records.map((r) => r.zone)).size;

  // High & Medium Risk Alerts (excluding Out of zone RAS)
  const riskAlerts = records.filter((r) => {
    const isOutOfZone = r.zone.trim().toLowerCase() === 'out of zone';
    const isCurrentlyIn = !r.timeOut || r.timeOut.trim() === '';
    const hasObs = r.observation && r.observation.trim().toUpperCase() !== 'RAS' && r.observation.trim() !== '';
    return (!isOutOfZone && isCurrentlyIn && hasObs) || r.riskLevel === 'HIGH' || r.riskLevel === 'MEDIUM';
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      
      {/* Card 1: Passages du Jour */}
      <div 
        onClick={() => onSelectFilterQuick('all')}
        className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
          activePresenceFilter === 'ALL' && activeRiskFilter === 'ALL'
            ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm'
            : 'border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-[0.15em] mb-1">
              Passages du Jour
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-black text-slate-900">{totalEntries}</h3>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>Total</span>
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-medium">
          <span>Tous mouvements</span>
          <span className="font-bold text-blue-600 hover:underline">Voir tout →</span>
        </p>
      </div>

      {/* Card 2: Présence Terrain */}
      <div 
        onClick={() => onSelectFilterQuick('presence_in')}
        className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
          activePresenceFilter === 'IN'
            ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
            : 'border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-[0.15em] mb-1">
              Présence Terrain
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-black text-emerald-600">{activePresence}</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {totalEntries > 0 ? Math.round((activePresence / totalEntries) * 100) : 0}% en zone
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-medium">
          <span>Actuellement sur site</span>
          <span className="font-bold text-emerald-600 hover:underline">Filtrer →</span>
        </p>
      </div>

      {/* Card 3: Zones Couvertes */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-[0.15em] mb-1">
              Zones Couvertes
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-black text-slate-900">{activeZones}</h3>
              <span className="text-xs text-slate-500 font-semibold">Secteurs actifs</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Map className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-medium">
          <span>Localisations Holcim</span>
          <span className="font-bold text-amber-600 truncate max-w-[140px]">Oggaz, M'Sila...</span>
        </p>
      </div>

      {/* Card 4: Alertes Risques */}
      <div 
        onClick={() => onSelectFilterQuick('risk_only')}
        className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
          activeRiskFilter === 'RISK_ONLY'
            ? 'border-rose-500 ring-2 ring-rose-500/10 shadow-sm'
            : riskAlerts > 0 ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-rose-500 uppercase font-bold tracking-[0.15em] mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alertes Risques</span>
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-black text-rose-600">{riskAlerts}</h3>
              {riskAlerts > 0 && (
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse border border-rose-200">
                  Attention
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 relative">
            <Flame className="w-6 h-6 stroke-[2.2]" />
            {riskAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full ring-2 ring-white animate-ping"></span>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-medium">
          <span>Observations & anomalies</span>
          <span className="font-bold text-rose-600 hover:underline">Consulter →</span>
        </p>
      </div>

    </div>
  );
};
