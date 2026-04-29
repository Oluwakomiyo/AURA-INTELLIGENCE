import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

const marketData = [
  { time: '09:00', price: 150.20, sentiment: 0.8 },
  { time: '10:00', price: 152.45, sentiment: 0.85 },
  { time: '11:00', price: 151.10, sentiment: 0.75 },
  { time: '12:00', price: 153.80, sentiment: 0.9 },
  { time: '13:00', price: 155.20, sentiment: 0.95 },
  { time: '14:00', price: 154.50, sentiment: 0.88 },
  { time: '15:00', price: 156.75, sentiment: 0.92 },
];

const sentimentData = [
  { name: 'Positive', value: 65, color: '#10b981' },
  { name: 'Neutral', value: 25, color: '#71717a' },
  { name: 'Negative', value: 10, color: '#ef4444' },
];

export function MarketAnalysis() {
  const [assets, setAssets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchMarketData = async () => {
      const response = await fetch('/api/market/data');
      const data = await response.json();
      setAssets(data.assets);
    };
    fetchMarketData();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">Market Analysis</h2>
        <p className="text-zinc-500 mt-1">Global sentiment and predictive asset tracking.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="font-semibold text-lg mb-8">Asset Price Index</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
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
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#D4AF37', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-semibold text-lg mb-8">Global Sentiment</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-zinc-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-aura-border bg-white/5">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">24h Change</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Volume</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aura-border">
            {assets.map((asset) => (
              <tr key={asset.name} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium">{asset.name}</td>
                <td className="px-6 py-4 font-mono text-sm">{asset.price}</td>
                <td className={cn(
                  "px-6 py-4 text-sm font-medium flex items-center gap-1",
                  asset.change.startsWith('+') ? "text-emerald-400" : "text-red-400"
                )}>
                  {asset.change}
                  {asset.change.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">{asset.volume}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    asset.status === 'Bullish' ? "bg-emerald-500/10 text-emerald-500" : 
                    asset.status === 'Bearish' ? "bg-red-500/10 text-red-500" : "bg-zinc-500/10 text-zinc-500"
                  )}>
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
