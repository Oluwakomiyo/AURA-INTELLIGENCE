import React from 'react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Shield, 
  Crown,
  ArrowRight,
  History,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const plans = [
  {
    id: 'core',
    name: 'Core Tier',
    price: '$499',
    period: '/mo',
    description: 'Essential intelligence for emerging leaders.',
    features: [
      'Executive Dashboard access',
      'Basic Market Analysis',
      'Standard System Health monitoring',
      'Email support (24h response)'
    ],
    icon: Shield,
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10'
  },
  {
    id: 'intelligence',
    name: 'Intelligence Tier',
    price: '$1,499',
    period: '/mo',
    description: 'Advanced AI-driven strategy for high-stakes decisions.',
    features: [
      'Everything in Core',
      'Full Aura AI Intelligence access',
      'Predictive Market Sentiment',
      'Neural Strategy Engine',
      'Priority support (4h response)'
    ],
    icon: Zap,
    color: 'text-aura-gold',
    bg: 'bg-aura-gold/10',
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite Tier',
    price: '$4,999',
    period: '/mo',
    description: 'The ultimate suite for global enterprise dominance.',
    features: [
      'Everything in Intelligence',
      'Unlimited AI Strategic Queries',
      'Custom Data Connectors (SAP/Oracle)',
      'Quantum-Resistant Encryption',
      'Dedicated Account Strategist'
    ],
    icon: Crown,
    color: 'text-yellow-200',
    bg: 'bg-yellow-200/10'
  }
];

const invoices = [
  { id: 'INV-2024-001', date: 'Mar 01, 2024', amount: '$1,499.00', status: 'Paid' },
  { id: 'INV-2024-002', date: 'Feb 01, 2024', amount: '$1,499.00', status: 'Paid' },
  { id: 'INV-2024-003', date: 'Jan 01, 2024', amount: '$1,499.00', status: 'Paid' },
];

export function Billing() {
  const [activePlanId, setActivePlanId] = React.useState('intelligence');

  React.useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch('/api/billing/status');
      const data = await response.json();
      setActivePlanId(data.activePlan);
    };
    fetchStatus();
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (planId === activePlanId) return;
    const response = await fetch('/api/billing/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId }),
    });
    if (response.ok) {
      setActivePlanId(planId);
    }
  };

  const activePlan = plans.find(p => p.id === activePlanId) || plans[1];

  return (
    <div className="space-y-12 pb-12">
      <header>
        <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">Subscription & Billing</h2>
        <p className="text-zinc-500 mt-1">Manage your executive tier and financial records.</p>
      </header>

      {/* Current Plan Summary */}
      <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 bg-aura-gold/20 text-aura-gold text-[10px] font-bold uppercase tracking-widest rounded-full border border-aura-gold/30">
              Active Plan
            </span>
            <h3 className="text-2xl font-bold">{activePlan.name}</h3>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">Your next billing date is April 01, 2024. You are currently utilizing 82% of your neural processing capacity.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button className="px-6 py-3 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all">
            Cancel Subscription
          </button>
          {activePlanId !== 'elite' && (
            <button 
              onClick={() => handleUpgrade('elite')}
              className="px-6 py-3 bg-aura-gold text-black rounded-xl text-sm font-bold hover:bg-yellow-500 transition-all shadow-lg shadow-aura-gold/20"
            >
              Upgrade to Elite
            </button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-aura-gold/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass-panel p-8 flex flex-col relative",
              plan.id === activePlanId && "border-aura-gold/50 shadow-2xl shadow-aura-gold/5"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-aura-gold text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Strategic
              </div>
            )}
            
            <div className="mb-8">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", plan.bg)}>
                <plan.icon className={cn("w-6 h-6", plan.color)} />
              </div>
              <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
              <p className="text-zinc-500 text-sm h-10">{plan.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-zinc-500 text-sm">{plan.period}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-aura-gold shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.id === activePlanId}
              className={cn(
                "w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group",
                plan.id === activePlanId 
                  ? "bg-white/10 text-white cursor-default" 
                  : "bg-white/5 hover:bg-aura-gold hover:text-black text-zinc-300"
              )}
            >
              {plan.id === activePlanId ? 'Current Plan' : 'Select Plan'}
              {plan.id !== activePlanId && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Payment Methods & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-aura-gold" />
              Payment Methods
            </h3>
            <button className="text-xs text-aura-gold font-bold uppercase tracking-widest hover:underline">
              Add New
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-bold">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-zinc-500">Expires 12/26</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Default</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-aura-gold" />
              Billing History
            </h3>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium">{invoice.id}</p>
                  <p className="text-xs text-zinc-500">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-mono">{invoice.amount}</span>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-aura-gold">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
