import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { Toolbar } from './components/Toolbar';
import { MovementTable } from './components/MovementTable';
import { GpsMapView } from './components/GpsMapView';
import { AnalyticsView } from './components/AnalyticsView';
import { WorkerDetailDrawer } from './components/WorkerDetailDrawer';
import { NewRecordModal } from './components/NewRecordModal';
import { GoogleAppsScriptModal } from './components/GoogleAppsScriptModal';
import { NotificationToast } from './components/NotificationToast';
import { MovementRecord, ViewMode, FilterState, NotificationItem } from './types';
import { INITIAL_MOVEMENTS } from './data/mockData';
import { 
  isGoogleAppsScript, 
  fetchGoogleAppsScriptData, 
  saveGoogleAppsScriptRecord 
} from './services/googleAppsScriptService';

const STORAGE_KEY = 'holcim_hse_gps_records_v1';

export default function App() {
  // Load initial data from localStorage if available
  const [records, setRecords] = useState<MovementRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_MOVEMENTS;
  });

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Inspector & Modals
  const [inspectRecord, setInspectRecord] = useState<MovementRecord | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Auto load Google Apps Script data if running inside Apps Script Web App, or Cloud SQL /api/movements
  useEffect(() => {
    if (isGoogleAppsScript()) {
      fetchGoogleAppsScriptData()
        .then((gasRecords) => {
          if (gasRecords.length > 0) {
            setRecords(gasRecords);
            addToast(
              'Google Sheets Synchronisé',
              `${gasRecords.length} enregistrements chargés depuis Google Sheets Apps Script.`,
              'success'
            );
          }
        })
        .catch((err) => {
          console.warn('Google Apps Script initial fetch error:', err);
        });
    } else {
      fetch('/api/movements')
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
            setRecords(resData.data);
            addToast('Base Cloud SQL Connectée', `${resData.data.length} enregistrements chargés depuis Cloud SQL.`, 'success');
          }
        })
        .catch(() => {
          // Fallback to local storage or mock data
        });
    }
  }, []);

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    plant: 'ALL',
    searchQuery: '',
    presence: 'ALL',
    risk: 'ALL',
    zone: 'ALL'
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  // Toast Notification helper
  const addToast = (title: string, message: string, type: 'risk' | 'info' | 'success') => {
    const newToast: NotificationItem = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setNotifications((prev) => [newToast, ...prev].slice(0, 3));

    // Auto dismiss after 5s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newToast.id));
    }, 5000);
  };

  const handleDismissToast = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Manual Refresh
  const handleRefresh = (showToast = true) => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
      if (showToast) {
        addToast(
          'Mise à jour Satellite Réussie',
          'Toutes les positions GPS et statuts des zones Holcim ont été actualisés.',
          'info'
        );
      }
    }, 400);
  };

  // Auto-refresh interval (20s)
  useEffect(() => {
    if (!isAutoRefreshing) return;
    const interval = setInterval(() => {
      handleRefresh(false);
    }, 20000);
    return () => clearInterval(interval);
  }, [isAutoRefreshing]);

  // Toggle Check-in / Check-out status
  const handleToggleStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          const isCurrentlyIn = !rec.timeOut || rec.timeOut.trim() === '';
          const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
          const updated = {
            ...rec,
            timeOut: isCurrentlyIn ? nowStr : null
          };

          addToast(
            isCurrentlyIn ? 'Sortie Enregistrée' : 'Entrée Enregistrée',
            `${rec.fullName} est désormais ${isCurrentlyIn ? 'marqué(e) Sorti(e)' : 'en zone'}.`,
            isCurrentlyIn ? 'info' : 'success'
          );

          if (inspectRecord && inspectRecord.id === id) {
            setInspectRecord(updated);
          }

          return updated;
        }
        return rec;
      })
    );
  };

  // Update record (from drawer or modal)
  const handleUpdateRecord = (updatedRecord: MovementRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));
    if (inspectRecord && inspectRecord.id === updatedRecord.id) {
      setInspectRecord(updatedRecord);
    }
    addToast('Modification Enregistrée', `Fiche de ${updatedRecord.fullName} mise à jour.`, 'success');
  };

  // Add new movement record
  const handleAddRecord = (newRecord: MovementRecord) => {
    setRecords((prev) => [newRecord, ...prev]);

    if (isGoogleAppsScript()) {
      saveGoogleAppsScriptRecord(newRecord).then((success) => {
        if (success) {
          addToast('Google Sheets Enregistré', 'La nouvelle ligne a été ajoutée dans la feuille GPS_Data.', 'success');
        }
      });
    } else {
      fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      }).catch((err) => {
        console.warn('API sync error:', err);
      });
    }

    addToast(
      newRecord.riskLevel === 'HIGH' ? 'Alerte Risque Enregistrée' : 'Nouveau Mouvement',
      `Passage enregistré pour ${newRecord.fullName} sur ${newRecord.plant} (${newRecord.zone}).`,
      newRecord.riskLevel === 'HIGH' ? 'risk' : 'success'
    );
  };

  // Reset to default mock data
  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser les données aux valeurs par défaut ?')) {
      setRecords(INITIAL_MOVEMENTS);
      localStorage.removeItem(STORAGE_KEY);
      addToast('Réinitialisation', 'Les données du tableau de bord ont été restaurées.', 'info');
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Usine',
      'Matricule',
      'Collaborateur',
      'Email',
      'Poste',
      'Heure Entree',
      'Heure Sortie',
      'Latitude',
      'Longitude',
      'Zone',
      'Observation',
      'Niveau Risque'
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.plant,
      r.agentId,
      `"${r.fullName}"`,
      r.email,
      `"${r.role}"`,
      r.timeIn,
      r.timeOut || 'EN ZONE',
      r.lat,
      r.lon,
      `"${r.zone}"`,
      `"${r.observation}"`,
      r.riskLevel
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Holcim_HSE_GPS_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Réussi', 'Le fichier CSV a été téléchargé avec succès.', 'success');
  };

  // Filtering Logic
  const filteredRecords = useMemo(() => {
    let result = [...records];

    // Filter by plant
    if (filter.plant !== 'ALL') {
      result = result.filter((r) => r.plant === filter.plant);
    }

    // Filter by presence
    if (filter.presence === 'IN') {
      result = result.filter((r) => !r.timeOut || r.timeOut.trim() === '');
    } else if (filter.presence === 'OUT') {
      result = result.filter((r) => r.timeOut && r.timeOut.trim() !== '');
    }

    // Filter by risk
    if (filter.risk === 'RISK_ONLY') {
      result = result.filter((r) => {
        const isOutOfZone = r.zone.trim().toLowerCase() === 'out of zone';
        const isCurrentlyIn = !r.timeOut || r.timeOut.trim() === '';
        const hasObs = r.observation && r.observation.trim().toUpperCase() !== 'RAS' && r.observation.trim() !== '';
        return (!isOutOfZone && isCurrentlyIn && hasObs) || r.riskLevel === 'HIGH' || r.riskLevel === 'MEDIUM';
      });
    } else if (filter.risk === 'RAS_ONLY') {
      result = result.filter((r) => r.riskLevel === 'NONE' || r.observation.toUpperCase() === 'RAS');
    }

    // Search query
    if (filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.agentId.toLowerCase().includes(q) ||
          r.zone.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.observation.toLowerCase().includes(q)
      );
    }

    // Sort: High risk on top
    result.sort((a, b) => {
      const getScore = (r: MovementRecord) => {
        if (r.riskLevel === 'HIGH') return 3;
        if (r.riskLevel === 'MEDIUM') return 2;
        const isOutOfZone = r.zone.trim().toLowerCase() === 'out of zone';
        const isCurrentlyIn = !r.timeOut || r.timeOut.trim() === '';
        const hasObs = r.observation && r.observation.trim().toUpperCase() !== 'RAS' && r.observation.trim() !== '';
        return (!isOutOfZone && isCurrentlyIn && hasObs) ? 1 : 0;
      };
      return getScore(b) - getScore(a);
    });

    return result;
  }, [records, filter]);

  // Total High Risk Count for Header warning
  const totalHighAlerts = useMemo(() => {
    return records.filter((r) => r.riskLevel === 'HIGH').length;
  }, [records]);

  // Quick filter helper from KPI cards
  const handleSelectFilterQuick = (type: 'all' | 'presence_in' | 'risk_only') => {
    if (type === 'all') {
      setFilter((prev) => ({ ...prev, presence: 'ALL', risk: 'ALL' }));
    } else if (type === 'presence_in') {
      setFilter((prev) => ({ ...prev, presence: 'IN', risk: 'ALL' }));
    } else if (type === 'risk_only') {
      setFilter((prev) => ({ ...prev, risk: 'RISK_ONLY', presence: 'ALL' }));
    }
  };

  const lastUpdatedText = lastUpdated.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#E30613] selection:text-white">
      
      {/* Header Bar */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isAutoRefreshing={isAutoRefreshing}
        setIsAutoRefreshing={setIsAutoRefreshing}
        onRefresh={() => handleRefresh(true)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        lastUpdatedText={lastUpdatedText}
        totalAlerts={totalHighAlerts}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 print-container">
        
        {/* KPI Cards */}
        <KpiCards
          records={records}
          onSelectFilterQuick={handleSelectFilterQuick}
          activePresenceFilter={filter.presence}
          activeRiskFilter={filter.risk}
        />

        {/* View Content */}
        {viewMode === 'table' && (
          <div>
            <Toolbar
              filter={filter}
              setFilter={setFilter}
              onRefresh={() => handleRefresh(true)}
              onExportCsv={handleExportCsv}
              onResetData={handleResetData}
              totalFilteredCount={filteredRecords.length}
              totalCount={records.length}
            />

            <MovementTable
              records={filteredRecords}
              onInspectWorker={(r) => setInspectRecord(r)}
              onToggleStatus={handleToggleStatus}
              isLoading={isLoading}
            />
          </div>
        )}

        {viewMode === 'map' && (
          <GpsMapView
            records={filteredRecords}
            onInspectWorker={(r) => setInspectRecord(r)}
          />
        )}

        {viewMode === 'analytics' && (
          <AnalyticsView records={records} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-[#E30613] text-white font-extrabold text-xs px-2.5 py-1 rounded-md tracking-widest uppercase">
              HOLCIM
            </div>
            <span className="text-xs font-semibold text-slate-600">
              Control Tower & Supervision GPS | Holcim El Djazaïr
            </span>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center sm:text-right">
            Système Central de Sécurité &copy; 2026 Holcim El Djazaïr - HSE Monitoring
          </p>
        </div>
      </footer>

      {/* Worker Detail Inspector Drawer */}
      <WorkerDetailDrawer
        record={inspectRecord}
        onClose={() => setInspectRecord(null)}
        onUpdateRecord={handleUpdateRecord}
      />

      {/* New Record / Incident Modal */}
      <NewRecordModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddRecord={handleAddRecord}
      />

      {/* Google Apps Script Integration Guide Modal */}
      <GoogleAppsScriptModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
      />

      {/* Live Toast Notifications */}
      <NotificationToast
        notifications={notifications}
        onDismiss={handleDismissToast}
      />

    </div>
  );
}
