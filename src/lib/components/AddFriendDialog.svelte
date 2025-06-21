<script lang="ts">
	// import { fade } from 'svelte/transition';
	import BadgePlus from '@lucide/svelte/icons/badge-plus';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import Dialog from '$lib/components/Dialog.svelte';
    import Plus from '@lucide/svelte/icons/plus';

	// Props
	export let id: string;
	export let isValid: (id: string) => boolean;
	export let canConnect: (id: string) => Promise<boolean>;

    let DialogRef: Dialog | null = null;

	let showError: boolean = false;
	let isConnecting: boolean = false;
	let progressValue: number | null = null;
	let errorMessage = '';
    let friendId: string = '';

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
                    // Close the dialog and reset the form
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
        DialogRef?.closeDialog();
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



<Dialog bind:this={DialogRef}>
	<h2 class="mb-4 text-xl font-bold select-none">Add new friend</h2>
	<h3 class="mb-4 text-l font-italic">Your Id: {id}</h3>

	<div class="mb-4 space-y-2 select-none">
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
</Dialog>


<!-- Interface -->
<div class="border-surface-200-800 border-t-[1px] p-4 flex items-center justify-center">
	<!-- Trigger -->
	<button
		class="btn preset-filled"
		onclick={() => DialogRef?.openDialog()}
	>
		<Plus /> Add Friend
	</button>
</div>

