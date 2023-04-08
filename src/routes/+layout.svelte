<script lang="ts">
  import "../app.css";
  import Header from "$lib/Header.svelte";
</script>

<main class="max-w-xl py-6 px-2 m-auto w-full h-full flex flex-col align-middle justify-center">
  <Header />
  <slot />
</main>
