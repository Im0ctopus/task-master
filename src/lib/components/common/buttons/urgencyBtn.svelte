<script lang="ts">
	type Props = {
		value: string;
		label: string;
		className: string;
		onClick: (value: string) => void;
		selected: boolean;
	};

	let { label, onClick, value, selected, className }: Props = $props();

	const handleClick = () => {
		!selected && onClick(value);
	};
</script>

<button
	aria-label={value}
	onclick={handleClick}
	class="rounded px-1 py-0.5 text-sm {selected
		? className
		: 'bg-neutral-700/70 text-neutral-400'} transition-colors ease-out"
>
	{label}
</button>
