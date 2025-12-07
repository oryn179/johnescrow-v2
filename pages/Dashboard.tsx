import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { TransactionStatus } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions } = useData();
  const [filter, setFilter] = useState('All');

  // Filter transactions created by this user
  const myTransactions = transactions.filter(tx => tx.createdBy === user?.id);

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED: return 'text-green-500 bg-green-500/10 border-green-500/20';
      case TransactionStatus.FUNDED: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case TransactionStatus.IN_PROGRESS: return 'text-brand-gold bg-brand-gold/10 border-brand-gold/20';
      case TransactionStatus.CANCELLED: return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link 
          to="/create-escrow" 
          className="inline-flex items-center px-6 py-3 bg-brand-gold hover:bg-brand-goldHover text-brand-darker font-bold rounded-lg shadow-lg transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Transaction
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-brand-darker border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-500 text-sm font-medium">Active Escrows</h3>
             <Clock className="text-brand-gold h-5 w-5" />
           </div>
           <p className="text-3xl font-bold text-brand-dark dark:text-white">
             {myTransactions.filter(t => t.status !== TransactionStatus.COMPLETED && t.status !== TransactionStatus.CANCELLED).length}
           </p>
        </div>
        <div className="bg-white dark:bg-brand-darker border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
             <CheckCircle className="text-green-500 h-5 w-5" />
           </div>
           <p className="text-3xl font-bold text-brand-dark dark:text-white">
             {myTransactions.filter(t => t.status === TransactionStatus.COMPLETED).length}
           </p>
        </div>
        <div className="bg-white dark:bg-brand-darker border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-500 text-sm font-medium">Total Volume</h3>
             <span className="text-gray-400 text-xs">USD</span>
           </div>
           <p className="text-3xl font-bold text-brand-dark dark:text-white">
             ${myTransactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
           </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-brand-darker rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-brand-dark dark:text-white">Recent Transactions</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-brand-dark dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Counterparty</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {myTransactions.length > 0 ? (
                myTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-500">#{tx.id.split('_')[1]}</td>
                    <td className="px-6 py-4 font-medium text-brand-dark dark:text-white">{tx.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.counterparty}</td>
                    <td className="px-6 py-4 font-bold text-brand-dark dark:text-white">
                      {tx.currency} {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/track/${tx.id}`} className="text-brand-gold hover:underline text-sm font-medium">View</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-10 w-10 mb-4 opacity-50" />
                      <p>No transactions found. Start a new escrow today.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
