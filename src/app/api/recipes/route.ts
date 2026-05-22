import { NextResponse } from "next/server";
import type { Recipe } from "@/types/recipe";

/**
 * GET /api/recipes?ingredients=chicken,garlic,rice&number=9&diet=vegan&intolerances=dairy
 *
 * Server-side route handler that proxies requests to the Spoonacular API.
 * Uses complexSearch to support diet and intolerance filters while still matching ingredients.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ingredients = searchParams.get("ingredients");
  const diet = searchParams.get("diet");
  const intolerances = searchParams.get("intolerances");
  const number = searchParams.get("number") || "9";

  // ── Validate input ───────────────────────────────────────────────
  if (!ingredients || ingredients.trim().length === 0) {
    return NextResponse.json(
      { recipes: [], error: "Please provide at least one ingredient." },
      { status: 400 }
    );
  }

  // ── Validate API key ─────────────────────────────────────────────
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json(
      {
        recipes: [],
        error:
          "Spoonacular API key is not configured. Please add it to your .env.local file.",
      },
      { status: 500 }
    );
  }

  // ── Call the Spoonacular API ──────────────────────────────────────
  try {
    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    url.searchParams.set("includeIngredients", ingredients);
    url.searchParams.set("number", number);
    url.searchParams.set("sort", "min-missing-ingredients"); 
    url.searchParams.set("fillIngredients", "true");
    url.searchParams.set("ignorePantry", "true");
    
    if (diet) url.searchParams.set("diet", diet);
    if (intolerances) url.searchParams.set("intolerances", intolerances);
    
    url.searchParams.set("apiKey", apiKey);

    const response = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }, // Cache 5 mins
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spoonacular API error:", response.status, errorText);
      return NextResponse.json(
        {
          recipes: [],
          error: `API request failed (${response.status}). Please try again later.`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // complexSearch returns an object with a `results` array, unlike findByIngredients
    const recipes: Recipe[] = data.results || [];

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return NextResponse.json(
      {
        recipes: [],
        error: "Something went wrong while fetching recipes. Please try again.",
      },
      { status: 500 }
    );
  }
}
