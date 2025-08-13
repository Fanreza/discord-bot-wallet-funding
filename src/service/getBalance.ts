import { Alchemy, Network, Utils } from "alchemy-sdk";
import axios from "axios";
import { config } from "../config.js";

export interface TokenBalance {
	name: string;
	symbol: string;
	contractAddress: string | null;
	balance: number;
	priceUSD: number;
	valueUSD: number;
}

export const getWalletBalances = async (): Promise<{ tokens: TokenBalance[]; totalUSD: number }> => {
	const settings = {
		apiKey: config.ALCHEMY_KEY,
		network: Network.BASE_MAINNET,
	};

	const alchemy = new Alchemy(settings);
	const address = config.WALLET_ADDRESS;

	// 1️⃣ Ambil ERC20 balances
	const tokenBalances = await alchemy.core.getTokenBalances(address);

	// 2️⃣ Ambil native ETH
	const nativeBalanceWei = await alchemy.core.getBalance(address, "latest");
	const nativeBalance = parseFloat(Utils.formatEther(nativeBalanceWei));

	// 3️⃣ Gabungkan semua token
	const tokensRaw = [{ name: "Ethereum", symbol: "ETH", contractAddress: null, balance: nativeBalance }];

	const metadataList = await Promise.all(
		tokenBalances.tokenBalances.map(async (token) => {
			const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
			return {
				name: metadata.name || token.contractAddress,
				symbol: metadata.symbol || "",
				contractAddress: token.contractAddress,
				balance: parseFloat(Utils.formatUnits(token.tokenBalance, metadata.decimals || 18)),
			};
		})
	);

	tokensRaw.push(...metadataList);

	// 4️⃣ Ambil daftar coin dari CoinGecko
	const coinsList = await axios.get("https://api.coingecko.com/api/v3/coins/list?include_platform=true");
	const contractToId: Record<string, string> = {};

	for (const coin of coinsList.data) {
		if (coin.platforms && coin.platforms["base"]) {
			contractToId[coin.platforms["base"].toLowerCase()] = coin.id;
		}
		if (coin.id === "ethereum") {
			contractToId["native"] = "ethereum";
		}
	}

	// 5️⃣ Ambil harga semua token
	const tokenIds: string[] = [];
	for (const token of tokensRaw) {
		const addr = token.contractAddress ? token.contractAddress.toLowerCase() : "native";
		if (contractToId[addr] && !tokenIds.includes(contractToId[addr])) {
			tokenIds.push(contractToId[addr]);
		}
	}

	const pricesRes = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
		params: { ids: tokenIds.join(","), vs_currencies: "usd" },
	});

	// 6️⃣ Kalkulasi total
	let totalUSD = 0;
	const tokens: TokenBalance[] = tokensRaw.map((token) => {
		const addr = token.contractAddress ? token.contractAddress.toLowerCase() : "native";
		const cgId = contractToId[addr];
		const priceUSD = cgId ? pricesRes.data[cgId]?.usd || 0 : 0;
		const valueUSD = token.balance * priceUSD;
		totalUSD += valueUSD;
		return { ...token, priceUSD, valueUSD };
	});

	return { tokens, totalUSD: parseFloat(totalUSD.toFixed(2)) };
};
