<script lang="ts">
	import type { Message } from '$lib/types/types';
	import { splitTextAndLinks, processTextMessage } from '$lib/utils/chatUtils';

	export let message: Message;
</script>

{#each splitTextAndLinks(processTextMessage(message.message)) as part}
	{#if part.type === 'link'}
		{#if part.content.startsWith('https://') && part.content.endsWith('.gif')}
			<img src={part.content} alt="GIF" class="h-auto max-w-full rounded" />
		{:else}
			<a
				href={part.content}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary-500 hover:underline">{part.content}</a
			>
		{/if}
	{:else}
		{part.content}
	{/if}
{/each}
