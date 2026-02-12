<script lang="ts">
	import type { SubTask } from '../../../../routes/+page.svelte';

	type Props = {
		subTasks: SubTask[];
		isOpen: boolean;
	};

	let { subTasks, isOpen }: Props = $props();

	let animateOpen = $state();
	let render = $state(false);
	let subTaskListRef: HTMLElement | null = $state(null);

	$effect(() => {
		if (!isOpen) {
			animateOpen = false;
			return;
		}

		render = isOpen;
		const timeout = setTimeout(() => (animateOpen = true), 10);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

{#if render}
	<div
		class="overflow-hidden transition-[max-height] duration-300 ease-out"
		style="max-height: {animateOpen ? subTaskListRef?.scrollHeight : 0}px;"
		ontransitionend={() => {
			if (!isOpen) render = false;
		}}
	>
		<div bind:this={subTaskListRef} class="pt-3"></div>
	</div>
{/if}
