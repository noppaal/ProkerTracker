import React from 'react';
import { Clock } from 'lucide-react';
import { calculateDateDelay } from '../../services/apiService';

export function progressColor(pct) {
  if (pct < 35) return '#DC2626';
  if (pct < 70) return '#D97706';
  return '#059669';
}

export function Bar({ pct, h = 6 }) {
  return (
    <div style={{ height: h, background: '#E7E5E4', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: progressColor(pct),
        borderRadius: 99,
        transition: 'width 0.4s ease',
      }} />
    </div>
  );
}

export function PBadge({ p }) {
  const PRIORITY_MAP = {
    P1: { label: 'Urgent', bg: '#FEF2F2', text: '#B91C1C' },
    P2: { label: 'High',   bg: '#FFFBEB', text: '#92400E' },
    P3: { label: 'Medium', bg: '#F0FDF4', text: '#166534' },
    P4: { label: 'Low',    bg: '#F8FAFC', text: '#475569' },
  };

  const m = PRIORITY_MAP[p] || PRIORITY_MAP.P4;
  return (
    <span style={{
      background: m.bg, color: m.text,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
      fontFamily: "'Geist Mono', monospace",
    }}>
      {p} · {m.label}
    </span>
  );
}

export function SBadge({ s, onClick, isEditable }) {
  const STATUS_MAP = {
    'Done':                  { dot: '#10B981', bg: '#ECFDF5', text: '#065F46' },
    'In Progress':           { dot: '#0F766E', bg: '#F0FDFA', text: '#134E4A' },
    'Hold':                  { dot: '#D97706', bg: '#FFFBEB', text: '#92400E' },
    'Not Yet':               { dot: '#A8A29E', bg: '#F5F5F4', text: '#57534E' },
    'Tidak ada Link Terkait':{ dot: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9' },
    'Cancel':                { dot: '#DC2626', bg: '#FEF2F2', text: '#991B1B' },
  };

  const m = STATUS_MAP[s] || STATUS_MAP['Not Yet'];
  return (
    <span 
      onClick={isEditable ? onClick : undefined}
      style={{
        background: m.bg, color: m.text,
        fontSize: 11, fontWeight: 500,
        padding: '2px 8px', borderRadius: 4,
        display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
        cursor: isEditable ? 'pointer' : 'default'
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
      {s || 'Not Yet'}
    </span>
  );
}

export function DelayTag({ target, actual, status }) {
  if (!target) return null;

  const info = calculateDateDelay(target, actual);
  if (info.status === 'no_target') return null;

  let textColor = '#9CA3AF';
  if (info.status === 'ontime') textColor = '#059669';
  if (info.status === 'delayed' || info.status === 'overdue') textColor = '#DC2626';
  if (info.status === 'due_today') textColor = '#D97706';

  return (
    <span style={{ fontSize: 11, color: textColor, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <Clock size={10} /> {info.label}
    </span>
  );
}

export const RoleBadge = ({ role }) => {
  const isAdmin = role === 'ADMIN';
  return (
    <span style={{
      fontSize: 10, fontWeight: 700,
      background: isAdmin ? '#FEF3C7' : '#DBEAFE',
      color: isAdmin ? '#92400E' : '#1E40AF',
      padding: '1px 6px', borderRadius: 4,
      fontFamily: "'Geist Mono', monospace",
      letterSpacing: '0.04em'
    }}>
      {isAdmin ? 'ADMIN' : 'MEMBER'}
    </span>
  );
};

export const PriorityBadge = PBadge;
export const StatusBadge = SBadge;
export const ProgressBar = Bar;
