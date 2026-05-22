/**
 * SkeletonCard — loading placeholder that mirrors RecipeCard layout.
 *
 * Uses a standard pulse animation.
 */
export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-[4/3] bg-gray-200" />

      <div className="p-4 md:p-5 space-y-4">
        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-5 w-4/5 bg-gray-200 rounded" />
          <div className="h-5 w-3/5 bg-gray-200 rounded" />
        </div>

        {/* Progress bar placeholder */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        {/* Missing ingredients text placeholder */}
        <div className="mt-4 pt-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
