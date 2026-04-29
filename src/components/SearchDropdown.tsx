import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BrainCircuit, LayoutDashboard, TrendingUp, Zap, FileText, ChevronRight, Mic, Bell, Users, Database, ShieldCheck, CreditCard, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const searchItems = [
  { id: 'dashboard', label: 'Executive Overview', sub: 'Performance Metrics', icon: LayoutDashboard },
  { id: 'intelligence', label: 'Aura Intelligence', sub: 'Strategy Consultation', icon: BrainCircuit },
  { id: 'voice', label: 'Aura Voice', sub: 'Multimodal Assistant', icon: Mic },
  { id: 'alerts', label: 'Smart Alerts', sub: 'Risk Mitigation', icon: Bell },
  { id: 'simulator', label: 'What-If Simulator', sub: 'Projection Modeling', icon: Zap },
  { id: 'reports', label: 'Report Generator', sub: 'Board-ready Docs', icon: FileText },
  { id: 'warroom', label: 'The War Room', sub: 'Live Collaboration', icon: Users },
  { id: 'ingestion', label: 'Data Ingestion', sub: 'Proprietary Data Ingest', icon: Database },
  { id: 'market', label: 'Market Analysis', sub: 'Sentiment Tracking', icon: TrendingUp },
  { id: 'security', label: 'Security & Compliance', sub: 'Threat Detection', icon: ShieldCheck },
  { id: 'billing', label: 'Subscription & Billing', icon: CreditCard, sub: 'Financial Tiers' },
  { id: 'settings', label: 'System Settings', icon: Settings, sub: 'Environment Config' },
];

export function SearchDropdown({ query, isOpen, onClose, onNavigate }: { 
  query: string;
  isOpen: boolean; 
  onClose: () => void;
  onNavigate: (tab: string) => void;
}) {
  const filteredItems = searchItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.sub.toLowerCase().includes(query.toLowerCase())
  );

  const displayItems = query ? filteredItems : searchItems.slice(0, 3);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dropdown-panel shadow-2xl overflow-hidden relative border-aura-gold/30"
      >
        <div className="p-2 border-b border-white/5 bg-white/5 flex items-center justify-between px-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {query ? 'Intelligence Results' : 'Recommended Actions'}
          </span>
          {query && <span className="text-[10px] font-mono text-aura-gold">{filteredItems.length} found</span>}
        </div>

        <div className="p-2">
          {displayItems.length > 0 ? (
            <div className="space-y-1">
              {displayItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-aura-gold transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{item.label}</p>
                      <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-aura-gold transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-600">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-xs font-medium">No results found for "{query}"</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
