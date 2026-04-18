import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Serwis Elektroniki', href: '/serwis-elektroniki' },
  { label: 'Odzyskiwanie Danych', href: '/odzyskiwanie-danych' },
  { label: 'Monitoring & Alarmy', href: '/monitoring-alarmy' },
  { label: 'Automatyka', href: '/automatyka-smart-home' },
  { label: 'Cyberbezpieczeństwo', href: '/cyberbezpieczenstwo' },
  { label: 'Usługi IT', href: '/uslugi-it-technologia' },
  { label: 'O nas', href: '/o-nas' },
  { label: 'Kontakt', href: '/kontakt' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-brand-secondary hover:text-brand-primary transition-colors focus:outline-none"
        aria-label="Open menu"
      >
        <Menu size={28} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-secondary/40 backdrop-blur-sm z-[1000]"
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 h-screen h-[100dvh] w-[85%] max-w-[400px] bg-white opacity-100 z-[1001] shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-slate-100"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-brand-secondary tracking-tighter">CENTRE SERVICE IT</span>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-brand-primary">Mobile Access</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-brand-primary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-grow overflow-y-auto py-8 px-6 min-h-0">
                <ul className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        className="flex items-center justify-between py-4 group border-b border-slate-50"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-lg font-display font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">
                          {item.label}
                        </span>
                        <ArrowRight size={18} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer CTA */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto">
                <a
                  href="tel:504365205"
                  className="flex items-center justify-center gap-3 w-full bg-brand-primary text-white py-5 rounded-sm font-display font-bold text-lg shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                >
                  <Phone size={20} fill="currentColor" />
                  504 365 205
                </a>
                <p className="text-center mt-6 font-mono text-[9px] uppercase tracking-widest text-slate-400">
                  Dostępność: Pn-Pt 9:00 - 18:00
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
