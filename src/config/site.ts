export const SITE_NAME = "Navorix Exchange";
export const SITE_DESCRIPTION =
  "The premier Solana meme coin launchpad and decentralized exchange. Create, trade, and discover the next moonshot.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://navorix.exchange";

export const NAV_LINKS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Tokens", href: "/tokens", icon: "Coins" },
  { label: "Trending", href: "/trending", icon: "TrendingUp" },
  { label: "Create", href: "/create", icon: "Plus" },
  { label: "Pools", href: "/pools", icon: "Droplets" },
  { label: "Portfolio", href: "/portfolio", icon: "Wallet" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
