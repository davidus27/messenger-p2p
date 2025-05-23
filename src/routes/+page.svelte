<script lang="ts">
    import { onMount } from 'svelte';
    import Peer from 'peerjs';
  
    let peer: Peer;
    let myId = 'loading...';
    let peerIdInput = '';
    let messageInput = '';
    let currentChannel: string | null = null;
    let channels: string[] = [];
    let messages: Record<string, { text: string; fromMe: boolean }[]> = {};
    let connections: Record<string, any> = {};
    let acked = new Set<string>();
  
    onMount(() => {
      const storedPeerId = localStorage.getItem('peer-id');
      peer = new Peer(storedPeerId || undefined);
  
      peer.on('open', (id: string) => {
        myId = id;
        localStorage.setItem('peer-id', id);
        loadChannels();
      });
  
      peer.on('connection', (conn: any) => {
        handleConnection(conn);
      });
    });
  
    function loadChannels() {
      const savedChannels = JSON.parse(localStorage.getItem('channels') || '[]') as string[];
      savedChannels.forEach(channelId => {
        addChannel(channelId, false);
        ensureConnection(channelId);
      });
    }
  
    function addChannel(id: string, autoSwitch = true) {
      if (channels.includes(id)) return;
  
      channels = [...channels, id];
      messages[id] = messages[id] || [];
  
      if (autoSwitch || !currentChannel) {
        switchChannel(id);
      }
  
      saveChannels();
    }
  
    function removeChannel(id: string) {
      channels = channels.filter(ch => ch !== id);
      delete messages[id];
      delete connections[id];
      acked.delete(id);
  
      if (currentChannel === id) {
        currentChannel = channels[0] || null;
      }
  
      saveChannels();
    }
  
    function saveChannels() {
      localStorage.setItem('channels', JSON.stringify(channels));
    }
  
    function switchChannel(id: string) {
      currentChannel = id;
    }
  
    function handleConnection(conn: any) {
      connections[conn.peer] = conn;
      setupConnection(conn);
    }
  
    function setupConnection(conn: any) {
      conn.on('data', (raw: string) => {
        try {
          const data = JSON.parse(raw) as { type: string; from: string; message?: string };
          if (data.type === 'ack') {
            addChannel(conn.peer, false);
          } else if (data.type === 'msg' && data.message) {
            if (!acked.has(conn.peer)) {
              ensureConnection(conn.peer)?.send(JSON.stringify({ type: 'ack', from: peer.id }));
              acked.add(conn.peer);
            }
            addChannel(conn.peer, false);
            messages[conn.peer] = [...(messages[conn.peer] || []), { text: data.message, fromMe: false }];
          }
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      });
  
      conn.on('open', () => {
        if (!acked.has(conn.peer)) {
          conn.send(JSON.stringify({ type: 'ack', from: peer.id }));
          acked.add(conn.peer);
        }
      });
    }
  
    function ensureConnection(id: string): any {
      if (id === peer.id) {
        alert("Cannot chat with yourself");
        return null;
      }
  
      if (connections[id]?.open) return connections[id];
  
      const conn = connections[id] || peer.connect(id, { reliable: true });
      connections[id] = conn;
      setupConnection(conn);
      return conn;
    }
  
    function connect() {
      const id = peerIdInput.trim();
      if (id) {
        addChannel(id);
        ensureConnection(id);
        peerIdInput = '';
      }
    }
  
    function sendMessage() {
      const text = messageInput.trim();
      if (!text || !currentChannel) return;
  
      const conn = ensureConnection(currentChannel);
      if (!conn) return;
  
      conn.send(JSON.stringify({ type: 'msg', from: peer.id, message: text }));
      messages[currentChannel] = [...(messages[currentChannel] || []), { text, fromMe: true }];
      messageInput = '';
    }
  </script>
  
  <div class="flex flex-col items-center justify-center min-h-screen bg-background p-6">
    <header class="text-center mb-6">
      <h1 class="text-4xl font-bold mb-2">💬 Peer-to-Peer Chat</h1>
      <p class="text-sm text-muted">Your ID: <span class="font-mono">{myId}</span></p>
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
      <button class="btn btn-primary w-full mt-2" on:click={connect}>Connect</button>
    </section>
  
    <section class="w-full max-w-md mb-6">
      <h2 class="text-xl font-semibold mb-2">Channels</h2>
      <ul class="space-y-2">
        {#each channels as channel}
          <li class="flex justify-between items-center p-2 rounded cursor-pointer {channel === currentChannel ? 'bg-primary-100' : 'bg-base-200'}">
            <span on:click={() => switchChannel(channel)} class="truncate">{channel}</span>
            <button class="btn btn-sm btn-error" on:click={() => removeChannel(channel)}>Remove</button>
          </li>
        {/each}
      </ul>
    </section>
  
    <section class="w-full max-w-md">
      <h2 class="text-xl font-semibold mb-2">Chat</h2>
      <div class="bg-base-200 p-4 rounded h-64 overflow-y-auto mb-4">
        {#if currentChannel}
          {#each messages[currentChannel] || [] as message}
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
          on:keyup={(e) => e.key === 'Enter' && sendMessage()}
        />
      </label>
      <button class="btn btn-accent w-full mt-2" on:click={sendMessage}>Send</button>
    </section>
  </div>
  