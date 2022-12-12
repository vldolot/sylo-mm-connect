import { utils as ethers } from "ethers";

export const formatBalance = (balance = 0, decimals: number) => {
	const [beforeDec, afterDec] = ethers
		.formatUnits(balance, decimals)
		.split(".");

	return `${beforeDec}.${afterDec.padEnd(decimals, "0")}`;
};
