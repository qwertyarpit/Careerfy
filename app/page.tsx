"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-900">
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl md:text-2xl font-black tracking-tight text-white">
          CAREERFY
        </span>
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/30 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/30 blur-[120px] animate-pulse delay-1000" />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-28 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
          Showcase your company
          <span className="hidden md:inline"> </span>
          <span className="text-blue-300">and open roles</span>
        </h1>

        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-4 justify-center">
            <span className="h-px w-24 bg-white/30" />
            <span className="text-sm uppercase text-white/60 tracking-wider">
              With Fully customizable dashboard
            </span>
            <span className="h-px w-24 bg-white/30" />
          </div>
        </div>

        <p className="max-w-2xl text-slate-200 text-lg">
          Launch a beautiful careers page in minutes with a flexible dashboard
          to manage roles, showcase your brand, and attract top candidates.
        </p>

        <div className="flex gap-4">
          <Link href="/login">
            <Button className="bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-white/50">© 2025 Careerfy</div>
      </main>
    </div>
  );
}
