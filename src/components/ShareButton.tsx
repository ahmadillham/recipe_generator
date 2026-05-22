"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  url?: string;
}

/**
 * ShareButton — Client Component for Native Sharing.
 * Uses navigator.share on mobile, falls back to clipboard copy on desktop.
 */
export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
      } catch (err) {
        // If the user cancelled the share, do nothing.
        // Otherwise, fallback to copy.
        if ((err as Error).name !== "AbortError") {
          fallbackCopy(shareUrl);
        }
      }
    } else {
      fallbackCopy(shareUrl);
    }
  };

  const fallbackCopy = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full
                   bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Share recipe"
        title="Share recipe"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Subtle Toast for Clipboard Copy */}
      {copied && (
        <div className="absolute top-12 right-0 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 whitespace-nowrap animate-fade-in">
          <Check className="w-3.5 h-3.5 text-green-400" />
          Link Copied!
        </div>
      )}
    </div>
  );
}
