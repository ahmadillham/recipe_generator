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
    if (allIngredients.length > 0) {
      setIngredients(allIngredients);
      setInputValue("");
      
      onSearch({
        ingredients: allIngredients,
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
        className="bg-white border border-gray-300 rounded-xl p-2.5 flex items-center gap-2 flex-wrap cursor-text
                   shadow-sm transition-all duration-300
                   focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15"
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
      
      <p className="text-sm text-gray-400 mt-2 text-center">
        Press <span className="font-semibold text-gray-600">Enter</span> to add ingredients.
      </p>


      {/* ── Advanced Filters Toggle ─────────────────────────────────── */}
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Diet & Allergy Filters
        </button>
      </div>

      {/* ── Filters Section ─────────────────────────────────────────── */}
      {showFilters && (
        <div className="mt-4 p-5 rounded-2xl bg-gray-50/80 animate-fade-in text-left border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dietary Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {DIETS.map(diet => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleSetItem(activeDiets, diet, setActiveDiets)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border
                      ${activeDiets.has(diet)
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Allergies & Intolerances</h4>
              <div className="flex flex-wrap gap-2">
                {INTOLERANCES.map(intol => (
                  <button
                    key={intol}
                    type="button"
                    onClick={() => toggleSetItem(activeIntolerances, intol, setActiveIntolerances)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border
                      ${activeIntolerances.has(intol)
                        ? "bg-secondary text-white border-secondary shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
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
        disabled={isLoading || (ingredients.length === 0 && !inputValue.trim())}
        id="generate-recipes-btn"
        className="mt-8 w-full py-4 px-6 rounded-2xl font-bold text-base tracking-wide
                   bg-primary hover:bg-primary-hover text-white
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                   shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 
                   transition-all duration-300 flex items-center justify-center gap-2"
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
