import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  BrainCircuit, 
  ArrowRight,
  Bell,
  TrendingDown,
  Users,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Alert {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  strategy: string;
  timestamp: string;
  is_read: number;
}

export function SmartAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const fetchAlerts = async () => {
    const response = await fetch('/api/alerts');
    const data = await response.json();
    setAlerts(data);
  };

  const generateNewAlert = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/alerts/generate', { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Alert generation failed');
      }
      await fetchAlerts();
    } catch (error: any) {
      console.error('Alert Generation Error:', error);
      alert(`Strategic Scan Failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">Smart Alerts</h2>
          <p className="text-zinc-500 mt-1">Proactive risk detection and AI-generated mitigation strategies.</p>
        </div>
        <button 
          onClick={generateNewAlert}
          disabled={isGenerating}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
          Scan for Risks
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts List */}
        <div className="lg:col-span-1 space-y-4">
          <AnimatePresence mode="popLayout">
            {alerts.length === 0 ? (
              <div className="glass-panel p-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-20" />
                <p className="text-zinc-500 text-sm">No active threats detected. System is optimal.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <motion.button
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedAlert(alert)}
                  className={cn(
                    "w-full text-left p-6 glass-panel border transition-all relative group",
                    selectedAlert?.id === alert.id 
                      ? "border-aura-gold/50 bg-aura-gold/5" 
                      : "border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      alert.severity === 'High' ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      alert.severity === 'High' ? "text-red-500" : "text-yellow-500"
                    )}>
                      {alert.severity} Severity
                    </span>
                  </div>
                  <ChevronRight className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all",
                    selectedAlert?.id === alert.id ? "text-aura-gold translate-x-1" : "text-zinc-700"
                  )} />
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Strategy Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedAlert ? (
              <motion.div 
                key={selectedAlert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 space-y-8"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-aura-gold/10 flex items-center justify-center border border-aura-gold/20">
                      <BrainCircuit className="w-6 h-6 text-aura-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedAlert.title}</h3>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest">Aura Mitigation Strategy</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-all">
                      Approve Action
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 prose prose-invert max-w-none">
                  <div className="flex items-center gap-2 text-aura-gold mb-4">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Neural Recommendation</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {selectedAlert.strategy}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-[10px] font-bold uppercase text-zinc-500">Root Cause</span>
                    </div>
                    <p className="text-xs text-zinc-400">Market saturation in Tier 2 cities and aggressive competitor pricing.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-aura-gold" />
                      <span className="text-[10px] font-bold uppercase text-zinc-500">Impact Scope</span>
                    </div>
                    <p className="text-xs text-zinc-400">Affecting 12% of high-value enterprise accounts.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <ShieldAlert className="w-10 h-10 text-zinc-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-zinc-400">No Alert Selected</h4>
                  <p className="text-sm text-zinc-600 max-w-xs mx-auto">Select an active alert from the list to view Aura's automated mitigation strategy.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  );
}
