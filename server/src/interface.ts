import type { WebSocket } from 'ws';

export interface Message {
  type: string;
  data: {
    name: string;
    uid: string;
    content: string;
    contentType?: string;
    time: string;
    mid: string;
  };
}

export interface User {
  name: string;
  uid: string;
  ip?: string;
  time: number;
  ws: WebSocket;
}

export type UserWithoutWS = Omit<User, 'ws'>;
