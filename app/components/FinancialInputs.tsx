import type React from "react";
import {
	Box,
	Flex,
	Text,
	TextField,
	Heading,
	Card,
	RadioGroup,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

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
};

const formatNumberWithCommas = (value: string) => {
	const numericValue = value.replace(/[^0-9]/g, "");
	return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const FinancialInputs: React.FC<FinancialInputsProps> = ({
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
}) => {
	const { t } = useTranslation();

	const handleLoanJPYChange = (value: string) => {
		const amount = Number(value.replace(/,/g, ""));
		setLoanAmountJPY(amount);
		setLoanAmountForeign(Number((amount / exchangeRate).toFixed(2)));
	};

	const handleLoanForeignChange = (value: string) => {
		const amount = Number(value.replace(/,/g, ""));
		setLoanAmountForeign(amount);
		setLoanAmountJPY(Number((amount * exchangeRate).toFixed(0)));
	};

	const handleCurrencyChange = (value: string) => {
		setForeignCurrency(value);
		setExchangeRate(value === "USD" ? 160 : 173);
	};

	return (
		<Card style={{ width: "100%", position: "sticky", top: "20px" }}>
			<Flex direction="column" gap="4">
				<Box>
					<Heading size="3" mb="3">
						{t("financialInputs.title")}
					</Heading>
					<Flex direction="column" gap="2">
						<Box>
							<Text as="label" size="1" weight="bold">
								{t("financialInputs.yearlyIncome")}
							</Text>
							<TextField.Root
								size="1"
								value={formatNumberWithCommas(yearlyIncome.toString())}
								onChange={(e) =>
									setYearlyIncome(Number(e.target.value.replace(/,/g, "")))
								}
							/>
						</Box>
						<Box>
							<Text as="label" size="1" weight="bold">
								{t("financialInputs.btcPurchasePrice", {
									currency: foreignCurrency,
								})}
							</Text>
							<TextField.Root
								size="1"
								value={formatNumberWithCommas(btcPurchasePrice.toString())}
								onChange={(e) =>
									setBtcPurchasePrice(Number(e.target.value.replace(/,/g, "")))
								}
							/>
						</Box>
						<Box>
							<Text as="label" size="1" weight="bold">
								{t("financialInputs.btcSalePrice", {
									currency: foreignCurrency,
								})}
							</Text>
							<TextField.Root
								size="1"
								value={formatNumberWithCommas(btcSalePrice.toString())}
								onChange={(e) =>
									setBtcSalePrice(Number(e.target.value.replace(/,/g, "")))
								}
							/>
						</Box>
						<Box>
							<Text as="label" size="1" weight="bold">
								{t("financialInputs.loanAmountJPY")}
							</Text>
							<TextField.Root
								size="1"
								value={formatNumberWithCommas(loanAmountJPY.toString())}
								onChange={(e) => handleLoanJPYChange(e.target.value)}
							/>
						</Box>
						<Box>
							<Text as="label" size="1" weight="bold">
								{t("financialInputs.loanAmountForeign", {
									currency: foreignCurrency,
								})}
							</Text>
							<TextField.Root
								size="1"
								value={formatNumberWithCommas(loanAmountForeign.toString())}
								onChange={(e) => handleLoanForeignChange(e.target.value)}
							/>
						</Box>
					</Flex>
				</Box>

				<Box>
					<Heading size="3" mb="3">
						{t("currencySettings.title")}
					</Heading>
					<Flex direction="column" gap="2">
						<RadioGroup.Root
							value={foreignCurrency}
							onValueChange={handleCurrencyChange}
						>
							<Flex gap="2">
								<Text as="label" size="2">
									<Flex gap="2">
										<RadioGroup.Item value="USD" /> USD
									</Flex>
								</Text>
								<Text as="label" size="2">
									<Flex gap="2">
										<RadioGroup.Item value="EUR" /> EUR
									</Flex>
								</Text>
							</Flex>
						</RadioGroup.Root>
						<Flex align="center" gap="2">
							<Text size="2">
								{t("currencySettings.exchangeRate", {
									currency: foreignCurrency,
								})}
							</Text>
							<TextField.Root
								type="number"
								value={exchangeRate}
								onChange={(e) => setExchangeRate(Number(e.target.value))}
								style={{ width: "80px" }}
							/>
							<Text size="2">JPY</Text>
						</Flex>
					</Flex>
				</Box>
			</Flex>
		</Card>
	);
};

export default FinancialInputs;
