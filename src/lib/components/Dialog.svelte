<script lang="ts">
	import { Rabbit } from '@lucide/svelte/icons';

	let { children } = $props<{ children: null | (() => any) }>();
	let elemModal: HTMLDialogElement | null = null;
	let rotating = $state(false);

	function openDialog() {
		if (elemModal) {
			elemModal.showModal();
		}
	}
	function closeDialog() {
		if (elemModal) {
			elemModal.close();
		}
	}
	export { openDialog, closeDialog };
</script>

<!-- Dialog -->
<dialog
	bind:this={elemModal}
	data-dialog
	class="rounded-container bg-surface-100-900 backdrop:bg-surface-50/75 dark:backdrop:bg-surface-950/75 top-1/2 left-1/2 z-10 max-w-[640px] -translate-1/2 space-y-4 p-4 text-inherit select-none"
	onclick={() => elemModal?.close()}
>
	<div
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
		}}
		tabindex="0"
		role="dialog"
		aria-modal="true"
	>
		{#if children}
			{@render children()}
		{:else}
			<div class="text-center text-gray-500">Empty dialog.</div>
			<div
				role="button"
				tabindex="0"
				onmouseenter={() => (rotating = true)}
				onmouseleave={() => (rotating = false)}
				class="transform: flex items-center justify-center p-3 text-gray-500"
			>
				<Rabbit class="animate-bunny-jump h-12 w-12" />
			</div>
		{/if}

		<p class="text-muted mt-6 text-sm">
			Press <kbd class="kbd">esc</kbd> or click outside to dismiss.
		</p>
	</div>
</dialog>

<style>
	/* NOTE: add the following styles to your global stylesheet. */
	dialog,
	dialog::backdrop {
		--anim-duration: 250ms;
		transition:
			display var(--anim-duration) allow-discrete,
			overlay var(--anim-duration) allow-discrete,
			opacity var(--anim-duration);
		opacity: 0;
	}
	/* Animate In */
	dialog[open],
	dialog[open]::backdrop {
		opacity: 1;
	}
	/* Animate Out */
	@starting-style {
		dialog[open],
		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	:global(.animate-shake) {
		animation: shake 0.4s ease-in-out;
	}

	@keyframes shake {
		10%,
		90% {
			transform: translateX(-1px);
		}
		20%,
		80% {
			transform: translateX(2px);
		}
		30%,
		50%,
		70% {
			transform: translateX(-4px);
		}
		40%,
		60% {
			transform: translateX(4px);
		}
	}

	:global(.my-custom-animation) {
		animation: my-custom-animation 2s ease-in-out infinite;
	}
	@keyframes my-custom-animation {
		0% {
			translate: -100%;
		}
		25% {
			scale: 1;
		}
		50% {
			scale: 0.5 1;
			translate: 0%;
		}
		75% {
			scale: 1;
		}
		100% {
			translate: 100%;
		}
	}
</style>
