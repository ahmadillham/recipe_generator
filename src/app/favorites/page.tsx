"use client";

import { useFavorites } from "@/hooks/useFavorites";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";
import { ArrowLeft, HeartOff } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="pt-8 md:pt-12 pb-6 px-4 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Your Favorites
            </h1>
            <p className="mt-2 text-base text-gray-500">
              A collection of your saved recipes.
            </p>
          </div>
        </div>
      </header>

      {/* ── Results Section ────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {!isLoaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {favorites.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 animate-fade-in">
              <div className="mb-5 text-gray-300">
                <HeartOff className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 text-center">
                No favorites yet
              </h2>
              <p className="text-sm md:text-base text-gray-500 max-w-md text-center leading-relaxed">
                Click the heart icon on any recipe to save it here for later.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
