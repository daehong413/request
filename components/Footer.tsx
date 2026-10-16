import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { WindowMark, Arrow } from "./Icons";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-content">
        <div className="footer-main">
          <div>
            <Link className="brand" href="/">
              <WindowMark />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="footer-tagline">여닫을 때마다, 한결같이.</p>
            {(siteConfig.address || siteConfig.regNumber) && <p className="footer-details">
              {siteConfig.address && <>{siteConfig.address}<br /></>}
              {siteConfig.regNumber}
            </p>}
          </div>
          <nav aria-label="푸터 메뉴">
            {siteConfig.nav.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
                <Arrow diagonal />
              </Link>
            ))}
            <Link href="/areas">시공 가능 지역<Arrow diagonal /></Link>
          </nav>
          <div className="footer-contact">
            <span>전국 창호 시공 · 상담 문의</span>
            <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
            <p>{siteConfig.businessHours}</p>
            <a className="footer-email" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <span>기본을 지키는 시공, 오래 이어지는 신뢰.</span>
        </div>
      </div>
    </footer>
  );
}
