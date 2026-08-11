import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  ExternalLink, 
  Radio, 
  MapPin, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { MovementRecord, PlantCode } from '../types';
import { PLANTS_DATA } from '../data/mockData';

interface GpsMapViewProps {
  records: MovementRecord[];
  onInspectWorker: (record: MovementRecord) => void;
}

export const GpsMapView: React.FC<GpsMapViewProps> = ({
  records,
  onInspectWorker
}) => {
  const [selectedPlant, setSelectedPlant] = useState<PlantCode>('OGGAZ');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const plantInfo = PLANTS_DATA.find((p) => p.code === selectedPlant) || PLANTS_DATA[0];
  
  // Filter active workers in this plant
  const plantRecords = records.filter((r) => r.plant === selectedPlant);
  const activePlantRecords = plantRecords.filter((r) => !r.timeOut || r.timeOut.trim() === '');

  const selectedWorker = records.find((r) => r.id === selectedWorkerId);

  // Helper to map zone name to SVG layout coordinates on our interactive site map
  const getZoneCoords = (zoneName: string, index: number) => {
    const z = zoneName.toLowerCase();
    if (z.includes('cru')) return { x: 22, y: 30, w: 22, h: 25, color: '#3b82f6' };
    if (z.includes('broyeur') || z.includes('ciment')) return { x: 50, y: 25, w: 25, h: 25, color: '#10b981' };
    if (z.includes('front') || z.includes('carrière') || z.includes('taille')) return { x: 20, y: 62, w: 28, h: 28, color: '#f59e0b' };
    if (z.includes('expéditions') || z.includes('silo') || z.includes('ensachage')) return { x: 52, y: 60, w: 24, h: 28, color: '#8b5cf6' };
    if (z.includes('out of zone')) return { x: 80, y: 80, w: 18, h: 18, color: '#94a3b8' };
    
    // Default fallback layout positions
    const pos = [
      { x: 15, y: 20, w: 20, h: 20, color: '#06b6d4' },
      { x: 40, y: 20, w: 20, h: 20, color: '#ec4899' },
      { x: 65, y: 20, w: 20, h: 20, color: '#84cc16' },
      { x: 15, y: 55, w: 20, h: 20, color: '#f97316' },
      { x: 40, y: 55, w: 20, h: 20, color: '#6366f1' },
      { x: 65, y: 55, w: 20, h: 20, color: '#14b8a6' },
    ];
    return pos[index % pos.length];
  };

  return (
    <div className="space-y-4">
      
      {/* Top Plant Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-50 text-[#E30613] rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Supervision Cartographique Satellite Live
            </h2>
            <p className="text-xs text-slate-500">
              Positionnement GPS et statut des périmètres de sécurité par usine
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl space-x-1 border border-slate-200/80">
          {PLANTS_DATA.map((p) => (
            <button
              key={p.code}
              onClick={() => {
                setSelectedPlant(p.code);
                setSelectedWorkerId(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedPlant === p.code
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Interactive Plant Radar Blueprint */}
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden border border-slate-800 text-white min-h-[480px] flex flex-col justify-between">
          
          {/* Header Map Info */}
          <div className="flex justify-between items-start z-10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Radar GPS Actif • {plantInfo.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Coordonnées GPS: {plantInfo.centerLat.toFixed(4)}° N, {plantInfo.centerLon.toFixed(4)}° E ({plantInfo.location})
              </p>
            </div>

            <a
              href={`https://www.google.com/maps?q=${plantInfo.centerLat},${plantInfo.centerLon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all border border-white/10"
            >
              <span>Google Satellite</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Blueprint SVG Canvas */}
          <div className="relative w-full h-[360px] my-4 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden">
            
            {/* Grid Pattern Background */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            ></div>

            {/* Simulated Radar Sweep effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 animate-pulse"></div>

            {/* Plant Sectors / Zones */}
            {plantInfo.zones.map((zone, idx) => {
              const coords = getZoneCoords(zone, idx);
              const workersInZone = activePlantRecords.filter((r) => r.zone === zone);
              const hasHighRiskInZone = workersInZone.some((r) => r.riskLevel === 'HIGH');

              return (
                <div
                  key={zone}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    width: `${coords.w}%`,
                    height: `${coords.h}%`
                  }}
                  className={`absolute rounded-xl border p-2 flex flex-col justify-between transition-all backdrop-blur-sm ${
                    hasHighRiskInZone
                      ? 'border-red-500/80 bg-red-950/30'
                      : 'border-slate-700/80 bg-slate-900/60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 truncate">
                      {zone}
                    </span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      workersInZone.length > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {workersInZone.length}
                    </span>
                  </div>

                  {/* Worker Dots Container */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {workersInZone.map((w) => {
                      const isRisk = w.riskLevel === 'HIGH' || (w.observation && w.observation.toUpperCase() !== 'RAS');
                      return (
                        <button
                          key={w.id}
                          onClick={() => setSelectedWorkerId(w.id)}
                          title={`${w.fullName} (${w.role})`}
                          className={`relative w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white transition-all transform hover:scale-125 border ${
                            isRisk
                              ? 'bg-red-600 border-red-300 animate-radar'
                              : 'bg-emerald-600 border-emerald-300 shadow-md'
                          }`}
                        >
                          {w.fullName.slice(0, 1)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Footer Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 gap-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span>
                <span>Présent (RAS)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-red-300 animate-pulse"></span>
                <span>Alerte / Danger HSE</span>
              </div>
            </div>
            <span>Cliquez sur un marqueur pour inspecter l'agent</span>
          </div>

        </div>

        {/* Sidebar: Inspector / Selected Worker Info */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Inspecteur Terrain</span>
              <Radio className="w-4 h-4 text-[#E30613]" />
            </h3>

            {selectedWorker ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E30613] to-red-800 text-white rounded-2xl flex items-center justify-center font-bold text-lg mx-auto shadow-md mb-2">
                    {selectedWorker.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {selectedWorker.fullName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedWorker.role}
                  </p>
                  <span className="inline-block bg-slate-200 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mt-1">
                    {selectedWorker.agentId}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Zone Actuelle:</span>
                    <span className="font-bold text-slate-700">{selectedWorker.zone}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Heure Entrée:</span>
                    <span className="font-mono font-bold text-slate-700">{selectedWorker.timeIn}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Statut Risque:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      selectedWorker.riskLevel === 'HIGH'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedWorker.riskLevel}
                    </span>
                  </div>
                </div>

                {selectedWorker.observation && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                    <p className="font-bold mb-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      Observation Terrain:
                    </p>
                    <p className="italic font-medium text-slate-700">
                      "{selectedWorker.observation}"
                    </p>
                  </div>
                )}

                <button
                  onClick={() => onInspectWorker(selectedWorker)}
                  className="w-full py-2.5 bg-[#E30613] hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  Ouvrir Fiche Complète
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold text-slate-600">Aucun collaborateur sélectionné</p>
                <p className="text-[11px] mt-1 text-slate-400">
                  Cliquez sur un repère d'agent sur la carte pour consulter ses détails GPS et sa conformité EPI.
                </p>
              </div>
            )}
          </div>

          {/* Quick Zone Distribution list */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
              Répartition par Zone ({activePlantRecords.length} en zone)
            </p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
              {plantInfo.zones.map((z) => {
                const cnt = activePlantRecords.filter((r) => r.zone === z).length;
                return (
                  <div key={z} className="flex justify-between items-center py-1 px-2 rounded-lg bg-slate-50 text-slate-600 font-medium">
                    <span className="truncate max-w-[140px]">{z}</span>
                    <span className="font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                      {cnt}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
