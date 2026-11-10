import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Trash2, 
  Code2, 
  Settings, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Terminal, 
  BarChart3,
  Layers,
  Key,
  ExternalLink,
  ShieldCheck,
  Check,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  getBusinessDocuments, uploadDocument, deleteDocument, updateBusiness 
} from '../services/api';
import OwnerPlayground from './OwnerPlayground';
import WidgetStudio from './WidgetStudio';
import QuestionInsights from './QuestionInsights';
import { ToastAlert, ConfirmModal } from './AlertModal';

/**
 * Enterprise Business Workspace Shell (Dark / Black Theme)
 * Linear / Notion / Stripe style persistent application shell:
 * Compact left sidebar with clear navigation grouping, contextual top header,
 * high-density document management tables, and zero nested container clutter.
 */
export default function BusinessWorkspace({ business, onBack, onUpdateBusiness, onOpenPublicWidget }) {
  const [activeTab, setActiveTab] = useState('owner-playground'); // 'owner-playground' | 'widget-studio' | 'documents' | 'insights' | 'settings'
  
  // Documents state
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [docSearch, setDocSearch] = useState('');

  // Settings state
  const [editForm, setEditForm] = useState({
    businessName: business.business_name || '',
    description: business.description || '',
    websiteUrl: business.website_url || '',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [toast, setToast] = useState(null); // { type, title, message }
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Fetch Documents
  const fetchDocs = async () => {
    setLoadingDocs(true);
    try {
      const data = await getBusinessDocuments(business.uid);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Fetch documents warning:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [business.uid]);

  // Handle PDF Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (documents.length >= 1) {
      const limitMsg = 'Document capacity limit reached: Only 1 corporate document can be active in your knowledge base. Please delete the existing document to upload a new one.';
      setUploadError(limitMsg);
      setToast({
        type: 'warning',
        title: 'Upload Limit Reached (1/1)',
        message: limitMsg,
      });
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF documents (up to 10 pages) are currently supported.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      await uploadDocument(business.uid, selectedFile);
      setSelectedFile(null);
      const fileInput = document.getElementById('pdf-upload-input');
      if (fileInput) fileInput.value = '';
      await fetchDocs();
      setToast({
        type: 'success',
        title: 'Document Uploaded',
        message: `"${selectedFile.name}" has been successfully ingested and indexed into the vector store.`,
      });
    } catch (err) {
      setUploadError(err.message || 'Failed to upload and index document.');
      setToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Failed to upload and index document.',
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle Document Delete with Custom Confirm Modal
  const handleDeleteDoc = (docId, filename) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Document',
      message: `Are you sure you want to delete "${filename}"? This will permanently remove its chunks and citations from the knowledge base.`,
      confirmText: 'Delete Document',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteDocument(docId);
          await fetchDocs();
          setToast({
            type: 'success',
            title: 'Document Deleted',
            message: `"${filename}" was successfully removed from the knowledge base.`,
          });
        } catch (err) {
          setToast({
            type: 'error',
            title: 'Delete Failed',
            message: err.message || 'Failed to delete document.',
          });
        }
      },
    });
  };

  // Handle Settings Update with Toast Alert
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const updated = await updateBusiness(business.uid, {
        businessName: editForm.businessName,
        description: editForm.description,
        websiteUrl: editForm.websiteUrl,
      });
      setSettingsSuccess(true);
      if (onUpdateBusiness) onUpdateBusiness(updated);
      setToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Workspace branding and parameters have been updated.',
      });
      setTimeout(() => setSettingsSuccess(false), 2500);
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update workspace settings.',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const copyPublicKey = () => {
    navigator.clipboard.writeText(business.public_key);
    setCopiedKey(true);
    setToast({
      type: 'info',
      title: 'Public Key Copied',
      message: `Widget key ${business.public_key.slice(0, 10)}... copied to clipboard.`,
    });
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredDocs = documents.filter((d) => {
    if (!docSearch.trim()) return true;
    return (d.original_filename || '').toLowerCase().includes(docSearch.toLowerCase());
  });

  const getTabTitle = () => {
    switch (activeTab) {
      case 'owner-playground': return 'Document Intelligence Console';
      case 'widget-studio': return 'Website Widget Studio';
      case 'documents': return 'Knowledge Base & Ingestion';
      case 'insights': return 'Customer Question Insights';
      case 'settings': return 'Workspace Settings';
      default: return 'Workspace';
    }
  };

  return (
    <div className="flex h-screen bg-black text-[#EDEDED] font-sans overflow-hidden">
      
      {/* ================= PERSISTENT LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-[#09090B] border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none">
        
        <div>
          {/* Workspace Switcher / Brand Header */}
          <div className="p-3.5 border-b border-white/[0.08]">
            <button
              onClick={onBack}
              className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-500 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>All Workspaces</span>
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 rounded-md bg-[#F97316] text-black flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_2px_10px_rgba(249,115,22,0.35)]">
                  <Layers className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="truncate">
                  <h2 className="text-xs font-semibold text-white truncate tracking-tight">
                    {business.business_name}
                  </h2>
                  <div
                    onClick={copyPublicKey}
                    className="flex items-center space-x-1 text-[10px] font-mono text-zinc-400 hover:text-white cursor-pointer"
                    title="Click to copy public widget key"
                  >
                    <span>Key: {business.public_key.slice(0, 8)}...</span>
                    {copiedKey ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="p-3 space-y-5">
            
            {/* Group 1: Intelligence Core */}
            <div>
              <p className="px-2 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Intelligence
              </p>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('owner-playground')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'owner-playground'
                      ? 'bg-[#F97316]/15 text-[#F97316] font-semibold border-l-2 border-[#F97316] shadow-subtle'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Terminal className={`w-3.5 h-3.5 ${activeTab === 'owner-playground' ? 'text-[#F97316]' : 'text-zinc-300'}`} />
                    <span>Playground & Reports</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'documents'
                      ? 'bg-[#F97316]/15 text-[#F97316] font-semibold border-l-2 border-[#F97316] shadow-subtle'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className={`w-3.5 h-3.5 ${activeTab === 'documents' ? 'text-[#F97316]' : 'text-zinc-300'}`} />
                    <span>Knowledge Base</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                    activeTab === 'documents' ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-white/[0.08] text-zinc-300'
                  }`}>
                    {documents.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('insights')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'insights'
                      ? 'bg-[#F97316]/15 text-[#F97316] font-semibold border-l-2 border-[#F97316] shadow-subtle'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'insights' ? 'text-[#F97316]' : 'text-zinc-300'}`} />
                    <span>Question Insights</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Group 2: Integration & Embed */}
            <div>
              <p className="px-2 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Deployment
              </p>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('widget-studio')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'widget-studio'
                      ? 'bg-[#F97316]/15 text-[#F97316] font-semibold border-l-2 border-[#F97316] shadow-subtle'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Code2 className={`w-3.5 h-3.5 ${activeTab === 'widget-studio' ? 'text-[#F97316]' : 'text-zinc-300'}`} />
                    <span>Widget Studio</span>
                  </div>
                </button>

                <button
                  onClick={() => onOpenPublicWidget && onOpenPublicWidget(business.public_key)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:bg-white/[0.05] hover:text-white transition-colors"
                  title="Test standalone public floating widget"
                >
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Test Live Widget</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Group 3: Configuration */}
            <div>
              <p className="px-2 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Administration
              </p>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-[#F97316]/15 text-[#F97316] font-semibold border-l-2 border-[#F97316] shadow-subtle'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <Settings className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-[#F97316]' : 'text-zinc-300'}`} />
                  <span>Workspace Settings</span>
                </button>
              </nav>
            </div>

          </div>
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-3 border-t border-white/[0.08] bg-[#0A0A0C] text-[11px] font-mono">
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Knowledge Base Active</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Verified Document Intelligence
          </p>
        </div>

      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black">
        
        {/* Top Contextual Header */}
        <header className="h-14 border-b border-white/[0.08] px-6 flex items-center justify-between shrink-0 bg-[#0A0A0C]">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-zinc-500">{business.business_name}</span>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-white font-sans">{getTabTitle()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              {documents.length} Grounded {documents.length === 1 ? 'Doc' : 'Docs'}
            </span>
          </div>
        </header>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-black">
          
          {/* TAB 1: OWNER TESTING PLAYGROUND & EXECUTIVE REPORT GENERATOR */}
          {activeTab === 'owner-playground' && (
            <OwnerPlayground business={business} documents={documents} />
          )}

          {/* TAB 2: WIDGET STUDIO */}
          {activeTab === 'widget-studio' && (
            <WidgetStudio business={business} />
          )}

          {/* TAB 3: KNOWLEDGE BASE / DOCUMENTS MANAGEMENT */}
          {activeTab === 'documents' && (
            <div className="space-y-5 max-w-6xl">
              
              {/* Ingestion Toolbar / Card */}
              <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-5 shadow-subtle space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-zinc-300" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-white">
                      Ingest PDF Knowledge
                    </h3>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                    documents.length >= 1 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  }`}>
                    Capacity: {documents.length}/1 Document
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Upload corporate documentation (PDF format, up to 10 pages) to index verified content for intelligent search and analysis. Each knowledge base workspace allows <strong>1 active document</strong>.
                </p>

                {uploadError && (
                  <div className="p-3 rounded-md bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs font-mono flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {documents.length >= 1 ? (
                  <div className="p-4 rounded-md bg-[#16130D] border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-3.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white">Active Document Limit Reached (1/1)</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          SLOT FULL
                        </span>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        You have reached the maximum allowance of 1 document for this workspace. To upload or index a new document, delete the existing document from the table below first.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <input
                      id="pdf-upload-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      required
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full text-xs text-zinc-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-white/[0.12] file:text-xs file:font-medium file:bg-white/[0.06] file:text-white hover:file:bg-white/[0.12] file:cursor-pointer border border-white/[0.1] rounded-md p-1.5 bg-[#141416] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-md bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-black text-xs font-bold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)] cursor-pointer"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Indexing Document...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload & Index</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Indexed Documents Table */}
              <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg shadow-subtle overflow-hidden">
                
                {/* Table Header Controls */}
                <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111114]">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                      Indexed Knowledge Files ({documents.length})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filter documents..."
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className="bg-[#141416] border border-white/[0.1] rounded-md pl-7 pr-3 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 w-44 sm:w-56"
                      />
                    </div>
                    <button
                      onClick={fetchDocs}
                      className="p-1 rounded-md border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 transition-colors"
                      title="Refresh Document List"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingDocs ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {loadingDocs ? (
                  <div className="py-12 text-center text-xs font-mono text-zinc-500 space-y-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-white mx-auto" />
                    <p>Loading documents...</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs space-y-1.5">
                    <FileText className="w-6 h-6 text-zinc-600 mx-auto" />
                    <p className="font-medium text-zinc-300">No documents indexed yet.</p>
                    <p className="text-[11px] text-zinc-500">Upload a PDF above to ground chatbot responses in verified facts.</p>
                  </div>
                ) : filteredDocs.length === 0 ? (
                  <div className="py-8 text-center text-zinc-400 text-xs">
                    No documents match "{docSearch}".
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-white/[0.08] text-left text-xs">
                    <thead className="bg-[#121214] text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Document Name</th>
                        <th className="px-4 py-2.5 font-semibold">Type</th>
                        <th className="px-4 py-2.5 font-semibold">Uploaded</th>
                        <th className="px-4 py-2.5 font-semibold">Embedding Status</th>
                        <th className="px-4 py-2.5 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] bg-[#0A0A0C]">
                      {filteredDocs.map((doc) => (
                        <tr key={doc.uid} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2.5">
                              <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                              <span className="font-medium text-white truncate max-w-sm">
                                {doc.original_filename}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-mono text-zinc-400 text-[11px]">
                            {doc.file_type || 'PDF'}
                          </td>

                          <td className="px-4 py-3 font-mono text-zinc-400 text-[11px]">
                            {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recent'}
                          </td>

                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase ${
                              doc.embedding_status === 'completed'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                                : doc.embedding_status === 'processing'
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40 animate-pulse'
                                : doc.embedding_status === 'failed'
                                ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                                : 'bg-white/[0.06] text-zinc-300 border border-white/[0.1]'
                            }`}>
                              {doc.embedding_status || 'indexed'}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteDoc(doc.uid, doc.original_filename)}
                              className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>

            </div>
          )}

          {/* TAB 4: CUSTOMER QUESTION INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="max-w-6xl">
              <QuestionInsights business={business} />
            </div>
          )}

          {/* TAB 5: WORKSPACE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-6 shadow-subtle max-w-xl space-y-4">
              <div className="pb-3 border-b border-white/[0.08]">
                <h3 className="text-sm font-semibold text-white">Workspace Configuration</h3>
                <p className="text-xs text-zinc-400">Update company metadata and public domain</p>
              </div>

              {settingsSuccess && (
                <div className="p-3 rounded-md bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs font-mono flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Workspace settings updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Workspace / Chatbot Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.businessName}
                    onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-[#141416] border border-white/[0.1] rounded-md p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={editForm.websiteUrl}
                    onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                    className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-4 py-1.5 rounded-md bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-black text-xs font-bold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
                  >
                    {savingSettings ? 'Saving Changes...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>

      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <ToastAlert
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
