import clsx from "clsx";
import { ButtonHTMLAttributes, FC } from "react";

import { LoadingIndicator } from "@/components";

import CheckCircleIcon from "./icons/CheckCircleIcon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	disabled?: boolean;
	buttonClassName?: string;
	variant: "small" | "large";
	func?: any;
	children?: any;
	loadingText?: string;
	showConcludedIcon?: boolean;
	concludedText?: string;
	enableHoverColor?: boolean;
	hoverBgColor?: string;
}

const Button: FC<ButtonProps> = ({
	disabled = false,
	func,
	children,
	isLoading,
	loadingText = "Loading",
	showConcludedIcon,
	concludedText = "Done",
	buttonClassName,
	variant = "large",
	enableHoverColor = true,
	hoverBgColor = "hover:bg-indigo-700",
}) => {
	const loader = (
		<div className="flex items-center justify-center">
			<LoadingIndicator />
			<span className="ml-2">{loadingText}</span>
		</div>
	);

	const showConcluded = (
		<div className="flex items-center justify-center">
			<CheckCircleIcon iconClassName="inline h-4 w-4 text-green-500" />
			<span className="ml-2">{concludedText}</span>
		</div>
	);

	return (
		<button
			type="button"
			className={clsx(
				"mx-auto items-center border border-blue font-medium focus:outline-none disabled:pointer-events-none disabled:opacity-50",
				{
					small:
						"w-[145px] bg-blue-dark px-[16px] py-[10px] text-nav text-white shadow-sm",
					large:
						"w-full bg-black p-[16px] text-sm text-blue hover:text-white disabled:border-off-white disabled:text-white",
				}[variant],
				buttonClassName,
				enableHoverColor && hoverBgColor
			)}
			onClick={func}
			disabled={disabled}
		>
			{isLoading ? loader : showConcludedIcon ? showConcluded : <>{children}</>}
		</button>
	);
};

export default Button;
