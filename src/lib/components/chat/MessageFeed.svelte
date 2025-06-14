<script lang="ts">
	import type { Message } from '$lib/types/types';
	import OutGoingBubble from './OutGoingBubble.svelte';
	import InGoingBubble from './InGoingBubble.svelte';

	export let messages: Message[];
	export let elemChat: HTMLElement;
</script>

<section bind:this={elemChat} class="max-h-[800px] space-y-4 overflow-y-auto p-4">
	{#each messages as message}
		{#if message.host === true}
			<OutGoingBubble {message} />
		{:else}
			<InGoingBubble {message} />
		{/if}
	{/each}
</section>
