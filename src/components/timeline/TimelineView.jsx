import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter } from 'lucide-react';

const MEMORIES = [
    { id: 1, date: '2023-10-15', title: 'Diwali Celebration', description: 'Celebrated Diwali with family. The lights and rangoli were beautiful.', emotion: 'happy', person: 'Family' },
    { id: 2, date: '2023-11-02', title: 'Late Night Talk', description: 'Had a long conversation about career and dreams.', emotion: 'calm', person: 'Arjun' },
    { id: 3, date: '2023-12-10', title: 'Missing Home', description: 'Felt a bit lonely today, missed Amma’s cooking.', emotion: 'sad', person: 'Amma' },
];

const EMOTIONS = {
    happy: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    sad: 'bg-blue-100 text-blue-700 border-blue-200',
    calm: 'bg-green-100 text-green-700 border-green-200',
    emotional: 'bg-rose-100 text-rose-700 border-rose-200',
};

export function TimelineView() {
    const [filter, setFilter] = useState('all');

    return (
        <div className="h-full flex flex-col bg-slate-50/50 relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-md flex justify-between items-center z-10 sticky top-0">
                <div>
                    <h2 className="text-xl font-semibold">Memory Timeline</h2>
                    <p className="text-sm text-muted-foreground">A journey through your moments</p>
                </div>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                </button>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200" />

                <div className="space-y-8 pl-8">
                    {MEMORIES.map((memory, index) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Dot on line */}
                            <div className="absolute -left-[37px] top-6 w-4 h-4 rounded-full border-4 border-white bg-primary shadow-sm" />

                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${EMOTIONS[memory.emotion] || 'bg-slate-100 text-slate-500'}`}>
                                        {memory.emotion}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {memory.date}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-lg text-slate-800 mb-1">{memory.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-3">{memory.description}</p>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                                        With: {memory.person}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
