import React, { useState, useEffect } from 'react';
import { X, Folder, Link } from 'lucide-react';
import { PRIORITY_OPTIONS } from '../../data/initialData';

const generateAutoProkerCode = (projId, projs, prokers) => {
  if (!projId) return '';
  const proj = projs.find(p => p.id === projId);
  if (!proj) return '';

  let projectNum = 0;
  if (proj.code) {
    const match = proj.code.match(/PRJ-(\d+)/i);
    if (match) {
      projectNum = parseInt(match[1], 10);
    }
  }

  const existingProkersInProj = prokers.filter(p => p.projectId === projId);
  const nextSeq = existingProkersInProj.length + 1;
  const paddedSeq = nextSeq < 10 ? `0${nextSeq}` : String(nextSeq);

  return `PRK-${projectNum}${paddedSeq}`;
};

export const ProkerModal = ({
  isOpen,
  onClose,
  onSave,
  editingProker = null,
  dynamicMilestones = [],
  projects = [],
  activeProjectId = 'ALL',
  masterProkers = []
}) => {
  const [projectId, setProjectId] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('P2');
  const [relatedLink, setRelatedLink] = useState('');
  const [description, setDescription] = useState('');
  const [specNotes, setSpecNotes] = useState('');
  const [techNotes, setTechNotes] = useState('');

  useEffect(() => {
    if (editingProker) {
      setProjectId(editingProker.projectId || (projects[0]?.id || ''));
      setCode(editingProker.code || '');
      setName(editingProker.name || '');
      setPriority(editingProker.priority || 'P2');
      setRelatedLink(editingProker.relatedLink || editingProker.mockupUrl || '');
      setDescription(editingProker.description || '');
      setSpecNotes(editingProker.specNotes || '');
      setTechNotes(editingProker.techNotes || '');
    } else {
      const defaultProj = (activeProjectId !== 'ALL' ? activeProjectId : (projects[0]?.id || ''));
      setProjectId(defaultProj);
      const initialCode = generateAutoProkerCode(defaultProj, projects, masterProkers);
      setCode(initialCode);
      setName('');
      setPriority('P2');
      setRelatedLink('');
      setDescription('');
      setSpecNotes('');
      setTechNotes('');
    }
  }, [editingProker, isOpen, activeProjectId, projects, masterProkers]);

  useEffect(() => {
    if (!editingProker && projectId) {
      const newCode = generateAutoProkerCode(projectId, projects, masterProkers);
      setCode(newCode);
    }
  }, [projectId, editingProker, projects, masterProkers]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama Sub Program Kerja wajib diisi');
      return;
    }
    if (!projectId) {
      alert('Pilih Program Kerja tempat Sub-Proker ini berada');
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
      specNotes: specNotes.trim(),
      techNotes: techNotes.trim(),
      milestones: editingProker ? (editingProker.milestones || {}) : {}
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 text-xs">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm">
              {editingProker ? 'Edit Sub Program Kerja' : 'Tambah Sub Program Kerja Baru'}
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
                Pilih Program Kerja Induk <span className="text-rose-500">*</span>
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
              <label className="block font-bold text-slate-700 mb-1">Kode Sub Program Kerja</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRK-001"
                disabled
                className="w-full bg-slate-100 border border-slate-300 text-slate-500 font-mono cursor-not-allowed rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Skala Prioritas</label>
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
                Nama Sub Program Kerja <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Integrasi SDK Biometric..."
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Link Terkait Field */}
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
              <label className="block font-bold text-slate-700 mb-1">Deskripsi / Scope Pekerjaan</label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan ringkas tujuan sub program kerja..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Spek / Kebutuhan</label>
                <input
                  type="text"
                  value={specNotes}
                  onChange={(e) => setSpecNotes(e.target.value)}
                  placeholder="Contoh: Kebutuhan standar ISO-27001..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Teknis / Progress</label>
                <input
                  type="text"
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="Contoh: Integrasi SDK fingerprint selesai diproses..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
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
              {editingProker ? 'Simpan Perubahan' : 'Buat Sub Program Kerja'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
