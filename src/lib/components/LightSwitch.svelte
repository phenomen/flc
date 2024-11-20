<script lang="ts">
	import { setTheme } from "@tauri-apps/api/app";
	import { watch } from "runed";

	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";

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
	title="Toggle Theme"
>
	<Sun class="size-5 block dark:hidden" />
	<Moon class="size-5 hidden dark:block" />
</Button>
