import React, { useState } from 'react';
import { X, Database, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE, SETUP_INSTRUCTIONS } from '../../data/googleAppsScript';
import { getSavedEndpoint, saveEndpoint, fetchProkerData } from '../../services/apiService';

export const AppsScriptConfigModal = ({
  isOpen,
  onClose,
  onEndpointSaved,
  currentEndpoint = ''
}) => {
  const [endpointUrl, setEndpointUrl] = useState(currentEndpoint || getSavedEndpoint());
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!endpointUrl.trim()) {
      setTestResult({ status: 'error', message: 'Masukkan URL Web App terlebih dahulu.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetchProkerData(endpointUrl.trim());
      if (res.source === 'google_sheets') {
        setTestResult({
          status: 'success',
          message: 'Koneksi Berhasil! Terhubung secara Live dengan Google Apps Script.'
        });
      } else {
        setTestResult({
          status: 'error',
          message: 'Gagal terhubung. Pastikan Web App diset "Who has access: Anyone".'
        });
      }
    } catch (e) {
      setTestResult({
        status: 'error',
        message: `Gagal terhubung ke Google Apps Script: ${e.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveEndpoint(endpointUrl.trim());
    onEndpointSaved(endpointUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <h2 className="font-bold text-sm">Google Sheets API Konfigurasi</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Connection Endpoint
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Backend Code (Code.gs)
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'instructions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Panduan Deploy
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          
          {activeTab === 'config' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Apps Script Web App URL Endpoint *
                </label>
                <input
                  type="url"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-semibold hover:bg-slate-200"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-blue-600' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Uji Koneksi'}</span>
                </button>
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs border flex items-start gap-2 ${
                  testResult.status === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                    : 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-600 font-bold">Code.gs</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-2.5">
              {SETUP_INSTRUCTIONS.map(item => (
                <div key={item.step} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
          >
            Simpan Endpoint
          </button>
        </div>

      </div>
    </div>
  );
};
