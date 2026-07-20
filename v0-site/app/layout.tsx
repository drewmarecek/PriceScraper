import type { Metadata } from "next";
import Script from "next/script";
import BookingModalProvider from "./components/BookingModalProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PriceRadarAPI | AI Receptionists That Never Miss a Call",
  description:
    "PriceRadarAPI deploys AI receptionists that answer every call, book appointments, and capture leads 24/7 — so you never lose another customer to a missed call.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Warm up the connection to the GHL booking server before any CTA click */}
        <link
          rel="preconnect"
          href="https://api.leadconnectorhq.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <BookingModalProvider>{children}</BookingModalProvider>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xgunj9ol16");`}
        </Script>
      </body>
    </html>
  );
}
