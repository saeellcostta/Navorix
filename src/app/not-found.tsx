import Link from "next/link";
import { Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-7xl font-extrabold text-gradient-gold">404</div>
      <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">Page Not Found</h1>
      <p className="mb-8 text-sm text-[var(--text-secondary)] max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist. Maybe the token mint address is invalid?
      </p>
      <div className="flex gap-3">
        <Link href="/" className={buttonVariants()}>
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link href="/tokens" className={buttonVariants({ variant: "outline" })}>
          <Search className="h-4 w-4" />
          Browse Tokens
        </Link>
      </div>
    </div>
  );
}
