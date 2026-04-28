import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CallFAB() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="tel:504365205"
          initial={{ scale: 0, opacity: 0, y: 50, rotate: -20 }}
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
          exit={{ scale: 0, opacity: 0, y: 50, rotate: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="lg:hidden fixed bottom-6 right-6 z-[90] bg-brand-primary text-white p-4 rounded-full shadow-2xl shadow-brand-primary/40 flex items-center justify-center border-2 border-white/20"
          aria-label="Zadzwoń teraz"
        >
          <Phone size={24} fill="currentColor" />
          <span className="sr-only">Zadzwoń: 504 365 205</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
