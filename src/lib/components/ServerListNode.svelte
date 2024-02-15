<script lang="ts">
	import type { NodeServer } from '$lib/types';

	import { join } from '@tauri-apps/api/path';
	import { Command } from '@tauri-apps/plugin-shell';

	import { lc } from '$lib/tools';
	import { nodeservers } from '$lib/stores';
	import * as Alert from '$lib/components/ui/alert';
	import ServerItemNode from './ServerItemNode.svelte';
	import { onMount } from 'svelte';

	let launched: string = '';
	let nodeserver: any;
	let consoleMessage: string;
	let loading: boolean = false;

	function removeServerNode(id: string) {
		let filtered = $nodeservers.filter((item: NodeServer) => item.id !== id);
		$nodeservers = filtered;
	}

	async function startServerNode(server: NodeServer) {
		if (loading) {
			return;
		}

		launched = server.id;

		const path = await join(server.foundryPath, 'resources', 'app', 'main.js');
		const dataPath = server.dataPath ? `--dataPath=${server.dataPath}` : '';
		const port = server.port ? `--port=${server.port}` : '';
		const world = server.world ? `--world=${server.world}` : '';
		const args = server.args ? `${server.args}` : '';

		const command = new Command('node', [path, dataPath, port, world, args]);

		let stdoutData = '';
		let stderrData = '';

		command.on('close', (data: any) => {
			consoleMessage = `Node process finished`;
			launched = '';
		});

		command.on('error', (error: string) => {
			consoleMessage = `command error: "${error}"`;
			launched = '';
		});

		command.stdout.on('data', (line: string) => {
			stdoutData += line;

			if (
				stdoutData.includes(
					'Foundry VTT cannot start in this directory which is already locked by another process'
				)
			) {
				consoleMessage = 'FOUNDRY VTT SERVER IS ALREADY RUNNING';
				launched = '';
			} else if (stdoutData.includes('Foundry Virtual Tabletop')) {
				consoleMessage = `FOUNDRY VTT SERVER "${server.label}" IS RUNNING`;
				launched = server.id;
			}
		});

		command.stderr.on('data', (line: string) => {
			stderrData += line;

			if (stderrData.includes('Cannot find module')) {
				consoleMessage = 'INCORRECT FOUNDRY VTT INSTALLATION FOLDER';
				launched = '';
			} else if (
				stderrData.includes('is not recognized as an internal or external command') ||
				stderrData.includes('program not found')
			) {
				consoleMessage = 'NODEJS IS NOT INSTALLED';
				launched = '';
			} else if (
				stderrData.includes('Foundry VTT cannot start in this directory which is already locked')
			) {
				consoleMessage = 'FOUNDRY VTT SERVER IS ALREADY RUNNING';
				launched = '';
			} else {
				consoleMessage = stderrData;
			}
		});

		nodeserver = await command.spawn();
		console.log('pid:', nodeserver.pid);

		loading = false;
	}

	async function stopServerNode() {
		await nodeserver.kill();
		launched = '';
	}

	onMount(() => {
		window.addEventListener('tauri.exit', async () => {
			await stopServerNode();
		});
	});
</script>

{#if consoleMessage?.length > 1}
	<div class="my-6 p-2 bg-foreground text-background rounded-md">
		<p class="text-xs font-mono">
			{consoleMessage}
		</p>
	</div>
{/if}

<div class="my-6">
	{#if $nodeservers.length === 0}
		<Alert.Root>
			<Alert.Description class="text-center">{lc.s('emptyListMessage')}</Alert.Description>
		</Alert.Root>
	{:else}
		<div class="grid gap-2">
			{#each $nodeservers.toReversed() as server (server.id)}
				<ServerItemNode
					{server}
					{launched}
					on:removeServerNodeEvent={(e) => removeServerNode(e.detail)}
					on:startServerNodeEvent={(e) => startServerNode(e.detail)}
					on:stopServerNodeEvent={(e) => stopServerNode()}
				/>
			{/each}
		</div>
	{/if}
</div>
