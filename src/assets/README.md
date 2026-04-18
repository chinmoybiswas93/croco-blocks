# Croco Blocks — front-end source (`src/assets/`)

Everything consumed by **webpack** (`npm run build`) lives here. `package.json` sets `WP_SOURCE_PATH=src/assets` so `@wordpress/scripts` discovers `**/block.json` under this tree and outputs to `build/`.

| Path | Role |
|------|------|
| `blocks/<slug>/` | `block.json`, `index.js`, `view.js`, `style.scss`, `editor.scss`, `render.php` |
| `components/` | Shared block editor UI |
| `hooks/`, `utils/` | Shared JS |
| `admin/` | wp-admin settings app |
| `editor-shared/` | Shared editor CSS entry |
| `scss/shared/` | Sass partials imported by block stylesheets |

Autoloaded PHP (classes) lives in sibling folders under `src/` (`Core/`, `BlockSupport/`, …), not in `assets/`.
