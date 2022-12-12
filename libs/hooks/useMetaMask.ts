import {
	initializeConnector,
	useWeb3React,
	Web3ReactHooks,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { useCallback, useEffect, useState } from "react";

import { RootNetworks } from "@/libs/constants";

export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
	(actions) =>
		new MetaMask({
			actions,
			options: {
				mustBeMetaMask: true,
			},
		})
);

export const metaMaskConnectors = [metaMask, metaMaskHooks] as [
	MetaMask,
	Web3ReactHooks
];

type Chain = "porcini";

export const useMetaMask = () => {
	const wallet = useWeb3React();
	const provider = wallet?.connector?.provider;
	const currentChainId = metaMaskHooks.useChainId();

	const [isConnecting, setIsConnecting] = useState(true);

	useEffect(() => {
		if (wallet?.isActive) return;

		metaMask.connectEagerly().then(() => setIsConnecting(false));
	}, [wallet?.isActive]);

	// Update connecting state on account change
	useEffect(() => {
		if (!wallet?.account) return;

		setIsConnecting(false);
	}, [wallet?.account]);

	const connectWallet = useCallback(async (chain?: Chain) => {
		if (!chain) return await metaMask.activate();

		metaMask
			.activate({
				chainName: RootNetworks[chain].ChainName,
				chainId: RootNetworks[chain].ChainId.InDec,
				nativeCurrency: {
					name: "XRP",
					decimals: 18,
					symbol: "XRP",
				},
				rpcUrls: [RootNetworks[chain].ApiUrl.InRpc],
				blockExplorerUrls: [RootNetworks[chain].ExplorerUrl],
			})
			.then(() => setIsConnecting(false));
	}, []);

	const disconnectWallet = useCallback(() => {
		if (metaMask?.deactivate) {
			console.log("Disconnecting");
			return metaMask.deactivate();
		}
	}, []);

	return {
		wallet,
		connectWallet,
		disconnectWallet,
		isConnecting,
		provider,
		currentChainId,
	};
};
