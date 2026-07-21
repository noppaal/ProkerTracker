import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Palette } from 'lucide-react';

const COLOR_OPTIONS = [
  { value: '#2563eb', label: 'Biru (Blue)' },
  { value: '#7c3aed', label: 'Ungu (Purple)' },
  { value: '#059669', label: 'Hijau (Emerald)' },
  { value: '#d97706', label: 'Amber (Yellow)' },
  { value: '#dc2626', label: 'Merah (Rose)' },
  { value: '#475569', label: 'Slate (Gray)' }
];

export const ProjectModal = ({
  isOpen,
  onClose,
  onSaveProject,
  editingProject = null
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563eb');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name || '');
      setCode(editingProject.code || '');
      setDescription(editingProject.description || '');
      setColor(editingProject.color || '#2563eb');
    } else {
      setName('');
      setCode(`PRJ-0${Math.floor(Math.random() * 9) + 1}`);
      setDescription('');
      setColor('#2563eb');
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama Projek wajib diisi');
      return;
    }

    onSaveProject({
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      description: description.trim(),
      color
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm">
              {editingProject ? 'Edit Projek' : 'Buat Projek Baru (Admin)'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kode Projek</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="PRJ-01"
              className="w-full bg-slate-50 border border-slate-300 font-mono text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Projek Utama *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Project Migration Banking 2026..."
              required
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Warna Akses Logis</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${color === c.value ? 'scale-110 border-slate-900 shadow-md' : 'border-transparent opacity-80'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deskripsi Projek</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat mengenai sasaran dan scope projek..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
            >
              {editingProject ? 'Simpan' : 'Buat Projek'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
