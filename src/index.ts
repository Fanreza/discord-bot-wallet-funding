import { ActivityType, Client } from "discord.js";
import { config } from "./config";
import { getWalletBalances } from "./service/getBalance";

const client = new Client({
	intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
	console.log("Discord bot is ready! 🤖");

	const walletBalance = await getWalletBalances();

	client.user?.setActivity({
		name: `${walletBalance.totalUSD} USD`,
		type: ActivityType.Watching,
	});
});

client.login(config.DISCORD_TOKEN);
