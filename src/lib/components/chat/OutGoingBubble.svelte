<script lang="ts">
	import type { Message } from '$lib/types/types';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import Bubble from './Bubble.svelte';

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
			<Bubble message={message} />
		</p>
	</div>
</div>
