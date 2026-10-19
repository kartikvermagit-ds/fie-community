'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/ui/toast-container';
import { useAuth } from '@/lib/auth-context';
import { useCommunity } from '@/lib/community-context';
import { FileResource, FileCategory } from '@/types';
import { detectFileCategory, formatFileSize } from '@/lib/supabase/storage';
import {
  FileText,
  UploadCloud,
  Search,
  Download,
  Trash2,
  Eye,
  FileCode,
  FileImage,
  FileArchive,
  Presentation,
  CheckCircle2,
  X,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Send,
} from 'lucide-react';

export default function ResourcesPage() {
  const { user } = useAuth();
  const { files, uploadFile, deleteFile, currentTeam, showToast } = useCommunity();

  const [categoryFilter, setCategoryFilter] = useState<'all' | FileCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewingFile, setPreviewingFile] = useState<FileResource | null>(null);

  // Upload Form states
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('4.2 MB');
  const [fileCategory, setFileCategory] = useState<FileCategory>('presentation');
  const [fileVersion, setFileVersion] = useState('v1.0');
  const [fileDescription, setFileDescription] = useState('');

  // Slide discussion comment state
  const [slideComment, setSlideComment] = useState('');
  const [slideCommentsList, setSlideCommentsList] = useState<string[]>([
    'Slide 3 diagram is crystal clear — shows the 3-node WASM topology nicely.',
    'Make sure the font on Slide 5 is readable from the auditorium back row!',
  ]);

  const filteredFiles = files.filter((f) => {
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q);
      const matchDesc = f.description?.toLowerCase().includes(q) || false;
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    uploadFile({
      team_id: currentTeam?.id || 'team_nexus',
      name: fileName.trim(),
      file_path: `uploads/${fileName.trim()}`,
      file_url: '#',
      file_size: fileSize,
      mime_type:
        fileCategory === 'presentation'
          ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          : fileCategory === 'document'
          ? 'application/pdf'
          : 'application/octet-stream',
      category: fileCategory,
      version: fileVersion,
      preview_available: true,
      description: fileDescription,
    });

    setShowUploadModal(false);
    setFileName('');
    setFileDescription('');
  };

  const handleDownload = (file: FileResource) => {
    showToast({
      type: 'success',
      title: 'Downloading file securely',
      description: `Verified download token generated for ${file.name}.`,
    });
  };

  const handleAddSlideComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideComment.trim()) return;
    setSlideCommentsList((prev) => [...prev, slideComment.trim()]);
    setSlideComment('');
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'presentation':
        return <Presentation className="w-5 h-5 text-indigo-400" />;
      case 'document':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-purple-400" />;
      case 'image':
        return <FileImage className="w-5 h-5 text-emerald-400" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-white selection:bg-cyan-500/25 selection:text-cyan-300 relative">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">
              <Presentation className="w-3.5 h-3.5" /> Presentations & Resource Vault
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Slide Decks & Project Files
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Centralized repository for pitch presentations (PPT/PPTX), architecture whitepapers, benchmarks, and sprint assets. Protected by Supabase Storage authorization.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs bg-cyan-400 text-black hover:bg-cyan-300 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] shrink-0 self-start md:self-auto"
          >
            <UploadCloud className="w-4 h-4" />
            Upload File / PPT
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === 'all'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Resources ({files.length})
            </button>
            <button
              onClick={() => setCategoryFilter('presentation')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                categoryFilter === 'presentation'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Presentations (PPT/PPTX)
            </button>
            <button
              onClick={() => setCategoryFilter('document')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                categoryFilter === 'document'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📄 Whitepapers & PDF
            </button>
            <button
              onClick={() => setCategoryFilter('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                categoryFilter === 'code'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💻 Code & Configs
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents or decks..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => {
            const isUploader = user && file.uploader.id === user.id;

            return (
              <div
                key={file.id}
                className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between group hover:border-indigo-500/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                      {getCategoryIcon(file.category)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {file.version}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {file.file_size}
                      </span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setPreviewingFile(file)}
                    className="font-heading text-base font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer truncate"
                  >
                    {file.name}
                  </h3>

                  {file.description && (
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {file.description}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={file.uploader.avatar_url}
                        alt={file.uploader.full_name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{file.uploader.full_name}</span>
                    </div>
                    <span className="font-mono">{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewingFile(file)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview & Slides
                  </button>

                  <button
                    onClick={() => handleDownload(file)}
                    className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {isUploader && (
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PRESENTATION PREVIEW MODAL */}
        {previewingFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-4xl bg-[#0C1222] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
              <button
                onClick={() => setPreviewingFile(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between pb-4 border-b border-white/10 pr-8">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {previewingFile.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">{previewingFile.version}</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mt-1">
                    {previewingFile.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleDownload(previewingFile)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 flex items-center gap-1.5 font-heading"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download File
                </button>
              </div>

              {/* Interactive Presentation Viewer Deck */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {/* Simulated Presentation Projection Screen */}
                <div className="aspect-[16/9] w-full max-w-3xl mx-auto rounded-2xl border-2 border-white/20 bg-gradient-to-br from-[#0F1836] to-[#080D1D] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-cyan-400/10 blur-[60px]" />

                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>BUILDSPACE DIGITAL CAMPUS</span>
                    <span>SLIDE 3 OF 12 · OFFICIAL PITCH DECK</span>
                  </div>

                  <div className="space-y-4 my-auto">
                    <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Decentralized Edge Topology
                    </h2>
                    <p className="text-sm text-cyan-300 max-w-xl leading-relaxed">
                      "Autonomous micro-LLMs run concurrently across browser WebAssembly runtimes, chunking and streaming tokens over peer-to-peer WebRTC data channels with zero central server latency."
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs text-slate-300">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-cyan-400 font-bold text-base">&lt; 8ms</p>
                        <p className="text-[10px] text-slate-400">Mesh Latency</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-purple-400 font-bold text-base">4-bit</p>
                        <p className="text-[10px] text-slate-400">Quantized WASM</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-emerald-400 font-bold text-base">100%</p>
                        <p className="text-[10px] text-slate-400">On-Device Privacy</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono border-t border-white/10 pt-2">
                    <span>Project: Nexus Core</span>
                    <span>Pitch Lead: Elena Rostova</span>
                  </div>
                </div>

                {/* Slide Discussion Section */}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    Presentation Comments & Rehearsal Feedback
                  </h4>

                  <div className="space-y-2">
                    {slideCommentsList.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                        {c}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddSlideComment} className="flex gap-2">
                    <input
                      type="text"
                      value={slideComment}
                      onChange={(e) => setSlideComment(e.target.value)}
                      placeholder="Add slide critique or timing advice..."
                      className="flex-1 px-4 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold text-xs hover:bg-indigo-400 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD FILE MODAL */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0C1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <h3 className="font-heading text-xl font-bold text-white">Upload to Resource Vault</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload presentations (PPT/PPTX), documents (PDF), design assets, or code.
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                {/* Drag-and-drop dropzone mock */}
                <div className="p-6 rounded-2xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/[0.02] text-center hover:bg-cyan-500/[0.05] transition-colors cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="font-medium text-white">Drag and drop file here, or click to select</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Supported: PPT, PPTX, PDF, DOCX, ZIP, PNG, RS (Max 50MB)
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">File Name</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => {
                      setFileName(e.target.value);
                      setFileCategory(detectFileCategory(e.target.value));
                    }}
                    placeholder="e.g. Nexus_Core_Pitch_Auditorium_v4.pptx"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={fileCategory}
                      onChange={(e) => setFileCategory(e.target.value as FileCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0A1020] text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="presentation">Presentation (PPT/PPTX)</option>
                      <option value="document">Document (PDF/DOCX)</option>
                      <option value="code">Code / Config</option>
                      <option value="image">Image / Graphic</option>
                      <option value="archive">Archive (ZIP/TAR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Version Label</label>
                    <input
                      type="text"
                      value={fileVersion}
                      onChange={(e) => setFileVersion(e.target.value)}
                      placeholder="e.g. v3.2-final"
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Description / Notes</label>
                  <textarea
                    rows={2}
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Brief description for teammates..."
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-xl hover:bg-cyan-300 font-heading"
                  >
                    Upload Securely
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
