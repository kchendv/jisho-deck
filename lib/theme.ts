export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "japanese-flashcards-theme";

/** Matches the page background at the top of the viewport in each theme. */
export const THEME_COLORS: Record<Theme, string> = {
  light: "#f8fafc",
  dark: "#0f172a",
};

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private browsing modes can reject writes; the theme still applies.
  }
}

/**
 * Runs synchronously in <head> so the stored theme is applied before the first
 * paint instead of flashing light and correcting itself during hydration.
 *
 * It also owns the `theme-color` meta tag, which tints the status bar of the
 * installed PWA. A `<meta media="(prefers-color-scheme: ...)">` pair can't do
 * that job here, since it would follow the OS rather than an explicit choice.
 */
export const themeInitScript = `(function(){try{
var key=${JSON.stringify(THEME_STORAGE_KEY)};
var query=window.matchMedia("(prefers-color-scheme: dark)");
function apply(){
var stored=null;try{stored=localStorage.getItem(key)}catch(e){}
var dark=stored==="dark"||(stored!=="light"&&query.matches);
document.documentElement.classList.toggle("dark",dark);
var meta=document.querySelector('meta[name="theme-color"]');
if(!meta){meta=document.createElement("meta");meta.setAttribute("name","theme-color");document.head.appendChild(meta)}
meta.setAttribute("content",dark?${JSON.stringify(THEME_COLORS.dark)}:${JSON.stringify(THEME_COLORS.light)});
}
apply();
query.addEventListener("change",apply);
}catch(e){}})();`;
