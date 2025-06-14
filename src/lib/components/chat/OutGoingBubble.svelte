<script lang="ts">
	import type { Message } from '$lib/types/types';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import { splitTextAndLinks, processTextMessage } from '$lib/utils/chatUtils';

	export let message: Message;
</script>

<div class="grid grid-cols-[auto_1fr] gap-2">
	<AvatarImage name={message.name} small={true} />
	<div class="card preset-tonal space-y-2 rounded-tl-none p-4">
		<header class="flex items-center justify-between">
			<p class="font-bold">{message.name}</p>
			<small class="opacity-50">{message.timestamp}</small>
		</header>
		<p class="whitespace-pre-wrap">
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
		</p>
	</div>
</div>
