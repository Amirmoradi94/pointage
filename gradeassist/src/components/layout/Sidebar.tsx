"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Layers, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 hidden w-72 border-r border-gray-800 bg-black px-6 py-6 lg:flex lg:flex-col">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
            P
          </span>
          <span className="text-white">Pointage</span>
        </Link>
        <p className="mt-2 text-sm text-gray-400">
          AI grading with human-in-the-loop review.
        </p>
      </div>
      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-gray-500"}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-md border border-dashed border-gray-800 bg-white/5 p-3 text-xs text-gray-400">
        Upload assignments, launch a batch, and review AI grades here.
      </div>
    </aside>
  );
}
