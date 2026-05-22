"use client";

import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import type { ExtendedIngredient } from "@/types/recipe";

interface InteractiveIngredientsProps {
  baseServings: number;
  ingredients: ExtendedIngredient[];
}

/**
 * InteractiveIngredients — Client Component
 * Handles the "Serving Size Adjuster" and "Smart Shopping List" features.
 */
export default function InteractiveIngredients({ baseServings, ingredients }: InteractiveIngredientsProps) {
  const [servings, setServings] = useState(baseServings);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  // ── Serving Adjuster Logic ────────────────────────────────────────
  const incrementServings = () => setServings((prev) => prev + 1);
  const decrementServings = () => setServings((prev) => Math.max(1, prev - 1));

  // Recalculate amount based on new servings vs base servings
  const ratio = servings / baseServings;

  const formatAmount = (amount: number, ratio: number) => {
    const calculated = amount * ratio;
    // Format to max 2 decimal places to keep it clean (e.g. 1.5 instead of 1.50)
    return parseFloat(calculated.toFixed(2));
  };

  // ── Smart Shopping List Logic ─────────────────────────────────────
  const toggleCheck = (id: number) => {
    const next = new Set(checkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedIds(next);
  };

  return (
    <div className="md:col-span-4 lg:col-span-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
      {/* ── Header & Serving Adjuster ──────────────────────────────── */}
      <div className="flex items-end justify-between mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Ingredients</h2>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Servings</span>
          <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
            <button
              onClick={decrementServings}
              disabled={servings <= 1}
              className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease servings"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-gray-900 w-4 text-center">
              {servings}
            </span>
            <button
              onClick={incrementServings}
              className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Increase servings"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Smart Shopping List ────────────────────────────────────── */}
      <ul className="space-y-3">
        {ingredients.map((ing, idx) => {
          // Some ingredients from Spoonacular share an ID or have ID=0 if they are generic, 
          // so fallback to index to ensure unique React keys and toggle state
          const uniqueId = ing.id || idx; 
          const isChecked = checkedIds.has(uniqueId);
          
          return (
            <li key={uniqueId} className="flex items-start gap-3 group">
              <button
                onClick={() => toggleCheck(uniqueId)}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors
                  ${isChecked 
                    ? "bg-primary border-primary text-white" 
                    : "border-gray-300 bg-white group-hover:border-primary"
                  }`}
                aria-label={isChecked ? "Mark as missing" : "Mark as checked"}
              >
                {isChecked && <Check className="w-3.5 h-3.5" />}
              </button>
              
              <span className={`text-gray-700 leading-relaxed transition-all ${isChecked ? "line-through text-gray-400 opacity-60" : ""}`}>
                <span className="font-semibold text-gray-900 mr-1 transition-all">
                  {formatAmount(ing.amount, ratio)} {ing.unit}
                </span>
                {ing.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
