import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ProjectsOverview } from './components/ProjectsOverview';
import { MasterProkerTable } from './components/MasterProkerTable';
import { ProkerModal } from './components/Modals/ProkerModal';
import { ProjectModal } from './components/Modals/ProjectModal';
import { DynamicMilestoneModal } from './components/Modals/DynamicMilestoneModal';
import { AppsScriptConfigModal } from './components/Modals/AppsScriptConfigModal';
import { PermissionsModal } from './components/Modals/PermissionsModal';
import { AuthModal } from './components/Auth/AuthModal';

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

  // Load Session & Initial Data on Mount
  useEffect(() => {
    const savedUser = getUserSession();
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      const defaultUser = INITIAL_USERS[0];
      setCurrentUser(defaultUser);
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
        if (data.users) setUsers(data.users);
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

  // Sub-Proker CRUD & Updates
  const handleUpdateSubItem = (masterProkerId, updatedSubItem) => {
    const updated = masterProkers.map(p => {
      if (p.id === masterProkerId) {
        const subItems = p.subItems.map(sub => sub.id === updatedSubItem.id ? updatedSubItem : sub);
        return { ...p, subItems };
      }
      return p;
    });
    setMasterProkers(updated);
    handleSaveDataState(projects, updated, dynamicMilestones, users);
  };

  const handleDeleteSubItem = (masterProkerId, subItemId) => {
    if (window.confirm('Hapus sub-program kerja ini?')) {
      const updated = masterProkers.map(p => {
        if (p.id === masterProkerId) {
          const subItems = p.subItems.filter(sub => sub.id !== subItemId);
          return { ...p, subItems };
        }
        return p;
      });
      setMasterProkers(updated);
      handleSaveDataState(projects, updated, dynamicMilestones, users);
    }
  };

  const handleAddSubItemPrompt = (masterProkerId) => {
    const proker = masterProkers.find(p => p.id === masterProkerId);
    if (!proker) return;
    setEditingProker(proker);
    setIsProkerModalOpen(true);
  };

  // Dynamic Milestone CRUD
  const handleAddMilestoneColumn = (newMilestone) => {
    const updatedMilestones = [...dynamicMilestones, newMilestone];
    setDynamicMilestones(updatedMilestones);
    handleSaveDataState(projects, masterProkers, updatedMilestones, users);
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

  // KPI Stats
  const stats = useMemo(() => {
    const totalProker = projectProkers.length;
    const p1Count = projectProkers.filter(p => p.priority === 'P1').length;
    
    let totalSubItems = 0;
    let sumProgress = 0;

    projectProkers.forEach(p => {
      totalSubItems += p.subItems?.length || 0;
      sumProgress += calculateMasterProkerProgress(p, dynamicMilestones);
    });

    const overallProgress = totalProker > 0 ? Math.round(sumProgress / totalProker) : 0;

    return { totalProker, p1Count, totalSubItems, overallProgress };
  }, [projectProkers, dynamicMilestones]);

  // Filtered Master Prokers logic
  const filteredMasterProkers = useMemo(() => {
    return projectProkers.filter(p => {
      
      if (priorityFilter !== 'ALL') {
        const matchMasterPriority = p.priority === priorityFilter;
        const matchSubPriority = p.subItems?.some(sub => (sub.priority || p.priority) === priorityFilter);
        if (!matchMasterPriority && !matchSubPriority) {
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
          (p.description && p.description.toLowerCase().includes(query));
        const matchSubProker = p.subItems?.some(sub => 
          sub.name.toLowerCase().includes(query) || 
          (sub.specNotes && sub.specNotes.toLowerCase().includes(query)) ||
          (sub.techNotes && sub.techNotes.toLowerCase().includes(query))
        );

        if (!matchProject && !matchProker && !matchSubProker) {
          return false;
        }
      }

      if (statusFilter !== 'ALL') {
        const hasMatchingStatus = p.subItems?.some(sub => {
          if (!sub.milestones) return statusFilter === 'Not Yet';
          return Object.values(sub.milestones).some(m => m && m.status === statusFilter);
        });
        if (!hasMatchingStatus) return false;
      }

      return true;
    });
  }, [projectProkers, priorityFilter, searchQuery, statusFilter, projects]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F7F7F5' }}>
      
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
        dataSource={dataSource}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, background: '#fff' }}>
        
        {/* Top Header */}
        <Header
          stats={stats}
          activeProject={activeProject}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        {/* Main Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#fff' }}>
          
          {/* Projects Overview Table (Displayed when "Semua Projek" is selected) */}
          {activeProjectId === 'ALL' && (
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
          )}

          {/* Search & Filter Toolbar */}
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isExpandAll={isExpandAll}
            toggleExpandAll={handleToggleExpandAll}
            onOpenAddProker={() => {
              setEditingProker(null);
              setIsProkerModalOpen(true);
            }}
            onOpenAddMilestone={() => setIsMilestoneModalOpen(true)}
            role={role}
          />

          {/* Master Proker Table */}
          <MasterProkerTable
            masterProkers={filteredMasterProkers}
            dynamicMilestones={dynamicMilestones}
            expandedRowIds={expandedRowIds}
            onToggleRow={handleToggleRow}
            expandedMilestoneIds={expandedMilestoneIds}
            onToggleMilestoneColumn={handleToggleMilestoneColumn}
            onEditMasterProker={(proker) => {
              setEditingProker(proker);
              setIsProkerModalOpen(true);
            }}
            onDeleteMasterProker={handleDeleteMasterProker}
            onUpdateSubItem={handleUpdateSubItem}
            onDeleteSubItem={handleDeleteSubItem}
            onAddSubItem={handleAddSubItemPrompt}
            onEditSubItem={(masterId, subItem) => {
              const proker = masterProkers.find(p => p.id === masterId);
              setEditingProker(proker);
              setIsProkerModalOpen(true);
            }}
            role={role}
            onOpenAddProker={() => {
              setEditingProker(null);
              setIsProkerModalOpen(true);
            }}
            projects={projects}
          />

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
      />

      <ProkerModal
        isOpen={isProkerModalOpen}
        onClose={() => setIsProkerModalOpen(false)}
        onSave={handleSaveMasterProker}
        editingProker={editingProker}
        dynamicMilestones={dynamicMilestones}
        projects={projects}
        activeProjectId={activeProjectId}
      />

      <DynamicMilestoneModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        onAddMilestone={handleAddMilestoneColumn}
        existingMilestones={dynamicMilestones}
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

    </div>
  );
}
