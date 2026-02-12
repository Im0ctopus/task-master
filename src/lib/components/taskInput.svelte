<script lang="ts">
	import { enterAction, onAction, type Action, type actionActions } from '$lib/utils/actionsHelper';
	import { urgencies } from '$lib/utils/urgencies';
	import type { Task } from '../../routes/+page.svelte';

	import UrgencyBtn from './common/buttons/urgencyBtn.svelte';
	import { Plus, X } from '@lucide/svelte';

	type Props = {
		inputRef: HTMLTextAreaElement;
		toggleIsTyping: (val: boolean) => void;
		addTask: (task: Pick<Task, 'name' | 'urgency'>) => void;
		editTask: (id: number, task: Pick<Task, 'name' | 'urgency'>) => void;
		addSubTask: (taskId: number, subTask: Pick<Task, 'name' | 'urgency'>) => void;
		filteredTasks: Task[];
		action: null | Action;
	};

	let {
		inputRef = $bindable(),
		toggleIsTyping,
		addTask,
		editTask,
		filteredTasks,
		action = $bindable(),
		addSubTask
	}: Props = $props();

	let value: string = $state('');
	let urgency: null | string = $state(null);

	const onFocus = () => toggleIsTyping(true);
	const onBlur = () => toggleIsTyping(false);

	const onEnter = () => {
		const trimmedValue = value.trim();
		if (trimmedValue === '') return;

		if (trimmedValue === ':q') toggleIsTyping(false);
		else if (trimmedValue === '@none' || trimmedValue === '@n') urgency = null;
		else if (trimmedValue.startsWith('@') && !trimmedValue.includes(' ')) {
			const cleanedUpVal = trimmedValue.substring(1);
			const possibleUrgency = urgencies.find(
				(u) => u.value.toLowerCase() === cleanedUpVal.toLowerCase()
			);
			if (!possibleUrgency) {
				console.error('No matching urgency found');
				return;
			}

			urgency = possibleUrgency.value;
		} else if (trimmedValue === '/n' || trimmedValue === '/none') action = null;
		else if (trimmedValue.startsWith('/') && !trimmedValue.includes(' ')) {
			const newAction = enterAction(trimmedValue, filteredTasks);
			if (!newAction) return;

			action = newAction;
			urgency = newAction.subTask ? newAction.subTask.urgency : newAction.task.urgency;
		} else if (action) {
			const actions: actionActions = {
				editTask,
				addSubTask
			};
			onAction(trimmedValue, action, urgency, actions);
		} else {
			addTask({
				name: trimmedValue,
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
		else if (action && value === '' && key === 'Backspace') action = null;
	};

	const onUrgencyClick = (val: string) => {
		if (urgency === val) urgency = null;
		else urgency = val;
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={onFocus}
	class="relative w-full cursor-text overflow-clip rounded-t bg-neutral-800 p-2 shadow-inner shadow-neutral-900"
>
	{#if action}
		<!-- TODO: Change this to div parented and add remove btn -->
		<div class="absolute inset-x-0 top-1 p-1">
			<div
				title={`${action.type} - ${action.task.name}${action.subTask ? `/${action.subTask.name}` : ''}`}
				class="flex w-fit max-w-full min-w-0 items-center justify-start gap-1 overflow-hidden rounded bg-neutral-700 px-1 py-0.5 text-xs font-semibold text-neutral-400 capitalize select-none"
			>
				<p class="min-w-0 truncate">
					{`${action.type} - ${action.task.name}${action.subTask ? `/${action.subTask.name}` : ''}`}
				</p>
				<button onclick={() => (action = null)} class="shrink-0 hover:text-neutral-300">
					<X size="1rem" />
				</button>
			</div>
		</div>
	{/if}
	<textarea
		bind:value
		bind:this={inputRef}
		onfocus={onFocus}
		onblur={onBlur}
		onkeydown={onKeyDown}
		class="w-full resize-none outline-0 transition-all duration-150 ease-out {action
			? 'mt-5.5 h-10.5'
			: 'h-16'}"
		placeholder="What's the plan?"
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
