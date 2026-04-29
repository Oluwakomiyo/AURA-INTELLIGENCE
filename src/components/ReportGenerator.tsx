import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileSearch,
  BrainCircuit,
  Loader2,
  ChevronRight,
  Printer,
  ChevronDown,
  FileSpreadsheet,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateIntelligence } from '../services/gemini';

const reportTypes = [
  { id: 'monthly', label: 'Monthly Performance Review', description: 'Comprehensive analysis of KPIs and growth trends.' },
  { id: 'strategic', label: 'Strategic Initiative Brief', description: 'Deep dive into specific project outcomes and ROI.' },
  { id: 'market', label: 'Market Sentiment Report', description: 'External landscape analysis and competitive positioning.' },
];

const dataSections = [
  { id: 'revenue', label: 'Revenue & Growth Metrics', selected: true },
  { id: 'market', label: 'Market Share & Sentiment', selected: true },
  { id: 'simulations', label: 'What-If Scenario Projections', selected: false },
  { id: 'security', label: 'Security & Compliance Status', selected: false },
];

export function ReportGenerator() {
  const [selectedType, setSelectedType] = useState('monthly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [sections, setSections] = useState(dataSections);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExporting(format);
    setIsExportOpen(false);
    // Simulate export
    setTimeout(() => {
      setExporting(null);
    }, 2500);
  };

  const exportFormats = [
    { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-400' },
    { id: 'excel', label: 'Excel Data', icon: FileSpreadsheet, color: 'text-emerald-400' },
    { id: 'csv', label: 'CSV Spreadsheet', icon: Layout, color: 'text-blue-400' },
  ];

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setReportContent(null);

    const activeSections = sections.filter(s => s.selected).map(s => s.label).join(', ');
    const prompt = `Generate a high-level executive summary for a "${reportTypes.find(t => t.id === selectedType)?.label}". 
    Include analysis for the following sections: ${activeSections}. 
    The tone should be professional, authoritative, and focused on strategic outcomes. 
    Use formal business language and markdown formatting.`;

    const content = await generateIntelligence(prompt);
    setReportContent(content);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">Report Generator</h2>
        <p className="text-zinc-500 mt-1">Automate your board-ready documentation with neural synthesis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-aura-gold" />
              Report Type
            </h3>
            <div className="space-y-3">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all group",
                    selectedType === type.id 
                      ? "bg-aura-gold/10 border-aura-gold/50" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <p className={cn(
                    "font-bold text-sm mb-1",
                    selectedType === type.id ? "text-aura-gold" : "text-white"
                  )}>
                    {type.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-aura-gold" />
              Data Ingestion
            </h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg text-xs transition-all",
                    section.selected ? "bg-white/10 text-white" : "text-zinc-500 hover:bg-white/5"
                  )}
                >
                  <span>{section.label}</span>
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                    section.selected ? "bg-aura-gold border-aura-gold" : "border-white/20"
                  )}>
                    {section.selected && <CheckCircle2 className="w-3 h-3 text-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="w-full py-4 bg-aura-gold text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all shadow-lg shadow-aura-gold/20 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
            Synthesize Report
          </button>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="glass-panel min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-aura-border flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-aura-gold" />
                <h3 className="font-bold">Document Preview</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
                
                <div className="relative">
                  <button 
                    disabled={!reportContent || !!exporting}
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20 transition-all disabled:opacity-30 flex items-center"
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export
                        <ChevronDown className={cn("w-3 h-3 transition-transform", isExportOpen && "rotate-180")} />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {isExportOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95, x: 20 }}
                          className="absolute right-0 top-full mt-2 w-48 dropdown-panel z-50 overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            {exportFormats.map((format) => (
                              <button
                                key={format.id}
                                onClick={() => handleExport(format.id)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                              >
                                <div className="flex items-center gap-3">
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
            </div>

            <div className="flex-1 p-12 overflow-y-auto">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center space-y-6"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-aura-gold/20 border-t-aura-gold animate-spin" />
                      <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-aura-gold" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold gold-gradient-text">Synthesizing Intelligence</p>
                      <p className="text-sm text-zinc-500 mt-1">Aura is aggregating data streams and drafting executive summaries...</p>
                    </div>
                  </motion.div>
                ) : reportContent ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-invert max-w-none"
                  >
                    <div className="mb-12 pb-8 border-b border-aura-border">
                      <h1 className="text-4xl font-bold mb-4">{reportTypes.find(t => t.id === selectedType)?.label}</h1>
                      <div className="flex gap-8 text-xs text-zinc-500 font-mono">
                        <div>
                          <p className="uppercase tracking-widest mb-1">Date</p>
                          <p className="text-white">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-widest mb-1">Classification</p>
                          <p className="text-aura-gold font-bold">EXECUTIVE CONFIDENTIAL</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-widest mb-1">Author</p>
                          <p className="text-white">Aura Intelligence Suite</p>
                        </div>
                      </div>
                    </div>
                    <div className="markdown-body text-zinc-300 leading-relaxed">
                      {reportContent.split('\n').map((line, i) => (
                        <p key={i} className="mb-4">{line}</p>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-zinc-700" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-zinc-400">No Report Generated</h4>
                      <p className="text-sm text-zinc-600 max-w-xs mx-auto">Configure your report parameters and click "Synthesize" to create a board-ready document.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none select-none">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-8 h-8" />
                <span className="text-2xl font-bold tracking-tighter">AURA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="glass-panel p-8">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-aura-gold" />
          Recent Generation History
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Q1 Strategic Outlook', date: '2 hours ago', type: 'Strategic Brief' },
            { name: 'Feb 2024 Performance', date: 'Yesterday', type: 'Monthly Review' },
            { name: 'Market Volatility Analysis', date: '3 days ago', type: 'Market Report' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-aura-gold transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{report.name}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{report.type} • {report.date}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
