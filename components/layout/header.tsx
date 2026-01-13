import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Grant Aggregator
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/grants" className="text-sm font-medium hover:underline">
            Grants
          </Link>
          <Link href="/saved" className="text-sm font-medium hover:underline">
            Saved
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:underline">
            Admin
          </Link>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </nav>
      </div>
    </header>
  );
}
