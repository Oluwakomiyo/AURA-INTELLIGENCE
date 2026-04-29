import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  Activity, 
  Globe,
  FileDown,
  FileSpreadsheet,
  FileText,
  Layout,
  ChevronDown,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const barData = [
  { name: 'North America', value: 45 },
  { name: 'Europe', value: 30 },
  { name: 'Asia', value: 15 },
  { name: 'Others', value: 10 },
];

const stats = [
  { label: 'Total Revenue', value: '$12.4M', change: '+12.5%', icon: DollarSign, trend: 'up' },
  { label: 'Active Users', value: '48.2K', change: '+8.2%', icon: Users, trend: 'up' },
  { label: 'System Health', value: '99.9%', change: 'Stable', icon: Activity, trend: 'neutral' },
  { label: 'Global Reach', value: '142', change: '+12', icon: Globe, trend: 'up' },
];

export function Dashboard() {
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [exporting, setExporting] = React.useState<string | null>(null);

  const handleExport = (format: string) => {
    setExporting(format);
    setIsExportOpen(false);
    // Simulate export
    setTimeout(() => {
      setExporting(null);
    }, 2000);
  };

  const exportFormats = [
    { id: 'pdf', label: 'PDF Report', icon: FileText, color: 'text-red-400' },
    { id: 'excel', label: 'Excel Sheet', icon: FileSpreadsheet, color: 'text-emerald-400' },
    { id: 'csv', label: 'CSV Data', icon: Layout, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">Executive Overview</h2>
          <p className="text-zinc-500 mt-1">Real-time strategic performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 glass-panel text-xs font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              disabled={!!exporting}
              className="px-4 py-2 bg-aura-gold text-black text-xs font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Export Report
                  <ChevronDown className={cn("w-3 h-3 transition-transform", isExportOpen && "rotate-180")} />
                </>
              )}
            </button>

            <AnimatePresence>
              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 dropdown-panel z-50 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      {exportFormats.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => handleExport(format.id)}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <format.icon className={cn("w-4 h-4", format.color)} />
                            <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                              {format.label}
                            </span>
                          </div>
                          <Download className="w-3 h-3 text-zinc-700 group-hover:text-aura-gold transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 group hover:border-aura-gold/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-white/5 text-aura-gold group-hover:bg-aura-gold group-hover:text-black transition-all duration-500">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                stat.trend === 'up' ? "text-emerald-400" : stat.trend === 'down' ? "text-red-400" : "text-zinc-400"
              )}>
                {stat.change}
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-lg">Revenue Growth</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-[gold] focus:outline-none focus:border-aura-gold/50">                           
              <option>Last Month</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-semibold text-lg mb-8">Market Share</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#ffffff50" 
                  fontSize={10} 
                  width={80}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#ffffff20'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {barData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-aura-gold" : "bg-white/20")} />
                  <span className="text-zinc-400">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
