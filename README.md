# Foundry Lightweight Client (FLC)

FLC is a lightweight desktop application for managing and connecting to Foundry Virtual Tabletop servers.

- **Website:** https://foundry.ruleplaying.com/flc
- **Issues**: https://github.com/phenomen/flc/issues
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

## Features

### Fast and bloat-free

No browser bloat saves valuable resources. The entire app is just 5MB and uses 60% less RAM than Google Chrome.

### Secure and open-source

All your data is stored locally. No analytics and statistics are collected. Source code is available on GitHub.

### High compatibility

Works with local servers, IPs, VPN, http and https URLs, and official Foundry VTT hosting providers.

### Headless server launcher

NodeJS server is an efficient way to run local Foundry server. It requires significantly less resources than a standalone Electron-based client.

## Installation

Download the latest release for your platform from [GitHub Releases](https://github.com/phenomen/flc/releases)

## Development

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Rust](https://www.rust-lang.org/) (latest stable)
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments

- Built with [Tauri](https://tauri.app/) and [Svelte](https://svelte.dev/)
- UI components from [shadcn-svelte](https://www.shadcn-svelte.com/)
- Icons from [Lucide](https://lucide.dev/)
