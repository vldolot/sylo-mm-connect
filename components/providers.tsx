import { Web3ReactProvider } from "@web3-react/core";
import { FC, PropsWithChildren } from "react";
import React from "react";

import { metaMaskConnectors } from "@/libs/hooks";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
	return (
		<Web3ReactProvider connectors={[metaMaskConnectors]}>
			{children}
		</Web3ReactProvider>
	);
};
