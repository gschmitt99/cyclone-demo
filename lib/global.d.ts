import type {WebServerSocket} from "ws";

declare global {
  var _wss: import("ws").WebSocketServer | undefined;
}

export {};