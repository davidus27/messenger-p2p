<script lang="ts">
	import type { Message } from '$lib/types/types';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import { splitTextAndLinks, processTextMessage } from '$lib/utils/chatUtils';

	export let message: Message;
</script>

<div class="grid grid-cols-[1fr_auto] gap-2">
	<div class="card space-y-2 rounded-tr-none p-4 {message.color}">
		<header class="flex items-center justify-between">
			<p class="font-bold">{message.name}</p>
			<small class="opacity-50">{message.timestamp}</small>
		</header>
		<p class="whitespace-pre-wrap">
			{#each splitTextAndLinks(processTextMessage(message.message)) as part}
				{#if part.type === 'link'}
					<a
						href={part.content}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary-500 hover:underline">{part.content}</a
					>
				{:else}
					{part.content}
				{/if}
			{/each}
		</p>
	</div>
	<AvatarImage name={message.name} small={true} />
</div>
