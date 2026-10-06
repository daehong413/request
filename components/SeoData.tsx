import { getSiteOrigin } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { regionPath, type ContactRegion } from "@/lib/contact-regions";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function RegionServiceSeoData({ region }: { region: ContactRegion }) {
  const origin = getSiteOrigin();
  if (!origin) return null;
  const url = new URL(regionPath(region), origin).href;
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${siteConfig.name} ${region.fullName} 창호 교체 상담`,
    description: region.description,
    url,
    serviceType: "창호 교체 상담",
    areaServed: { "@type": "AdministrativeArea", name: region.fullName },
    provider: { "@type": "Organization", "@id": `${origin}/#organization`, name: siteConfig.name, url: `${origin}/` },
  }} />;
}

export function BusinessSeoData() {
  const origin = getSiteOrigin();
  if (!origin) return null;
  const organization = `${origin}/#organization`;
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organization,
        name: siteConfig.name,
        url: `${origin}/`,
        logo: { "@type": "ImageObject", url: `${origin}/icon.png`, width: 192, height: 192 },
        telephone: siteConfig.phone,
        email: siteConfig.email,
        areaServed: { "@type": "Country", name: "대한민국" },
        contactPoint: { "@type": "ContactPoint", telephone: siteConfig.phone, contactType: "customer service", availableLanguage: "ko", areaServed: "KR", url: `${origin}/contact` },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: siteConfig.name,
        url: `${origin}/`,
        inLanguage: "ko-KR",
        publisher: { "@id": organization },
      },
      {
        "@type": "Service",
        "@id": `${origin}/services#service`,
        name: "전국 창호 교체 및 시공 상담",
        serviceType: ["샤시 교체", "이중창 단열 시공", "방범창·방충망 시공"],
        url: `${origin}/services`,
        provider: { "@id": organization },
        areaServed: { "@type": "Country", name: "대한민국" },
      },
    ],
  }} />;
}

export function PageBreadcrumb({ items }: { items: { name: string; path: string }[] }) {
  const origin = getSiteOrigin();
  if (!origin) return null;
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "홈", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, origin).href,
    })),
  }} />;
}
