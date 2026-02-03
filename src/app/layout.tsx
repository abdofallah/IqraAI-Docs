import { Metadata } from 'next';
import { i18n, rightToLeftLanguages } from '@/lib/i18n';
import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://docs.iqra.bot'),
  title: {
    template: '%s | Iqra AI Docs',
    default: 'Iqra AI Docs',
  },
  description: 'The platform for Conversational AI Agents.',
  openGraph: {
    images: '/og.png',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: '/og.png',
  }
};

export default async function Layout({ params, children }: {
  params: Promise<{ lang?: string }>;
  children: React.ReactNode;
}) {
  const { lang = i18n.defaultLanguage } = await params;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" dir={rightToLeftLanguages.includes(lang) ? 'rtl' : 'ltr'}>
        {children}
        <script defer src="https://umami.badal.om/script.js" data-website-id="b06ff4c3-d567-4360-8d9e-931d57de674f"></script>
      </body>
    </html>
  );
}
