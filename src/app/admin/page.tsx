"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Coins, BarChart3, Trash2, Edit2,
  Zap, Rocket, CheckCircle, XCircle, RefreshCw,
  TrendingUp, Users, Droplets, Shield, LogOut,
  Palette, Upload, Save, Eye, EyeOff
} from "lucide-react";

const ADMIN_WALLET = "FvmN4BnLKR25QWXXoLof2RZFzwC8XU3QLcPr1aJg1UvQ";

type Tab = "dashboard" | "tokens" | "customize";

interface TokenRow {
  mint_address: string;
  name: string;
  symbol: string;
  status: string;
  creator_wallet: string;
  created_at: string;
  escrow_sol: number;
  image_url: string;
}

interface Stats {
  totalTokens: number;
  liveTokens: number;
  launchingTokens: number;
  totalTrades: number;
  totalVolumeSol: number;
  totalUsers: number;
}

export default function AdminPage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Customização
  const [siteName, setSiteName] = useState("Navorix Exchange");
  const [logoEmoji, setLogoEmoji] = useState("⚡");
  const [primaryColor, setPrimaryColor] = useState("#fbbf24");
  const [bgColor, setBgColor] = useState("#08080f");

  const isAdmin = connected && publicKey?.toBase58() === ADMIN_WALLET;

  useEffect(() => {
    if (!connected) return;
    if (!isAdmin) {
      router.push("/");
      return;
    }
    fetchData();
  }, [connected, isAdmin]);

  async function fetchData() {
    setLoading(true);
    try {
      const [tokensRes, statsRes] = await Promise.all([
        fetch("/api/admin/tokens"),
        fetch("/api/admin/stats"),
      ]);
      if (tokensRes.ok) setTokens(await tokensRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch {}
    setLoading(false);
  }

  async function handleDeleteToken(mint: string) {
    if (!confirm("Tem certeza que quer deletar este token?")) return;
    const res = await fetch(`/api/admin/tokens/${mint}`, { method: "DELETE" });
    if (res.ok) {
      setTokens(t => t.filter(x => x.mint_address !== mint));
      showMessage("success", "Token deletado!");
    } else {
      showMessage("error", "Erro ao deletar token.");
    }
  }

  async function handleUpdateStatus(mint: string, status: string) {
    const res = await fetch(`/api/admin/tokens/${mint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setTokens(t => t.map(x => x.mint_address === mint ? { ...x, status } : x));
      showMessage("success", `Status atualizado para ${status}!`);
    } else {
      showMessage("error", "Erro ao atualizar status.");
    }
  }

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  if (!connected) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.lockCard}>
          <Shield size={48} color="#fbbf24" />
          <h2 style={styles.lockTitle}>Área Restrita</h2>
          <p style={styles.lockDesc}>Conecte sua carteira de administrador para continuar.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.lockCard}>
          <XCircle size={48} color="#ef4444" />
          <h2 style={styles.lockTitle}>Acesso Negado</h2>
          <p style={styles.lockDesc}>Esta carteira não tem permissão de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Shield size={20} color="#fbbf24" />
          <span style={styles.headerTitle}>Painel Admin</span>
          <span style={styles.headerBadge}>NAVORIX</span>
        </div>
        <button style={styles.refreshBtn} onClick={fetchData}>
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          ...styles.message,
          background: message.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          borderColor: message.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
          color: message.type === "success" ? "#4ade80" : "#f87171",
        }}>
          {message.type === "success" ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {([
          { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
          { id: "tokens",    label: "Tokens",    icon: <Coins size={14} /> },
          { id: "customize", label: "Visual",    icon: <Palette size={14} /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
          <button
            key={t.id}
            style={{ ...styles.tab, ...(tab === t.id ? styles.tabActive : {}) }}
            onClick={() => setTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === "dashboard" && (
        <div>
          {loading ? (
            <p style={styles.loading}>Carregando...</p>
          ) : stats ? (
            <div style={styles.statsGrid}>
              {[
                { label: "Total Tokens",    value: stats.totalTokens,                    icon: <Coins size={18} />,      color: "#fbbf24" },
                { label: "LIVE",            value: stats.liveTokens,                     icon: <Zap size={18} />,        color: "#4ade80" },
                { label: "Launching",       value: stats.launchingTokens,                icon: <Rocket size={18} />,     color: "#fbbf24" },
                { label: "Total Trades",    value: stats.totalTrades,                    icon: <BarChart3 size={18} />,  color: "#38bdf8" },
                { label: "Volume (SOL)",    value: stats.totalVolumeSol.toFixed(2),      icon: <Droplets size={18} />,   color: "#a78bfa" },
                { label: "Usuários",        value: stats.totalUsers,                     icon: <Users size={18} />,      color: "#f97316" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} style={styles.statCard}>
                  <div style={{ ...styles.statIcon, color }}>{icon}</div>
                  <div style={styles.statValue}>{value}</div>
                  <div style={styles.statLabel}>{label}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.loading}>Sem dados disponíveis.</p>
          )}
        </div>
      )}

      {/* ── TOKENS ── */}
      {tab === "tokens" && (
        <div style={styles.tokenList}>
          {loading ? (
            <p style={styles.loading}>Carregando tokens...</p>
          ) : tokens.length === 0 ? (
            <p style={styles.loading}>Nenhum token encontrado.</p>
          ) : tokens.map(token => (
            <div key={token.mint_address} style={styles.tokenCard}>
              <div style={styles.tokenInfo}>
                {token.image_url ? (
                  <img src={token.image_url} alt={token.symbol} style={styles.tokenImg} />
                ) : (
                  <div style={styles.tokenImgFallback}>{token.symbol?.slice(0, 2)}</div>
                )}
                <div>
                  <div style={styles.tokenName}>{token.name}</div>
                  <div style={styles.tokenSymbol}>${token.symbol}</div>
                  <div style={styles.tokenMint}>{token.mint_address.slice(0, 12)}...</div>
                </div>
              </div>

              <div style={styles.tokenActions}>
                {/* Status badge */}
                <span style={{
                  ...styles.statusBadge,
                  background: token.status === "live" ? "rgba(34,197,94,0.1)" : "rgba(251,191,36,0.1)",
                  color: token.status === "live" ? "#4ade80" : "#fbbf24",
                  border: `1px solid ${token.status === "live" ? "rgba(34,197,94,0.3)" : "rgba(251,191,36,0.3)"}`,
                }}>
                  {token.status === "live" ? <Zap size={10} /> : <Rocket size={10} />}
                  {token.status?.toUpperCase()}
                </span>

                {/* Toggle status */}
                <button
                  style={styles.actionBtn}
                  onClick={() => handleUpdateStatus(
                    token.mint_address,
                    token.status === "live" ? "launching" : "live"
                  )}
                  title="Mudar status"
                >
                  <Edit2 size={12} />
                </button>

                {/* Delete */}
                <button
                  style={{ ...styles.actionBtn, color: "#f87171" }}
                  onClick={() => handleDeleteToken(token.mint_address)}
                  title="Deletar token"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CUSTOMIZE ── */}
      {tab === "customize" && (
        <div style={styles.customizeCard}>
          <h3 style={styles.customizeTitle}>Personalização do Site</h3>
          <p style={styles.customizeDesc}>
            As alterações visuais são salvas localmente. Para mudanças permanentes, edite o código-fonte.
          </p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nome do Site</label>
            <input
              style={styles.input}
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              placeholder="Navorix Exchange"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Emoji / Ícone da Logo</label>
            <input
              style={styles.input}
              value={logoEmoji}
              onChange={e => setLogoEmoji(e.target.value)}
              placeholder="⚡"
              maxLength={2}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cor Principal</label>
            <div style={styles.colorRow}>
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                style={styles.colorPicker}
              />
              <input
                style={styles.input}
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                placeholder="#fbbf24"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cor de Fundo</label>
            <div style={styles.colorRow}>
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                style={styles.colorPicker}
              />
              <input
                style={styles.input}
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                placeholder="#08080f"
              />
            </div>
          </div>

          <div style={styles.customizeNote}>
            <p>Para mudar a logo por uma imagem, faça upload em:</p>
            <code style={styles.code}>public/logo.png</code>
            <p style={{ marginTop: 8 }}>E edite o Navbar.tsx para usar:</p>
            <code style={styles.code}>{'<img src="/logo.png" alt="Logo" className="h-8 w-8" />'}</code>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" },
  centerPage: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" },
  lockCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "#0d0d1a" },
  lockTitle: { fontSize: "1.25rem", fontWeight: 700, color: "#f9fafb", margin: 0 },
  lockDesc: { fontSize: "0.875rem", color: "#6b7280", margin: 0, textAlign: "center" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" },
  headerLeft: { display: "flex", alignItems: "center", gap: "0.5rem" },
  headerTitle: { fontSize: "1.25rem", fontWeight: 700, color: "#f9fafb" },
  headerBadge: { fontSize: "0.6875rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 999, background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" },
  refreshBtn: { display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: "0.8125rem" },
  message: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: 10, border: "1px solid", marginBottom: "1rem", fontSize: "0.875rem" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" },
  tab: { display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 },
  tabActive: { background: "rgba(251,191,36,0.1)", color: "#fbbf24" },
  loading: { color: "#6b7280", textAlign: "center", padding: "2rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" },
  statCard: { background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" },
  statIcon: { marginBottom: "0.25rem" },
  statValue: { fontSize: "1.5rem", fontWeight: 800, color: "#f9fafb" },
  statLabel: { fontSize: "0.75rem", color: "#6b7280", textAlign: "center" },
  tokenList: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  tokenCard: { background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" },
  tokenInfo: { display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 },
  tokenImg: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  tokenImgFallback: { width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #1c1c38, #2d2d5a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fbbf24", flexShrink: 0 },
  tokenName: { fontSize: "0.875rem", fontWeight: 700, color: "#f9fafb" },
  tokenSymbol: { fontSize: "0.75rem", color: "#fbbf24" },
  tokenMint: { fontSize: "0.6875rem", color: "#6b7280", fontFamily: "monospace" },
  tokenActions: { display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 },
  statusBadge: { display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.6875rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 999 },
  actionBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#9ca3af", cursor: "pointer" },
  customizeCard: { background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" },
  customizeTitle: { fontSize: "1rem", fontWeight: 700, color: "#f9fafb", margin: 0 },
  customizeDesc: { fontSize: "0.8125rem", color: "#6b7280", margin: 0 },
  formGroup: { display: "flex", flexDirection: "column", gap: "0.375rem" },
  label: { fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af" },
  input: { background: "#13132a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "0.625rem 0.875rem", color: "#f9fafb", fontSize: "0.875rem", outline: "none", width: "100%" },
  colorRow: { display: "flex", gap: "0.5rem", alignItems: "center" },
  colorPicker: { width: 40, height: 40, borderRadius: 8, border: "none", cursor: "pointer", padding: 2 },
  customizeNote: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1rem", fontSize: "0.8125rem", color: "#6b7280" },
  code: { display: "block", background: "#13132a", borderRadius: 6, padding: "0.375rem 0.625rem", fontFamily: "monospace", fontSize: "0.75rem", color: "#fbbf24", marginTop: 4 },
};
