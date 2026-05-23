/**
 * Phantom Mobile Utility
 *
 * Para web apps mobile, o fluxo correto é:
 *   Abrir o site DENTRO do browser embutido do Phantom
 *   → carteira conectada automaticamente
 *
 * URL: https://phantom.app/ul/browse/{siteUrl}?ref={siteUrl}
 *
 * NÃO usar o protocolo /connect com criptografia — esse é para apps nativos.
 */

import { SITE_URL } from "@/config/site";

/**
 * Retorna true quando no mobile SEM a extensão Phantom instalada.
 */
export function isPhantomMobileRequired(): boolean {
  if (typeof window === "undefined") return false;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hasExtension = !!(window as { phantom?: unknown }).phantom;
  return isMobile && !hasExtension;
}

/**
 * Retorna true quando rodando dentro do browser embutido do Phantom.
 */
export function isInsidePhantomBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.userAgent.includes("Phantom");
}

/**
 * Redireciona o usuário para abrir o site no browser do Phantom.
 * Depois disso, a carteira estará disponível normalmente via wallet adapter.
 */
export function openInPhantomBrowser(): void {
  if (typeof window === "undefined") return;

  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedRef = encodeURIComponent(SITE_URL);

  // Abre o site dentro do Phantom in-app browser
  window.location.href = `https://phantom.app/ul/browse/${encodedUrl}?ref=${encodedRef}`;
}

/**
 * Limpa os parâmetros de erro do Phantom da URL sem recarregar a página.
 */
export function clearPhantomUrlParams(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  if (params.has("errorCode") || params.has("errorMessage")) {
    params.delete("errorCode");
    params.delete("errorMessage");
    const newUrl = window.location.pathname + (params.toString() ? `?${params}` : "");
    window.history.replaceState({}, "", newUrl);
  }
}
