import { SlashCommandBuilder } from "discord.js";
import { getWalletBalances } from "../service/getBalance";
import { buildWalletEmbed } from "../service/getEmbed";

export const command = {
	data: new SlashCommandBuilder().setName("balance").setDescription("Cek total saldo wallet di Base mainnet"),
	async execute(interaction: any) {
		await interaction.deferReply();
		const { tokens, totalUSD } = await getWalletBalances();
		const embed = buildWalletEmbed(tokens, totalUSD);
		await interaction.editReply({ embeds: [embed] });
	},
};
