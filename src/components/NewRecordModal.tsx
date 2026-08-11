import React, { useState } from 'react';
import { X, ShieldAlert, Plus, Check } from 'lucide-react';
import { MovementRecord, PlantCode, RiskLevel } from '../types';
import { PLANTS_DATA } from '../data/mockData';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: MovementRecord) => void;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  onAddRecord
}) => {
  if (!isOpen) return null;

  const [plant, setPlant] = useState<PlantCode>('OGGAZ');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Opérateur HSE');
  const [zone, setZone] = useState('Zone Cru');
  const [observation, setObservation] = useState('RAS');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('NONE');
  const [helmet, setHelmet] = useState(true);
  const [vest, setVest] = useState(true);
  const [boots, setBoots] = useState(true);
  const [goggles, setGoggles] = useState(true);

  const selectedPlantData = PLANTS_DATA.find((p) => p.code === plant) || PLANTS_DATA[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    // Add realistic randomized offset near site center
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lonOffset = (Math.random() - 0.5) * 0.01;

    const newRec: MovementRecord = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      plant,
      agentId: `AG-${Math.floor(100 + Math.random() * 900)}`,
      fullName: fullName.trim(),
      email: email.trim(),
      role: role.trim() || 'Agent Terrain',
      timeIn: nowStr,
      timeOut: null,
      lat: Number((selectedPlantData.centerLat + latOffset).toFixed(4)),
      lon: Number((selectedPlantData.centerLon + lonOffset).toFixed(4)),
      zone,
      observation: observation.trim() || 'RAS',
      riskLevel,
      ppeStatus: { helmet, vest, boots, goggles },
      createdAt: new Date().toISOString()
    };

    onAddRecord(newRec);
    onClose();
    
    // Reset form
    setFullName('');
    setEmail('');
    setObservation('RAS');
    setRiskLevel('NONE');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#E30613] text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <h3 className="font-extrabold text-base uppercase tracking-tight">
              Enregistrer Entrée ou Observation HSE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Plant & Zone Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Usine Holcim:</label>
              <select
                value={plant}
                onChange={(e) => {
                  const newP = e.target.value as PlantCode;
                  setPlant(newP);
                  const pData = PLANTS_DATA.find((p) => p.code === newP);
                  if (pData && pData.zones.length > 0) setZone(pData.zones[0]);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#E30613]"
              >
                <option value="OGGAZ">Usine OGGAZ</option>
                <option value="M'SILA">Usine M'SILA</option>
                <option value="CILAS">CILAS Biskra</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Zone de Localisation:</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#E30613]"
              >
                {selectedPlantData.zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
                <option value="Out of Zone">Out of Zone</option>
              </select>
            </div>
          </div>

          {/* Collaborateur Name & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nom du Collaborateur *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex: Rachid Khelifi"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-[#E30613]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Professionnel *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="r.khelifi@holcim.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-[#E30613]"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Poste / Fonction</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ex: Inspecteur Sécurité, Conducteur..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-[#E30613]"
            />
          </div>

          {/* Risk Level & Observation */}
          <div className="space-y-3 p-3 bg-red-50/50 border border-red-100 rounded-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Évaluation du Risque:</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#E30613]"
                >
                  <option value="NONE">Aucun Risque (RAS)</option>
                  <option value="LOW">Risque Faible</option>
                  <option value="MEDIUM">Risque Modéré</option>
                  <option value="HIGH">HAUT RISQUE / ALERTE</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Statut initial:</label>
                <div className="p-2.5 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 rounded-xl flex items-center justify-between">
                  <span>En zone (IN)</span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Observation / Description de l'Alerte:</label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={2}
                placeholder="RAS ou spécifier le risque observé sur le terrain..."
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-[#E30613]"
              />
            </div>
          </div>

          {/* PPE Equipment Toggles */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Conformité Équipements EPI:</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input type="checkbox" checked={helmet} onChange={(e) => setHelmet(e.target.checked)} className="rounded text-[#E30613]" />
                <span>Casque Sécurité</span>
              </label>
              <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input type="checkbox" checked={vest} onChange={(e) => setVest(e.target.checked)} className="rounded text-[#E30613]" />
                <span>Gilet Haute Visibilité</span>
              </label>
              <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input type="checkbox" checked={boots} onChange={(e) => setBoots(e.target.checked)} className="rounded text-[#E30613]" />
                <span>Chaussures Sécurité</span>
              </label>
              <label className="flex items-center space-x-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input type="checkbox" checked={goggles} onChange={(e) => setGoggles(e.target.checked)} className="rounded text-[#E30613]" />
                <span>Lunettes Protection</span>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#E30613] hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Créer le Mouvement
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
