<script lang="ts">
	import type { MessageFormat } from '$lib/types/types';
	import OutGoingBubble from './OutGoingBubble.svelte';
	import InGoingBubble from './InGoingBubble.svelte';

	export let peerName: string;
	export let messages: MessageFormat[];
	// export let peerId: string;
	// export let myId: string;
	export let elemChat: HTMLElement;

	// Default to current timestamp if none provided
	function getTimestamp() {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}
</script>

<section bind:this={elemChat} class="flex-1 overflow-y-auto flex flex-col space-y-4 p-4 pb-32 min-h-0 max-h-[calc(100vh-10rem)]">
	{#each messages as message}
		{#if message.fromMe === true}
			<OutGoingBubble message={
				{	
					message: message.text,
					id: message.messageId,
					name: "You",  // For outgoing messages, use "You"
					timestamp: getTimestamp()}
			} />
		{:else}
			<InGoingBubble message={
				{	
					message: message.text,
					name: peerName,  // For incoming messages, use the peer name
					id: message.messageId,
					timestamp: getTimestamp()}
			} />
		{/if}
	{/each}
</section>
