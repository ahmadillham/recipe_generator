import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-24">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 font-medium text-sm pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8 md:pt-12">
        {/* ── Hero Skeleton ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
          {/* Image */}
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-gray-200" />
          
          <div className="p-6 md:p-10">
            {/* Title */}
            <div className="h-10 md:h-14 bg-gray-200 rounded-lg w-3/4 mb-6" />
            
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
              <div className="h-8 w-32 bg-gray-200 rounded-full" />
              <div className="h-8 w-28 bg-gray-200 rounded-full" />
            </div>

            {/* Summary Lines */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>

        {/* ── Content Split Skeleton ──────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Ingredients */}
          <div className="md:col-span-4 lg:col-span-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Instructions */}
          <div className="md:col-span-8 lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 animate-pulse">
            <div className="h-8 w-40 bg-gray-200 rounded mb-8" />
            <div className="space-y-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
