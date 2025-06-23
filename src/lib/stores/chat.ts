import { writable } from 'svelte/store';
import PeerService from '$lib/index';
import { ChatStoreType, MessageFormat } from '$lib/types/types';


function createChatStore(): ChatStoreType {
  const { subscribe, set, update } = writable({
    myId: '',
    currentChannel: null as string | null,
    peerNames: {} as Record<string, string>,
    channels: [] as string[],
    messages: {} as Record<string, MessageFormat[]>,
  });

  let peer = new PeerService(localStorage.getItem('peer-id') || null, localStorage.getItem('user-name') || null);
  initializeEvents();

  function initializeEvents() {
    peer.addEventListener('open', (e) => {
      const id = (e as CustomEvent).detail;
      localStorage.setItem('peer-id', id);
      update(state => ({ ...state, myId: id }));
      loadChannels();
      loadPeerNames();
      updateMyName(); // Add user's own name to peerNames
    });

    peer.addEventListener('connection', (e) => {
      console.log('connection', e);
      const conn = (e as CustomEvent).detail;
      addChannel(conn.peer, false);
    });

    peer.addEventListener('data', (e) => {
      console.log('data', e);
      const { conn, data } = (e as CustomEvent).detail;
      
      // If we receive a name in the data, store it in peerNames
      if (data.name) {
        update(state => ({
          ...state,
          peerNames: { ...state.peerNames, [conn.peer]: data.name }
        }));
        
        // Save peer names to localStorage
        savePeerNames();
      }
      
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
  }

  function savePeerNames() {
    update(state => {
      localStorage.setItem('peer-names', JSON.stringify(state.peerNames));
      return state;
    });
  }

  function loadPeerNames() {
    try {
      const savedNames = JSON.parse(localStorage.getItem('peer-names') || '{}');
      update(state => ({
        ...state,
        peerNames: savedNames
      }));
    } catch (e) {
      console.error('Error loading peer names', e);
    }
  }

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

  function regenerateId() {
    // Remove peer ID from localStorage and create new connection
    localStorage.removeItem('peer-id');
    // Reset channels in localStorage
    localStorage.setItem('channels', '[]');
    // Reset peer names in localStorage
    localStorage.setItem('peer-names', '{}');
    // Create new peer service with null ID to generate a fresh ID
    peer = new PeerService(null, peer.getUserName());

    // re-initialize all events
    initializeEvents();

    // Reset the store state
    update(state => ({
      ...state,
      myId: '',
      currentChannel: null,
      channels: [],
      messages: {},
      peerNames: {}
    }));
  }

  // Add the current user name to peerNames 
  function updateMyName() {
    update(state => {
      if (peer && peer.getUserName()) {
        const updatedPeerNames = { ...state.peerNames, [state.myId]: peer.getUserName() };
        // Save to localStorage
        localStorage.setItem('peer-names', JSON.stringify(updatedPeerNames));
        return {
          ...state,
          peerNames: updatedPeerNames
        };
      }
      return state;
    });
  }

  function getPeerName(id: string) {
    let result = '';
    update(state => {
      result = state.peerNames[id] || id;
      return state;
    });
    return result;
  }

  return {
    subscribe,
    set,
    update,
    addChannel,
    removeChannel,
    sendMessage,
    switchChannel: (id: string) => update(s => ({ ...s, currentChannel: id })),
    connectToPeer: (id: string) => {
      id = id.trim();
      if (!id) return;
      addChannel(id);
      peer.connectTo(id);
    },
    regenerateId,
    updateMyName,
    getPeerName
  };


  function generateId() {
    return Math.random().toString(16).slice(2);
  }
}

export const chatStore = createChatStore();
