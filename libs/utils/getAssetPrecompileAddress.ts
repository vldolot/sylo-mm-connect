export const getAssetPrecompileAddress = (assetId: number) => {
	const assetIdHex = assetId.toString(16).padStart(8, "0");
	return `0xCCCCCCCC${assetIdHex}000000000000000000000000`;
};
