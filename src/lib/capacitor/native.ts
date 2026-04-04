/**
 * Capacitor native plugin initialization.
 * Safe to import on web — all calls are no-ops when not running in a native container.
 */

import { Capacitor } from "@capacitor/core";

let initialized = false;

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export async function initNativePlugins(): Promise<void> {
  if (initialized || !isNative()) return;
  initialized = true;

  try {
    // Status Bar — dark content, transparent background
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0b1120" });
  } catch {
    // Plugin not available
  }

  try {
    // Splash Screen — hide after app loads
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch {
    // Plugin not available
  }

  try {
    // Keyboard — setup scroll behavior
    const { Keyboard } = await import("@capacitor/keyboard");
    await Keyboard.setScroll({ isDisabled: false });
  } catch {
    // Plugin not available
  }

  try {
    // App — handle back button on Android
    const { App } = await import("@capacitor/app");
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch {
    // Plugin not available
  }
}

/**
 * Trigger haptic feedback (light impact).
 * No-op on web.
 */
export async function hapticLight(): Promise<void> {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Plugin not available
  }
}

/**
 * Trigger haptic feedback (medium impact).
 */
export async function hapticMedium(): Promise<void> {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Plugin not available
  }
}

/**
 * Trigger success haptic notification.
 */
export async function hapticSuccess(): Promise<void> {
  if (!isNative()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Plugin not available
  }
}
