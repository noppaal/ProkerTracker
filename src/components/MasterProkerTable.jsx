import React, { useState } from 'react';
import { ChevronRight, ExternalLink, Edit3, Trash2, FolderOpen, Plus, ChevronLeft, ChevronDown } from 'lucide-react';
import { PBadge, Bar } from './UI/Badge';
import { MilestoneTable } from './MilestoneTable';
import { calculateMasterProkerProgress } from '../services/apiService';

export const MasterProkerTable = ({
  masterProkers = [],
  dynamicMilestones = [],
  expandedRowIds = {},
  onToggleRow,
  expandedMilestoneIds = {},
  onToggleMilestoneColumn,
  onEditMasterProker,
  onDeleteMasterProker,
  onUpdateSubItem,
  onDeleteSubItem,
  onAddSubItem,
  onEditSubItem,
  role,
  onOpenAddProker,
  projects = [],
  activeProjectId = 'ALL'
}) => {
  const isAdmin = role === 'TB' || role === 'ADMIN';
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPrograms = masterProkers.length;
  const totalPages = Math.ceil(totalPrograms / pageSize) || 1;
  const isOverview = activeProjectId === 'ALL';

  const paginatedProkers = masterProkers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (masterProkers.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '64px 20px', background: '#FFFFFF',
        border: '1px solid #E2E8F0', borderRadius: 14, margin: '16px 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}>
        <FolderOpen size={38} color="#94A3B8" style={{ margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Tidak ada program kerja ditemukan</p>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 18px' }}>Belum ada program kerja pada projek ini atau filter tidak cocok.</p>
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
            <Plus size={14} /> Tambah Program Kerja
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
      
      {/* 1. Card Header ("Daftar Program Kerja Utama") - Widgets Removed from top right */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px', borderBottom: '1px solid #F1F5F9'
      }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
          Daftar Program Kerja Utama
        </h2>
      </div>

      {/* 2. Table Column Headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1.2fr 2fr 1.2fr',
        padding: '12px 24px',
        background: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        gap: 16
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          PROGRAM KERJA
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          PRIORITAS
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          PROGRESS
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}>
          ACTION
        </span>
      </div>

      {/* 3. Program Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {paginatedProkers.map((proker) => {
          const open = !!expandedRowIds[proker.id];
          const masterProgress = calculateMasterProkerProgress(proker, dynamicMilestones);
          const parentProject = projects.find(p => p.id === proker.projectId);
          const link = proker.relatedLink || proker.mockupUrl;

          return (
            <div 
              key={proker.id} 
              style={{
                borderBottom: '1px solid #E2E8F0',
                background: open ? '#EFF6FF' : '#FFFFFF',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Row Content */}
              <div
                onClick={() => onToggleRow(proker.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1.2fr 2fr 1.2fr',
                  padding: '18px 24px',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  background: open ? '#EFF6FF' : '#FFFFFF',
                  borderLeft: open ? '5px solid #2563EB' : '5px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                className="prog-header"
              >
                {/* PROGRAM KERJA (Vertical Middle alignment on project page, Project Name on Overview) */}
                <div style={{
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isOverview ? 3 : 0 }}>
                    <span style={{
                      fontSize: 14, fontWeight: 800, color: open ? '#1E40AF' : '#0F172A', lineHeight: 1.3
                    }}>
                      {proker.name}
                    </span>
                    {proker.code && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: open ? '#1D4ED8' : '#64748B',
                        background: open ? '#DBEAFE' : '#F1F5F9',
                        padding: '2px 7px', borderRadius: 4,
                        fontFamily: "'Geist Mono', monospace",
                        flexShrink: 0
                      }}>
                        {proker.code}
                      </span>
                    )}
                  </div>

                  {/* Overview Page: display parent project name only. Individual Project Page: no subtitle */}
                  {isOverview && parentProject && (
                    <div style={{
                      fontSize: 12, color: open ? '#2563EB' : '#64748B',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontWeight: open ? 600 : 500
                    }}>
                      {parentProject.name}
                    </div>
                  )}
                </div>

                {/* PRIORITAS (Soft Dot Pill) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PBadge p={proker.priority || 'P2'} />
                </div>

                {/* PROGRESS (Bar + % Label) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingRight: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Bar pct={masterProgress} h={8} />
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 800, color: '#0F172A',
                    fontFamily: "'Geist Mono', monospace", width: 38, textAlign: 'right', flexShrink: 0
                  }}>
                    {masterProgress}%
                  </span>
                </div>

                {/* ACTION (View Details > Trigger + Admin CRUD) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                  
                  {link && (
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontSize: 12, color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 8px', borderRadius: 6, textDecoration: 'none', background: '#FFFFFF',
                        border: '1px solid #BFDBFE', fontWeight: 600
                      }}
                      title="Buka Link Terkait"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onEditMasterProker(proker)}
                        style={{ padding: 5, borderRadius: 6, background: open ? '#DBEAFE' : 'none', border: 'none', cursor: 'pointer', color: '#1E40AF' }}
                        title="Edit Proker"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteMasterProker(proker.id)}
                        style={{ padding: 5, borderRadius: 6, background: open ? '#FEE2E2' : 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                        title="Hapus Proker"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: open ? '#FFFFFF' : '#2563EB',
                    background: open ? '#2563EB' : 'transparent',
                    padding: open ? '5px 12px' : '4px 6px',
                    borderRadius: open ? 8 : 0,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    userSelect: 'none',
                    boxShadow: open ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}>
                    {open ? 'Tutup Detail' : 'View Details'}
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={15} />}
                  </span>

                </div>

              </div>

              {/* Expanded Sub-Program Table Breakdown */}
              {open && (
                <div style={{
                  margin: '8px 16px 20px 24px',
                  borderRadius: 12,
                  border: '2px solid #2563EB',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  boxShadow: '0 6px 16px rgba(37, 99, 235, 0.12)'
                }}>
                  <MilestoneTable
                    masterProker={proker}
                    dynamicMilestones={dynamicMilestones}
                    expandedMilestoneIds={expandedMilestoneIds}
                    onToggleMilestoneColumn={onToggleMilestoneColumn}
                    onUpdateSubItem={onUpdateSubItem}
                    onDeleteSubItem={onDeleteSubItem}
                    onAddSubItem={onAddSubItem}
                    onEditSubItem={onEditSubItem}
                    role={role}
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* 4. Table Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0'
      }}>
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
          Showing {paginatedProkers.length} of {totalPrograms} programs
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

    </div>
  );
};
