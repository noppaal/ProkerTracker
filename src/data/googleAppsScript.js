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
  var sheet = ss.getSheetByName("ProkerData");
  
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
    var sheet = ss.getSheetByName("ProkerData");
    
    if (!sheet) {
      sheet = ss.insertSheet("ProkerData");
    }
    
    sheet.getRange("A1").setValue(JSON.stringify(contents.data));
    sheet.getRange("A2").setValue("Last Updated: " + new Date().toISOString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan ke Google Sheets!" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
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
  { feature: 'Melihat Seluruh Projek & Proker Utama', tb: true, it: true, karyawan: true },
  { feature: 'Melihat Status Milestone & Target Date', tb: true, it: true, karyawan: true },
  { feature: 'Mengisi / Mengedit Catatan Sub-Program', tb: true, it: true, karyawan: true },
  { feature: 'Mengupdate Status Development & Deployment', tb: true, it: true, karyawan: false },
  { feature: 'Mengupdate Seluruh Status Milestone (Ureq, Mockup, Test, dll)', tb: true, it: false, karyawan: false },
  { feature: 'Membuat / Edit / Hapus Projek Utama', tb: true, it: false, karyawan: false },
  { feature: 'Membuat / Edit / Hapus Program Kerja Utama', tb: true, it: false, karyawan: false },
  { feature: 'Membuat / Edit / Hapus Sub-Program Kerja', tb: true, it: false, karyawan: false },
  { feature: 'Menentukan Skala Prioritas (P1 - P4)', tb: true, it: false, karyawan: false },
  { feature: 'Menambah / Edit / Hapus Kolom Milestone', tb: true, it: false, karyawan: false },
  { feature: 'Mengatur Koneksi Google Sheets API', tb: true, it: false, karyawan: false }
];
