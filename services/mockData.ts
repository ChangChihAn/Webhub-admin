import { AppStatus, AppSubmission, Developer, User, UserRole } from '../types';

export const MOCK_USER: User = {
  id: 'u-1',
  full_name: 'Alex Administrator',
  email: 'admin@webhub.com',
  role: UserRole.ADMIN,
  profile_picture_url: 'https://picsum.photos/200',
  is_email_verified: true,
  is_active: true,
  last_login_at: '2024-05-20T10:00:00Z',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-05-20T10:00:00Z'
};

export const MOCK_DEVELOPERS: Developer[] = [
  { id: 'dev-1', name: 'Sarah Tech', email: 'sarah@example.com', joinedAt: '2023-11-15T10:00:00Z', status: 'ACTIVE' },
  { id: 'dev-2', name: 'Fast Apps Inc.', email: 'contact@fastapps.com', joinedAt: '2024-01-20T14:30:00Z', status: 'ACTIVE' },
  { id: 'dev-3', name: 'Indie Coder', email: 'indie@code.net', joinedAt: '2024-03-05T09:15:00Z', status: 'SUSPENDED' },
];

export const MOCK_SUBMISSIONS: AppSubmission[] = [
  {
    id: 'sub-101',
    appId: 'app-alpha',
    appName: 'TaskMaster Pro',
    developerId: 'dev-1',
    developerName: 'Sarah Tech',
    submittedAt: '2024-05-10T08:45:00Z',
    status: AppStatus.IN_REVIEW,
    version: '1.0.2',
    sourceUrl: '#',
    previewUrl: 'https://www.wikipedia.org/', // Safe URL for demo
    manifest: {
      name: 'TaskMaster Pro',
      version: '1.0.2',
      description: 'The ultimate task management tool for professionals.',
      permissions: ['storage', 'notifications'],
      themeColor: '#3b82f6',
      icons: [{ src: 'icon.png', sizes: '192x192', type: 'image/png' }]
    },
    securityChecklist: [
      { id: 'chk-1', label: 'No mixed content (HTTP/HTTPS)', checked: false, required: true },
      { id: 'chk-2', label: 'Content Security Policy valid', checked: false, required: true },
      { id: 'chk-3', label: 'No suspicious external requests', checked: false, required: true },
      { id: 'chk-4', label: 'Manifest valid', checked: true, required: true },
    ]
  },
  {
    id: 'sub-102',
    appId: 'app-beta',
    appName: 'Pixel Editor',
    developerId: 'dev-2',
    developerName: 'Fast Apps Inc.',
    submittedAt: '2024-05-11T11:20:00Z',
    status: AppStatus.IN_REVIEW,
    version: '2.1.0',
    sourceUrl: '#',
    previewUrl: 'https://example.com',
    manifest: {
      name: 'Pixel Editor',
      version: '2.1.0',
      description: 'Edit pixels in your browser.',
      permissions: ['file-system-access'],
      themeColor: '#ef4444',
      icons: [{ src: 'icon.png', sizes: '512x512', type: 'image/png' }]
    },
    securityChecklist: [
      { id: 'chk-1', label: 'No mixed content (HTTP/HTTPS)', checked: false, required: true },
      { id: 'chk-2', label: 'Content Security Policy valid', checked: false, required: true },
      { id: 'chk-3', label: 'No suspicious external requests', checked: false, required: true },
    ]
  },
  {
    id: 'sub-103',
    appId: 'app-gamma',
    appName: 'Crypto Tracker',
    developerId: 'dev-3',
    developerName: 'Indie Coder',
    submittedAt: '2024-05-12T09:00:00Z',
    status: AppStatus.REJECTED,
    rejectionReason: 'Suspicious permissions requested.',
    version: '0.9.0',
    sourceUrl: '#',
    previewUrl: 'about:blank',
    manifest: {
      name: 'Crypto Tracker',
      version: '0.9.0',
      description: 'Track your crypto.',
      permissions: ['clipboard-read', 'clipboard-write', 'network'],
      themeColor: '#10b981',
      icons: []
    },
    securityChecklist: []
  }
];