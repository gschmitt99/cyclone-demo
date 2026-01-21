import { WebSocketServer } from "ws";
import type WebSocket from "ws";

if (!global._wss) {
     global._wss = new WebSocketServer({ port: 3002, host: "0.0.0.0" });
}

export function broadcast(type: any, payload: any = {}) {
  const json = JSON.stringify({ type, payload });
  const server = global._wss!;

  server.clients.forEach((client: WebSocket) => {
    if (client.readyState === 1) client.send(json);
  });
}
export const wss = global._wss;
