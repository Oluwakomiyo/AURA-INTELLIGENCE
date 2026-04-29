import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  BrainCircuit, 
  TrendingUp, 
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateIntelligence } from '../services/gemini';

interface ScenarioState {
  revenueGrowth: number;
  opexReduction: number;
  rdInvestment: number;
  marketVolatility: 'low' | 'medium' | 'high';
}

const initialScenario: ScenarioState = {
  revenueGrowth: 12.5,
  opexReduction: 5,
  rdInvestment: 2.5,
  marketVolatility: 'medium',
};

export function ScenarioSimulator() {
  const [scenario, setScenario] = useState<ScenarioState>(initialScenario);
  const [isSimulating, setIsSimulating] = useState(false);
  const [projectionData, setProjectionData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate data generation
    const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
    const baselineBase = 1000;
    const newData = months.map((month, i) => {
      const baseline = baselineBase * Math.pow(1.05, i);
      const growthFactor = 1 + (scenario.revenueGrowth / 100);
      const efficiencyFactor = 1 + (scenario.opexReduction / 100);
      const simulated = baseline * Math.pow(growthFactor, i) * efficiencyFactor - (scenario.rdInvestment * 50 * (i+1));
      
      return {
        name: month,
        baseline: Math.round(baseline),
        simulated: Math.round(simulated),
      };
    });

    setProjectionData(newData);

    // Get AI Strategic Assessment
    const prompt = `Analyze this business scenario: 
    - Target Revenue Growth: ${scenario.revenueGrowth}%
    - OpEx Reduction: ${scenario.opexReduction}%
    - R&D Investment: $${scenario.rdInvestment}M
    - Market Volatility: ${scenario.marketVolatility}
    
    Provide a concise strategic assessment of the viability and risks of this plan. Focus on EBITDA impact and long-term market position.`;
    
    const insight = await generateIntelligence(prompt);
    setAiInsight(insight);
    setIsSimulating(false);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">What-If Simulator</h2>
          <p className="text-zinc-500 mt-1">Model strategic outcomes and stress-test your business variables.</p>
        </div>
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-6 py-3 bg-aura-gold text-black rounded-xl text-sm font-bold hover:bg-yellow-500 transition-all shadow-lg shadow-aura-gold/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isSimulating ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run Simulation
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6 glass-panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-aura-gold" />
            <h3 className="font-bold">Variables</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <label className="text-zinc-400 font-medium">Revenue Growth</label>
                <span className="text-aura-gold font-bold">{scenario.revenueGrowth}%</span>
              </div>
              <input 
                type="range" min="0" max="50" step="0.5"
                value={scenario.revenueGrowth}
                onChange={(e) => setScenario({...scenario, revenueGrowth: parseFloat(e.target.value)})}
                className="w-full accent-aura-gold"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <label className="text-zinc-400 font-medium">OpEx Reduction</label>
                <span className="text-aura-gold font-bold">{scenario.opexReduction}%</span>
              </div>
              <input 
                type="range" min="0" max="20" step="0.5"
                value={scenario.opexReduction}
                onChange={(e) => setScenario({...scenario, opexReduction: parseFloat(e.target.value)})}
                className="w-full accent-aura-gold"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <label className="text-zinc-400 font-medium">R&D Investment</label>
                <span className="text-aura-gold font-bold">${scenario.rdInvestment}M</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1"
                value={scenario.rdInvestment}
                onChange={(e) => setScenario({...scenario, rdInvestment: parseFloat(e.target.value)})}
                className="w-full accent-aura-gold"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs text-zinc-400 font-medium">Market Volatility</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setScenario({...scenario, marketVolatility: v as any})}
                    className={cn(
                      "py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                      scenario.marketVolatility === v 
                        ? "bg-aura-gold text-black border-aura-gold" 
                        : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setScenario(initialScenario)}
            className="w-full py-3 border border-white/10 rounded-xl text-xs font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        {/* Projection Chart */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-semibold text-lg">Projected EBITDA Impact</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="text-zinc-500">Baseline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-aura-gold" />
                  <span className="text-zinc-500">Simulated</span>
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff30" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#ffffff30" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => `$${v}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="#ffffff20" 
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="5 5"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="simulated" 
                    stroke="#D4AF37" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSimulated)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Strategic Insight */}
          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-aura-gold/10 flex items-center justify-center border border-aura-gold/20">
                <BrainCircuit className="w-5 h-5 text-aura-gold" />
              </div>
              <div>
                <h3 className="font-bold">Aura Strategic Assessment</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Neural Simulation Analysis</p>
              </div>
            </div>

            <div className="relative min-h-[100px]">
              <AnimatePresence mode="wait">
                {isSimulating ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 space-y-4"
                  >
                    <Zap className="w-8 h-8 text-aura-gold animate-pulse" />
                    <p className="text-sm text-zinc-500">Aura is crunching the variables...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-invert max-w-none"
                  >
                    <div className="text-sm leading-relaxed text-zinc-300 bg-white/5 p-4 rounded-xl border border-white/10">
                      {aiInsight || "Adjust variables and run simulation to receive strategic insights."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase text-emerald-400">Opportunity</span>
                </div>
                <p className="text-xs text-zinc-400">High growth potential with optimized OpEx.</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-[10px] font-bold uppercase text-red-400">Risk Factor</span>
                </div>
                <p className="text-xs text-zinc-400">R&D burn may exceed cash reserves in Q3.</p>
              </div>
              <div className="p-4 rounded-xl bg-aura-gold/5 border border-aura-gold/10">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-aura-gold" />
                  <span className="text-[10px] font-bold uppercase text-aura-gold">Aura Score</span>
                </div>
                <p className="text-xs text-zinc-400">Strategic Viability: 84/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
