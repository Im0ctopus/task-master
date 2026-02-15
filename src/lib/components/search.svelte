<script lang="ts">
	import { Search, X } from '@lucide/svelte';

	type Props = {
		searchInputRef: HTMLInputElement;
		isSearching: boolean;
		searchValue: string;
		onBlur: () => void;
		onClose: () => void;
		taskAmount: number;
		toggleIsTyping: (value: boolean) => void;
	};

	let {
		isSearching,
		searchValue = $bindable(),
		onBlur,
		searchInputRef = $bindable(),
		onClose,
		taskAmount,
		toggleIsTyping
	}: Props = $props();

	let render = $state(false);
	let animate = $state(false);

	$effect(() => {
		if (!isSearching) {
			animate = false;
			return;
		}

		render = isSearching;
		const timeout = setTimeout(() => {
			animate = true;
			searchInputRef.focus();
		}, 10);

		return () => {
			clearTimeout(timeout);
		};
	});

	const handleBlur = () => {
		searchInputRef.blur();
		onBlur();
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const { key, ctrlKey } = e;

		if (ctrlKey && key === 'f') {
			e.preventDefault();
			return;
		}

		switch (true) {
			case ctrlKey && key === 'f': {
				e.preventDefault();
				return;
			}
			case ctrlKey && key === 'Enter': {
				searchInputRef.blur();
				setTimeout(() => toggleIsTyping(true), 10);
				break;
			}
			case key === 'Enter':
			case key === 'Escape': {
				handleBlur();
				break;
			}
		}
	};
</script>

{#if render}
	<div
		ontransitionend={() => {
			if (!isSearching) render = false;
		}}
		class="absolute top-2 right-2 flex items-center justify-center gap-2 rounded bg-neutral-800 px-2 py-1.5 transition-[opacity,translate] duration-300 ease-out {!animate &&
			'-translate-y-3 opacity-0'}"
	>
		<Search size="1rem" />
		<input
			class="rounded bg-neutral-700 px-2 py-1 text-sm outline-0"
			onblur={handleBlur}
			onkeydown={onKeyDown}
			bind:value={searchValue}
			bind:this={searchInputRef}
			placeholder="Find"
		/>
		<p class="w-16 text-sm {!taskAmount && 'text-red-300'} ">
			{searchValue.trim() !== '' ? taskAmount || 'No results' : ''}
		</p>
		<button
			onclick={onClose}
			class="cursor-pointer rounded p-0.75 transition-[scale,background-color] hover:bg-neutral-700/50 active:scale-97"
		>
			<X size="1rem" />
		</button>
	</div>
{/if}
