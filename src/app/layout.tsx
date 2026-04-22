import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z.ai Code Scaffold - AI-Powered Development",
  description: "Modern Next.js scaffold optimized for AI-powered development with Z.ai. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["Z.ai", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Z.ai Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Script id="remove-extension-attrs" strategy="beforeInteractive">
          {`(() => {
            const prefixMatchers = ['bis_', '__processed_'];
            const shouldRemove = (name) => prefixMatchers.some((prefix) => name.startsWith(prefix));

            const cleanup = () => {
              document.querySelectorAll('*').forEach((element) => {
                Array.from(element.attributes).forEach((attribute) => {
                  if (shouldRemove(attribute.name)) {
                    element.removeAttribute(attribute.name);
                  }
                });
              });
            };

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', cleanup, { once: true });
            } else {
              cleanup();
            }
          })();`}
        </Script>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
