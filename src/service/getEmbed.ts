import { EmbedBuilder } from "discord.js";
import { TokenBalance } from "./getBalance.js";
import { config } from "../config.js";

export const buildWalletEmbed = (tokens: TokenBalance[], totalUSD: number) => {
	const fields = tokens
		.filter((t) => t.balance > 0)
		.map((t) => ({
			name: `${t.symbol || "Unknown"} (${t.name})`,
			value: `${t.balance.toFixed(4)} — $${t.valueUSD.toFixed(2)}`,
			inline: false,
		}));

	return new EmbedBuilder()
		.setTitle("💰 Wallet Balance")
		.setDescription(`**Total USD:** $${totalUSD.toFixed(2)}`)
		.addFields(fields)
		.setFooter({ text: `Address: ${config.WALLET_ADDRESS}` })
		.setColor(0x00ff00);
};
