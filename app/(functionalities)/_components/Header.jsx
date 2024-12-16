"use client";

import { UserButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="flex p-4 items-center justify-between shadow-md">
      {/* Logo */}
      <Link className="flex flex-row" href={'/'}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI Learning Platform
        </h1>
      </Link>

      {/* Hamburger Button for Smaller Screens */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <MenuIcon width={24} height={24} />
        </button>
      </div>

      {/* Menu Items */}
      <ul
        className={`${isMenuOpen ? "block" : "hidden"} 
          absolute top-16 left-0 w-full bg-white md:static md:flex md:gap-8 md:w-auto md:bg-transparent border-none shadow-none`}
      >
        <Link href={"/ai-mock-interview"}>
          <li
            className={`text-xl p-4 hover:text-primary hover:scale-105 transition-all cursor-pointer ${path == "/ai-mock-interview" && "text-primary font-bold"
              }`}
          >
            AI Mock Interview
          </li>
        </Link>
        <Link href={"/chat-with-pdf"}>
          <li
            className={`text-xl p-4 hover:text-primary hover:scale-105 transition-all cursor-pointer ${path == "/chat-with-pdf" && "text-primary font-bold"
              }`}
          >
            Study AI
          </li>
        </Link>
        <Link href={"/upgrade"}>
          <li
            className={`text-xl p-4 hover:text-primary transition-all cursor-pointer ${path == "/upgrade" && "text-primary font-bold"
              }`}
          >
            Upgrade
          </li>
        </Link>
      </ul>

      {/* User Button */}
      <div className="hidden md:block">
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
