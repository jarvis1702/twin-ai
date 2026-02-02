import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    MessageSquare,
    Clock,
    BookOpen,
    Settings,
    Moon,
    Sun,
    Trash2,
    Pencil,
    Check,
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
    { id: 'chat', label: 'General Chat', icon: MessageSquare },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, selectedPerson, setSelectedPerson, persons, onAddPerson, onDeletePerson, onUpdatePerson }) {
    const { theme, toggleTheme } = useTheme();
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    const startEditing = (person, e) => {
        e.stopPropagation();
        setEditingId(person.id);
        setEditName(person.name);
    };

    const saveEditing = (e) => {
        e.stopPropagation();
        if (editingId && editName.trim()) {
            onUpdatePerson(editingId, editName);
        }
        setEditingId(null);
    };

    const cancelEditing = (e) => {
        e.stopPropagation();
        setEditingId(null);
    };

    return (
        <aside className="h-full w-80 hidden md:flex flex-col border-r border-white/20 bg-white/40 dark:bg-black/20 backdrop-blur-xl z-20 transition-all duration-300">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                        M
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Memory Vault</span>
                </div>

                <button
                    onClick={onAddPerson}
                    className="w-full py-3 px-4 rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-white/20 transition-all shadow-sm group flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Add Person</span>
                </button>
            </div>

            {/* People List */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide">
                <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider opacity-60">People</h3>
                <AnimatePresence>
                    {persons.map((person) => (
                        <motion.div
                            key={person.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="relative group"
                        >
                            <div
                                onClick={() => {
                                    if (editingId !== person.id) {
                                        setSelectedPerson(person.id);
                                        setActiveTab('person-chat');
                                    }
                                }}
                                className={cn(
                                    "w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left relative cursor-pointer",
                                    selectedPerson === person.id
                                        ? "bg-white/80 dark:bg-white/10 shadow-md ring-1 ring-white/20"
                                        : "hover:bg-white/40 dark:hover:bg-white/5"
                                )}
                            >
                                <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full bg-slate-100" />
                                <div className="flex-1 min-w-0">
                                    {editingId === person.id ? (
                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full bg-white/50 dark:bg-black/20 border border-primary/30 rounded px-1 py-0.5 text-sm outline-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEditing(e);
                                                    if (e.key === 'Escape') cancelEditing(e);
                                                }}
                                            />
                                            <button onClick={saveEditing} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check className="w-3 h-3" /></button>
                                            <button onClick={cancelEditing} className="p-1 text-red-600 hover:bg-red-100 rounded"><X className="w-3 h-3" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-sm truncate">{person.name}</span>
                                                <span className="text-[10px] text-muted-foreground opacity-70">{person.lastSeen}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                                    {person.relationship}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Hover Actions */}
                            {editingId !== person.id && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/80 dark:bg-black/50 rounded-full p-1 shadow-sm backdrop-blur-sm">
                                    <button
                                        onClick={(e) => startEditing(person, e)}
                                        className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-primary transition-colors"
                                        title="Edit Person"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => onDeletePerson(person.id, e)}
                                        className="p-1.5 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                                        title="Delete Person"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="p-4 mt-auto border-t border-white/10 bg-white/10 dark:bg-black/10 backdrop-blur-md">
                <div className="space-y-1 mb-4">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setSelectedPerson(null);
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-sm font-medium",
                                activeTab === item.id && !selectedPerson
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", activeTab === item.id && !selectedPerson ? "text-primary" : "opacity-70")} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-sm font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 opacity-70" /> : <Moon className="w-5 h-5 opacity-70" />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </aside>
    );
}
