<script lang="ts">
	import { lc } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as Alert from '$lib/components/ui/alert';

	let glEnabled = false;
	let highPerf = false;

	function checkWebGL() {
		let canvas = document.createElement('canvas');

		let gl = canvas.getContext('webgl2', {
			powerPreference: 'high-performance'
		});

		if (gl) {
			glEnabled = true;
			if (gl.getContextAttributes()?.powerPreference === 'high-performance') {
				highPerf = true;
			}
		}
	}

	onMount(() => {
		checkWebGL();
	});
</script>

<Alert.Root
	class={!glEnabled || !highPerf
		? 'border-red-500 text-red-500'
		: 'border-emerald-500 text-emerald-500'}
>
	<Alert.Description class="text-center">
		<span>
			{#if glEnabled}
				WebGL2 {lc.s('isAvailable')}
			{:else}
				WebGL2 {lc.s('isNotAvailable')}
			{/if}
		</span>
		<span> | </span>
		<span>
			{#if highPerf}
				{lc.s('highPerformance')} {lc.s('isAvailable')}
			{:else}
				{lc.s('highPerformance')} {lc.s('isNotAvailable')}
			{/if}
		</span></Alert.Description
	>
</Alert.Root>
