import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, LogOut, Shield, Key, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';

export function ProfileDropdown({ isOpen, onClose, onNavigate, onLogout }: { 
  isOpen: boolean; 
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 dropdown-panel z-50 overflow-hidden border-aura-gold/20"
          >
            <div className="p-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-aura-gold/20 flex items-center justify-center text-aura-gold border border-aura-gold/30">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold">Franklyn O.</p>
                  <p className="text-[10px] text-aura-gold font-bold uppercase tracking-tighter flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />
                    Elite Tier
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-widest">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <p className="text-zinc-500 mb-1">Session</p>
                  <p className="text-emerald-400">Secure</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <p className="text-zinc-500 mb-1">AI Usage</p>
                  <p className="text-aura-gold">4.2k pts</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {[
                { id: 'settings', label: 'Account Settings', icon: Settings },
                { id: 'billing', label: 'Billing & Tiers', icon: CreditCard },
                { id: 'security', label: 'Security & Keys', icon: Shield },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-aura-gold transition-colors" />
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
                </button>
              ))}
              
              {window.aistudio && (
                <button
                  onClick={() => {
                    window.aistudio.openSelectKey();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-aura-gold/10 transition-all group"
                >
                  <Key className="w-4 h-4 text-aura-gold" />
                  <span className="text-xs font-bold text-aura-gold">Switch API Key</span>
                </button>
              )}
            </div>

            <div className="p-2 border-t border-white/5 bg-white/5">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all group"
              >
                <LogOut className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors" />
                <span className="text-xs font-medium text-zinc-400 group-hover:text-red-400 transition-colors">Terminate Session</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
