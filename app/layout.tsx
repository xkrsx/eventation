import './globals.scss';
import type { Metadata } from 'next';
import Header from './common/Header/Header';
import CookieBanner from './CookieBanner';

export const metadata: Metadata = {
  title: 'Eventation',
  description: 'Eventation description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Header />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
