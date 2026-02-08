<script lang="ts" module>
	export type Tab = 'workingOn' | 'started' | 'done' | 'canceled';

	export const tabs: {
		label: string;
		value: Tab;
	}[] = [
		{ label: 'Working On', value: 'workingOn' },
		{ label: 'Started', value: 'started' },
		{ label: 'Done', value: 'done' },
		{ label: 'Canceled', value: 'canceled' }
	];
</script>

<script lang="ts">
	type Props = {
		selectedTab: Tab;
	};

	let { selectedTab = $bindable() }: Props = $props();
</script>

<div
	class="relative flex w-full max-w-4xl shrink-0 items-start justify-start gap-1 overflow-auto px-2 pt-7 pb-0.5 text-sm"
>
	{#each tabs as { label, value }, index (index)}
		<button
			id="tab_{value}"
			class="rounded p-1 transition-colors duration-150 ease-out {selectedTab !== value &&
				'cursor-pointer text-neutral-500'}"
			onclick={() => (selectedTab = value)}
		>
			{label}
		</button>
	{/each}
</div>
