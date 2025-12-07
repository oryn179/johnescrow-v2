import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, User, TransactionStatus } from '../types';
import { DATA_TX_KEY, DATA_USERS_KEY, MOCK_INITIAL_TRANSACTIONS } from '../constants';

interface DataContextType {
  transactions: Transaction[];
  users: User[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  toggleUserBan: (id: string) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = () => {
    const storedTx = localStorage.getItem(DATA_TX_KEY);
    if (storedTx) {
      setTransactions(JSON.parse(storedTx));
    } else {
      setTransactions(MOCK_INITIAL_TRANSACTIONS);
      localStorage.setItem(DATA_TX_KEY, JSON.stringify(MOCK_INITIAL_TRANSACTIONS));
    }

    const storedUsers = localStorage.getItem(DATA_USERS_KEY);
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem(DATA_TX_KEY, JSON.stringify(updated));
  };

  const updateTransactionStatus = (id: string, status: TransactionStatus) => {
    const updated = transactions.map(t => 
      t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
    );
    setTransactions(updated);
    localStorage.setItem(DATA_TX_KEY, JSON.stringify(updated));
  };

  const toggleUserBan = (id: string) => {
    const updated = users.map(u => 
      u.id === id ? { ...u, isBanned: !u.isBanned } : u
    );
    setUsers(updated);
    localStorage.setItem(DATA_USERS_KEY, JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{ transactions, users, addTransaction, updateTransactionStatus, toggleUserBan, refreshData: loadData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
