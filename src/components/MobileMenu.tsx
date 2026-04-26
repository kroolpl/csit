import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ArrowRight, ChevronDown, Home } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const serviceItems = [
  { label: 'Serwis Elektroniki', href: '/serwis-elektroniki', desc: 'Naprawa laptopów, smartfonów, sprzętu' },
  { label: 'Odzyskiwanie Danych', href: '/odzyskiwanie-danych', desc: 'HDD, SSD, pendrive, karty pamięci' },
  { label: 'Monitoring & Alarmy', href: '/monitoring-alarmy', desc: 'CCTV, alarmy, kontrola dostępu' },
  { label: 'Automatyka & Smart Home', href: '/automatyka-smart-home', desc: 'Bramy, FIBARO, inteligentny dom' },
  { label: 'Cyberbezpieczeństwo', href: '/cyberbezpieczenstwo', desc: 'Ochrona firm, firewall, backup' },
  { label: 'Usługi IT & Technologia', href: '/uslugi-it-technologia', desc: 'Strony WWW, druk 3D, chmura' },
];

interface MobileMenuProps {
  currentPath?: string;
}

export default function MobileMenu({ currentPath = '/' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isServicePage = serviceItems.some(item => currentPath.startsWith(item.href));
  const [servicesOpen, setServicesOpen] = useState(isServicePage);

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
        className="lg:hidden p-2 text-brand-secondary hover:text-brand-primary transition-colors focus:outline-none relative z-50 cursor-pointer touch-manipulation"
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
              className="fixed inset-y-0 right-0 h-screen h-[100dvh] w-[85%] max-w-[400px] bg-white z-[1001] shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-slate-100"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-secondary tracking-tighter text-lg">[CSIT]</span>
                  <span className="w-1.5 h-3 bg-brand-primary animate-pulse"></span>
                  <div className="ml-2 border-l border-slate-200 pl-2 flex flex-col">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-brand-primary leading-none">Mobile</span>
                    <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-slate-500 leading-none mt-1">Access</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 hover:text-brand-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-grow overflow-y-auto py-2 px-6 min-h-0">

                {/* Strona Główna */}
                <a
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-4 border-b border-slate-100 group"
                >
                  <div className="flex items-center gap-3">
                    <Home
                      size={15}
                      className={currentPath === '/' ? 'text-brand-primary' : 'text-slate-500 group-hover:text-brand-primary transition-colors'}
                    />
                    <span className={cn(
                      'text-base font-display font-bold transition-colors',
                      currentPath === '/' ? 'text-brand-primary' : 'text-brand-secondary group-hover:text-brand-primary'
                    )}>
                      Strona Główna
                    </span>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </a>

                {/* Usługi — collapsible */}
                <div className="border-b border-slate-100">
                  <button
                    onClick={() => setServicesOpen(prev => !prev)}
                    className="w-full flex items-center justify-between py-4"
                    aria-expanded={servicesOpen}
                    aria-controls="mobile-services-list"
                  >
                    <span className={cn(
                      'text-base font-display font-bold',
                      isServicePage ? 'text-brand-primary' : 'text-brand-secondary'
                    )}>
                      Usługi
                    </span>
                    <motion.div
                      animate={{ rotate: servicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown
                        size={18}
                        className={isServicePage ? 'text-brand-primary' : 'text-slate-500'}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {servicesOpen && (
                      <motion.ul
                        id="mobile-services-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden pb-2"
                      >
                        {serviceItems.map((item, index) => (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <a
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'flex flex-col py-3 pl-4 mb-1 border-l-2 transition-all rounded-r-sm',
                                currentPath.startsWith(item.href)
                                  ? 'border-brand-primary bg-brand-primary/5'
                                  : 'border-slate-100 hover:border-brand-primary hover:bg-slate-50'
                              )}
                            >
                              <span className={cn(
                                'text-sm font-semibold',
                                currentPath.startsWith(item.href) ? 'text-brand-primary' : 'text-brand-secondary'
                              )}>
                                {item.label}
                              </span>
                              <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</span>
                            </a>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* O nas */}
                <a
                  href="/o-nas"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-4 border-b border-slate-100 group"
                >
                  <span className={cn(
                    'text-base font-display font-bold transition-colors',
                    currentPath === '/o-nas' ? 'text-brand-primary' : 'text-brand-secondary group-hover:text-brand-primary'
                  )}>
                    O nas
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </a>

                {/* Kontakt */}
                <a
                  href="/kontakt"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-4 border-b border-slate-100 group"
                >
                  <span className={cn(
                    'text-base font-display font-bold transition-colors',
                    currentPath === '/kontakt' ? 'text-brand-primary' : 'text-brand-secondary group-hover:text-brand-primary'
                  )}>
                    Kontakt
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </a>

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
                <p className="text-center mt-6 font-mono text-[9px] uppercase tracking-widest text-slate-500">
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
