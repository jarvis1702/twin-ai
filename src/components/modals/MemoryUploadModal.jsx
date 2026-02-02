import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, Video, Mic, Smartphone, Check } from 'lucide-react';

const UPLOAD_TYPES = [
    { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, color: 'bg-green-100 text-green-600' },
    { id: 'audio', label: 'Audio', icon: Mic, color: 'bg-rose-100 text-rose-600' },
    { id: 'image', label: 'Images', icon: Image, color: 'bg-blue-100 text-blue-600' },
    { id: 'video', label: 'Videos', icon: Video, color: 'bg-purple-100 text-purple-600' },
    { id: 'text', label: 'Text', icon: FileText, color: 'bg-slate-100 text-slate-600' },
];


export function MemoryUploadModal({ isOpen, onClose }) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const startUpload = () => {
        if (selectedFiles.length === 0) return;
        setUploading(true);
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setUploading(false);
                setCompleted(true);
                setTimeout(() => {
                    setCompleted(false);
                    setProgress(0);
                    setSelectedFiles([]);
                    onClose();
                }, 1000);
            }
        }, 100);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Upload Memory</h2>
                                <p className="text-sm text-slate-500">Add digital footprints to the vault</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {!uploading && !completed ? (
                            <>
                                {/* Drag Drop Area */}
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="memory-upload-input"
                                    />
                                    <label htmlFor="memory-upload-input" className="w-full flex flex-col items-center cursor-pointer">
                                        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-primary">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-700">Drag & Drop files here</p>
                                        <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                                    </label>
                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4 w-full">
                                            <p className="text-sm font-semibold text-slate-600 mb-2">Selected Files:</p>
                                            <ul className="text-sm text-slate-500 list-disc list-inside">
                                                {selectedFiles.map((file, idx) => (
                                                    <li key={idx}>{file.name}</li>
                                                ))}
                                            </ul>
                                            <button
                                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-semibold disabled:opacity-50"
                                                onClick={startUpload}
                                                disabled={selectedFiles.length === 0}
                                            >
                                                Upload {selectedFiles.length > 1 ? `${selectedFiles.length} files` : 'file'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* File Types */}
                                <div className="mt-8">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Supported Types</p>
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {UPLOAD_TYPES.map((type) => (
                                            <div key={type.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type.color}`}>
                                                    <type.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-600">{type.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-12 flex flex-col items-center text-center">
                                {completed ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4"
                                    >
                                        <Check className="w-10 h-10" />
                                    </motion.div>
                                ) : (
                                    <div className="w-20 h-20 relative flex items-center justify-center mb-4">
                                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                                        <div
                                            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                                        />
                                        <span className="font-semibold text-primary">{progress}%</span>
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {completed ? 'Upload Complete!' : 'Uploading Memories...'}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {completed ? `Added ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} to timeline` : 'Processing emotional context...'}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
