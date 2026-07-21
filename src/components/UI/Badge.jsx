import React from 'react';
import { Clock } from 'lucide-react';
import { calculateDateDelay } from '../../services/apiService';

export function progressColor(pct) {
  if (pct >= 100) return '#16A34A'; // Sleek Emerald Green for 100%
  if (pct < 35) return '#2563EB'; // Royal Blue for primary theme progress
  if (pct < 70) return '#2563EB';
  return '#2563EB';
}

export function Bar({ pct, h = 6 }) {
  const safePct = Math.min(100, Math.max(0, pct || 0));
  return (
    <div style={{ height: h, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
      <div style={{
        height: '100%', width: `${safePct}%`,
        background: progressColor(safePct),
        borderRadius: 99,
        transition: 'width 0.4s ease',
      }} />
    </div>
  );
}

export function PBadge({ p }) {
  const PRIORITY_MAP = {
    P1: { label: 'URGENT', bg: '#FEE2E2', text: '#DC2626', dot: '#DC2626' },
    P2: { label: 'TINGGI', bg: '#FFEDD5', text: '#C2410C', dot: '#EA580C' },
    P3: { label: 'SEDANG', bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
    P4: { label: 'RENDAH', bg: '#DBEAFE', text: '#2563EB', dot: '#2563EB' },

    // Fallbacks for string names
    URGENT: { label: 'URGENT', bg: '#FEE2E2', text: '#DC2626', dot: '#DC2626' },
    Urgent: { label: 'URGENT', bg: '#FEE2E2', text: '#DC2626', dot: '#DC2626' },
    TINGGI: { label: 'TINGGI', bg: '#FFEDD5', text: '#C2410C', dot: '#EA580C' },
    Tinggi: { label: 'TINGGI', bg: '#FFEDD5', text: '#C2410C', dot: '#EA580C' },
    SEDANG: { label: 'SEDANG', bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
    Sedang: { label: 'SEDANG', bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
    RENDAH: { label: 'RENDAH', bg: '#DBEAFE', text: '#2563EB', dot: '#2563EB' },
    Rendah: { label: 'RENDAH', bg: '#DBEAFE', text: '#2563EB', dot: '#2563EB' },
  };

  const key = p ? String(p).trim() : 'P4';
  const m = PRIORITY_MAP[key] || PRIORITY_MAP[key.toUpperCase()] || PRIORITY_MAP.P4;

  return (
    <span style={{
      background: m.bg, color: m.text,
      fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
      padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      textTransform: 'uppercase'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  );
}

export function SBadge({ s, onClick, isEditable }) {
  const STATUS_MAP = {
    'Done':                  { dot: '#16A34A', bg: '#DCFCE7', text: '#15803D' },
    'In Progress':           { dot: '#2563EB', bg: '#DBEAFE', text: '#1D4ED8' },
    'Hold':                  { dot: '#D97706', bg: '#FEF3C7', text: '#B45309' },
    'Not Yet':               { dot: '#64748B', bg: '#F1F5F9', text: '#475569' },
    'Tidak ada Link Terkait':{ dot: '#7C3AED', bg: '#F3E8FF', text: '#6B21A8' },
    'Cancel':                { dot: '#DC2626', bg: '#FEE2E2', text: '#B91C1C' },
  };

  const m = STATUS_MAP[s] || STATUS_MAP['Not Yet'];
  return (
    <span 
      onClick={isEditable ? onClick : undefined}
      style={{
        background: m.bg, color: m.text,
        fontSize: 11, fontWeight: 600,
        padding: '3px 10px', borderRadius: 99,
        display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
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

  let textColor = '#64748B';
  if (info.status === 'ontime') textColor = '#16A34A';
  if (info.status === 'delayed' || info.status === 'overdue') textColor = '#DC2626';
  if (info.status === 'due_today') textColor = '#D97706';

  return (
    <span style={{ fontSize: 11, color: textColor, display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 500 }}>
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
      color: isAdmin ? '#D97706' : '#2563EB',
      padding: '2px 7px', borderRadius: 99,
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
