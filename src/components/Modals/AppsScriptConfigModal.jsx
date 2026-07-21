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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-2xs">
      <div className="bg-white w-full max-w-xl rounded-xl border border-[#E9E9E7] shadow-lg overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-3 bg-[#F7F6F3] border-b border-[#E9E9E7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#787774]" />
            <h2 className="font-bold text-[#37352F]">Google Sheets API Konfigurasi</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#E9E9E7] text-[#787774]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-[#E9E9E7] bg-[#F7F6F3] px-3">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-[#2383E2] text-[#2383E2]'
                : 'border-transparent text-[#787774] hover:text-[#37352F]'
            }`}
          >
            Connection Endpoint
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-[#2383E2] text-[#2383E2]'
                : 'border-transparent text-[#787774] hover:text-[#37352F]'
            }`}
          >
            Backend Code (Code.gs)
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'instructions'
                ? 'border-[#2383E2] text-[#2383E2]'
                : 'border-transparent text-[#787774] hover:text-[#37352F]'
            }`}
          >
            Panduan Deploy
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-4">
          
          {activeTab === 'config' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#787774] mb-1">
                  Google Apps Script Web App URL Endpoint *
                </label>
                <input
                  type="url"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full bg-[#F7F6F3] border border-[#E9E9E7] text-[#37352F] text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2383E2]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] text-[#37352F] font-semibold hover:bg-[#EFEEEC]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#2383E2]' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Uji Koneksi'}</span>
                </button>
              </div>

              {testResult && (
                <div className={`p-2.5 rounded-lg text-xs border flex items-start gap-2 ${
                  testResult.status === 'success'
                    ? 'bg-[#EDF3EC] text-[#448361] border-emerald-200 font-bold'
                    : 'bg-[#FDEBEC] text-[#C4554D] border-rose-200 font-semibold'
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
                <span className="font-mono text-[11px] text-[#787774] font-bold">Code.gs</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2383E2] text-white text-[11px] font-bold"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-[#191919] text-[#E3E2E0] font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-2">
              {SETUP_INSTRUCTIONS.map(item => (
                <div key={item.step} className="p-2.5 bg-[#F7F6F3] border border-[#E9E9E7] rounded-lg flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2383E2] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-bold text-[#37352F]">{item.title}</h4>
                    <p className="text-[#787774] text-[11px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="p-3 bg-[#F7F6F3] border-t border-[#E9E9E7] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E9E9E7] text-[#37352F] font-semibold hover:bg-[#EFEEEC]"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#2383E2] hover:bg-[#1D74C9] text-white font-bold shadow-2xs"
          >
            Simpan Endpoint
          </button>
        </div>

      </div>
    </div>
  );
};
