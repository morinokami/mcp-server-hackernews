import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { getStory, getTopStories } from "./hackernews.js";

const server = new McpServer({
	name: "hackernews",
	version: "0.0.1",
});

server.resource(
	"top-stories",
	"https://hacker-news.firebaseio.com/v0/topstories.json",
	async (uri) => {
		const stories = await getTopStories();
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

server.resource(
	"story",
	new ResourceTemplate("https://hacker-news.firebaseio.com/v0/item/{id}.json", {
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

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Hacker News MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
