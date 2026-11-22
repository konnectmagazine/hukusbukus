# Project architecture

Hukus Bukus is a static HTML/CSS/JavaScript website for children in Kashmir. Keep this project framework-free as requested by the owner. No build command or package installation is required.

## Key files

- `index.html`: complete landing page, semantic sections, personal video form, and native video dialog.
- `styles.css`: design tokens, typography, responsive rules, component states, and dark mode.
- `app.js`: browser interactions, theme preference, catalog filtering and pagination, safe URL parsing, YouTube dialog, creative prompts, and local place cards.
- `assets/videos.js`: 93 sanitized video entries collected from the owner’s two supplied public playlists. Preserve original titles. The source playlists are also linked visibly on the page.
- `assets/kashmir-adventure.png`: generated hero illustration served through Netlify Image CDN.
- `assets/*.svg`: original decorative local landscape illustrations and favicon.
- `netlify.toml`: root publish directory, Image CDN source allowlist, and response security headers.

## Conventions and decisions

Use native browser APIs and DOM creation with `textContent` for external titles and visitor-supplied content. Never insert visitor input into HTML. Validate video hosts against the explicit allowlist and require an 11-character YouTube video ID before embedding. Keep embedded media in the same-page native dialog; clear its iframe on close so audio stops. Maintain keyboard access, focus return, descriptive labels, inline errors, and reduced-motion support.

Use CSS custom properties for themes, Fredoka for headings, and DM Sans for body text. Keep the cream, forest green, ochre, and terracotta visual identity. Preserve responsive layouts and adequate touch targets.

The custom-video form is a temporary player, not a content publishing system. No accounts, personal data collection, persistence layer, or backend is implemented or needed for this behavior. Theme preference alone uses browser localStorage with guarded access. Any future request for shared, saved video additions needs authenticated administration and Netlify-backed storage rather than browser storage.

The video catalog is an explicit snapshot and is not synchronized automatically. YouTube restrictions and removed/private videos must be handled by the existing YouTube fallback link. Do not invent video titles, view counts, or durations. Public service links lead to official sites; eligibility and deadlines must be checked at the source. Place images are decorative illustrations, clearly identified in alt text.

Do not run build, development server, or test commands during automated editing sessions. Inspect edited files; the platform validates deployments. See README.md for local development instructions intended for maintainers.
