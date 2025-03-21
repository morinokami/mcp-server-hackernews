import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getStory, getTopStories } from "./hackernews.js";

const server = new McpServer({
	name: "hackernews",
	version: "0.0.1",
});

server.tool(
	"get-top-stories",
	"Retrieves the current top stories from Hacker News",
	async () => {
		try {
			const stories = await getTopStories();
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(stories),
					},
				],
			};
		} catch (error) {
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error retrieving top stories: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			};
		}
	},
);

server.tool(
	"get-story",
	"Retrieves a story from Hacker News",
	{
		id: z.number(),
	},
	async ({ id }) => {
		try {
			const story = await getStory(id);
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(story),
					},
				],
			};
		} catch (error) {
			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error retrieving story: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
			};
		}
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
