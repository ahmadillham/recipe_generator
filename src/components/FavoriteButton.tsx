"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import type { Recipe } from "@/types/recipe";

interface FavoriteButtonProps {
  recipe: Recipe;
  /** Optional className to override default styling */
  className?: string;
  /** Optional size for the heart icon */
  iconSize?: number;
}

/**
 * FavoriteButton — Client Component
 * Toggles a recipe in the user's localStorage favorites list.
 */
export default function FavoriteButton({ recipe, className = "", iconSize = 20 }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className={`w-10 h-10 rounded-full bg-gray-100 animate-pulse ${className}`} />
    );
  }

  const active = isFavorite(recipe.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent triggering any parent links
        e.stopPropagation();
        toggleFavorite(recipe);
      }}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
        active 
          ? "bg-red-50 text-primary hover:bg-red-100" 
          : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100 hover:border-gray-200 hover:bg-white"
      } ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={iconSize} 
        className={`transition-all duration-200 ${active ? "fill-primary" : ""}`} 
      />
    </button>
  );
}
