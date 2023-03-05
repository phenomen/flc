<script lang="ts">
  import { fetch } from "@tauri-apps/api/http";
  import { appWindow } from "@tauri-apps/api/window";

  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { localstore } from "svu/store";
  import { z } from "zod";

  import i18nJson from "$lib/i18n.json";
  import ServerLauncher from "$lib/ServerLauncher.svelte";

  import HeroiconsPlusCircle20Solid from "~icons/heroicons/plus-circle-20-solid";
  import HeroiconsMinusCircle20Solid from "~icons/heroicons/minus-circle-20-solid";
  import HeroiconsArrowPath20Solid from "~icons/heroicons/arrow-path-20-solid";
  import HeroiconsArrowRightCircle20Solid from "~icons/heroicons/arrow-right-circle-20-solid";

  //TYPES

  const I18n = z.record(z.record(z.string()));
  const ValidURL = z.union([z.string().url(), z.string().ip()]);
  const PartnerHosting = z.enum(["forge-vtt.com", "moltenhosting.com", "foundryserver.com"]);
  const Server = z.object({
    id: z.string().uuid(),
    host: z.union([z.string().url(), z.string().ip()]),
    label: z.string().optional(),
    status: z.enum(["Active", "Inactive", "Hosting", "Offline"]),
    active: z.boolean(),
    users: z.number().optional(),
    system: z.string().optional(),
    systemVersion: z.string().optional(),
  });
  const ServerUpdate = Server.partial();

  type I18n = z.infer<typeof I18n>;
  type ValidURL = z.infer<typeof ValidURL>;
  type PartnerHosting = z.infer<typeof PartnerHosting>;
  type Server = z.infer<typeof Server>;
  type ServerUpdate = z.infer<typeof ServerUpdate>;

  // VARIABLES

  const defaultStorage: Server[] = [];
  const i18n: I18n = i18nJson;
  const lang = localstore("lang", "en");
  const storage = localstore("storage", defaultStorage);

  let loading: boolean = false;
  let url: string = "";
  let label: string = "";
  let host: string = "";
  let message: string = "";

  //FUNCTIONS

  function generateUUID(): string {
    let uuid = window.crypto.randomUUID();
    return uuid;
  }

  function isValid(url: string): boolean {
    if (ValidURL.safeParse(url).success) {
      host = new URL(url).origin;
      return true;
    } else {
      message = i18n.messageNotURL[$lang];
      return false;
    }
  }

  async function addServer(url: string, label: string) {
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
      checkServer(uuid);
      cleanUp();
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

  async function joinServer(host: string, label: string) {
    appWindow.maximize();
    goto(host);
  }

  // SVELTE MOUNT
  onMount(async () => {
    checkAllServers();
  });
</script>

<section class="mt-4 mb-2">
  <div class="flex space-x-2">
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
        />
      </div>
    </div>

    <button
      type="button"
      class="button bg-orange-600 hover:bg-orange-500 rounded mt-6"
      on:click={() => addServer(url, label)}
    >
      <HeroiconsPlusCircle20Solid />
    </button>
  </div>

  <div class="text-sm text-center text-slate-500 dark:text-slate-300">
    &nbsp;{message}&nbsp;
  </div>
</section>

<section class="flex-1">
  <ul class="mt-2 mb-4 grid grid-cols-1 gap-4">
    {#each $storage.slice().reverse() as server (server.id)}
      <li class="items-center flex">
        <div class=" text-slate-400 hover:text-red-500 items-center absolute -ml-8">
          <button type="button" on:click={() => removeServer(server.id)}>
            <HeroiconsMinusCircle20Solid />
          </button>
        </div>

        <div
          class="flex flex-1 items-center justify-between truncate rounded-l border-l border-t border-b border-slate-200 bg-slate-50 dark:bg-slate-600 dark:border-slate-600 shadow-sm"
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
              {:else}
                {i18n.statusOnline[$lang]} | {i18n.users[$lang]}: {server.users} | {i18n.system[
                  $lang
                ]}: {server.system}
                {server.systemVersion}
              {/if}
            </div>
          </div>
        </div>

        {#if server.status === "Offline"}
          {#if loading}
            <button
              type="button"
              class="button bg-blue-500 hover:bg-blue-400 rounded-r hover:cursor-not-allowed"
            >
              <HeroiconsArrowPath20Solid class="animate-spin" />
            </button>
          {:else}
            <button
              type="button"
              class="button bg-red-500 hover:bg-red-400 rounded-r"
              on:click={() => checkServer(server.id)}
            >
              <HeroiconsArrowPath20Solid />
            </button>
          {/if}
        {:else}
          <button
            type="button"
            class="button bg-emerald-500 hover:bg-emerald-400 rounded-none rounded-r"
            on:click={() => joinServer(server.host, server.label)}
          >
            <HeroiconsArrowRightCircle20Solid />
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<ServerLauncher {checkAllServers} />
