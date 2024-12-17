"use client"
import { useEffect, useRef, useState } from "react";
import BlurFade from "@/components/ui/blur-fade";
import Meteors from "@/components/ui/meteors";
import DotPattern from "@/components/ui/dot-pattern";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import ShinyButton from "@/components/ui/shiny-button";
import { RocketIcon, FileTextIcon, CalendarIcon, InputIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { MyGPT } from "@/utils/MyGPTModel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {

  const user = useUser();

  const features = [
    {
      Icon: RocketIcon,
      name: "AI Mock Interview",
      description: "Practice mock interviews with AI and improve your skills.",
      href: "/ai-mock-interview",
      cta: "Start Now",
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-1 lg:col-end-2",
    },
    {
      Icon: FileTextIcon,
      name: "Study with AI",
      description: "Use AI tools to simplify and optimize your study sessions.",
      href: "/chat-with-pdf",
      cta: "Learn More",
      className: "lg:row-start-1 lg:row-end-3 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: InputIcon,
      name: "AI Learning Assistant",
      description: "Get personalized learning recommendations with AI.",
      href: "/ai-learning-assistant",
      cta: "Explore",
      className: "lg:row-start-3 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: CalendarIcon,
      name: "Schedule with AI",
      description: "Plan and schedule your tasks with AI assistance.",
      href: "/schedule-with-ai",
      cta: "Discover",
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-3 lg:col-end-4",
    },
  ];

  // Create a ref for the Bento Grid section
  const bentoGridRef = useRef(null);
  const [blurKey, setBlurKey] = useState(0); // State to control the BlurFade key

  const handleScrollToGrid = () => {
    if (bentoGridRef.current) {
      bentoGridRef.current.scrollIntoView({ behavior: "smooth" });
      setBlurKey((prevKey) => prevKey + 1); // Update the key to restart the blur animation
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden relative w-full">
    <Meteors />
    <DotPattern width={20} height={20} cx={1} cy={1} cr={1} />
    
    {/* Icon image positioned behind the text */}
      <Image
        src="/icon.png"
        width={500}
        height={500}
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10"
        alt="Background Icon"
      />
    
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
      <BlurFade delay={0.25}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-center font-bold moving-gradient p-4">
          AI Learning Platform
        </h1>
      </BlurFade>
      <BlurFade delay={0.5}>
        <h2 className="font-semibold text-xs sm:text-xl md:text-2xl lg:text-3xl mt-3 text-center">
          Use AI to help yourself with learning and preparation!
        </h2>
      </BlurFade>

      {
        user.isSignedIn
        ?<ShinyButton className="mt-5 font-semibold" onClick={handleScrollToGrid}>
        Let's get started!
      </ShinyButton>
        :
        <ShinyButton className="mt-5 font-semibold" onClick={() => {useRouter().push('/sign-in')}}>
        Login to get started!
      </ShinyButton>
      }
      {/* <ShinyButton className="mt-5 font-semibold" onClick={handleScrollToGrid}>
        Let's get started!
      </ShinyButton> */}
    </div>
    
    {/* Bento Grid Section */}
    <div ref={bentoGridRef} className="my-16 w-full px-6">
      <BlurFade key={blurKey} delay={0.35}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold gradient p-4">
          Have a look...
        </h1>
      </BlurFade>
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  </div>
  );
}
