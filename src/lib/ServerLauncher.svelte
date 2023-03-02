<script lang="ts">
  import { Command } from "@tauri-apps/api/shell";
  import { open } from "@tauri-apps/api/dialog";

  import { onMount } from "svelte";
  import { localstore } from "svu/store";
  import { z } from "zod";

  import i18nJson from "$lib/i18n.json";

  import HeroiconsFolder20Solid from "~icons/heroicons/folder-20-solid";
  import HeroiconsPlay20Solid from "~icons/heroicons/play-20-solid";
  import HeroiconsStop20Solid from "~icons/heroicons/stop-20-solid";

  export let checkAllServers: Function;

  const I18n = z.record(z.record(z.string()));
  type I18n = z.infer<typeof I18n>;

  const i18n: I18n = i18nJson;
  const lang = localstore("lang", "en");
  const foundryDir = localstore("foundrydir", "");

  let launched: boolean = false;
  let serverError: string = "";
  let server: any;

  async function selectDir() {
    const selected = await open({
      directory: true,
    });

    if (selected === null) {
      return;
    } else {
      $foundryDir = selected;
    }
  }

  async function launchServer() {
    const dir = $foundryDir + "/resources/app/main.js";
    const command = new Command("node", [dir]);

    launched = true;
    serverError = "";

    command.on("close", (data) => {
      console.log(`finished with code ${data.code} ${data.signal}`);
    });

    command.on("error", (error) => {
      console.error(`error: "${error}"`);
      launched = false;
    });

    command.stdout.on("data", (line) => console.log(`"${line}"`));
    command.stderr.on("data", (line) => {
      console.error(`error: "${line}"`);
      serverError = "Something went wrong";
      launched = false;
    });

    server = await command.spawn();

    checkAllServers();
  }

  async function stopServer() {
    await server.kill();
    launched = false;
  }

  // SVELTE MOUNT
  onMount(async () => {
    window.addEventListener("tauri.exit", async () => {
      await stopServer();
    });
  });
</script>

<section class="my-10">
  {#if launched}
    <div
      class="w-full p-2 rounded bg-slate-200 dark:bg-slate-800 flex space-x-2 items-center mx-auto text-center justify-center"
    >
      <div class="font-medium text-slate-700 dark:text-slate-300">
        {i18n.foundryServerLaunched[$lang]}
      </div>
      <button
        type="button"
        class="button bg-red-600 hover:bg-red-500 rounded"
        on:click={() => {
          stopServer();
          checkAllServers();
        }}
      >
        <HeroiconsStop20Solid />
      </button>
    </div>
  {:else}
    <div class="bg-slate-200 dark:bg-slate-800 p-2 rounded">
      <h2 class="text-center font-medium text-slate-700 dark:text-slate-300">
        {i18n.foundryHeadlessLauncher[$lang]}
      </h2>
      <div class="p-2">
        <div class="w-full flex space-x-2">
          <div class="w-full">
            <input
              type="text"
              name="foundryDir"
              id="foundryDir"
              bind:value={$foundryDir}
              disabled
            />
          </div>

          <button
            type="button"
            class="button bg-slate-600 hover:bg-slate-500 rounded "
            on:click={() => selectDir()}
          >
            <HeroiconsFolder20Solid />
          </button>

          <button
            type="button"
            class="button bg-blue-600 hover:bg-blue-500 rounded "
            on:click={() => launchServer()}
          >
            <HeroiconsPlay20Solid />
          </button>
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {i18n.foundryDirTip[$lang]}
        </div>
        <div class="text-center text-red-500">{serverError}</div>
      </div>
    </div>
  {/if}
</section>
