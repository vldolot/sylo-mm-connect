import Head from "next/head";
import React from "react";

import { ConnectToWallet, Providers } from "@/components";
import { useRootApi } from "@/libs/hooks";
import "@/styles/globals.css";

const RootLayout = () => {
	useRootApi();
	return (
		<Providers>
			<div
				className="flex min-h-screen flex-col items-center space-y-[56px] bg-black"
				data-theme="light"
			>
				<Head>
					<title>SYLO Connect to MetaMask</title>
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
				</Head>

				<div className="w-full bg-black">
					<div className="flex flex-col justify-between">
						<div className="text-white">
							<ConnectToWallet />
						</div>
					</div>
				</div>
			</div>
		</Providers>
	);
};

export default RootLayout;
