<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChatState } from '$lib/types/types';
	import FriendsList from '$lib/components/FriendsList.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import MessageFeed from '$lib/components/chat/MessageFeed.svelte';
	import FriendHeader from './FriendHeader.svelte';
	import AddFriendDialog from './AddFriendDialog.svelte';

	// Props
	export let chat: ChatState;
	export let sendMessage: (message: string) => void;
	export let switchChannel: (channel: string) => void;
	export let removeChannel: (channel: string) => void;
	export let connectToPeer: (peerId: string) => void;
	export let regenerateId: () => void;

	// Local state
	let currentMessage: string = '';
	let currentPersonId: string = chat.currentChannel || '';
	let textareaElement: HTMLTextAreaElement;
	let elemChat: HTMLElement;

	const scrollChatBottom = (behavior?: 'auto' | 'instant' | 'smooth') => {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 100);
	};

	const isValid = (id: string) => {
		return true;
		// return /^[0-9-]+$/.test(id) && id.length === 10;
	};

	const startsConnection = async (id: string) => {
		connectToPeer(id);
		handlePersonSelect(id);
		return true;
	};

	const sendNewMessage = () => {
		if (currentMessage.length === 0 || currentMessage.trim() === '') {
			return;
		}
		// handleMessageAdd(currentMessage);
		sendMessage(currentMessage);
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
	}

	function handlePersonSelect(personId: string) {
		currentPersonId = personId;
		switchChannel(personId);
	}

	// When DOM is mounted, scroll to bottom
	onMount(() => {
		if (elemChat) {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior: 'instant' });
		}
	});
</script>

<section class="card bg-surface-100-900 rounded-container overflow-hidden lg:h-screen">
	<div class="chat grid h-full w-full grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<div class="border-surface-200-800 hidden grid-rows-[auto_1fr_auto] border-r-[1px] lg:grid">
			<!-- List -->
			<FriendsList
				{removeChannel}
				people={chat.channels}
				{currentPersonId}
				onPersonSelect={handlePersonSelect}
			/>
			<AddFriendDialog id={chat.myId} {isValid} canConnect={startsConnection} />

			<!-- remove all contacts -->
			<nav class="btn-group preset-outlined-surface-200-800 flex-col p-2 md:flex-row">
				<button
					type="button"
					class="btn preset-filled"
					onclick={() => chat.channels.forEach(removeChannel)}>Purge contacts</button
				>
				<button type="button" class="btn hover:preset-tonal" onclick={() => regenerateId()}
					>Generate new PeerID</button
				>
				<button
					type="button"
					class="btn hover:preset-tonal"
					onclick={() => {
						localStorage.clear();
						location.reload();
					}}>Purge everything</button
				>
			</nav>
		</div>
		<!-- Chat -->
		<div class="flex h-full flex-col">
			<!-- Name of the person -->
			<FriendHeader people={chat.channels} {currentPersonId} />
			<!-- Messages area takes up remaining space and is scrollable -->
			{#if chat.currentChannel}
				<MessageFeed
					peerId={currentPersonId}
					myId={chat.myId}
					messages={chat.messages[chat.currentChannel]}
					bind:elemChat
				/>

				<!-- Prompt -->
				<Prompt bind:textareaElement bind:currentMessage {sendNewMessage} />
			{:else}
				<div class="flex h-full items-center justify-center">
					<p class="text-surface-600-300">Select a friend to start chatting</p>
				</div>

				<!-- Prompt -->
				<Prompt bind:textareaElement bind:currentMessage {sendNewMessage} disabled />
			{/if}
		</div>
	</div>
</section>
