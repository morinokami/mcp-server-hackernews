export const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";
export const USER_AGENT = "hackernews-app/0.0.1";

export type StoryType = "top" | "best" | "new";

async function getStories(type: StoryType): Promise<number[]> {
	const url = `${HN_API_BASE}/${type}stories.json`;
	const response = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
		},
	});
	const data = await response.json();

	return data;
}

export async function getTopStories() {
	return getStories("top");
}

export async function getBestStories() {
	return getStories("best");
}

export async function getNewStories() {
	return getStories("new");
}

type HNItem = {
	id: number;
	deleted?: boolean;
	type?: "job" | "story" | "comment" | "poll" | "pollopt";
	by?: string;
	time?: number;
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

type HNUser = {
	id: string;
	created: number;
	karma: number;
	about?: string;
	submitted?: number[];
};

export async function getUser(id: string): Promise<HNUser> {
	const url = `${HN_API_BASE}/user/${id}.json`;
	const response = await fetch(url, {
		headers: {
			"User-Agent": USER_AGENT,
		},
	});
	const data = await response.json();

	return data;
}
