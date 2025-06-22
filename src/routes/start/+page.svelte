<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { chatStore } from '$lib/stores/chat';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import User from '@lucide/svelte/icons/user';
	import { browser } from '$app/environment';

	let name = '';
	let showError = false;
	let errorMessage = '';
	let isCreating = false;
	let progressValue: number | null = null;

	onMount(() => {
		if (browser) {
			// Check if user already has a name stored
			const storedName = localStorage.getItem('user-name');
			if (storedName) {
				// Redirect to chat page if name exists
				goto('/chat');
			}
		}
	});

	function validateName(name: string): boolean {
		return name.length >= 3;
	}

	async function handleSubmit() {
		if (validateName(name.trim())) {
			isCreating = true;
			progressValue = null;
			errorMessage = '';

			try {
				// Simulate processing time
				progressValue = 25;
				await new Promise((r) => setTimeout(r, 300));
				progressValue = 50;
				
				// Generate a new peer ID
				chatStore.regenerateId();
				
				// Store the name in localStorage
				if (browser) {
					localStorage.setItem('user-name', name.trim());
				}
				
				progressValue = 75;
				await new Promise((r) => setTimeout(r, 300));
				progressValue = 100;
				await new Promise((r) => setTimeout(r, 500));
				
				// Redirect to chat page
				goto('/chat');
			} catch (error) {
				showError = true;
				errorMessage = 'Something went wrong, please try again.';
			} finally {
				isCreating = false;
			}
		} else {
			showError = true;
			errorMessage = 'Name must be at least 3 characters long';
		}
	}

	function handleInput() {
		showError = false;
		errorMessage = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') handleSubmit();
	}
</script>

<div class="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
	<div class="card p-8 w-full max-w-md">
		<header class="card-header text-center mb-8">
			<div class="flex justify-center mb-4">
				<MessageSquare size={48} class="text-primary-500" />
			</div>
			<h1 class="h1 mb-2">Welcome to Messenger</h1>
			<p class="text-surface-600-300">A secure peer-to-peer messaging platform</p>
		</header>
		
		<section class="card-body">
			<div class="space-y-6">
				<div class="space-y-2">
					<p class="text-base">
						This application allows you to chat with friends securely using peer-to-peer technology.
						Your messages are sent directly to your friends without going through a central server.
					</p>
				</div>
				
				<div class="space-y-2">
					<label for="name" class="label">
						<span>What should we call you?</span>
					</label>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
						<div class="input-group-shim">
							<User size={20} />
						</div>
						<input
							id="name"
							type="text"
							placeholder="Enter your name"
							class="input text-center {showError ? 'input-error animate-shake' : ''}"
							bind:value={name}
							on:keydown={handleKeydown}
							on:input={handleInput}
							disabled={isCreating}
						/>
					</div>
					
					{#if showError}
						<p class="text-error-500 text-sm">{errorMessage}</p>
					{/if}
				</div>
				
				{#if isCreating}
					<div class="flex flex-col items-center gap-2">
						<Progress value={progressValue} />
						<span class="text-surface-400 text-xs">Creating your account...</span>
					</div>
				{:else}
					<button
						type="button"
						class="btn variant-filled-primary w-full"
						on:click={handleSubmit}
					>
						Get Started
					</button>
				{/if}
			</div>
		</section>
		
		<footer class="card-footer text-center mt-8">
			<p class="text-sm text-surface-400">Your data stays on your device. No servers, no tracking.</p>
		</footer>
	</div>
</div>
