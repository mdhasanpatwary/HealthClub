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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(dbStore.getCurrentUser());
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
    if (path === "/") return pathname === "/";
    if (path.startsWith("/#")) return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-primary"
            onClick={() => setIsOpen(false)}
          >
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
                  <Button variant="ghost" size="sm">লগইন</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                    সদস্য হোন
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              <div className="relative h-6 w-6">
                <X
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                    isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
                  }`}
                />
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                    isOpen ? "opacity-0 -rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          id="mobile-menu"
          className={`md:hidden border-b border-border bg-background overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-3 pt-2 pb-1 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-border mx-3 pt-3 pb-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2 pb-2 border-b border-border/60">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="truncate">{user.name}</span>
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
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">লগইন</Button>
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
      </header>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 md:hidden backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
