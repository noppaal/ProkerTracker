import React, { useState } from 'react';
import { Lock, Mail, Shield, Users, Code, Plus, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';

export const UserManagementPanel = ({
  users = [],
  onRegisterUser,
  onUpdateUserList
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('KARYAWAN');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password reset inline state
  const [editingUserId, setEditingUserId] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleAddUser = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Semua kolom pendaftaran akun wajib diisi!');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      setErrorMsg('Email sudah terdaftar!');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role
    };

    onRegisterUser(newUser);
    setName('');
    setEmail('');
    setPassword('');
    setRole('KARYAWAN');
    setSuccessMsg(`Akun baru untuk "${newUser.name}" berhasil dibuat!`);
  };

  const handleResetPassword = (userId) => {
    if (!newPasswordVal.trim()) {
      alert('Password baru tidak boleh kosong!');
      return;
    }

    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPasswordVal.trim() };
      }
      return u;
    });

    onUpdateUserList(updated);
    setEditingUserId(null);
    setNewPasswordVal('');
    alert('Password pengguna berhasil diubah!');
  };

  const handleDeleteUser = (userId, userName) => {
    if (userId === 'usr-admin') {
      alert('Akun admin utama tidak dapat dihapus!');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${userName}"?`)) {
      const updated = users.filter(u => u.id !== userId);
      onUpdateUserList(updated);
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Create User Form Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-blue-600" />
          <span>Daftarkan Akun Pengguna Baru</span>
        </h3>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ahmad Hidayat"
              required
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Pengguna</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
              required
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password Awal</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-10 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Peran / Hak Akses (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="TB">Transformasi Bisnis (Business Admin)</option>
              <option value="IT">IT (Developer / Deployment)</option>
              <option value="KARYAWAN">Karyawan (Staff / Reviewer)</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambahkan Pengguna</span>
            </button>
          </div>
        </form>
      </div>

      {/* User List Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-slate-600" />
          <span>Daftar Pengguna Terdaftar ({users.length})</span>
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3">Nama Pengguna</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map((u) => {
                const isEditing = editingUserId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-rose-100 text-rose-800' :
                        u.role === 'TB' ? 'bg-amber-100 text-amber-800' :
                        u.role === 'IT' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role === 'ADMIN' ? 'ADMIN' : u.role === 'TB' ? 'TB' : u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1.5 rounded-lg">
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPasswordVal}
                                onChange={(e) => setNewPasswordVal(e.target.value)}
                                placeholder="Password baru"
                                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-[11px] outline-none w-32 focus:border-blue-600"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <button
                              onClick={() => handleResetPassword(u.id)}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-[10px]"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => { setEditingUserId(null); setNewPasswordVal(''); }}
                              className="px-2.5 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded font-bold text-[10px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUserId(u.id);
                                setNewPasswordVal('');
                                setShowNewPassword(false);
                              }}
                              className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 font-bold"
                            >
                              Ganti Password
                            </button>
                            {u.id !== 'usr-admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 hover:text-rose-700 transition-colors"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
