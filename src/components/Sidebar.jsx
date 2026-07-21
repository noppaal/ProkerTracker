import React from 'react';
import { 
  LayoutGrid, 
  Settings, 
  LogOut, 
  Menu, 
  RefreshCw, 
  Plus, 
  User, 
  Sliders
} from 'lucide-react';
import { RoleBadge } from './UI/Badge';

export const Sidebar = ({
  sidebarOpen = true,
  onToggleSidebar,
  projects = [],
  activeProjectId = 'ALL',
  onSelectProject,
  onOpenAddProject,
  currentUser,
  onOpenAuthModal,
  onLogout,
  role,
  onOpenAppsScriptConfig,
  onOpenPermissions,
  masterProkers = [],
  dataSource,
  onManualSync,
  isSyncing
}) => {
  const isAdmin = role === 'TB' || role === 'ADMIN';

  return (
    <aside style={{
      width: sidebarOpen ? 230 : 0,
      flexShrink: 0,
      background: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.22s ease',
      borderRight: '1px solid #E2E8F0',
    }}>
      <div style={{ width: 230, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* User Account Info Bar at Top of Sidebar */}
        <div style={{ padding: '16px 14px 14px', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: isAdmin ? '#FEF3C7' : '#DBEAFE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: isAdmin ? '#92400E' : '#1E40AF',
              }}>
                {currentUser.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </div>
                <div style={{ marginTop: 3 }}>
                  <RoleBadge role={currentUser.role} />
                </div>
              </div>
              <button
                onClick={onToggleSidebar}
                style={{ padding: 4, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                title="Tutup Sidebar"
              >
                <Menu size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={onOpenAuthModal}
                style={{
                  flex: 1, padding: '7px 12px', borderRadius: 8,
                  background: '#2563EB', color: '#fff', border: 'none',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <User size={14} />
                <span>Masuk Akun</span>
              </button>
              <button
                onClick={onToggleSidebar}
                style={{ padding: 4, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', marginLeft: 4 }}
              >
                <Menu size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>

          {/* Overview Navigation Item (Replaced Projects, removed dummy items) */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => onSelectProject('ALL')}
              style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8,
                background: activeProjectId === 'ALL' ? '#2563EB' : 'transparent',
                color: activeProjectId === 'ALL' ? '#FFFFFF' : '#475569',
                fontWeight: activeProjectId === 'ALL' ? 700 : 500,
                fontSize: 13,
                boxShadow: activeProjectId === 'ALL' ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <LayoutGrid size={16} color={activeProjectId === 'ALL' ? '#FFFFFF' : '#64748B'} />
              <span style={{ flex: 1 }}>Overview</span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: activeProjectId === 'ALL' ? '#FFFFFF' : '#64748B',
                background: activeProjectId === 'ALL' ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                padding: '1px 7px', borderRadius: 99
              }}>
                {masterProkers.length}
              </span>
            </button>
          </div>

          <div style={{ height: 1, background: '#E2E8F0', margin: '8px 4px 14px' }} />

          {/* Individual Projects List Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px' }}>
            <span style={{ fontSize: 11, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
              Daftar Projek ({projects.length})
            </span>
            {isAdmin && (
              <button
                onClick={onOpenAddProject}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: '#2563EB', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 3, padding: 0
                }}
                title="Buat Projek Baru"
              >
                <Plus size={12} /> Baru
              </button>
            )}
          </div>

          {/* Projek Sub-items */}
          {projects.map(proj => {
            const prokerCount = masterProkers.filter(p => p.projectId === proj.id).length;
            const isSelected = activeProjectId === proj.id;

            return (
              <button
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                style={{
                  width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px', borderRadius: 7, marginBottom: 3,
                  background: isSelected ? '#FFFFFF' : 'transparent',
                  color: isSelected ? '#0F172A' : '#475569',
                  border: isSelected ? '1px solid #E2E8F0' : '1px solid transparent',
                  boxShadow: isSelected ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: proj.color || '#2563EB', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {proj.name}
                </span>
                <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 600 }}>
                  {prokerCount}
                </span>
              </button>
            );
          })}

          <div style={{ height: 1, background: '#E2E8F0', margin: '14px 4px 8px' }} />

          {/* Sync Status indicator */}
          <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: dataSource === 'google_sheets' ? '#16A34A' : '#D97706',
              flexShrink: 0
            }} />
            <button
              onClick={onOpenAppsScriptConfig}
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                fontSize: 11, color: '#64748B', textAlign: 'left', fontWeight: 600
              }}
              title="Klik untuk konfigurasi Google Sheets API"
            >
              {dataSource === 'google_sheets' ? 'Google Sheets Live' : 'Mock Data Mode'}
            </button>
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 2 }}
              title="Sinkronkan Data"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            </button>
          </div>

        </div>

        {/* Bottom Menu Actions */}
        <div style={{ padding: '10px', borderTop: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <button
            onClick={onOpenPermissions}
            style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 9px', borderRadius: 7, marginBottom: 2,
              background: 'transparent', color: '#475569',
            }}
          >
            <Sliders size={14} style={{ opacity: 0.8 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Hak Akses (RBAC)</span>
          </button>

          <button
            onClick={onOpenAppsScriptConfig}
            style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 9px', borderRadius: 7, marginBottom: 2,
              background: 'transparent', color: '#475569',
            }}
          >
            <Settings size={14} style={{ opacity: 0.8 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Pengaturan API</span>
          </button>

          {currentUser ? (
            <button
              onClick={onLogout}
              style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 9px', borderRadius: 7,
                background: 'transparent', color: '#DC2626',
              }}
            >
              <LogOut size={14} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Keluar</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 9px', borderRadius: 7,
                background: 'transparent', color: '#2563EB',
              }}
            >
              <User size={14} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Login</span>
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
