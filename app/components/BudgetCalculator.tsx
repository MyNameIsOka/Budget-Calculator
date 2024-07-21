import type {
	CombinedData,
	Expense,
	ExpenseItems,
	TaxBreakdownItem,
	CustomExpenseTitles,
} from "~/types";
import {
	Box,
	Container,
	Flex,
	Heading,
	Section,
	Separator,
	Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import ExpenseInput from "./ExpenseInput";
import ExpenseDistribution from "./ExpenseDistribution";
import FinancialInputs from "./FinancialInputs";
import Summary from "./Summary";
import BitcoinInfoBox from "./BitcoinInfoBox";
import TaxBreakdown from "./TaxBreakdown";
import LanguageSettings from "./LanguageSettings";
import { calculateTax } from "~/utils/calculations";
import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { getExchangeRates } from "~/utils/exchangeRate";

type BudgetCalculatorProps = {
	data: CombinedData;
	expenseItems: ExpenseItems;
};

export default function BudgetCalculator({
	data,
	expenseItems: initialExpenseItems,
}: BudgetCalculatorProps) {
	const isBrowser = typeof window !== "undefined";
	const { t } = useTranslation();

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
	const [expenseItems, setExpenseItems] = useState<ExpenseItems>(
		getInitialState("expenseItems", initialExpenseItems),
	);

	const [customExpenseTitles, setCustomExpenseTitles] =
		useState<CustomExpenseTitles>(getInitialState("customExpenseTitles", {}));
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

	useEffect(() => {
		const fetchInitialExchangeRate = async () => {
			try {
				const rates = await getExchangeRates();
				setExchangeRate(rates[foreignCurrency as keyof typeof rates]);
			} catch (error) {
				console.error("Failed to fetch initial exchange rate:", error);
			}
		};

		fetchInitialExchangeRate();
	}, [foreignCurrency]);

	useEffect(() => {
		if (isBrowser) {
			localStorage.setItem("expenses", JSON.stringify(expenses));
			localStorage.setItem("expenseItems", JSON.stringify(expenseItems));
			localStorage.setItem(
				"customExpenseTitles",
				JSON.stringify(customExpenseTitles),
			);
			localStorage.setItem(
				"btcPurchasePrice",
				JSON.stringify(btcPurchasePrice),
			);
			localStorage.setItem("btcSalePrice", JSON.stringify(btcSalePrice));
			localStorage.setItem("yearlyIncome", JSON.stringify(yearlyIncome));
			localStorage.setItem("totalExpenses", JSON.stringify(totalExpenses));
			localStorage.setItem("taxAmount", JSON.stringify(taxAmount));
			localStorage.setItem("taxBreakdown", JSON.stringify(taxBreakdown));
			localStorage.setItem("startingBracket", JSON.stringify(startingBracket));
			localStorage.setItem("exchangeRate", JSON.stringify(exchangeRate));
			localStorage.setItem("foreignCurrency", JSON.stringify(foreignCurrency));
			localStorage.setItem("loanAmountJPY", JSON.stringify(loanAmountJPY));
			localStorage.setItem(
				"loanAmountForeign",
				JSON.stringify(loanAmountForeign),
			);
		}
	}, [
		expenses,
		expenseItems,
		customExpenseTitles,
		btcPurchasePrice,
		btcSalePrice,
		yearlyIncome,
		totalExpenses,
		taxAmount,
		taxBreakdown,
		startingBracket,
		exchangeRate,
		foreignCurrency,
		loanAmountJPY,
		loanAmountForeign,
		isBrowser,
	]);

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

		const { totalTax, breakdown, startingBracket } = calculateTax(
			gain,
			yearlyIncome,
		);
		const municipalTax = gain * 0.1;
		const totalTaxAmount = totalTax + municipalTax;

		setTaxAmount(totalTaxAmount);
		setTaxBreakdown(breakdown);
		setStartingBracket(startingBracket);
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

	const handleAddExpense = (newExpense: {
		title: { en: string; ja: string };
		items: Array<{ en: string; ja: string }>;
	}) => {
		const key = newExpense.title.en.toLowerCase().replace(/\s+/g, "_");
		setExpenses((prev) => ({ ...prev, [key]: 0 }));
		setExpenseItems((prev) => ({ ...prev, [key]: newExpense.items }));
		setCustomExpenseTitles((prev) => ({ ...prev, [key]: newExpense.title }));
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
								{t("title")}
							</Heading>
							<Text size="5" style={{ color: "var(--blue-1)" }}>
								{t("subtitle", { currency: foreignCurrency })}
							</Text>
						</Box>

						<Form method="post">
							<input
								type="hidden"
								name="expenses"
								value={JSON.stringify(expenses)}
							/>
							<Flex gap="6">
								<Box style={{ width: "300px", flexShrink: 0 }}>
									<Flex
										direction="column"
										gap="4"
										style={{ position: "sticky", top: "20px" }}
									>
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
											setForeignCurrency={setForeignCurrency}
											exchangeRate={exchangeRate}
											setExchangeRate={setExchangeRate}
										/>
										<LanguageSettings />
									</Flex>
								</Box>
								<Box style={{ flexGrow: 1 }}>
									<ExpenseInput
										expenses={expenses}
										expenseItems={expenseItems}
										customExpenseTitles={customExpenseTitles}
										handleExpenseChange={handleExpenseChange}
										exchangeRate={exchangeRate}
										foreignCurrency={foreignCurrency}
										onAddExpense={handleAddExpense}
									/>
									<Separator size="4" my="6" />
									<ExpenseDistribution
										expenses={expenses}
										customExpenseTitles={customExpenseTitles}
									/>

									<Separator size="4" my="6" />

									<Summary
										totalExpenses={totalExpenses}
										loanAmountJPY={loanAmountJPY}
										btcSalePrice={btcSalePrice}
										exchangeRate={exchangeRate}
										foreignCurrency={foreignCurrency}
										taxAmount={taxAmount}
									/>

									<Separator size="4" my="6" />

									<BitcoinInfoBox
										totalExpenses={totalExpenses}
										taxAmount={taxAmount}
										btcSalePrice={btcSalePrice}
										btcPurchasePrice={btcPurchasePrice}
										exchangeRate={exchangeRate}
										foreignCurrency={foreignCurrency}
										loanAmountJPY={loanAmountJPY}
									/>

									<Separator size="4" my="6" />

									<TaxBreakdown
										taxBreakdown={taxBreakdown}
										taxAmount={taxAmount}
										startingBracket={startingBracket}
										exchangeRate={exchangeRate}
										foreignCurrency={foreignCurrency}
									/>
								</Box>
							</Flex>
						</Form>
					</Flex>
				</Container>
			</Section>
		</Box>
	);
}
