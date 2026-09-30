import type { Socket } from 'socket.io-client'
import { vi } from 'vitest'

type Handler = (...args: any[]) => void


/*
in memory stand in for a socket.io client
the prvodiers and service hooks under test only use on and off, 
*/

export class FakeSocket {
  handlers = new Map<string, Handler[]>(); // making a hashmap, with string keys and handler arrays as values

  emitted: Array<{ event: string; args: any[] }> = [];
  emit = vi.fn((event: string, ...args: any[]) => {
    this.emitted.push({ event, args });
    return true;
  });

  on = vi.fn((event: string, handler: Handler) => {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
    return this;
  });

  off = vi.fn((event: string, handler: Handler) => {
    if (!handler) this.handlers.delete(event);
    else this.handlers.set(event, (this.handlers.get(event) ?? []).filter(h => h !== handler))
    return this;
  });

  disconnect = vi.fn(); // disconnecting the fake socket
  server(event: string, ...args: any[]) {
    for (const handler of this.handlers.get(event) ?? []) handler(...args);
  }

  emitsOf(event: string) {
    return this.emitted.filter((e) => e.event === event).map((e) => e.args);
  }

  asSocket(): Socket {
    return this as unknown as Socket;
  }
}

export const makeSocket = () => new FakeSocket();