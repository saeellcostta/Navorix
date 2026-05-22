import type { Metadata } from "next";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { TrendingSection } from "@/components/dashboard/TrendingSection";

export const metadata: Metadata = {
  title: "Navorix Exchange — Solana Meme Coin Launchpad",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <TrendingSection />
    </>
  );
}
