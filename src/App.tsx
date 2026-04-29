import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Intelligence } from './components/Intelligence';
import { MarketAnalysis } from './components/MarketAnalysis';
import { Billing } from './components/Billing';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { ReportGenerator } from './components/ReportGenerator';
import { AuraVoice } from './components/AuraVoice';
import { SmartAlerts } from './components/SmartAlerts';
import { WarRoom } from './components/WarRoom';
import { DataIngestion } from './components/DataIngestion';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, User, Key } from 'lucide-react';
import { cn } from './lib/utils';
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { SearchDropdown } from './components/SearchDropdown';
import { ProfileDropdown } from './components/ProfileDropdown';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('aura_auth') === 'true';
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('aura_auth', 'true');
    } else {
      localStorage.removeItem('aura_auth');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-aura-black text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navigation */}
        <header className="h-20 border-b border-aura-border flex items-center justify-between px-8 bg-aura-black/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-aura-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Search intelligence, reports, or data..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-aura-gold/50 transition-all"
              />
              <SearchDropdown 
                query={searchQuery} 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)}
                onNavigate={setActiveTab}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "relative text-zinc-400 hover:text-aura-gold transition-all p-2 rounded-xl hover:bg-white/5",
                  isNotificationsOpen && "text-aura-gold bg-white/5"
                )}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-aura-gold rounded-full border-2 border-aura-black animate-pulse" />
              </button>
              <NotificationsDropdown 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
                onNavigate={setActiveTab}
              />
            </div>
            
            <div className="h-8 w-px bg-aura-border/50" />
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                  "flex items-center gap-3 group p-1.5 rounded-xl transition-all",
                  isProfileOpen ? "bg-white/5" : "hover:bg-white/5"
                )}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold group-hover:text-aura-gold transition-colors">Franklyn O.</p>
                  <p className="text-[10px] text-aura-gold font-bold uppercase tracking-tighter opacity-80">Executive Tier</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aura-gold/20 to-white/5 border border-aura-gold/30 flex items-center justify-center overflow-hidden group-hover:border-aura-gold/60 transition-all">
                  <User className="w-6 h-6 text-aura-gold" />
                </div>
              </button>
              <ProfileDropdown 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)}
                onNavigate={setActiveTab}
                onLogout={() => setIsAuthenticated(false)}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'intelligence' && <Intelligence />}
              {activeTab === 'voice' && <AuraVoice />}
              {activeTab === 'alerts' && <SmartAlerts />}
              {activeTab === 'simulator' && <ScenarioSimulator />}
              {activeTab === 'reports' && <ReportGenerator />}
              {activeTab === 'warroom' && <WarRoom />}
              {activeTab === 'ingestion' && <DataIngestion />}
              {activeTab === 'market' && <MarketAnalysis />}
              {activeTab === 'billing' && <Billing />}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'security' && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                    <Bell className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Security & Compliance</h2>
                  <p className="text-zinc-500 max-w-md">Your executive workspace is protected by 256-bit quantum-resistant encryption. No threats detected.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aura-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-aura-gold/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
      </main>
    </div>
  );
}
