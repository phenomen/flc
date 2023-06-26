# CHANGELOG

## v3.0.0

- Spanish language @lozanoje
- Optional Node server launch parameters
- Updated Tauri

## v2.9.5

- Language selector is now a select list
- Workaround for macOS struggle with `maximize()`

## v2.9.0

- Brazilian Portuguese translation by @brunocalado
- Vertically centered layout for large screens
- Forced href assignment for macOS Webkit

## v2.8.0

- Replaced localstorage library with a custom light implementation.
- Replaced Tabler with Heroicons.
- Empty state for a server list.
- Loading is now rotating along the arrows :D

## v2.7.0

- Hotfixed an issue with a broken TLS library preventing connection to HTTPS servers. Replaced it with rustls-tls.
- Allow reverse-proxy servers on URL subpaths (i.e. https://example.com/foundry).
- Add a http:// protocol to URL if none is provided.

## v2.6.0

- Webkit / Webview2 update.
- Tauri switched to alpha version.

## v2.5.0

- Better UX with form submit, subtle animations, loading states.
- Many layout and style improvements thanks to TailwindCSS 3.3 update.

## v2.4.0

- Server Launcher is back! Bigger, better, faster stronger. Proper error handling and human-readable messages.
- Proper Fullscreen Toggle hotkey! Press Ctrl/Cmd + F11 to enter or exit fullscreen.

## v2.3.0

- Localization fix

## v2.2.0

- Skip server check option (to bypass self-signed SSL)
- Fullscreen mode option
- Removed Node server launcher (too complex and heavy for this app)

## v2.1.0

- Added localstorage library @nikolai-cc/svu
- Added zod schema validation library @colinhacks/zod
- TypeScript fixes
- Extracted server launcher as Svelte component
- Enabled DevTools (F12)

## v2.0.0

- Nodejs server launcher error handling
- Faster navigation to server URL
- FLC User-Agent in HTTP header
- Layout improvements

## v1.9.0

- Headless Foundry server launcher
- Microphone and Camera access on MacOS

## v1.8.0

- Language switch (EN/RU).
- More reliable server fetch.

## v1.7.0

- Server labels.
- Link to Github.
- Dark mode improvements.

## v1.6.0

- MacOS and Linux initial release.
- Github Workflow

## v1.5.0

- Dark mode toggle with persistent state on restart.

## v1.4.0

- Crypto API to generate UUID for servers (adding/removing servers should be more consistent and bug-free).

## v1.3.0

- Logo and layout updates.
- Stripped Rust debug symbols from binary (-150kb).

## v1.2.0

- Foundry drag-and-drop functionality fixed by disabling native Windows DND.

## v1.1.0

- Auto-update.
- Replaced Node `fetch` with Rust `http-client` to make requests compatible with mixed-content servers without SSL.

## v1.0.0

- Windows initial release.
