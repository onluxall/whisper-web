"use client";

import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Waitlist from "../components/sections/Waitlist";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Waitlist />
    </main>
  );
}
