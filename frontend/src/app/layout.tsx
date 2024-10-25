import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DashboardWrapper from './dashboardWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Minerva',
  description: 'Generated by create next app',
  icons: {
    icon: '/logo.ico', 
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <DashboardWrapper>{children}</DashboardWrapper>
      </body>
    </html>
  );
}
