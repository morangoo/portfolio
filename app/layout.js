import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const DMSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const DMMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Miguel",
  description: "My portfolio!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${DMSans.variable} ${DMMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
