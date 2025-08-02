import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'LiveKit',
  pageTitle: 'LokSeva AI',
  pageDescription: 'A voice agent built with LiveKit',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '/logo.png',
  

  accent: '#f2b100ff',
  logoDark: '/government.svg',
  accentDark: '#1fd5f9',
  startButtonText: 'Start call',
};
