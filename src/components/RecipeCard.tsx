import Image from "next/image";
import Link from "next/link";
import { ChefHat, ShoppingCart } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import FavoriteButton from "./FavoriteButton";

interface RecipeCardProps {
  recipe: Recipe;
  /** Index used for staggered fade-in animation */
  index: number;
}

/**
 * RecipeCard — displays a single recipe result.
 *
 * Shows the recipe image, title, and a badge indicating
 * how many ingredients are missing from the user's list.
 */
export default function RecipeCard({ recipe, index }: RecipeCardProps) {
  // Stagger the animation delay based on card position
  const delayClass = `delay-${Math.min(index * 100, 800)}`;
  const totalIngredients = recipe.usedIngredientCount + recipe.missedIngredientCount;
  const progressPercent = (recipe.usedIngredientCount / totalIngredients) * 100;

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      id={`recipe-card-${recipe.id}`}
      className={`bg-white border border-gray-200 rounded-xl group overflow-hidden animate-fade-in-up opacity-0 ${delayClass}
                 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col`}
    >
      {/* ── Image section ────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* ── Favorite Button ─────────────────────────────────────────── */}
        <div className="absolute top-3 left-3 z-10">
          <FavoriteButton recipe={recipe} iconSize={18} className="w-8 h-8" />
        </div>

        {/* ── Missing ingredients badge ───────────────────────────────── */}
        <div className="absolute top-3 right-3 z-10">
          {recipe.missedIngredientCount === 0 ? (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                       text-xs font-semibold bg-green-500 text-white shadow-sm"
            >
              <ChefHat className="w-3.5 h-3.5" />
              Ready to cook!
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                       text-xs font-semibold bg-secondary text-white shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {recipe.missedIngredientCount} missing
            </span>
          )}
        </div>
      </div>

      {/* ── Content section ──────────────────────────────────────────── */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <h3
          className="text-base md:text-lg font-bold text-gray-900 leading-snug
                   group-hover:text-primary transition-colors duration-200
                   line-clamp-2"
        >
          {recipe.title}
        </h3>

        {/* ── Ingredient usage bar ───────────────────────────────────── */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
            {recipe.usedIngredientCount}/{totalIngredients} found
          </span>
        </div>

        {/* ── Missing ingredient names ───────────────────────────────── */}
        {recipe.missedIngredientCount > 0 && (
          <div className="mt-4 flex-1 flex items-end">
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              <span className="font-medium text-gray-700">Missing: </span>
              {recipe.missedIngredients.map(ing => ing.name).join(", ")}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
