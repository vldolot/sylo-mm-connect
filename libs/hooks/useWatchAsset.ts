import { useCallback } from "react";

import { Assets } from "@/libs/constants";

import { metaMask, useMetaMask } from "./";

export type Asset = "SYLO";
type WatchAssetHook = [Array<Asset>, (symbol: Asset) => Promise<unknown>];

const assets: Array<Asset> = ["SYLO"];

export const useWatchAsset = (): WatchAssetHook => {
	const { wallet, currentChainId } = useMetaMask();

	const watchAsset = useCallback(
		async (symbol: Asset) => {
			if (!currentChainId || !wallet?.isActive) return;

			const asset = Assets[currentChainId][symbol];

			return await metaMask.watchAsset({
				symbol,
				...asset,
			});
		},
		[currentChainId, wallet?.isActive]
	);

	return [assets, watchAsset];
};
