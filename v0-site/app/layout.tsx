import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import BookingModalProvider from "./components/BookingModalProvider";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PriceRadarAPI | AI Receptionist That Answers Every Call, 24/7",
  description:
    "PriceRadarAPI answers your business calls around the clock — greets callers, handles questions, books appointments, and routes conversations with context.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://api.leadconnectorhq.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={sans.className}>
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
