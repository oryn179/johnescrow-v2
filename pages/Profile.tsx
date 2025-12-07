import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Calendar, Shield, Camera, Save, X, Edit2, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Failed to update password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white dark:bg-brand-darker rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        
        {/* Header Background */}
        <div className="h-32 bg-brand-dark relative overflow-hidden">
           <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-brand-gold/20 rounded-full blur-[60px]" />
           <div className="absolute bottom-[-50%] left-[-10%] w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[60px]" />
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-brand-darker overflow-hidden bg-brand-gold shadow-lg">
                <img 
                  src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=D4AF37&color=fff`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-brand-gold text-brand-darker p-1.5 rounded-full border-2 border-white dark:border-brand-darker shadow-sm">
                   <Camera size={14} />
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-sm font-medium"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
               <button 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, avatar: user.avatar || '' });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-brand-dark dark:text-white mb-1">
                    {isEditing ? 'Edit Profile' : user.name}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    {user.role} Account
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-400 font-semibold mb-1">Full Name</label>
                    {isEditing ? (
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold text-brand-dark dark:text-white text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-brand-dark dark:text-white p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                   <div>
                    <label className="block text-xs uppercase text-gray-400 font-semibold mb-1">Avatar URL</label>
                    {isEditing ? (
                      <div className="relative">
                        <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.avatar}
                          onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold text-brand-dark dark:text-white text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-500 p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent">
                         <Camera className="h-4 w-4 text-gray-400" />
                         <span className="truncate">{user.avatar || 'Default Avatar'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                    <div className="flex justify-start">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-darker font-bold rounded-lg shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : (
                          <>
                            <Save size={18} /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                 )}
              </form>
            </div>

            {/* Right Column: Read-only Stats & Password Change */}
            <div className="space-y-6">
               <div className="bg-brand-lightBg dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5">
                  <h3 className="font-semibold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                     <Shield className="h-4 w-4 text-brand-gold" /> Account Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase text-gray-400 font-semibold mb-1">Email Address</label>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                         <Mail className="h-4 w-4 text-gray-400" />
                         <span>{user.email}</span>
                      </div>
                    </div>

                     <div>
                      <label className="block text-xs uppercase text-gray-400 font-semibold mb-1">User ID</label>
                      <div className="flex items-center gap-3 text-gray-500 font-mono text-xs">
                         <span className="bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">{user.id}</span>
                      </div>
                    </div>

                     <div>
                      <label className="block text-xs uppercase text-gray-400 font-semibold mb-1">Member Since</label>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                         <Calendar className="h-4 w-4 text-gray-400" />
                         <span>{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
               </div>
               
               {/* Change Password Card */}
               <div className="bg-brand-lightBg dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5">
                  <h3 className="font-semibold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                     <Lock className="h-4 w-4 text-brand-gold" /> Security
                  </h3>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="Current Password"
                        required
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-brand-darker border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold text-brand-dark dark:text-white text-sm"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="New Password"
                        required
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-brand-darker border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold text-brand-dark dark:text-white text-sm"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        required
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-brand-darker border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold text-brand-dark dark:text-white text-sm"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>

                    {passwordMessage && (
                      <div className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                        passwordMessage.type === 'success' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                         {passwordMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                         {passwordMessage.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {passwordLoading ? 'Updating...' : 'Change Password'}
                    </button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};