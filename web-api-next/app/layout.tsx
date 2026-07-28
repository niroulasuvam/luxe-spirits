import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart/cart-context";
import { handleGetCart } from "@/lib/actions/cart-action";

export const metadata: Metadata = {
  title: "Luxe Spirits",
  description: "Member portal for Luxe Spirits.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartResult = await handleGetCart();

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  document.documentElement.classList.toggle("light", localStorage.getItem("luxe_appearance") === "day");
  document.documentElement.classList.remove("dark");
} catch {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider initialCart={cartResult.success ? cartResult.data : undefined}>{children}</CartProvider>
      </body>
    </html>
  );
}
