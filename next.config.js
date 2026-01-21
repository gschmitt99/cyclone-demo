// Force-load the WebSocket server on startup.
// Turbopack cannot tree-shake this because next.config.js
// is executed directly by Node before the dev server starts.
require("./lib/ws-bootstrap");

const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;