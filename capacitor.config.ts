import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lifeos.tracker",
  appName: "Life OS",
  // Minimal shell for native fallback (no internet)
  webDir: "cap-shell",

  server: {
    // Load from deployed URL — all features work (SSR, dynamic routes, etc.)
    // Change this to your Vercel/production URL
    url: "https://life-os-tracker.vercel.app",
    // For dev: uncomment the line below and comment out the one above
    // url: "http://10.0.2.2:3000",  // Android emulator → localhost
    // url: "http://localhost:3000",  // iOS simulator → localhost
    cleartext: true,
    androidScheme: "https",
  },

  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#0b1120",
      showSpinner: true,
      spinnerColor: "#22d3ee",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
      launchShowDuration: 2000,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0b1120",
    },
    Keyboard: {
      resize: "body" as any,
      resizeOnFullScreen: true,
    },
  },

  android: {
    backgroundColor: "#0b1120",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  ios: {
    backgroundColor: "#0b1120",
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scrollEnabled: true,
  },
};

export default config;
