import { useEffect, useRef, useState } from "react";
import {
	Box,
	Flex,
	Text,
	TextField,
	Heading,
	Card,
	RadioGroup,
	Button,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { getExchangeRates } from "~/utils/exchangeRate";
import { ExplanationTooltip } from "./ExplanationTooltip";
import CurrencySettings from "./CurrencySettings";
import BestLoanCalculatorModal from "./BestLoanCalculatorModal";

type FinancialInputsProps = {
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
	totalExpenses: number;
	timeFrame: number;
};

const formatAmount = (amount: number): string => {
	return amount.toLocaleString();
};

export default function FinancialInputs({
	yearlyIncome,
	setYearlyIncome,
	btcPurchasePrice,
	setBtcPurchasePrice,
	btcSalePrice,
	setBtcSalePrice,
	loanAmountJPY,
	setLoanAmountJPY,
	loanAmountForeign,
	setLoanAmountForeign,
	foreignCurrency,
	setForeignCurrency,
	exchangeRate,
	setExchangeRate,
	totalExpenses,
	timeFrame,
}: FinancialInputsProps) {
	const { t } = useTranslation();
	const [isLoanCalculatorOpen, setIsLoanCalculatorOpen] = useState(false);

	const [loading, setLoading] = useState(false);
	const [yearlyIncomeForeign, setYearlyIncomeForeign] = useState(
		Math.round(yearlyIncome / exchangeRate),
	);
	const prevCurrency = useRef(foreignCurrency);
	const prevExchangeRate = useRef(exchangeRate);

	useEffect(() => {
		const fetchExchangeRates = async () => {
			setLoading(true);
			try {
				const rates = await getExchangeRates();
				const newRate = rates[foreignCurrency as keyof typeof rates];
				setExchangeRate(newRate);

				// Update foreign currency amounts
				setYearlyIncomeForeign(Math.round(yearlyIncome / newRate));
				setLoanAmountForeign(Math.round(loanAmountJPY / newRate));

				// Convert BTC prices if currency changed
				if (prevCurrency.current !== foreignCurrency) {
					const conversionFactor = prevExchangeRate.current / newRate;
					setBtcPurchasePrice(Math.round(btcPurchasePrice * conversionFactor));
					setBtcSalePrice(Math.round(btcSalePrice * conversionFactor));
				}

				prevCurrency.current = foreignCurrency;
				prevExchangeRate.current = newRate;
			} catch (error) {
				console.error("Failed to fetch exchange rates:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchExchangeRates();
	}, [
		foreignCurrency,
		setExchangeRate,
		yearlyIncome,
		setLoanAmountForeign,
		loanAmountJPY,
		btcPurchasePrice,
		setBtcPurchasePrice,
		btcSalePrice,
		setBtcSalePrice,
	]);

	const handleInputChange = (
		value: string,
		setter: (value: number) => void,
	) => {
		const numericValue = value === "" ? 0 : Number(value.replace(/[^\d]/g, ""));
		setter(numericValue);
	};

	const handleYearlyIncomeJPYChange = (value: string) => {
		const amount = value === "" ? 0 : Number(value.replace(/[^\d]/g, ""));
		setYearlyIncome(amount);
		setYearlyIncomeForeign(Math.round(amount / exchangeRate));
	};

	const handleYearlyIncomeForeignChange = (value: string) => {
		const amount = value === "" ? 0 : Number(value.replace(/[^\d]/g, ""));
		setYearlyIncomeForeign(amount);
		setYearlyIncome(Math.round(amount * exchangeRate));
	};

	const handleLoanJPYChange = (value: string) => {
		const amount = value === "" ? 0 : Number(value.replace(/[^\d]/g, ""));
		setLoanAmountJPY(amount);
		setLoanAmountForeign(Math.round(amount / exchangeRate));
	};

	const handleLoanForeignChange = (value: string) => {
		const amount = value === "" ? 0 : Number(value.replace(/[^\d]/g, ""));
		setLoanAmountForeign(amount);
		setLoanAmountJPY(Math.round(amount * exchangeRate));
	};

	const getCurrencySymbol = (currency: string) => {
		return currency === "USD" ? "$" : "€";
	};

	return (
		<Card className="w-full">
			<Flex direction="column" gap="4">
				<Box>
					<Flex direction="column" gap="2">
						<Box>
							<Text as="label" size="2" weight="bold" mb="1">
								{t("financialInputs.yearlyIncome")}
							</Text>
							<ExplanationTooltip
								explanation={t("financialInputs.explanationYearlyIncome")}
							/>
							<Flex gap="2">
								<Flex direction="column" style={{ flex: 1 }}>
									<Text size="1" mb="1">
										JPY
									</Text>
									<TextField.Root
										size="2"
										value={yearlyIncome === 0 ? "" : formatAmount(yearlyIncome)}
										onChange={(e) =>
											handleYearlyIncomeJPYChange(e.target.value)
										}
									>
										<TextField.Slot>¥</TextField.Slot>
									</TextField.Root>
								</Flex>
								<Flex direction="column" style={{ flex: 1 }}>
									<Text size="1" mb="1">
										{foreignCurrency}
									</Text>
									<TextField.Root
										size="2"
										value={
											yearlyIncomeForeign === 0
												? ""
												: formatAmount(yearlyIncomeForeign)
										}
										onChange={(e) =>
											handleYearlyIncomeForeignChange(e.target.value)
										}
									>
										<TextField.Slot>
											{getCurrencySymbol(foreignCurrency)}
										</TextField.Slot>
									</TextField.Root>
								</Flex>
							</Flex>
						</Box>
						<Box>
							<Text as="label" size="2" weight="bold">
								{t("financialInputs.btcPurchasePrice", {
									currency: foreignCurrency,
								})}
							</Text>
							<ExplanationTooltip
								explanation={t("financialInputs.explanationBtcPurchasePrice")}
							/>

							<TextField.Root
								size="2"
								value={
									btcPurchasePrice === 0 ? "" : formatAmount(btcPurchasePrice)
								}
								onChange={(e) =>
									handleInputChange(e.target.value, setBtcPurchasePrice)
								}
							>
								<TextField.Slot>
									{getCurrencySymbol(foreignCurrency)}
								</TextField.Slot>
							</TextField.Root>
						</Box>
						<Box>
							<Text as="label" size="2" weight="bold">
								{t("financialInputs.btcSalePrice", {
									currency: foreignCurrency,
								})}
							</Text>
							<ExplanationTooltip
								explanation={t("financialInputs.explanationBtcSalePrice")}
							/>

							<TextField.Root
								size="2"
								value={btcSalePrice === 0 ? "" : formatAmount(btcSalePrice)}
								onChange={(e) =>
									handleInputChange(e.target.value, setBtcSalePrice)
								}
							>
								<TextField.Slot>
									{getCurrencySymbol(foreignCurrency)}
								</TextField.Slot>
							</TextField.Root>
						</Box>
						<Box>
							<Text as="label" size="2" weight="bold" mb="1">
								{t("financialInputs.loanAmount")}
							</Text>
							<ExplanationTooltip
								explanation={t("financialInputs.explanationLoanAmount")}
							/>
							<Flex gap="2">
								<Flex direction="column" style={{ flex: 1 }}>
									<Text size="1" mb="1">
										JPY
									</Text>
									<TextField.Root
										size="2"
										value={
											loanAmountJPY === 0 ? "" : formatAmount(loanAmountJPY)
										}
										onChange={(e) => handleLoanJPYChange(e.target.value)}
									>
										<TextField.Slot>¥</TextField.Slot>
									</TextField.Root>
								</Flex>
								<Flex direction="column" style={{ flex: 1 }}>
									<Text size="1" mb="1">
										{foreignCurrency}
									</Text>
									<TextField.Root
										size="2"
										value={
											loanAmountForeign === 0
												? ""
												: formatAmount(loanAmountForeign)
										}
										onChange={(e) => handleLoanForeignChange(e.target.value)}
									>
										<TextField.Slot>
											{getCurrencySymbol(foreignCurrency)}
										</TextField.Slot>
									</TextField.Root>
								</Flex>
							</Flex>
							<Button
								onClick={() => setIsLoanCalculatorOpen(true)}
								size="2"
								variant="soft"
								mt="2"
								className="w-full"
							>
								{t("financialInputs.calculateBestLoan")}
							</Button>
						</Box>
					</Flex>
				</Box>

				{/* Currency Settings */}
				<CurrencySettings
					foreignCurrency={foreignCurrency}
					exchangeRate={exchangeRate}
					setForeignCurrency={setForeignCurrency}
				/>
			</Flex>

			<BestLoanCalculatorModal
				open={isLoanCalculatorOpen}
				onOpenChange={setIsLoanCalculatorOpen}
				totalExpenses={totalExpenses}
				btcSalePrice={btcSalePrice}
				btcPurchasePrice={btcPurchasePrice}
				exchangeRate={exchangeRate}
				yearlyIncome={yearlyIncome}
				timeFrame={timeFrame}
				foreignCurrency={foreignCurrency}
			/>
		</Card>
	);
}
