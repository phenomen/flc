# CHANGELOG

# v7.3.1

- Migrated TailwindCSS V3 to V4.
- Migrated Zod V3 to V4.
- Disabled changing the window theme since it crashes the app on macOS.

# v7.2.5

- Fixed broken fullscreen shortcut.
- UI tweaks.

# v7.2.0

- Optimized layout to use a shared add/edit side sheet.
- Updated Mode Watcher to set Tauri app theme.
- Disabled link previews on macOS.
- Updated deps.

# v7.1.0

- Added support for the new Foundry Node.js build. Now users will need to select `main.js` entrypoint directly instead of Foundry directory. I added a legacy fallback for existing servers so they should still work.
- Server sorting is now applied to servers persistent state directly during an update instead of component derived/effect render.

# v7.0.0

- Added server sorting by custom order.
- Updated deps.

# v6.9.7

- Downgrades Linux distro for compiling
- Updated deps.

# v6.9.6

- `better-fetch` for type-safe server status check.
- Updated all deps.

# v6.9.5

- Switch from `tauri:http` to a default `fetch`.

# v6.9.0

- Fixed MacOS bundle. It should not throw a "damaged" error anymore but will ask users to verify opening an unsigned app.
- Display FLC version in the header.

# v6.8.0

- Security fix in dependency
- UI tweaks

# v6.7.5

- Use `runed`/`PersistedState` as a new local storage solution.
- Use `$app/state` instead of `$app/stores`.
- Dark mode tweaks.

# v6.7.0

- Additional type-safety and data validation.

# v6.6.0

- Fixed server check edge cases (partner hostings, subpaths).

# v6.5.0

- Changed the default Foundry window size to fit the login screen UI.
- The update data is now fetched directly from Github repo instead of the website.
- Updater now runs in a "passive" mode and do not require user interactions on Windows.

## v6.4.0

- Fixed issue with fullscreen mode.
- Removed unused plugins and dependencies.

## v6.3.0

- Fixed issue with opening multiple windows of the same Foundry server.
- Enabled SharedArrayBuffer (for Ripper93 Media Optimizer and similar modules).

## v6.2.0

> [!WARNING]  
> Prior to 6.2.0 auto-updater was not working. Now it's fixed but you need to download and install this version manually.

- Fixed Auto-Updater and added a new update controls.
- Replaced tray/buttons controls for Fullscreen and Zoom with Global Shortcuts (Ctrl + ...) and added Help button.
- Added icons to server status details.

## v6.1.0

- Added detailed status of server, if available: version, system, users.
- Linux version is now distributed with `.AppImage` instead of `.deb` for better compatibility.

## v6.0.0

> [!CAUTION]  
> Data from the old version is not compatible with 6.0. Make sure you save what you need before the update.

- Complete app rewrite from scratch
- Linux support (Debian/Ubuntu)
- MacOS ARM support (M1+)
- Tauri 2.0
- Svelte 5
- New UI
- Browser zoom in / zoom out
- Tray controls
- Simplified server management
- Performance improvements

## v4.5.0

- Tauri 2.0 Alpha

## v4.4.0

- SvelteKit 2.0

## v4.3.0

- Server status check
- Node server launcher

## v4.2.0

- UI improvements

## v4.1.0

- Fixed Foundry's drag-and-drop on Windows

## v4.0.0

- Complete project rewrite. Some features may be temporary missing.
- Updated Tauri to 1.5

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
