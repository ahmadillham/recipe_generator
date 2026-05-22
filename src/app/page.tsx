"use client";

import { useState, useCallback } from "react";
import { Refrigerator, Github, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SearchBar, { type SearchFilters } from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import type { Recipe, RecipeApiResponse } from "@/types/recipe";

/**
 * Home page — the single-page Fridge Recipe Generator.
 *
 * Composed of three sections:
 *   1. Hero — branding, description, and the SearchBar
 *   2. Results — recipe cards or contextual empty states
 *   3. Footer — minimal branding
 */
export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ── Fetch recipes from our secure API route ───────────────────────
  const handleSearch = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setRecipes([]);

    try {
      const params = new URLSearchParams({
        ingredients: filters.ingredients.join(","),
        number: "9",
      });
      
      if (filters.diets.length > 0) {
        params.append("diet", filters.diets.join(","));
      }
      if (filters.intolerances.length > 0) {
        params.append("intolerances", filters.intolerances.join(","));
      }

      const response = await fetch(`/api/recipes?${params.toString()}`);
      const data: RecipeApiResponse = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setRecipes(data.recipes);
      }
    } catch {
      setError("Failed to connect. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Determine what to render in the results area ──────────────────
  const renderResults = () => {
    // Loading skeleton grid
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    // Error state
    if (error) {
      return <EmptyState variant="error" message={error} />;
    }

    // No results after a search
    if (hasSearched && recipes.length === 0) {
      return <EmptyState variant="no-results" />;
    }

    // Haven't searched yet
    if (!hasSearched) {
      return <EmptyState variant="no-input" />;
    }

    // Recipe cards
    return (
      <>
        <p className="text-sm text-gray-500 mb-8 text-center animate-fade-in">
          Found <span className="text-gray-900 font-semibold">{recipes.length}</span> recipe{recipes.length !== 1 ? "s" : ""} you can make
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ── Top Nav ────────────────────────────────────────────────── */}
      <nav className="absolute top-0 right-0 p-4 md:p-6 z-10 animate-fade-in">
        <Link
          href="/favorites"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:shadow-sm hover:border-gray-300 transition-all"
        >
          <Heart className="w-4 h-4 text-primary" />
          Favorites
        </Link>
      </nav>

      {/* ── Hero Section ───────────────────────────────────────────── */}
      <header className="pt-16 md:pt-24 pb-12 md:pb-16 px-4 bg-white border-b border-gray-200 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20
                       rounded-2xl bg-white border border-gray-100 shadow-sm
                       mb-6"
          >
            <Refrigerator className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900
                       leading-tight"
          >
            Cook with what you have
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="mt-4 md:mt-6 text-base md:text-lg text-gray-500
                       max-w-xl mx-auto leading-relaxed"
          >
            Stop staring into your fridge wondering what to make.
            Enter your ingredients and discover delicious recipes in seconds.
          </motion.p>

          {/* Search bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            onAnimationComplete={() => {
              document.getElementById('ingredient-input')?.focus();
            }}
            className="mt-10 md:mt-12"
          >
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
        </div>
      </header>

      {/* ── Results Section ────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-16 md:py-24 relative">
        {/* Subtle Background Pattern for Empty State area */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "24px 24px" }} 
        />
        
        <div className="max-w-6xl mx-auto relative z-10">{renderResults()}</div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <a
              href="https://spoonacular.com/food-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 font-medium hover:text-primary transition-colors"
            >
              Spoonacular API
            </a>
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
