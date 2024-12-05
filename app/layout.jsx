import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const poppinsBlack = localFont({
  src: "./fonts/Poppins-Black.ttf",
  variable: "--font-poppins-black",
  weight: "100 900",
});
const poppinsItallic = localFont({
  src: "./fonts/Poppins-Italic.ttf",
  variable: "--font-poppins-italic",
  weight: "100 900",
});

export const metadata = {
  title: "AI Mock Interview",
  description: "A platform to take your interview prep to the next level by the help of AI!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${poppinsBlack.variable} ${poppinsItallic.variable} antialiased`}>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
