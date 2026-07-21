import React from 'react';
import { ChevronRight, ExternalLink, Edit3, Trash2, FolderOpen, Plus } from 'lucide-react';
import { PBadge, Bar, progressColor } from './UI/Badge';
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
  projects = []
}) => {
  const isAdmin = role === 'ADMIN';

  if (masterProkers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', border: '1px solid #EAEAE8', borderRadius: 8, margin: '16px 0' }}>
        <FolderOpen size={36} color="#D6D3D1" style={{ margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontSize: 14, color: '#A8A29E', margin: '0 0 4px' }}>Tidak ada program kerja ditemukan</p>
        <p style={{ fontSize: 12, color: '#C4C0BB', margin: '0 0 16px' }}>Belum ada program kerja pada projek ini atau filter tidak cocok.</p>
        {isAdmin && onOpenAddProker && (
          <button
            onClick={onOpenAddProker}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 13, fontWeight: 500, color: '#fff', background: '#0F766E',
              border: 'none', padding: '7px 12px', borderRadius: 7, cursor: 'pointer',
            }}
          >
            <Plus size={13} /> Tambah Program Kerja
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {masterProkers.map((proker, index) => {
        const open = !!expandedRowIds[proker.id];
        const masterProgress = calculateMasterProkerProgress(proker, dynamicMilestones);
        const parentProject = projects.find(p => p.id === proker.projectId);
        const projectColor = parentProject ? (parentProject.color || '#0F766E') : '#0F766E';
        const link = proker.relatedLink || proker.mockupUrl;

        return (
          <div 
            key={proker.id} 
            style={{
              background: '#fff',
              border: '1px solid #EAEAE8',
              borderRadius: 8,
              overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
          >
            {/* Header row */}
            <div
              onClick={() => onToggleRow(proker.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', cursor: 'pointer',
                background: open ? '#FAFAF9' : '#fff',
                transition: 'background 0.15s',
              }}
              className="prog-header"
            >
              {/* Chevron */}
              <span style={{
                color: '#A8A29E', flexShrink: 0,
                transform: open ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s ease',
                display: 'flex',
              }}>
                <ChevronRight size={15} />
              </span>

              {/* Color stripe */}
              <span style={{ width: 3, height: 28, borderRadius: 2, background: projectColor, flexShrink: 0 }} />

              {/* Code */}
              <span style={{
                fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 500,
                background: '#F5F5F4', color: '#57534E',
                padding: '3px 8px', borderRadius: 4, flexShrink: 0,
                whiteSpace: 'nowrap'
              }}>
                {proker.code || `PRK-${index + 1}`}
              </span>

              {/* Priority */}
              <PBadge p={proker.priority || 'P2'} />

              {/* Title + desc */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1917', marginBottom: 2 }}>
                  {proker.name}
                </div>
                <div style={{ fontSize: 12, color: '#A8A29E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {proker.description || '-'}
                </div>
              </div>

              {/* Sub count */}
              <span style={{
                fontSize: 11, color: '#78716C', background: '#F5F5F4',
                padding: '3px 9px', borderRadius: 99, flexShrink: 0,
                fontFamily: "'Geist Mono', monospace"
              }}>
                {proker.subItems?.length || 0} sub
              </span>

              {/* Progress */}
              <div style={{ width: 100, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#A8A29E' }}>Progress</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: progressColor(masterProgress), fontFamily: "'Geist Mono', monospace" }}>
                    {masterProgress}%
                  </span>
                </div>
                <Bar pct={masterProgress} h={5} />
              </div>

              {/* Link */}
              {link && (
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    fontSize: 12, color: '#0F766E', display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 8px', borderRadius: 6, textDecoration: 'none', flexShrink: 0,
                    background: '#F0FDFA',
                  }}
                >
                  <ExternalLink size={11} /> Link
                </a>
              )}

              {/* Admin CRUD */}
              {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onEditMasterProker(proker)}
                    style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
                    className="nav-item"
                    title="Edit Proker"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteMasterProker(proker.id)}
                    style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                    className="nav-item"
                    title="Hapus Proker"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}

            </div>

            {/* Expanded table */}
            {open && (
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
            )}

          </div>
        );
      })}
    </div>
  );
};
