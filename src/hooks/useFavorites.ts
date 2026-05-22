import { useState, useEffect } from "react";
import type { Recipe } from "@/types/recipe";

/**
 * Custom hook to manage favorite recipes in localStorage.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fridge_recipe_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load favorites", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("fridge_recipe_favorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites", error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      // Prevent duplicates
      if (prev.some((r) => r.id === recipe.id)) return prev;
      return [recipe, ...prev];
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((r) => r.id !== id));
  };

  const isFavorite = (id: number) => {
    return favorites.some((r) => r.id === id);
  };

  const toggleFavorite = (recipe: Recipe) => {
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
