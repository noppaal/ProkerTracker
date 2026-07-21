import React from 'react';
import { Search, X, ChevronRight, Plus } from 'lucide-react';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  isExpandAll,
  toggleExpandAll,
  onOpenAddProker,
  onOpenAddMilestone,
  role
}) => {
  const isAdmin = role === 'ADMIN';
  const hasFilter = !!searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
      
      {/* Search Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        background: '#F7F7F5', border: '1px solid #EAEAE8', borderRadius: 7,
        padding: '6px 10px', flex: '1 1 180px',
      }}>
        <Search size={13} color="#C1C0BB" style={{ flexShrink: 0 }} />
        <input
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari proker atau sub-item..."
          style={{ flex: 1, border: 'none', background: 'none', fontSize: 13, color: '#1C1917', outline: 'none', minWidth: 0 }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C1C0BB', padding: 0, display: 'flex' }}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Priority Dropdown */}
      <select
        value={priorityFilter}
        onChange={e => setPriorityFilter(e.target.value)}
        style={{
          fontSize: 13, color: '#6B6B68', border: '1px solid #EAEAE8',
          background: '#F7F7F5', padding: '6px 10px', borderRadius: 7,
          fontFamily: 'inherit', cursor: 'pointer',
        }}
      >
        <option value="ALL">Semua prioritas</option>
        <option value="P1">P1 Urgent</option>
        <option value="P2">P2 High</option>
        <option value="P3">P3 Medium</option>
        <option value="P4">P4 Low</option>
      </select>

      {/* Status Dropdown */}
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        style={{
          fontSize: 13, color: '#6B6B68', border: '1px solid #EAEAE8',
          background: '#F7F7F5', padding: '6px 10px', borderRadius: 7,
          fontFamily: 'inherit', cursor: 'pointer',
        }}
      >
        <option value="ALL">Semua status</option>
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
            fontSize: 12, color: '#9B9A97', background: 'none',
            border: 'none', padding: '6px 4px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <X size={12} /> Reset
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Accordion Expand/Collapse All */}
      <button
        onClick={toggleExpandAll}
        style={{
          fontSize: 12, color: '#9B9A97', background: 'none',
          border: 'none', padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
        className="nav-item"
      >
        <ChevronRight size={12} style={{ transform: isExpandAll ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        {isExpandAll ? 'Tutup semua' : 'Buka semua'}
      </button>

      {/* Add Milestone Column CTA */}
      {isAdmin && onOpenAddMilestone && (
        <button
          onClick={onOpenAddMilestone}
          style={{
            fontSize: 12, color: '#78716C', background: '#F5F5F4',
            border: '1px solid #E7E5E4', padding: '6px 10px', borderRadius: 7, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          + Kolom Milestone
        </button>
      )}

      {/* Add Proker CTA Button */}
      {isAdmin && (
        <button 
          onClick={onOpenAddProker}
          style={{
            fontSize: 13, fontWeight: 500, color: '#fff', background: '#0F766E',
            border: 'none', padding: '7px 12px', borderRadius: 7, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <Plus size={13} /> Proker Baru
        </button>
      )}

    </div>
  );
};
