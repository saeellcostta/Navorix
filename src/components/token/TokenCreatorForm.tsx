"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertTriangle, CheckCircle, Zap, Info } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { useSolBalance } from "@/hooks/useSolBalance";
import { TOKEN_CREATION_FEE_SOL } from "@/config/solana";
import type { TokenCreateInput } from "@/types/token";

const DEFAULTS: TokenCreateInput = {
  name: "",
  symbol: "",
  description: "",
  image: null,
  decimals: 6,
  initialSupply: 1_000_000_000,
};

export function TokenCreatorForm() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const { balance } = useSolBalance();

  const [form, setForm] = useState<TokenCreateInput>(DEFAULTS);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ mintAddress: string; signature: string } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const hasEnoughSol = balance !== null && balance >= TOKEN_CREATION_FEE_SOL + 0.05;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      setVisible(true);
      return;
    }

    if (!hasEnoughSol) {
      toast.error(`Insufficient SOL. You need at least ${TOKEN_CREATION_FEE_SOL + 0.05} SOL.`);
      return;
    }

    if (!form.name.trim()) {
      toast.error("Token name is required");
      return;
    }
    if (!form.symbol.trim()) {
      toast.error("Token symbol is required");
      return;
    }

    setLoading(true);
    try {
      // TODO: call createSplToken() once backend signer is wired up
      // const result = await createSplToken(connection, wallet, form);
      // setResult(result);
      toast.info(
        "Token creation: wire up createSplToken() in src/services/solana/tokenService.ts"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Token creation failed");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardBody className="text-center space-y-4 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--positive)]/10 mx-auto">
            <CheckCircle className="h-8 w-8 text-[var(--positive)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Token Created!</h2>
          <div className="rounded-lg bg-[var(--surface-2)] p-3 text-left space-y-2">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Mint Address</p>
              <p className="text-sm font-mono text-[var(--gold)] break-all">{result.mintAddress}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Transaction</p>
              <a
                href={`https://solscan.io/tx/${result.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-[var(--gold)] break-all hover:underline"
              >
                {result.signature}
              </a>
            </div>
          </div>
          <Button onClick={() => setResult(null)} variant="outline" className="w-full">
            Create Another
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {/* Wallet warning */}
      {!connected && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-dim)] p-4">
          <AlertTriangle className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--gold)]">Wallet required</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Connect your Phantom, Solflare, or Backpack wallet to create a token.
            </p>
          </div>
        </div>
      )}

      {/* SOL balance warning */}
      {connected && !hasEnoughSol && (
        <div className="flex items-start gap-3 rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 p-4">
          <AlertTriangle className="h-5 w-5 text-[#ef4444] shrink-0 mt-0.5" />
          <p className="text-sm text-[#ef4444]">
            You need at least {TOKEN_CREATION_FEE_SOL + 0.05} SOL. Current balance:{" "}
            {balance?.toFixed(4) ?? "—"} SOL
          </p>
        </div>
      )}

      {/* Basic info card */}
      <Card>
        <CardHeader>
          <CardTitle>Token Info</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Token Name"
            placeholder="e.g. Navorix Coin"
            maxLength={32}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            hint="Maximum 32 characters"
            required
          />
          <Input
            label="Token Symbol"
            placeholder="e.g. NVX"
            maxLength={10}
            value={form.symbol}
            onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value.toUpperCase() }))}
            hint="Up to 10 uppercase characters"
            required
          />
          <Textarea
            label="Description"
            placeholder="Describe your token..."
            maxLength={280}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            hint={`${form.description.length}/280 characters`}
          />
        </CardBody>
      </Card>

      {/* Image upload card */}
      <Card>
        <CardHeader>
          <CardTitle>Token Image</CardTitle>
        </CardHeader>
        <CardBody>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)] p-8 cursor-pointer hover:border-[var(--border-strong)] transition-colors"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Token preview"
                className="h-24 w-24 rounded-xl object-cover border border-[var(--border)]"
              />
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gold-dim)]">
                  <Upload className="h-6 w-6 text-[var(--gold)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Click to upload image
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </CardBody>
      </Card>

      {/* Token parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Token Parameters</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Decimals"
            type="number"
            min={0}
            max={9}
            value={form.decimals}
            onChange={(e) => setForm((f) => ({ ...f, decimals: parseInt(e.target.value) || 6 }))}
            hint="Standard: 6 (like USDC on Solana)"
          />
          <Input
            label="Initial Supply"
            type="number"
            min={1}
            value={form.initialSupply}
            onChange={(e) =>
              setForm((f) => ({ ...f, initialSupply: parseInt(e.target.value) || 1_000_000_000 }))
            }
            hint="How many tokens to mint initially"
          />
        </CardBody>
      </Card>

      {/* Fee info */}
      <div className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <Info className="h-4 w-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-muted)] space-y-0.5">
          <p>
            <span className="font-semibold text-[var(--text-secondary)]">Creation fee:</span>{" "}
            {TOKEN_CREATION_FEE_SOL} SOL (platform) + ~0.02 SOL (rent + gas)
          </p>
          <p>
            Tokens are minted to your connected wallet. You own the mint authority.
          </p>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="xl"
        className="w-full"
        loading={loading}
        leftIcon={<Zap className="h-5 w-5" />}
      >
        {!connected ? "Connect Wallet to Create" : "Create Token on Solana"}
      </Button>
    </form>
  );
}
