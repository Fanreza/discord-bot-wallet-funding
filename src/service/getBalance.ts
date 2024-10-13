import { Alchemy, Network, Utils } from "alchemy-sdk";
import axios from "axios";
import { config } from "../config";

const alchemyNetworks = {
	ethereum: Network.ETH_MAINNET,
	matic: Network.MATIC_MAINNET,
	zksync: Network.ZKSYNC_MAINNET,
	bsc: Network.BNB_MAINNET,
};

const tokenSymbols = {
	ethereum: "ETH",
	matic: "MATIC",
	zksync: "ETH",
	bsc: "BNB",
};

export const getWalletBalance = async (network: keyof typeof alchemyNetworks = "matic") => {
	const alchemyNetwork = alchemyNetworks[network];
	const tokenSymbol = tokenSymbols[network];

	if (!alchemyNetwork || !tokenSymbol) {
		throw new Error("Unsupported network");
	}

	const settings = {
		apiKey: config.ALCHEMY_KEY,
		network: alchemyNetwork,
	};

	const alchemy = new Alchemy(settings);

	const address = config.WALLET_ADDRESS;

	let balance = await alchemy.core.getBalance(address!, "latest");
	const formattedBalance = parseFloat(Utils.formatEther(balance));

	try {
		const response = await axios.get("https://api.binance.com/api/v3/ticker/price", {
			params: {
				symbol: `${tokenSymbol}USDT`,
			},
		});

		const tokenToUsdtRate = parseFloat(response.data.price);
		const balanceInUSDT = (formattedBalance * tokenToUsdtRate).toFixed(2);

		return {
			balance: formattedBalance.toFixed(2),
			usdtBalance: parseFloat(balanceInUSDT),
		};
	} catch (error) {
		console.error("Error fetching token to USDT rate:", error);
		return {
			balance: formattedBalance,
			usdtBalance: null,
		};
	}
};
