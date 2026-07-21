import React from 'react';
import { X, Shield, Users, CheckCircle, Lock } from 'lucide-react';
import { PERMISSIONS_MATRIX } from '../../data/googleAppsScript';

export const PermissionsModal = ({
  isOpen,
  onClose,
  currentRole
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-2xs">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-[#E9E9E7] shadow-lg overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-3 bg-[#F7F6F3] border-b border-[#E9E9E7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D9730D]" />
            <h2 className="font-bold text-[#37352F]">Matriks Hak Akses (RBAC Matrix)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#E9E9E7] text-[#787774]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div className="p-3 bg-[#F7F6F3] rounded-lg border border-[#E9E9E7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#37352F]">Role Akun Saat Ini:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                currentRole === 'ADMIN' ? 'bg-[#FBF3DB] text-[#D9730D]' : 'bg-[#E8F3F6] text-[#2E75D4]'
              }`}>
                {currentRole === 'ADMIN' ? 'ADMIN' : 'MEMBER'}
              </span>
            </div>
          </div>

          <div className="border border-[#E9E9E7] rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F6F3] border-b border-[#E9E9E7] text-[11px] text-[#787774] font-bold">
                  <th className="py-2.5 px-3">Fitur / Operasi Sistem</th>
                  <th className="py-2.5 px-3 text-center w-28 bg-[#FBF3DB]/60 text-[#D9730D]">
                    <div className="flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>ADMIN</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center w-28 bg-[#E8F3F6]/60 text-[#2E75D4]">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>MEMBER</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEC] text-[11px]">
                {PERMISSIONS_MATRIX.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F6F3]/50">
                    <td className="py-2 px-3 font-medium text-[#37352F]">
                      {item.feature}
                    </td>
                    
                    {/* Admin Access */}
                    <td className="py-2 px-3 text-center bg-[#FBF3DB]/20">
                      {item.admin ? (
                        <CheckCircle className="w-4 h-4 text-[#448361] mx-auto" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#9B9A97] mx-auto" />
                      )}
                    </td>

                    {/* Member Access */}
                    <td className="py-2 px-3 text-center bg-[#E8F3F6]/20">
                      {item.member ? (
                        <CheckCircle className="w-4 h-4 text-[#448361] mx-auto" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#C4554D] mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div className="p-3 bg-[#F7F6F3] border-t border-[#E9E9E7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2383E2] hover:bg-[#1D74C9] text-white font-bold"
          >
            Tutup Matriks
          </button>
        </div>

      </div>
    </div>
  );
};
