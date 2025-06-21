<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    import { chatStore } from '$lib/stores/chat';
    import type { Message } from '$lib/types/types';

    const {
      subscribe,
      connectToPeer,
      removeChannel,
      sendMessage,
      switchChannel
    } = chatStore;

    // let peerIdInput = '';
    // let messageInput = '';

    $: chat = $chatStore;
  
    // Navigation List
    // const people: Person[] = [];
    // let currentPersonId: string = Math.random().toString(36).substring(2, 15);

    // console.log("currentPersonId", currentPersonId);
  
    // Messages
    // let messageFeeds = new Map<string, Message[]>();

</script>
  
<Chat
  {chat}
  sendMessage={sendMessage}
  switchChannel={switchChannel}
  removeChannel={removeChannel}
  connectToPeer={connectToPeer}
/>