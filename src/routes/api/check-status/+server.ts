import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { ServerStatus } from "$scripts/servers.svelte.js";

export const prerender = true;

const PARTNERS = [
	{ url: "forge-vtt.com", name: "The Forge" },
	{ url: "forgevtt.com", name: "The Forge" },
	{ url: "moltenhosting.com", name: "Molten Hosting" },
	{ url: "foundryserver.com", name: "Foundry Server" }
];

export const POST: RequestHandler = async ({ request }) => {
	const { url } = await request.json();

	const partner = PARTNERS.find((p) => url.includes(p.url))?.name;

	if (partner) return json({ partner: partner });

	const cleanUrl = url.replace(/\/+$/, "").replace(/\/(game|join)$/, "");

	const response = await fetch(`${cleanUrl}/api/status`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.status !== 200) {
		return error(404, "Server cannot be reached");
	}

	const data: ServerStatus = await response.json();

	return json(data);
};
