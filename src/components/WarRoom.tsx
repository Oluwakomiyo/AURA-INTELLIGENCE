import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  MousePointer2, 
  Plus, 
  BrainCircuit,
  Share2,
  Lock,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Cursor {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

interface Note {
  id: string;
  content: string;
  x: number;
  y: number;
  author: string;
}

export function WarRoom() {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [userName] = useState(() => ['Alex', 'Sarah', 'James', 'Elena'][Math.floor(Math.random() * 4)]);
  const [userColor] = useState(() => ['#D4AF37', '#10b981', '#3b82f6', '#f43f5e'][Math.floor(Math.random() * 4)]);
  const socketRef = useRef<WebSocket | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'cursor') {
        setCursors(prev => ({ ...prev, [data.id]: data }));
      } else if (data.type === 'note') {
        setNotes(prev => {
          if (prev.find(n => n.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    };

    return () => socket.close();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !socketRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const cursorData = { type: 'cursor', id: userId, name: userName, color: userColor, x, y };
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(cursorData));
    }
  };

  const addNote = (e: React.MouseEvent) => {
    if (!containerRef.current || !socketRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      content: 'New strategic insight...',
      x,
      y,
      author: userName
    };

    setNotes(prev => [...prev, newNote]);
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'note', ...newNote }));
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">The War Room</h2>
          <p className="text-zinc-500 mt-1">Real-time collaborative strategic workspace.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[...Object.values(cursors), { id: userId, name: userName, color: userColor }].map((user) => (
              <div 
                key={user.id}
                className="w-8 h-8 rounded-full border-2 border-aura-black flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name[0]}
              </div>
            ))}
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Invite Board
          </button>
        </div>
      </header>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onDoubleClick={addNote}
        className="flex-1 glass-panel relative overflow-hidden cursor-crosshair bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]"
      >
        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live Session</span>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-4 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Encrypted
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            Global Sync
          </div>
        </div>

        {/* Notes */}
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute p-4 w-48 glass-panel border-aura-gold/30 bg-aura-gold/5 shadow-xl pointer-events-auto"
            style={{ left: `${note.x}%`, top: `${note.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-3 h-3 text-aura-gold" />
              <span className="text-[10px] font-bold text-aura-gold uppercase">{note.author}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{note.content}</p>
          </motion.div>
        ))}

        {/* Cursors */}
        {Object.values(cursors).map((cursor) => (
          <motion.div
            key={cursor.id}
            className="absolute pointer-events-none z-50"
            animate={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <MousePointer2 
              className="w-4 h-4" 
              style={{ color: cursor.color, fill: cursor.color }} 
            />
            <div 
              className="ml-4 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </motion.div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <Users className="w-64 h-64" />
        </div>
      </div>

      <div className="flex justify-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          Double click anywhere to drop a strategic note
        </p>
      </div>
    </div>
  );
}
