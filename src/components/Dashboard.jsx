import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowRight, 
  Trash2, 
  Globe, 
  RefreshCw, 
  Key, 
  AlertCircle, 
  Building2, 
  Check, 
  LayoutDashboard,
  Layers,
  Search,
  FileText,
  ExternalLink,
  Table as TableIcon,
  Grid as GridIcon,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { getAllBusinesses, createBusiness, deleteBusiness } from '../services/api';
import { ToastAlert, ConfirmModal } from './AlertModal';

/**
 * Enterprise Workspaces Dashboard (Dark / Black Theme)
 * Linear / Stripe / Vercel style data management interface:
 * High density, structured data table with inline actions, quick search,
 * clear metadata, and zero visual clutter.
 */
export default function Dashboard({ onSelectBusiness, onLogout }) {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [toast, setToast] = useState(null); // { type, title, message }
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // New business form state
  const [newBiz, setNewBiz] = useState({
    businessName: '',
    description: '',
    websiteUrl: '',
  });

  const fetchBusinesses = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllBusinesses();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Fetch businesses error:', err);
      setError(err.message || 'Failed to load business workspaces. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    if (!newBiz.businessName.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createBusiness({
        businessName: newBiz.businessName.trim(),
        description: newBiz.description.trim() || undefined,
        websiteUrl: newBiz.websiteUrl.trim() || undefined,
      });
      setCreateModalOpen(false);
      setNewBiz({ businessName: '', description: '', websiteUrl: '' });
      await fetchBusinesses();
      setToast({
        type: 'success',
        title: 'Workspace Created',
        message: `Business workspace "${created?.business_name || newBiz.businessName}" created successfully.`,
      });
      if (created && created.uid) {
        onSelectBusiness(created);
      }
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.message || 'Error creating business workspace.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBusiness = (businessId, name, e) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: 'Delete Business Workspace',
      message: `Are you sure you want to permanently delete "${name}"? All associated document indexes, embeddings, and analytics will be removed.`,
      confirmText: 'Delete Workspace',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteBusiness(businessId);
          await fetchBusinesses();
          setToast({
            type: 'success',
            title: 'Workspace Removed',
            message: `Workspace "${name}" was permanently removed.`,
          });
        } catch (err) {
          setToast({
            type: 'error',
            title: 'Delete Failed',
            message: err.message || 'Failed to delete workspace.',
          });
        }
      },
    });
  };

  const handleCopyKey = (key, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setToast({
      type: 'info',
      title: 'Public Key Copied',
      message: `Key ${key.slice(0, 10)}... copied to clipboard.`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredBusinesses = businesses.filter((b) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      (b.business_name || '').toLowerCase().includes(term) ||
      (b.description || '').toLowerCase().includes(term) ||
      (b.public_key || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex-grow flex flex-col bg-black text-[#EDEDED] font-sans">
      
      {/* Top Header Banner */}
      <div className="border-b border-white/[0.08] bg-black px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Workspaces
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.1] font-medium">
                {businesses.length} {businesses.length === 1 ? 'Workspace' : 'Workspaces'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-normal">
              Manage enterprise knowledge bases, document repositories, and website assistant integrations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchBusinesses}
              className="p-1.5 rounded-md border border-white/[0.1] bg-[#111113] hover:bg-[#1A1A1E] text-zinc-400 hover:text-white transition-colors"
              title="Refresh Workspaces"
              aria-label="Refresh Workspaces"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-[#F97316] hover:bg-[#EA580C] text-black text-xs font-bold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        
        {/* Search & Control Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search workspaces by name or key..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-white/[0.08] rounded-md p-0.5 bg-[#0C0C0E] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-[#F97316] text-black font-bold shadow-subtle' : 'text-zinc-400 hover:text-white'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-[#F97316] text-black font-bold shadow-subtle' : 'text-zinc-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <GridIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-md bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs font-mono flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Content State: Loading / Empty / Data Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-2.5">
            <RefreshCw className="w-5 h-5 animate-spin text-white" />
            <p className="text-xs font-mono">Loading workspaces...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/[0.1] rounded-lg bg-[#08080A] p-8">
            <div className="w-10 h-10 rounded-md bg-white/[0.06] border border-white/[0.1] text-white flex items-center justify-center mx-auto mb-3 shadow-subtle">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">No Workspaces Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4 leading-relaxed">
              Create your first business workspace to upload PDFs, ground AI responses with citations, and generate executive reports.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-[#F97316] hover:bg-[#EA580C] text-black text-xs font-bold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              <span>Create Workspace</span>
            </button>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12 border border-white/[0.08] rounded-lg bg-[#08080A] p-6 text-zinc-400 text-xs">
            <p>No workspaces match your query "{searchFilter}".</p>
          </div>
        ) : viewMode === 'table' ? (
          /* High-Density Data Table (Dark) */
          <div className="rounded-lg border border-white/[0.08] bg-[#0A0A0C] overflow-hidden shadow-subtle">
            <table className="min-w-full divide-y divide-white/[0.08] text-left text-xs">
              <thead className="bg-[#111113] text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Workspace</th>
                  <th className="px-4 py-2.5 font-semibold">Domain / Website</th>
                  <th className="px-4 py-2.5 font-semibold">Public Widget Key</th>
                  <th className="px-4 py-2.5 font-semibold">RAG Pipeline</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredBusinesses.map((biz) => (
                  <tr
                    key={biz.uid}
                    onClick={() => onSelectBusiness(biz)}
                    className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-zinc-200 transition-colors">
                            {biz.business_name}
                          </p>
                          <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                            {biz.description || 'Enterprise document intelligence workspace.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-zinc-400 text-[11px]">
                      {biz.website_url ? (
                        <span className="flex items-center space-x-1 truncate max-w-[180px]">
                          <Globe className="w-3 h-3 text-zinc-500 shrink-0" />
                          <span>{biz.website_url.replace(/^https?:\/\//, '')}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px]">
                      {biz.public_key ? (
                        <div
                          onClick={(e) => handleCopyKey(biz.public_key, e)}
                          className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] transition-colors"
                          title="Click to copy public widget key"
                        >
                          <Key className="w-3 h-3 text-zinc-400" />
                          <span className="truncate max-w-[120px]">{biz.public_key}</span>
                          <span className="text-[10px] text-white font-semibold ml-1">
                            {copiedKey === biz.public_key ? <Check className="w-3 h-3 text-emerald-400" /> : 'Copy'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[10px] font-mono font-medium text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active</span>
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBusiness(biz);
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-medium transition-colors"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3 text-zinc-400" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteBusiness(biz.uid, biz.business_name, e)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                          title="Delete Workspace"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View (Dark) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusinesses.map((biz) => (
              <div
                key={biz.uid}
                onClick={() => onSelectBusiness(biz)}
                className="group relative bg-[#0C0C0E] border border-white/[0.08] hover:border-white/[0.22] rounded-lg p-4 transition-all duration-150 cursor-pointer shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-white group-hover:text-zinc-200 transition-colors">
                          {biz.business_name}
                        </h3>
                        {biz.website_url && (
                          <span className="text-[10px] font-mono text-zinc-400 flex items-center">
                            <Globe className="w-2.5 h-2.5 mr-1" />
                            {biz.website_url.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteBusiness(biz.uid, biz.business_name, e)}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                      title="Delete Workspace"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {biz.description || 'Enterprise document intelligence workspace powered by Knowra.'}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  {biz.public_key ? (
                    <div
                      onClick={(e) => handleCopyKey(biz.public_key, e)}
                      className="text-[10px] text-zinc-400 hover:text-white font-mono truncate max-w-[140px]"
                    >
                      Key: {biz.public_key}
                    </div>
                  ) : <span />}

                  <span className="font-semibold text-white flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Create Business Workspace Modal (Dark) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E0E10] border border-white/[0.12] rounded-lg max-w-md w-full p-6 shadow-modal relative">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-md bg-[#F97316] text-black flex items-center justify-center shadow-[0_2px_10px_rgba(249,115,22,0.35)]">
                  <Building2 className="w-3.5 h-3.5 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Create Workspace</h3>
                  <p className="text-[11px] text-zinc-400">Configure corporate knowledge base domain</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono p-1 rounded hover:bg-white/[0.08]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">
                  Workspace Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBiz.businessName}
                  onChange={(e) => setNewBiz({ ...newBiz, businessName: e.target.value })}
                  placeholder="e.g. Acme Engineering"
                  className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newBiz.description}
                  onChange={(e) => setNewBiz({ ...newBiz, description: e.target.value })}
                  placeholder="Brief summary of company domain, documentation scope, or business purpose..."
                  className="w-full bg-[#141416] border border-white/[0.1] rounded-md p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newBiz.websiteUrl}
                  onChange={(e) => setNewBiz({ ...newBiz, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-1.5 px-3 rounded-md border border-white/[0.1] bg-[#141416] hover:bg-[#1C1C1F] text-zinc-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newBiz.businessName.trim()}
                  className="flex-1 py-1.5 px-3 rounded-md bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-black text-xs font-bold transition-colors shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
                >
                  {isSubmitting ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

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
