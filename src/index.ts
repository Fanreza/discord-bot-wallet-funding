import { ActivityType, Client } from "discord.js";
import { config } from "./config";
import { getAllBalance } from "./service/getAllBalance";
import { getWalletBalance } from "./service/getBalance";

const client = new Client({
	intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
	console.log("Discord bot is ready! 🤖");

	const walletBalance = await getWalletBalance();

	client.user?.setActivity({
		name: `${walletBalance.balance} POL | ${walletBalance.usdtBalance} USDT`,
		type: ActivityType.Watching,
	});
});

client.login(config.DISCORD_TOKEN);
