import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Tag, Heart, MessageCircle } from 'lucide-react';

export function AddPersonModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        relationship: '',
        tone: 'Casual',
        keywords: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        onAdd({
            ...formData,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
        });
        setFormData({ name: '', relationship: '', tone: 'Casual', keywords: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <UserPlus className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Add Connection</h2>
                                <p className="text-xs text-muted-foreground">Create a new digital twin</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">

                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Sarah"
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-primary/50 outline-none transition-all"
                            />
                        </div>

                        {/* Relationship & Tone Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                                    <Heart className="w-3 h-3" /> Relationship
                                </label>
                                <input
                                    type="text"
                                    value={formData.relationship}
                                    onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                                    placeholder="e.g. Sister"
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-primary/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                                    <MessageCircle className="w-3 h-3" /> Tone
                                </label>
                                <select
                                    value={formData.tone}
                                    onChange={e => setFormData({ ...formData, tone: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option>Casual</option>
                                    <option>Professional</option>
                                    <option>Affectionate</option>
                                    <option>Humorous</option>
                                    <option>Stern</option>
                                </select>
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                                <Tag className="w-3 h-3" /> Keywords
                            </label>
                            <textarea
                                value={formData.keywords}
                                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                placeholder="Tags separated by commas (e.g. memories, coffee, travel)..."
                                rows={2}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-primary/50 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl font-medium text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 rounded-xl font-medium bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Create Person
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
