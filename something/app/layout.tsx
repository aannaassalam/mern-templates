import './globals.css';

import localFont from 'next/font/local';
import { Toaster } from 'sonner';

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import Providers from './provider';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

// export const dynamic = 'force-dynamic';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} m-0 h-full p-0 antialiased`}
      >
        <ErrorBoundary>
          <Providers>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
        </ErrorBoundary>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
