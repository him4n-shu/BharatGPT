import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import '../styles/custom.css';
import '../styles/hero-animations.css';
import '../styles/search-results.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'BharatGPT - Your DESI AI Assistant for Local Problems',
  description: 'BharatGPT helps with Anganwadi form filling, pani bill complaint, sarkari yojana info in Hindi and regional languages',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-background min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}