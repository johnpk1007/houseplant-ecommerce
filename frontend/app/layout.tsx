import type { Metadata } from "next";
import { Playfair_Display, Bebas_Neue, Roboto } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Header from "@/components/header/header";
import AuthInitializer from "@/components/layout/authInitializer";
import { Toaster } from 'react-hot-toast';
import { getAllCartItem } from "@/services/serverSide/common";

export const metadata: Metadata = {
  title: "Houseplant E-commerce portfolio",
  description: "Portfolio project: a houseplant e-commerce demo site demonstrating cart, checkout, and order management features.",
  openGraph: {
    images: ["/images/Landing_1_mobile.webp"]
  },
};

// const playfairDisplay = Playfair_Display({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-playfairDisplay',
// })

// const bebasNeue = Bebas_Neue({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-bebasNeue',
//   weight: "400"
// })

// const roboto = Roboto({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-roboto',
// })

// const vogueFont = localFont({
//   src: '../public/fonts/Vogue.ttf',
//   display: 'swap',
//   variable: '--font-vogue',
// })

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialCart = await getAllCartItem()

  return (
    <html lang="en"
    // className={`${playfairDisplay.variable} ${vogueFont.variable} ${bebasNeue.variable} ${roboto.variable}`}
    >
      <body className="min-h-screen flex flex-col relative">
        <AuthInitializer initialCart={initialCart} />
        <Toaster
          toastOptions={{
            success: {
              iconTheme: {
                primary: 'white',
                secondary: 'black',
              },
              style: {
                background: 'black',
                color: 'white',
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
          initialCart={initialCart}
        />
        <main className="flex-1 w-full max-w-[1923px] mx-auto">
          {children}
        </main>
      </body>
    </html >
  );
}
