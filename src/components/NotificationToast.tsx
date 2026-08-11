import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationToastProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full no-print">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded-2xl shadow-xl border flex items-start justify-between backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${
            n.type === 'risk'
              ? 'bg-red-950/90 text-white border-red-500/80'
              : n.type === 'success'
              ? 'bg-emerald-950/90 text-white border-emerald-500/80'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              {n.type === 'risk' ? (
                <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
              ) : n.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-xs tracking-tight">{n.title}</h4>
              <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">{n.message}</p>
              <span className="text-[9px] opacity-60 font-mono mt-1 block">{n.timestamp}</span>
            </div>
          </div>

          <button
            onClick={() => onDismiss(n.id)}
            className="p-1 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
