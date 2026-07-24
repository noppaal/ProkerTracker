import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { ProjectsOverview } from './components/ProjectsOverview';
import { MasterProkerTable } from './components/MasterProkerTable';
import { ProjectTimeline } from './components/ProjectTimeline';
import { ProkerModal } from './components/Modals/ProkerModal';
import { ProjectModal } from './components/Modals/ProjectModal';
import { DynamicMilestoneModal } from './components/Modals/DynamicMilestoneModal';
import { AppsScriptConfigModal } from './components/Modals/AppsScriptConfigModal';
import { PermissionsModal } from './components/Modals/PermissionsModal';
import { AuthModal } from './components/Auth/AuthModal';
import { ChangePasswordModal } from './components/Auth/ChangePasswordModal';
import { UserManagementPanel } from './components/Auth/UserManagementPanel';
import { 
  BarChart3, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Plus,
  Menu
} from 'lucide-react';

import {
  INITIAL_MASTER_PROKER,
  INITIAL_PROJECTS,
  INITIAL_USERS,
  INITIAL_DYNAMIC_MILESTONES
} from './data/initialData';

import {
  fetchProkerData,
  saveProkerData,
  calculateMasterProkerProgress,
  getSavedEndpoint,
  getUserSession,
  saveUserSession
} from './services/apiService';

export default function App() {
  // Sidebar Open/Close Toggle State
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auth User Session State
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const role = currentUser ? currentUser.role : 'MEMBER';

  // Hierarchy Data States
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState('ALL');
  const [masterProkers, setMasterProkers] = useState(INITIAL_MASTER_PROKER);
  const [dynamicMilestones, setDynamicMilestones] = useState(INITIAL_DYNAMIC_MILESTONES);
  
  // Storage & Endpoint State
  const [dataSource, setDataSource] = useState('initial');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Accordions & Filtering States
  const [expandedRowIds, setExpandedRowIds] = useState({});
  const [expandedMilestoneIds, setExpandedMilestoneIds] = useState({});
  const [isExpandAll, setIsExpandAll] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isProkerModalOpen, setIsProkerModalOpen] = useState(false);
  const [editingProker, setEditingProker] = useState(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Load Session & Initial Data on Mount
  useEffect(() => {
    const savedUser = getUserSession();
    if (savedUser && 
        savedUser.email !== 'admin@company.com' && 
        savedUser.email !== 'it@company.com' && 
        savedUser.email !== 'staff@company.com') {
      setCurrentUser(savedUser);
    } else {
      // Land on dashboard as guest (null)
      setCurrentUser(null);
    }

    const savedUrl = getSavedEndpoint();
    setEndpointUrl(savedUrl);

    const initData = async () => {
      setIsSyncing(true);
      const { data, source } = await fetchProkerData(savedUrl);
      
      if (data) {
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.masterProkers) setMasterProkers(data.masterProkers);
        if (data.dynamicMilestones) setDynamicMilestones(data.dynamicMilestones);
        
        let loadedUsers = data.users || [];
        // Filter out old demo accounts
        loadedUsers = loadedUsers.filter(u => 
          u.email.toLowerCase() !== 'admin@company.com' &&
          u.email.toLowerCase() !== 'it@company.com' &&
          u.email.toLowerCase() !== 'staff@company.com'
        );
        // Ensure new admin is present
        const hasAdmin = loadedUsers.some(u => u.email.toLowerCase() === 'admin@gmail.com');
        if (!hasAdmin) {
          loadedUsers = [INITIAL_USERS[0], ...loadedUsers];
        }
        setUsers(loadedUsers);
        setDataSource(source);
      } else {
        setProjects(INITIAL_PROJECTS);
        setMasterProkers(INITIAL_MASTER_PROKER);
        setDynamicMilestones(INITIAL_DYNAMIC_MILESTONES);
        setUsers(INITIAL_USERS);
        setDataSource(source === 'google_sheets' ? 'google_sheets' : 'initial');
      }

      setIsSyncing(false);
    };

    initData();
  }, []);

  // Save state updates
  const handleSaveDataState = async (updatedProjects, updatedProkers, updatedMilestones, updatedUsers) => {
    const prj = updatedProjects || projects;
    const prk = updatedProkers || masterProkers;
    const mls = updatedMilestones || dynamicMilestones;
    const usr = updatedUsers || users;

    setIsSyncing(true);
    const res = await saveProkerData(
      { projects: prj, masterProkers: prk, dynamicMilestones: mls, users: usr },
      endpointUrl
    );
    if (res.source === 'google_sheets') {
      setDataSource('google_sheets');
    }
    setIsSyncing(false);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    saveUserSession(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveUserSession(null);
  };

  const handleRegisterUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    handleSaveDataState(projects, masterProkers, dynamicMilestones, updatedUsers);
  };

  const handleUpdateUserList = (updatedUsers) => {
    setUsers(updatedUsers);
    handleSaveDataState(projects, masterProkers, dynamicMilestones, updatedUsers);
    if (currentUser) {
      const match = updatedUsers.find(u => u.id === currentUser.id);
      if (match) {
        setCurrentUser(match);
        saveUserSession(match);
      }
    }
  };

  // Project CRUD (Admin)
  const handleSaveProject = (projectData) => {
    let updated;
    if (editingProject) {
      updated = projects.map(p => p.id === projectData.id ? projectData : p);
    } else {
      updated = [projectData, ...projects];
      setActiveProjectId(projectData.id);
    }
    setProjects(updated);
    handleSaveDataState(updated, masterProkers, dynamicMilestones, users);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus Projek ini beserta seluruh Proker di dalamnya?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      const updatedProkers = masterProkers.filter(p => p.projectId !== projectId);
      setProjects(updatedProjects);
      setMasterProkers(updatedProkers);
      if (activeProjectId === projectId) setActiveProjectId('ALL');
      handleSaveDataState(updatedProjects, updatedProkers, dynamicMilestones, users);
    }
  };

  // Accordion Handlers
  const handleToggleRow = (prokerId) => {
    setExpandedRowIds(prev => ({ ...prev, [prokerId]: !prev[prokerId] }));
  };

  const handleToggleExpandAll = () => {
    const nextState = !isExpandAll;
    setIsExpandAll(nextState);
    const newExpanded = {};
    if (nextState) {
      masterProkers.forEach(p => {
        newExpanded[p.id] = true;
      });
    }
    setExpandedRowIds(newExpanded);
  };

  const handleToggleMilestoneColumn = (milestoneId) => {
    setExpandedMilestoneIds(prev => ({ ...prev, [milestoneId]: !prev[milestoneId] }));
  };

  // Master Proker CRUD
  const handleSaveMasterProker = (formData) => {
    let updated;
    if (editingProker) {
      updated = masterProkers.map(p => p.id === formData.id ? { ...p, ...formData } : p);
    } else {
      const newProker = {
        ...formData,
        id: `prk-${Date.now()}`
      };
      updated = [newProker, ...masterProkers];
      setExpandedRowIds(prev => ({ ...prev, [newProker.id]: true }));
    }
    setMasterProkers(updated);
    handleSaveDataState(projects, updated, dynamicMilestones, users);
    setEditingProker(null);
  };

  const handleDeleteMasterProker = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus Program Kerja Utama ini beserta seluruh sub-programnya?')) {
      const updated = masterProkers.filter(p => p.id !== id);
      setMasterProkers(updated);
      handleSaveDataState(projects, updated, dynamicMilestones, users);
    }
  };

  // Master Proker Updates
  const handleUpdateMasterProker = (updatedProker) => {
    const updated = masterProkers.map(p => p.id === updatedProker.id ? updatedProker : p);
    setMasterProkers(updated);
    handleSaveDataState(projects, updated, dynamicMilestones, users);
  };

  // Dynamic Milestone CRUD Handlers
  const handleAddMilestoneColumn = (newMilestone) => {
    const updatedMilestones = [...dynamicMilestones, newMilestone];
    setDynamicMilestones(updatedMilestones);
    handleSaveDataState(projects, masterProkers, updatedMilestones, users);
  };

  const handleUpdateMilestoneColumn = (updatedMilestone) => {
    const updatedMilestones = dynamicMilestones.map(m =>
      m.id === updatedMilestone.id ? updatedMilestone : m
    );
    setDynamicMilestones(updatedMilestones);
    handleSaveDataState(projects, masterProkers, updatedMilestones, users);
  };

  const handleDeleteMilestoneColumn = (milestoneId) => {
    const updatedMilestones = dynamicMilestones.filter(m => m.id !== milestoneId);
    
    // Clean up milestone data from all prokers
    const updatedProkers = masterProkers.map(proker => {
      if (!proker.milestones || !proker.milestones[milestoneId]) return proker;
      const newMilestones = { ...proker.milestones };
      delete newMilestones[milestoneId];
      return { ...proker, milestones: newMilestones };
    });

    setDynamicMilestones(updatedMilestones);
    setMasterProkers(updatedProkers);
    handleSaveDataState(projects, updatedProkers, updatedMilestones, users);
  };

  // Sync Data Manually
  const handleManualSync = async () => {
    setIsSyncing(true);
    const { data, source } = await fetchProkerData(endpointUrl);
    if (data) {
      if (data.projects) setProjects(data.projects);
      if (data.masterProkers) setMasterProkers(data.masterProkers);
      if (data.dynamicMilestones) setDynamicMilestones(data.dynamicMilestones);
      if (data.users) setUsers(data.users);
      setDataSource(source);
    }
    setIsSyncing(false);
  };

  // Active Selected Project Object
  const activeProject = useMemo(() => {
    if (activeProjectId === 'ALL') return null;
    return projects.find(p => p.id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  // Master Prokers filtered by active Project
  const projectProkers = useMemo(() => {
    if (activeProjectId === 'ALL') return masterProkers;
    return masterProkers.filter(p => p.projectId === activeProjectId);
  }, [masterProkers, activeProjectId]);

  // Refined KPI Stats Calculation
  const stats = useMemo(() => {
    const totalProker = projectProkers.length;
    const p1Count = projectProkers.filter(p => p.priority === 'P1').length;
    
    let sumProgress = 0;
    let inProgressCount = 0;
    let completedCount = 0;

    projectProkers.forEach(p => {
      const prog = calculateMasterProkerProgress(p, dynamicMilestones);
      sumProgress += prog;
      if (prog === 100) {
        completedCount++;
      } else if (prog > 0) {
        inProgressCount++;
      }
    });

    const overallProgress = totalProker > 0 ? Math.round(sumProgress / totalProker) : 0;

    return { totalProker, p1Count, overallProgress, inProgressCount, completedCount };
  }, [projectProkers, dynamicMilestones]);

  // Filtered Master Prokers logic
  const filteredMasterProkers = useMemo(() => {
    return projectProkers.filter(p => {
      
      if (priorityFilter !== 'ALL') {
        if (p.priority !== priorityFilter) {
          return false;
        }
      }

      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const parentProject = projects.find(proj => proj.id === p.projectId);
        const matchProject = parentProject && (
          parentProject.name.toLowerCase().includes(query) || 
          (parentProject.code && parentProject.code.toLowerCase().includes(query))
        );
        const matchProker = p.name.toLowerCase().includes(query) || 
          (p.code && p.code.toLowerCase().includes(query)) || 
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.specNotes && p.specNotes.toLowerCase().includes(query)) ||
          (p.techNotes && p.techNotes.toLowerCase().includes(query));

        if (!matchProject && !matchProker) {
          return false;
        }
      }

      if (statusFilter !== 'ALL') {
        if (!p.milestones) return statusFilter === 'Not Yet';
        const hasMatchingStatus = Object.values(p.milestones).some(m => m && m.status === statusFilter);
        if (!hasMatchingStatus) return false;
      }

      return true;
    });
  }, [projectProkers, priorityFilter, searchQuery, statusFilter, projects]);

  // If logged in as ADMIN, show the simplified Admin Portal directly
  if (currentUser && currentUser.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col text-xs font-sans text-slate-800">
        {/* Simple Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              A
            </div>
            <div>
              <h1 className="font-bold text-sm">Portal Administrator</h1>
              <p className="text-[10px] text-slate-400">Pengelolaan Akun & Hak Akses Sistem</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-bold text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400">System Admin</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md shadow-rose-600/20"
            >
              Keluar (Logout)
            </button>
          </div>
        </header>

        {/* Embedded User Management Panel */}
        <main className="flex-1 p-8 bg-slate-950 overflow-y-auto flex justify-center">
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-6">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Registrasi Akun Pengguna Baru</h2>
              <p className="text-slate-500">Gunakan portal ini untuk membuat akun bagi peran Transformasi Bisnis (TB), IT, atau Karyawan.</p>
            </div>
            
            <UserManagementPanel 
              users={users}
              onRegisterUser={handleRegisterUser}
              onUpdateUserList={handleUpdateUserList}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>
      
      {/* Sidebar Navigation */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => setActiveProjectId(id)}
        onOpenAddProject={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        role={role}
        onOpenAppsScriptConfig={() => setIsConfigModalOpen(true)}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        masterProkers={masterProkers}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        dataSource={dataSource}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, background: '#F8FAFC' }}>
        
        {/* Main Body Workspace */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: '#F8FAFC' }}>
          
          {/* Main Title Section + Sidebar Toggle + Add Proker Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{
                    padding: '8px 10px', borderRadius: 8, border: '1px solid #E2E8F0',
                    background: '#FFFFFF', cursor: 'pointer', color: '#64748B',
                    display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  title="Buka Sidebar"
                >
                  <Menu size={18} />
                </button>
              )}

              <div>
                <h1 style={{
                  margin: 0, fontSize: 30, fontWeight: 800, color: '#0F172A',
                  letterSpacing: '-0.02em', lineHeight: 1.2
                }}>
                  {activeProject ? activeProject.name : 'Program Kerja Tracker'}
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748B', fontWeight: 400 }}>
                  {activeProject ? activeProject.description : 'Monitoring and managing active strategic initiatives.'}
                </p>
              </div>
            </div>

            
          </div>

          {/* 3 Summary KPI Metric Cards (Displayed ONLY in Overview Page) */}
          {activeProjectId === 'ALL' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
              
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
                    width: 30, height: 30, borderRadius: 8, border: '1px solid #DBEAFE',
                    background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <BarChart3 size={16} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {stats.totalProker}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#2563EB',
                    display: 'inline-flex', alignItems: 'center', gap: 3
                  }}>
                    <TrendingUp size={13} /> {stats.overallProgress}% Overall
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
                    width: 30, height: 30, borderRadius: 8, border: '1px solid #FEF3C7',
                    background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <RefreshCw size={16} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {stats.inProgressCount}
                  </span>
                  <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
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
                    width: 30, height: 30, borderRadius: 8, border: '1px solid #DCFCE7',
                    background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {stats.completedCount}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#16A34A' }}>
                    Goal Reached
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* Subprograms Timeline View in Project Pages */
            <ProjectTimeline
              activeProject={activeProject}
              masterProkers={filteredMasterProkers}
              dynamicMilestones={dynamicMilestones}
            />
          )}

          {/* Projects Overview Table (Displayed when "Overview" / ALL is selected) */}
          {activeProjectId === 'ALL' ? (
            <ProjectsOverview
              projects={projects}
              masterProkers={masterProkers}
              dynamicMilestones={dynamicMilestones}
              onSelectProject={(id) => setActiveProjectId(id)}
              onOpenAddProject={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              onEditProject={(proj) => {
                setEditingProject(proj);
                setIsProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              role={role}
            />
          ) : (
            <>
              {/* Master Proker Table */}
              <MasterProkerTable
                masterProkers={filteredMasterProkers}
                dynamicMilestones={dynamicMilestones}
                onEditMasterProker={(proker) => {
                  setEditingProker(proker);
                  setIsProkerModalOpen(true);
                }}
                onDeleteMasterProker={handleDeleteMasterProker}
                onUpdateMasterProker={handleUpdateMasterProker}
                role={role}
                onOpenAddProker={() => {
                  setEditingProker(null);
                  setIsProkerModalOpen(true);
                }}
                projects={projects}
                activeProjectId={activeProjectId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </>
          )}

        </div>

      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        users={users}
        onRegisterUser={handleRegisterUser}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSaveProject={handleSaveProject}
        editingProject={editingProject}
        projects={projects}
      />

      <ProkerModal
        isOpen={isProkerModalOpen}
        onClose={() => setIsProkerModalOpen(false)}
        onSave={handleSaveMasterProker}
        editingProker={editingProker}
        dynamicMilestones={dynamicMilestones}
        projects={projects}
        activeProjectId={activeProjectId}
        masterProkers={masterProkers}
      />


      <AppsScriptConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onEndpointSaved={(url) => setEndpointUrl(url)}
        currentEndpoint={endpointUrl}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        currentRole={role}
        setRole={() => {}}
      />



      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        currentUser={currentUser}
        users={users}
        onUpdateUserList={handleUpdateUserList}
      />

    </div>
  );
}
