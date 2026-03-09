import type { Metadata } from "next";
import { Playfair_Display, Bebas_Neue, Roboto } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Header from "@/components/header/header";
import AuthInitializer from "@/components/layout/authInitializer";
import { Toaster } from 'react-hot-toast';
import { getAllCartItem } from "@/services/serverSide/layout";

export const metadata: Metadata = {
  title: "Houseplant E-commerce"
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
  const cartItemsArray = await getAllCartItem()
  console.log('cartItemsArray:', cartItemsArray)

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${vogueFont.variable} ${bebasNeue.variable} ${roboto.variable}`}>
      <body className="min-h-screen flex flex-col relative">
        <AuthInitializer cartItemsArray={cartItemsArray} />
        <Toaster
          toastOptions={{
            success: {
              iconTheme: {
                primary: 'white',
                secondary: '#4CB051',
              },
              style: {
                background: '#4CB051',
                color: 'white'
              },
            },
            error: {
              iconTheme: {
                primary: 'white',
                secondary: '#F54336',
              },
              style: {
                background: '#F54336',
                color: 'white'
              },
            },
          }}
        />
        <Header
          initialCartItemsArray={cartItemsArray}
        />
        <main className="flex-1 w-full max-w-[1923px] mx-auto">
          {children}
        </main>
      </body>
    </html >
  );
}
