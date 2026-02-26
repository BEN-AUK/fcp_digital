# Public assets (copied to dist on `expo export -p web`)

- **manifest.json** — PWA manifest (name, icons, display, theme).
- **icon.png** — 建议放置 512×512 的 PWA 安装图标；若缺失，可从 `assets/images/icon.png` 复制至此，否则安装图标可能无法正确显示。

Favicon 由 Expo 根据 `app.config.js` 的 `web.favicon` 自动生成。
