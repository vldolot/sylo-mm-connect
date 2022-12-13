import { KeyringPair } from "@polkadot/keyring/types";
import { BigNumber, Contract, Signer, utils, Wallet } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components";
import {
	ERC20_ABI,
	FEE_PROXY_ABI,
	FEE_PROXY_ADDRESS,
	NATIVE_TOKEN_ID,
} from "@/libs/constants";
import { SYLO_TOKEN_ID, useRootApi, useSignerAndToken } from "@/libs/hooks";

export default function SendEVMFeeProxy() {
	const [estimatedGasUsed, setEstimatedGasUsed] = useState<number>();
	const [estimatedGasXRP, setEstimatedGasXRP] = useState<BigNumber>();
	const [xrpGasCostScaled, setXrpGasCostScaled] = useState<string>();
	const [syloGasCost, setSyloGasCost] = useState();
	const [syloGasCostScaled, setSyloGasCostScaled] = useState<string>();
	const [xrpActualGasCost, setXrpActualGasCost] = useState();
	const [xrpBalanceDiff, setXrpBalanceDiff] = useState();
	const [tokenBalanceDiff, setTokenBalanceDiff] = useState();
	const [tokenBalanceActual, setTokenBalanceActual] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const api = useRootApi();
	const { xrpTokenAddress, alice, bob, aliceSigner, xrpToken, feeToken } =
		useSignerAndToken();

	const { xrpBalance, tokenBalance, feeData } = useGetTokenBalances({
		alice,
		bob,
		aliceSigner,
		xrpToken,
		feeToken,
	});

	const signAndSendFeeProxy = useCallback(async () => {
		setIsLoading(true);
		// call `transfer` on erc20 token - via `callWithFeePreferences` precompile function
		let iface = new utils.Interface(ERC20_ABI);
		const contractAddress = feeToken?.address;
		// Setup input for an erc20 transfer to Bob
		const transferInput = iface.encodeFunctionData("transfer", [
			bob?.address,
			1,
		]);

		const maxFeePaymentInToken = utils.parseEther("2"); // 10e18 // max 2 sylo tokens
		const feeProxy = new Contract(
			FEE_PROXY_ADDRESS,
			FEE_PROXY_ABI,
			aliceSigner
		);

		// sign and send feeProxy transaction with custom nonce and gas limit
		const gas = await feeProxy
			.connect(aliceSigner as Signer)
			.estimateGas.callWithFeePreferences(
				feeToken?.address,
				maxFeePaymentInToken,
				contractAddress,
				transferInput
			);
		const estimatedGasUsed = gas.toNumber();

		console.log("estimated gas used by tx:", estimatedGasUsed);

		const xrpGasCost = gas.mul(feeData.gasPrice!);
		const xrpGasCostScaled = utils.formatEther(xrpGasCost.toString());
		const estimatedGasXRP = xrpGasCost.div(10 ** 12);

		console.log(
			`estimated gas (XRP): ${estimatedGasXRP} = ${xrpGasCostScaled} (actual)`
		); // 6 decimals

		const {
			Ok: [syloGasCost, _],
		} = await (api.rpc as any).dex.getAmountsIn(
			xrpGasCost.div(10 ** 12).toNumber(),
			[SYLO_TOKEN_ID, NATIVE_TOKEN_ID]
		);
		const syloGasCostScaled = utils.formatEther(syloGasCost.toString());
		console.log(
			`estimated gas (SYLO): ${syloGasCost} = ${syloGasCostScaled} (actual)`
		); // 18 decimals

		// call `callWithFeePreferences` on fee proxy
		const tx = await feeProxy
			.connect(aliceSigner as Signer)
			.callWithFeePreferences(
				feeToken?.address,
				maxFeePaymentInToken,
				contractAddress,
				transferInput,
				{
					gasLimit: gas,
					gasPrice: feeData.gasPrice,
				}
			);
		const receipt = await tx.wait();
		const actualCost = receipt.gasUsed?.mul(receipt.effectiveGasPrice);
		const xrpActualGasCost = actualCost.div(10 ** 12).toString();
		console.log("actual gas (XRP): ", xrpActualGasCost); // 6dp

		// check updated balances
		const [xrpBalanceUpdated, tokenBalanceUpdated] = await Promise.all([
			xrpToken?.balanceOf(alice?.address),
			feeToken?.balanceOf(alice?.address),
		]);

		const xrpBalanceDiff = xrpBalanceUpdated.sub(xrpBalance).toString();
		const tokenBalanceDiff = tokenBalance.sub(tokenBalanceUpdated).toString();
		const tokenBalanceActual = utils.formatEther(tokenBalanceDiff);

		console.log(`XRP balance difference: ${xrpBalanceDiff}`); // should be 0
		console.log(
			`Fee Token balance difference: ${tokenBalanceDiff} = ${tokenBalanceActual} (actual)`
		);

		setEstimatedGasUsed(estimatedGasUsed);
		setEstimatedGasXRP(estimatedGasXRP);
		setXrpGasCostScaled(xrpGasCostScaled);
		setSyloGasCost(syloGasCost);
		setSyloGasCostScaled(syloGasCostScaled);
		setXrpActualGasCost(xrpActualGasCost);
		setXrpBalanceDiff(xrpBalanceDiff);
		setTokenBalanceDiff(tokenBalanceDiff);
		setTokenBalanceActual(tokenBalanceActual);
		setIsLoading(false);
	}, [feeToken, feeData, api, aliceSigner, bob, alice]);

	return (
		<>
			<div>Use Sylo to pay gas fee for a normal transfer of 1 ROOT token:</div>
			<Button
				variant="small"
				func={signAndSendFeeProxy}
				buttonClassName="bg-indigo-700"
				isLoading={isLoading}
			>
				Submit
			</Button>
			{estimatedGasUsed && (
				<div>
					<p className="text-sm font-medium text-white">
						Estimated gas used by tx:
					</p>
					<p className="text-sm text-gray-400">{estimatedGasUsed}</p>
				</div>
			)}
			{estimatedGasXRP && xrpGasCostScaled && (
				<div>
					<p className="text-sm font-medium text-white">Estimated gas (XRP):</p>
					<p className="text-sm text-gray-400">{estimatedGasXRP.toString()}</p>
					<p className="text-sm text-gray-400">{xrpGasCostScaled} (actual)</p>
				</div>
			)}
			{syloGasCost && syloGasCostScaled && (
				<div>
					<p className="text-sm font-medium text-white">
						Estimated gas (SYLO):
					</p>
					<p className="text-sm text-gray-400">{syloGasCost}</p>
					<p className="text-sm text-gray-400">{syloGasCostScaled} (actual)</p>
				</div>
			)}
			{xrpActualGasCost && (
				<div>
					<p className="text-sm font-medium text-white">Actual gas (XRP):</p>
					<p className="text-sm text-gray-400">{xrpActualGasCost}</p>
				</div>
			)}
			{xrpBalanceDiff && (
				<div>
					<p className="text-sm font-medium text-white">
						XRP balance difference:
					</p>
					<p className="text-sm text-gray-400">{xrpBalanceDiff}</p>
				</div>
			)}
			{tokenBalanceDiff && tokenBalanceActual && (
				<div>
					<p className="text-sm font-medium text-white">
						Fee Token balance difference:
					</p>
					<p className="text-sm text-gray-400">{tokenBalanceDiff}</p>
					<p className="text-sm text-gray-400">{tokenBalanceActual} (actual)</p>
				</div>
			)}
		</>
	);
}

interface TokenBalancesProps {
	alice: KeyringPair | undefined;
	bob: KeyringPair | undefined;
	aliceSigner: Wallet | undefined;
	xrpToken: Contract | undefined;
	feeToken: Contract | undefined;
}

const useGetTokenBalances = ({
	alice,
	bob,
	aliceSigner,
	xrpToken,
	feeToken,
}: TokenBalancesProps) => {
	const [xrpBalance, setXrpBalance] = useState(0);
	const [tokenBalance, setTokenBalance] = useState<any>();
	const [feeData, setFeeData] = useState<any>();

	const getTokenBalances = useCallback(async () => {
		// get initial token balances
		const [xrpBalance, tokenBalance, feeData] = await Promise.all([
			xrpToken?.balanceOf(alice?.address),
			feeToken?.balanceOf(alice?.address),
			aliceSigner?.provider.getFeeData(),
		]);

		console.log("feeData:", {
			gasPrice: feeData?.gasPrice?.toNumber(),
			maxFeePerGas: feeData?.maxFeePerGas?.toNumber(),
			lastBaseFeePerGas: feeData?.lastBaseFeePerGas?.toNumber(),
			maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas?.toNumber(),
		});
		setXrpBalance(xrpBalance);
		setTokenBalance(tokenBalance);
		setFeeData(feeData);
	}, [xrpToken, feeToken, alice, aliceSigner]);

	useEffect(() => {
		getTokenBalances();
	}, [alice, bob, aliceSigner, xrpToken, feeToken, getTokenBalances]);

	return { xrpBalance, tokenBalance, feeData };
};
