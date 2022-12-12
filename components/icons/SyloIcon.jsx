import Image from "next/future/image";

import SYLOIcon from "./sylo-icon.png";

export default function SyloIcon() {
	return (
		<Image
			src={SYLOIcon}
			width={24}
			height={24}
			layout="raw"
			unoptimized
			priority
			alt="sylo icon"
		/>
	);
}
