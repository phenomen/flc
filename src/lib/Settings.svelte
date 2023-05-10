<script lang="ts">
  import type { I18n } from "$lib/types";

  import { writable } from "svelte/store";
  import { localstore } from "$lib/util";

  import i18nJson from "$lib/data/i18n.json";

  import IconMoon from "~icons/heroicons/moon-20-solid";
  import IconSun from "~icons/heroicons/sun-20-solid";
  import IconShieldCheck from "~icons/heroicons/shield-check-20-solid";
  import IconShieldX from "~icons/heroicons/shield-exclamation-20-solid";

  const i18n: I18n = i18nJson;

  const theme = localstore(writable("light"), "theme");
  const lang = localstore(writable("en"), "lang");
  const skipCheck = localstore(writable(false), "skipcheck");

  function setTheme() {
    if ($theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function switchTheme() {
    if ($theme === "dark") {
      $theme = "light";
    } else {
      $theme = "dark";
    }
    setTheme();
  }

  function switchCheck() {
    $skipCheck = !$skipCheck;
    location.reload();
  }

  setTheme();
</script>

<div
  class="text-lg text-slate-500 dark:text-slate-200 items-center space-x-2 flex"
>
  <button
    on:click={() => switchCheck()}
    title={i18n.toggleCheck[$lang]}
    class="p-1 hover:text-orange-500"
    class:text-red-600={$skipCheck}
    class:text-emerald-500={!$skipCheck}
  >
    {#if $skipCheck}
      <IconShieldX />
    {:else}
      <IconShieldCheck />
    {/if}
  </button>
  <button
    on:click={() => switchTheme()}
    title={i18n.toggleTheme[$lang]}
    class="p-1 hover:text-orange-500"
  >
    {#if $theme === "dark"}
      <IconMoon />
    {:else}
      <IconSun />
    {/if}
  </button>

  <div>
    <select
      id="lang"
      name="lang"
      bind:value={$lang}
      on:change={() => location.reload()}
      class="block rounded border-0 text-slate-900 dark:text-slate-300 dark:ring-slate-900 dark:bg-slate-800 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-orange-600 sm:text-sm border-none"
    >
      <option value="en">EN-US</option>
      <option value="pt">PT-BR</option>
      <option value="ru">RU-RU</option>
      <option value="es">ES-ES</option>
    </select>
  </div>
</div>
