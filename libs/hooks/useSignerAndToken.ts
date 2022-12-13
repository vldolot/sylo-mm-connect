import { JsonRpcProvider } from "@ethersproject/providers";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { hexToU8a } from "@polkadot/util";
import { Contract, Wallet } from "ethers";
import { useCallback, useEffect, useState } from "react";

import {
	ALICE_PRIVATE_KEY,
	Assets,
	BOB_PRIVATE_KEY,
	ERC20_ABI,
	NATIVE_TOKEN_ID,
	RootNetworks,
} from "@/libs/constants";
import { assetIdToERC20ContractAddress } from "@/libs/utils";

export const SYLO_TOKEN_ID =
	Assets[RootNetworks.porcini.ChainId.InDec].SYLO.assetId;

export const useSignerAndToken = () => {
	const [xrpTokenAddress, setXrpTokenAddress] = useState<string>();
	const [alice, setAlice] = useState<KeyringPair>();
	const [bob, setBob] = useState<KeyringPair>();
	const [aliceSigner, setAliceSigner] = useState<Wallet>();
	const [xrpToken, setXrpToken] = useState<Contract>();
	const [feeToken, setFeeToken] = useState<Contract>();

	const getSignerAndToken = useCallback(() => {
		const jsonProvider = new JsonRpcProvider(RootNetworks.porcini.ApiUrl.InRpc);

		const keyring = new Keyring({ type: "ethereum" });
		const alice = keyring.addFromSeed(hexToU8a(ALICE_PRIVATE_KEY));
		const bob = keyring.addFromSeed(hexToU8a(BOB_PRIVATE_KEY));
		const aliceSigner = new Wallet(ALICE_PRIVATE_KEY).connect(jsonProvider);

		const xrpTokenAddress = assetIdToERC20ContractAddress(NATIVE_TOKEN_ID);
		console.log(`xrpTokenAddress :: ${xrpTokenAddress}`);
		const xrpToken = new Contract(xrpTokenAddress, ERC20_ABI, aliceSigner);

		const feeToken = new Contract(
			assetIdToERC20ContractAddress(SYLO_TOKEN_ID),
			ERC20_ABI,
			aliceSigner
		);

		setXrpTokenAddress(xrpTokenAddress);
		setAlice(alice);
		setBob(bob);
		setAliceSigner(aliceSigner);
		setXrpToken(xrpToken);
		setFeeToken(feeToken);
	}, [
		RootNetworks,
		SYLO_TOKEN_ID,
		ALICE_PRIVATE_KEY,
		BOB_PRIVATE_KEY,
		NATIVE_TOKEN_ID,
		ERC20_ABI,
	]);

	useEffect(() => {
		getSignerAndToken();
	}, [getSignerAndToken]);

	return { xrpTokenAddress, alice, bob, aliceSigner, xrpToken, feeToken };
};
