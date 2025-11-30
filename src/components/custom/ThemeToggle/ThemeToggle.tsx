"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  className?: string;
  isOverlay?: boolean;
}

export function ThemeToggle({ className, isOverlay = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8",
          isOverlay && "text-white hover:bg-white/10",
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className={cn("h-4 w-4", isOverlay && "text-white")} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "h-8 w-8",
        isOverlay && "text-white hover:bg-white/10",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className={cn(
        "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
        isOverlay && "text-white"
      )} />
      <Moon className={cn(
        "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
        isOverlay && "text-white"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

