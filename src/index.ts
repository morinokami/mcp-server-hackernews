#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./hackernews.js";

const args = process.argv.slice(2);
if (args.includes("--version") || args.includes("-v")) {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const { version } = require("../package.json");
	console.log(version);
	process.exit(0);
}
if (args.includes("--help") || args.includes("-h")) {
	console.log("mcp-server-hackernews - Hacker News MCP Server");
	console.log("");
	console.log("Usage: mcp-server-hackernews [options]");
	console.log("");
	console.log("Options:");
	console.log("  --version, -v  Print version");
	console.log("  --help, -h     Print this help");
	process.exit(0);
}

async function main() {
	const transport = new StdioServerTransport();
	const { server } = createServer();

	await server.connect(transport);

	console.error("Hacker News MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Server error:", error);
	process.exit(1);
});
