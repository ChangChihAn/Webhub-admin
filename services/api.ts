import { AppStatus, AppSubmission, Developer, User } from '../types';
import { MOCK_DEVELOPERS, MOCK_SUBMISSIONS, MOCK_USER } from './mockData';

const DELAY_MS = 300;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (email: string): Promise<boolean> => {
      await delay(DELAY_MS);
      return email === 'admin@webhub.com';
    },
    verify2FA: async (code: string): Promise<User | null> => {
      await delay(DELAY_MS);
      if (code === '123456') {
        return MOCK_USER;
      }
      return null;
    }
  },
  submissions: {
    list: async (): Promise<AppSubmission[]> => {
      await delay(DELAY_MS);
      return [...MOCK_SUBMISSIONS];
    },
    getById: async (id: string): Promise<AppSubmission | undefined> => {
      await delay(DELAY_MS);
      return MOCK_SUBMISSIONS.find(s => s.id === id);
    },
    updateStatus: async (id: string, status: AppStatus, reason?: string): Promise<void> => {
      await delay(DELAY_MS);
      const sub = MOCK_SUBMISSIONS.find(s => s.id === id);
      if (sub) {
        sub.status = status;
        if (reason) sub.rejectionReason = reason;
      }
    }
  },
  developers: {
    list: async (): Promise<Developer[]> => {
      await delay(DELAY_MS);
      return [...MOCK_DEVELOPERS];
    }
  }
};