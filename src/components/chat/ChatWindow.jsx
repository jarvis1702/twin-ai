import React, { useState } from 'react';
import { chatWithAI } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Smile, Plus } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { MemoryUploadModal } from '../modals/MemoryUploadModal';


function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


export function ChatWindow({ type = 'general', person = null }) {
    const [input, setInput] = useState('');
    const [isVoiceOpen, setIsVoiceOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [activeLang, setActiveLang] = useState('English');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: 'ai', timestamp: getTime() },
    ]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: getTime(),
        };
        setMessages((msgs) => [...msgs, userMsg]);
        setInput('');
        setIsTyping(true);
        try {
            const aiText = await chatWithAI({
                message: userMsg.text,
                type,
                personId: person?.id || null,
            });
            setMessages((msgs) => [
                ...msgs,
                {
                    id: Date.now() + 1,
                    text: aiText,
                    sender: 'ai',
                    timestamp: getTime(),
                },
            ]);
        } catch (e) {
            setMessages((msgs) => [
                ...msgs,
                {
                    id: Date.now() + 2,
                    text: 'Sorry, failed to get a response.',
                    sender: 'ai',
                    timestamp: getTime(),
                },
            ]);
        }
        setIsTyping(false);
    };

    return (
        <div className="flex flex-col h-full bg-white/5 relative">
            <VoiceInput isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
            <MemoryUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

            {/* Chat Header */}
            <div className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-white/30 backdrop-blur-md z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    {type === 'person' && person ? (
                        <>
                            <motion.img
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={person.avatar}
                                className="w-10 h-10 rounded-full bg-slate-100"
                                alt={person.name}
                            />
                            <div>
                                <h2 className="font-semibold text-foreground text-base">{person.name}</h2>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                                🤖
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">AI Companion</h2>
                                <span className="text-xs text-muted-foreground">Always here for you</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Language Toggles for Person Chat */}
                {type === 'person' && (
                    <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl gap-0.5">
                        {['Tamil', 'English', 'Tanglish'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeLang === lang
                                        ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                                        : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                )}
            </div>


            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white/80 dark:bg-black/40 border border-white/20 rounded-bl-none backdrop-blur-sm'
                                }`}>
                                {msg.text}
                                <span className="text-[10px] opacity-0 group-hover:opacity-60 transition-opacity absolute bottom-1 right-2 pt-1  block text-right">
                                    {msg.timestamp}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/50 dark:bg-white/5 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center border border-white/10">
                            {[1, 2, 3].map(dot => (
                                <motion.div
                                    key={dot}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.1 }}
                                    className="w-1.5 h-1.5 bg-primary/40 rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/30 backdrop-blur-md">
                <div className="flex items-center gap-3 bg-white/60 dark:bg-black/10 p-2 rounded-2xl border border-white/20 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all transform focus-within:scale-[1.01]">
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="p-2 text-muted-foreground hover:bg-black/5 rounded-full transition-colors hover:scale-110 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setIsVoiceOpen(true)}
                        className="p-2 text-muted-foreground hover:bg-black/5 rounded-full transition-colors hover:scale-110 active:scale-95"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Message ${person ? person.name : 'AI'}...`}
                        className="flex-1 bg-transparent border-none outline-none text-sm px-2 placeholder:text-muted-foreground/50"
                        onKeyDown={e => {
                          if (e.key === 'Enter') sendMessage();
                        }}
                        disabled={isTyping}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition-colors"
                        onClick={sendMessage}
                        disabled={isTyping}
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
