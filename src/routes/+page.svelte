<script lang="ts">
    import { chatStore } from '$lib/stores/chat';
  
    let peerIdInput = '';
    let messageInput = '';
  
    const {
      subscribe,
      connectToPeer,
      removeChannel,
      sendMessage,
      switchChannel
    } = chatStore;
  
    $: chat = $chatStore;
</script>
  
  <div class="flex flex-col items-center justify-center min-h-screen bg-background p-6">
    <header class="text-center mb-6">
      <h1 class="text-4xl font-bold mb-2">💬 Peer-to-Peer Chat</h1>
      <p class="text-sm text-muted">Your ID: <span class="font-mono">{chat.myId || 'loading...'}</span></p>
    </header>
  
    <section class="w-full max-w-md mb-6">
      <label class="label">
        <span class="label-text">Connect to Peer</span>
        <input
          type="text"
          bind:value={peerIdInput}
          placeholder="Enter peer ID..."
          class="input w-full"
        />
      </label>
      <button class="btn btn-primary w-full mt-2" on:click={() => connectToPeer(peerIdInput)}>Connect</button>
    </section>
  
    <section class="w-full max-w-md mb-6">
      <h2 class="text-xl font-semibold mb-2">Channels</h2>
      <ul class="space-y-2">
        {#if chat}
        {#each chat.channels as channel}
          <li class="flex justify-between items-center p-2 rounded cursor-pointer {channel === chat.currentChannel ? 'bg-primary-100' : 'bg-base-200'}">
            <span on:click={() => switchChannel(channel)} class="truncate">{channel}</span>
            <button class="btn btn-sm btn-error" on:click={() => removeChannel(channel)}>Remove</button>
          </li>
        {/each}
        {/if}
      </ul>
    </section>
  
    <section class="w-full max-w-md">
      <h2 class="text-xl font-semibold mb-2">Chat</h2>
      <div class="bg-base-200 p-4 rounded h-64 overflow-y-auto mb-4">
        {#if chat?.currentChannel}
        {#each chat.messages[chat.currentChannel] || [] as message}
        <div class="mb-2 text-sm">
            <span class="{message.fromMe ? 'text-right block text-primary' : 'text-left block text-secondary'}">
            {message.text}
            </span>
        </div>
        {/each}
        {/if}
      </div>
      <label class="label">
        <span class="label-text">Message</span>
        <input
          type="text"
          bind:value={messageInput}
          placeholder="Type a message..."
          class="input w-full"
          on:keyup={(e) => e.key === 'Enter' && sendMessage(messageInput)}
        />
      </label>
      <button class="btn btn-accent w-full mt-2" on:click={() => sendMessage(messageInput)}>Send</button>
    </section>
  </div>
  