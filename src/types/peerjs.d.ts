declare module 'peerjs' {
  export default class Peer {
    constructor(id?: string, options?: any);
    id: string;
    open: boolean;
    destroyed: boolean;
    disconnected: boolean;

    on(event: 'open', callback: (id: string) => void): void;
    on(event: 'connection', callback: (conn: DataConnection) => void): void;
    on(event: 'call', callback: (call: MediaConnection) => void): void;
    on(event: 'close', callback: () => void): void;
    on(event: 'disconnected', callback: () => void): void;
    on(event: 'error', callback: (err: any) => void): void;

    connect(id: string, options?: any): DataConnection;
    call(id: string, stream: MediaStream, options?: any): MediaConnection;
    destroy(): void;
    disconnect(): void;
    reconnect(): void;
  }

  export class DataConnection {
    peer: string;
    open: boolean;
    metadata: any;
    label: string;
    serialization: string;
    reliable: boolean;
    bufferSize: number;

    on(event: 'open', callback: () => void): void;
    on(event: 'data', callback: (data: any) => void): void;
    on(event: 'close', callback: () => void): void;
    on(event: 'error', callback: (err: any) => void): void;

    send(data: any): void;
    close(): void;
  }

  export class MediaConnection {
    peer: string;
    open: boolean;
    metadata: any;
    label: string;

    on(event: 'stream', callback: (stream: MediaStream) => void): void;
    on(event: 'close', callback: () => void): void;
    on(event: 'error', callback: (err: any) => void): void;

    answer(stream: MediaStream, options?: any): void;
    close(): void;
  }
} 