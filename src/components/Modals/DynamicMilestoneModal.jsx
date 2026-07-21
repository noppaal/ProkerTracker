import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';

export const DynamicMilestoneModal = ({
  isOpen,
  onClose,
  onAddMilestone,
  existingMilestones = []
}) => {
  const [milestoneName, setMilestoneName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!milestoneName.trim()) {
      alert('Nama Milestone wajib diisi');
      return;
    }

    const cleanName = milestoneName.trim();
    const id = `m_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const code = cleanName.substring(0, 6).toUpperCase();

    onAddMilestone({ id, name: cleanName, code });
    setMilestoneName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-2xs">
      <div className="bg-white w-full max-w-md rounded-lg border border-[#E9E9E7] shadow-lg overflow-hidden text-xs">
        
        <div className="p-3 bg-[#F7F6F3] border-b border-[#E9E9E7] flex items-center justify-between">
          <h2 className="font-semibold text-[#37352F]">Tambah Kolom Milestone</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#E9E9E7] text-[#787774]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-[#787774] mb-1">
              Nama Tahapan / Milestone Baru *
            </label>
            <input
              type="text"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Contoh: Status Security Audit, Status UAT..."
              autoFocus
              required
              className="w-full bg-[#F7F6F3] border border-[#E9E9E7] text-[#37352F] text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[#2383E2]"
            />
          </div>

          <div className="pt-2 border-t border-[#E9E9E7]">
            <label className="block text-[10px] font-medium text-[#9B9A97] uppercase mb-1.5">
              Milestone Aktif ({existingMilestones.length}):
            </label>
            <div className="flex flex-wrap gap-1">
              {existingMilestones.map(m => (
                <span key={m.id} className="text-[11px] px-1.5 py-0.5 rounded bg-[#F1F1EF] text-[#37352F] flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#448361]" />
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E9E9E7] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#F7F6F3] border border-[#E9E9E7] text-[#37352F] hover:bg-[#EFEEEC]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded bg-[#2383E2] hover:bg-[#1D74C9] text-white font-medium shadow-2xs"
            >
              Tambah Kolom
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
