import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	type StoryType,
	getBestStories,
	getNewStories,
	getStory,
	getTopStories,
} from "./hackernews.js";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Hacker News API", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe("getStories", () => {
		const storyTestCases: Array<[StoryType, string, () => Promise<number[]>]> =
			[
				["top", "topstories", getTopStories],
				["best", "beststories", getBestStories],
				["new", "newstories", getNewStories],
			];

		it.each(storyTestCases)(
			"should fetch and return %s stories",
			async (_, endpoint, getStoriesFn) => {
				const mockStories = [1, 2, 3];
				mockFetch.mockResolvedValueOnce({
					json: () => Promise.resolve(mockStories),
				});

				const result = await getStoriesFn();
				expect(result).toEqual(mockStories);
				expect(mockFetch).toHaveBeenCalledWith(
					`https://hacker-news.firebaseio.com/v0/${endpoint}.json`,
					{
						headers: {
							"User-Agent": "hackernews-app/0.0.1",
						},
					},
				);
			},
		);
	});

	describe("getStory", () => {
		it("should fetch and return a story", async () => {
			const mockStory = {
				id: 1,
				type: "story",
				by: "user123",
				time: 1234567890,
				title: "Test Story",
				url: "https://example.com",
				score: 100,
				descendants: 50,
			};

			mockFetch.mockResolvedValueOnce({
				json: () => Promise.resolve(mockStory),
			});

			const result = await getStory(1);
			expect(result).toEqual(mockStory);
			expect(mockFetch).toHaveBeenCalledWith(
				"https://hacker-news.firebaseio.com/v0/item/1.json",
				{
					headers: {
						"User-Agent": "hackernews-app/0.0.1",
					},
				},
			);
		});

		it("should handle a comment type", async () => {
			const mockComment = {
				id: 2,
				type: "comment",
				by: "user456",
				time: 1234567891,
				text: "Test comment",
				parent: 1,
				kids: [3, 4],
			};

			mockFetch.mockResolvedValueOnce({
				json: () => Promise.resolve(mockComment),
			});

			const result = await getStory(2);
			expect(result).toEqual(mockComment);
			expect(mockFetch).toHaveBeenCalledWith(
				"https://hacker-news.firebaseio.com/v0/item/2.json",
				{
					headers: {
						"User-Agent": "hackernews-app/0.0.1",
					},
				},
			);
		});
	});
});
