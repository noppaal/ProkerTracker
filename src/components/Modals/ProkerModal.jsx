import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Link, Folder } from 'lucide-react';
import { PRIORITY_OPTIONS } from '../../data/initialData';

export const ProkerModal = ({
  isOpen,
  onClose,
  onSave,
  editingProker = null,
  dynamicMilestones = [],
  projects = [],
  activeProjectId = 'ALL'
}) => {
  const [projectId, setProjectId] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('P2');
  const [relatedLink, setRelatedLink] = useState('');
  const [description, setDescription] = useState('');
  const [subItems, setSubItems] = useState([]);

  useEffect(() => {
    if (editingProker) {
      setProjectId(editingProker.projectId || (projects[0]?.id || ''));
      setCode(editingProker.code || '');
      setName(editingProker.name || '');
      setPriority(editingProker.priority || 'P2');
      setRelatedLink(editingProker.relatedLink || editingProker.mockupUrl || '');
      setDescription(editingProker.description || '');
      setSubItems(editingProker.subItems || []);
    } else {
      const defaultProj = (activeProjectId !== 'ALL' ? activeProjectId : (projects[0]?.id || ''));
      setProjectId(defaultProj);
      setCode(`PRK-${String(Math.floor(Math.random() * 900) + 100)}`);
      setName('');
      setPriority('P2');
      setRelatedLink('');
      setDescription('');
      setSubItems([
        {
          id: `sub-${Date.now()}`,
          name: '',
          priority: 'P2',
          specNotes: '',
          techNotes: '',
          relatedLink: '',
          milestones: {}
        }
      ]);
    }
  }, [editingProker, isOpen, activeProjectId, projects]);

  if (!isOpen) return null;

  const handleAddSubItem = () => {
    setSubItems(prev => [
      ...prev,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: '',
        priority,
        specNotes: '',
        techNotes: '',
        relatedLink: '',
        milestones: {}
      }
    ]);
  };

  const handleRemoveSubItem = (id) => {
    setSubItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubItemChange = (index, field, value) => {
    setSubItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama Program Kerja Utama wajib diisi');
      return;
    }
    if (!projectId) {
      alert('Pilih Projek tempat Proker ini berada');
      return;
    }

    onSave({
      id: editingProker ? editingProker.id : `prk-${Date.now()}`,
      projectId,
      code,
      name: name.trim(),
      priority,
      relatedLink: relatedLink.trim(),
      description: description.trim(),
      subItems
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 text-xs">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm">
              {editingProker ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Project Selection Hierarchy */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pilih Projek Induk <span className="text-rose-500">*</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Proker</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRK-001"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Skala Prioritas Utama</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nama Program Kerja Utama <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Modernisasi Core Banking System..."
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Link Terkait Field - Clean Label & Placeholder without Application Names */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Link Terkait</label>
              <div className="relative">
                <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={relatedLink}
                  onChange={(e) => setRelatedLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Deskripsi / Scope Proker</label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan ringkas tujuan program kerja..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

          </div>

          {/* Sub Items Hierarchy */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                Daftar Sub-Program Kerja ({subItems.length})
              </h3>
              <button
                type="button"
                onClick={handleAddSubItem}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Sub-Program</span>
              </button>
            </div>

            <div className="space-y-3">
              {subItems.map((sub, idx) => (
                <div key={sub.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 font-bold">Sub-Program #{idx + 1}</span>
                    {subItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubItem(sub.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Hapus Sub-Program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Sub-Program *</label>
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => handleSubItemChange(idx, 'name', e.target.value)}
                        placeholder="Nama Sub-Program Kerja..."
                        required
                        className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Prioritas</label>
                      <select
                        value={sub.priority || priority}
                        onChange={(e) => handleSubItemChange(idx, 'priority', e.target.value)}
                        className="w-full bg-white border border-slate-300 text-slate-900 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600 text-xs"
                      >
                        {PRIORITY_OPTIONS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dedicated Link Terkait Field for Sub-Program */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Link Terkait</label>
                      <input
                        type="url"
                        value={sub.relatedLink || sub.mockupUrl || ''}
                        onChange={(e) => handleSubItemChange(idx, 'relatedLink', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Catatan</label>
                      <input
                        type="text"
                        value={sub.specNotes || ''}
                        onChange={(e) => handleSubItemChange(idx, 'specNotes', e.target.value)}
                        placeholder="Ketik catatan..."
                        className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
            >
              {editingProker ? 'Simpan Perubahan' : 'Buat Program Kerja'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
