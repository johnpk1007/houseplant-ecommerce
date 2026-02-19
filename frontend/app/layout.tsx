import type { Metadata } from "next";
import { Playfair_Display, Bebas_Neue, Roboto } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Header from "@/components/header/header";
import Provider from "@/components/context/context";
import { initialRefresh } from "@/services/auth.server";

export const metadata: Metadata = {
  title: "Houseplant ecommerce"
};

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfairDisplay',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebasNeue',
  weight: "400"
})

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

const vogueFont = localFont({
  src: '../public/fonts/Vogue.ttf',
  display: 'swap',
  variable: '--font-vogue',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = await initialRefresh().catch(() => null);
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${vogueFont.variable} ${bebasNeue.variable} ${roboto.variable}`}>
      <body className="min-h-screen flex flex-col relative">
        <Provider initialAccessToken={accessToken}>
          <Header />
          <main className="flex-1 w-full max-w-[1923px] mx-auto">
            {children}
          </main>
        </Provider>
      </body>
    </html >
  );
}
