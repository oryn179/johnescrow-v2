import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TransactionStatus } from '../types';

export const CreateEscrow: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTransaction } = useData();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    role: 'Buyer',
    counterparty: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addTransaction({
      title: formData.title,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      role: formData.role as 'Buyer' | 'Seller' | 'Broker',
      counterparty: formData.counterparty,
      status: TransactionStatus.PENDING,
      description: formData.description,
      createdBy: user.id
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white dark:bg-brand-darker rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="bg-brand-dark p-6">
          <h1 className="text-2xl font-bold text-white">Create New Escrow</h1>
          <p className="text-gray-300 text-sm mt-1">Start a secure transaction in seconds.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title of Transaction</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent text-brand-dark dark:text-white"
                placeholder="e.g. Domain Purchase"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am the...</label>
              <select
                name="role"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent text-brand-dark dark:text-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
                <option value="Broker">Broker</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
              <select
                name="currency"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent text-brand-dark dark:text-white"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                required
                min="1"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent text-brand-dark dark:text-white"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Counterparty Email / Username</label>
            <input
              type="text"
              name="counterparty"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent text-brand-dark dark:text-white"
              placeholder="Who are you dealing with?"
              value={formData.counterparty}
              onChange={handleChange}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description / Terms</label>
             <textarea
               name="description"
               rows={4}
               className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent text-brand-dark dark:text-white"
               placeholder="Describe the item or service and agreed terms..."
               value={formData.description}
               onChange={handleChange}
             />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-4">
             <button
               type="button"
               onClick={() => navigate('/dashboard')}
               className="px-6 py-3 text-gray-700 dark:text-gray-300 font-medium hover:text-brand-gold transition-colors"
             >
               Cancel
             </button>
             <button
               type="submit"
               className="px-8 py-3 bg-brand-gold hover:bg-brand-goldHover text-brand-darker font-bold rounded-lg shadow-lg transform active:scale-95 transition-all"
             >
               Create Transaction
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
