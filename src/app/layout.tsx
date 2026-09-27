import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { profile } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.name} — ${profile.role}`;
const description =
  "Software & AI Engineer building AI-enabled software systems across machine learning, computer vision, multimodal AI, full-stack applications and backend engineering — with documented projects, evidence-driven research and production engineering.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    "Software Engineer",
    "AI Engineer",
    "Machine Learning",
    "Computer Vision",
    "Multimodal AI",
    "Full-Stack Developer",
    "Next.js",
    "PyTorch",
    profile.name,
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  applicationName: profile.shortName,
  appleWebApp: {
    capable: true,
    title: profile.shortName,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: `${profile.shortName} — Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#161411" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
  ],
};

/* Structured data — Person/ProfilePage. Only facts from the profile docs. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    alternateName: profile.shortName,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    url: profile.github,
    sameAs: [profile.github, profile.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Attock",
      addressCountry: "PK",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "COMSATS University Islamabad",
    },
    knowsAbout: [...profile.specialization],
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
