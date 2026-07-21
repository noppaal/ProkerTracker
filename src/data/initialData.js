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
  { value: 'P2', label: 'P2 - High', color: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold', rank: 2 },
  { value: 'P3', label: 'P3 - Medium', color: 'bg-blue-100 text-blue-800 border-blue-300 font-medium', rank: 3 },
  { value: 'P4', label: 'P4 - Low', color: 'bg-slate-100 text-slate-700 border-slate-300 font-medium', rank: 4 }
];

// Pre-seeded demo user accounts with simplified ADMIN / MEMBER roles
export const INITIAL_USERS = [
  {
    id: 'usr-admin',
    name: 'Budi Santoso (Admin)',
    email: 'admin@company.com',
    password: '123',
    role: 'ADMIN'
  },
  {
    id: 'usr-member',
    name: 'Siti Rahma (Member)',
    email: 'staff@company.com',
    password: '123',
    role: 'MEMBER'
  }
];

// Initial Projects
export const INITIAL_PROJECTS = [
  {
    id: 'proj-001',
    code: 'PRJ-01',
    name: 'Transformasi Digital Core Banking 2026',
    description: 'Inisiatif strategis modernisasi portal perbankan dan e-channel.',
    color: '#2563eb'
  },
  {
    id: 'proj-002',
    code: 'PRJ-02',
    name: 'Otomasi Credit Scoring & AI Risk Engine',
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
    subItems: [
      {
        id: 'sub-101',
        name: 'Integrasi SDK Biometric Fingerprint & Face Auth',
        priority: 'P1',
        specNotes: 'Kebutuhan standar ISO-27001 dan encrypt token SHA-256.',
        techNotes: 'Integrasi SDK fingerprint selesai diproses.',
        relatedLink: 'https://axure.com/proto/biometric-auth',
        milestones: {
          m_ureq: { status: 'Done', targetDate: '2026-06-01', actualDate: '2026-05-30' },
          m_mockup: { status: 'Done', targetDate: '2026-06-15', actualDate: '2026-06-14' },
          m_dev: { status: 'Done', targetDate: '2026-07-10', actualDate: '2026-07-09' },
          m_testing: { status: 'In Progress', targetDate: '2026-07-25', actualDate: '' },
          m_deploy: { status: 'Not Yet', targetDate: '2026-08-05', actualDate: '' }
        }
      }
    ]
  },
  {
    id: 'prk-002',
    projectId: 'proj-002',
    code: 'PRK-002',
    name: 'Connector Database OJK SLIK & E-Meterai',
    priority: 'P2',
    relatedLink: 'https://drive.google.com/file/spec-slik',
    description: 'Penarikan riwayat kredit nasabah via API OJK.',
    subItems: [
      {
        id: 'sub-201',
        name: 'Auto-fetching SLIK Gateway API',
        priority: 'P2',
        specNotes: 'Auto fetch data OJK SLIK via REST API gateway.',
        techNotes: 'Rate limit queue 100 req/min.',
        relatedLink: 'https://drive.google.com/file/api-doc-slik',
        milestones: {
          m_ureq: { status: 'Done', targetDate: '2026-06-10', actualDate: '2026-06-10' },
          m_mockup: { status: 'Tidak ada Link Terkait', targetDate: '2026-06-15', actualDate: '2026-06-15' },
          m_dev: { status: 'In Progress', targetDate: '2026-07-28', actualDate: '' },
          m_testing: { status: 'Not Yet', targetDate: '2026-08-12', actualDate: '' },
          m_deploy: { status: 'Not Yet', targetDate: '2026-08-25', actualDate: '' }
        }
      }
    ]
  }
];
