import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  BrainCircuit, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateIntelligence } from '../services/gemini';

export function AuraVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate voice interaction
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      handleVoiceCommand("Analyze our current market position relative to competitors.");
    } else {
      setIsListening(true);
      setTranscript('Listening...');
    }
  };

  const handleVoiceCommand = async (command: string) => {
    setTranscript(command);
    setIsProcessing(true);
    
    try {
      const aiResponse = await generateIntelligence(command, "Voice Interaction Mode");
      setResponse(aiResponse);
      setIsSpeaking(true);
      // Simulate speech synthesis duration
      setTimeout(() => setIsSpeaking(false), 5000);
    } catch (error: any) {
      console.error("Aura Voice Error:", error);
      setResponse(`Communication Failure: ${error.message}. ${error.isApiKeyError ? 'Please verify your API key configuration.' : ''}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold gold-gradient-text">Aura Voice</h2>
        <p className="text-zinc-500">Multimodal Executive Assistant • Real-time Strategic Consultation</p>
      </div>

      {/* Visualizer */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-aura-gold/20 transition-all duration-1000",
          isListening && "scale-150 opacity-0",
          isSpeaking && "animate-ping"
        )} />
        <div className={cn(
          "absolute inset-4 rounded-full border-2 border-aura-gold/40 transition-all duration-700",
          isListening && "scale-125 opacity-0"
        )} />
        
        <button 
          onClick={toggleListening}
          className={cn(
            "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
            isListening ? "bg-red-500 shadow-red-500/40" : "bg-aura-gold shadow-aura-gold/40 hover:scale-105"
          )}
        >
          {isListening ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-black" />
          )}
        </button>

        {/* Waveform simulation */}
        {(isListening || isSpeaking) && (
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1 h-8">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [8, Math.random() * 32 + 8, 8],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.5 + Math.random() * 0.5,
                  ease: "easeInOut"
                }}
                className="w-1 bg-aura-gold rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Interaction Status */}
      <div className="max-w-2xl w-full glass-panel p-8 min-h-[200px] flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-8 h-8 text-aura-gold animate-spin" />
              <p className="text-aura-gold font-bold uppercase tracking-widest text-xs">Neural Processing</p>
            </motion.div>
          ) : response ? (
            <motion.div 
              key="response"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-zinc-500 italic text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                <span>"{transcript}"</span>
              </div>
              <p className="text-lg text-zinc-200 leading-relaxed">
                {response}
              </p>
              {isSpeaking && (
                <div className="flex items-center justify-center gap-2 text-aura-gold text-xs font-bold uppercase tracking-widest mt-6">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  Synthesizing Audio
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-600"
            >
              <p>Tap the microphone to begin strategic consultation.</p>
              <p className="text-xs mt-2 uppercase tracking-widest">Aura is ready to listen</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
