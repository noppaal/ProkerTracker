import React, { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';

const COLOR_OPTIONS = [
  { value: '#2563eb', label: 'Biru (Blue)' },
  { value: '#7c3aed', label: 'Ungu (Purple)' },
  { value: '#059669', label: 'Hijau (Emerald)' },
  { value: '#d97706', label: 'Amber (Yellow)' },
  { value: '#dc2626', label: 'Merah (Rose)' },
  { value: '#475569', label: 'Slate (Gray)' }
];

const getNextProjectCode = (projectsList) => {
  let maxNum = 0;
  if (projectsList && Array.isArray(projectsList)) {
    projectsList.forEach(p => {
      if (p.code && typeof p.code === 'string') {
        const match = p.code.match(/PRJ-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      }
    });
  }
  const nextNum = maxNum + 1;
  const padded = String(nextNum).padStart(2, '0');
  return `PRJ-${padded}`;
};

export const ProjectModal = ({
  isOpen,
  onClose,
  onSaveProject,
  editingProject = null,
  projects = []
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563eb');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name || '');
      setCode(editingProject.code || '');
      setYear(editingProject.year || '2026');
      setDescription(editingProject.description || '');
      setColor(editingProject.color || '#2563eb');
    } else {
      setName('');
      setCode(getNextProjectCode(projects));
      setYear(new Date().getFullYear().toString());
      setDescription('');
      setColor('#2563eb');
    }
  }, [editingProject, isOpen, projects]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama Program Kerja wajib diisi');
      return;
    }

    onSaveProject({
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      year: year.trim() || '2026',
      description: description.trim(),
      color
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm">
              {editingProject ? 'Edit Program Kerja' : 'Buat Program Kerja Baru'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Program Kerja</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRJ-01"
                disabled
                className="w-full bg-slate-100 border border-slate-300 font-mono text-slate-500 cursor-not-allowed rounded-xl px-3 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Program Kerja</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full bg-slate-50 border border-slate-300 font-mono text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Program Kerja *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Program Kerja Migrasi Data 2026..."
              required
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Program Kerja</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan ringkas cakupan program kerja..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Warna Badge Code</label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`p-2 rounded-xl border flex items-center gap-2 font-semibold ${
                    color === c.value
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: c.value }} />
                  <span className="truncate">{c.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
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
              {editingProject ? 'Simpan Perubahan' : 'Buat Program Kerja'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
