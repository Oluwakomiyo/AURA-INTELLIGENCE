import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Cpu, Key } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export function Settings() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text">System Settings</h1>
          <p className="text-zinc-500 mt-1">Configure your executive intelligence environment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-aura-gold/10 rounded-lg">
              <User className="w-5 h-5 text-aura-gold" />
            </div>
            <h2 className="text-lg font-semibold">Executive Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                defaultValue="Franklyn O."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-aura-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                defaultValue="executive@aura.ai"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-aura-gold/50"
              />
            </div>
          </div>
        </div>

        {/* Intelligence Config */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-aura-gold/10 rounded-lg">
              <Cpu className="w-5 h-5 text-aura-gold" />
            </div>
            <h2 className="text-lg font-semibold">Intelligence Engine</h2>
          </div>
          
          <div className="space-y-4">
            {window.aistudio && (
              <div className="mb-6 space-y-3">
                <button 
                  onClick={() => window.aistudio.openSelectKey()}
                  className="w-full py-3 bg-aura-gold/10 border border-aura-gold/20 rounded-xl text-sm font-bold text-aura-gold hover:bg-aura-gold/20 transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Select Intelligence API Key
                </button>
                <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                  Aura requires a valid Gemini API key from a paid Google Cloud project to perform advanced analysis.
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Model Priority</p>
                <p className="text-xs text-zinc-500">Prefer high-reasoning models for analysis</p>
              </div>
              <div className="w-12 h-6 bg-aura-gold rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Real-time Grounding</p>
                <p className="text-xs text-zinc-500">Enable Google Search for latest data</p>
              </div>
              <div className="w-12 h-6 bg-aura-gold rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-aura-gold/10 rounded-lg">
              <Bell className="w-5 h-5 text-aura-gold" />
            </div>
            <h2 className="text-lg font-semibold">Smart Alerts</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">Market Volatility Alerts</p>
              <input type="checkbox" defaultChecked className="accent-aura-gold" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Strategic Risk Warnings</p>
              <input type="checkbox" defaultChecked className="accent-aura-gold" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Daily Intelligence Briefing</p>
              <input type="checkbox" defaultChecked className="accent-aura-gold" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-aura-gold/10 rounded-lg">
              <Shield className="w-5 h-5 text-aura-gold" />
            </div>
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
              Reset Security Keys
            </button>
            <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors text-red-400">
              Revoke All Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
