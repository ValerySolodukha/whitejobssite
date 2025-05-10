import './globals.css';
import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';

const heebo = Heebo({ subsets: ['hebrew'] });

export const metadata: Metadata = {
  title: 'לוח דרושים למגייסים פרילנסרים',
  description: 'מצא את ההזדמנות הבאה שלך בתחום הגיוס',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>{children}</body>
    </html>
  );
}