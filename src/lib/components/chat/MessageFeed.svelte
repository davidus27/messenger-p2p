<script lang="ts">
	import type { MessageFormat } from '$lib/types/types';
	import OutGoingBubble from './OutGoingBubble.svelte';
	import InGoingBubble from './InGoingBubble.svelte';

	export let messages: MessageFormat[];
	export let currentPersonId: string;
	export let elemChat: HTMLElement;
</script>

<section bind:this={elemChat} class="flex-1 overflow-y-auto flex flex-col space-y-4 p-4 pb-32 min-h-0 max-h-[calc(100vh-10rem)]">
	{#each messages as message}
		{#if message.fromMe === true}
			<OutGoingBubble message={
				{	
					message: message.text,
					id: currentPersonId,
					name: currentPersonId, // Use currentPersonId as name
					// Add a timestamp if it doesn't exist
					timestamp: new Date().toISOString()}
			} />
		{:else}
			<InGoingBubble message={
				{	
					message: message.text,
					id: currentPersonId,
					name: currentPersonId, // Use currentPersonId as name
					// Add a timestamp if it doesn't exist
					timestamp: new Date().toISOString()}
			} />
		{/if}
	{/each}
</section>
