import React from 'react';
import { 
  LayoutDashboard, 
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
  const isAdmin = role === 'ADMIN';

  return (
    <aside style={{
      width: sidebarOpen ? 228 : 0,
      flexShrink: 0,
      background: '#F1F5F9', // Sleek distinct light slate-100 tone
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.22s ease',
      borderRight: '1px solid #E2E8F0',
    }}>
      <div style={{ width: 228, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* User row */}
        <div style={{ padding: '14px 12px 12px', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: isAdmin ? '#FEF3C7' : '#DBEAFE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: isAdmin ? '#92400E' : '#1E40AF',
              }}>
                {currentUser.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </div>
                <div style={{ marginTop: 2 }}>
                  <RoleBadge role={currentUser.role} />
                </div>
              </div>
              <button
                onClick={onToggleSidebar}
                style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                className="nav-item"
                title="Tutup Sidebar"
              >
                <Menu size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={onOpenAuthModal}
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: 6,
                  background: '#0F766E', color: '#fff', border: 'none',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <User size={13} />
                <span>Masuk Akun</span>
              </button>
              <button
                onClick={onToggleSidebar}
                style={{ padding: 4, borderRadius: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', marginLeft: 4 }}
                className="nav-item"
              >
                <Menu size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>

          {/* All projects / Overview */}
          <button
            onClick={() => onSelectProject('ALL')}
            className={`nav-item${activeProjectId === 'ALL' ? ' nav-item-active' : ''}`}
            style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 7, marginBottom: 2,
              background: activeProjectId === 'ALL' ? '#FFFFFF' : 'transparent',
              color: activeProjectId === 'ALL' ? '#0F172A' : '#475569',
              boxShadow: activeProjectId === 'ALL' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <LayoutDashboard size={14} style={{ flexShrink: 0, color: activeProjectId === 'ALL' ? '#0F766E' : '#64748B' }} />
            <span style={{ fontSize: 13, fontWeight: activeProjectId === 'ALL' ? 600 : 500, flex: 1 }}>Overview</span>
            <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 600 }}>
              {masterProkers.length}
            </span>
          </button>

          <div style={{ height: 1, background: '#CBD5E1', margin: '8px 4px' }} />

          {/* Projek list header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 6px' }}>
            <span style={{ fontSize: 10, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
              Projek ({projects.length})
            </span>
            {isAdmin && (
              <button
                onClick={onOpenAddProject}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: '#0F766E', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 2, padding: 0
                }}
                title="Buat Projek Baru"
              >
                <Plus size={11} /> Baru
              </button>
            )}
          </div>

          {/* Projek Items */}
          {projects.map(proj => {
            const prokerCount = masterProkers.filter(p => p.projectId === proj.id).length;
            const isSelected = activeProjectId === proj.id;

            return (
              <button
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`nav-item${isSelected ? ' nav-item-active' : ''}`}
                style={{
                  width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 7, marginBottom: 2,
                  background: isSelected ? '#FFFFFF' : 'transparent',
                  color: isSelected ? '#0F172A' : '#475569',
                  boxShadow: isSelected ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: proj.color || '#0F766E', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {proj.name}
                </span>
                <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'Geist Mono', monospace", fontWeight: 600 }}>
                  {prokerCount}
                </span>
              </button>
            );
          })}

          <div style={{ height: 1, background: '#CBD5E1', margin: '8px 4px' }} />

          {/* Status indicator */}
          <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: dataSource === 'google_sheets' ? '#10B981' : '#D97706',
              flexShrink: 0
            }} />
            <button
              onClick={onOpenAppsScriptConfig}
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                fontSize: 11, color: '#64748B', textAlign: 'left', fontWeight: 500
              }}
              title="Klik untuk konfigurasi Google Sheets API"
            >
              {dataSource === 'google_sheets' ? 'Google Sheets Live' : 'Mock Mode'}
            </button>
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 2 }}
              title="Sinkronkan Data"
            >
              <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
            </button>
          </div>

        </div>

        {/* Bottom Menu */}
        <div style={{ padding: '8px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <button
            onClick={onOpenPermissions}
            className="nav-item"
            style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 8px', borderRadius: 6, marginBottom: 1,
              background: 'transparent', color: '#64748B',
            }}
          >
            <Sliders size={13} style={{ opacity: 0.8 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Hak Akses (RBAC)</span>
          </button>

          <button
            onClick={onOpenAppsScriptConfig}
            className="nav-item"
            style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 8px', borderRadius: 6, marginBottom: 1,
              background: 'transparent', color: '#64748B',
            }}
          >
            <Settings size={13} style={{ opacity: 0.8 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Pengaturan API</span>
          </button>

          {currentUser ? (
            <button
              onClick={onLogout}
              className="nav-item"
              style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 8px', borderRadius: 6,
                background: 'transparent', color: '#DC2626',
              }}
            >
              <LogOut size={13} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Keluar</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="nav-item"
              style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 8px', borderRadius: 6,
                background: 'transparent', color: '#0F766E',
              }}
            >
              <User size={13} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Login</span>
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
