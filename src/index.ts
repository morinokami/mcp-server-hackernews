#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./hackernews.js";

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
