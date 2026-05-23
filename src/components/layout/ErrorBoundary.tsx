"use client";

import React from "react";

interface State {
  hasError: boolean;
  message:  string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);

    // Se for erro relacionado à carteira, limpa o localStorage
    if (
      error.message.includes("wallet") ||
      error.message.includes("Wallet") ||
      error.message.includes("public key") ||
      error.message.includes("phantom")
    ) {
      try {
        localStorage.removeItem("walletName");
        for (const key of Object.keys(localStorage)) {
          if (
            key.startsWith("wallet-") ||
            key.startsWith("phantom") ||
            key.startsWith("solflare")
          ) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  handleReset = () => {
    // Limpa tudo e recarrega
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080f",
          color: "#f1f1f1",
          padding: "24px",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Algo deu errado</h1>
        <p style={{ fontSize: 14, color: "#9ca3af", maxWidth: 320 }}>
          Ocorreu um erro ao carregar a página. Clique abaixo para limpar e tentar novamente.
        </p>
        <button
          onClick={this.handleReset}
          style={{
            background: "linear-gradient(135deg, #fbbf24, #d97706)",
            color: "#08080f",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Limpar e Recarregar
        </button>
        <p style={{ fontSize: 11, color: "#6b7280" }}>
          Se o problema persistir, abra em aba anônima ou limpe os dados do site no browser.
        </p>
      </div>
    );
  }
}
