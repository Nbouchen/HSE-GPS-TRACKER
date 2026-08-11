import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertOctagon, 
  Building2, 
  PieChart, 
  CheckCircle2, 
  HardHat, 
  Footprints
} from 'lucide-react';
import { MovementRecord } from '../types';

interface AnalyticsViewProps {
  records: MovementRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ records }) => {
  const total = records.length;
  if (total === 0) return null;

  // Breakdown by plant
  const oggazCount = records.filter((r) => r.plant === 'OGGAZ').length;
  const msilaCount = records.filter((r) => r.plant === 'M\'SILA').length;
  const cilasCount = records.filter((r) => r.plant === 'CILAS').length;

  // Risk levels
  const highRiskCount = records.filter((r) => r.riskLevel === 'HIGH').length;
  const mediumRiskCount = records.filter((r) => r.riskLevel === 'MEDIUM').length;
  const rasCount = total - highRiskCount - mediumRiskCount;

  // PPE compliance metrics
  const helmetOk = records.filter((r) => r.ppeStatus?.helmet).length;
  const vestOk = records.filter((r) => r.ppeStatus?.vest).length;
  const bootsOk = records.filter((r) => r.ppeStatus?.boots).length;
  const gogglesOk = records.filter((r) => r.ppeStatus?.goggles).length;

  const getPercent = (val: number) => Math.round((val / total) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#E30613]" />
            <h2 className="text-lg font-extrabold uppercase tracking-tight">
              Rapport d'Analytique HSE & Conformité
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Indicateurs clés de performance HSE, suivi de la conformité des équipements de protection individuelle (EPI) et répartition des risques sur l'ensemble des sites Holcim.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block">Conformité Globale</span>
            <span className="text-lg font-black text-emerald-400">
              {getPercent(rasCount)}% Sécurisé
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Répartition par Usine */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Répartition par Site Usine
            </h3>
            <span className="text-xs font-bold text-slate-400">{total} Mouvements</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-700">Usine OGGAZ</span>
                <span className="text-slate-600">{oggazCount} ({getPercent(oggazCount)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${getPercent(oggazCount)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700">Usine M'SILA</span>
                <span className="text-slate-600">{msilaCount} ({getPercent(msilaCount)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${getPercent(msilaCount)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-700">CILAS Biskra</span>
                <span className="text-slate-600">{cilasCount} ({getPercent(cilasCount)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercent(cilasCount)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Niveau de Risque & Incidents */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#E30613]" />
              Niveau de Risque HSE
            </h3>
            <span className="text-xs font-bold text-slate-400">Synthèse</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-rose-600 rounded-full animate-ping"></span>
                <span className="text-xs font-bold text-rose-800">Haut Risque / Urgence</span>
              </div>
              <span className="text-base font-black text-rose-700">{highRiskCount}</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                <span className="text-xs font-bold text-amber-800">Risque Modéré</span>
              </div>
              <span className="text-base font-black text-amber-700">{mediumRiskCount}</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800">Aucun Risque (RAS)</span>
              </div>
              <span className="text-base font-black text-emerald-700">{rasCount}</span>
            </div>
          </div>
        </div>

        {/* Widget 3: Conformité Équipements EPI */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <HardHat className="w-4 h-4 text-slate-700" />
              Taux de Port des EPI
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Normes Holcim</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Casque de Sécurité</span>
              <span className="text-lg font-black text-slate-900">{getPercent(helmetOk)}%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Gilet Haute Visibilité</span>
              <span className="text-lg font-black text-slate-900">{getPercent(vestOk)}%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Chaussures de Sécurité</span>
              <span className="text-lg font-black text-slate-900">{getPercent(bootsOk)}%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Lunettes de Protection</span>
              <span className="text-lg font-black text-slate-900">{getPercent(gogglesOk)}%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
