export interface Message {
    id: string;
    message: string;
    name: string;
    host?: boolean;
    avatar?: number;
    timestamp?: string;
}

import type { Writable } from 'svelte/store';

export type MessageFormat = {
  text: string; 
  fromMe: boolean;
  peerId: string;
  messageId: string;
}

export type ChatState = {
  myId: string;
  currentChannel: string;
  channels: string[];
  messages: Record<string, MessageFormat[]>;
};

export type ChatStoreType = Writable<ChatState> & {
  addChannel: (id: string, autoSwitch?: boolean) => void;
  removeChannel: (id: string) => void;
  sendMessage: (text: string) => void;
  switchChannel: (id: string) => void;
  connectToPeer: (id: string) => void;
};
