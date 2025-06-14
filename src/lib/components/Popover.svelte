<script lang="ts">
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
					document.dispatchEvent(new CustomEvent('submit', {
						detail: { friendId: friendId.trim() }
					}));
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

<div>
	<!-- Trigger -->
	<button
		bind:this={floating.elements.reference}
		{...interactions.getReferenceProps()}
		class="btn btn-lg preset-filled w-full"
	>
		<Plus /> Add Friend
	</button>

	<!-- Modal -->
	{#if open}
		<div
			class="fixed inset-0 bg-black/50 z-40"
			transition:fade
			on:click={() => (open = false)}
			role="presentation"
		>
			<div
				bind:this={floating.elements.floating}
				style={floating.floatingStyles}
				{...interactions.getFloatingProps()}
				class="bg-surface w-96 rounded-xl p-6 shadow-lg mx-auto mt-24 z-50"
				transition:fade
				on:click|stopPropagation
			>
				<h2 class="text-xl font-bold mb-4">Add new friend</h2>

				<div class="mb-4 space-y-2">
					<label for="friendId" class="block text-sm font-medium">
						Input their ID:
					</label>
					<input
						id="friendId"
						type="text"
						placeholder="Enter friend's ID"
						class="input w-full {showError ? 'border-error-500 animate-shake' : ''}"
						bind:value={friendId}
						on:keydown={handleKeydown}
						on:input={handleInput}
						disabled={isConnecting}
					/>

					{#if showError}
						<p class="text-error-500 text-sm">{errorMessage}</p>
					{/if}

					<button
						type="button"
						class="btn variant-filled-primary mt-2"
						on:click={handleSubmit}
						disabled={isConnecting}
					>
						<BadgePlus size={20} />
					</button>
				</div>

				{#if isConnecting}
					<div class="mt-4 flex flex-col items-center gap-2">
						<Progress value={progressValue} meterAnimate="my-custom-animation" />
						<span class="text-xs text-muted">Connecting...</span>
					</div>
				{/if}

				<p class="mt-6 text-sm text-muted">
					Press <kbd class="kbd">esc</kbd> or click outside to dismiss.
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.animate-shake) {
		animation: shake 0.4s ease-in-out;
	}

	@keyframes shake {
		10%, 90% { transform: translateX(-1px); }
		20%, 80% { transform: translateX(2px); }
		30%, 50%, 70% { transform: translateX(-4px); }
		40%, 60% { transform: translateX(4px); }
	}

	:global(.my-custom-animation) {
		animation: my-custom-animation 2s ease-in-out infinite;
	}
	@keyframes my-custom-animation {
		0% { translate: -100%; }
		25% { scale: 1; }
		50% { scale: 0.5 1; translate: 0%; }
		75% { scale: 1; }
		100% { translate: 100%; }
	}
</style>
