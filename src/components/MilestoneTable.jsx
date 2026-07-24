import React, { useState } from 'react';
import { ExternalLink, Plus, Trash2, Edit2, Layers, MessageSquare, X, Check } from 'lucide-react';
import { PBadge, Bar } from './UI/Badge';
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
  const isAdmin = role === 'TB';

  // Sub-program Note Edit Modal State
  const [editingSubNote, setEditingSubNote] = useState(null); // { subId, name, text }
  const [noteInput, setNoteInput] = useState('');

  const handleOpenNoteModal = (sub) => {
    setEditingSubNote(sub);
    setNoteInput(sub.specNotes || sub.notes || '');
  };

  const handleSaveSubNote = (e) => {
    e.preventDefault();
    if (!editingSubNote) return;

    const updatedSub = {
      ...editingSubNote,
      specNotes: noteInput.trim()
    };

    onUpdateSubItem(masterProker.id, updatedSub);
    setEditingSubNote(null);
    setNoteInput('');
  };

  return (
    <div style={{ background: '#FFFFFF' }}>
      
      {/* Sub-Header Toolbar - High Contrast Blue Banner for Expanded State */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: '#DBEAFE', borderBottom: '2px solid #BFDBFE',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} className="text-blue-700" />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#1E40AF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            SUB-PROGRAM KERJA: {masterProker.name} &nbsp;({masterProker.subItems?.length || 0} ITEMS)
          </span>
        </div>

        {isAdmin && (
          <button
            onClick={() => onAddSubItem(masterProker.id)}
            style={{
              fontSize: 12, color: '#FFFFFF', background: '#2563EB', border: 'none',
              padding: '6px 14px', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              fontWeight: 700, boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Plus size={14} /> Tambah Sub-Program
          </button>
        )}
      </div>

      {/* Sub-Items Table */}
      {(!masterProker.subItems || masterProker.subItems.length === 0) ? (
        <div style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#64748B', background: '#F8FAFC' }}>
          Belum ada sub-program kerja. {isAdmin ? 'Klik "+ Tambah Sub-Program" untuk membuat.' : ''}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #CBD5E1', background: '#F1F5F9' }}>
                <th style={{ padding: '10px 12px 10px 20px', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', width: 30 }}>#</th>
                <th style={{ padding: '10px 16px 10px 0', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 180 }}>Sub-Program</th>
                <th style={{ padding: '10px 16px 10px 0', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 120 }}>Link Terkait</th>
                <th style={{ padding: '10px 16px 10px 0', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 100 }}>Prioritas</th>
                <th style={{ padding: '10px 16px 10px 0', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', maxWidth: 220 }}>Catatan</th>

                {/* Dynamic Milestones */}
                {dynamicMilestones.map((m) => (
                  <th key={m.id} style={{ padding: '10px 16px 10px 0', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 140 }}>
                    {m.name}
                  </th>
                ))}

                <th style={{ padding: '10px 16px 10px 0', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', width: 100 }}>Progress</th>
                {isAdmin && <th style={{ padding: '10px 20px 10px 0', fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'right', width: 60 }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {masterProker.subItems.map((sub, idx) => {
                const subProgress = calculateSubProkerProgress(sub, dynamicMilestones);
                const link = sub.relatedLink || sub.mockupUrl;
                const noteText = sub.specNotes || sub.notes || '';

                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }} className="sub-row">
                    
                    {/* # Index */}
                    <td style={{ padding: '14px 12px 14px 20px', verticalAlign: 'top' }}>
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#2563EB', fontWeight: 800 }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </td>

                    {/* Sub Name */}
                    <td style={{ padding: '14px 16px 14px 0', verticalAlign: 'top', minWidth: 180 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{sub.name}</div>
                    </td>

                    {/* Dedicated Link Terkait Column */}
                    <td style={{ padding: '14px 16px 14px 0', verticalAlign: 'top', minWidth: 120 }}>
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
                    <td style={{ padding: '14px 16px 14px 0', verticalAlign: 'top' }}>
                      <PBadge p={sub.priority || masterProker.priority || 'P2'} />
                    </td>

                    {/* Catatan / Spec Column - ALL ROLES CAN CLICK TO EDIT/ADD NOTE */}
                    <td style={{ padding: '14px 16px 14px 0', verticalAlign: 'top', maxWidth: 220 }}>
                      <div 
                        onClick={() => handleOpenNoteModal(sub)}
                        style={{
                          cursor: 'pointer', padding: '3px 6px', borderRadius: 6,
                          border: '1px solid transparent', transition: 'all 0.15s'
                        }}
                        className="nav-item"
                        title="Klik untuk menambah atau mengedit catatan sub-program"
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
                            border: '1px border-blue-200', padding: '2px 8px', borderRadius: 6,
                            display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600
                          }}>
                            <Plus size={11} /> Catatan
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Dynamic Milestone Cells */}
                    {dynamicMilestones.map((m) => {
                      const milestoneData = sub.milestones ? sub.milestones[m.id] : {};

                      return (
                        <td key={m.id} style={{ padding: '14px 16px 14px 0', verticalAlign: 'top', minWidth: 140 }}>
                          <MilestoneCell
                            milestoneData={milestoneData}
                            milestoneMeta={m}
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
                    <td style={{ padding: '14px 16px 14px 0', verticalAlign: 'middle', width: 100 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', fontFamily: "'Geist Mono', monospace" }}>
                          {subProgress}%
                        </span>
                        <Bar pct={subProgress} h={6} />
                      </div>
                    </td>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <td style={{ padding: '14px 20px 14px 0', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'end', gap: 4 }}>
                          <button
                            onClick={() => onEditSubItem(masterProker.id, sub)}
                            style={{ padding: 5, borderRadius: 6, background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#475569' }}
                            title="Edit Sub-Program"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteSubItem(masterProker.id, sub.id)}
                            style={{ padding: 5, borderRadius: 6, background: '#FEE2E2', border: 'none', cursor: 'pointer', color: '#DC2626' }}
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

      {/* Sub-Program Note Interactive Edit Popover Modal */}
      {editingSubNote && (
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
                Isi Catatan Sub-Program
              </span>
              <button 
                onClick={() => setEditingSubNote(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSubNote} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4, textTransform: 'uppercase' }}>
                  Sub-Program:
                </label>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  {editingSubNote.name}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 5 }}>
                  Catatan Spek / Progress Tambahan *
                </label>
                <textarea
                  rows="4"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Ketik catatan spek atau progress tambahan untuk sub-program ini..."
                  autoFocus
                  style={{
                    width: '100%', background: '#FFFFFF', border: '2px solid #2563EB',
                    borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#0F172A',
                    boxShadow: '0 1px 3px rgba(37,99,235,0.1)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setEditingSubNote(null)}
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
