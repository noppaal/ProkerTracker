import React from 'react';
import { Search, X, ChevronRight } from 'lucide-react';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  role
}) => {
  const hasFilter = !!searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
      
      {/* Search Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8,
        padding: '7px 12px', flex: '1 1 200px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
      }}>
        <Search size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
        <input
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari program kerja atau sub-item..."
          style={{ flex: 1, border: 'none', background: 'none', fontSize: 13, color: '#0F172A', outline: 'none', minWidth: 0 }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {/* Priority Dropdown */}
      <select
        value={priorityFilter}
        onChange={e => setPriorityFilter(e.target.value)}
        style={{
          fontSize: 13, color: '#475569', border: '1px solid #E2E8F0',
          background: '#FFFFFF', padding: '7px 12px', borderRadius: 8,
          fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}
      >
        <option value="ALL">Semua Prioritas</option>
        <option value="P1">URGENT (P1)</option>
        <option value="P2">TINGGI (P2)</option>
        <option value="P3">SEDANG (P3)</option>
        <option value="P4">RENDAH (P4)</option>
      </select>

      {/* Status Dropdown */}
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        style={{
          fontSize: 13, color: '#475569', border: '1px solid #E2E8F0',
          background: '#FFFFFF', padding: '7px 12px', borderRadius: 8,
          fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}
      >
        <option value="ALL">Semua Status</option>
        <option value="Done">Done</option>
        <option value="In Progress">In Progress</option>
        <option value="Hold">Hold</option>
        <option value="Not Yet">Not Yet</option>
        <option value="Cancel">Cancel</option>
      </select>

      {/* Reset Filter Button */}
      {hasFilter && (
        <button
          onClick={() => { setSearchQuery(''); setPriorityFilter('ALL'); setStatusFilter('ALL'); }}
          style={{
            fontSize: 12, color: '#64748B', background: '#F1F5F9',
            border: '1px solid #E2E8F0', padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600
          }}
        >
          <X size={13} /> Reset
        </button>
      )}

    </div>
  );
};
