import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertOctagon,
  Building2,
  Users
} from 'lucide-react';
import { FilterState } from '../types';

interface ToolbarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  onRefresh: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  filter,
  setFilter,
  onRefresh,
  onExportCsv,
  onResetData,
  totalFilteredCount,
  totalCount
}) => {
  const isFiltered =
    filter.plant !== 'ALL' ||
    filter.searchQuery.trim() !== '' ||
    filter.presence !== 'ALL' ||
    filter.risk !== 'ALL' ||
    filter.zone !== 'ALL';

  const resetFilters = () => {
    setFilter({
      plant: 'ALL',
      searchQuery: '',
      presence: 'ALL',
      risk: 'ALL',
      zone: 'ALL'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 mb-6 no-print space-y-4">
      
      {/* Top row controls */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Field */}
        <div className="relative flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="block w-full pl-10 pr-9 py-2.5 bg-slate-100 border-0 rounded-full text-sm placeholder-slate-400 text-slate-800 focus:ring-2 focus:ring-[#E30613]/20 focus:bg-white transition-all outline-none font-medium"
            placeholder="Chercher par collaborateur, email, zone, alerte..."
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Plant Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 hover:border-slate-300 transition-all">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={filter.plant}
              onChange={(e) => setFilter((prev) => ({ ...prev, plant: e.target.value }))}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="ALL">Toutes Usines</option>
              <option value="OGGAZ">Usine OGGAZ</option>
              <option value="M'SILA">Usine M'SILA</option>
              <option value="CILAS">CILAS Biskra</option>
            </select>
          </div>

          {/* Presence Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 hover:border-slate-300 transition-all">
            <Users className="w-4 h-4 text-slate-400" />
            <select
              value={filter.presence}
              onChange={(e) => setFilter((prev) => ({ ...prev, presence: e.target.value as 'ALL' | 'IN' | 'OUT' }))}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="ALL">Tous Présence</option>
              <option value="IN">En Zone (IN)</option>
              <option value="OUT">Sorti (OUT)</option>
            </select>
          </div>

          {/* Risk Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 hover:border-slate-300 transition-all">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter.risk}
              onChange={(e) => setFilter((prev) => ({ ...prev, risk: e.target.value as 'ALL' | 'RISK_ONLY' | 'RAS_ONLY' }))}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="ALL">Tous Niveaux Risque</option>
              <option value="RISK_ONLY">Alertes Risques</option>
              <option value="RAS_ONLY">RAS Uniquement</option>
            </select>
          </div>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all text-xs font-bold shadow-xs flex items-center space-x-1.5"
            title="Exporter en CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exporter</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-all border border-slate-200"
            title="Actualiser les données satellite"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Quick Filter Tag Bar */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Filtres rapides:</span>
          
          <button
            onClick={() => setFilter((prev) => ({ ...prev, risk: prev.risk === 'RISK_ONLY' ? 'ALL' : 'RISK_ONLY' }))}
            className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
              filter.risk === 'RISK_ONLY'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Alertes Risques</span>
          </button>

          <button
            onClick={() => setFilter((prev) => ({ ...prev, presence: prev.presence === 'IN' ? 'ALL' : 'IN' }))}
            className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
              filter.presence === 'IN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Présents Terrain</span>
          </button>

          <button
            onClick={() => setFilter((prev) => ({ ...prev, plant: prev.plant === 'OGGAZ' ? 'ALL' : 'OGGAZ' }))}
            className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
              filter.plant === 'OGGAZ'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/70'
            }`}
          >
            OGGAZ
          </button>

          <button
            onClick={() => setFilter((prev) => ({ ...prev, plant: prev.plant === 'M\'SILA' ? 'ALL' : 'M\'SILA' }))}
            className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
              filter.plant === 'M\'SILA'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/70'
            }`}
          >
            M'SILA
          </button>

          <button
            onClick={() => setFilter((prev) => ({ ...prev, plant: prev.plant === 'CILAS' ? 'ALL' : 'CILAS' }))}
            className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
              filter.plant === 'CILAS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/70'
            }`}
          >
            CILAS
          </button>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-slate-500 hover:text-rose-600 font-bold underline flex items-center gap-1 ml-1 text-xs"
            >
              <X className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          )}
        </div>

        <div className="text-slate-500 font-medium text-[11px] mt-2 sm:mt-0">
          Affichage: <span className="font-bold text-slate-900">{totalFilteredCount}</span> sur {totalCount} enregistrements
        </div>
      </div>

    </div>
  );
};
