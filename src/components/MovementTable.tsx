import React from 'react';
import { 
  ArrowRight, 
  MapPin, 
  ExternalLink, 
  ShieldAlert, 
  Check, 
  Eye, 
  UserMinus, 
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { MovementRecord } from '../types';

interface MovementTableProps {
  records: MovementRecord[];
  onInspectWorker: (record: MovementRecord) => void;
  onToggleStatus: (id: string) => void;
  isLoading?: boolean;
}

export const MovementTable: React.FC<MovementTableProps> = ({
  records,
  onInspectWorker,
  onToggleStatus,
  isLoading
}) => {
  
  const formatTimeOnly = (dateTimeStr: string | null) => {
    if (!dateTimeStr || dateTimeStr.trim() === '') return '--:--';
    const parts = dateTimeStr.split(' ');
    const timePart = parts.length > 1 ? parts[1] : parts[0];
    const seg = timePart.split(':');
    return seg.length >= 2 ? `${seg[0]}:${seg[1]}` : dateTimeStr;
  };

  const getInitials = (name: string) => {
    if (!name) return 'AG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-20 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#E30613] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
          Synchronisation Satellite Control Tower...
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-16 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
          <UserMinus className="w-6 h-6 opacity-60" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">Aucun mouvement trouvé</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Aucun résultat ne correspond aux filtres sélectionnés. Essayez d'ajuster la recherche ou le filtre usine.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="main-table">
          <thead>
            <tr className="bg-slate-50/80 text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em] border-b border-slate-200">
              <th className="py-3.5 px-4">Statut</th>
              <th className="py-3.5 px-4">Origine</th>
              <th className="py-3.5 px-4">Collaborateur</th>
              <th className="py-3.5 px-4">Mouvement (In / Out)</th>
              <th className="py-3.5 px-4">Localisation Zone</th>
              <th className="py-3.5 px-4">GPS</th>
              <th className="py-3.5 px-4">Évaluation HSE</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {records.map((record) => {
              const isCurrentlyIn = !record.timeOut || record.timeOut.trim() === '';
              const isOutOfZone = record.zone.trim().toLowerCase() === 'out of zone';
              const hasObservation = record.observation && record.observation.trim().toUpperCase() !== 'RAS' && record.observation.trim() !== '';
              
              // High risk condition
              const isHighRisk = (!isOutOfZone && isCurrentlyIn && hasObservation) || record.riskLevel === 'HIGH';
              const isMediumRisk = record.riskLevel === 'MEDIUM';

              return (
                <tr
                  key={record.id}
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    isHighRisk
                      ? 'bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-l-rose-600'
                      : isMediumRisk
                      ? 'bg-amber-50/20 hover:bg-amber-50/50 border-l-4 border-l-amber-500'
                      : 'border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Statut Badge */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span
                          className={`${
                            isCurrentlyIn ? 'animate-ping' : ''
                          } absolute inline-flex h-full w-full rounded-full ${
                            isCurrentlyIn ? 'bg-emerald-400' : 'bg-slate-300'
                          } opacity-75`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            isCurrentlyIn ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        ></span>
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${
                          isCurrentlyIn
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isCurrentlyIn ? 'In (En zone)' : 'Out (Sorti)'}
                      </span>
                    </div>
                  </td>

                  {/* Origine Usine Badge */}
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                        record.plant === 'OGGAZ'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : record.plant === 'M\'SILA'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {record.plant === 'CILAS' ? 'CILAS' : record.plant}
                    </span>
                  </td>

                  {/* Collaborateur Info */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                          record.plant === 'OGGAZ'
                            ? 'bg-blue-600'
                            : record.plant === 'M\'SILA'
                            ? 'bg-emerald-600'
                            : 'bg-amber-600'
                        }`}
                      >
                        {getInitials(record.fullName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs hover:text-[#E30613] transition-colors cursor-pointer" onClick={() => onInspectWorker(record)}>
                          {record.fullName}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-medium text-slate-500">{record.role}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{record.agentId}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Mouvement (In / Out) */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 font-mono">
                        {formatTimeOnly(record.timeIn)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={`px-2 py-1 rounded-lg font-mono border ${
                          record.timeOut
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-sans font-bold text-[10px] uppercase'
                        }`}
                      >
                        {record.timeOut ? formatTimeOnly(record.timeOut) : 'EN ZONE'}
                      </span>
                    </div>
                  </td>

                  {/* Localisation Zone */}
                  <td className="p-4 whitespace-nowrap">
                    <div
                      className={`flex items-center space-x-2 ${
                        isOutOfZone ? 'text-slate-400 italic' : 'text-slate-800 font-semibold'
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 ${
                          isOutOfZone ? 'text-slate-300' : 'text-[#E30613]'
                        }`}
                      />
                      <span className="text-xs uppercase tracking-tight">
                        {record.zone || '---'}
                      </span>
                    </div>
                  </td>

                  {/* GPS Actions */}
                  <td className="p-4 whitespace-nowrap">
                    <a
                      href={`https://www.google.com/maps?q=${record.lat},${record.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-900 hover:text-white transition-all shadow-xs"
                      title={`Voir sur Google Maps (${record.lat}, ${record.lon})`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>

                  {/* Évaluation HSE */}
                  <td className="p-4">
                    <div className="flex flex-col min-w-[180px]">
                      {isHighRisk ? (
                        <div className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold flex items-center w-max uppercase tracking-wider shadow-xs animate-pulse">
                          <ShieldAlert className="w-3 h-3 mr-1" />
                          <span>ZONE À HAUT RISQUE</span>
                        </div>
                      ) : isMediumRisk ? (
                        <div className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold flex items-center w-max uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          <span>RISQUE MODÉRÉ</span>
                        </div>
                      ) : (
                        <div className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[9px] font-extrabold flex items-center w-max uppercase tracking-widest border border-slate-200">
                          <Check className="w-3 h-3 mr-1 text-emerald-600" />
                          <span>RAS {isOutOfZone ? '(HORS ZONE)' : ''}</span>
                        </div>
                      )}
                      {record.observation && record.observation.toUpperCase() !== 'RAS' && (
                        <span className="text-[10px] text-slate-600 font-medium mt-1 italic line-clamp-1 max-w-xs" title={record.observation}>
                          "{record.observation}"
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Quick Action Column */}
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onInspectWorker(record)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                        title="Détails & Inspection HSE"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onToggleStatus(record.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isCurrentlyIn
                            ? 'hover:bg-amber-50 text-slate-400 hover:text-amber-600'
                            : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'
                        }`}
                        title={isCurrentlyIn ? 'Enregistrer Sortie' : 'Enregistrer Entrée'}
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
