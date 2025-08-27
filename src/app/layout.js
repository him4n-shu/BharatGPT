import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import '../styles/custom.css';
import '../styles/hero-animations.css';
import '../styles/search-results.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthSessionProvider from '../components/SessionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata = {
  metadataBase: new URL('https://bharatgpt.vercel.app'),
  title: 'BharatGPT - Your DESI AI Assistant for Local Problems',
  description: 'BharatGPT helps with Anganwadi form filling, pani bill complaint, sarkari yojana info in Hindi and regional languages',
  icons: {
    icon: [
      {
        url: '/bg-logo.png',
        type: 'image/png',
      }
    ],
    shortcut: '/bg-logo.png',
    apple: '/bg-logo.png',
  },
  openGraph: {
    title: 'BharatGPT - Your DESI AI Assistant',
    description: 'AI-powered assistance for government services in Indian languages',
    images: [
      {
        url: '/bg-logo.png',
        width: 800,
        height: 800,
        alt: 'BharatGPT Logo',
      },
    ],
  },
};

export const viewport = {
  themeColor: '#FF9933',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/bg-logo.png" />
        <link rel="apple-touch-icon" href="/bg-logo.png" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-background min-h-screen flex flex-col`}>
        <AuthSessionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}