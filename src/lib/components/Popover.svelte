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
	import { Progress } from '@skeletonlabs/skeleton-svelte';

	// State
	let open = $state(false);
	let friendId = $state('');
	let showError = $state(false);
	let isConnecting = $state(false);
	let progressValue = $state<number | null>(null);
	let errorMessage = $state('');

	let {
		isValid,
		canConnect
	}: { isValid: (id: string) => boolean; canConnect: (id: string) => Promise<boolean> } = $props();

	async function handleSubmit() {
		if (isValid(friendId) && friendId.trim()) {
			isConnecting = true;
			progressValue = null;
			errorMessage = '';
			
			try {
				const canConnectResult = await canConnect(friendId.trim());
				progressValue = 100;
				
				// Wait a bit to show the 100% state
				await new Promise(resolve => setTimeout(resolve, 500));
				
				if (canConnectResult) {
					const event = new CustomEvent('submit', { detail: { friendId: friendId.trim() } });
					document.dispatchEvent(event);
					open = false;
					friendId = '';
				} else {
					showError = true;
					errorMessage = 'Unable to connect';
				}
			} catch (error) {
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

	function handleInput() {
		showError = false;
		errorMessage = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}

	// Use Floating
	const floating = useFloating({
		whileElementsMounted: autoUpdate,
		get open() {
			return open;
		},
		onOpenChange: (v) => {
			open = v;
		},
		placement: 'top',
		get middleware() {
			return [offset(10), flip()];
		}
	});

	// Interactions
	const role = useRole(floating.context);
	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const interactions = useInteractions([role, click, dismiss]);
</script>

<div>
	<!-- Reference Element -->
	<button
		bind:this={floating.elements.reference}
		{...interactions.getReferenceProps()}
		class="btn-gradient"
	>
		Add Friend
	</button>

	<!-- Backdrop and Modal -->
	{#if open}
		<div
			class="fixed inset-0 h-full w-full bg-black/50 transition-opacity"
			transition:fade={{ duration: 200 }}
			onclick={() => (open = false)}
			role="presentation"
		>
			<div
				bind:this={floating.elements.floating}
				style={floating.floatingStyles}
				{...interactions.getFloatingProps()}
				class="bg-surface-50-900-token w-96 rounded-lg p-6 shadow-lg"
				transition:fade={{ duration: 200 }}
				onclick={(e) => e.stopPropagation()}
			>
				<h2 class="mb-4 text-xl font-bold">Add new friend</h2>
				<div class="mb-4">
					<label
						for="friendId"
						class="mb-2 block text-sm font-medium {showError ? 'text-error-500 shake' : ''}"
					>
						Input their ID:
						{#if showError}
							<span class="ml-2 text-xs">{errorMessage}</span>
						{/if}
					</label>
					<div class="flex gap-2">
						<input
							type="text"
							id="friendId"
							class="input w-full {showError ? 'border-error-500 shake' : ''}"
							placeholder="Enter friend's ID"
							bind:value={friendId}
							onkeydown={handleKeydown}
							oninput={handleInput}
							disabled={isConnecting}
						/>
						<button
							type="button"
							class="btn variant-filled-primary"
							onclick={handleSubmit}
							aria-label="Submit friend ID"
							disabled={isConnecting}
						>
							<BadgePlus size={20} />
						</button>
					</div>
					{#if isConnecting}
						<div class="mt-4">
							<div class="flex flex-col items-center gap-2">
								<Progress value={progressValue} meterAnimate="my-custom-animation" />
								<span class="text-xs text-surface-600-400-token">Connecting...</span>
							</div>
						</div>
					{/if}
				</div>
				<p class="text-surface-600-400-token mt-4 text-sm">
					You can press the <kbd class="kbd">esc</kbd> key or click outside to
					<strong>dismiss</strong> this dialog.
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.shake {
		animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}

	@keyframes shake {
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}
		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}
		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}
		40%,
		60% {
			transform: translate3d(4px, 0, 0);
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
