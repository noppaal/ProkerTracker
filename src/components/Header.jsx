import React from 'react';
import { Menu, ListTodo, AlertTriangle, TrendingUp, Users2 } from 'lucide-react';

export const Header = ({
  stats,
  activeProject,
  sidebarOpen,
  onToggleSidebar
}) => {
  return (
    <header style={{
      flexShrink: 0,
      background: '#fff',
      borderBottom: '1px solid #EAEAE8',
      padding: '14px 24px 0',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            style={{
              padding: '5px 6px', borderRadius: 6, border: 'none',
              background: 'transparent', cursor: 'pointer', color: '#9B9A97',
              display: 'flex', alignItems: 'center',
            }}
            className="nav-item"
            title="Buka Sidebar"
          >
            <Menu size={15} />
          </button>
        )}

        {activeProject ? (
          <>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: (activeProject.color || '#0F766E') + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: activeProject.color || '#0F766E', letterSpacing: 0.3,
            }}>
              {(activeProject.code || 'PRJ').slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1C1917' }}>
                  {activeProject.name}
                </h1>
                <span style={{
                  fontSize: 10, fontWeight: 500,
                  background: '#F0F0EE', color: '#9B9A97',
                  padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5,
                  fontFamily: "'Geist Mono', monospace",
                }}>
                  {activeProject.code}
                </span>
              </div>
              <p style={{ margin: '1px 0 0', fontSize: 12, color: '#B5B3AD' }}>{activeProject.description}</p>
            </div>
          </>
        ) : (
          <div>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1C1917' }}>
              Overview Program Kerja
            </h1>
            <p style={{ margin: '1px 0 0', fontSize: 12, color: '#B5B3AD' }}>Monitoring seluruh program kerja organisasi</p>
          </div>
        )}
      </div>

      {/* KPI strip — inline, no dividers between, feels lighter */}
      <div style={{ display: 'flex', gap: 24, paddingBottom: 14, overflowX: 'auto' }}>
        {[
          { icon: <ListTodo size={13} />, label: 'Total Proker', value: stats.totalProker, color: '#0F766E' },
          { icon: <AlertTriangle size={13} />, label: 'Urgent', value: stats.p1Count, color: '#DC2626' },
          { icon: <TrendingUp size={13} />, label: 'Rata-rata Selesai', value: `${stats.overallProgress}%`, color: '#D97706' },
          { icon: <Users2 size={13} />, label: 'Sub-Program', value: stats.totalSubItems, color: '#7C3AED' },
        ].map((k, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <span style={{ color: k.color }}>{k.icon}</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1C1917', fontFamily: "'Geist Mono', monospace" }}>{k.value}</span>
            <span style={{ fontSize: 12, color: '#B5B3AD' }}>{k.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
};
