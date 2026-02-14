import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";

export const metadata: Metadata = {
  title: "Houseplant ecommerce"
};

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfairDisplay',
})

const vogueFont = localFont({
  src: '../public/fonts/Vogue.ttf',
  display: 'swap',
  variable: '--font-vogue',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.className} ${vogueFont.variable}`}>
      <body className="min-h-screen flex flex-col">
        <main className="flex-1 w-full max-w-[1923px] mx-auto">
          {children}
        </main>
      </body>
    </html >
  );
}
