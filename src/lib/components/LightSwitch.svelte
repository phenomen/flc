<script lang="ts">
	import { setTheme } from "@tauri-apps/api/app";
	import { watch } from "runed";

	import Sun from "@lucide/svelte/icons/sun";
	import Moon from "@lucide/svelte/icons/moon";

	import { mode, toggleMode } from "mode-watcher";
	import { Button } from "$ui/button/index.js";

	watch(
		() => $mode,
		() => {
			setTheme($mode);
		}
	);
</script>

<Button
	onclick={toggleMode}
	variant="outline"
	size="icon"
	title="Toggle Theme">
	<Sun class="block size-5 dark:hidden" />
	<Moon class="hidden size-5 dark:block" />
</Button>
