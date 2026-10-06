import Script from "next/script";

const GTM_ID = "GTM-NX4232Q5";

function isEnabled() {
  return process.env.NODE_ENV === "production" &&
    !["preview", "development"].includes(process.env.VERCEL_ENV ?? "");
}

export default function GoogleTagManager() {
  if (!isEnabled()) return null;

  return (
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`}
      </Script>
  );
}

export function GoogleTagManagerNoScript() {
  if (!isEnabled()) return null;
  return (
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
  );
}
