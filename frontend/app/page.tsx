"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/chat");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-pink-500">
      <div className="text-center">
        <div className="inline-block animate-pulse">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6"></div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Loading AI Chat...</h1>
        <p className="text-white/80 text-lg">Preparing your workspace...</p>
      </div>
    </div>
  );
}
