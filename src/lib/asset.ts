/**
 * Files in /public are referenced by absolute paths such as '/comclub_logo.png'. Vite only rewrites those in
 * index.html, so when the site is served from a subpath (a GitHub Pages project site like /comclub-website-2026/)
 * they have to be prefixed with the base URL here. Full URLs and relative paths are returned unchanged.
 */
export function asset(path: string): string {
  return path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
}
