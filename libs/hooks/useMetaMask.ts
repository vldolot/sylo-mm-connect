import {
	initializeConnector,
	useWeb3React,
	Web3ReactHooks,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
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

const storedAccountAtom = atomWithStorage<string | undefined>(
	"metamask_account",
	undefined
);

type Chain = "porcini";

export const useMetaMask = () => {
	const wallet = useWeb3React();
	const provider = wallet?.connector?.provider;
	const currentChainId = metaMaskHooks.useChainId();
	const [isMetaMask, setIsMetaMask] = useState(false);

	const [isConnecting, setIsConnecting] = useState(true);
	const [storedAccount, setStoredAccount] = useAtom(storedAccountAtom);

	useEffect(() => {
		if (typeof window === "undefined") return;
		setIsMetaMask(window.ethereum?.isMetaMask as boolean);
	}, []);

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
		setStoredAccount(undefined);

		if (metaMask?.deactivate) return metaMask.deactivate();

		if (metaMask?.actions?.resetState) return metaMask.actions.resetState();
	}, []);

	// Update stored account
	useEffect(() => {
		if (!wallet?.account || wallet?.account === storedAccount) return;
		setStoredAccount(wallet.account);
	}, [storedAccount, setStoredAccount, wallet?.account]);

	useEffect(() => {
		if (
			!isMetaMask ||
			!storedAccount ||
			wallet?.isActive ||
			typeof isMetaMask === "undefined"
		)
			return;

		metaMask.connectEagerly().then(() => setIsConnecting(false));
	}, [isMetaMask, wallet?.isActive, storedAccount]);

	// Update connecting state on account change
	useEffect(() => {
		if (!wallet?.account) return;

		setIsConnecting(false);
	}, [wallet?.account]);

	return {
		wallet,
		connectWallet,
		disconnectWallet,
		isConnecting,
		provider,
		currentChainId,
	};
};
