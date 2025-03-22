const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";
const USER_AGENT = "hackernews-app/0.0.1";

type HNItem = {
	id: number;
	deleted?: boolean;
	type: "job" | "story" | "comment" | "poll" | "pollopt";
	by: string;
	time: number;
	text?: string;
	dead?: boolean;
	parent?: number;
	poll?: number;
	kids?: number[];
	url?: string;
	score?: number;
	title?: string;
	parts?: number[];
	descendants?: number;
};

export async function getTopStories(): Promise<number[]> {
	const url = `${HN_API_BASE}/topstories.json`;
	const response = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
		},
	});
	const data = await response.json();

	return data;
}

export async function getBestStories(): Promise<number[]> {
	const url = `${HN_API_BASE}/beststories.json`;
	const response = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
		},
	});
	const data = await response.json();

	return data;
}

export async function getNewStories(): Promise<number[]> {
	const url = `${HN_API_BASE}/newstories.json`;
	const response = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
		},
	});
	const data = await response.json();

	return data;
}

export async function getStory(id: number): Promise<HNItem> {
	const url = `${HN_API_BASE}/item/${id}.json`;
	const response = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
		},
	});
	const data = await response.json();

	return data;
}
