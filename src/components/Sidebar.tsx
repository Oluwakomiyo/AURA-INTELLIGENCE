import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard,
  Zap,
  FileText,
  Mic,
  Bell,
  Users,
  Database,
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [alertCount, setAlertCount] = useState<string | null>('3');

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await fetch('/api/alerts');
        if (response.ok) {
          const data = await response.json();
          // Filter unread alerts if necessary, for now showing total
          setAlertCount(data.length > 0 ? data.length.toString() : null);
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    fetchAlertCount();
    // Refresh alert count every 30 seconds
    const interval = setInterval(fetchAlertCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Aura Intelligence', icon: BrainCircuit },
    { id: 'voice', label: 'Aura Voice', icon: Mic },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell, badge: alertCount },
    { id: 'simulator', label: 'What-If Simulator', icon: Zap },
    { id: 'reports', label: 'Report Generator', icon: FileText },
    { id: 'warroom', label: 'The War Room', icon: Users },
    { id: 'ingestion', label: 'Data Ingestion', icon: Database, tier: 'Elite' },
    { id: 'market', label: 'Market Analysis', icon: TrendingUp },
    { id: 'security', label: 'Security & Compliance', icon: ShieldCheck },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
  ];

  return (
    <aside className="w-72 h-screen border-r border-aura-border flex flex-col p-6 bg-aura-black/50 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aura-gold to-yellow-600 flex items-center justify-center shadow-lg shadow-aura-gold/20">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AURA</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-aura-gold/80 font-semibold">Intelligence Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
              activeTab === item.id 
                ? "bg-white/5 text-white shadow-sm border border-white/10" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                activeTab === item.id ? "text-aura-gold" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.tier && (
                <span className="px-1.5 py-0.5 bg-aura-gold/20 text-aura-gold text-[8px] font-bold uppercase tracking-tighter rounded border border-aura-gold/30">
                  {item.tier}
                </span>
              )}
              {item.badge && (
                <span className={cn(
                  "px-1.5 py-0.5 text-[8px] font-bold uppercase rounded",
                  item.badge === 'New' ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                )}>
                  {item.badge}
                </span>
              )}
              {activeTab === item.id && (
                <ChevronRight className="w-4 h-4 text-aura-gold" />
              )}
            </div>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-aura-border space-y-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
            activeTab === 'settings' 
              ? "bg-white/5 text-white border border-white/10" 
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to terminate the executive session?')) {
              onLogout();
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
