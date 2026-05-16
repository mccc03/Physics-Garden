import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.physicsgarden.quartz',
  appName: 'Physics Garden',
  webDir: 'public', // Keep this as 'public' for Quartz
  bundledWebRuntime: false,
  server: {
    url: 'https://soficcc.github.io/Physics-Garden/', // 👈 Paste your live site URL here
    cleartext: true,
    allowNavigation: [
      'soficcc.github.io' // 👈 Your root domain to keep internal links inside the app
    ]
  }
};

export default config;
