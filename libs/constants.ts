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

export const ALICE_PRIVATE_KEY =
	"0x79c3b7fc0b7697b9414cb87adcb37317d1cab32818ae18c0e97ad76395d1fdcf";
export const BOB_PRIVATE_KEY =
	"0xcb6df9de1efca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854";
export const FERDIE_PRIVATE_KEY =
	"0x1a02e99b89e0f7d3488d53ded5a3ef2cff6046543fc7f734206e3e842089e051";

export const NATIVE_TOKEN_ID = 2;
export const FEE_TOKEN_ID = 15460;

export const FEE_PROXY_ADDRESS = "0x00000000000000000000000000000000000004bb";

export const FEE_PROXY_ABI = [
	"function callWithFeePreferences(address asset, uint128 maxPayment, address target, bytes input)",
];

export const ERC20_ABI = [
	"event Transfer(address indexed from, address indexed to, uint256 value)",
	"event Approval(address indexed owner, address indexed spender, uint256 value)",
	"function approve(address spender, uint256 amount) public returns (bool)",
	"function allowance(address owner, address spender) public view returns (uint256)",
	"function balanceOf(address who) public view returns (uint256)",
	"function name() public view returns (string memory)",
	"function symbol() public view returns (string memory)",
	"function decimals() public view returns (uint8)",
	"function transfer(address who, uint256 amount)",
];
