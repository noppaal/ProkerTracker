import React, { useState } from 'react';
import { Calendar, Check, X, Clock, Edit2 } from 'lucide-react';
import { SBadge, DelayTag } from './UI/Badge';
import { STATUS_OPTIONS } from '../data/initialData';

export const MilestoneCell = ({
  milestoneData = {},
  onUpdateMilestone,
  role,
  hasAccess = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentStatus = milestoneData.status || 'Not Yet';
  const targetDate = milestoneData.targetDate || milestoneData.target || '';
  const actualDate = milestoneData.actualDate || milestoneData.actual || '';
  const notes = milestoneData.notes || '';

  const [formStatus, setFormStatus] = useState(currentStatus);
  const [formTargetDate, setFormTargetDate] = useState(targetDate);
  const [formActualDate, setFormActualDate] = useState(actualDate);
  const [formNotes, setFormNotes] = useState(notes);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateMilestone({
      status: formStatus,
      targetDate: formTargetDate,
      target: formTargetDate,
      actualDate: formActualDate,
      actual: formActualDate,
      notes: formNotes
    });
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Read-Only / Interactive Cell View */}
      <div 
        onClick={() => hasAccess && setIsOpen(true)}
        style={{
          display: 'flex', flexDirection: 'column', gap: 4, cursor: hasAccess ? 'pointer' : 'default',
          padding: '4px 6px', borderRadius: 8, transition: 'background 0.15s'
        }}
        className="nav-item"
        title={hasAccess ? 'Klik untuk mengubah status milestone & tanggal' : ''}
      >
        <SBadge s={currentStatus} isEditable={hasAccess} />
        
        {targetDate && (
          <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
            {targetDate}
          </span>
        )}

        <DelayTag target={targetDate} actual={actualDate} status={currentStatus} />
      </div>

      {/* Interactive Update Popover Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{
            background: '#FFFFFF', width: '100%', maxWidth: 360, borderRadius: 16,
            border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden', fontSize: 13
          }}>
            
            {/* Popover Header */}
            <div style={{
              padding: '14px 18px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>Update Status Milestone</span>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Status Milestone
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  style={{
                    width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#0F172A', fontWeight: 500
                  }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Target Date (Rencana)
                </label>
                <input
                  type="date"
                  value={formTargetDate}
                  onChange={(e) => setFormTargetDate(e.target.value)}
                  style={{
                    width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#0F172A',
                    fontFamily: "'Geist Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Actual Date (Selesai Real)
                </label>
                <input
                  type="date"
                  value={formActualDate}
                  onChange={(e) => setFormActualDate(e.target.value)}
                  style={{
                    width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#0F172A',
                    fontFamily: "'Geist Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Catatan Perkembangan
                </label>
                <textarea
                  rows="2"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Tambah rincian catatan..."
                  style={{
                    width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#0F172A'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                  Simpan Status
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
