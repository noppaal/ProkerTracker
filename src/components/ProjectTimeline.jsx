import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  Flag, 
  Search, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter, 
  Layers, 
  X, 
  FolderOpen
} from 'lucide-react';
import { calculateSubProkerProgress, calculateMasterProkerProgress } from '../services/apiService';

const TODAY = new Date();

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  let d;
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(day) && monthIdx >= 0 && monthIdx < 12) {
        return `${day} ${SHORT_MONTHS[monthIdx]} ${year}`;
      }
    }
    d = new Date(dateInput);
  } else {
    d = dateInput;
  }

  if (d && !isNaN(d.getTime())) {
    return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
  return String(dateInput);
};

export const ProjectTimeline = ({
  activeProject,
  masterProkers = [],
  dynamicMilestones = []
}) => {
  // Collapsible toggle state (closed/collapsed by default)
  const [isExpanded, setIsExpanded] = useState(false);

  // Expand/collapse state for each subprogram card (collapsed by default)
  const [expandedSubIds, setExpandedSubIds] = useState({});

  const toggleSubExpand = (subId) => {
    setExpandedSubIds(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  // State for View Mode: 'weekly' (1 minggu) | 'yearly' (1 tahun)
  const [viewMode, setViewMode] = useState('weekly');

  // State for Proker Selection Filter & Search inside Dropdown
  const [selectedProkerId, setSelectedProkerId] = useState('ALL');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prokerSearchQuery, setProkerSearchQuery] = useState('');

  // State for Date Navigation
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 20)); // Default: Senin, 20 Juli 2026 (Minggu Hari Ini)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(currentDate.getMonth());

  // Sync pickerMonth when currentDate changes
  useEffect(() => {
    setPickerMonth(currentDate.getMonth());
  }, [currentDate]);

  const getWeeksInMonth = (yearVal, monthIdx) => {
    const weeks = [];
    const firstDay = new Date(yearVal, monthIdx, 1);
    
    // Find the first Monday (start of first week)
    const day = firstDay.getDay();
    const diff = firstDay.getDate() - day + (day === 0 ? -6 : 1);
    let monday = new Date(yearVal, monthIdx, diff);
    
    for (let w = 0; w < 6; w++) {
      const startOfWeek = new Date(monday.getTime() + w * 7 * 24 * 60 * 60 * 1000);
      const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
      
      // Stop if the week starts in the next month (after the 15th of current month)
      const startMs = startOfWeek.getTime();
      const midMonthMs = new Date(yearVal, monthIdx, 15).getTime();
      if (startOfWeek.getMonth() !== monthIdx && startMs > midMonthMs) {
        break;
      }
      
      weeks.push({
        weekNum: w + 1,
        start: startOfWeek,
        end: endOfWeek
      });
    }
    return weeks;
  };

  const dropdownRef = useRef(null);
  const pickerRef = useRef(null);

  // Close popover dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset filter when switching between projects
  useEffect(() => {
    setSelectedProkerId('ALL');
    setProkerSearchQuery('');
  }, [activeProject?.id]);

  // Filtered Master Prokers for Dropdown Search
  const dropdownProkerList = useMemo(() => {
    if (!prokerSearchQuery.trim()) return masterProkers;
    const q = prokerSearchQuery.toLowerCase();
    return masterProkers.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.code && p.code.toLowerCase().includes(q))
    );
  }, [masterProkers, prokerSearchQuery]);

  // Selected Master Proker Object
  const selectedProkerObj = useMemo(() => {
    if (selectedProkerId === 'ALL') return null;
    return masterProkers.find(p => p.id === selectedProkerId) || null;
  }, [masterProkers, selectedProkerId]);

  // Prokers to display on timeline
  const activeProkersForTimeline = useMemo(() => {
    if (selectedProkerId === 'ALL') return masterProkers;
    return masterProkers.filter(p => p.id === selectedProkerId);
  }, [masterProkers, selectedProkerId]);

  // Date Navigation Handlers
  const handlePrev = () => {
    if (viewMode === 'weekly') {
      setCurrentDate(prev => {
        const newD = new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000);
        setPickerYear(newD.getFullYear());
        return newD;
      });
    } else if (viewMode === 'monthly') {
      setCurrentDate(prev => {
        const newD = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
        setPickerYear(newD.getFullYear());
        return newD;
      });
    } else if (viewMode === 'quarterly') {
      setCurrentDate(prev => {
        const newD = new Date(prev.getFullYear(), prev.getMonth() - 3, 1);
        setPickerYear(newD.getFullYear());
        return newD;
      });
    } else if (viewMode === 'yearly') {
      setCurrentDate(prev => {
        const y = prev.getFullYear() - 1;
        const newD = new Date(y, 0, 1);
        setPickerYear(y);
        return newD;
      });
    }
  };

  const handleNext = () => {
    if (viewMode === 'weekly') {
      setCurrentDate(prev => {
        const newD = new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000);
        setPickerYear(newD.getFullYear());
        return newD;
      });
    } else if (viewMode === 'monthly') {
      setCurrentDate(prev => {
        const newD = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
        setPickerYear(newD.getFullYear());
        return newD;
      });
    } else if (viewMode === 'quarterly') {
      setCurrentDate(prev => {
        const newD = new Date(prev.getFullYear(), prev.getMonth() + 3, 1);
        setPickerYear(newD.getFullYear());
        return newD;
      });
    } else if (viewMode === 'yearly') {
      setCurrentDate(prev => {
        const y = prev.getFullYear() + 1;
        const newD = new Date(y, 0, 1);
        setPickerYear(y);
        return newD;
      });
    }
  };

  // Compute Timeline Min & Max Date Boundaries based on View Mode
  const year = currentDate.getFullYear();
  const monthIdx = currentDate.getMonth();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  // Process all Subprograms & Stage Data
  const { subprograms, autoMinD, autoMaxD } = useMemo(() => {
    const list = [];
    const allPts = [TODAY.getTime()];

    activeProkersForTimeline.forEach(proker => {
      const stages = {};
      let prevCursor = null;

      dynamicMilestones.forEach((m, idx) => {
        const mData = proker.milestones?.[m.id] || {};
        const status = mData.status || 'Not Yet';
        const isDone = status === 'Done';
        const rawTargetStr = mData.targetDate || mData.target || '';
        const rawActualStr = mData.actualDate || mData.actual || '';
        const hasTarget = !!rawTargetStr;
        const hasActual = !!rawActualStr;

        // Jika target dan aktual belum di-input sama sekali, jangan tampilkan di timeline (lewati tahapan ini)
        if (!hasTarget && !hasActual) {
          return;
        }

        // 1. Target Date
        let targetD;
        if (hasTarget) {
          targetD = new Date(rawTargetStr);
          if (isNaN(targetD.getTime())) targetD = addDays(TODAY, (idx + 1) * 7);
        } else {
          // Jika hanya ada aktual
          targetD = new Date(rawActualStr);
          if (isNaN(targetD.getTime())) targetD = TODAY;
        }

        // 2. Cursor Date
        let cursorD;
        if (isDone) {
          if (hasActual) {
            cursorD = new Date(rawActualStr);
            if (isNaN(cursorD.getTime())) cursorD = targetD;
          } else {
            cursorD = targetD;
          }
        } else {
          cursorD = TODAY;
        }

        // 3. Start Date
        let startD;
        const rawStartStr = mData.startDate || mData.start || '';
        if (rawStartStr) {
          startD = new Date(rawStartStr);
          if (isNaN(startD.getTime())) {
            if (idx === 0) {
              startD = addDays(targetD, -14);
            } else {
              startD = prevCursor || addDays(targetD, -7);
            }
          }
        } else {
          if (idx === 0) {
            startD = addDays(targetD, -14);
          } else {
            startD = prevCursor || addDays(targetD, -7);
          }
        }

        // 3b. Actual Start Date
        let actualStartD;
        const rawActualStartStr = mData.actualStartDate || mData.actualStart || '';
        if (rawActualStartStr) {
          actualStartD = new Date(rawActualStartStr);
          if (isNaN(actualStartD.getTime())) {
            actualStartD = startD;
          }
        } else {
          actualStartD = startD;
        }

        prevCursor = cursorD;

        allPts.push(startD.getTime(), targetD.getTime(), cursorD.getTime(), actualStartD.getTime());

        // 4. Calculate Stage Note & Kind accurately
        let kind = 'exact';
        let note = 'Selesai Tepat Waktu';

        if (isDone) {
          if (hasActual && hasTarget) {
            const diffTime = cursorD.getTime() - targetD.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
              kind = 'late';
              note = `Terlambat ${diffDays} hari`;
            } else if (diffDays < 0) {
              kind = 'buffer';
              note = `Selesai ${Math.abs(diffDays)} hari lebih cepat`;
            } else {
              kind = 'buffer';
              note = 'Selesai Tepat Waktu';
            }
          } else {
            kind = 'buffer';
            note = 'Selesai';
          }
        } else {
          if (hasTarget) {
            const diffTime = TODAY.getTime() - targetD.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
              kind = 'late';
              note = `Lewat Target ${diffDays} hari (Berjalan)`;
            } else if (diffDays < 0) {
              kind = 'buffer';
              note = `Sisa ${Math.abs(diffDays)} hari lagi`;
            } else {
              kind = 'exact';
              note = 'Target Hari Ini';
            }
          } else {
            kind = 'exact';
            note = 'Sedang Berjalan';
          }
        }

        stages[m.id] = {
          id: m.id,
          name: m.name || m.code,
          code: m.code || m.name,
          status,
          isDone,
          rawTargetStr,
          rawActualStr,
          rawStartStr,
          rawActualStartStr,
          target: targetD,
          cursor: cursorD,
          start: startD,
          actualStart: actualStartD,
          kind,
          note
        };
      });

      let subMinStart = null;
      let subMinActualStart = null;
      let subMaxTarget = null;
      let subMaxCursor = null;
      Object.values(stages).forEach(st => {
        if (st.start) {
          const t = st.start.getTime();
          if (subMinStart === null || t < subMinStart) subMinStart = t;
        }
        if (st.actualStart) {
          const t = st.actualStart.getTime();
          if (subMinActualStart === null || t < subMinActualStart) subMinActualStart = t;
        }
        if (st.target) {
          const t = st.target.getTime();
          if (subMaxTarget === null || t > subMaxTarget) subMaxTarget = t;
        }
        if (st.cursor) {
          const t = st.cursor.getTime();
          if (subMaxCursor === null || t > subMaxCursor) subMaxCursor = t;
        }
      });

      const subMaxEnd = subMaxTarget || subMaxCursor
        ? Math.max(subMaxTarget || 0, subMaxCursor || 0)
        : null;

      list.push({
        parentProkerId: proker.id,
        parentProkerCode: proker.code,
        parentProkerName: proker.name,
        subId: proker.id,
        subName: proker.name || 'Sub Program Kerja Tanpa Nama',
        priority: proker.priority || 'P2',
        progressPct: calculateMasterProkerProgress(proker, dynamicMilestones),
        subMinStart: subMinStart ? new Date(subMinStart) : null,
        subMinActualStart: subMinActualStart ? new Date(subMinActualStart) : null,
        subMaxTarget: subMaxTarget ? new Date(subMaxTarget) : null,
        subMaxCursor: subMaxCursor ? new Date(subMaxCursor) : null,
        subMaxEnd: subMaxEnd ? new Date(subMaxEnd) : null,
        stages
      });
    });

    const minTime = allPts.length > 0 ? Math.min(...allPts) : TODAY.getTime();
    const maxTime = allPts.length > 0 ? Math.max(...allPts) : TODAY.getTime();

    return {
      subprograms: list,
      autoMinD: addDays(new Date(minTime), -7),
      autoMaxD: addDays(new Date(maxTime), 7)
    };
  }, [activeProkersForTimeline, dynamicMilestones]);

  // Determine Effective minD and maxD for the current View Mode
  const { minD, maxD } = useMemo(() => {
    if (viewMode === 'weekly') {
      const minDate = new Date(currentDate);
      minDate.setHours(0, 0, 0, 0);
      const maxDate = addDays(minDate, 6);
      maxDate.setHours(23, 59, 59, 999);
      return {
        minD: minDate,
        maxD: maxDate
      };
    } else if (viewMode === 'monthly') {
      const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
      const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
      return {
        minD: minDate,
        maxD: maxDate
      };
    } else if (viewMode === 'quarterly') {
      const currentMonth = currentDate.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const minDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1, 0, 0, 0);
      const maxDate = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0, 23, 59, 59);
      return {
        minD: minDate,
        maxD: maxDate
      };
    } else if (viewMode === 'yearly') {
      return {
        minD: new Date(year, 0, 1, 0, 0, 0),
        maxD: new Date(year, 11, 31, 23, 59, 59)
      };
    } else {
      return {
        minD: autoMinD,
        maxD: autoMaxD
      };
    }
  }, [viewMode, year, currentDate, autoMinD, autoMaxD]);

  // Percentage position function safely calculated over [minD, maxD]
  const xPct = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return 0;
    const totalDuration = maxD.getTime() - minD.getTime();
    if (totalDuration <= 0) return 0;
    const elapsed = dateObj.getTime() - minD.getTime();
    const pct = (elapsed / totalDuration) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  // Generate All-Time View Months List (Month + Year labels for All-Time Mode)
  const allTimeMonthList = useMemo(() => {
    if (viewMode !== 'all') return [];
    const months = [];
    const cur = new Date(autoMinD.getFullYear(), autoMinD.getMonth(), 1);
    const end = new Date(autoMaxD.getFullYear(), autoMaxD.getMonth(), 1);

    while (cur <= end) {
      months.push({
        label: `${SHORT_MONTHS[cur.getMonth()]} ${cur.getFullYear().toString().substr(2)}`,
        date: new Date(cur),
        pct: xPct(new Date(cur.getFullYear(), cur.getMonth(), 15))
      });
      cur.setMonth(cur.getMonth() + 1);
    }
    return months;
  }, [viewMode, autoMinD, autoMaxD, minD, maxD]);

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 12,
      padding: '12px 18px',
      marginBottom: 14,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
    }}>
      
      {/* Top Header Bar with View Mode Switcher & Proker Dropdown Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: isExpanded ? 8 : 0,
        borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none',
        marginBottom: isExpanded ? 8 : 0
      }}>
        
        {/* Left Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
            Timeline Sub Program Kerja
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 700, color: '#2563EB', background: '#EFF6FF',
              border: '1px solid #BFDBFE', padding: '3px 8px', borderRadius: 6,
              cursor: 'pointer', transition: 'all 0.15s ease'
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={12} />
                <span>Sembunyikan</span>
              </>
            ) : (
              <>
                <ChevronDown size={12} />
                <span>Buka ({subprograms.length} Sub Program Kerja)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Actions Group: View Mode Switcher & Proker Dropdown */}
        {isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            
            {/* Segmented Control View Mode Switcher (Minggu / Bulan / Quarter / Tahun) */}
            <div style={{
              display: 'flex', alignItems: 'center', background: '#F1F5F9',
              border: '1px solid #CBD5E1', borderRadius: 9, padding: 3
            }}>
              <button
                onClick={() => setViewMode('weekly')}
                style={{
                  padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: viewMode === 'weekly' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'weekly' ? '#2563EB' : '#475569',
                  boxShadow: viewMode === 'weekly' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                1 Minggu
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                style={{
                  padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: viewMode === 'monthly' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'monthly' ? '#2563EB' : '#475569',
                  boxShadow: viewMode === 'monthly' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                1 Bulan
              </button>
              <button
                onClick={() => setViewMode('quarterly')}
                style={{
                  padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: viewMode === 'quarterly' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'quarterly' ? '#2563EB' : '#475569',
                  boxShadow: viewMode === 'quarterly' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                1 Quarter
              </button>
              <button
                onClick={() => setViewMode('yearly')}
                style={{
                  padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: viewMode === 'yearly' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'yearly' ? '#2563EB' : '#475569',
                  boxShadow: viewMode === 'yearly' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                1 Tahun
              </button>
            </div>

            {/* Searchable Proker Dropdown Selector */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 9,
                  padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#0F172A',
                  cursor: 'pointer', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Filter size={14} color="#2563EB" />
                <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedProkerObj ? `${selectedProkerObj.code}: ${selectedProkerObj.name}` : 'Semua Program Kerja'}
                </span>
                <ChevronDown size={14} color="#64748B" />
              </button>

              {/* Searchable Dropdown Popover */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 6, zIndex: 40,
                  width: 320, background: '#FFFFFF', border: '1px solid #CBD5E1',
                  borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden', padding: 8
                }}>
                  
                  {/* Search Box inside Dropdown */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8,
                    padding: '6px 10px', marginBottom: 8
                  }}>
                    <Search size={14} color="#94A3B8" />
                    <input
                      type="text"
                      value={prokerSearchQuery}
                      onChange={(e) => setProkerSearchQuery(e.target.value)}
                      placeholder="Cari program kerja..."
                      autoFocus
                      style={{
                        width: '100%', border: 'none', background: 'none',
                        fontSize: 12, color: '#0F172A', outline: 'none'
                      }}
                    />
                    {prokerSearchQuery && (
                      <button 
                        onClick={() => setProkerSearchQuery('')} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Options List */}
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    
                    {/* Option: ALL */}
                    <div
                      onClick={() => {
                        setSelectedProkerId('ALL');
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: selectedProkerId === 'ALL' ? '#EFF6FF' : 'transparent',
                        color: selectedProkerId === 'ALL' ? '#2563EB' : '#334155',
                        fontWeight: selectedProkerId === 'ALL' ? 700 : 500, fontSize: 12,
                        marginBottom: 4
                      }}
                      className="nav-item"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Layers size={13} color="#2563EB" />
                        <span>Semua Program Kerja</span>
                      </div>
                      <span style={{
                        fontSize: 10, background: '#E2E8F0', padding: '1px 6px', borderRadius: 99, color: '#475569', fontWeight: 700
                      }}>
                        {masterProkers.length}
                      </span>
                    </div>

                    <div style={{ height: 1, background: '#E2E8F0', margin: '4px 0 6px' }} />

                    {/* Filtered Proker Items */}
                    {dropdownProkerList.length === 0 ? (
                      <div style={{ padding: '12px 10px', fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
                        Tidak ada program kerja yang cocok
                      </div>
                    ) : (
                      dropdownProkerList.map((p) => {
                        const isSelected = selectedProkerId === p.id;
                        const progress = calculateMasterProkerProgress(p, dynamicMilestones);

                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedProkerId(p.id);
                              setIsDropdownOpen(false);
                            }}
                            style={{
                              padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                              background: isSelected ? '#EFF6FF' : 'transparent',
                              color: isSelected ? '#2563EB' : '#0F172A',
                              fontWeight: isSelected ? 700 : 500, fontSize: 12,
                              marginBottom: 2
                            }}
                            className="nav-item"
                          >
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                              <span style={{
                                fontFamily: "'Geist Mono', monospace", fontWeight: 700, fontSize: 10,
                                color: '#475569', background: '#F1F5F9', padding: '1px 5px', borderRadius: 4, marginRight: 6
                              }}>
                                {p.code}
                              </span>
                              <span>{p.name}</span>
                            </div>

                            <span style={{ fontSize: 10, color: '#2563EB', fontWeight: 700, flexShrink: 0 }}>
                              {progress}%
                            </span>
                          </div>
                        );
                      })
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {isExpanded && (
        <>
          {/* Date Navigation Control Bar (< Back | Title Dropdown | Next >) */}
          {viewMode !== 'all' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '4px 10px',
          marginBottom: 8,
          flexWrap: 'wrap',
          gap: 16
        }}>
          
          {/* Back / Prev Button */}
          <button
            onClick={handlePrev}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6,
              padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#334155',
              cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronLeft size={14} />
            <span>
              {viewMode === 'weekly' && 'Minggu Sebelumnya'}
              {viewMode === 'monthly' && 'Bulan Sebelumnya'}
              {viewMode === 'quarterly' && 'Quarter Sebelumnya'}
              {viewMode === 'yearly' && 'Tahun Sebelumnya'}
            </span>
          </button>

          {/* Center Date Title Button (Clickable Popover Picker) */}
          <div style={{ position: 'relative' }} ref={pickerRef}>
            <button
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#FFFFFF', border: '1px solid #2563EB', borderRadius: 6,
                padding: '4px 12px', fontSize: 12, fontWeight: 800, color: '#1E40AF',
                cursor: 'pointer', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.1)'
              }}
            >
              <Calendar size={14} color="#2563EB" />
              <span>
                {viewMode === 'weekly' && `Minggu: ${formatDate(currentDate)} - ${formatDate(addDays(currentDate, 6))}`}
                {viewMode === 'monthly' && `Bulan: ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                {viewMode === 'quarterly' && (() => {
                  const qNum = Math.floor(currentDate.getMonth() / 3) + 1;
                  return `Quarter: Q${qNum} ${currentDate.getFullYear()} (${MONTH_NAMES[Math.floor(currentDate.getMonth() / 3) * 3]} - ${MONTH_NAMES[Math.floor(currentDate.getMonth() / 3) * 3 + 2]})`;
                })()}
                {viewMode === 'yearly' && `Tahun ${year} (Januari - Desember)`}
              </span>
              <ChevronDown size={12} color="#2563EB" />
            </button>

            {/* Picker Popover Dropdown */}
            {isPickerOpen && (
              <div style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '100%', marginTop: 6, zIndex: 50,
                width: 310, background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 12,
                padding: 14, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              }}>
                
                {/* Year Selector (Hidden in Weekly mode as calendar picker selects any year directly) */}
                {/* Weekly Month/Year Selector Header */}
                {viewMode === 'weekly' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <button 
                      onClick={() => {
                        let newMonth = pickerMonth - 1;
                        let newYear = pickerYear;
                        if (newMonth < 0) {
                          newMonth = 11;
                          newYear = pickerYear - 1;
                        }
                        setPickerMonth(newMonth);
                        setPickerYear(newYear);
                      }}
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                      {MONTH_NAMES[pickerMonth]} {pickerYear}
                    </span>
                    <button 
                      onClick={() => {
                        let newMonth = pickerMonth + 1;
                        let newYear = pickerYear;
                        if (newMonth > 11) {
                          newMonth = 0;
                          newYear = pickerYear + 1;
                        }
                        setPickerMonth(newMonth);
                        setPickerYear(newYear);
                      }}
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                {/* Year Selector for other modes */}
                {viewMode !== 'weekly' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <button 
                      onClick={() => {
                        const y = pickerYear - 1;
                        setPickerYear(y);
                        if (viewMode === 'yearly') setCurrentDate(new Date(y, 0, 1));
                      }}
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Tahun {pickerYear}</span>
                    <button 
                      onClick={() => {
                        const y = pickerYear + 1;
                        setPickerYear(y);
                        if (viewMode === 'yearly') setCurrentDate(new Date(y, 0, 1));
                      }}
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                {/* Weekly Mode: Weeks List for selected Month/Year */}
                {viewMode === 'weekly' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {getWeeksInMonth(pickerYear, pickerMonth).map((wk) => {
                      const isSelected = currentDate.toDateString() === wk.start.toDateString();
                      const startLabel = `${wk.start.getDate()} ${SHORT_MONTHS[wk.start.getMonth()]}`;
                      const endLabel = `${wk.end.getDate()} ${SHORT_MONTHS[wk.end.getMonth()]}`;
                      
                      return (
                        <button
                          key={wk.weekNum}
                          onClick={() => {
                            setCurrentDate(wk.start);
                            setIsPickerOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                            background: isSelected ? '#EFF6FF' : '#F8FAFC',
                            color: isSelected ? '#2563EB' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ fontWeight: 800, fontSize: 12 }}>
                            Minggu {wk.weekNum}
                          </span>
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: isSelected ? '#1D4ED8' : '#64748B', fontWeight: 600 }}>
                            {startLabel} - {endLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Monthly Mode: 12 Months Grid */}
                {viewMode === 'monthly' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {MONTH_NAMES.map((mName, mIdx) => {
                      const isSelected = monthIdx === mIdx && year === pickerYear;
                      return (
                        <button
                          key={mName}
                          onClick={() => {
                            setCurrentDate(new Date(pickerYear, mIdx, 1));
                            setIsPickerOpen(false);
                          }}
                          style={{
                            padding: '8px 4px', borderRadius: 8,
                            border: isSelected ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            background: isSelected ? '#2563EB' : '#F8FAFC',
                            color: isSelected ? '#FFFFFF' : '#334155',
                            fontSize: 12, fontWeight: isSelected ? 800 : 600, cursor: 'pointer'
                          }}
                        >
                          {mName.substr(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Quarterly Mode: Quarters Grid */}
                {viewMode === 'quarterly' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {[
                      { label: 'Q1 (Jan - Mar)', month: 0 },
                      { label: 'Q2 (Apr - Jun)', month: 3 },
                      { label: 'Q3 (Jul - Sep)', month: 6 },
                      { label: 'Q4 (Oct - Dec)', month: 9 }
                    ].map((q) => {
                      const isSelected = Math.floor(currentDate.getMonth() / 3) * 3 === q.month && year === pickerYear;
                      return (
                        <button
                          key={q.label}
                          onClick={() => {
                            setCurrentDate(new Date(pickerYear, q.month, 1));
                            setIsPickerOpen(false);
                          }}
                          style={{
                            padding: '12px 6px', borderRadius: 8,
                            border: isSelected ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            background: isSelected ? '#2563EB' : '#F8FAFC',
                            color: isSelected ? '#FFFFFF' : '#334155',
                            fontSize: 12, fontWeight: isSelected ? 800 : 600, cursor: 'pointer'
                          }}
                        >
                          {q.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Yearly Mode: Years Grid */}
                {viewMode === 'yearly' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {(() => {
                      const yearsList = [];
                      for (let y = pickerYear - 4; y <= pickerYear + 4; y++) {
                        yearsList.push(y);
                      }
                      return yearsList.map(y => {
                        const isSelected = year === y;
                        return (
                          <button
                            key={y}
                            onClick={() => {
                              setPickerYear(y);
                              setCurrentDate(new Date(y, 0, 1));
                              setIsPickerOpen(false);
                            }}
                            style={{
                              padding: '8px 4px', borderRadius: 8,
                              border: isSelected ? '1px solid #2563EB' : '1px solid #E2E8F0',
                              background: isSelected ? '#2563EB' : '#F8FAFC',
                              color: isSelected ? '#FFFFFF' : '#334155',
                              fontSize: 12, fontWeight: isSelected ? 800 : 600, cursor: 'pointer'
                            }}
                          >
                            {y}
                          </button>
                        );
                      });
                    })()}
                  </div>
                )}


              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6,
              padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#334155',
              cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>
              {viewMode === 'weekly' && 'Minggu Berikutnya'}
              {viewMode === 'monthly' && 'Bulan Berikutnya'}
              {viewMode === 'quarterly' && 'Quarter Berikutnya'}
              {viewMode === 'yearly' && 'Tahun Berikutnya'}
            </span>
            <ChevronRight size={14} />
          </button>

        </div>
      )}

      {/* Color Legend Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
        fontSize: 10,
        color: '#475569',
        fontWeight: 500,
        marginBottom: 8,
        padding: '6px 10px',
        background: '#F8FAFC',
        borderRadius: 8,
        border: '1px solid #E2E8F0'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i style={{ width: 13, height: 7, borderRadius: 3, background: '#64748B', display: 'inline-block' }} /> Rencana (Target)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i style={{ width: 13, height: 7, borderRadius: 3, background: '#6366F1', display: 'inline-block' }} /> Realisasi (Berjalan)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i style={{ width: 13, height: 7, borderRadius: 3, background: '#10B981', display: 'inline-block' }} /> Realisasi (Selesai)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i style={{ width: 13, height: 7, borderRadius: 3, background: '#D8492B', display: 'inline-block' }} /> Kelebihan Waktu (Overrun)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i className="overrun-live" style={{ width: 13, height: 7, borderRadius: 3, background: '#D8492B', display: 'inline-block', overflow: 'hidden' }} /> Overrun berjalan
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 'auto', fontWeight: 700, color: '#0F172A' }}>
          <span style={{ borderLeft: '1.5px dashed #0F172A', height: 12, display: 'inline-block' }} /> ┆ Garis = Hari Ini ({formatDate(TODAY)})
        </span>
      </div>

      {/* Timeline Subprograms List with Horizontal Scroll Support */}
      {subprograms.length === 0 ? (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: '#64748B', fontSize: 13, background: '#F8FAFC', borderRadius: 10 }}>
          <FolderOpen size={36} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
          Belum ada sub program kerja / milestone yang tersedia pada filter ini.
        </div>
      ) : (
        /* Outer Horizontal Scroll Container */
        <div style={{ overflowX: 'auto', paddingBottom: 12, WebkitOverflowScrolling: 'touch' }}>
          
          {/* Inner Content with Fixed Min-Width for Spacious Grid Rendering */}
          <div style={{
            minWidth: viewMode === 'weekly' ? 960 : 960,
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
            {subprograms.map((sub) => {
              const isSubExpanded = !!expandedSubIds[sub.subId];

              return (
                <div
                  key={sub.subId}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #2563EB',
                    borderRadius: 10,
                    padding: '6px 12px',
                    boxShadow: '0 2px 6px -4px rgba(15, 23, 42, 0.05)',
                    position: 'relative'
                  }}
                >
                  
                  {/* Card Top Header (Clickable to Toggle Collapse) */}
                  <div 
                    onClick={() => toggleSubExpand(sub.subId)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 10, marginBottom: 4, flexWrap: 'wrap', cursor: 'pointer', userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isSubExpanded ? <ChevronUp size={14} color="#2563EB" /> : <ChevronDown size={14} color="#64748B" />}
                      <span style={{
                        fontSize: 10, fontWeight: 800, color: '#1E40AF', background: '#DBEAFE',
                        padding: '2px 6px', borderRadius: 4, letterSpacing: '0.02em'
                      }}>
                        {sub.parentProkerCode}
                      </span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                          {sub.subName}
                        </h3>
                      </div>
                    </div>

                    {/* Progress Percentage Ring / Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: 6 }}>
                      <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Progress:</span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 800, color: '#2563EB' }}>
                        {sub.progressPct}%
                      </span>
                    </div>
                  </div>                  {/* Card Tracks Wrapper (Relative container to draw vertical Today line across Timeline Utama, milestones, and timescale) */}
                  <div style={{ position: 'relative', marginTop: 4 }}>
                    
                    {/* Vertical Today Line (Spans the entire tracks area: Timeline Utama, milestones, and timescale) */}
                    {TODAY >= minD && TODAY <= maxD && (
                      <div style={{
                        position: 'absolute', top: 0, bottom: 0,
                        left: `calc(122px + (100% - 274px) * ${xPct(TODAY) / 100})`,
                        borderLeft: '1.5px dashed #0F172A',
                        zIndex: 10, pointerEvents: 'none', opacity: 0.65
                      }} />
                    )}

                    {/* Timeline Utama Row (Always Visible) */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '3px 0', borderBottom: 'none',
                      paddingBottom: 3
                    }}>
                      {/* Col 1 */}
                      <div style={{ flex: 'none', width: 110, fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        Timeline Utama
                      </div>

                      {/* Col 2: Overall Subprogram Track (Two Separate Tracks: Rencana & Realisasi) */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', minWidth: 0, padding: '2px 0' }}>
                        {sub.subMinStart && (sub.subMaxTarget || sub.subMaxCursor) && (() => {
                          const startPct = xPct(sub.subMinStart);
                          const actualStartPct = xPct(sub.subMinActualStart || sub.subMinStart);
                          const targetPct = xPct(sub.subMaxTarget || sub.subMinStart);
                          const cursorPct = xPct(sub.subMaxCursor || sub.subMinStart);
                          const isDone = sub.progressPct === 100;

                          return (
                            <>
                              {/* Track A: Target / Rencana (Slate Grey) */}
                              <div style={{ position: 'relative', height: 6, background: '#E2E8F0', borderRadius: 3 }}>
                                {sub.subMaxTarget && (
                                  <div style={{
                                    position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                    left: `${startPct}%`,
                                    width: `${Math.max(targetPct - startPct, 2.5)}%`,
                                    background: '#475569'
                                  }} />
                                )}
                              </div>

                              {/* Track B: Realisasi / Aktual / Berjalan */}
                              <div style={{ position: 'relative', height: 6, background: '#E0E7FF', borderRadius: 3 }}>
                                {cursorPct <= targetPct ? (
                                  <div style={{
                                    position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                    left: `${actualStartPct}%`,
                                    width: `${Math.max(cursorPct - actualStartPct, 2.5)}%`,
                                    background: isDone ? '#10B981' : '#4F46E5'
                                  }} />
                                ) : (
                                  <>
                                    {/* Realisasi up to Target */}
                                    <div style={{
                                      position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                      left: `${actualStartPct}%`,
                                      width: `${Math.max(targetPct - actualStartPct, 2.5)}%`,
                                      background: isDone ? '#10B981' : '#4F46E5'
                                    }} />
                                    {/* Overrun segment past Target */}
                                    <div 
                                      className={!isDone ? 'overrun-live' : ''}
                                      style={{
                                        position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                        left: `${targetPct}%`,
                                        width: `${Math.max(cursorPct - targetPct, 2.5)}%`,
                                        background: '#D8492B'
                                      }} 
                                    />
                                  </>
                                )}

                                {/* Cursor Dot Indicator */}
                                <div style={{
                                  position: 'absolute', top: -2, width: 8, height: 8, borderRadius: '50%',
                                  background: '#FFFFFF', border: '1.5px solid #0F172A',
                                  left: `${cursorPct}%`, transform: 'translateX(-50%)', zIndex: 12
                                }} />
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Col 3 */}
                      <div style={{
                        width: 140, flex: 'none', fontSize: 9, fontWeight: 700,
                        padding: '1px 4px', borderRadius: 4, textAlign: 'center',
                        background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {sub.subMinStart && sub.subMaxEnd 
                          ? `${formatDate(sub.subMinStart)} - ${formatDate(sub.subMaxEnd)}`
                          : 'Belum ada tanggal'
                        }
                      </div>
                    </div>

                    {/* Collapsible Details Area */}
                    {isSubExpanded && (
                      <div style={{ marginTop: 4 }}>
                        {dynamicMilestones.map((m) => {
                          const s = sub.stages[m.id];
                          if (!s) return null;

                          const startPct = xPct(s.start);
                          const targetPct = xPct(s.target);
                          const cursorPct = xPct(s.cursor);

                          const isLate = s.kind === 'late';
                          const isBuffer = s.kind === 'buffer';

                          return (
                            <div
                              key={m.id}
                              style={{
                                padding: '3px 0',
                                borderTop: '1px dashed #E2E8F0'
                              }}
                            >
                              {/* Top Row: Col 1 (Stage Left Chip 110px) + Col 2 (TWO Tracks flex:1) + Col 3 (Status Tag 140px) */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                
                                {/* Col 1: Stage Left Chip */}
                                <div style={{
                                  flex: 'none', width: 110, fontSize: 9, fontWeight: 700,
                                  color: '#1E40AF', background: '#EFF6FF', border: '1px solid #DBEAFE',
                                  borderRadius: 4, padding: '2px 4px', textAlign: 'center', textTransform: 'uppercase',
                                  letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                  {s.code}
                                </div>

                                {/* Col 2: Timeline Horizontal TWO Separate Tracks */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', minWidth: 0, padding: '2px 0' }}>
                                  
                                  {/* Track A: Target / Rencana (Slate Grey) */}
                                  <div style={{ position: 'relative', height: 6, background: '#E2E8F0', borderRadius: 3 }}>
                                    <div style={{
                                      position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                      left: `${startPct}%`,
                                      width: `${Math.max(targetPct - startPct, 2.5)}%`,
                                      background: '#475569'
                                    }} />
                                  </div>

                                  {/* Track B: Realisasi / Aktual / Berjalan */}
                                  <div style={{ position: 'relative', height: 6, background: '#E0E7FF', borderRadius: 3 }}>
                                    {cursorPct <= targetPct ? (
                                      <div style={{
                                        position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                        left: `${xPct(s.actualStart || s.start)}%`,
                                        width: `${Math.max(cursorPct - xPct(s.actualStart || s.start), 2.5)}%`,
                                        background: s.isDone ? '#10B981' : '#4F46E5'
                                      }} />
                                    ) : (
                                      <>
                                        {/* Realisasi up to Target */}
                                        <div style={{
                                          position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                          left: `${xPct(s.actualStart || s.start)}%`,
                                          width: `${Math.max(targetPct - xPct(s.actualStart || s.start), 2.5)}%`,
                                          background: s.isDone ? '#10B981' : '#4F46E5'
                                        }} />
                                        {/* Overrun segment past Target */}
                                        <div 
                                          className={!s.isDone ? 'overrun-live' : ''}
                                          style={{
                                            position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
                                            left: `${targetPct}%`,
                                            width: `${Math.max(cursorPct - targetPct, 2.5)}%`,
                                            background: '#D8492B'
                                          }} 
                                        />
                                      </>
                                    )}

                                    {/* Cursor Dot Indicator */}
                                    <div style={{
                                      position: 'absolute', top: -2, width: 8, height: 8, borderRadius: '50%',
                                      background: '#FFFFFF', border: '1.5px solid #0F172A',
                                      left: `${cursorPct}%`, transform: 'translateX(-50%)', zIndex: 12
                                    }} />
                                  </div>

                                </div>

                                {/* Col 3: Right Status Note Tag */}
                                <div style={{
                                  width: 140, flex: 'none', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap',
                                  padding: '1px 4px', borderRadius: 4, textAlign: 'center',
                                  overflow: 'hidden', textOverflow: 'ellipsis',
                                  background: isLate ? '#FFE4E6' : (isBuffer ? '#DCFCE7' : '#F1F5F9'),
                                  color: isLate ? '#9F1239' : (isBuffer ? '#166534' : '#475569'),
                                  border: isLate ? '1px solid #FECDD3' : (isBuffer ? '1px solid #BBF7D0' : '1px solid #E2E8F0')
                                }}>
                                  {s.note}
                                </div>

                              </div>

                              {/* Bottom Explicit Date Badges Row for this Stage Box */}
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 12, marginTop: 1
                              }}>
                                <div style={{ flex: 'none', width: 110 }} />
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontSize: 9, flexWrap: 'wrap' }}>
                                  {s.rawStartStr && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#475569', fontWeight: 600 }}>
                                      <span>Rencana Mulai:</span>
                                      <strong style={{ fontFamily: "'Geist Mono', monospace" }}>{formatDate(s.rawStartStr)}</strong>
                                    </span>
                                  )}
                                  {s.rawTargetStr && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#1D4ED8', fontWeight: 600 }}>
                                      <Target size={9} color="#2563EB" />
                                      <span>Target Selesai:</span>
                                      <strong style={{ fontFamily: "'Geist Mono', monospace", color: '#1E40AF' }}>
                                        {formatDate(s.rawTargetStr)}
                                      </strong>
                                    </span>
                                  )}
                                  {s.rawActualStartStr && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#4F46E5', fontWeight: 600 }}>
                                      <span>Realisasi Mulai:</span>
                                      <strong style={{ fontFamily: "'Geist Mono', monospace", color: '#4F46E5' }}>{formatDate(s.rawActualStartStr)}</strong>
                                    </span>
                                  )}
                                  {s.rawActualStr && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: s.isDone ? (isLate ? '#DC2626' : '#047857') : '#64748B', fontWeight: 600 }}>
                                      <Flag size={9} color={s.isDone ? (isLate ? '#DC2626' : '#059669') : '#94A3B8'} />
                                      <span>Realisasi Selesai:</span>
                                      <strong style={{ fontFamily: "'Geist Mono', monospace", color: s.isDone ? (isLate ? '#B91C1C' : '#065F46') : '#64748B' }}>
                                        {formatDate(s.rawActualStr)}
                                      </strong>
                                    </span>
                                  )}
                                </div>
                                <div style={{ flex: 'none', width: 140 }} />
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Skala Waktu untuk Timeline Utama (Selalu Muncul di bagian bawah wrapper) */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      paddingTop: 4, paddingBottom: 2,
                      borderTop: isSubExpanded ? '1px dashed #E2E8F0' : 'none',
                      marginTop: 4
                    }}>
                      {/* Col 1 */}
                      <div style={{ flex: 'none', width: 110, fontSize: 8.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        Skala Waktu
                      </div>

                      {/* Col 2 */}
                      <div style={{ flex: 1, position: 'relative', height: 12, minWidth: 0 }}>
                        {viewMode === 'weekly' && Array.from({ length: 7 }, (_, i) => i).map((offset) => {
                          const dayDate = addDays(currentDate, offset);
                          const pct = xPct(dayDate);
                          const isTodayMark = dayDate.toDateString() === TODAY.toDateString();
                          const daysShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
                          const label = `${daysShort[dayDate.getDay()]} ${dayDate.getDate()}`;

                          return (
                            <div
                              key={offset}
                              style={{
                                position: 'absolute',
                                left: `${pct}%`,
                                transform: 'translateX(-50%)',
                                fontSize: 8.5,
                                fontWeight: isTodayMark ? 800 : 600,
                                color: isTodayMark ? '#D8492B' : '#64748B',
                                fontFamily: "'Geist Mono', monospace",
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {label}
                            </div>
                          );
                        })}

                        {viewMode === 'monthly' && (() => {
                          const minMonth = minD.getMonth();
                          const minYear = minD.getFullYear();
                          const days = [1, 8, 15, 22];
                          const lastDay = new Date(minYear, minMonth + 1, 0).getDate();
                          if (lastDay > 22) days.push(lastDay);
                          
                          return days.map((day) => {
                            const d = new Date(minYear, minMonth, day);
                            const pct = xPct(d);
                            const isTodayMark = d.toDateString() === TODAY.toDateString();
                            const label = `${day} ${SHORT_MONTHS[minMonth]}`;
                            
                            return (
                              <div
                                key={day}
                                style={{
                                  position: 'absolute',
                                  left: `${pct}%`,
                                  transform: 'translateX(-50%)',
                                  fontSize: 8.5,
                                  fontWeight: isTodayMark ? 800 : 600,
                                  color: isTodayMark ? '#D8492B' : '#64748B',
                                  fontFamily: "'Geist Mono', monospace",
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {label}
                              </div>
                            );
                          });
                        })()}

                        {viewMode === 'quarterly' && (() => {
                          const startMonth = minD.getMonth();
                          const y = minD.getFullYear();
                          const ticks = [];
                          for (let m = startMonth; m < startMonth + 3; m++) {
                            ticks.push(new Date(y, m, 1));
                            ticks.push(new Date(y, m, 15));
                          }
                          
                          return ticks.map((d, index) => {
                            const pct = xPct(d);
                            const isTodayMark = d.toDateString() === TODAY.toDateString();
                            const label = `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
                            
                            return (
                              <div
                                key={index}
                                style={{
                                  position: 'absolute',
                                  left: `${pct}%`,
                                  transform: 'translateX(-50%)',
                                  fontSize: 8.5,
                                  fontWeight: isTodayMark ? 800 : 600,
                                  color: isTodayMark ? '#D8492B' : '#64748B',
                                  fontFamily: "'Geist Mono', monospace",
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {label}
                              </div>
                            );
                          });
                        })()}

                        {viewMode === 'yearly' && SHORT_MONTHS.map((mName, mIdx) => {
                          const pct = xPct(new Date(year, mIdx, 15));
                          const isCurrentMonth = TODAY.getFullYear() === year && TODAY.getMonth() === mIdx;

                          return (
                            <div
                              key={mName}
                              style={{
                                position: 'absolute',
                                left: `${pct}%`,
                                transform: 'translateX(-50%)',
                                fontSize: 8.5,
                                fontWeight: isCurrentMonth ? 800 : 600,
                                color: isCurrentMonth ? '#2563EB' : '#64748B',
                                fontFamily: "'Space Grotesk', sans-serif",
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {mName}
                            </div>
                          );
                        })}
                      </div>

                      {/* Col 3 */}
                      <div style={{ flex: 'none', width: 140 }} />
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

        </>
      )}

    </div>
  );
};
