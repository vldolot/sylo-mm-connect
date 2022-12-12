import { Fragment, useCallback, useEffect, useState } from "react";

import { Button } from "@/components";
import SyloIcon from "@/components/icons/SyloIcon";
import { Assets, RootNetworks } from "@/libs/constants";
import { Asset, useMetaMask, useRootApi, useWatchAsset } from "@/libs/hooks";
import { formatBalance } from "@/libs/utils";

const icons: any = {
	SYLO: <SyloIcon />,
};

export default function ConnectToWallet() {
	const [isLoading, setIsLoading] = useState(false);
	const [hasConcluded, setHasConcluded] = useState(false);
	const { wallet, connectWallet, disconnectWallet, currentChainId } =
		useMetaMask();
	const [_, watchAsset] = useWatchAsset();

	const handleConnect = () => {
		setIsLoading(true);
		setTimeout(async () => {
			await connectWallet();
			setIsLoading(false);
			setHasConcluded(true);
			setTimeout(() => {
				setHasConcluded(false);
			}, 500);
		}, 500);
	};

	return (
		<div className="space-y-4 px-4 py-5 sm:p-6">
			{!wallet?.isActive ? (
				<Button variant="small" func={handleConnect} isLoading={isLoading}>
					Connect Wallet
				</Button>
			) : !!hasConcluded ? (
				<Button
					variant="small"
					func={disconnectWallet}
					showConcludedIcon={hasConcluded}
					concludedText="Connected"
					buttonClassName="bg-indigo-700"
				></Button>
			) : (
				<Button
					variant="small"
					func={disconnectWallet}
					concludedText="Connected"
					buttonClassName="bg-indigo-700"
				>
					Disconnect?
				</Button>
			)}

			{wallet?.isActive &&
			currentChainId &&
			Assets[currentChainId] &&
			currentChainId === RootNetworks.porcini.ChainId.InDec ? (
				<>
					<div>
						<p className="text-sm font-medium text-white">Connected account:</p>
						<p className="text-sm text-gray-400">{wallet?.account}</p>
					</div>
					{Object.entries(Assets[currentChainId]).map(([key, value]) => (
						<Fragment key={key}>
							<div>
								<Balances symbol={key} asset={value} wallet={wallet} />
							</div>
							<Button
								variant="small"
								buttonClassName="w-auto"
								func={async () => await watchAsset(key as Asset)}
							>
								Add {key} token to MetaMask?
							</Button>
						</Fragment>
					))}
				</>
			) : (
				<div>Please select Porcini (Root Network) on MetaMask</div>
			)}
		</div>
	);
}

interface BalancesProps {
	symbol: string;
	asset: {
		assetId: number;
		address: string;
		image: string;
		decimals: number;
	};
	wallet: any;
}

const Balances: any = ({ symbol, asset, wallet }: BalancesProps) => {
	const rootBalance = useGetRootBalance({ symbol, wallet, asset });
	if (!!rootBalance)
		return (
			<div className="-m-3 flex items-center p-4">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white bg-input-bg text-white">
					{icons[symbol]}
				</div>
				<div className="ml-4">
					<p className="text-sm font-medium text-white">{symbol} Balance</p>
					<p className="text-sm text-gray-400">
						{formatBalance(rootBalance ?? "0", asset.decimals)}
					</p>
				</div>
			</div>
		);
};

const useGetRootBalance = ({ symbol, wallet, asset }: BalancesProps) => {
	const [rootBalance, setRootBalance] = useState(0);
	const rootApi = useRootApi();

	const fetchAssetBalance = useCallback(async () => {
		if (!rootApi || !wallet?.account) return;

		const result: any = (
			await rootApi.query.assets.account(asset.assetId, wallet.account)
		).toJSON();

		setRootBalance(result?.balance);
	}, [asset.assetId, rootApi, wallet.account]);

	useEffect(() => {
		fetchAssetBalance();
	}, [symbol, fetchAssetBalance]);

	return rootBalance;
};
