import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TransactionStatus, UserRole } from '../types';
import { Users, FileText, Check, X, ShieldAlert, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { transactions, users, updateTransactionStatus, toggleUserBan } = useData();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'transactions' | 'users'>('transactions');

  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    if (confirm(`Change transaction status to ${newStatus}?`)) {
      updateTransactionStatus(id, newStatus);
    }
  };

  const handleBanToggle = (id: string) => {
    if (confirm("Are you sure you want to toggle ban status for this user?")) {
      toggleUserBan(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020b1c] p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark dark:text-white flex items-center gap-3">
              <ShieldAlert className="text-brand-gold" /> Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">System Overview & Control Panel</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
             <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-brand-darker p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/5">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-2xl font-bold text-brand-dark dark:text-white mt-2">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-brand-darker p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/5">
            <h3 className="text-gray-500 text-sm font-medium">Total Transactions</h3>
            <p className="text-2xl font-bold text-brand-dark dark:text-white mt-2">{transactions.length}</p>
          </div>
           <div className="bg-white dark:bg-brand-darker p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/5">
            <h3 className="text-gray-500 text-sm font-medium">Pending Approvals</h3>
            <p className="text-2xl font-bold text-brand-gold mt-2">
              {transactions.filter(t => t.status === TransactionStatus.PENDING).length}
            </p>
          </div>
          <div className="bg-white dark:bg-brand-darker p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/5">
            <h3 className="text-gray-500 text-sm font-medium">Total Volume</h3>
             <p className="text-2xl font-bold text-brand-dark dark:text-white mt-2">
             ${transactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
           </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'transactions' 
                ? 'bg-brand-gold text-brand-darker shadow-lg' 
                : 'bg-white dark:bg-brand-darker text-gray-600 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} /> Transactions
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'users' 
                ? 'bg-brand-gold text-brand-darker shadow-lg' 
                : 'bg-white dark:bg-brand-darker text-gray-600 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} /> Users
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-brand-darker rounded-xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden">
          {activeTab === 'transactions' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Users</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{tx.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <div><span className="text-xs text-gray-500">Creator:</span> {users.find(u => u.id === tx.createdBy)?.email || tx.createdBy}</div>
                        <div><span className="text-xs text-gray-500">With:</span> {tx.counterparty}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand-dark dark:text-white">
                        {tx.currency} {tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                          ${tx.status === TransactionStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                            tx.status === TransactionStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {tx.status !== TransactionStatus.COMPLETED && tx.status !== TransactionStatus.CANCELLED && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(tx.id, TransactionStatus.COMPLETED)}
                              className="text-green-600 hover:text-green-800 p-1 bg-green-100 rounded"
                              title="Mark Complete"
                            >
                              <Check size={16} />
                            </button>
                             <button 
                              onClick={() => handleStatusChange(tx.id, TransactionStatus.CANCELLED)}
                              className="text-red-600 hover:text-red-800 p-1 bg-red-100 rounded"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {tx.status === TransactionStatus.PENDING && (
                           <button 
                              onClick={() => handleStatusChange(tx.id, TransactionStatus.FUNDED)}
                              className="text-blue-600 hover:text-blue-800 p-1 bg-blue-100 rounded"
                              title="Mark Funded"
                            >
                              <span className="text-xs font-bold">$</span>
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-full mr-3" src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt="" />
                          <div>
                            <div className="text-sm font-medium text-brand-dark dark:text-white">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                          ${u.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== UserRole.ADMIN && (
                          <button
                            onClick={() => handleBanToggle(u.id)}
                            className={`text-sm px-3 py-1 rounded border transition-colors ${
                              u.isBanned 
                                ? 'border-green-500 text-green-500 hover:bg-green-50' 
                                : 'border-red-500 text-red-500 hover:bg-red-50'
                            }`}
                          >
                            {u.isBanned ? 'Unban' : 'Ban User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
