export const INITIAL_DYNAMIC_MILESTONES = [
  { id: 'm_ureq', name: 'Status Ureq', code: 'UREQ' },
  { id: 'm_mockup', name: 'Status Mockup', code: 'MOCKUP' },
  { id: 'm_dev', name: 'Status Development', code: 'DEV' },
  { id: 'm_testing', name: 'Status Testing', code: 'TEST' },
  { id: 'm_deploy', name: 'Status Deployment', code: 'DEPLOY' }
];

export const STATUS_OPTIONS = [
  { value: 'Done', label: 'Done', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'In Progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'Hold', label: 'Hold', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'Not Yet', label: 'Not Yet', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'Tidak ada Link Terkait', label: 'Tidak ada Link Terkait', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'Cancel', label: 'Cancel', color: 'bg-rose-100 text-rose-800 border-rose-300' }
];

export const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 - Urgent', color: 'bg-rose-100 text-rose-800 border-rose-300 font-bold', rank: 1 },
  { value: 'P2', label: 'P2 - Tinggi', color: 'bg-orange-100 text-orange-800 border-orange-300 font-semibold', rank: 2 },
  { value: 'P3', label: 'P3 - Sedang', color: 'bg-amber-100 text-amber-800 border-amber-300 font-medium', rank: 3 },
  { value: 'P4', label: 'P4 - Rendah', color: 'bg-blue-100 text-blue-800 border-blue-300 font-medium', rank: 4 }
];

// Pre-seeded demo user accounts with the single initial Admin account
export const INITIAL_USERS = [
  {
    id: 'usr-admin',
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'superadmin321@',
    role: 'ADMIN'
  }
];

// Initial Projects
export const INITIAL_PROJECTS = [
  {
    id: 'proj-001',
    code: 'PRJ-01',
    name: 'Transformasi Digital Core Banking 2026',
    year: '2026',
    description: 'Inisiatif strategis modernisasi portal perbankan dan e-channel.',
    color: '#2563eb'
  },
  {
    id: 'proj-002',
    code: 'PRJ-02',
    name: 'Otomasi Credit Scoring & AI Risk Engine',
    year: '2026',
    description: 'Implementasi Machine Learning untuk persetujuan kredit otomatis.',
    color: '#7c3aed'
  }
];

// Initial Master Prokers
export const INITIAL_MASTER_PROKER = [
  {
    id: 'prk-001',
    projectId: 'proj-001',
    code: 'PRK-001',
    name: 'Revamp Modul E-Channel & Security MFA',
    priority: 'P1',
    relatedLink: 'https://figma.com/file/core-banking-v2',
    description: 'Peningkatan keamanan transaksi nasabah berbasis biometric.',
    specNotes: 'Kebutuhan standar ISO-27001 dan encrypt token SHA-256.',
    techNotes: 'Integrasi SDK fingerprint selesai diproses.',
    milestones: {
      m_ureq: { status: 'Done', targetDate: '2026-06-01', actualDate: '2026-05-30', notes: 'Persetujuan syarat fitur Ureq selesai.' },
      m_mockup: { status: 'Done', targetDate: '2026-06-15', actualDate: '2026-06-14', notes: 'Desain UX disetujui tim bisnis.' },
      m_dev: { status: 'Done', targetDate: '2026-07-10', actualDate: '2026-07-09', notes: 'Service API Auth biometric rilis stg.' },
      m_testing: { status: 'In Progress', targetDate: '2026-07-25', actualDate: '', notes: 'Pengujian regression test.' },
      m_deploy: { status: 'Not Yet', targetDate: '2026-08-05', actualDate: '', notes: '' }
    }
  },
  {
    id: 'prk-002',
    projectId: 'proj-002',
    code: 'PRK-002',
    name: 'Connector Database OJK SLIK & E-Meterai',
    priority: 'P2',
    relatedLink: 'https://drive.google.com/file/spec-slik',
    description: 'Penarikan riwayat kredit nasabah via API OJK.',
    specNotes: 'Auto fetch data OJK SLIK via REST API gateway.',
    techNotes: 'Rate limit queue 100 req/min.',
    milestones: {
      m_ureq: { status: 'Done', targetDate: '2026-06-10', actualDate: '2026-06-10', notes: 'Format payload disetujui OJK.' },
      m_mockup: { status: 'Tidak ada Link Terkait', targetDate: '2026-06-15', actualDate: '2026-06-15', notes: 'N/A' },
      m_dev: { status: 'In Progress', targetDate: '2026-07-28', actualDate: '', notes: 'Integrasi SSL Certificate.' },
      m_testing: { status: 'Not Yet', targetDate: '2026-08-12', actualDate: '', notes: '' },
      m_deploy: { status: 'Not Yet', targetDate: '2026-08-25', actualDate: '', notes: '' }
    }
  }
];

