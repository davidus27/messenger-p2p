<script lang="ts">
	import type { Message } from '$lib/types/types';
	import OutGoingBubble from './OutGoingBubble.svelte';
	import InGoingBubble from './InGoingBubble.svelte';

	export let messages: Message[];
	export let elemChat: HTMLElement;
</script>

<section bind:this={elemChat} class="flex-1 min-h-0 overflow-y-auto flex flex-col space-y-4 overflow-y-auto p-4 pb-32 min-h-0 max-h-[calc(100vh-10rem)]">
	{#each messages as message}
		{#if message.host === true}
			<OutGoingBubble {message} />
		{:else}
			<InGoingBubble {message} />
		{/if}
	{/each}
</section>
