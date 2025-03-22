#!/usr/bin/env node

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
	HN_API_BASE,
	type StoryType,
	getBestStories,
	getNewStories,
	getStory,
	getTopStories,
	getUser,
} from "./hackernews.js";

const server = new McpServer({
	name: "hackernews",
	version: "0.0.1",
});

function registerStoryResource(type: StoryType) {
	const getStories = {
		top: getTopStories,
		best: getBestStories,
		new: getNewStories,
	}[type];

	server.resource(
		`${type}-stories`,
		`${HN_API_BASE}/${type}stories.json`,
		async (uri) => {
			const stories = await getStories();
			return {
				contents: [
					{
						uri: uri.href,
						text: JSON.stringify(stories),
						mimeType: "application/json",
					},
				],
			};
		},
	);
}
registerStoryResource("top");
registerStoryResource("best");
registerStoryResource("new");

server.resource(
	"story",
	new ResourceTemplate(`${HN_API_BASE}/item/{id}.json`, {
		list: undefined,
	}),
	async (uri, { id }) => {
		const story = await getStory(Number(id));
		return {
			contents: [
				{
					uri: uri.href,
					text: JSON.stringify(story),
					mimeType: "application/json",
				},
			],
		};
	},
);

server.resource(
	"user",
	new ResourceTemplate(`${HN_API_BASE}/user/{id}.json`, {
		list: undefined,
	}),
	async (uri, { id }) => {
		const user = await getUser(String(id));
		return {
			contents: [
				{
					uri: uri.href,
					text: JSON.stringify(user),
					mimeType: "application/json",
				},
			],
		};
	},
);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Hacker News MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
