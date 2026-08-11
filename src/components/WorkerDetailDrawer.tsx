import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  HardHat, 
  Phone, 
  Mail, 
  Clock, 
  AlertTriangle,
  UserCheck,
  LogOut,
  Save
} from 'lucide-react';
import { MovementRecord, RiskLevel } from '../types';

interface WorkerDetailDrawerProps {
  record: MovementRecord | null;
  onClose: () => void;
  onUpdateRecord: (updated: MovementRecord) => void;
}

export const WorkerDetailDrawer: React.FC<WorkerDetailDrawerProps> = ({
  record,
  onClose,
  onUpdateRecord
}) => {
  if (!record) return null;

  const [observation, setObservation] = useState(record.observation);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(record.riskLevel);
  const [ppeStatus, setPpeStatus] = useState(record.ppeStatus);
  const [isSaving, setIsSaving] = useState(false);

  const isCurrentlyIn = !record.timeOut || record.timeOut.trim() === '';

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateRecord({
        ...record,
        observation,
        riskLevel,
        ppeStatus
      });
      setIsSaving(false);
    }, 300);
  };

  const handleMarkRas = () => {
    setObservation('RAS');
    setRiskLevel('NONE');
    onUpdateRecord({
      ...record,
      observation: 'RAS',
      riskLevel: 'NONE',
      ppeStatus
    });
  };

  const handleToggleCheckOut = () => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    onUpdateRecord({
      ...record,
      timeOut: isCurrentlyIn ? nowStr : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-10 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E30613] flex items-center justify-center font-bold text-sm text-white shadow-md">
              {record.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-extrabold">{record.fullName}</h2>
              <p className="text-xs text-slate-300">{record.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-grow">
          
          {/* Quick Info Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Origine Site</span>
              <span className="font-extrabold text-slate-800 text-sm">{record.plant}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Matricule Agent</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{record.agentId}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs">
            <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">
              Coordonnées Collaborateur
            </p>
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
              <div className="flex items-center text-slate-700 font-medium space-x-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{record.email}</span>
              </div>
              {record.phone && (
                <div className="flex items-center text-slate-700 font-medium space-x-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{record.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location & GPS */}
          <div className="space-y-2 text-xs">
            <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">
              Positionnement GPS Live
            </p>
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#E30613]" />
                  <span className="font-bold text-sm uppercase">{record.zone}</span>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  isCurrentlyIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  {isCurrentlyIn ? 'En Zone' : 'Sorti'}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                <span>GPS: {record.lat}, {record.lon}</span>
                <a
                  href={`https://www.google.com/maps?q=${record.lat},${record.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 font-sans font-bold flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Time & Presence */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">
                Horodatage Mouvement
              </p>
              <button
                onClick={handleToggleCheckOut}
                className="text-[11px] font-bold text-[#E30613] hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isCurrentlyIn ? 'Enregistrer Sortie' : 'Marquer Présent'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Heure d'Entrée:</span>
                <span className="font-mono font-bold text-slate-800">{record.timeIn}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Heure de Sortie:</span>
                <span className="font-mono font-bold text-slate-800">
                  {record.timeOut || 'En cours (Présent)'}
                </span>
              </div>
            </div>
          </div>

          {/* Safety PPE Checklist */}
          <div className="space-y-2 text-xs">
            <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5" />
              Équipements de Protection Individuelle (EPI)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'helmet', label: 'Casque' },
                { key: 'vest', label: 'Gilet Réfléchissant' },
                { key: 'boots', label: 'Chaussures Sécurité' },
                { key: 'goggles', label: 'Lunettes Protection' },
              ].map(({ key, label }) => {
                const checked = ppeStatus[key as keyof typeof ppeStatus];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setPpeStatus((prev) => ({ ...prev, [key]: !prev[key as keyof typeof ppeStatus] }))
                    }
                    className={`p-2.5 rounded-xl border text-left font-bold flex items-center justify-between transition-all ${
                      checked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <span>{label}</span>
                    <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-emerald-600' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* HSE Observation & Risk Evaluation Editor */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">
                Évaluation & Observation HSE
              </p>
              <button
                onClick={handleMarkRas}
                className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marquer RAS</span>
              </button>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Niveau de Risque:
                </label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-800 text-xs outline-none focus:ring-2 focus:ring-[#E30613]"
                >
                  <option value="NONE">Aucun Risque (RAS)</option>
                  <option value="LOW">Risque Faible</option>
                  <option value="MEDIUM">Risque Modéré</option>
                  <option value="HIGH">HAUT RISQUE / ALERTE</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Note d'Observation Terrain:
                </label>
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#E30613]"
                  placeholder="Décrire l'anomalie ou l'incident HSE constaté..."
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Enregistrement...' : 'Enregistrer Modifications'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs no-print">
          <span className="text-slate-400">ID: {record.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
