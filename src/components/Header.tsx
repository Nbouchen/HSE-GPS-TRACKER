import React from 'react';
import { 
  ShieldCheck, 
  Printer, 
  Maximize2, 
  RefreshCw, 
  PlusCircle, 
  Table, 
  MapPin, 
  BarChart3,
  Radio,
  FileCode
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAutoRefreshing: boolean;
  setIsAutoRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: () => void;
  onOpenNewModal: () => void;
  onOpenGasModal?: () => void;
  lastUpdatedText: string;
  totalAlerts: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  isAutoRefreshing,
  setIsAutoRefreshing,
  onRefresh,
  onOpenNewModal,
  onOpenGasModal,
  lastUpdatedText,
  totalAlerts
}) => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#E30613] rounded-xl text-white shadow-md shadow-red-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900">
                  HSE GPS <span className="text-[#E30613]">Tracker</span>
                </h1>
                <span className="bg-red-50 text-[#E30613] border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Control Tower
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-600 font-semibold">Holcim El Djazaïr</span>
                <span className="inline-block w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>Système Central de Sécurité</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 self-start md:self-center">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Tableau de Bord</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Carte GPS Live</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'analytics'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytique HSE</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Live Monitoring Badge */}
            <button
              onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
              title={isAutoRefreshing ? 'Pause mise à jour auto' : 'Activer mise à jour auto'}
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
                isAutoRefreshing
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isAutoRefreshing ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
              <Radio className="w-3.5 h-3.5" />
              <span>{isAutoRefreshing ? 'Live Sync 20s' : 'Sync Manual'}</span>
            </button>

            {/* Total Risk Warning indicator if > 0 */}
            {totalAlerts > 0 && (
              <div className="hidden lg:flex items-center bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                <span>{totalAlerts} Alerte{totalAlerts > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Quick Action Add Movement */}
            <button
              onClick={onOpenNewModal}
              className="bg-[#E30613] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-md shadow-red-100 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Entrée / Observation</span>
            </button>

            {/* Google Apps Script Integration Button */}
            {onOpenGasModal && (
              <button
                onClick={onOpenGasModal}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs"
                title="Google Apps Script & Google Sheets Info"
              >
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Google Apps Script</span>
              </button>
            )}

            {/* Print & Fullscreen */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-slate-600">
              <button
                onClick={onRefresh}
                className="p-1.5 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                title={`Actualiser (Màj: ${lastUpdatedText})`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-1.5 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                title="Imprimer le rapport"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullScreen}
                className="p-1.5 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                title="Plein écran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
