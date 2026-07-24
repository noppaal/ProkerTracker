/**
 * ============================================================================
 * PROKER TRACKER - GOOGLE APPS SCRIPT WEB APP BACKEND (Code.gs)
 * ============================================================================
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * PROKER TRACKER - GOOGLE APPS SCRIPT WEB APP BACKEND (Code.gs)
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("SystemData") || ss.getSheetByName("ProkerData");
  
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", data: null, message: "Sheet initialized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var jsonText = sheet.getRange("A1").getValue();
  var parsed = jsonText ? JSON.parse(jsonText) : null;
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", data: parsed }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Save raw data to backend JSON sheet (hidden)
    var systemSheet = ss.getSheetByName("SystemData");
    if (!systemSheet) {
      systemSheet = ss.insertSheet("SystemData");
      systemSheet.hideSheet();
    }
    systemSheet.getRange("A1").setValue(JSON.stringify(contents.data));
    systemSheet.getRange("A2").setValue("Last Updated: " + new Date().toISOString());
    
    // Clear and redraw structured rekap sheet & users sheet
    updateRekapSheet(ss, contents.data);
    updateUsersSheet(ss, contents.data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan ke Google Sheets & Rekap_Table diperbarui!" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function calculateSubProkerProgress(subItem, dynamicMilestones) {
  if (!subItem || !dynamicMilestones || dynamicMilestones.length === 0) return 0;
  
  var totalApplicableMilestones = 0;
  var totalCompletedScore = 0;

  for (var i = 0; i < dynamicMilestones.length; i++) {
    var m = dynamicMilestones[i];
    var milestoneData = (subItem.milestones && subItem.milestones[m.id]) ? subItem.milestones[m.id] : null;
    var status = milestoneData ? milestoneData.status : 'Not Yet';

    if (status !== 'Tidak ada Link Terkait' && status !== 'Tidak ada Mockup' && status !== 'N/A') {
      totalApplicableMilestones++;
      if (status === 'Done') {
        totalCompletedScore += 1.0;
      } else if (status === 'In Progress') {
        totalCompletedScore += 0.5;
      } else if (status === 'Hold') {
        totalCompletedScore += 0.25;
      }
    }
  }

  if (totalApplicableMilestones === 0) return 0;
  return Math.round((totalCompletedScore / totalApplicableMilestones) * 100);
}

function updateRekapSheet(ss, data) {
  var sheet = ss.getSheetByName("Rekap_Table");
  if (!sheet) {
    sheet = ss.insertSheet("Rekap_Table");
  }
  sheet.clear();
  sheet.clearFormats();
  sheet.showSheet();
  
  var projects = data.projects || [];
  var masterProkers = data.masterProkers || [];
  var milestones = data.dynamicMilestones || [];
  
  // Set font
  sheet.getRange(1, 1, 200, 20).setFontFamily("Arial");
  
  var row = 1;
  
  // 1. Title Banner
  sheet.getRange(row, 1, 1, 12).merge()
    .setValue("REKAPITULASI PROGRAM KERJA (PROKER) & SUB-PROGRAM")
    .setFontSize(13)
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#1E3A8A")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(row, 36);
  
  row += 2;
  
  // 2. Section 1 Header
  sheet.getRange(row, 1).setValue("1. Program Kerja Utama").setFontWeight("bold").setFontSize(11);
  row += 1;
  
  var projHeader = ["ID/Kode", "Program Kerja Utama", "Tahun", "Deskripsi", "Progress (%)"];
  var projHeaderRange = sheet.getRange(row, 1, 1, projHeader.length);
  projHeaderRange.setValues([projHeader])
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#2563EB")
    .setHorizontalAlignment("center");
  
  var projRows = [];
  for (var i = 0; i < projects.length; i++) {
    var proj = projects[i];
    var subProkers = masterProkers.filter(function(p) { return p.projectId === proj.id; });
    var avgProgress = 0;
    if (subProkers.length > 0) {
      var totalProg = 0;
      for (var j = 0; j < subProkers.length; j++) {
        totalProg += calculateSubProkerProgress(subProkers[j], milestones);
      }
      avgProgress = Math.round(totalProg / subProkers.length);
    }
    
    projRows.push([
      proj.code || "",
      proj.name || "",
      proj.year || "",
      proj.description || "",
      avgProgress / 100
    ]);
  }
  
  if (projRows.length > 0) {
    var projBodyRange = sheet.getRange(row + 1, 1, projRows.length, projHeader.length);
    projBodyRange.setValues(projRows);
    sheet.getRange(row + 1, 5, projRows.length, 1).setNumberFormat("0.0%");
    
    var projTableRange = sheet.getRange(row, 1, projRows.length + 1, projHeader.length);
    projTableRange.setBorder(true, true, true, true, true, true, "#CBD5E1", SpreadsheetApp.BorderStyle.SOLID);
    
    row += projRows.length;
  }
  
  row += 3;
  
  // 3. Section 2 Header
  sheet.getRange(row, 1).setValue("2. Detail Sub-Program Kerja & Milestone Stages").setFontWeight("bold").setFontSize(11);
  row += 1;
  
  var subHeader = ["Kode", "Sub Program Kerja", "Parent Proker", "Link Terkait", "Prioritas", "Catatan Spek", "Catatan Teknis"];
  for (var k = 0; k < milestones.length; k++) {
    subHeader.push(milestones[k].name);
  }
  subHeader.push("Progress (%)");
  
  var subHeaderRange = sheet.getRange(row, 1, 1, subHeader.length);
  subHeaderRange.setValues([subHeader])
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#475569")
    .setHorizontalAlignment("center");
  
  var subRows = [];
  for (var i = 0; i < masterProkers.length; i++) {
    var proker = masterProkers[i];
    var parentProj = projects.find(function(p) { return p.id === proker.projectId; });
    var parentCode = parentProj ? parentProj.code : "";
    
    var rowData = [
      proker.code || "",
      proker.name || "",
      parentCode,
      proker.relatedLink || "",
      proker.priority || "P2",
      proker.specNotes || proker.notes || "",
      proker.techNotes || ""
    ];
    
    for (var k = 0; k < milestones.length; k++) {
      var m = milestones[k];
      var milestoneData = (proker.milestones && proker.milestones[m.id]) ? proker.milestones[m.id] : null;
      var status = milestoneData ? milestoneData.status : "Not Yet";
      rowData.push(status);
    }
    
    var progressVal = calculateSubProkerProgress(proker, milestones);
    rowData.push(progressVal / 100);
    
    subRows.push(rowData);
  }
  
  if (subRows.length > 0) {
    var subBodyRange = sheet.getRange(row + 1, 1, subRows.length, subHeader.length);
    subBodyRange.setValues(subRows);
    sheet.getRange(row + 1, subHeader.length, subRows.length, 1).setNumberFormat("0.0%");
    
    var subTableRange = sheet.getRange(row, 1, subRows.length + 1, subHeader.length);
    subTableRange.setBorder(true, true, true, true, true, true, "#CBD5E1", SpreadsheetApp.BorderStyle.SOLID);
    
    for (var r = 0; r < subRows.length; r++) {
      for (var colIdx = 8; colIdx < 8 + milestones.length; colIdx++) {
        var cell = sheet.getRange(row + 1 + r, colIdx);
        var val = cell.getValue();
        if (val === "Done") {
          cell.setBackground("#D1FAE5").setFontColor("#065F46");
        } else if (val === "In Progress") {
          cell.setBackground("#DBEAFE").setFontColor("#1E40AF");
        } else if (val === "Hold") {
          cell.setBackground("#FEF3C7").setFontColor("#92400E");
        } else if (val === "Not Yet") {
          cell.setBackground("#F1F5F9").setFontColor("#475569");
        } else if (val === "Cancel") {
          cell.setBackground("#FEE2E2").setFontColor("#991B1B");
        } else if (val === "Tidak ada Link Terkait" || val === "Tidak ada Mockup" || val === "N/A") {
          cell.setBackground("#F3E8FF").setFontColor("#6B21A8");
        }
      }
    }
  }
  
  for (var col = 1; col <= subHeader.length; col++) {
    sheet.autoResizeColumn(col);
    var currentWidth = sheet.getColumnWidth(col);
    sheet.setColumnWidth(col, Math.min(Math.max(currentWidth + 12, 65), 280));
  }
}

function updateUsersSheet(ss, data) {
  var sheet = ss.getSheetByName("Daftar_User");
  if (!sheet) {
    sheet = ss.insertSheet("Daftar_User");
  }
  sheet.clear();
  sheet.clearFormats();
  sheet.showSheet();
  
  var usersList = data.users || [];
  
  // Set font
  sheet.getRange(1, 1, 100, 5).setFontFamily("Arial");
  
  var row = 1;
  
  // 1. Title Banner
  sheet.getRange(row, 1, 1, 5).merge()
    .setValue("DAFTAR AKUN PENGGUNA (SYSTEM USERS)")
    .setFontSize(12)
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#0F172A")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(row, 30);
  
  row += 2;
  
  // Header Table
  var headers = ["User ID", "Nama Lengkap", "Email", "Password (Plain Text)", "Role / Hak Akses"];
  var headerRange = sheet.getRange(row, 1, 1, headers.length);
  headerRange.setValues([headers])
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#334155")
    .setHorizontalAlignment("center");
  
  var userRows = [];
  for (var i = 0; i < usersList.length; i++) {
    var u = usersList[i];
    userRows.push([
      u.id || "",
      u.name || "",
      u.email || "",
      u.password || "",
      u.role || ""
    ]);
  }
  
  if (userRows.length > 0) {
    var bodyRange = sheet.getRange(row + 1, 1, userRows.length, headers.length);
    bodyRange.setValues(userRows);
    
    var tableRange = sheet.getRange(row, 1, userRows.length + 1, headers.length);
    tableRange.setBorder(true, true, true, true, true, true, "#CBD5E1", SpreadsheetApp.BorderStyle.SOLID);
    
    // Auto-fit column widths
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }
}
`;

export const SETUP_INSTRUCTIONS = [
  { step: 1, title: 'Buat Spreadsheet Baru', desc: 'Buka Google Sheets (sheets.new) dan buat spreadsheet baru bernama "Database Proker Tracker".' },
  { step: 2, title: 'Buka Apps Script Editor', desc: 'Klik menu Extensions -> Apps Script pada Google Sheets.' },
  { step: 3, title: 'Salin & Tempel Kode', desc: 'Hapus kode yang ada, tempelkan kode Apps Script yang disediakan di atas, lalu simpan (Ctrl + S).' },
  { step: 4, title: 'Lakukan Deployment Web App', desc: 'Klik tombol Deploy -> New deployment. Pilih type: Web app. Set "Execute as: Me" dan "Who has access: Anyone".' },
  { step: 5, title: 'Salin Web App URL', desc: 'Beri izin otorisasi (Authorize access), lalu salin URL Web App yang berakhiran /exec.' },
  { step: 6, title: 'Hubungkan ke ProkerTrack', desc: 'Tempelkan URL Web App tersebut pada form input di atas dan klik "Uji & Simpan Koneksi".' }
];

export const PERMISSIONS_MATRIX = [
  { feature: 'Melihat Seluruh Projek & Proker Utama', admin: true, tb: true, it: true, karyawan: true },
  { feature: 'Melihat Status Milestone & Target Date', admin: true, tb: true, it: true, karyawan: true },
  { feature: 'Mengisi / Mengedit Catatan Sub-Program', admin: false, tb: true, it: true, karyawan: true },
  { feature: 'Mengupdate Status Development & Deployment', admin: false, tb: true, it: true, karyawan: false },
  { feature: 'Mengupdate Seluruh Status Milestone (Ureq, Mockup, Test, dll)', admin: false, tb: true, it: false, karyawan: false },
  { feature: 'Membuat / Edit / Hapus Projek Utama', admin: false, tb: true, it: false, karyawan: false },
  { feature: 'Membuat / Edit / Hapus Program Kerja Utama', admin: false, tb: true, it: false, karyawan: false },
  { feature: 'Membuat / Edit / Hapus Sub-Program Kerja', admin: false, tb: true, it: false, karyawan: false },
  { feature: 'Menentukan Skala Prioritas (P1 - P4)', admin: false, tb: true, it: false, karyawan: false },
  { feature: 'Menambah / Edit / Hapus Kolom Milestone', admin: false, tb: true, it: false, karyawan: false },
  { feature: 'Mengatur Koneksi Google Sheets API', admin: false, tb: true, it: false, karyawan: false },
  { feature: 'Mengelola Akun Pengguna & Reset Password', admin: true, tb: false, it: false, karyawan: false }
];
