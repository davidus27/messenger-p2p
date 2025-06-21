<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import { chatStore } from '$lib/stores/chat';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (browser) {
			// Check if user already has a name stored
			const storedName = localStorage.getItem('user-name');
			if (!storedName) {
				// Redirect to chat page if name exists
				goto('/start');
			}
		}
	});

	const { subscribe, connectToPeer, removeChannel, sendMessage, switchChannel, regenerateId } =
		chatStore;

	$: chat = $chatStore;
</script>

<Chat {chat} {sendMessage} {switchChannel} {removeChannel} {connectToPeer} {regenerateId} />
