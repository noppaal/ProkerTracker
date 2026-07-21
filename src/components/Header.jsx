import React from 'react';
import { 
  Search, 
  Settings, 
  Plus, 
  BarChart3, 
  RefreshCw, 
  CheckCircle2, 
  Download, 
  Menu,
  TrendingUp,
  User
} from 'lucide-react';

export const Header = ({
  stats = { totalProker: 24, p1Count: 5, totalSubItems: 12, overallProgress: 75 },
  activeProject = null,
  sidebarOpen = true,
  onToggleSidebar,
  onOpenAddProker,
  onOpenAddProject,
  onExportData,
  searchQuery = '',
  setSearchQuery = () => {},
  currentUser = null,
  onOpenConfig = () => {}
}) => {
  return (
    <header style={{ flexShrink: 0, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      
      {/* 1. Top Global Navigation Bar (Brand, Search, Global Actions) */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 28px', borderBottom: '1px solid #F1F5F9'
      }}>
        
        {/* Left: Sidebar Toggle + Brand Logo + Nav Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              style={{
                padding: '6px 8px', borderRadius: 8, border: '1px solid #E2E8F0',
                background: '#F8FAFC', cursor: 'pointer', color: '#64748B',
                display: 'flex', alignItems: 'center'
              }}
              title="Buka Sidebar"
            >
              <Menu size={16} />
            </button>
          )}

          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
              WorkFlow
            </span>
          </div>

          {/* Nav Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 8 }}>
            <button style={{
              background: 'none', border: 'none', padding: '8px 0',
              fontSize: 14, fontWeight: 700, color: '#0F172A', cursor: 'pointer',
              borderBottom: '2px solid #2563EB', display: 'flex', alignItems: 'center', gap: 6
            }}>
              Dashboard
            </button>
            <button style={{
              background: 'none', border: 'none', padding: '8px 0',
              fontSize: 14, fontWeight: 500, color: '#64748B', cursor: 'pointer',
              borderBottom: '2px solid transparent'
            }}>
              Team
            </button>
          </nav>
        </div>

        {/* Right: Search + New Project CTA + Settings + User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          
          {/* Global Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10,
            padding: '7px 14px', width: 220
          }}>
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              style={{
                border: 'none', background: 'none', outline: 'none',
                fontSize: 13, color: '#0F172A', width: '100%'
              }}
            />
          </div>

          {/* New Project Button */}
          {onOpenAddProject && (
            <button
              onClick={onOpenAddProject}
              style={{
                background: '#0F172A', color: '#FFFFFF', border: 'none',
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.1)'
              }}
            >
              <span>New Project</span>
            </button>
          )}

          {/* Settings Icon */}
          <button
            onClick={onOpenConfig}
            style={{
              padding: 8, background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748B', borderRadius: 8, display: 'flex', alignItems: 'center'
            }}
            title="Pengaturan"
          >
            <Settings size={18} />
          </button>

          {/* User Profile Avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: '#0F172A',
            color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, border: '2px solid #E2E8F0', flexShrink: 0
          }}>
            {currentUser ? currentUser.name.charAt(0) : 'U'}
          </div>

        </div>
      </div>

      {/* 2. Main Page Header & CTA Buttons */}
      <div style={{ padding: '24px 28px 20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{
              margin: 0, fontSize: 30, fontWeight: 800, color: '#0F172A',
              letterSpacing: '-0.02em', lineHeight: 1.2
            }}>
              {activeProject ? activeProject.name : 'Work Program Tracker'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#64748B', fontWeight: 400 }}>
              {activeProject ? activeProject.description : 'Monitoring and managing active strategic initiatives.'}
            </p>
          </div>

          {/* Top Right Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onExportData}
              style={{
                background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#0F172A',
                padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Download size={14} />
              <span>Export Data</span>
            </button>

            {onOpenAddProker && (
              <button
                onClick={onOpenAddProker}
                style={{
                  background: '#000000', color: '#FFFFFF', border: 'none',
                  padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                }}
              >
                <Plus size={15} />
                <span>Tambah Program Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Summary Metric Cards Row (3 Cards Grid matching screenshot) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          
          {/* Card 1: TOTAL PROGRAM */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14,
            padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                TOTAL PROGRAM
              </span>
              <div style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid #DBEAFE',
                background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <BarChart3 size={15} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stats.totalProker || 24}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#2563EB',
                display: 'inline-flex', alignItems: 'center', gap: 3
              }}>
                <TrendingUp size={13} /> +12%
              </span>
            </div>
          </div>

          {/* Card 2: SEDANG BERJALAN */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14,
            padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                SEDANG BERJALAN
              </span>
              <div style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid #FEF3C7',
                background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <RefreshCw size={15} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stats.inProgressCount || Math.round((stats.totalProker || 24) * 0.6)}
              </span>
              <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                Programs active
              </span>
            </div>
          </div>

          {/* Card 3: SELESAI */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14,
            padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                SELESAI
              </span>
              <div style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid #DCFCE7',
                background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CheckCircle2 size={15} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stats.completedCount || Math.round((stats.totalProker || 24) * 0.4)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#16A34A' }}>
                Goal Reached
              </span>
            </div>
          </div>

        </div>

      </div>

    </header>
  );
};
