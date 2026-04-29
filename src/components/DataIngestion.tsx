import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Database, 
  BrainCircuit, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FileUp,
  Search,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface IngestedFile {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  timestamp: string;
}

export function DataIngestion() {
  const [files, setFiles] = useState<IngestedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    const response = await fetch('/api/ingested');
    const data = await response.json();
    setFiles(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        await fetchFiles();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-1 bg-aura-gold/20 text-aura-gold text-[10px] font-bold uppercase tracking-widest rounded-full border border-aura-gold/30">
            Elite Tier Feature
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">External Data Ingestion</h2>
        <p className="text-zinc-500 mt-1">Securely ingest and analyze proprietary datasets with Aura's neural engine.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "glass-panel p-12 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all group",
              isUploading ? "border-aura-gold/50 bg-aura-gold/5" : "border-white/10 hover:border-aura-gold/30 hover:bg-white/5"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
              accept=".csv,.pdf,.xlsx,.json"
            />
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all",
              isUploading ? "bg-aura-gold text-black animate-pulse" : "bg-white/5 text-zinc-500 group-hover:text-aura-gold group-hover:bg-aura-gold/10"
            )}>
              {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <FileUp className="w-8 h-8" />}
            </div>
            <h4 className="font-bold mb-2">Drop strategic datasets here</h4>
            <p className="text-xs text-zinc-500 max-w-[200px]">Supports CSV, PDF, XLSX, and JSON up to 50MB.</p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-aura-gold" />
              Ingestion Pipeline
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Neural Tokenization', status: 'Active' },
                { label: 'Semantic Mapping', status: 'Active' },
                { label: 'EBITDA Correlation', status: 'Active' },
              ].map((step) => (
                <div key={step.label} className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 uppercase font-bold tracking-widest">{step.label}</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-widest">{step.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Inventory */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel overflow-hidden">
            <div className="p-6 border-b border-aura-border flex justify-between items-center bg-white/5">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-aura-gold" />
                Ingested Assets
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search assets..."
                  className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-4 text-[10px] focus:outline-none focus:border-aura-gold/50"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-aura-border">
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Filename</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Size</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aura-border">
                  <AnimatePresence mode="popLayout">
                    {files.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-600 italic text-sm">
                          No external data ingested yet.
                        </td>
                      </tr>
                    ) : (
                      files.map((file) => (
                        <motion.tr 
                          key={file.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-aura-gold transition-colors">
                                <FileText className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium">{file.filename}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase">{file.mimetype.split('/')[1]}</td>
                          <td className="px-6 py-4 text-[10px] font-mono text-zinc-500">{(file.size / 1024).toFixed(1)} KB</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-bold uppercase text-emerald-500 tracking-widest">Indexed</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-aura-gold/10 text-aura-gold text-[10px] font-bold uppercase tracking-widest rounded hover:bg-aura-gold hover:text-black transition-all">
                              <BrainCircuit className="w-3 h-3" />
                              Analyze
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-aura-gold/10 flex items-center justify-center border border-aura-gold/20">
                <Zap className="w-6 h-6 text-aura-gold" />
              </div>
              <div>
                <h3 className="font-bold">Neural Cross-Analysis</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Cross-referencing ingested data with market trends</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Aura's Elite Tier allows you to cross-reference your private financial data with global market sentiment. 
              Upload your Q4 internal reports to see how they correlate with the Aura Core Index.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-aura-gold" />
              </div>
              <span className="text-[10px] font-bold text-aura-gold uppercase tracking-widest">67% Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
