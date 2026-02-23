<script lang="ts">
	import type { Status } from '$lib/types/status';
	import { taskVariations } from '$lib/utils/taskVariations';

	type Props = {
		selectedTab: Status;
	};

	let { selectedTab }: Props = $props();
	let taskVariation = $derived(taskVariations[selectedTab]);
</script>

<div class="flex h-full w-full items-center justify-center font-semibold">
	{#if selectedTab === 'none'}
		<p class="px-10 text-center text-neutral-500">
			You don't have any working on tasks! Press
			<kbd class="rounded bg-neutral-700 px-1 py-0.5 text-neutral-400">Ctrl</kbd>
			+
			<kbd class="rounded bg-neutral-700 px-1 py-0.5 text-neutral-400">Enter</kbd>
			to jump to the input below and start planing
		</p>
	{:else}
		<p class="px-10 text-center text-neutral-500">
			You don't have any tasks with status
			<span class="rounded capitalize {taskVariation.iconClass} px-1 py-0.5"> {selectedTab} </span>
			yet
		</p>
	{/if}
</div>
