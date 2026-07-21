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
          padding: '2px 4px', borderRadius: 6, transition: 'background 0.15s'
        }}
        className="nav-item"
        title={hasAccess ? 'Klik untuk mengubah status milestone & tanggal' : ''}
      >
        <SBadge s={currentStatus} isEditable={hasAccess} />
        
        {targetDate && (
          <span style={{ fontSize: 11, color: '#A8A29E', fontFamily: "'Geist Mono', monospace" }}>
            {targetDate}
          </span>
        )}

        <DelayTag target={targetDate} actual={actualDate} status={currentStatus} />
      </div>

      {/* Interactive Update Popover Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(28, 25, 23, 0.4)', backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{
            background: '#fff', width: '100%', maxWidth: 360, borderRadius: 12,
            border: '1px solid #EAEAE8', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden', fontSize: 12
          }}>
            
            {/* Popover Header */}
            <div style={{
              padding: '12px 16px', background: '#FAFAF9', borderBottom: '1px solid #EAEAE8',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: 600, color: '#1C1917', fontSize: 13 }}>Update Status Milestone</span>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E', padding: 2 }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#78716C', marginBottom: 4 }}>
                  Status Milestone
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  style={{
                    width: '100%', background: '#F7F7F5', border: '1px solid #EAEAE8',
                    borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#1C1917'
                  }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#78716C', marginBottom: 4 }}>
                  Target Date (Rencana)
                </label>
                <input
                  type="date"
                  value={formTargetDate}
                  onChange={(e) => setFormTargetDate(e.target.value)}
                  style={{
                    width: '100%', background: '#F7F7F5', border: '1px solid #EAEAE8',
                    borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#1C1917',
                    fontFamily: "'Geist Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#78716C', marginBottom: 4 }}>
                  Actual Date (Selesai Real)
                </label>
                <input
                  type="date"
                  value={formActualDate}
                  onChange={(e) => setFormActualDate(e.target.value)}
                  style={{
                    width: '100%', background: '#F7F7F5', border: '1px solid #EAEAE8',
                    borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#1C1917',
                    fontFamily: "'Geist Mono', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#78716C', marginBottom: 4 }}>
                  Catatan Perkembangan
                </label>
                <textarea
                  rows="2"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Tambah rincian catatan..."
                  style={{
                    width: '100%', background: '#F7F7F5', border: '1px solid #EAEAE8',
                    borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#1C1917'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, background: '#F5F5F4',
                    border: '1px solid #E7E5E4', color: '#57534E', fontSize: 12, cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '6px 14px', borderRadius: 6, background: '#0F766E',
                    border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer'
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
