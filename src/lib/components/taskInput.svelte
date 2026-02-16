<script lang="ts">
	import {
		enterAction,
		onAction,
		onUrgencyEdit,
		type Action,
		type ActionActions
	} from '$lib/utils/actionsHelper';
	import { stopFocus } from '$lib/utils/stopFocus';
	import { urgencies } from '$lib/utils/urgencies';
	import type { Task } from '../../routes/+page.svelte';

	import UrgencyBtn from './common/buttons/urgencyBtn.svelte';
	import { Plus, X } from '@lucide/svelte';

	export type InputActions = {
		toggleIsTyping: (val: boolean) => void;
		addTask: (task: Pick<Task, 'name' | 'urgency'>) => void;
		editTask: (id: number, task: Pick<Task, 'name' | 'urgency'>) => void;
		addSubTask: (taskId: number, subTask: Pick<Task, 'name' | 'urgency'>) => void;
		editSubTask: (
			taskId: number,
			subTaskId: number,
			subTask: Pick<Task, 'name' | 'urgency'>
		) => void;
	};

	type Props = {
		value: string;
		inputRef: HTMLTextAreaElement;
		filteredTasks: Task[];
		action: null | Action;
		actions: InputActions;
		toggleSearch: (value: boolean) => void;
	};

	let {
		value = $bindable(),
		inputRef = $bindable(),
		filteredTasks,
		action = $bindable(),
		actions,
		toggleSearch
	}: Props = $props();

	let urgency: null | string = $state(null);

	let { addSubTask, addTask, editTask, toggleIsTyping, editSubTask } = $derived(actions);

	const onFocus = () => toggleIsTyping(true);
	const onBlur = () => toggleIsTyping(false);

	const onEnter = () => {
		const trimmedValue = value.trim();
		if (trimmedValue === '') return;

		if (trimmedValue === ':q') toggleIsTyping(false);
		else if (trimmedValue === '@none' || trimmedValue === '@n') {
			urgency = null;
			if (action && action.type === 'edit')
				onUrgencyEdit(action, urgency, { editTask, editSubTask });
		} else if (trimmedValue.startsWith('@') && !trimmedValue.includes(' ')) {
			const cleanedUpVal = trimmedValue.substring(1);
			const possibleUrgency = urgencies.find(
				(u) => u.value.toLowerCase() === cleanedUpVal.toLowerCase()
			);
			if (!possibleUrgency) {
				console.error('No matching urgency found');
				return;
			}

			urgency = possibleUrgency.value;
			if (action && action.type === 'edit')
				onUrgencyEdit(action, urgency, { editTask, editSubTask });
		} else if (trimmedValue === '/n' || trimmedValue === '/none') action = null;
		else if (trimmedValue.startsWith('/') && !trimmedValue.includes(' ')) {
			const newAction = enterAction(trimmedValue, filteredTasks);
			if (!newAction) return;

			action = newAction;
			if (newAction.type === 'edit') {
				value = newAction.subTask ? newAction.subTask.name : newAction.task.name;
				urgency = newAction.subTask ? newAction.subTask.urgency : newAction.task.urgency;
				return;
			}
		} else if (action) {
			const actions: ActionActions = {
				editTask,
				addSubTask,
				editSubTask
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
		const { key, ctrlKey } = e;

		switch (true) {
			case key === 'Enter': {
				e.preventDefault();
				onEnter();
				break;
			}
			case key === 'Escape': {
				onBlur();
				break;
			}
			case value === '' && key === 'Backspace': {
				if (action) action = null;
				else onBlur();
				break;
			}
			case ctrlKey && key === 'f': {
				e.preventDefault();
				inputRef.blur();
				setTimeout(() => toggleSearch(true), 10);

				break;
			}
		}
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
				<button
					onfocus={stopFocus}
					onclick={() => (action = null)}
					class="shrink-0 hover:text-neutral-300"
				>
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
			onfocus={stopFocus}
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
