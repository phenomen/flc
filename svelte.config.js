// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		//runes: true
	},
	kit: {
		adapter: adapter(),
		alias: {
			"$assets/*": "src/lib/assets/*",
			"$components/*": "src/lib/components/*",
			"$hooks/*": "src/lib/hooks/*",
			"$scripts/*": "src/lib/scripts/*",
			"$ui/*": "src/lib/components/ui/*"
		}
	}
};

export default config;
