import type { CombinedData, Expense, TaxBreakdownItem } from "~/types";
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
import { useEffect, useState } from "react";
import { Form } from "@remix-run/react";

type BudgetCalculatorProps = {
	data: CombinedData;
	expenseItems: Expense[]; // Update this to the appropriate type if available
};

export default function BudgetCalculator({
	data,
	expenseItems,
}: BudgetCalculatorProps) {
	const isBrowser = typeof window !== "undefined";

	const getInitialState = (key: string, fallback: any) => {
		if (isBrowser) {
			const storedValue = localStorage.getItem(key);
			return storedValue !== null ? JSON.parse(storedValue) : fallback;
		}
		return fallback;
	};

	const [expenses, setExpenses] = useState<Expense>(
		getInitialState("expenses", data.expenses),
	);
	const [btcPurchasePrice, setBtcPurchasePrice] = useState<number>(
		getInitialState("btcPurchasePrice", data.btcPurchasePrice),
	);
	const [btcSalePrice, setBtcSalePrice] = useState<number>(
		getInitialState("btcSalePrice", data.btcSalePrice),
	);
	const [yearlyIncome, setYearlyIncome] = useState<number>(
		getInitialState("yearlyIncome", data.yearlyIncome),
	);
	const [totalExpenses, setTotalExpenses] = useState<number>(
		getInitialState("totalExpenses", data.totalExpenses || 0),
	);
	const [taxAmount, setTaxAmount] = useState<number>(
		getInitialState("taxAmount", data.taxAmount || 0),
	);
	const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdownItem[]>(
		getInitialState("taxBreakdown", data.taxBreakdown || []),
	);
	const [startingBracket, setStartingBracket] = useState<string>(
		getInitialState("startingBracket", data.startingBracket || ""),
	);
	const [exchangeRate, setExchangeRate] = useState<number>(
		getInitialState("exchangeRate", data.exchangeRate),
	);
	const [foreignCurrency, setForeignCurrency] = useState<string>(
		getInitialState("foreignCurrency", data.foreignCurrency),
	);
	const [loanAmountJPY, setLoanAmountJPY] = useState<number>(
		getInitialState("loanAmountJPY", data.loanAmountJPY),
	);
	const [loanAmountForeign, setLoanAmountForeign] = useState<number>(
		getInitialState("loanAmountForeign", data.loanAmountForeign),
	);

	// Save state to localStorage whenever it changes (only in the browser)
	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("expenses", JSON.stringify(expenses));
		}
	}, [expenses, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem(
				"btcPurchasePrice",
				JSON.stringify(btcPurchasePrice),
			);
		}
	}, [btcPurchasePrice, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("btcSalePrice", JSON.stringify(btcSalePrice));
		}
	}, [btcSalePrice, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("yearlyIncome", JSON.stringify(yearlyIncome));
		}
	}, [yearlyIncome, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("totalExpenses", JSON.stringify(totalExpenses));
		}
	}, [totalExpenses, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("taxAmount", JSON.stringify(taxAmount));
		}
	}, [taxAmount, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("taxBreakdown", JSON.stringify(taxBreakdown));
		}
	}, [taxBreakdown, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("startingBracket", JSON.stringify(startingBracket));
		}
	}, [startingBracket, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("exchangeRate", JSON.stringify(exchangeRate));
		}
	}, [exchangeRate, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("foreignCurrency", JSON.stringify(foreignCurrency));
		}
	}, [foreignCurrency, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("loanAmountJPY", JSON.stringify(loanAmountJPY));
		}
	}, [loanAmountJPY, isBrowser]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem(
				"loanAmountForeign",
				JSON.stringify(loanAmountForeign),
			);
		}
	}, [loanAmountForeign, isBrowser]);

	useEffect(() => {
		const monthlyTotal = Object.values(expenses).reduce<number>(
			(sum, value) => sum + value,
			0,
		);
		const yearlyTotal = monthlyTotal * 12;
		const fiveYearTotal = yearlyTotal * 5;

		setTotalExpenses(fiveYearTotal);

		const amountToSell = fiveYearTotal - loanAmountJPY;
		const btcToSell = amountToSell / (btcSalePrice * exchangeRate);
		const gain = (btcSalePrice - btcPurchasePrice) * btcToSell * exchangeRate;

		const {
			totalTax,
			breakdown,
			startingBracket: bracket,
		} = calculateTax(gain, yearlyIncome);
		const municipalTax = gain * 0.1;
		const totalTaxAmount = totalTax + municipalTax;

		setTaxAmount(totalTaxAmount);
		setTaxBreakdown(breakdown);
		setStartingBracket(bracket);
	}, [
		expenses,
		btcPurchasePrice,
		btcSalePrice,
		yearlyIncome,
		exchangeRate,
		loanAmountJPY,
	]);

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

						<Form method="post">
							<input
								type="hidden"
								name="expenses"
								value={JSON.stringify(expenses)}
							/>
							<FinancialInputs
								yearlyIncome={yearlyIncome}
								setYearlyIncome={setYearlyIncome}
								btcPurchasePrice={btcPurchasePrice}
								setBtcPurchasePrice={setBtcPurchasePrice}
								btcSalePrice={btcSalePrice}
								setBtcSalePrice={setBtcSalePrice}
								loanAmountJPY={loanAmountJPY}
								setLoanAmountJPY={setLoanAmountJPY}
								loanAmountForeign={loanAmountForeign}
								setLoanAmountForeign={setLoanAmountForeign}
								foreignCurrency={foreignCurrency}
								exchangeRate={exchangeRate}
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
								loanAmountJPY={loanAmountJPY}
								btcSalePrice={btcSalePrice}
								exchangeRate={exchangeRate}
								foreignCurrency={foreignCurrency}
								taxAmount={taxAmount}
							/>

							<BitcoinInfoBox
								totalExpenses={totalExpenses}
								taxAmount={taxAmount}
								btcSalePrice={btcSalePrice}
								btcPurchasePrice={btcPurchasePrice}
								exchangeRate={exchangeRate}
								foreignCurrency={foreignCurrency}
								loanAmountJPY={loanAmountJPY}
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
						</Form>
					</Flex>
				</Container>
			</Section>
		</Box>
	);
}
