import React, { useState, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, CheckCircle, User, Mail } from 'lucide-react';

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  currentUser,
  users = [],
  onUpdateUserList
}) => {
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      // Load current user details
      const dbUser = users.find(u => u.id === currentUser.id) || currentUser;
      setName(dbUser.name || '');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
      setShowOld(false);
      setShowNew(false);
      setShowConf(false);
    }
  }, [isOpen, currentUser, users]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong!');
      return;
    }

    const dbUser = users.find(u => u.id === currentUser.id) || currentUser;
    const activePass = dbUser.password;

    let shouldChangePassword = false;
    if (oldPassword || newPassword || confirmPassword) {
      shouldChangePassword = true;
    }

    if (shouldChangePassword) {
      if (oldPassword !== activePass) {
        setErrorMsg('Password lama salah!');
        return;
      }

      if (newPassword.trim().length < 3) {
        setErrorMsg('Password baru minimal 3 karakter!');
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMsg('Konfirmasi password baru tidak cocok!');
        return;
      }
    }

    const updated = users.map(u => {
      if (u.id === currentUser.id) {
        const updatedObj = { ...u, name: name.trim() };
        if (shouldChangePassword) {
          updatedObj.password = newPassword.trim();
        }
        return updatedObj;
      }
      return u;
    });

    onUpdateUserList(updated);
    
    // Clear password inputs
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMsg('Profil dan password Anda berhasil diperbarui!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-sm">Kelola Profil</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section: Profil */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Informasi Profil</span>
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ahmad Hidayat"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Email Pengguna (Login ID)</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section: Ganti Password */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Ganti Password (Isi jika ingin mengganti)</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Password Lama</label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Password saat ini"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 pr-10 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Password Baru</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 3 karakter"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 pr-10 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Konfirmasi Password Baru</label>
              <div className="relative">
                <input
                  type={showConf ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 pr-10 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConf(!showConf)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 font-bold"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
