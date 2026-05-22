"use client";

import { useState, useRef, type KeyboardEvent, type FormEvent } from "react";
import { Search, X, Sparkles, Plus, ChevronDown, ChevronUp } from "lucide-react";

export interface SearchFilters {
  ingredients: string[];
  diets: string[];
  intolerances: string[];
}

interface SearchBarProps {
  /** Called when the user submits a list of ingredients and filters */
  onSearch: (filters: SearchFilters) => void;
  /** Whether the parent is currently fetching results */
  isLoading: boolean;
}

const PANTRY_STAPLES = ["salt", "black pepper", "olive oil", "garlic", "water", "butter", "onion"];
const DIETS = ["Vegetarian", "Vegan", "Gluten Free", "Ketogenic", "Paleo"];
const INTOLERANCES = ["Dairy", "Peanut", "Soy", "Egg", "Seafood", "Shellfish", "Tree Nut", "Wheat"];

/**
 * SearchBar — the primary input component.
 *
 * Includes main ingredient input, pantry staples toggles, and diet/allergy filters.
 */
export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  // Main ingredient input state
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [activeStaples, setActiveStaples] = useState<Set<string>>(new Set());
  const [activeDiets, setActiveDiets] = useState<Set<string>>(new Set());
  const [activeIntolerances, setActiveIntolerances] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // ── Add an ingredient chip ────────────────────────────────────────
  const addIngredient = (raw: string) => {
    const cleaned = raw.trim().toLowerCase();
    if (cleaned && !ingredients.includes(cleaned)) {
      setIngredients((prev) => [...prev, cleaned]);
    }
    setInputValue("");
  };

  // ── Remove a chip by index ────────────────────────────────────────
  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Handle keyboard shortcuts ─────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        inputValue.split(",").forEach(addIngredient);
      }
    }
    if (e.key === "Backspace" && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  };

  // ── Submit the search ─────────────────────────────────────────────
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const allIngredients = [...ingredients];
    if (inputValue.trim()) {
      inputValue
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s && !allIngredients.includes(s))
        .forEach((s) => allIngredients.push(s));
    }
    if (allIngredients.length > 0 || activeStaples.size > 0) {
      setIngredients(allIngredients);
      setInputValue("");
      
      // Combine typed ingredients with toggled staples
      const combinedIngredients = Array.from(new Set([...allIngredients, ...Array.from(activeStaples)]));

      onSearch({
        ingredients: combinedIngredients,
        diets: Array.from(activeDiets),
        intolerances: Array.from(activeIntolerances)
      });
    }
  };

  // ── Toggle Helper ──────────────────────────────────────────────────
  const toggleSetItem = (set: Set<string>, item: string, setter: (newSet: Set<string>) => void) => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setter(newSet);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* ── Input container ──────────────────────────────────────────── */}
      <div
        className="bg-white border border-gray-300 rounded-lg p-2.5 flex items-center gap-2 flex-wrap cursor-text
                   shadow-sm transition-shadow duration-200
                   focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent"
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="w-5 h-5 text-gray-400 ml-2 shrink-0" />

        {/* ── Ingredient chips ──────────────────────────────────────── */}
        {ingredients.map((ingredient, index) => (
           <span
            key={`${ingredient}-${index}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-gray-100 text-gray-900 text-sm font-medium
                       animate-fade-in transition-colors hover:bg-gray-200"
          >
            <span className="capitalize">{ingredient}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeIngredient(index);
              }}
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label={`Remove ${ingredient}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}

        {/* ── Text input ────────────────────────────────────────────── */}
        <input
          ref={inputRef}
          id="ingredient-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            ingredients.length === 0
              ? "Type an ingredient (e.g. chicken, garlic, rice)…"
              : "Add more…"
          }
          className="flex-1 min-w-[140px] bg-transparent outline-none text-gray-900
                     placeholder:text-gray-400 py-2 px-1 text-base"
          disabled={isLoading}
          autoComplete="off"
        />

        {inputValue.trim() && (
          <button
            type="button"
            onClick={() => inputValue.split(",").forEach(addIngredient)}
            className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            aria-label="Add ingredient"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mt-2 text-center">
        Press <span className="font-semibold text-gray-700">Enter</span> to add ingredients.
      </p>

      {/* ── Pantry Staples ──────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pantry Staples</span>
        <div className="flex flex-wrap justify-center gap-2">
          {PANTRY_STAPLES.map((staple) => {
            // If it's already in the main ingredients list, we can visually disable it here or just treat it normally
            const isMain = ingredients.includes(staple);
            const isActive = activeStaples.has(staple) || isMain;
            return (
              <button
                key={staple}
                type="button"
                onClick={() => {
                  if (!isMain) toggleSetItem(activeStaples, staple, setActiveStaples);
                }}
                disabled={isMain}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                  ${isActive 
                    ? "bg-primary text-white border-primary shadow-sm" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${isMain ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {staple}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Advanced Filters Toggle ─────────────────────────────────── */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Diet & Allergy Filters
        </button>
      </div>

      {/* ── Filters Section ─────────────────────────────────────────── */}
      {showFilters && (
        <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white animate-fade-in text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Dietary Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {DIETS.map(diet => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleSetItem(activeDiets, diet, setActiveDiets)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border
                      ${activeDiets.has(diet)
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Allergies & Intolerances</h4>
              <div className="flex flex-wrap gap-2">
                {INTOLERANCES.map(intol => (
                  <button
                    key={intol}
                    type="button"
                    onClick={() => toggleSetItem(activeIntolerances, intol, setActiveIntolerances)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border
                      ${activeIntolerances.has(intol)
                        ? "bg-secondary text-white border-secondary"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {intol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Generate button ─────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isLoading || (ingredients.length === 0 && activeStaples.size === 0 && !inputValue.trim())}
        id="generate-recipes-btn"
        className="mt-8 w-full py-4 px-6 rounded-xl font-semibold text-base
                   bg-primary hover:bg-primary-hover text-white
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-sm hover:shadow-md transition-all duration-200
                   flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching recipes…
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Recipes
          </>
        )}
      </button>
    </form>
  );
}
