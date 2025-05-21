<script lang="ts">
	import Sun from "@lucide/svelte/icons/sun";
	import Moon from "@lucide/svelte/icons/moon";

	import { mode, toggleMode } from "mode-watcher";
	import { Button } from "$ui/button/index.js";
</script>

<Button
	onclick={toggleMode}
	variant="outline"
	size="icon"
	title="Toggle Theme">
	<Sun class="block size-5 dark:hidden" />
	<Moon class="hidden size-5 dark:block" />
</Button>
