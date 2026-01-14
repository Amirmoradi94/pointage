"use client";

import { Menu, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-black/50 backdrop-blur-xl border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Home</p>
            <h2 className="text-lg font-semibold text-white">Dashboard</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-gray-800 bg-white/5 px-3 py-2 text-sm text-gray-400 shadow-sm sm:flex">
            <Search className="h-4 w-4 text-gray-500" />
            <span>Search</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
