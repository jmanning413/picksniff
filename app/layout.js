import { DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: { default: "PickSniff — Find Your Perfect Fragrance", template: "%s — PickSniff" },
  description: "Find your perfect fragrance in minutes. PickSniff matches you to 750 fragrances across every style and budget.",
  openGraph: {
    title: "PickSniff — Find Your Perfect Fragrance",
    description: "Find your perfect fragrance in minutes.",
    siteName: "PickSniff",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#000',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: '9999px',
              border: '1px solid #e4e4e7',
              padding: '12px 20px',
            },
            success: {
              iconTheme: { primary: '#7fe040', secondary: '#000' },
            },
          }}
        />
      </body>
    </html>
  );
}
