<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    import { chatStore } from '$lib/stores/chat';

    const {
      subscribe,
      connectToPeer,
      removeChannel,
      sendMessage,
      switchChannel,
      regenerateId
    } = chatStore;

    $: chat = $chatStore;

</script>
  
<Chat
  {chat}
  sendMessage={sendMessage}
  switchChannel={switchChannel}
  removeChannel={removeChannel}
  connectToPeer={connectToPeer}
  regenerateId={regenerateId}
/>