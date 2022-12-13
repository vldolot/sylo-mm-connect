import web3 from "web3";

export const assetIdToERC20ContractAddress = (
	assetId: string | Number
): string => {
	const asset_id_hex = (+assetId).toString(16).padStart(8, "0");
	return web3.utils.toChecksumAddress(
		`0xCCCCCCCC${asset_id_hex}000000000000000000000000`
	);
};
