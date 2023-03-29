<script lang="ts">
  import type { I18n, Server, ServerUpdate } from "$lib/types";
  import { ValidURL, PartnerHosting } from "$lib/types";

  import { fetch } from "@tauri-apps/api/http";
  import { appWindow } from "@tauri-apps/api/window";

  import { slide } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { localstore } from "svu/store";

  import ServerLauncher from "$lib/ServerLauncher.svelte";
  import i18nJson from "$lib/i18n.json";

  import TablerPlus from "~icons/tabler/plus";
  import TablerX from "~icons/tabler/x";
  import TablerChevronsRight from "~icons/tabler/chevrons-right";
  import TablerRefresh from "~icons/tabler/refresh";

  const defaultStorage: Server[] = [];
  const i18n: I18n = i18nJson;
  const lang = localstore("lang", "en");
  const storage = localstore("storage", defaultStorage);
  const skipCheck = localstore("skipcheck", false);

  let loading: boolean = false;
  let url: string = "";
  let label: string = "";
  let host: string = "";
  let validationMessage: string = "";

  function isWindows() {
    const userPlatform = window.navigator.platform;

    return /win32/i.test(userPlatform);
  }

  function generateUUID(): string {
    let uuid = window.crypto.randomUUID();
    return uuid;
  }

  function isValid(url: string): boolean {
    if (ValidURL.safeParse(url).success) {
      host = new URL(url).origin;
      validationMessage = "";
      return true;
    } else {
      validationMessage = i18n.messageNotURL[$lang];
      return false;
    }
  }

  async function addServer() {
    if (loading) {
      return;
    }

    if (isValid(url)) {
      const uuid = generateUUID();

      let newServer: Server = {
        id: uuid,
        host: host,
        label: label,
        status: "Offline",
        active: false,
      };

      let servers = $storage;
      servers.push(newServer);
      $storage = servers;

      cleanUp();
      checkServer(uuid);
    }
  }

  function cleanUp() {
    url = "";
    host = "";
    label = "";
  }

  async function removeServer(id: string) {
    let filtered = $storage.filter((item: Server) => item.id !== id);
    $storage = filtered;
  }

  async function checkServer(id: string) {
    loading = true;

    const server = $storage.find((item: Server) => item.id === id);
    const index = $storage.findIndex((item: Server) => item.id === id);

    let update: ServerUpdate = {
      active: false,
      status: "Offline",
    };

    const hostingMatch = PartnerHosting.options.some((hosting) => {
      return server.host.includes(hosting);
    });

    if (hostingMatch) {
      update = {
        active: true,
        status: "Hosting",
      };
    } else if ($skipCheck === true) {
      update = {
        active: true,
        status: "Skipped",
      };
    } else {
      let api: any = {};

      try {
        api = await fetch(server.host + "/api/status", {
          method: "GET",
          timeout: 5,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "FLC/2.0 (Foundry Lightweight Client)",
          },
        });
      } catch (error) {
        console.log(error);
        loading = false;
      } finally {
        if (api.ok) {
          update = {
            active: api.data.active,
            status: api.data.active ? "Active" : "Inactive",
            users: api.data.users,
            system: api.data.system,
            systemVersion: api.data.systemVersion,
          };
        }
      }
    }

    if (index !== -1) {
      $storage[index] = { ...$storage[index], ...update };
    }

    loading = false;
  }

  async function checkAllServers() {
    $storage.forEach((item: Server) => checkServer(item.id));
  }

  function joinServer(host: string) {
    appWindow.maximize();

    goto(host);
  }

  $: {
    $skipCheck;
    checkAllServers();
  }

  onMount(async () => {
    checkAllServers();
  });
</script>

<section class="my-4">
  <form class="flex space-x-2" on:submit={addServer}>
    <div>
      <label for="label" class="block text-sm font-medium text-slate-500 dark:text-slate-100"
        >{i18n.label[$lang]}</label
      >
      <div class="mt-1">
        <input
          type="text"
          name="label"
          id="label"
          bind:value={label}
          placeholder={i18n.labelPlaceholder[$lang]}
          class="block w-full rounded text-slate-950 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:border-orange-500 focus:ring-orange-500 text-sm bg-slate-50 dark:bg-slate-950"
        />
      </div>
    </div>

    <div class="flex-1">
      <label for="url" class="block text-sm font-medium text-slate-500 dark:text-slate-100"
        >{i18n.url[$lang]}</label
      >
      <div class="mt-1">
        <input
          type="text"
          name="url"
          id="url"
          bind:value={url}
          placeholder={i18n.urlPlaceholder[$lang]}
          class="block w-full rounded text-slate-950 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:border-orange-500 focus:ring-orange-500 text-sm bg-slate-50 dark:bg-slate-950"
        />
      </div>
    </div>

    <button
      type="submit"
      class="button bg-orange-600 hover:bg-orange-500 rounded mt-6"
      disabled={loading}
      on:click={addServer}
    >
      <TablerPlus />
    </button>
  </form>

  <div class="text-sm text-center text-orange-500 dark:text-orange-300 mt-1">
    &nbsp;{validationMessage}&nbsp;
  </div>
</section>

<section class="flex-1">
  <ul class="mt-2 mb-4 grid grid-cols-1 gap-4">
    {#each $storage.slice().reverse() as server (server.id)}
      <li class="items-center flex" transition:slide|local>
        <div class="text-slate-400 hover:text-red-600 items-center absolute -ml-8">
          <button type="button" on:click={() => removeServer(server.id)}>
            <TablerX />
          </button>
        </div>

        <div
          class="flex flex-1 items-center justify-between truncate rounded-l border-l border-t border-b bg-slate-50 dark:bg-slate-800 shadow-sm"
          class:!border-blue-500={loading}
          class:border-emerald-500={server.status == "Hosting" ||
            server.status == "Online" ||
            server.status === "Inactive" ||
            server.status == "Skipped"}
          class:border-red-600={server.status === "Offline"}
        >
          <div class="flex-1 truncate px-4 py-2 items-center">
            <span class="text-sm font-medium text-slate-900 dark:text-slate-50"
              >{server.label || ""}</span
            >
            <span class="text-sm text-slate-400">{server.host}</span>
            <div class="text-sm text-slate-500 dark:text-slate-300 truncate flex items-center">
              {#if server.status == "Hosting"}
                {i18n.statusHosting[$lang]}
              {:else if server.status === "Offline"}
                {i18n.statusOffline[$lang]}
              {:else if server.status === "Inactive"}
                {i18n.statusInactive[$lang]}
              {:else if server.status === "Skipped"}
                {i18n.statusSkipped[$lang]}
              {:else}
                {i18n.statusOnline[$lang]} | {i18n.users[$lang]}: {server.users} | {i18n.system[
                  $lang
                ]}: {server.system}
                {server.systemVersion}
              {/if}
            </div>
          </div>
        </div>

        {#if loading}
          <button
            type="button"
            class="button bg-blue-500 hover:bg-blue-400 rounded-r hover:cursor-not-allowed"
          >
            <TablerRefresh class="animate-spin" />
          </button>
        {:else if server.status === "Offline"}
          <button
            type="button"
            class="button bg-red-600 hover:bg-red-500 rounded-r"
            on:click={() => checkServer(server.id)}
          >
            <TablerRefresh />
          </button>
        {:else}
          <button
            type="button"
            class="button bg-emerald-500 hover:bg-emerald-400 rounded-none rounded-r"
            on:click={() => joinServer(server.host)}
          >
            <TablerChevronsRight />
          </button>
        {/if}
      </li>
    {/each}
  </ul>

  <div
    class="p-2  rounded text-center justify-center text-sm text-slate-800  dark:text-slate-400 my-4 mx-auto border border-dashed border-slate-400 dark:border-slate-600"
  >
    {(isWindows() ? "Ctrl" : "Cmd") + " + F11 " + i18n.tipFullscreen[$lang]}
  </div>

  <div class="flex justify-center space-x-6">
    <div class="flex">
      <div class="flex h-6 items-center">
        <input
          id="skipCheck"
          name="skipCheck"
          type="checkbox"
          class="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:bg-slate-950 dark:border-slate-600"
          bind:checked={$skipCheck}
        />
      </div>
      <div class="ml-2 text-sm font-medium leading-6 text-slate-900 dark:text-slate-50">
        <label for="skipCheck">{i18n.skipCheck[$lang]}</label>
      </div>
    </div>
  </div>
</section>

<section class="my-4">
  <ServerLauncher {checkAllServers} />
</section>
