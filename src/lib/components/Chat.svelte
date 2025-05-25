<script lang="ts">
	import { onMount } from 'svelte';
    import Plus from '@lucide/svelte/icons/plus';
	import type { Person, MessageFeed } from './types';
	import FriendsList from './FriendsList.svelte';
    import Prompt from './Prompt.svelte';
    import ChatFeed from './ChatFeed.svelte';
    import FriendHeader from './FriendHeader.svelte';
	// import Popover from '../pop/Popover.svelte';
	// Props
	export let people: Person[] = [];
	export let currentPersonId: number;
	export let messageFeed: MessageFeed[] = [];
	export let currentMessage: string = '';
	export let onMessageAdd: (message: string) => void;
	export let onPersonSelect: (personId: number) => void;

	let searchQuery: string = '';
	let textareaElement: HTMLTextAreaElement;

	let elemChat: HTMLElement;

	function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 100);
	}


	const sendNewMessage = () => {
		if (currentMessage.length === 0 || currentMessage.trim() === '') {
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
			<FriendsList {people} {currentPersonId} {onPersonSelect} {searchQuery} {scrollChatBottom} />
			<!-- Footer -->

            <!-- <Popover/> -->
            <div class="border-surface-200-800 border-t-[1px] p-4">
                <button class="btn btn-lg preset-filled w-full"
                on:click={() => {
                    // open a modal to add a friend
                    
                }}
                >
                    <Plus /> Add Friend
                </button>
            </div>
		</div>
		<!-- Chat -->
		<div class="grid h-full grid-rows-[auto_1fr_auto]">
			<!-- Conversation -->
			<!-- Name of the person -->
            <FriendHeader {people} {currentPersonId} />
			<ChatFeed {messageFeed} bind:elemChat />
			<!-- Prompt -->
            <Prompt bind:textareaElement bind:currentMessage {sendNewMessage} />
		</div>
	</div>
</section>
