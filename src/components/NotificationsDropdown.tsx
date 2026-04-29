import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertTriangle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Alert {
  id: string;
  title: string;
  severity: string;
  timestamp: string;
  is_read: number;
}

export function NotificationsDropdown({ isOpen, onClose, onNavigate }: { 
  isOpen: boolean; 
  onClose: () => void;
  onNavigate: (tab: string) => void;
}) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = () => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.slice(0, 5)));
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  const handleClearAll = async () => {
    await fetch('/api/alerts', { method: 'DELETE' });
    setAlerts([]);
  };

  const handleMarkAsRead = async (id: string) => {
    await fetch(`/api/alerts/${id}/read`, { method: 'PATCH' });
    fetchAlerts();
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 dropdown-panel z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-aura-gold" />
                Strategic Alerts
              </h3>
              <div className="flex items-center gap-4">
                {alerts.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="text-[9px] text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest"
                  >
                    Clear
                  </button>
                )}
                <span className="text-[10px] text-aura-gold uppercase font-bold tracking-widest">{unreadCount} New</span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {alerts.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {alerts.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => {
                        handleMarkAsRead(alert.id);
                        onNavigate('alerts');
                        onClose();
                      }}
                      className={cn(
                        "w-full p-4 text-left hover:bg-white/5 transition-colors group relative",
                        !alert.is_read && "bg-aura-gold/[0.02]"
                      )}
                    >
                      {!alert.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-aura-gold" />
                      )}
                      <div className="flex justify-between items-start mb-1">
                        <div className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter",
                          alert.severity === 'High' ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {alert.severity}
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs font-medium transition-colors",
                        alert.is_read ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-200 group-hover:text-aura-gold"
                      )}>
                        {alert.title}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-zinc-600">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-medium">All systems optimal</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                onNavigate('alerts');
                onClose();
              }}
              className="w-full p-3 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border-t border-white/5 flex items-center justify-center gap-2"
            >
              View War Room Alerts
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
