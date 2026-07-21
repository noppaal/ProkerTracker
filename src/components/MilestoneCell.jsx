import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { SBadge, DelayTag } from './UI/Badge';
import { STATUS_OPTIONS } from '../data/initialData';

export const MilestoneCell = ({
  milestoneData = {},
  milestoneMeta = {},
  onUpdateMilestone,
  role = 'KARYAWAN',
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

  // Permission Checks per Role:
  // - TB (Transfer Bisnis / Admin): Full status + dates + milestone notes
  // - IT: Status + dates + milestone notes ONLY for Development & Deployment milestones
  // - KARYAWAN: View status, dates & milestone notes (read-only)
  const isTB = role === 'TB' || role === 'ADMIN';
  const isIT = role === 'IT';

  const milestoneCode = (milestoneMeta.code || '').toUpperCase();
  const milestoneId = (milestoneMeta.id || '').toLowerCase();
  const milestoneName = (milestoneMeta.name || '').toLowerCase();

  const isDevOrDeploy = milestoneCode === 'DEV' || milestoneCode === 'DEPLOY' ||
    milestoneId.includes('dev') || milestoneId.includes('deploy') ||
    milestoneName.includes('dev') || milestoneName.includes('deploy');

  const canEditStatus = isTB || (isIT && isDevOrDeploy);
  const canEditNotes = canEditStatus; // Only roles with edit access to this milestone can edit its milestone notes!

  const handleSave = (e) => {
    e.preventDefault();
    if (!canEditStatus && !canEditNotes) return;

    onUpdateMilestone({
      status: canEditStatus ? formStatus : currentStatus,
      targetDate: canEditStatus ? formTargetDate : targetDate,
      target: canEditStatus ? formTargetDate : targetDate,
      actualDate: canEditStatus ? formActualDate : actualDate,
      actual: canEditStatus ? formActualDate : actualDate,
      notes: canEditNotes ? formNotes : notes
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
        title={hasAccess ? 'Klik untuk melihat rincian milestone' : ''}
      >
        <SBadge s={currentStatus} isEditable={hasAccess} />
        
        {targetDate && (
          <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
            {targetDate}
          </span>
        )}

        {notes && (
          <span style={{
            fontSize: 10, color: '#2563EB', background: '#EFF6FF',
            padding: '1px 5px', borderRadius: 4, display: 'inline-block',
            maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontWeight: 600
          }}>
            📝 {notes}
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
              <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>
                {canEditStatus ? 'Update Milestone' : 'Rincian Milestone (Read-Only)'}
              </span>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Status Select Field */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                    Status Milestone
                  </label>
                  {!canEditStatus && (
                    <span style={{ fontSize: 10, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Lock size={10} /> {isIT ? 'Hanya Dev/Deploy' : 'Hanya TB/IT'}
                    </span>
                  )}
                </div>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  disabled={!canEditStatus}
                  style={{
                    width: '100%',
                    background: canEditStatus ? '#F8FAFC' : '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13,
                    color: canEditStatus ? '#0F172A' : '#64748B', fontWeight: 500,
                    cursor: canEditStatus ? 'pointer' : 'not-allowed'
                  }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Target Date */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Target Date (Rencana)
                </label>
                <input
                  type="date"
                  value={formTargetDate}
                  onChange={(e) => setFormTargetDate(e.target.value)}
                  disabled={!canEditStatus}
                  style={{
                    width: '100%',
                    background: canEditStatus ? '#F8FAFC' : '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13,
                    color: canEditStatus ? '#0F172A' : '#64748B',
                    fontFamily: "'Geist Mono', monospace",
                    cursor: canEditStatus ? 'text' : 'not-allowed'
                  }}
                />
              </div>

              {/* Actual Date */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
                  Actual Date (Selesai Real)
                </label>
                <input
                  type="date"
                  value={formActualDate}
                  onChange={(e) => setFormActualDate(e.target.value)}
                  disabled={!canEditStatus}
                  style={{
                    width: '100%',
                    background: canEditStatus ? '#F8FAFC' : '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13,
                    color: canEditStatus ? '#0F172A' : '#64748B',
                    fontFamily: "'Geist Mono', monospace",
                    cursor: canEditStatus ? 'text' : 'not-allowed'
                  }}
                />
              </div>

              {/* Catatan Milestone - Restricted to users with edit access on this milestone */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                    Catatan Milestone
                  </label>
                  {!canEditNotes && (
                    <span style={{ fontSize: 10, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Lock size={10} /> Hanya yang punya akses ubah milestone
                    </span>
                  )}
                </div>
                <textarea
                  rows="3"
                  value={canEditNotes ? formNotes : (notes || '-')}
                  onChange={(e) => setFormNotes(e.target.value)}
                  disabled={!canEditNotes}
                  placeholder={canEditNotes ? 'Tulis rincian catatan milestone...' : 'Tidak ada akses untuk mengubah catatan milestone'}
                  style={{
                    width: '100%',
                    background: canEditNotes ? '#FFFFFF' : '#F1F5F9',
                    border: canEditNotes ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    borderRadius: 8, padding: '8px 12px', fontSize: 13,
                    color: canEditNotes ? '#0F172A' : '#64748B',
                    cursor: canEditNotes ? 'text' : 'not-allowed'
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
                  {canEditNotes ? 'Batal' : 'Tutup'}
                </button>
                {canEditNotes && (
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px', borderRadius: 8, background: '#2563EB',
                      border: 'none', color: '#FFFFFF', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    Simpan Perubahan
                  </button>
                )}
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
