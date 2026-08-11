import React, { useState } from 'react';
import { X, Copy, Check, FileCode, CheckCircle2, ShieldCheck, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { GAS_CODE_SNIPPET, isGoogleAppsScript } from '../services/googleAppsScriptService';

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'instructions'>('instructions');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GAS_CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGasEnvironment = isGoogleAppsScript();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#E30613] rounded-xl flex items-center justify-center text-white shadow-md">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">Google Apps Script Integration</h2>
                {isGasEnvironment ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live GAS Environment
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Prêt pour Déploiement GAS
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Publication de l'application Web Holcim HSE GPS Tracker via Google Apps Script & Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'instructions'
                ? 'bg-white text-[#E30613] border-[#E30613] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            📋 Procédure de Publication
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'code'
                ? 'bg-white text-[#E30613] border-[#E30613] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            ⚙️ Backend Code.gs (Google Sheets API)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          
          {activeTab === 'instructions' && (
            <div className="space-y-5">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-900 text-xs">
                <ShieldCheck className="w-5 h-5 text-[#E30613] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">Intégration Bimodale Détectée</h4>
                  <p className="text-slate-600">
                    L'application supporte automatiquement l'API <strong>google.script.run</strong>. Lorsqu'elle tourne dans Google Apps Script Web App, elle se connecte directement à votre Google Sheet.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E30613] text-white flex items-center justify-center text-xs">1</span>
                  Création du Fichier Google Sheets & Apps Script
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 pl-2">
                  <li>Ouvrez votre fichier <strong>Google Sheets</strong> de suivi GPS.</li>
                  <li>Nommez la première feuille : <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-900">GPS_Data</code></li>
                  <li>Ajoutez les en-têtes en ligne 1 : <span className="font-mono text-slate-800">Usine, ID, Email, Intime, Lat, Lon, Outtime, Zone, Obs</span></li>
                  <li>Allez dans le menu : <strong>Extensions → Apps Script</strong>.</li>
                </ol>

                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 pt-2">
                  <span className="w-6 h-6 rounded-full bg-[#E30613] text-white flex items-center justify-center text-xs">2</span>
                  Copier le Script Backend (Code.gs)
                </h3>
                <p className="text-xs text-slate-600 pl-2">
                  Dans l'éditeur Apps Script, effacez le contenu du fichier <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-900">Code.gs</code> et collez le code de l'onglet <strong>Backend Code.gs</strong>.
                </p>

                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 pt-2">
                  <span className="w-6 h-6 rounded-full bg-[#E30613] text-white flex items-center justify-center text-xs">3</span>
                  Ajouter l'Interface Web (Index.html)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 pl-2">
                  <li>Dans Apps Script, cliquez sur le bouton <strong className="text-slate-900">+</strong> à côté de Fichiers, puis choisissez <strong>HTML</strong>.</li>
                  <li>Nommez le fichier : <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-900">Index</code>.</li>
                  <li>Incorporez votre bundle HTML de cette application web.</li>
                </ol>

                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 pt-2">
                  <span className="w-6 h-6 rounded-full bg-[#E30613] text-white flex items-center justify-center text-xs">4</span>
                  Déploiement en Web App
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 pl-2">
                  <li>Cliquez sur <strong>Déployer → Nouveau déploiement</strong>.</li>
                  <li>Sélectionnez le type : <strong>Application Web</strong>.</li>
                  <li>Exécuter en tant que : <strong>Moi (votre compte Holcim/Google)</strong>.</li>
                  <li>Qui a accès : <strong>Toute personne possédant un compte Google / Au sein de l'organisation</strong>.</li>
                  <li>Cliquez sur <strong>Déployer</strong> et autorisez les accès Google Sheets !</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Fichier : Code.gs (Google Apps Script)</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-[#E30613] hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier Code.gs</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[350px]">
                <pre>{GAS_CODE_SNIPPET}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
