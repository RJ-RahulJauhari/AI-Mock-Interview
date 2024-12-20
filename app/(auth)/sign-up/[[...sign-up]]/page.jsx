"use client"
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Logo from "../../../icon.png";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-6 justify-center items-center px-4">
      {/* Left Section */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center items-center gap-6 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold hover:scale-110 transition">
          Join the Platform!
        </h1>
        <SignUp />
      </div>

      {/* Right Section */}
      <div className="flex w-full lg:w-1/2 justify-center items-center">
        <Image 
          src={Logo} 
          alt="AI Learning Illustration" 
          width={300} 
          height={300} 
          className="sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]"
        />
      </div>
    </div>
  );
}
