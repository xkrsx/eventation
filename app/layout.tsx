import './globals.scss';
import type { Metadata } from 'next';
import Header from './common/Header/Header';

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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
