import { getAssetPrecompileAddress } from "./utils";

export const RootNetworks = {
	porcini: {
		ChainName: "Rootnet Porcini",
		ChainId: {
			InDec: 3999,
			InHex: `0x${Number(3999).toString(16)}`,
		},
		ApiUrl: {
			InWebSocket: "wss://porcini.au.rootnet.app/ws",
			InRpc: "https://porcini.au.rootnet.app/",
		},
		LinkedEthChain: "goerli",
		ExplorerUrl: "https://explorer.rootnet.cloud",
	},
};

export const Assets = {
	[RootNetworks.porcini.ChainId.InDec]: {
		SYLO: {
			assetId: 3172,
			address: getAssetPrecompileAddress(3172),
			image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5662.png",
			decimals: 18,
		},
	},
};
