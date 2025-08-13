import { Guild, REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "./config.js";
import { getWalletBalances } from "./service/getBalance.js";
import { buildWalletEmbed } from "./service/getEmbed.js";

const rest = new REST().setToken(config.DISCORD_TOKEN);
const GUILD = "1084797248845652109";

export const command = {
	data: new SlashCommandBuilder().setName("balance").setDescription("Cek total saldo wallet di Base mainnet"),
	async execute(interaction) {
		await interaction.deferReply();
		const { tokens, totalUSD } = await getWalletBalances();
		const embed = buildWalletEmbed(tokens, totalUSD);
		await interaction.editReply({ embeds: [embed] });
	},
};

const slashRegister = async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, GUILD), {
			body: [command.data.toJSON()],
		});
	} catch (error) {
		console.log(error);
	}
};

slashRegister();
