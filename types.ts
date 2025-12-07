export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum TransactionStatus {
  PENDING = 'Pending',
  FUNDED = 'Funded',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  DISPUTED = 'Disputed'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isBanned?: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  currency: string;
  role: 'Buyer' | 'Seller' | 'Broker';
  counterparty: string;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}