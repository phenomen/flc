<script lang="ts">
	import { SunMoon } from "@lucide/svelte";

	import { toggleMode } from "mode-watcher";
	import { Button } from "$ui/button/index.js";
</script>

<Button
	onclick={toggleMode}
	variant="outline"
	size="icon"
	title="Toggle Theme">
	<SunMoon class="size-5" />
</Button>
