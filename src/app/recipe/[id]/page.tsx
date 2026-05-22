import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Users, Leaf, WheatOff, Droplets } from "lucide-react";
import type { RecipeDetail } from "@/types/recipe";
import { notFound } from "next/navigation";
import InteractiveIngredients from "@/components/InteractiveIngredients";
import ShareButton from "@/components/ShareButton";
import FavoriteButton from "@/components/FavoriteButton";

// Define the shape of the Next.js page props
interface PageProps {
  params: {
    id: string;
  };
}

/**
 * Server action to fetch recipe details directly from Spoonacular.
 * Keeps the API key secure on the server.
 */
async function getRecipeDetails(id: string): Promise<RecipeDetail | null> {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("Missing API Key");
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`,
      {
        // Revalidate every hour
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    throw error;
  }
}

/**
 * Recipe Detail Page (Server Component)
 */
export default async function RecipePage({ params }: PageProps) {
  let recipe: RecipeDetail | null = null;
  
  try {
    recipe = await getRecipeDetails(params.id);
  } catch (error) {
    console.error(error);
  }

  // If no recipe is found (404), trigger the Next.js 404 page
  if (!recipe) {
    notFound();
  }

  // Create a base Recipe object to pass to the FavoriteButton
  const recipeAsBase: import("@/types/recipe").Recipe = {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    imageType: "jpg",
    usedIngredientCount: recipe.extendedIngredients.length,
    missedIngredientCount: 0,
    missedIngredients: [],
    usedIngredients: [],
    unusedIngredients: [],
    likes: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-24">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>

          <div className="flex items-center gap-2">
            <FavoriteButton recipe={recipeAsBase} />
            <ShareButton title={recipe.title} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8 md:pt-12">
        {/* ── Hero Section ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gray-100">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {recipe.title}
            </h1>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4 text-primary" />
                {recipe.readyInMinutes} mins
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                <Users className="w-4 h-4 text-primary" />
                {recipe.servings} servings
              </span>
              
              {/* Dietary Tags */}
              {recipe.vegetarian && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <Leaf className="w-4 h-4" />
                  Vegetarian
                </span>
              )}
              {recipe.vegan && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <Leaf className="w-4 h-4" />
                  Vegan
                </span>
              )}
              {recipe.glutenFree && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                  <WheatOff className="w-4 h-4" />
                  Gluten-Free
                </span>
              )}
              {recipe.dairyFree && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <Droplets className="w-4 h-4" />
                  Dairy-Free
                </span>
              )}
            </div>

            {/* Summary (HTML content from Spoonacular) */}
            <div 
              className="mt-8 prose prose-gray max-w-none text-gray-600 prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
          </div>
        </div>

        {/* ── Content Split ───────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Ingredients */}
          <InteractiveIngredients 
            baseServings={recipe.servings} 
            ingredients={recipe.extendedIngredients} 
          />

          {/* Right Column: Instructions */}
          <div className="md:col-span-8 lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Instructions
            </h2>
            
            {recipe.analyzedInstructions.length > 0 ? (
              <div className="space-y-8">
                {recipe.analyzedInstructions.map((instructionGroup, groupIdx) => (
                  <div key={groupIdx}>
                    {instructionGroup.name && (
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {instructionGroup.name}
                      </h3>
                    )}
                    <ol className="space-y-6">
                      {instructionGroup.steps.map((step) => (
                        <li key={step.number} className="flex gap-4">
                          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {step.number}
                          </span>
                          <p className="text-gray-700 leading-relaxed pt-1">
                            {step.step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No instructions provided for this recipe.</p>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
