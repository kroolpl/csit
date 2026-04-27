import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import BusinessStatus from './BusinessStatus';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const serviceItems = [
  { label: 'Serwis Elektroniki', href: '/serwis-elektroniki', desc: 'Smartfony, laptopy, konsole' },
  { label: 'Odzyskiwanie Danych', href: '/odzyskiwanie-danych', desc: 'HDD, SSD, pendrive, karty' },
  { label: 'Monitoring & Alarmy', href: '/monitoring-alarmy', desc: 'CCTV, alarmy, kontrola dostępu' },
  { label: 'Automatyka & Smart Home', href: '/automatyka-smart-home', desc: 'Bramy, inteligentny dom' },
  { label: 'Cyberbezpieczeństwo', href: '/cyberbezpieczenstwo', desc: 'Firewall, ochrona sieci' },
  { label: 'Usługi IT & Technologia', href: '/uslugi-it-technologia', desc: 'WWW, druk 3D, chmura' },
];

interface MobileMenuProps {
  currentPath?: string;
}

export default function MobileMenu({ currentPath = '/' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isServicePage = serviceItems.some(item => currentPath.startsWith(item.href));
  const [servicesOpen, setServicesOpen] = useState(true); // Always open — reduces taps needed
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);

  // Scroll lock that preserves position
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      // Move focus inside the dialog
      setTimeout(() => closeButtonRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const topLinks = [
    { label: 'Strona Główna', href: '/' },
    { label: 'O nas', href: '/o-nas' },
    { label: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-11 h-11 flex items-center justify-center text-brand-secondary hover:text-brand-primary transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none rounded-sm touch-manipulation"
        aria-label="Otwórz menu"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Menu size={26} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={close}
              className="fixed inset-0 bg-brand-secondary/50 backdrop-blur-[2px] z-[1000]"
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu nawigacji"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320, mass: 0.8 }}
              className="fixed inset-y-0 right-0 h-[100dvh] w-[88%] max-w-[380px] bg-white z-[1001] flex flex-col"
              style={{ boxShadow: '-16px 0 48px rgba(0,26,77,0.14)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-[60px] border-b border-slate-100 flex-shrink-0">
                <a
                  href="/"
                  onClick={close}
                  className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none rounded-sm"
                >
                  <span className="font-mono font-bold text-brand-secondary tracking-tighter text-base">[CSIT]</span>
                  <span className="w-1.5 h-3 bg-brand-primary animate-pulse" />
                </a>
                <button
                  ref={closeButtonRef}
                  onClick={close}
                  className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-brand-primary hover:bg-slate-50 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none touch-manipulation"
                  aria-label="Zamknij menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable nav area */}
              <nav
                className="flex-1 overflow-y-auto overscroll-contain"
                aria-label="Główna nawigacja"
              >
                <div className="px-5">

                  {/* Strona Główna + O nas */}
                  {topLinks.slice(0, 2).map(item => {
                    const isActive = currentPath === item.href;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className={cn(
                          'flex items-center justify-between min-h-[52px] border-b border-slate-100 group touch-manipulation',
                        )}
                      >
                        <span className={cn(
                          'font-display font-bold text-[15px] transition-colors',
                          isActive ? 'text-brand-primary' : 'text-brand-secondary group-hover:text-brand-primary'
                        )}>
                          {item.label}
                        </span>
                        {isActive
                          ? <span className="w-2 h-2 rounded-full bg-brand-primary" />
                          : <ArrowRight size={15} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                        }
                      </a>
                    );
                  })}

                  {/* Usługi — collapsible, starts open */}
                  <div className="border-b border-slate-100">
                    <button
                      onClick={() => setServicesOpen(prev => !prev)}
                      className="w-full flex items-center justify-between min-h-[52px] touch-manipulation focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                      aria-expanded={servicesOpen}
                      aria-controls="mobile-services-list"
                    >
                      <span className={cn(
                        'font-display font-bold text-[15px]',
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
                          className={cn(isServicePage ? 'text-brand-primary' : 'text-slate-400')}
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
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden pb-2"
                        >
                          {serviceItems.map((item, i) => {
                            const isActive = currentPath.startsWith(item.href);
                            return (
                              <motion.li
                                key={item.href}
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.15 }}
                              >
                                <a
                                  href={item.href}
                                  onClick={close}
                                  className={cn(
                                    'flex items-center gap-3 min-h-[52px] pl-3 pr-2 mb-0.5 border-l-2 rounded-r-sm transition-all touch-manipulation',
                                    isActive
                                      ? 'border-brand-primary bg-brand-primary/5'
                                      : 'border-slate-100 hover:border-brand-primary/40 hover:bg-slate-50'
                                  )}
                                >
                                  <div className="flex-1 min-w-0 py-1">
                                    <p className={cn(
                                      'text-sm font-semibold leading-tight',
                                      isActive ? 'text-brand-primary' : 'text-brand-secondary'
                                    )}>
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                                  </div>
                                  {isActive && (
                                    <ArrowRight size={14} className="text-brand-primary flex-shrink-0" />
                                  )}
                                </a>
                              </motion.li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Kontakt */}
                  {(() => {
                    const isActive = currentPath === '/kontakt';
                    return (
                      <a
                        href="/kontakt"
                        onClick={close}
                        className="flex items-center justify-between min-h-[52px] border-b border-slate-100 group touch-manipulation"
                      >
                        <span className={cn(
                          'font-display font-bold text-[15px] transition-colors',
                          isActive ? 'text-brand-primary' : 'text-brand-secondary group-hover:text-brand-primary'
                        )}>
                          Kontakt
                        </span>
                        {isActive
                          ? <span className="w-2 h-2 rounded-full bg-brand-primary" />
                          : <ArrowRight size={15} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                        }
                      </a>
                    );
                  })()}

                </div>
              </nav>

              {/* Sticky bottom CTA */}
              <div className="px-5 pt-4 pb-6 border-t border-slate-100 flex-shrink-0 bg-white">
                <a
                  href="tel:504365205"
                  className="flex items-center justify-center gap-3 w-full bg-brand-primary text-white min-h-[52px] rounded-sm font-display font-bold text-base shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary active:scale-[0.98] transition-all touch-manipulation"
                >
                  <Phone size={18} fill="currentColor" />
                  Zadzwoń: 504 365 205
                </a>
                <div className="flex justify-center mt-4">
                  <BusinessStatus />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
