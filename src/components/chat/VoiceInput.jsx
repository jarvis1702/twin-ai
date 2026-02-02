import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X } from 'lucide-react';

export function VoiceInput({ isOpen, onClose }) {
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsListening(true);
            // Simulate stopping after a few seconds or allow manual stop
        } else {
            setIsListening(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4"
            >
                <div className="relative">
                    {/* Orb Animation */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        {/* Core Orb */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                boxShadow: [
                                    "0 0 20px rgba(129, 140, 248, 0.4)",
                                    "0 0 40px rgba(129, 140, 248, 0.6)",
                                    "0 0 20px rgba(129, 140, 248, 0.4)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg z-10 flex items-center justify-center"
                        >
                            <Mic className="text-white w-6 h-6" />
                        </motion.div>

                        {/* Ripple Effects */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 2],
                                    opacity: [0.5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 rounded-full border border-primary/30 bg-primary/5"
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-3">
                    <span>Listening...</span>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full text-white/80 hover:text-white transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
