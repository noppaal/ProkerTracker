import React from 'react';
import { Plus, FolderOpen, Edit3, Trash2 } from 'lucide-react';
import { Bar, progressColor } from './UI/Badge';
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
  const isAdmin = role === 'ADMIN';

  const calculateProjectProgress = (projectId) => {
    const projProkers = masterProkers.filter(p => p.projectId === projectId);
    if (projProkers.length === 0) return 0;

    const sum = projProkers.reduce((acc, p) => {
      return acc + calculateMasterProkerProgress(p, dynamicMilestones);
    }, 0);

    return Math.round(sum / projProkers.length);
  };

  return (
    <div style={{ marginBottom: 36 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1C1917', fontFamily: "'Lora', Georgia, serif" }}>
            Semua Projek
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#78716C' }}>
            {projects.length} projek aktif · klik baris untuk melihat detail program kerja
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAddProject}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#0F766E', color: '#fff', border: 'none',
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Projek Baru
          </button>
        )}
      </div>

      {/* Projects Grid Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid #EAEAE8', borderRadius: 8, overflow: 'hidden' }}>
        
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '120px 1fr 80px 180px 70px 80px',
          padding: '10px 20px', background: '#FAFAF9', borderBottom: '1px solid #E7E5E4',
        }}>
          {['Kode', 'Nama Projek', 'Proker', 'Pencapaian', 'Sub', 'Aksi'].map((h, idx) => (
            <span 
              key={h} 
              style={{ 
                fontSize: 11, 
                fontWeight: 700, 
                color: '#A8A29E', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em',
                textAlign: idx === 5 ? 'right' : 'left'
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {projects.length === 0 ? (
          <div style={{ padding: '64px 20px', textAlign: 'center', background: '#fff' }}>
            <FolderOpen size={36} color="#D6D3D1" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: '#A8A29E', margin: 0 }}>Belum ada projek</p>
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
                display: 'grid', gridTemplateColumns: '120px 1fr 80px 180px 70px 80px',
                padding: '14px 20px',
                background: '#fff',
                borderBottom: i < projects.length - 1 ? '1px solid #F5F5F4' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              className="proj-row"
            >
              {/* Code */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  background: proj.color || '#0F766E', color: '#fff',
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  padding: '4px 10px', borderRadius: 6, fontFamily: "'Geist Mono', monospace",
                  whiteSpace: 'nowrap'
                }}>
                  {proj.code}
                </span>
              </div>

              {/* Name & Desc */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1C1917', marginBottom: 3 }}>{proj.name}</div>
                <div style={{ fontSize: 12, color: '#A8A29E' }}>{proj.description}</div>
              </div>

              {/* Proker Count */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: '#57534E',
                  background: '#F5F5F4', padding: '4px 10px', borderRadius: 99,
                  fontFamily: "'Geist Mono', monospace",
                }}>
                  {projProkers.length}
                </span>
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', justify: 'center', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1 }}><Bar pct={pct} h={6} /></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: progressColor(pct), fontFamily: "'Geist Mono', monospace", width: 32, textAlign: 'right' }}>
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Subs */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: '#57534E',
                  background: '#F5F5F4', padding: '4px 10px', borderRadius: 99,
                  fontFamily: "'Geist Mono', monospace",
                }}>
                  {subs}
                </span>
              </div>

              {/* Admin Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'end' }} onClick={e => e.stopPropagation()}>
                {isAdmin ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => onEditProject(proj)}
                      style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
                      className="nav-item"
                      title="Edit Projek"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                      className="nav-item"
                      title="Hapus Projek"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: '#A8A29E' }}>-</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
