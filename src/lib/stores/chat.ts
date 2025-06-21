import { writable } from 'svelte/store';
import PeerService from '$lib/index';
import { ChatStoreType, MessageFormat } from '$lib/types/types';


function createChatStore(): ChatStoreType {
  const { subscribe, set, update } = writable({
    myId: '',
    currentChannel: null as string | null,
    channels: [] as string[],
    messages: {} as Record<string, MessageFormat[]>,
  });

  const peer = new PeerService(localStorage.getItem('peer-id') || null);

  peer.addEventListener('open', (e) => {
    const id = (e as CustomEvent).detail;
    localStorage.setItem('peer-id', id);
    update(state => ({ ...state, myId: id }));
    loadChannels();
  });

  peer.addEventListener('connection', (e) => {
    console.log('connection', e);
    const conn = (e as CustomEvent).detail;
    addChannel(conn.peer, false);
  });

  peer.addEventListener('data', (e) => {
    console.log('data', e);
    const { conn, data } = (e as CustomEvent).detail;
    if (data.type === 'ack') {
      addChannel(conn.peer, false);
    }
    else if (data.type === 'msg') {
      update(state => {
        const existing = state.messages[conn.peer] || [];
        const next = [...existing, {
          text: data.message, fromMe: false,
          messageId: generateId(), peerId: conn.peer
        }];
        return {
          ...state,
          messages: { ...state.messages, [conn.peer]: next }
        };
      });
    }
  });

  function loadChannels() {
    console.log('loadChannels');
    const saved = JSON.parse(localStorage.getItem('channels') || '[]');
    saved.forEach((id: string) => {
      addChannel(id, false);
      peer.connectTo(id);
    });
  }

  function addChannel(id: string, autoSwitch = true) {
    console.log('addChannel', id, autoSwitch);
    update(state => {
      if (state.channels.includes(id)) return state;
      const channels = [...state.channels, id];
      const messages = { ...state.messages, [id]: state.messages[id] || [] };
      const currentChannel = autoSwitch || !state.currentChannel ? id : state.currentChannel;
      localStorage.setItem('channels', JSON.stringify(channels));
      return { ...state, channels, messages, currentChannel };
    });
  }

  function removeChannel(id: string) {
    update(state => {
      const channels = state.channels.filter(ch => ch !== id);
      const messages = { ...state.messages };
      delete messages[id];
      localStorage.setItem('channels', JSON.stringify(channels));
      return {
        ...state,
        channels,
        messages,
        currentChannel: state.currentChannel === id ? channels[0] || null : state.currentChannel
      };
    });
  }

  function sendMessage(text: string) {
    update(state => {
      const channel = state.currentChannel;
      if (!channel || !text.trim()) return state;

      peer.send(channel, text.trim());

      const updatedMessages = {
        ...state.messages,
        [channel]: [...(state.messages[channel] || []), {
          text, fromMe: true, peerId: channel, messageId: generateId()
        }]
      };

      return { ...state, messages: updatedMessages };
    });
  }

  return {
    subscribe,
    addChannel,
    removeChannel,
    sendMessage,
    switchChannel: (id: string) => update(s => ({ ...s, currentChannel: id })),
    connectToPeer: (id: string) => {
      id = id.trim();
      if (!id) return;
      addChannel(id);
      peer.connectTo(id);
    }
  };


  function generateId() {
    return Math.random().toString(16).slice(2);
  }
}

export const chatStore = createChatStore();
