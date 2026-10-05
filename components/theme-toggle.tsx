'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applyTheme } from '@/lib/theme';

/**
 * Which icon shows is decided by CSS from the `dark` class on <html>, so the
 * server and client render identical markup and there is no hydration mismatch.
 */
export function ThemeToggle() {
  return (
    <Button
      variant="outline"
      size="icon-sm"
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
      onClick={() =>
        applyTheme(
          document.documentElement.classList.contains('dark') ? 'light' : 'dark'
        )
      }
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
