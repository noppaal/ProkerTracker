import React from 'react';
import { Plus, FolderOpen, Edit3, Trash2 } from 'lucide-react';
import { Bar } from './UI/Badge';
import { calculateMasterProkerProgress } from '../services/apiService';

export const ProjectsOverview = ({
  projects = [],
  masterProkers = [],
  dynamicMilestones = [],
  onSelectProject,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  role
}) => {
  const isAdmin = role === 'TB' || role === 'ADMIN';

  const calculateProjectProgress = (projectId) => {
    const projProkers = masterProkers.filter(p => p.projectId === projectId);
    if (projProkers.length === 0) return 0;

    const sum = projProkers.reduce((acc, p) => {
      return acc + calculateMasterProkerProgress(p, dynamicMilestones);
    }, 0);

    return Math.round(sum / projProkers.length);
  };

  return (
    <div style={{ marginBottom: 28 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Semua Projek
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
            {projects.length} projek aktif · Klik baris untuk memfilter program kerja
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAddProject}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#2563EB', color: '#FFFFFF', border: 'none',
              padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Plus size={15} /> Projek Baru
          </button>
        )}
      </div>

      {/* Projects Grid Container */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden',
        background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}>
        
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '110px 1fr 100px 220px 100px 80px',
          columnGap: 16,
          padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
        }}>
          {['Kode', 'Nama Projek', 'Proker', 'Pencapaian', 'Sub-Proker', 'Aksi'].map((h, idx) => (
            <span 
              key={h} 
              style={{ 
                fontSize: 11, 
                fontWeight: 700, 
                color: '#64748B', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em',
                textAlign: idx === 5 ? 'right' : (idx === 4 ? 'center' : 'left')
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {projects.length === 0 ? (
          <div style={{ padding: '64px 20px', textAlign: 'center', background: '#FFFFFF' }}>
            <FolderOpen size={38} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Belum ada projek tersedia</p>
          </div>
        ) : projects.map((proj, i) => {
          const projProkers = masterProkers.filter(p => p.projectId === proj.id);
          const pct = calculateProjectProgress(proj.id);
          const subs = projProkers.reduce((a, p) => a + (p.subItems?.length || 0), 0);

          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              style={{
                display: 'grid', gridTemplateColumns: '110px 1fr 100px 220px 100px 80px',
                columnGap: 16,
                padding: '16px 20px',
                background: '#FFFFFF',
                borderBottom: i < projects.length - 1 ? '1px solid #F1F5F9' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
                alignItems: 'center'
              }}
              className="proj-row"
            >
              {/* Code Badge */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  background: proj.color || '#2563EB', color: '#FFFFFF',
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  padding: '4px 10px', borderRadius: 6, fontFamily: "'Geist Mono', monospace",
                  whiteSpace: 'nowrap'
                }}>
                  {proj.code}
                </span>
              </div>

              {/* Name & Desc */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{proj.name}</div>
                <div style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.description}</div>
              </div>

              {/* Proker Count */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: '#0F172A',
                  background: '#F1F5F9', padding: '4px 10px', borderRadius: 99,
                  fontFamily: "'Geist Mono', monospace",
                  whiteSpace: 'nowrap'
                }}>
                  {projProkers.length} Proker
                </span>
              </div>

              {/* Progress Bar & Percentage */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}><Bar pct={pct} h={7} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', fontFamily: "'Geist Mono', monospace", width: 36, textAlign: 'right', flexShrink: 0 }}>
                  {pct}%
                </span>
              </div>

              {/* Subs Pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: '#475569',
                  background: '#F1F5F9', padding: '4px 12px', borderRadius: 99,
                  fontFamily: "'Geist Mono', monospace",
                  whiteSpace: 'nowrap'
                }}>
                  {subs} Sub
                </span>
              </div>

              {/* Admin Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }} onClick={e => e.stopPropagation()}>
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => onEditProject(proj)}
                      style={{ padding: 5, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                      title="Edit Projek"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      style={{ padding: 5, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                      title="Hapus Projek"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>-</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
