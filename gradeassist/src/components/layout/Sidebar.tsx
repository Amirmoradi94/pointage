"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { BookOpen, Home, Settings, ChevronUp, LogOut, CreditCard, User } from "lucide-react";
import { api } from "@/lib/trpc/client";
import { PlanType } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const { data: subscription } = api.subscription.getCurrent.useQuery();

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getPlanDisplayName = (planType: PlanType | undefined) => {
    switch (planType) {
      case PlanType.FREE:
        return "Free Plan";
      case PlanType.STARTER:
        return "Starter Plan";
      case PlanType.STANDARD:
        return "Standard Plan";
      case PlanType.PRO:
        return "Pro Plan";
      case PlanType.CUSTOM:
        return "Custom Plan";
      default:
        return "Free Plan";
    }
  };

  const handleUpgradeClick = () => {
    setIsOpen(false);
    const currentPlan = subscription?.planType || PlanType.FREE;
    router.push(`/pricing?upgrade=${currentPlan}`);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ redirectUrl: "/" });
  };

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userInitial = userEmail.charAt(0).toUpperCase() || "U";
  const currentPlan = subscription?.planType || PlanType.FREE;

  return (
    <aside className="fixed inset-y-0 hidden w-64 border-r border-gray-800 bg-black px-6 py-6 lg:flex lg:flex-col">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
            P
          </span>
          <span className="text-white">Pointage</span>
        </Link>
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
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
            pathname === "/settings"
              ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Settings className={`h-4 w-4 ${pathname === "/settings" ? "text-indigo-400" : "text-gray-500"}`} />
          <span>Settings</span>
        </Link>
      </nav>
      
      {/* User Menu at Bottom */}
      <div className="mt-auto pt-4 border-t border-gray-800 relative">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              ref={triggerRef}
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-medium">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">{userEmail}</p>
                <p className="text-xs text-gray-400 truncate">{getPlanDisplayName(currentPlan)}</p>
              </div>
              <ChevronUp className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="bg-gray-900 border-gray-800 text-white shadow-xl"
            style={{ width: triggerWidth ? `${triggerWidth}px` : undefined }}
            side="top"
            sideOffset={8}
            alignOffset={0}
          >
            <div className="px-3 py-2 border-b border-gray-800">
              <p className="text-sm font-medium text-white truncate">{userEmail}</p>
              <p className="text-xs text-gray-400">{getPlanDisplayName(currentPlan)}</p>
            </div>
            <DropdownMenuItem 
              className="text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer focus:bg-white/10 focus:text-white"
              onClick={() => {
                setIsOpen(false);
                router.push("/settings");
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer focus:bg-white/10 focus:text-white"
              onClick={handleUpgradeClick}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {currentPlan === PlanType.FREE ? "Upgrade Plan" : "Manage Subscription"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer focus:bg-white/10 focus:text-white"
              onClick={() => {
                setIsOpen(false);
                openUserProfile();
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Manage Account
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem 
              className="text-gray-300 hover:bg-red-500/10 hover:text-red-400 cursor-pointer focus:bg-red-500/10 focus:text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
