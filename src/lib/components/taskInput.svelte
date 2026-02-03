<script lang="ts" module>
	const urgencies = [
		{
			value: 'critical',
			label: 'Critical',
			className: 'bg-red-500/20 text-red-500'
		},
		{
			value: 'high',
			label: 'High',
			className: 'bg-yellow-500/20 text-yellow-500'
		},
		{
			value: 'medium',
			label: 'Medium',
			className: 'bg-orange-500/20 text-orange-500'
		},
		{
			value: 'low',
			label: 'Low',
			className: 'bg-green-500/20 text-green-500'
		},
		{
			value: 'today',
			label: 'Today',
			className: 'bg-purple-500/20 text-purple-500'
		}
	];
</script>

<script lang="ts">
	import type { Task } from '../../routes/+page.svelte';

	import UrgencyBtn from './common/buttons/urgencyBtn.svelte';
	import { Plus } from '@lucide/svelte';

	type Props = {
		inputRef: HTMLTextAreaElement;
		toggleIsTyping: (val: boolean) => void;
		addTask: (task: Pick<Task, 'name' | 'urgency'>) => void;
	};

	let { inputRef = $bindable(), toggleIsTyping, addTask }: Props = $props();

	let value: string = $state('');
	let urgency: null | string = $state(null);
	let action: null | string = $state(null);

	const onFocus = () => toggleIsTyping(true);
	const onBlur = () => toggleIsTyping(false);

	const onEnter = () => {
		const name = value.trim();
		if (name === '') return;

		if (!action) {
			addTask({
				name,
				urgency
			});
		}

		value = '';
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const key = e.key;

		if (key === 'Enter') {
			e.preventDefault();
			onEnter();
		} else if (key === 'Escape') onBlur();
	};

	const onUrgencyClick = (val: string) => {
		if (urgency === val) urgency = null;
		else urgency = val;
	};

	// Verify actions on input
	$effect(() => {
		const trimmedValue = value.trim();
		if (trimmedValue === '') return;

		// Urgencies
		if (trimmedValue === '@none') {
			urgency = null;
			value = '';
		} else if (trimmedValue.startsWith('@')) {
			const cleanedUpVal = trimmedValue.substring(1);
			const possibleUrgency = urgencies.find(
				(u) => u.value.toLowerCase() === cleanedUpVal.toLowerCase()
			);
			if (!possibleUrgency) return;

			urgency = possibleUrgency.value;
			value = '';
		}
		// TODO: actions
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={onFocus}
	class="relative w-full cursor-text overflow-clip rounded-t bg-neutral-800 p-2 shadow-inner shadow-neutral-900"
>
	{#if action}
		<p class="absolute top-1 left-1.5 text-sm font-semibold text-neutral-500">
			{action}
		</p>
	{/if}
	<textarea
		bind:value
		bind:this={inputRef}
		onfocus={onFocus}
		onblur={onBlur}
		onkeydown={onKeyDown}
		class="w-full resize-none outline-0 {action ? 'mt-4 h-12' : 'h-16'}"
		placeholder="New task here..."
	></textarea>
	<div></div>
	<div class="flex items-end justify-between gap-2">
		<div
			onclick={(e) => e.stopPropagation()}
			class="flex cursor-default items-center justify-center gap-2"
		>
			{#each urgencies as { label, value, className } (value)}
				<UrgencyBtn
					{label}
					{value}
					onClick={onUrgencyClick}
					selected={urgency === value}
					{className}
				/>
			{/each}
		</div>
		<button
			onclick={(e) => {
				e.stopPropagation();
				onEnter();
			}}
			class="flex items-center justify-center gap-1 rounded bg-neutral-700 px-1.5 py-1.5 text-sm transition-[scale,background-color] hover:bg-neutral-600/70 active:scale-98"
		>
			<Plus size="1.25rem" />
		</button>
	</div>
</div>
