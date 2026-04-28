import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import { MessageSquare, X, Send, Bot, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!mounted) return null;

  const quickActions = [
    { label: 'Serwis telefonów', query: 'Jak wygląda proces serwisu telefonu?' },
    { label: 'Odzyskiwanie danych', query: 'Czy odzyskujecie dane z uszkodzonych dysków?' },
    { label: 'Monitoring CCTV', query: 'Ile kosztuje montaż monitoringu?' },
  ];

  const handleQuickAction = (query: string) => {
    setInput(query);
  };

  const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: finalInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Przepraszam, wystąpił błąd. Proszę o kontakt telefoniczny: 504 365 205.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[60] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, originY: 1, originX: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto mb-4 w-[calc(100vw-32px)] sm:w-[400px] h-[75vh] sm:h-[550px] bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-[0_20px_50px_rgba(0,26,77,0.25)] flex flex-col overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <div className="bg-brand-secondary p-5 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                  <Bot size={22} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base leading-tight">Asystent CSIT</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">System Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-2 rounded-full transition-all hover:rotate-90 relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-6">
                  <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center">
                    <Bot size={32} className="text-brand-primary/40" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-display font-bold text-lg mb-2">Witaj w CSIT!</p>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
                      Jestem Twoim asystentem technicznym. Wybierz temat lub zadaj dowolne pytanie.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleSubmit(undefined, action.query)}
                        className="text-[11px] font-semibold bg-white border border-slate-200 px-3 py-2 rounded-full hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm active:scale-95"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[88%] p-4 text-[13px] leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-brand-primary text-white rounded-[20px_20px_4px_20px] shadow-brand-primary/20' 
                      : 'bg-white border border-slate-200/60 text-slate-700 rounded-[20px_20px_20px_4px]'
                  }`}>
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <div className="prose prose-sm max-w-none prose-slate prose-p:leading-relaxed prose-pre:bg-brand-secondary prose-pre:text-white">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200/60 p-4 rounded-[20px_20px_20px_4px] flex gap-1.5 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Napisz wiadomość..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-brand-primary text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-brand-secondary transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20 active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>

            {/* Emergency Phone */}
            <div className="bg-slate-50/80 px-4 py-2.5 flex items-center justify-center gap-3 border-t border-slate-100">
              <div className="p-1 bg-brand-primary/10 rounded-full">
                <Phone size={12} className="text-brand-primary" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
                PILNA AWARIA? <a href="tel:504365205" className="text-brand-primary hover:underline">504 365 205</a>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isVisible || isOpen) && (
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            initial={{ scale: 0, opacity: 0, y: 50, rotate: -30 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0, 
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }}
            exit={{ scale: 0, opacity: 0, y: 50, rotate: 30 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="pointer-events-auto bg-brand-secondary text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,26,77,0.3)] hover:bg-brand-primary transition-all group relative border-2 border-white/20"
          >
            <div className="absolute inset-0 bg-brand-primary rounded-full animate-ping opacity-20 group-hover:hidden" />
            {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            {!isOpen && (
              <span className="hidden sm:block absolute right-full mr-4 bg-white/90 backdrop-blur-md text-brand-secondary px-4 py-2 text-xs font-bold border border-slate-200/50 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none rounded-xl">
                W czym mogę pomóc? ⚡
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
