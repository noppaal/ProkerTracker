import React, { useState } from 'react';
import { X, Sliders, Edit2, Trash2 } from 'lucide-react';

export const DynamicMilestoneModal = ({
  isOpen,
  onClose,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  existingMilestones = []
}) => {
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneCode, setMilestoneCode] = useState('');
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!milestoneName.trim()) {
      alert('Nama Milestone wajib diisi');
      return;
    }

    const cleanName = milestoneName.trim();
    const cleanCode = milestoneCode.trim() ? milestoneCode.trim().toUpperCase() : cleanName.substring(0, 6).toUpperCase();

    if (editingMilestoneId) {
      onUpdateMilestone({
        id: editingMilestoneId,
        name: cleanName,
        code: cleanCode
      });
      setEditingMilestoneId(null);
    } else {
      const id = `m_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
      onAddMilestone({ id, name: cleanName, code: cleanCode });
    }

    setMilestoneName('');
    setMilestoneCode('');
  };

  const startEdit = (m) => {
    setEditingMilestoneId(m.id);
    setMilestoneName(m.name || '');
    setMilestoneCode(m.code || '');
  };

  const cancelEdit = () => {
    setEditingMilestoneId(null);
    setMilestoneName('');
    setMilestoneCode('');
  };

  const handleDelete = (m) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kolom milestone "${m.name}"? Data milestone ini pada seluruh sub-program akan dihapus.`)) {
      onDeleteMilestone(m.id);
      if (editingMilestoneId === m.id) {
        cancelEdit();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h2 className="font-bold text-sm">Kelola Kolom Milestone (CRUD)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Create / Update Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                {editingMilestoneId ? 'Edit Milestone & Nama Panggilan' : 'Tambah Milestone Baru'}
              </label>
              {editingMilestoneId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-[11px] font-semibold text-rose-600 hover:underline"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Milestone Utama *</label>
                <input
                  type="text"
                  value={milestoneName}
                  onChange={(e) => setMilestoneName(e.target.value)}
                  placeholder="Contoh: Status Security Audit, Status UAT..."
                  autoFocus
                  required
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nama Panggilan / Kode Singkat (muncul di samping namanya)
                </label>
                <input
                  type="text"
                  value={milestoneCode}
                  onChange={(e) => setMilestoneCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: DEV, UREQ, TEST, DEPLOY..."
                  maxLength={10}
                  className="w-full bg-white border border-slate-300 font-mono text-slate-900 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                {editingMilestoneId ? 'Simpan Perubahan' : '+ Tambah Kolom'}
              </button>
            </div>
          </form>

          {/* List of Active Milestones with Edit & Delete Actions */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2.5">
              Daftar Milestone Aktif ({existingMilestones.length}):
            </label>

            {existingMilestones.length === 0 ? (
              <p className="text-slate-500 text-xs py-2 text-center">Belum ada kolom milestone.</p>
            ) : (
              <div className="space-y-2">
                {existingMilestones.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      editingMilestoneId === m.id
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="font-bold text-slate-900 text-xs truncate">{m.name}</span>
                      {m.code && (
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          {m.code}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(m)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                        title="Edit Milestone & Nama Panggilan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(m)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
