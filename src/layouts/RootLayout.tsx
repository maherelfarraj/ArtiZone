import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement } from 'react';
import { ScrollRestoration, useLocation } from 'react-router-dom';

import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';
import ChatWidget from '@/components/ChatWidget';

/**
 * Root layout component that wraps all pages with consistent header and footer.
 *
 * To customize the header or footer, directly edit the Header.tsx and Footer.tsx
 * files in the layouts/parts directory.
 *
 * Site-wide <title> and <meta> live in the <Helmet> below. Individual pages can
 * override them by rendering their own <Helmet> — last-mounted wins.
 */
interface RootLayoutProps {
  children: ReactElement;
}

const SITE_URL = 'https://artizonespa.com';

export default function RootLayout({ children }: RootLayoutProps) {
  const location = useLocation();
  const isClientAuth = location.pathname.startsWith('/client');
  const isAdmin = location.pathname.startsWith('/admin');
  const hideChrome = isClientAuth || isAdmin;
  const defaultTitle = 'ArtiZone Beauty & Aesthetic Clinic — Amman, Jordan';
  const defaultDescription = 'Premium beauty and aesthetic treatments for women and men in Amman, Jordan. Skin care, laser hair removal, nails, body slimming, and men\'s grooming at ArtiZone.';
  const defaultOgImage = `${SITE_URL}/airo-assets/images/pages/home/hero`;

  return (
    <Website>
      <Helmet>
        {/* ── Font loading: non-blocking via <link> with display=swap ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZa4ET-DNl0.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap"
        />

        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta property="og:site_name" content="ArtiZone Beauty & Aesthetic Clinic" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:image" content={defaultOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@artizone_clinic" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={defaultOgImage} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#0E2A3A" />
        <meta name="referrer" content="same-origin" />
        <meta name="ICBM" content="31.9539, 35.8833" />
        <meta name="geo.region" content="JO-AM" />
        <meta name="geo.placename" content="Amman, Jordan" />
        <meta name="geo.position" content="31.9539;35.8833" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ArtiZone" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href={`${SITE_URL}${location.pathname}`} />
      </Helmet>
      <ScrollRestoration />
      {!hideChrome && <Header />}
      <main id="main-content">
          {children}
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <ChatWidget />}

    </Website>
  );
}
