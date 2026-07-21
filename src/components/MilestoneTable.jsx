import React from 'react';
import { ExternalLink, Plus, Trash2, Edit2 } from 'lucide-react';
import { PBadge, SBadge, Bar, DelayTag, progressColor } from './UI/Badge';
import { MilestoneCell } from './MilestoneCell';
import { calculateSubProkerProgress } from '../services/apiService';

export const MilestoneTable = ({
  masterProker,
  dynamicMilestones = [],
  expandedMilestoneIds = {},
  onToggleMilestoneColumn,
  onUpdateSubItem,
  onDeleteSubItem,
  onAddSubItem,
  onEditSubItem,
  role
}) => {
  const isAdmin = role === 'ADMIN';

  return (
    <div style={{ borderTop: '1px solid #F5F5F4' }}>
      
      {/* Sub-Header Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', background: '#FAFAF9', borderBottom: '1px solid #F0EFEE',
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#A8A29E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Sub-Program Kerja &nbsp;·&nbsp; {masterProker.subItems?.length || 0}
        </span>

        {isAdmin && (
          <button
            onClick={() => onAddSubItem(masterProker.id)}
            style={{
              fontSize: 12, color: '#0F766E', background: 'none', border: '1px solid #CCFBF1',
              padding: '4px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Plus size={12} /> Tambah Sub-Program
          </button>
        )}
      </div>

      {/* Sub-Items Table */}
      {(!masterProker.subItems || masterProker.subItems.length === 0) ? (
        <div style={{ padding: '24px 20px', textAlign: 'center', fontSize: 12, color: '#A8A29E', background: '#fff' }}>
          Belum ada sub-program kerja. {isAdmin ? 'Klik "+ Tambah Sub-Program" untuk membuat.' : ''}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F0EFEE', background: '#FAFAF9' }}>
                <th style={{ padding: '8px 12px 8px 20px', fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', width: 30 }}>#</th>
                <th style={{ padding: '8px 16px 8px 0', fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 180 }}>Sub-Program</th>
                <th style={{ padding: '8px 16px 8px 0', fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 90 }}>Prioritas</th>
                <th style={{ padding: '8px 16px 8px 0', fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', maxWidth: 220 }}>Catatan Spek</th>

                {/* Dynamic Milestones */}
                {dynamicMilestones.map((m) => (
                  <th key={m.id} style={{ padding: '8px 16px 8px 0', fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 140 }}>
                    {m.name}
                  </th>
                ))}

                <th style={{ padding: '8px 16px 8px 0', fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', width: 100 }}>Progress</th>
                {isAdmin && <th style={{ padding: '8px 20px 8px 0', fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'right', width: 60 }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {masterProker.subItems.map((sub, idx) => {
                const subProgress = calculateSubProkerProgress(sub, dynamicMilestones);
                const link = sub.relatedLink || sub.mockupUrl;

                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #F5F5F4' }} className="sub-row">
                    
                    {/* # Index */}
                    <td style={{ padding: '12px 12px 12px 20px', verticalAlign: 'top' }}>
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#A8A29E' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </td>

                    {/* Sub Name & Link */}
                    <td style={{ padding: '12px 16px 12px 0', verticalAlign: 'top', minWidth: 180 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1C1917', marginBottom: 3 }}>{sub.name}</div>
                      {link && (
                        <a href={link} target="_blank" rel="noreferrer"
                          style={{ fontSize: 11, color: '#0F766E', display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
                          <ExternalLink size={10} /> Lihat dokumen
                        </a>
                      )}
                    </td>

                    {/* Priority */}
                    <td style={{ padding: '12px 16px 12px 0', verticalAlign: 'top' }}>
                      <PBadge p={sub.priority || masterProker.priority || 'P2'} />
                    </td>

                    {/* Catatan / Spec */}
                    <td style={{ padding: '12px 16px 12px 0', verticalAlign: 'top', maxWidth: 220 }}>
                      <p style={{
                        fontSize: 12, color: '#78716C', lineHeight: 1.5, margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>
                        {sub.specNotes || sub.notes || '-'}
                      </p>
                    </td>

                    {/* Dynamic Milestone Cells */}
                    {dynamicMilestones.map((m) => {
                      const milestoneData = sub.milestones ? sub.milestones[m.id] : {};

                      return (
                        <td key={m.id} style={{ padding: '12px 16px 12px 0', verticalAlign: 'top', minWidth: 140 }}>
                          <MilestoneCell
                            milestoneData={milestoneData}
                            role={role}
                            hasAccess={true}
                            onUpdateMilestone={(updatedCell) => {
                              const updatedSub = {
                                ...sub,
                                milestones: {
                                  ...sub.milestones,
                                  [m.id]: updatedCell
                                }
                              };
                              onUpdateSubItem(masterProker.id, updatedSub);
                            }}
                          />
                        </td>
                      );
                    })}

                    {/* Progress Bar */}
                    <td style={{ padding: '12px 16px 12px 0', verticalAlign: 'middle', width: 100 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: progressColor(subProgress), fontFamily: "'Geist Mono', monospace" }}>
                          {subProgress}%
                        </span>
                        <Bar pct={subProgress} h={4} />
                      </div>
                    </td>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <td style={{ padding: '12px 20px 12px 0', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'end', gap: 4 }}>
                          <button
                            onClick={() => onEditSubItem(masterProker.id, sub)}
                            style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
                            className="nav-item"
                            title="Edit Sub-Program"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteSubItem(masterProker.id, sub.id)}
                            style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                            className="nav-item"
                            title="Hapus Sub-Program"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
