import type React from "react";
import { useCallback } from "react";
import { Flex, Button, Box, Heading, Text, TextField } from "@radix-ui/themes";
import { Cross2Icon, GearIcon } from "@radix-ui/react-icons";
import FinancialInputs from "./FinancialInputs";
import { useTranslation } from "react-i18next";
import { ExplanationTooltip } from "./ExplanationTooltip";

type SettingsDrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	yearlyIncome: number;
	setYearlyIncome: (income: number) => void;
	btcPurchasePrice: number;
	setBtcPurchasePrice: (price: number) => void;
	btcSalePrice: number;
	setBtcSalePrice: (price: number) => void;
	loanAmountJPY: number;
	setLoanAmountJPY: (amount: number) => void;
	loanAmountForeign: number;
	setLoanAmountForeign: (amount: number) => void;
	foreignCurrency: string;
	setForeignCurrency: (currency: string) => void;
	exchangeRate: number;
	setExchangeRate: (rate: number) => void;
	timeFrame: number;
	setTimeFrame: (years: number) => void;
	onReset: () => void;
	children: React.ReactNode;
};

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
	isOpen,
	onClose,
	children,
	timeFrame,
	setTimeFrame,
	...props
}) => {
	const { t } = useTranslation();

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		},
		[onClose],
	);

	return (
		<Box
			className={`fixed inset-0 z-50 ${
				isOpen ? "pointer-events-auto" : "pointer-events-none"
			}`}
			aria-hidden={!isOpen}
		>
			<Box
				className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
					isOpen ? "opacity-50" : "opacity-0"
				}`}
				onClick={onClose}
				onKeyDown={handleKeyDown}
				tabIndex={isOpen ? 0 : -1}
				role="button"
				aria-label="Close settings"
			/>
			<Box
				className={`absolute top-0 left-0 h-full w-80 bg-gray-100 shadow-lg transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
				role="dialog"
				aria-modal="true"
				aria-label="Settings"
			>
				<Flex
					direction="column"
					gap="3"
					p="4"
					style={{ height: "100%", overflowY: "auto" }}
				>
					<Flex justify="between" align="center" mb="4">
						<Flex align="center" gap="2">
							<GearIcon />
							<Heading size="3">{t("settings.title")}</Heading>
						</Flex>
						<Button variant="ghost" onClick={onClose}>
							<Cross2Icon />
						</Button>
					</Flex>
					<Box>
						<Text as="label" size="2" weight="bold">
							{t("timeFrame.label")}
						</Text>{" "}
						<ExplanationTooltip explanation={t("timeFrame.explanation")} />
						<TextField.Root
							size="2"
							value={timeFrame.toString()}
							onChange={(e) => setTimeFrame(Number(e.target.value))}
						/>
					</Box>
					<FinancialInputs {...props} />
					{children}
				</Flex>
			</Box>
		</Box>
	);
};

export default SettingsDrawer;
