// // place files you want to import through the `$lib` alias in this folder.

import Peer from "peerjs";

// import Peer from 'peerjs';

// class PeerCommunication {
//     public peer: Peer;
//     public myId: string;
//     public currentChannel: string | null = null;
//     public channels: string[] = [];
//     public messages: Record<string, { text: string; fromMe: boolean }[]> = {};
//     public connections: Record<string, any> = {};
//     public acked = new Set<string>();

//     constructor(peerId: string | null) {
//         console.log('constructor', peerId);
//         this.peer = new Peer(peerId || undefined);
//         this.currentChannel = null;
//         this.channels = [];
//         this.messages = {};
//         this.connections = {};
//         this.acked = new Set<string>();
//         this.init();
//     }

//     init() {
//         this.peer.on('open', (id: string) => {
//           this.myId = id;
//         //   localStorage.setItem('peer-id', id);
//           this.loadChannels();
//         });
    
//         this.peer.on('connection', (conn: any) => {
//           this.handleConnection(conn);
//         });
//     }

//     // getMyId(): string {
//     //     return this.myId;
//     // }

//     // getChannels(): string[] {
//     //     return this.channels;
//     // }

//     // getCurrentChannel(): string | null {
//     //     console.log('getCurrentChannel', this.currentChannel);
//     //     return this.currentChannel;
//     // }

//     // getMessages(): Record<string, { text: string; fromMe: boolean }[]> {
//     //     console.log('getMessages', this.messages);
//     //     return this.messages;
//     // }

//     // getConnections(): Record<string, any> {
//     //     console.log('getConnections', this.connections);
//     //     return this.connections;
//     // }

//     // getCurrentMessages(): { text: string; fromMe: boolean }[] {
//     //     if (this.currentChannel) {
//     //         return this.messages[this.currentChannel];
//     //     }
//     //     return [];
//     // }

//     loadChannels() {
//         console.log('loadChannels');
//         const savedChannels = JSON.parse(localStorage.getItem('channels') || '[]') as string[];
//         savedChannels.forEach(channelId => {
//           this.addChannel(channelId, false);
//           this.ensureConnection(channelId);
//         });
//       }

//       addChannel(id: string, autoSwitch = true) {
//         console.log('addChannel', id);
//         if (this.channels.includes(id)) return;
    
//         this.channels = [...this.channels, id];
//         this.messages[id] = this.messages[id] || [];
    
//         if (autoSwitch || !this.currentChannel) {
//           this.switchChannel(id);
//         }
    
//         this.saveChannels();
//       }
    
//       removeChannel(id: string) {
//         console.log('removeChannel', id);
//         this.channels = this.channels.filter(ch => ch !== id);
//         delete this.messages[id];
//         delete this.connections[id];
//         this.acked.delete(id);
    
//         if (this.currentChannel === id) {
//           this.currentChannel = this.channels[0] || null;
//         }
    
//         this.saveChannels();
//       }
    
//       saveChannels() {
//         console.log('saveChannels', this.channels);
//         localStorage.setItem('channels', JSON.stringify(this.channels));
//       }
    
//       switchChannel(id: string) {
//         console.log('switchChannel', id);
//         this.currentChannel = id;
//       }
    
//       handleConnection(conn: any) {
//         console.log('handleConnection', conn);
//         this.connections[conn.peer] = conn;
//         this.setupConnection(conn);
//       }
    
//       setupConnection(conn: any) {
//         console.log('setupConnection', conn);
//         conn.on('data', (raw: string) => {
//           try {
//             const data = JSON.parse(raw) as { type: string; from: string; message?: string };
//             if (data.type === 'ack') {
//               this.addChannel(conn.peer, false);
//             } else if (data.type === 'msg' && data.message) {
//               if (!this.acked.has(conn.peer)) {
//                 this.ensureConnection(conn.peer)?.send(JSON.stringify({ type: 'ack', from: this.peer.id }));
//                 this.acked.add(conn.peer);
//               }
//               this.addChannel(conn.peer, false);
//               this.messages[conn.peer] = [...(this.messages[conn.peer] || []), { text: data.message, fromMe: false }];
//             }
//           } catch (e) {
//             console.error('Failed to parse message:', e);
//           }
//         });
    
//         conn.on('open', () => {
//           if (!this.acked.has(conn.peer)) {
//             conn.send(JSON.stringify({ type: 'ack', from: this.peer.id }));
//             this.acked.add(conn.peer);
//           }
//         });
//       }
    
//       ensureConnection(id: string): any {
//         if (id === this.peer.id) {
//           alert("Cannot chat with yourself");
//           return null;
//         }
    
//         if (this.connections[id]?.open) return this.connections[id];
    
//         const conn = this.connections[id] || this.peer.connect(id, { reliable: true });
//         this.connections[id] = conn;
//         this.setupConnection(conn);
//         return conn;
//       }
    
//       connect(id: string) {
//         console.log('connect', id);
//         id = id.trim();
//         if (id) {
//           this.addChannel(id);
//           this.ensureConnection(id);
//         }
//       }
    
//       sendMessage(message: string) {
//         console.log('sendMessage', message);
//         const text = message.trim();
//         if (!text || !this.currentChannel) return;
    
//         const conn = this.ensureConnection(this.currentChannel);
//         if (!conn) return;
    
//         conn.send(JSON.stringify({ type: 'msg', from: this.peer.id, message: text }));
//         this.messages[this.currentChannel] = [...(this.messages[this.currentChannel] || []), { text, fromMe: true }];
//       }
// }

// export default PeerCommunication;



class PeerService extends EventTarget {
    private peer: Peer;
    private acked = new Set<string>();
    private connections: Record<string, any> = {};
  
    constructor(peerId: string | null) {
      super();
      this.peer = new Peer(peerId || undefined);
      this.peer.on('open', id => this.dispatchEvent(new CustomEvent('open', { detail: id })));
      this.peer.on('connection', conn => this.handleConnection(conn));
    }
  
    send(channel: string, message: string) {
      const conn = this.ensureConnection(channel);
      if (conn) {
        conn.send(JSON.stringify({ type: 'msg', from: this.peer.id, message }));
      }
    }
  
    connectTo(id: string) {
      return this.ensureConnection(id);
    }
  
    private handleConnection(conn: any) {
      this.connections[conn.peer] = conn;
  
      conn.on('data', (raw: string) => {
        try {
          const data = JSON.parse(raw);
          this.dispatchEvent(new CustomEvent('data', { detail: { conn, data } }));
        } catch (e) {
          console.error('Invalid data from', conn.peer, e);
        }
      });
  
      conn.on('open', () => {
        if (!this.acked.has(conn.peer)) {
          conn.send(JSON.stringify({ type: 'ack', from: this.peer.id }));
          this.acked.add(conn.peer);
        }
      });
    }
  
    private ensureConnection(id: string): any {
      if (id === this.peer.id) {
        alert("Cannot chat with yourself");
        return null;
      }
  
      if (this.connections[id]?.open) return this.connections[id];
  
      const conn = this.connections[id] || this.peer.connect(id, { reliable: true });
      this.connections[id] = conn;
      this.handleConnection(conn);
      return conn;
    }
}
  
export default PeerService;