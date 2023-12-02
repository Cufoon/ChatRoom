import { useEffect, useRef } from 'react';
import { ExposeData } from '../utils/type.ts';

export type Handler<T> = {
  [K in keyof T]: undefined extends T[K]
    ? T[K] extends undefined
      ? () => void
      : (data?: T[K]) => void
    : (data: T[K]) => void;
};

type WebSocketMessageMap<T> = { [K in keyof T]: { type: K; data: T[K] } };
type WebSocketMessage<T> = ExposeData<WebSocketMessageMap<T>>;

const sendWebSocket = (ws: WebSocket, data: unknown) => {
  ws.send(JSON.stringify(data));
};

export interface OnWebSocketOpenCallback {
  (ws: { send: <T>(data: T) => void }): void;
}

const connectWebSocket = <T>(
  url: string,
  whenOpen: OnWebSocketOpenCallback,
  handler: Handler<T>
) => {
  const ws = new WebSocket(url);
  const sender = <U>(data: U) => {
    sendWebSocket(ws, data);
  };
  ws.onopen = () => {
    whenOpen({ send: sender });
  };
  ws.onmessage = (ev: MessageEvent<string>) => {
    const stream = JSON.parse(ev.data) as WebSocketMessage<T>;
    handler[stream.type](stream.data);
  };
  return ws;
};

export const closeWebSocket = (ws?: WebSocket) => {
  if (ws !== undefined) {
    ws.onopen = function () {
      this.close();
    };
    ws.onerror = function () {
      this.close();
    };
    if (ws.readyState === 1) {
      ws.close();
    }
  }
};

export const useWebSocket = <T>(
  url: string,
  whenOpen: OnWebSocketOpenCallback,
  handler: Handler<T>
) => {
  const websocketRef = useRef<WebSocket>();

  const send = <U>(data: U) => {
    websocketRef.current && sendWebSocket(websocketRef.current, data);
  };

  useEffect(() => {
    websocketRef.current = connectWebSocket<T>(url, whenOpen, handler);
    return () => {
      closeWebSocket(websocketRef.current);
    };
  }, [handler, url, whenOpen]);

  return { send };
};
