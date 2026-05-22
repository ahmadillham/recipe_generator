import { AlertTriangle, SearchX, UtensilsCrossed } from "lucide-react";

type EmptyStateVariant = "no-input" | "no-results" | "error";

interface EmptyStateProps {
  variant: EmptyStateVariant;
  message?: string;
}

const config: Record<
  EmptyStateVariant,
  { icon: typeof AlertTriangle; title: string; defaultMessage: string; color: string }
> = {
  "no-input": {
    icon: UtensilsCrossed,
    title: "What's in your fridge?",
    defaultMessage:
      "Add some ingredients above and we'll find recipes you can cook right now.",
    color: "text-gray-400",
  },
  "no-results": {
    icon: SearchX,
    title: "No recipes found",
    defaultMessage:
      "We couldn't find any recipes with those ingredients. Try adding more items or different combinations.",
    color: "text-secondary",
  },
  error: {
    icon: AlertTriangle,
    title: "Something went wrong",
    defaultMessage:
      "We had trouble fetching recipes. Please check your connection and try again.",
    color: "text-primary",
  },
};

/**
 * EmptyState — contextual feedback when there are no recipes to show.
 *
 * Displays different icons, titles, and messages depending on why
 * the results area is empty (no input, no results, or error).
 */
export default function EmptyState({ variant, message }: EmptyStateProps) {
  const { icon: Icon, title, defaultMessage, color } = config[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 animate-fade-in">
      <div className={`mb-5 ${color}`}>
        <Icon className="w-12 h-12 stroke-[1.5]" />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 text-center">
        {title}
      </h2>
      <p className="text-sm md:text-base text-gray-500 max-w-md text-center leading-relaxed">
        {message || defaultMessage}
      </p>
    </div>
  );
}
