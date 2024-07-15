import type React from "react";
import { useState, useEffect } from "react";
import { styled } from "@stitches/react";
import ExpenseInput from "./ExpenseInput";
import ExpenseDistribution from "./ExpenseDistribution";
import BitcoinPrices from "./BitcoinPrices";
import Summary from "./Summary";
import BitcoinInfoBox from "./BitcoinInfoBox";
import TaxBreakdown from "./TaxBreakdown";
import FloatingCurrencySettings from "./FloatingCurrencySettings";
import { calculateTax } from "~/utils/calculations";
import type { Expense, TaxBreakdownItem } from "~/types";
import { initialExpenses, expenseItems } from "~/data/expenseData";

const Card = styled("div", {
	width: "100%",
	maxWidth: "64rem",
	margin: "0 auto",
	backgroundColor: "#f0f8ff",
	color: "#333",
	borderRadius: "0.5rem",
	boxShadow:
		"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
	overflow: "hidden",
});

const CardHeader = styled("div", {
	background: "linear-gradient(45deg, #3498db 30%, #2980b9 90%)",
	padding: "20px",
	color: "white",
	marginBottom: "20px",
});

const CardContent = styled("div", {
	padding: "1.5rem",
});

const StyledSeparator = styled("hr", {
	height: "2px",
	backgroundColor: "#3498db",
	margin: "2rem 0",
	border: "none",
});

const BudgetCalculator: React.FC = () => {
	const [expenses, setExpenses] = useState<Expense>(initialExpenses);
	const [btcPurchasePrice, setBtcPurchasePrice] = useState<number>(10000);
	const [btcSalePrice, setBtcSalePrice] = useState<number>(50000);
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [taxAmount, setTaxAmount] = useState<number>(0);
	const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdownItem[]>([]);
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
		const { totalTax, breakdown } = calculateTax(realizedGain);
		const municipalTax = realizedGain * 0.1;
		const totalTaxAmount = totalTax + municipalTax;

		setTaxAmount(totalTaxAmount);
		setTaxBreakdown(breakdown);
		setTotalAmount(fiveYearTotal + totalTaxAmount);
	}, [expenses, btcPurchasePrice, btcSalePrice, exchangeRate]);

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
		<Card>
			<CardHeader>
				<h1>5-Year Budget Calculator for Japan</h1>
				<p>with Bitcoin Tax and {foreignCurrency} Conversion</p>
			</CardHeader>
			<CardContent>
				<h2>Monthly Expenses</h2>
				<ExpenseInput
					expenses={expenses}
					expenseItems={expenseItems}
					handleExpenseChange={handleExpenseChange}
					exchangeRate={exchangeRate}
					foreignCurrency={foreignCurrency}
				/>

				<StyledSeparator />

				<ExpenseDistribution expenses={expenses} />

				<StyledSeparator />

				<BitcoinPrices
					btcPurchasePrice={btcPurchasePrice}
					btcSalePrice={btcSalePrice}
					setBtcPurchasePrice={setBtcPurchasePrice}
					setBtcSalePrice={setBtcSalePrice}
					foreignCurrency={foreignCurrency}
				/>

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

				<StyledSeparator />

				<TaxBreakdown taxBreakdown={taxBreakdown} taxAmount={taxAmount} />

				<FloatingCurrencySettings
					foreignCurrency={foreignCurrency}
					exchangeRate={exchangeRate}
					onCurrencyChange={handleCurrencyChange}
					onExchangeRateChange={handleExchangeRateChange}
				/>
			</CardContent>
		</Card>
	);
};

export default BudgetCalculator;
