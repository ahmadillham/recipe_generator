import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 py-8 px-4 bg-white mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* ── Left Section: API Attribution ──────────────────────────── */}
        <div className="text-sm text-gray-500 text-center md:text-left">
          Powered by{" "}
          <a
            href="https://spoonacular.com/food-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-medium hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Spoonacular API
          </a>
        </div>

        {/* ── Center Section: Copyright ──────────────────────────────── */}
        <div className="text-sm text-gray-500 text-center">
          &copy; {currentYear} [Your Name]. Built with Next.js & Tailwind.
        </div>

        {/* ── Right Section: Social Icons ────────────────────────────── */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#0A66C2] transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
        
      </div>
    </footer>
  );
}
