// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";
import { config } from "../config";

const settings = {
	apiKey: config.ALCHEMY_KEY,
	network: Network.MATIC_MAINNET,
};
const alchemy = new Alchemy(settings);

export const getAllBalance = async () => {
	// Wallet address
	const address = config.WALLET_ADDRESS;

	// Get token balances
	const balances = await alchemy.core.getTokenBalances(address!);

	// Remove tokens with zero balance
	const nonZeroBalances = balances.tokenBalances.filter((token) => {
		return token.tokenBalance !== "0";
	});

	// Counter for SNo of final output
	let i = 1;

	// Loop through all tokens with non-zero balance
	let totalBalance;

	for (let token of nonZeroBalances) {
		// Get balance of token
		let balance = parseFloat(token.tokenBalance ?? "0");

		// Get metadata of token
		const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

		console.log(metadata);

		// Compute token balance in human-readable format
		balance = balance / Math.pow(10, metadata.decimals ?? 0);
		balance = parseFloat(balance.toFixed(2));

		// Print name, balance, and symbol of token
		console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
	}

	// Print total balance
	console.log(`Total balance: ${totalBalance}`);
};
