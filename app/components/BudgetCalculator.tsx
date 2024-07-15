import type React from "react";
import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Flex,
	Heading,
	Section,
	Separator,
	Text,
} from "@radix-ui/themes";
import ExpenseInput from "./ExpenseInput";
import ExpenseDistribution from "./ExpenseDistribution";
import FinancialInputs from "./FinancialInputs";
import Summary from "./Summary";
import BitcoinInfoBox from "./BitcoinInfoBox";
import TaxBreakdown from "./TaxBreakdown";
import FloatingCurrencySettings from "./FloatingCurrencySettings";
import { calculateTax } from "~/utils/calculations";
import type { Expense, TaxBreakdownItem } from "~/types";
import { initialExpenses, expenseItems } from "~/data/expenseData";

const BudgetCalculator: React.FC = () => {
	const [expenses, setExpenses] = useState<Expense>(initialExpenses);
	const [btcPurchasePrice, setBtcPurchasePrice] = useState<number>(10000);
	const [btcSalePrice, setBtcSalePrice] = useState<number>(50000);
	const [yearlyIncome, setYearlyIncome] = useState<number>(0);
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [taxAmount, setTaxAmount] = useState<number>(0);
	const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdownItem[]>([]);
	const [startingBracket, setStartingBracket] = useState<string>("");
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [exchangeRate, setExchangeRate] = useState<number>(160);
	const [foreignCurrency, setForeignCurrency] = useState<string>("USD");

	useEffect(() => {
		const monthlyTotal = Object.values(expenses).reduce(
			(sum, value) => sum + value,
			0,
		);
		const yearlyTotal = monthlyTotal * 12;
		const fiveYearTotal = yearlyTotal * 5;

		setTotalExpenses(fiveYearTotal);

		const btcNeeded = fiveYearTotal / (btcSalePrice * exchangeRate);
		const realizedGain =
			(btcSalePrice - btcPurchasePrice) * btcNeeded * exchangeRate;
		const {
			totalTax,
			breakdown,
			startingBracket: bracket,
		} = calculateTax(realizedGain, yearlyIncome);
		const municipalTax = realizedGain * 0.1;
		const totalTaxAmount = totalTax + municipalTax;

		setTaxAmount(totalTaxAmount);
		setTaxBreakdown(breakdown);
		setStartingBracket(bracket);
		setTotalAmount(fiveYearTotal + totalTaxAmount);
	}, [expenses, btcPurchasePrice, btcSalePrice, yearlyIncome, exchangeRate]);

	const handleExpenseChange = (key: string, value: number) => {
		setExpenses((prev) => ({ ...prev, [key]: value }));
	};

	const handleCurrencyChange = (value: string) => {
		setForeignCurrency(value);
		setExchangeRate(value === "USD" ? 160 : 173);
	};

	const handleExchangeRateChange = (value: number) => {
		setExchangeRate(value);
	};

	return (
		<Box>
			<Section size="3">
				<Container size="4">
					<Flex direction="column" gap="6">
						<Box
							style={{
								backgroundColor: "var(--blue-9)",
								padding: "1rem",
								borderRadius: "var(--radius-3)",
							}}
						>
							<Heading size="8" mb="2" style={{ color: "white" }}>
								5-Year Budget Calculator for Japan
							</Heading>
							<Text size="5" style={{ color: "var(--blue-1)" }}>
								with Bitcoin Tax and {foreignCurrency} Conversion
							</Text>
						</Box>

						<FinancialInputs
							yearlyIncome={yearlyIncome}
							setYearlyIncome={setYearlyIncome}
							btcPurchasePrice={btcPurchasePrice}
							setBtcPurchasePrice={setBtcPurchasePrice}
							btcSalePrice={btcSalePrice}
							setBtcSalePrice={setBtcSalePrice}
							foreignCurrency={foreignCurrency}
						/>

						<ExpenseInput
							expenses={expenses}
							expenseItems={expenseItems}
							handleExpenseChange={handleExpenseChange}
							exchangeRate={exchangeRate}
							foreignCurrency={foreignCurrency}
						/>

						<Separator size="4" />

						<ExpenseDistribution expenses={expenses} />

						<Separator size="4" />

						<Summary
							totalExpenses={totalExpenses}
							taxAmount={taxAmount}
							totalAmount={totalAmount}
							exchangeRate={exchangeRate}
							foreignCurrency={foreignCurrency}
						/>

						<BitcoinInfoBox
							totalExpenses={totalExpenses}
							taxAmount={taxAmount}
							btcSalePrice={btcSalePrice}
							btcPurchasePrice={btcPurchasePrice}
							exchangeRate={exchangeRate}
							foreignCurrency={foreignCurrency}
						/>

						<Separator size="4" />

						<TaxBreakdown
							taxBreakdown={taxBreakdown}
							taxAmount={taxAmount}
							startingBracket={startingBracket}
						/>

						<FloatingCurrencySettings
							foreignCurrency={foreignCurrency}
							exchangeRate={exchangeRate}
							onCurrencyChange={handleCurrencyChange}
							onExchangeRateChange={handleExchangeRateChange}
						/>
					</Flex>
				</Container>
			</Section>
		</Box>
	);
};

export default BudgetCalculator;
