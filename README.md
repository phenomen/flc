# Foundry Lightweight Client (FLC)

FLC is a lightweight desktop application for managing and connecting to Foundry Virtual Tabletop servers.

- **Website:** <https://foundry.ruleplaying.com/flc>
- **Issues**: <https://github.com/phenomen/flc/issues>
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

## Features

### Fast and Bloat-free

No browser bloat saves valuable resources. The entire app is just 5MB and uses 60% less RAM than Google Chrome.

### Secure and Open-Source

All your data is stored locally. No analytics and statistics are collected. Source code is available on GitHub.

### High Compatibility

Works with local servers, IPs, VPN, http and https URLs, and official Foundry VTT hosting providers.

### Server Launcher

NodeJS server is an efficient way to run local Foundry server. It requires significantly less resources than a standalone Electron-based client.

## Installation

Download the latest release for your platform from [GitHub Releases](https://github.com/phenomen/flc/releases) or [Website](https://foundry.ruleplaying.com/flc).

## Development

### Prerequisites

- [Bun](https://bun.sh/)
- [Rust Toolchain](https://www.rust-lang.org/)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/phenomen/flc.git
cd flc
```

2. Install dependencies:

```bash
bun install
```

3. Run in development mode:

```bash
bun run tauri dev
```

### Troubleshooting

**Wayland: Protocol error on startup**

If you see `Error 71 (Protocol error) dispatching to Wayland display`, WebKitGTK has a known compositing issue on some Wayland compositors. The `make run` target sets `WEBKIT_DISABLE_COMPOSITING_MODE=1` automatically. If running Tauri directly, prefix the command:

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 bun run tauri dev
```

Alternatively, force the X11 backend via XWayland:

```bash
GDK_BACKEND=x11 bun run tauri dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments

- [Tauri](https://tauri.app/) - Rust-powered backend
- [Svelte](https://svelte.dev/) - Frontend UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn-svelte](https://www.shadcn-svelte.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons
