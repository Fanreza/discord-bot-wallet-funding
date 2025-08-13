import { ActivityType, Client, Interaction } from "discord.js";
import { config } from "./config.js";
import { getWalletBalances } from "./service/getBalance.js";
import { command as balanceCommand } from "./deploy-commands.js"; // Import command balance

const client = new Client({
	intents: ["Guilds"],
});

client.once("ready", async () => {
	console.log("Discord bot is ready! 🤖");

	const walletBalance = await getWalletBalances();
	client.user?.setActivity({
		name: `${walletBalance.totalUSD} USD`,
		type: ActivityType.Watching,
	});
});

// Handler slash command
client.on("interactionCreate", async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;

	try {
		if (interaction.commandName === balanceCommand.data.name) {
			await balanceCommand.execute(interaction);
		}
	} catch (err) {
		console.error("❌ Command error:", err);
		if (interaction.deferred || interaction.replied) {
			await interaction.editReply("Terjadi error saat memproses command.");
		} else {
			await interaction.reply("Terjadi error saat memproses command.");
		}
	}
});

client.login(config.DISCORD_TOKEN);
