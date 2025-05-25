<script context="module" lang="ts">
	// Types
	export interface Person {
		id: number;
		avatar: number;
		name: string;
	}
	export interface MessageFeed {
		id: number;
		host: boolean;
		avatar: number;
		name: string;
		timestamp: string;
		message: string;
		color: string;
	}
</script>

<script lang="ts">
	import IconSend from '@lucide/svelte/icons/send-horizontal';
	import AvatarImage from './avatarImage.svelte';
	import { onMount } from 'svelte';

	// Props
	export let people: Person[] = [];
	export let currentPersonId: number;
	export let messageFeed: MessageFeed[] = [];
	export let currentMessage: string = '';
	export let onMessageAdd: (message: string) => void;
	export let onPersonSelect: (personId: number) => void;

	let searchQuery: string = '';
	let textareaElement: HTMLTextAreaElement;

	const getFilteredPeople = () => {
		if (searchQuery.length === 0) {
			return people;
		}
		return people.filter((person) => person.name.toLowerCase().includes(searchQuery.toLowerCase()));
	};

	const autoResizeTextarea = () => {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		}
	};

	const getCurrentPerson = (): string => {
		if (currentPersonId === undefined) {
			return 'Unknown';
		}
		return people.find((person) => person.id === currentPersonId)?.name ?? 'Unknown';
	};

	let elemChat: HTMLElement;
	function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 100);
	}

	function onPromptKeydown(event: KeyboardEvent) {
		// if shift and enter is pressed, it's a new line
		if (event.shiftKey && event.code === 'Enter') {
			return;
		}
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			sendNewMessage();
		}
	}

	const sendNewMessage = () => {
		if (currentMessage.length === 0) {
			return;
		}
		onMessageAdd(currentMessage);
		currentMessage = '';
		// Reset textarea height after clearing message
		setTimeout(() => {
			if (textareaElement) {
				textareaElement.style.height = 'auto';
			}
		}, 0);
		scrollChatBottom('smooth');
	};

	const switchToChat = (personId: number) => {
        console.log("switchToChat", personId);
		// this will change the chat to the personId
		currentPersonId = personId;
		onPersonSelect(personId);
		searchQuery = '';
		// Scroll to bottom of chat when switching
		scrollChatBottom('instant');
	};

    const processTextMessage = (message: string) => {
        // trim the newlines after the last character in the text
        // Trim trailing and leading newlines
        message = message.trim();

        // if message contains non utf-8 safe characters, remove them
        message = message.replace(/[^\x00-\x7F]/g, '');
        return message;
    };

	// When DOM is mounted, scroll to bottom
	onMount(() => {
		scrollChatBottom('instant');
	});
</script>

<section class="card bg-surface-100-900 rounded-container overflow-hidden h-full lg:h-screen">
	<div class="chat grid h-full w-full grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<div class="border-surface-200-800 hidden grid-rows-[auto_1fr_auto] border-r-[1px] lg:grid">
			<!-- Header -->
			<header class="border-surface-200-800 border-b-[1px] p-4">
				<input bind:value={searchQuery} class="input" type="search" placeholder="Search..." />
			</header>
			<!-- List -->
			<div class="space-y-4 overflow-y-auto p-4">
				<small class="opacity-50">Contacts</small>
				<div class="flex flex-col space-y-1">
					{#each getFilteredPeople() as person}
						<button
							type="button"
							class="card flex w-full items-center space-x-4 p-2 {person.id === currentPersonId
								? 'preset-filled-primary-500'
								: 'bg-surface-hover-token'}"
							on:click={() => switchToChat(person.id)}
						>
							<AvatarImage name={person.name} small={false} />
							<span class="flex-1 text-start">
								{person.name}
							</span>
						</button>
					{/each}
				</div>
			</div>
			<!-- Footer -->
			<footer class="border-surface-200-800 border-t-[1px] p-4">(footer)</footer>
		</div>
		<!-- Chat -->
		<div class="grid h-full grid-rows-[auto_1fr_auto]">
			<!-- Conversation -->
			<!-- Name of the person -->
			<div class="border-surface-200-800 border-b-[1px] p-5">
				<p class="font-bold">Chat with {getCurrentPerson()}</p>
			</div>
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
								<p class="whitespace-pre-wrap">{processTextMessage(bubble.message)}</p>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card space-y-2 rounded-tr-none p-4 {bubble.color}">
								<header class="flex items-center justify-between">
									<p class="font-bold">{bubble.name}</p>
									<small class="opacity-50">{bubble.timestamp}</small>
								</header>
								<p class="whitespace-pre-wrap">{bubble.message}</p>
							</div>
							<AvatarImage name={bubble.name} small={true} />
						</div>
					{/if}
				{/each}
			</section>
			<!-- Prompt -->
			<section class="border-surface-200-800 border-t-[1px] p-5">
				<div
					class="input-group divide-surface-200-800 rounded-container-token grid-cols-[auto_1fr_auto] divide-x"
				>
					<button class="input-group-cell preset-tonal p-3">+</button>
					<textarea
						bind:this={textareaElement}
						bind:value={currentMessage}
						class="resize-none border-0 bg-transparent ring-0 p-3"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						rows="1"
						on:keydown={onPromptKeydown}
						on:input={autoResizeTextarea}
					></textarea>
					<button
						class="input-group-cell {currentMessage ? 'preset-filled-primary-500' : 'preset-tonal'}"
						on:click={sendNewMessage}
					>
						<IconSend />
					</button>
				</div>
			</section>
		</div>
	</div>
</section>
