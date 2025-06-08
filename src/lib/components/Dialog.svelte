<script lang="ts">
	let elemModal: HTMLDialogElement | null = null;

	import {
		autoUpdate,
		flip,
		offset,
		useClick,
		useDismiss,
		useFloating,
		useInteractions,
		useRole
	} from '@skeletonlabs/floating-ui-svelte';
	import { fade } from 'svelte/transition';
	import BadgePlus from '@lucide/svelte/icons/badge-plus';
	import Plus from '@lucide/svelte/icons/plus';
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	// Props
	export let isValid: (id: string) => boolean;
	export let canConnect: (id: string) => Promise<boolean>;

	let open = false;
	let friendId = '';
	let showError = false;
	let isConnecting = false;
	let progressValue: number | null = null;
	let errorMessage = '';

	const floating = useFloating({
		whileElementsMounted: autoUpdate,
		get open() {
			return open;
		},
		onOpenChange: (v) => (open = v),
		placement: 'top',
		get middleware() {
			return [offset(10), flip()];
		}
	});

	const role = useRole(floating.context);
	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const interactions = useInteractions([role, click, dismiss]);

	async function handleSubmit() {
		if (isValid(friendId.trim())) {
			isConnecting = true;
			progressValue = null;
			errorMessage = '';

			try {
				const canConnectResult = await canConnect(friendId.trim());
				progressValue = 100;
				await new Promise((r) => setTimeout(r, 500));

				if (canConnectResult) {
					document.dispatchEvent(
						new CustomEvent('submit', {
							detail: { friendId: friendId.trim() }
						})
					);
					resetForm();
				} else {
					showError = true;
					errorMessage = 'Unable to connect';
				}
			} catch {
				showError = true;
				errorMessage = 'Unable to connect';
			} finally {
				isConnecting = false;
			}
		} else {
			showError = true;
			errorMessage = 'Incorrect ID';
		}
	}

	function resetForm() {
		open = false;
		friendId = '';
		showError = false;
		errorMessage = '';
		progressValue = null;
		isConnecting = false;
	}

	function handleInput() {
		showError = false;
		errorMessage = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') handleSubmit();
	}
</script>

<!-- Dialog -->
<dialog
	bind:this={elemModal}
	data-dialog
	class="rounded-container select-none bg-surface-100-900 backdrop:bg-surface-50/75 dark:backdrop:bg-surface-950/75 top-1/2 left-1/2 z-10 max-w-[640px] -translate-1/2 space-y-4 p-4 text-inherit"
    onclick={() => elemModal?.close()}
    >
	<div
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
		tabindex="0"
		role="dialog"
		aria-modal="true"
	>
		<h2 class="mb-4 text-xl font-bold">Add new friend</h2>

		<div class="mb-4 space-y-2">
			<label for="friendId" class="block text-sm font-medium"> Input their ID: </label>
			<input
				id="friendId"
				type="text"
				placeholder="Enter friend's ID"
				class="input w-full {showError ? 'border-error-500 animate-shake' : ''}"
				bind:value={friendId}
				onkeydown={handleKeydown}
				oninput={handleInput}
				disabled={isConnecting}
			/>

			<button
				type="button"
				class="btn variant-filled-primary mt-2"
				onclick={handleSubmit}
				disabled={isConnecting}
			>
				<BadgePlus size={20} />
			</button>

			{#if showError}
				<p class="text-error-500 text-sm">{errorMessage}</p>
			{/if}
		</div>

		{#if isConnecting}
			<div class="mt-4 flex flex-col items-center gap-2">
				<Progress value={progressValue} meterAnimate="my-custom-animation" />
				<span class="text-muted text-xs">Connecting...</span>
			</div>
		{/if}

		<p class="text-muted mt-6 text-sm">
			Press <kbd class="kbd">esc</kbd> or click outside to dismiss.
		</p>
	</div>
div</dialog>
<!-- Interface -->
<div class="flex items-center justify-center">
	<!-- Trigger -->
	<button
		bind:this={floating.elements.reference}
		{...interactions.getReferenceProps()}
		class="btn preset-filled"
		onclick={() => elemModal?.showModal()}
		data-dialog-show
	>
		<Plus /> Add Friend
	</button>
</div>

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
