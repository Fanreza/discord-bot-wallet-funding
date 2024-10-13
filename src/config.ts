import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, ALCHEMY_KEY, WALLET_ADDRESS } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !ALCHEMY_KEY) {
	throw new Error("Missing environment variables");
}

export const config = {
	DISCORD_TOKEN,
	ALCHEMY_KEY,
	DISCORD_CLIENT_ID,
	WALLET_ADDRESS,
};
