import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Train } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Train Ticket Booking",
  description: "Book your train tickets easily and securely",
};

const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Train className="h-6 w-6" />
            <span className="inline-block font-bold">TrainTicket</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Search
            </Link>
            <Link
              href="/my-bookings"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              My Bookings
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          <div className="flex-1">{children}</div>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm leading-loose text-muted-foreground text-center md:text-left">
                Built with ❤️ using Next.js and Tailwind CSS
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/terms"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
