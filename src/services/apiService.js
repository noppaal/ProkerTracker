const LOCAL_STORAGE_KEY = 'proker_tracker_data_v2';
const USER_SESSION_KEY = 'proker_tracker_user_session';
const ENDPOINT_KEY = 'proker_tracker_apps_script_url';

export const getSavedEndpoint = () => {
  return localStorage.getItem(ENDPOINT_KEY) || '';
};

export const saveEndpoint = (url) => {
  localStorage.setItem(ENDPOINT_KEY, url);
};

// User Auth Session Helpers
export const getUserSession = () => {
  const session = localStorage.getItem(USER_SESSION_KEY);
  if (session) {
    try {
      return JSON.parse(session);
    } catch (e) {}
  }
  return null;
};

export const saveUserSession = (user) => {
  if (user) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_SESSION_KEY);
  }
};

// Core Data Fetch & Save
export const fetchProkerData = async (endpointUrl) => {
  const url = endpointUrl || getSavedEndpoint();
  
  if (url && url.startsWith('http')) {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        redirect: 'follow'
      });

      const responseText = await response.text();
      let result = null;
      try {
        result = JSON.parse(responseText);
      } catch (pErr) {
        console.warn('Apps Script returned non-JSON text response:', responseText);
      }

      if (result && (result.status === 'success' || result.status === 'ok')) {
        if (result.data) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result.data));
        }
        return { 
          data: result.data || null, 
          source: 'google_sheets', 
          message: 'Terhubung langsung secara Live ke Google Sheets!' 
        };
      }
    } catch (err) {
      console.warn('Google Sheets fetch error:', err);
    }
  }

  // Fallback to LocalStorage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return { 
        data: JSON.parse(cached), 
        source: 'local_storage', 
        message: 'Menggunakan data tersimpan di Local Storage' 
      };
    } catch (e) {
      console.error('Failed to parse cached data:', e);
    }
  }

  return { data: null, source: 'initial', message: 'Data Kosong' };
};

export const saveProkerData = async (data, endpointUrl) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

  const url = endpointUrl || getSavedEndpoint();
  if (!url || !url.startsWith('http')) {
    return { success: true, source: 'local_storage', message: 'Tersimpan secara lokal' };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ action: 'SYNC_ALL', data }),
      redirect: 'follow'
    });

    const responseText = await response.text();
    let result = null;
    try {
      result = JSON.parse(responseText);
    } catch (e) {}

    if (result && result.status === 'success') {
      return { success: true, source: 'google_sheets', message: 'Tersimpan & ter-sync dengan Google Sheets!' };
    }
    
    if (response.ok || response.type === 'opaque') {
      return { success: true, source: 'google_sheets', message: 'Data dikirim ke Google Sheets!' };
    }
  } catch (err) {
    console.warn('Google Sheets save error:', err);
    return { success: true, source: 'local_storage_warning', message: 'Tersimpan lokal (Koneksi Google Sheets terputus)' };
  }

  return { success: true, source: 'local_storage', message: 'Tersimpan secara lokal' };
};

/**
 * FIX FLAG PROGRESS CALCULATION LOGIC:
 * Calculates milestone completion percentage for a Sub-Proker.
 * When a sub-proker is newly created, milestones default to 0% (Not Yet), NOT 100%!
 */
export const calculateSubProkerProgress = (subItem, dynamicMilestones = []) => {
  if (!subItem || !dynamicMilestones || dynamicMilestones.length === 0) return 0;
  
  let totalApplicableMilestones = 0;
  let totalCompletedScore = 0;

  dynamicMilestones.forEach(m => {
    const milestoneData = subItem.milestones ? subItem.milestones[m.id] : null;
    const status = milestoneData ? milestoneData.status : 'Not Yet';

    // Exclude milestones that are explicitly marked as inapplicable
    if (status !== 'Tidak ada Link Terkait' && status !== 'Tidak ada Mockup') {
      totalApplicableMilestones++;
      if (status === 'Done') {
        totalCompletedScore += 1;
      } else if (status === 'In Progress') {
        totalCompletedScore += 0.5;
      } else if (status === 'Hold') {
        totalCompletedScore += 0.25;
      }
    }
  });

  if (totalApplicableMilestones === 0) return 0;
  return Math.round((totalCompletedScore / totalApplicableMilestones) * 100);
};

export const calculateMasterProkerProgress = (masterProker, dynamicMilestones = []) => {
  if (!masterProker || !masterProker.subItems || masterProker.subItems.length === 0) return 0;

  const totalProgressSum = masterProker.subItems.reduce((acc, sub) => {
    return acc + calculateSubProkerProgress(sub, dynamicMilestones);
  }, 0);

  return Math.round(totalProgressSum / masterProker.subItems.length);
};

export const calculateDateDelay = (targetDateStr, actualDateStr) => {
  if (!targetDateStr) {
    return { status: 'no_target', label: 'Belum ada target', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  }

  const targetDate = new Date(targetDateStr);
  const checkDate = actualDateStr ? new Date(actualDateStr) : new Date();
  
  targetDate.setHours(0,0,0,0);
  checkDate.setHours(0,0,0,0);

  const diffTime = checkDate.getTime() - targetDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (actualDateStr) {
    if (diffDays <= 0) {
      return { status: 'ontime', label: 'Selesai Tepat Waktu', diffDays: Math.abs(diffDays), color: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium' };
    } else {
      return { status: 'delayed', label: `Terlambat ${diffDays} hari`, diffDays, color: 'bg-rose-100 text-rose-800 border-rose-300 font-medium' };
    }
  } else {
    if (diffDays > 0) {
      return { status: 'overdue', label: `Lewat Target ${diffDays} hari`, diffDays, color: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' };
    } else if (diffDays === 0) {
      return { status: 'due_today', label: 'Target Hari Ini', diffDays: 0, color: 'bg-amber-100 text-amber-800 border-amber-300 font-bold' };
    } else {
      return { status: 'upcoming', label: `Sisa ${Math.abs(diffDays)} hari`, diffDays: Math.abs(diffDays), color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  }
};
