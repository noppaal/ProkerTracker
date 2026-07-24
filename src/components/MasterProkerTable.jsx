import React, { useState, useMemo } from 'react';
import { ExternalLink, Edit3, Trash2, FolderOpen, Plus, ChevronLeft, ChevronRight, MessageSquare, X, Search } from 'lucide-react';
import { PBadge, Bar } from './UI/Badge';
import { MilestoneCell } from './MilestoneCell';
import { calculateMasterProkerProgress } from '../services/apiService';

export const MasterProkerTable = ({
  masterProkers = [],
  dynamicMilestones = [],
  onEditMasterProker,
  onDeleteMasterProker,
  onUpdateMasterProker,
  role,
  onOpenAddProker,
  projects = [],
  activeProjectId = 'ALL',
  searchQuery = '',
  setSearchQuery,
  priorityFilter = 'ALL',
  setPriorityFilter,
  statusFilter = 'ALL',
  setStatusFilter
}) => {
  const isAdmin = role === 'TB';
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'asc', 'desc'
  const pageSize = 10;

  // Sub-program Note Edit Modal State
  const [editingNoteProker, setEditingNoteProker] = useState(null); // proker object
  const [noteInput, setNoteInput] = useState('');
  const [techNoteInput, setTechNoteInput] = useState('');

  const sortedProkers = useMemo(() => {
    let result = [...masterProkers];
    if (sortOrder === 'asc') {
      result.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => (b.code || '').localeCompare(a.code || ''));
    }
    return result;
  }, [masterProkers, sortOrder]);

  const totalPrograms = sortedProkers.length;
  const totalPages = Math.ceil(totalPrograms / pageSize) || 1;
  const isOverview = activeProjectId === 'ALL';

  const paginatedProkers = useMemo(() => {
    return sortedProkers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [sortedProkers, currentPage, pageSize]);

  const handleOpenNoteModal = (proker) => {
    setEditingNoteProker(proker);
    setNoteInput(proker.specNotes || proker.notes || '');
    setTechNoteInput(proker.techNotes || '');
  };

  const handleSaveSubNote = (e) => {
    e.preventDefault();
    if (!editingNoteProker) return;

    const updatedProker = {
      ...editingNoteProker,
      specNotes: noteInput.trim(),
      techNotes: techNoteInput.trim()
    };

    onUpdateMasterProker(updatedProker);
    setEditingNoteProker(null);
    setNoteInput('');
    setTechNoteInput('');
  };

  if (masterProkers.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '64px 20px', background: '#FFFFFF',
        border: '1px solid #E2E8F0', borderRadius: 14, margin: '16px 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}>
        <FolderOpen size={38} color="#94A3B8" style={{ margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Tidak ada sub program kerja ditemukan</p>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 18px' }}>Belum ada sub program kerja pada program ini atau filter tidak cocok.</p>
        {isAdmin && onOpenAddProker && (
          <button
            onClick={onOpenAddProker}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: '#FFFFFF', background: '#000000',
              border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Plus size={14} /> Tambah Sub Program Kerja
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E2E8F0',
      borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      marginBottom: 24
    }}>
      
      {/* 1. Card Header ("Daftar Sub Program Kerja") */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', gap: 12
      }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
          Daftar Sub Program Kerja
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          
          {/* Search Input */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8,
            padding: '4px 10px', width: 150, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
          }}>
            <Search size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
            <input
              type="text" 
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari..."
              style={{ flex: 1, border: 'none', background: 'none', fontSize: 12, color: '#0F172A', outline: 'none', minWidth: 0 }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Priority Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <select
              value={priorityFilter}
              onChange={e => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                fontSize: 12, color: '#475569', border: 'none', background: 'none',
                outline: 'none', cursor: 'pointer', fontWeight: 600
              }}
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="P1">URGENT (P1)</option>
              <option value="P2">TINGGI (P2)</option>
              <option value="P3">SEDANG (P3)</option>
              <option value="P4">RENDAH (P4)</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                fontSize: 12, color: '#475569', border: 'none', background: 'none',
                outline: 'none', cursor: 'pointer', fontWeight: 600
              }}
            >
              <option value="ALL">Semua Status</option>
              <option value="Done">Done</option>
              <option value="In Progress">In Progress</option>
              <option value="Hold">Hold</option>
              <option value="Not Yet">Not Yet</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Urut:</span>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                border: 'none', background: 'none', fontSize: 12, fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="default">Default</option>
              <option value="asc">Menaik</option>
              <option value="desc">Menurun</option>
            </select>
          </div>

          {/* Reset Filter Button */}
          {(searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('ALL');
                setStatusFilter('ALL');
                setCurrentPage(1);
              }}
              style={{
                fontSize: 11, color: '#64748B', background: '#F1F5F9',
                border: '1px solid #E2E8F0', padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600
              }}
            >
              <X size={12} /> Reset
            </button>
          )}

          {isAdmin && onOpenAddProker && (
            <button
              onClick={onOpenAddProker}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700, color: '#FFFFFF', background: '#2563EB',
                border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(37,99,235,0.15)'
              }}
            >
              <Plus size={13} /> Tambah Sub-Program
            </button>
          )}
        </div>
      </div>

      {/* 2. Flat Scrollable Table Layout */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #CBD5E1', background: '#F8FAFC' }}>
              <th style={{ padding: '12px 12px 12px 24px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 80 }}>Kode</th>
              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 200 }}>Sub Program Kerja</th>
              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 120 }}>Link Terkait</th>
              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 100 }}>Prioritas</th>
              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 100, maxWidth: 150 }}>Catatan</th>
              
              {/* Dynamic Milestones Headers */}
              {dynamicMilestones.map((m) => (
                <th key={m.id} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 140 }}>
                  {m.name}
                </th>
              ))}
              
              <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 120 }}>Progress</th>
              <th style={{ padding: '12px 24px 12px 16px', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'right', width: 80 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProkers.map((proker, idx) => {
              const masterProgress = calculateMasterProkerProgress(proker, dynamicMilestones);
              const parentProject = projects.find(p => p.id === proker.projectId);
              const link = proker.relatedLink || proker.mockupUrl;
              const noteText = proker.specNotes || proker.notes || '';
              const techNoteText = proker.techNotes || '';
              const globalIndex = (currentPage - 1) * pageSize + idx + 1;

              return (
                <tr 
                  key={proker.id} 
                  style={{ 
                    borderBottom: '1px solid #E2E8F0', 
                    background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' 
                  }} 
                  className="sub-row"
                >
                  {/* # Index / Code */}
                  <td style={{ padding: '14px 12px 14px 24px', verticalAlign: 'top' }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#2563EB', fontWeight: 800 }}>
                      {proker.code || '-'}
                    </span>
                  </td>

                  {/* Sub Program Kerja Name & Description */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top', minWidth: 200 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                          {proker.name}
                        </span>
                      </div>
                      {isOverview && parentProject && (
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginBottom: 4 }}>
                          Program: {parentProject.name}
                        </div>
                      )}
                      {proker.description && (
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                          {proker.description}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Related Link */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top', minWidth: 120 }}>
                    {link ? (
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          fontSize: 11, color: '#2563EB', background: '#EFF6FF',
                          border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: 6,
                          display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none',
                          fontWeight: 700, whiteSpace: 'nowrap'
                        }}
                        title={link}
                      >
                        <ExternalLink size={12} /> Buka Link
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>-</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top', minWidth: 100 }}>
                    <PBadge p={proker.priority || 'P2'} />
                  </td>

                  {/* Catatan Column */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top', minWidth: 100, maxWidth: 150 }}>
                    <div 
                      onClick={() => handleOpenNoteModal(proker)}
                      style={{
                        cursor: 'pointer', padding: '3px 6px', borderRadius: 6,
                        border: '1px solid transparent', transition: 'all 0.15s'
                      }}
                      className="nav-item"
                      title="Klik untuk melihat atau mengedit catatan"
                    >
                      {noteText ? (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                          <MessageSquare size={12} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                          <p style={{
                            fontSize: 12, color: '#334155', lineHeight: 1.4, margin: 0,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                          }}>
                            {noteText}
                          </p>
                        </div>
                      ) : (
                        <span style={{
                          fontSize: 11, color: '#2563EB', background: '#EFF6FF',
                          padding: '2px 8px', borderRadius: 6,
                          display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600
                        }}>
                          <Plus size={11} /> Catatan
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Dynamic Milestone Cells */}
                  {dynamicMilestones.map((m) => {
                    const milestoneData = proker.milestones ? proker.milestones[m.id] : {};

                    return (
                      <td key={m.id} style={{ padding: '14px 16px', verticalAlign: 'top', minWidth: 140 }}>
                        <MilestoneCell
                          milestoneData={milestoneData}
                          milestoneMeta={m}
                          role={role}
                          hasAccess={true}
                          onUpdateMilestone={(updatedCell) => {
                            const updatedProker = {
                              ...proker,
                              milestones: {
                                ...proker.milestones,
                                [m.id]: updatedCell
                              }
                            };
                            onUpdateMasterProker(updatedProker);
                          }}
                        />
                      </td>
                    );
                  })}

                  {/* Progress Column */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'middle', minWidth: 120 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', fontFamily: "'Geist Mono', monospace" }}>
                        {masterProgress}%
                      </span>
                      <Bar pct={masterProgress} h={6} />
                    </div>
                  </td>

                  {/* Actions (Admin CRUD) */}
                  <td style={{ padding: '14px 24px 14px 16px', verticalAlign: 'middle', textAlign: 'right', width: 80 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => onEditMasterProker(proker)}
                            style={{ padding: 6, borderRadius: 6, background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#475569' }}
                            title="Edit Sub Program Kerja"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteMasterProker(proker.id)}
                            style={{ padding: 6, borderRadius: 6, background: '#FEE2E2', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                            title="Hapus Sub Program Kerja"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94A3B8' }}>-</span>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Table Footer with Pagination */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0'
      }}>
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
          Showing {paginatedProkers.length} of {totalPrograms} sub-program
        </span>

        {/* Pagination Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#FFFFFF',
              color: currentPage === 1 ? '#CBD5E1' : '#0F172A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: currentPage === 1 ? 'default' : 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#FFFFFF',
              color: currentPage === totalPages ? '#CBD5E1' : '#0F172A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: currentPage === totalPages ? 'default' : 'pointer'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Catatan Interactive Edit Popover Modal */}
      {editingNoteProker && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{
            background: '#FFFFFF', width: '100%', maxWidth: 420, borderRadius: 16,
            border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden', fontSize: 13
          }}>
            
            <div style={{
              padding: '14px 18px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>
                Isi Catatan Sub Program Kerja
              </span>
              <button 
                onClick={() => setEditingNoteProker(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSubNote} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4, textTransform: 'uppercase' }}>
                  Sub Program Kerja:
                </label>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  {editingNoteProker.name}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 5 }}>
                  Catatan Spek / Kebutuhan
                </label>
                <textarea
                  rows="3"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Ketik catatan spek atau kebutuhan sub program kerja ini..."
                  autoFocus
                  style={{
                    width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1',
                    borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#0F172A'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 5 }}>
                  Catatan Teknis / Progress
                </label>
                <textarea
                  rows="3"
                  value={techNoteInput}
                  onChange={(e) => setTechNoteInput(e.target.value)}
                  placeholder="Ketik catatan teknis atau progress sub program kerja ini..."
                  style={{
                    width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1',
                    borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#0F172A'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setEditingNoteProker(null)}
                  style={{
                    padding: '8px 14px', borderRadius: 8, background: '#F1F5F9',
                    border: '1px solid #E2E8F0', color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px', borderRadius: 8, background: '#2563EB',
                    border: 'none', color: '#FFFFFF', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  Simpan Catatan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
