import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Book, Heart } from 'lucide-react';

const STORIES = [
    {
        id: 1,
        title: "Bedtime Stories",
        subtitle: "A collection of calm memories",
        color: "bg-indigo-50 border-indigo-100",
        icon: <Book className="w-6 h-6 text-indigo-500" />,
        illustration: "https://api.dicebear.com/7.x/shapes/svg?seed=bedtime&backgroundColor=c7d2fe"
    },
    {
        id: 2,
        title: "Happy Moments",
        subtitle: "The best times with family",
        color: "bg-yellow-50 border-yellow-100",
        icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
        illustration: "https://api.dicebear.com/7.x/shapes/svg?seed=happy&backgroundColor=fef08a"
    },
    {
        id: 3,
        title: "Emotional Journey",
        subtitle: "Reflections from the past year",
        color: "bg-rose-50 border-rose-100",
        icon: <Heart className="w-6 h-6 text-rose-500" />,
        illustration: "https://api.dicebear.com/7.x/shapes/svg?seed=emo&backgroundColor=fecdd3"
    },
];

export function StoryView() {
    return (
        <div className="h-full p-8 bg-slate-50/50 overflow-y-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Your Stories</h2>
                    <p className="text-muted-foreground mt-1">Generated narratives from your memories</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Generate New Story
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STORIES.map((story, i) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`rounded-3xl border overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all bg-white`}
                    >
                        <div className={`h-40 ${story.color} relative overflow-hidden flex items-center justify-center`}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                            <img src={story.illustration} className="w-full h-full object-cover opacity-80" alt="illustration" />
                            <div className="absolute top-4 left-4 p-3 bg-white/90 rounded-2xl shadow-sm">
                                {story.icon}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-lg text-slate-800 mb-1">{story.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">{story.subtitle}</p>

                            <div className="flex items-center gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors">
                                    <Play className="w-3.5 h-3.5 fill-current" /> Play
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
