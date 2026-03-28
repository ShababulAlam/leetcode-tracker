"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Code2, RefreshCw, Menu, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserId } from "@/lib/user";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [userId, setUserId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/problems", label: "Problems" },
    { href: "/activity", label: "Activity" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center px-4 max-w-6xl">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6 group flex-shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-base tracking-tight">
            LC<span className="text-primary">Tracker</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                isActive(link.href)
                  ? "active text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right side */}
        <TooltipProvider>
          <div className="flex items-center gap-1.5">

            {/* LeetCode Sync — Coming Soon */}
            <Tooltip>
              <TooltipTrigger
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/40 cursor-not-allowed"
                disabled
              >
                <RefreshCw className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs flex items-center gap-1.5">
                <span className="text-amber-400 font-semibold">Coming Soon</span>
                — LeetCode Sync
              </TooltipContent>
            </Tooltip>

            {/* Theme toggle */}
            <Tooltip>
              <TooltipTrigger
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Toggle theme</TooltipContent>
            </Tooltip>

            {/* User avatar — desktop only */}
            <Tooltip>
              <TooltipTrigger className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary cursor-default font-medium hover:bg-primary/20 transition-colors">
                {userId.slice(0, 2).toUpperCase()}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-mono text-xs">
                {userId.slice(0, 8)}
              </TooltipContent>
            </Tooltip>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

          </div>
        </TooltipProvider>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 max-w-6xl py-2 space-y-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
