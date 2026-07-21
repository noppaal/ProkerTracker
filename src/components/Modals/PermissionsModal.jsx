import React from 'react';
import { X, Shield, Users, CheckCircle, Lock, Code } from 'lucide-react';
import { PERMISSIONS_MATRIX } from '../../data/googleAppsScript';

export const PermissionsModal = ({
  isOpen,
  onClose,
  currentRole
}) => {
  if (!isOpen) return null;

  const getRoleLabel = (r) => {
    if (r === 'TB' || r === 'ADMIN') return 'Transfer Bisnis (TB)';
    if (r === 'IT') return 'IT Dept';
    return 'Karyawan';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm">Matriks Hak Akses (RBAC Matrix - 3 Role)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs">Role Akun Saat Ini:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                {getRoleLabel(currentRole)}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-bold">
                  <th className="py-3 px-4">Fitur / Operasi Sistem</th>
                  <th className="py-3 px-4 text-center w-28 bg-amber-500/10 text-amber-900 font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span>TB</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center w-28 bg-purple-500/10 text-purple-900 font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Code className="w-3.5 h-3.5 text-purple-600" />
                      <span>IT</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center w-28 bg-blue-500/10 text-blue-900 font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>KARYAWAN</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {PERMISSIONS_MATRIX.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {item.feature}
                    </td>
                    
                    {/* TB Access */}
                    <td className="py-2.5 px-4 text-center bg-amber-500/5">
                      {item.tb ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400 mx-auto" />
                      )}
                    </td>

                    {/* IT Access */}
                    <td className="py-2.5 px-4 text-center bg-purple-500/5">
                      {item.it ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-rose-500 mx-auto" />
                      )}
                    </td>

                    {/* Karyawan Access */}
                    <td className="py-2.5 px-4 text-center bg-blue-500/5">
                      {item.karyawan ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-rose-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
          >
            Tutup Matriks
          </button>
        </div>

      </div>
    </div>
  );
};
