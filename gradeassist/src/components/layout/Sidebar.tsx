"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Layers, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 hidden w-72 border-r border-gray-200 bg-white px-6 py-6 lg:flex lg:flex-col">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
            GA
          </span>
          <span>GradeAssist AI</span>
        </Link>
        <p className="mt-2 text-sm text-gray-500">
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
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-white" : "text-gray-500"}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
        Upload assignments, launch a batch, and review AI grades here.
      </div>
    </aside>
  );
}
