"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User, Heart } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Member | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Refresh user state on mount and path changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(dbStore.getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    dbStore.logout();
    setUser(null);
    setIsOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "হোম", path: "/" },
    { name: "সুবিধাসমূহ", path: "/#benefits" },
    { name: "পার্টনার হাসপাতাল", path: "/partner-hospitals" },
    { name: "মেম্বারশিপ প্ল্যান", path: "/membership" },
    { name: "আমাদের সম্পর্কে", path: "/about-us" },
    { name: "যোগাযোগ", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    if (path.startsWith("/#")) {
      return false; // Anchor links
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-primary">
          <Heart className="h-6 w-6 fill-primary" />
          <span className="font-heading text-xl font-bold tracking-tight text-secondary dark:text-white">
            হেলথ <span className="text-primary">ক্লাব</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "bg-primary-light/50 text-primary dark:bg-primary-dark/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              {/* Check if user is admin */}
              {user.email === "admin@healthclub.com.bd" || user.phone === "01700000000" ? (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary-light">
                    <User className="h-4 w-4" />
                    এডমিন প্যানেল
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary-light">
                    <User className="h-4 w-4" />
                    ড্যাশবোর্ড
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                লগআউট
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  লগইন
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                  সদস্য হোন
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer/Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(link.path)
                  ? "bg-primary-light/50 text-primary dark:bg-primary-dark/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-border pt-4 pb-2 space-y-2 px-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm font-semibold text-foreground mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>{user.name}</span>
                </div>
                {user.email === "admin@healthclub.com.bd" || user.phone === "01700000000" ? (
                  <Link href="/admin" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2 border-primary text-primary">
                      এডমিন প্যানেল
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2 border-primary text-primary">
                      ড্যাশবোর্ড
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  লগআউট
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    লগইন
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-dark">
                    সদস্য হোন
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
