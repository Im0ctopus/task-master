<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Task Master</title>
</svelte:head>

<div class="min-h-screen w-screen overflow-x-clip bg-neutral-900 text-neutral-200">
	{@render children()}
</div>
