<script lang="ts">
	import { onMount } from 'svelte';
	import type { Person, Message } from '$lib/types/types';
	import FriendsList from '$lib/components/FriendsList.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import ChatFeed from '$lib/components/chat/MessageFeed.svelte';
	import FriendHeader from './FriendHeader.svelte';
	import AddFriendDialog from './AddFriendDialog.svelte';

	// Props
	export let people: Person[] = [];
	export let currentPersonId: number;
	export let messageFeeds: Map<number, Message[]> = new Map();
	// export let onMessageAdd: (message: string) => void;
	// export let onPersonSelect: (personId: number) => void;


	let messages = messageFeeds.get(currentPersonId) || [];

	let currentMessage: string = '';

	let textareaElement: HTMLTextAreaElement;

	let elemChat: HTMLElement;

	const scrollChatBottom = (behavior?: 'auto' | 'instant' | 'smooth') => {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 100);
	};

	const isValid = (id: string) => {
		return /^[0-9-]+$/.test(id) && id.length === 10;
	};

	const startsConnection = async (id: string) => {
		// wait for 5 second
		await new Promise((resolve) => setTimeout(resolve, 5000));
		return true;
	};

	const sendNewMessage = () => {
		if (currentMessage.length === 0 || currentMessage.trim() === '') {
			return;
		}
		handleMessageAdd(currentMessage);
		currentMessage = '';
		// Reset textarea height after clearing message
		setTimeout(() => {
			if (textareaElement) {
				textareaElement.style.height = 'auto';
			}
		}, 0);
		scrollChatBottom('smooth');
	};

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	function handleMessageAdd(message: string) {
		const newMessage = {
			id: message.length,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: message,
			color: 'preset-tonal-primary'
		};


		// Update the current person's message feed
		const currentFeed = messageFeeds.get(currentPersonId) || [];
		messageFeeds.set(currentPersonId, [...currentFeed, newMessage]);
		messages = messageFeeds.get(currentPersonId) || [];
	}

	function handlePersonSelect(personId: number) {
		currentPersonId = personId;
		// Switch to the selected person's message feed
		messages = messageFeeds.get(personId) || [];
	}

	// When DOM is mounted, scroll to bottom
	onMount(() => {
		scrollChatBottom('instant');
	});
</script>

<section class="card bg-surface-100-900 rounded-container overflow-hidden lg:h-screen">
	<div class="chat grid h-full w-full grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<div class="border-surface-200-800 hidden grid-rows-[auto_1fr_auto] border-r-[1px] lg:grid">
			<!-- List -->
			<FriendsList {people} {currentPersonId} onPersonSelect={handlePersonSelect} {scrollChatBottom} />
			<!-- Footer -->

			<!-- <Popover/> -->
			<div class="border-surface-200-800 border-t-[1px] p-4">
				<AddFriendDialog {isValid} canConnect={startsConnection} />
			</div>
		</div>
		<!-- Chat -->
		<div class="flex h-full flex-col">
			<!-- Name of the person -->
			<FriendHeader {people} {currentPersonId} />
			<!-- Messages area with flex-grow and overflow -->
			<div class="flex-1 overflow-y-auto">
				<ChatFeed {messages} bind:elemChat />
			</div>
			<!-- Prompt -->
			<div class="sticky bottom-0 bg-surface-100-900">
				<Prompt bind:textareaElement bind:currentMessage {sendNewMessage} />
			</div>
		</div>
	</div>
</section>
