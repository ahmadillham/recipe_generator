/**
 * Types for the Spoonacular "Search Recipes by Ingredients" API response.
 * Docs: https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients
 */

/** A single ingredient entry (used/missed/unused) */
export interface Ingredient {
  id: number;
  amount: number;
  unit: string;
  unitLong: string;
  unitShort: string;
  aisle: string;
  name: string;
  original: string;
  originalName: string;
  meta: string[];
  image: string;
}

/** A recipe returned from the "Search by Ingredients" endpoint */
export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Ingredient[];
  usedIngredients: Ingredient[];
  unusedIngredients: Ingredient[];
  likes: number;
}

/** Shape of the API response from our internal route handler */
export interface RecipeApiResponse {
  recipes: Recipe[];
  error?: string;
  offset?: number;
  totalResults?: number;
}

/** Extended ingredient used in the detailed recipe view */
export interface ExtendedIngredient {
  id: number;
  original: string;
  amount: number;
  unit: string;
  name: string;
}

/** Instruction step for a recipe */
export interface InstructionStep {
  number: number;
  step: string;
}

/** Grouped instructions */
export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

/** Detailed recipe information returned by /recipes/{id}/information */
export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  extendedIngredients: ExtendedIngredient[];
  analyzedInstructions: AnalyzedInstruction[];
}
