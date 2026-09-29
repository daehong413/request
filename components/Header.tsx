"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Arrow, WindowMark } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header ref={header} className="site-header">
      <div className="container-content header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} 홈`}>
          <WindowMark />
          <span>
            {siteConfig.name}
            <small>KOOKMIN WINDOW</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="주 메뉴">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                pathname === item.href
                  ? "page"
                  : item.href !== "/" && pathname.startsWith(`${item.href}/`)
                    ? "location"
                    : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/contact" className="button button-primary header-cta">
            무료 견적 상담
            <Arrow diagonal />
          </Link>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <span className={open ? "menu-lines is-open" : "menu-lines"}>
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-menu"
        className="mobile-nav"
        hidden={!open}
        aria-label="모바일 주 메뉴"
      >
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={
              pathname === item.href
                ? "page"
                : item.href !== "/" && pathname.startsWith(`${item.href}/`)
                  ? "location"
                  : undefined
            }
          >
            {item.label}
            <Arrow />
          </Link>
        ))}
      </nav>
    </header>
  );
}
