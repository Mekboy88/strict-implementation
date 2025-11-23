import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.307fc9ab5a9143178386c524ccfc0903',
  appName: 'youaredev-88',
  webDir: 'dist',
  server: {
    url: 'https://307fc9ab-5a91-4317-8386-c524ccfc0903.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0B0B0C',
      showSpinner: false,
    },
  },
};

export default config;
