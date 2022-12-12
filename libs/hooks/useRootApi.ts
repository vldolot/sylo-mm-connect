import { ApiPromise, WsProvider } from "@polkadot/api";
import { atom, useAtom } from "jotai";

import { RootNetworks } from "@/libs/constants";

const typedefs = {
	AccountId: "EthereumAccountId",
	AccountId20: "EthereumAccountId",
	AccountId32: "EthereumAccountId",
	Address: "AccountId",
	LookupSource: "AccountId",
	Lookup0: "AccountId",
	EthereumSignature: {
		r: "H256",
		s: "H256",
		v: "U8",
	},
	ExtrinsicSignature: "EthereumSignature",
	SessionKeys: "([u8; 32], [u8; 32])",
};

const rpc = {
	dex: {
		quote: {
			description:
				"Returns the amount of output token that can be obtained by swapping an amount of input token",
			params: [
				{
					name: "amountIn",
					type: "u128",
				},
				{
					name: "reserveIn",
					type: "u128",
				},
				{
					name: "reserveOut",
					type: "u128",
				},
			],
			type: "Json",
		},
		getAmountsOut: {
			description:
				"Returns the amount of output tokens that can be obtained by swapping an amount of inputs token",
			params: [
				{
					name: "amountIn",
					type: "Balance",
				},
				{
					name: "path",
					type: "Vec<AssetId>",
				},
			],
			type: "Json",
		},
		getAmountsIn: {
			description:
				"Returns the amount of input tokens that can be obtained by swapping an amount of output token",
			params: [
				{
					name: "amountOut",
					type: "Balance",
				},
				{
					name: "path",
					type: "Vec<AssetId>",
				},
			],
			type: "Json",
		},
	},
};

const getRootApi = async () => {
	const rootApi = await ApiPromise.create({
		provider: new WsProvider(RootNetworks["porcini"].ApiUrl.InWebSocket),
		types: typedefs,
		rpc,
	});

	await rootApi.isReady;

	return rootApi;
};

const rootApiAtom = atom(async () => await getRootApi());

export const useRootApi = () => {
	const [rootApi] = useAtom(rootApiAtom);

	return rootApi;
};
