"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar as CalendarIcon,
  Plus,
  Users,
  Settings,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export function Sidebar({
  className,
  isMobile = false,
  onLinkClick,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/events",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "My Events",
      href: "/my-events",
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      name: "Create Event",
      href: "/events/new",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "Attending",
      href: "/attending",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isMobile ? "h-12" : "h-10",
                isActive ? "font-semibold" : ""
              )}
              onClick={onLinkClick}
            >
              <Link href={item.href}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </Button>
          );
        })}
      </div>

      {!isMobile && (
        <div className="mt-auto p-4 pt-0">
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <h4 className="font-medium mb-1">Upgrade to Pro</h4>
            <p className="text-muted-foreground text-xs mb-3">
              Get access to premium features and remove all limits.
            </p>
            <Button size="sm" className="w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
