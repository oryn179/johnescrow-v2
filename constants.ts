import { TransactionStatus, Transaction } from './types';

export const APP_NAME = "Johnescrow";
export const ADMIN_EMAIL = "JohnAdmin@John.escrow";
// Ideally this is hashed on backend, but for this demo/mock we store plainly to verify
export const ADMIN_PASSWORD_MOCK = "JOHN-Imade-this=with=25stars-only!@"; 

export const THEME_KEY = "johnescrow-theme";
export const AUTH_KEY = "johnescrow-auth";
export const DATA_USERS_KEY = "johnescrow-users";
export const DATA_TX_KEY = "johnescrow-transactions";

export const MOCK_INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_123456',
    title: 'Web Development Services',
    amount: 1500,
    currency: 'USD',
    role: 'Buyer',
    counterparty: 'DevStudio LLC',
    status: TransactionStatus.IN_PROGRESS,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'user_1',
  },
  {
    id: 'tx_789012',
    title: 'Rolex Submariner Watch',
    amount: 12500,
    currency: 'USD',
    role: 'Seller',
    counterparty: 'WatchCollector99',
    status: TransactionStatus.FUNDED,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdBy: 'user_2',
  },
];