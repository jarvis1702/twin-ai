import React from 'react';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

export function AppShell({ children }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
            {/* Background gradients for added depth */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px]" />
            </div>

            <Sidebar />

            <main className="relative z-10 flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 lg:ml-0 transition-all duration-300">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 rounded-3xl glass shadow-sm overflow-hidden border border-white/50 dark:border-white/10 dark:bg-black/20"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
