"use client";

import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Waitlist from "../components/sections/Waitlist";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <>
      <style jsx global>{`
        main { transition: background 1.5s ease; }
      `}</style>
      <main className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-950 transition-colors duration-700">
        <Hero />
        <About />
        <Waitlist />
        <Contact />
      </main>
    </>
  );
}
