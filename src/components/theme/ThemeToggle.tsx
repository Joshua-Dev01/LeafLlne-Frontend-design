// src/components/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { toggleDarkMode } from "./ThemeProvider";

const ThemeToggle = () => {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
