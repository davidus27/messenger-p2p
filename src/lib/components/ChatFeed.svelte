<script lang="ts">
	import AvatarImage from './AvatarImage.svelte';
	import type { MessageFeed } from '$lib/types';

	export let messageFeed: MessageFeed[];
	export let elemChat: HTMLElement;

	// URL detection regex - matches http(s) and www URLs
	const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

	// Function to split text into parts (text and links)
	const splitTextAndLinks = (text: string): Array<{ type: 'text' | 'link'; content: string }> => {
		const parts: Array<{ type: 'text' | 'link'; content: string }> = [];
		let lastIndex = 0;
		let match;

		while ((match = urlRegex.exec(text)) !== null) {
			// Add text before the URL
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: text.slice(lastIndex, match.index)
				});
			}

			// Add the URL
			const url = match[0];
			parts.push({
				type: 'link',
				content: url.startsWith('www.') ? `https://${url}` : url
			});

			lastIndex = match.index + url.length;
		}

		// Add remaining text
		if (lastIndex < text.length) {
			parts.push({
				type: 'text',
				content: text.slice(lastIndex)
			});
		}

		return parts;
	};


    const processTextMessage = (message: string) => {
		// trim the newlines after the last character in the text
		// Trim trailing and leading newlines
		message = message.trim();

		// if message contains non utf-8 safe characters, remove them
		message = message.replace(/[^\x00-\x7F]/g, '');
		return message;
	};
    
</script>

<section bind:this={elemChat} class="max-h-[500px] space-y-4 overflow-y-auto p-4">
	{#each messageFeed as bubble}
		{#if bubble.host === true}
			<div class="grid grid-cols-[auto_1fr] gap-2">
				<AvatarImage name={bubble.name} small={true} />
				<div class="card preset-tonal space-y-2 rounded-tl-none p-4">
					<header class="flex items-center justify-between">
						<p class="font-bold">{bubble.name}</p>
						<small class="opacity-50">{bubble.timestamp}</small>
					</header>
					<p class="whitespace-pre-wrap">
						{#each splitTextAndLinks(processTextMessage(bubble.message)) as part}
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
			</div>
		{:else}
			<div class="grid grid-cols-[1fr_auto] gap-2">
				<div class="card space-y-2 rounded-tr-none p-4 {bubble.color}">
					<header class="flex items-center justify-between">
						<p class="font-bold">{bubble.name}</p>
						<small class="opacity-50">{bubble.timestamp}</small>
					</header>
					<p class="whitespace-pre-wrap">
						{#each splitTextAndLinks(processTextMessage(bubble.message)) as part}
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
				<AvatarImage name={bubble.name} small={true} />
			</div>
		{/if}
	{/each}
</section>
