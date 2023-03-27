<script lang="ts">
  import { onMount } from "svelte";
  import { localstore } from "svu/store";

  import HeroiconsSun20Solid from "~icons/heroicons/sun-20-solid";
  import HeroiconsMoon20Solid from "~icons/heroicons/moon-20-solid";

  const theme = localstore("theme", "light");
  const lang = localstore("lang", "en");

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

  function switchLang() {
    if ($lang === "en") {
      $lang = "ru";
    } else {
      $lang = "en";
    }
    location.reload();
  }

  onMount(async () => {
    setTheme();
  });
</script>

<footer class="my-4 text-slate-500 dark:text-slate-200 items-center text-center">
  <button on:click={() => switchTheme()}>
    {#if $theme === "dark"}
      <HeroiconsMoon20Solid />
    {:else}
      <HeroiconsSun20Solid />
    {/if}
  </button>
  <button on:click={() => switchLang()} class="uppercase font-medium">
    <svg />{$lang}
  </button>
</footer>
