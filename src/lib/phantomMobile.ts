/**
 * Phantom Mobile Deep Link Utility
 *
 * Handles wallet connection on mobile browsers where the Phantom
 * browser extension is not available.
 *
 * Flow (Chrome Android / iOS Safari):
 *  1. User taps "Connect Wallet" on mobile
 *  2. We detect: no window.phantom → mobile browser
 *  3. Build a Phantom deep link URL: https://phantom.app/ul/v1/connect
 *  4. Encode dapp URL + callback URI as params
 *  5. Redirect user → Phantom app opens, user approves
 *  6. Phantom redirects back to our app with the public key
 *  7. We read the public key from the URL params
 *
 * Reference: https://docs.phantom.app/phantom-deeplinks/deeplinks-ios-and-android
 */

import { SITE_URL } from "@/config/site";

const PHANTOM_DEEPLINK_BASE = "https://phantom.app/ul/v1";

/**
 * Returns true when running on a mobile browser WITHOUT the Phantom extension.
 * On desktop, Phantom injects window.phantom so this returns false.
 */
export function isPhantomMobileRequired(): boolean {
  if (typeof window === "undefined") return false;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hasPhantomExtension = !!(window as { phantom?: unknown }).phantom;
  return isMobile && !hasPhantomExtension;
}

/**
 * Returns true if the app is running inside the Phantom in-app browser.
 */
export function isInsidePhantomBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.userAgent.includes("Phantom");
}

/**
 * Build the Phantom deep link URL for connecting a wallet.
 *
 * @param redirectPath — path to redirect to after connection (default: current page)
 * @returns Full Phantom deep link URL
 */
export function buildPhantomConnectUrl(redirectPath?: string): string {
  const appUrl  = SITE_URL;
  const redirect = `${SITE_URL}${redirectPath ?? window.location.pathname}`;

  const params = new URLSearchParams({
    dapp_encryption_public_key: "", // Not needed for basic connect
    cluster:   "mainnet-beta",
    app_url:   appUrl,
    redirect_link: redirect,
  });

  return `${PHANTOM_DEEPLINK_BASE}/connect?${params.toString()}`;
}

/**
 * Redirect to Phantom app for wallet connection (mobile only).
 * On desktop the standard wallet modal is used instead.
 */
export function openPhantomConnect(redirectPath?: string): void {
  if (typeof window === "undefined") return;
  const url = buildPhantomConnectUrl(redirectPath);
  window.location.href = url;
}

/**
 * Parse the public key from URL params after Phantom redirects back.
 * Call this on page load if isPhantomMobileRequired() was true.
 *
 * @returns Solana public key string, or null if not present
 */
export function parsePhantomCallbackParams(): {
  publicKey: string | null;
  errorCode: string | null;
  errorMessage: string | null;
} {
  if (typeof window === "undefined") {
    return { publicKey: null, errorCode: null, errorMessage: null };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    publicKey:    params.get("phantom_encryption_public_key") ?? params.get("public_key"),
    errorCode:    params.get("errorCode"),
    errorMessage: params.get("errorMessage"),
  };
}
