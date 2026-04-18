# Croco Blocks — PHP (`src/`)

Composer PSR-4 maps `CrocoBlocks\` → this directory (class files under `Core/`, `Controllers/`, `Rest/`, `BlockSupport/` only).

| Path | Role |
|------|------|
| `Core/` | `Bootstrap.php`, `Plugin.php` |
| `Controllers/` | `BlockController`, `AdminController` |
| `Rest/` | REST controllers |
| `BlockSupport/` | Block attribute/CSS helpers (`CrocoBlocks\BlockSupport`) |
| `assets/` | Webpack source (JS, SCSS, block metadata, `render.php`) — see `assets/README.md` |

`npm run build` sets `WP_SOURCE_PATH=src/assets` so `@wordpress/scripts` compiles from `src/assets/**` into `build/`.
