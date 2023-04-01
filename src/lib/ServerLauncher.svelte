<script lang="ts">
  import type { I18n } from "$lib/types";

  import { join } from "@tauri-apps/api/path";
  import { open } from "@tauri-apps/api/dialog";
  import { Command } from "@tauri-apps/api/shell";

  import { localstore } from "svu/store";

  import i18nJson from "$lib/data/i18n.json";
  import TablerFolder from "~icons/tabler/folder";
  import TablerPlayerPlay from "~icons/tabler/player-play";
  import TablerPlayerStop from "~icons/tabler/player-stop";

  export let checkAllServers: Function;

  export let loading: boolean;

  const i18n: I18n = i18nJson;
  const lang = localstore("lang", "en");
  const foundryDir = localstore("foundrydir", "");

  let server: any;
  let launched: boolean = false;
  let serverError: string = "";

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

  async function startServer() {
    if (loading) {
      return;
    }

    if ($foundryDir === "" || $foundryDir === undefined) {
      serverError = "----------- SELECT FOUNDRY VTT INSTALLATION DIRECTORY ----------";
      return;
    }

    loading = true;

    const path = await join($foundryDir, "resources", "app", "main.js");
    const command = new Command("node", [path]);

    let stdoutData = "";
    let stderrData = "";

    command.on("close", (data) => {
      console.log(`Node process finished with code ${data.code} and signal ${data.signal}`);
    });

    command.on("error", (error) => {
      console.error(`command error: "${error}"`);
    });

    command.stdout.on("data", (line) => {
      console.log(line);
      stdoutData += line;
      if (
        stdoutData.includes(
          "Foundry VTT cannot start in this directory which is already locked by another process"
        )
      ) {
        serverError = "------------- FOUNDRY VTT SERVER IS ALREADY RUNNING ------------";
        launched = false;
      } else if (stdoutData.includes("Foundry Virtual Tabletop")) {
        serverError = "---------------- FOUNDRY VTT SERVER IS RUNNING -----------------";
        launched = true;
      }
    });

    command.stderr.on("data", (line) => {
      stderrData += line;

      if (stderrData.includes("Cannot find module")) {
        serverError = "----------- INCORRECT FOUNDRY VTT INSTALLATION FOLDER ----------";
        launched = false;
      } else if (
        stderrData.includes("is not recognized as an internal or external command") ||
        stderrData.includes("program not found")
      ) {
        serverError = "-------------------- NODEJS IS NOT INSTALLED -------------------";
        launched = false;
      } else if (
        stderrData.includes("Foundry VTT cannot start in this directory which is already locked")
      ) {
        serverError = "------------- FOUNDRY VTT SERVER IS ALREADY RUNNING ------------";
        launched = false;
      } else {
        serverError = stderrData;
      }
    });

    server = await command.spawn();
    console.log("pid:", server.pid);

    checkAllServers();
  }

  async function stopServer() {
    await server.kill();
    launched = false;
    serverError = "";
    checkAllServers();
  }

  window.addEventListener("tauri.exit", async () => {
    await stopServer();
  });
</script>

<section class="my-6">
  <div
    class="bg-slate-200 dark:bg-slate-800 p-2 rounded mx-auto text-center justify-center shadow-inner"
  >
    <h2 class="font-medium text-slate-700 dark:text-slate-300">
      {i18n.foundryServerLauncher[$lang]}
    </h2>
    <div class="p-2">
      <div class="w-full flex space-x-2">
        <div class="w-full">
          <input
            type="text"
            name="foundryDir"
            id="foundryDir"
            bind:value={$foundryDir}
            class="block w-full rounded text-slate-950 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:border-orange-500 focus:ring-orange-500 text-sm bg-slate-50 dark:bg-slate-950"
            disabled
          />
        </div>

        <button
          type="button"
          class="button bg-slate-600 hover:bg-slate-500 rounded"
          on:click={() => selectDir()}
        >
          <TablerFolder />
        </button>

        {#if !launched}
          <button
            type="button"
            class="button bg-blue-600 hover:bg-blue-500 rounded disabled:cursor-wait"
            disabled={loading}
            on:click={() => startServer()}
          >
            <TablerPlayerPlay />
          </button>
        {:else}
          <button
            type="button"
            class="button bg-red-600 hover:bg-red-500 rounded"
            on:click={() => {
              stopServer();
            }}
          >
            <TablerPlayerStop />
          </button>
        {/if}
      </div>
      <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {i18n.foundryDirTip[$lang]}
      </div>
      {#if serverError.length > 1}
        <div class="mt-4 p-2 bg-slate-950 rounded-md">
          <p
            class="text-sm font-mono"
            class:text-red-400={!launched}
            class:text-emerald-400={launched}
          >
            {serverError}
          </p>
        </div>
      {/if}
    </div>
  </div>
</section>
