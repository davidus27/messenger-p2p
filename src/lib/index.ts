// // place files you want to import through the `$lib` alias in this folder.

import Peer from "peerjs";

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
      if (this.connections[id]?.open) return this.connections[id];
  
      const conn = this.connections[id] || this.peer.connect(id, { reliable: true });
      this.connections[id] = conn;
      this.handleConnection(conn);
      return conn;
    }
}
  
export default PeerService;