import type {
	CombinedData,
	Expense,
	ExpenseItems,
	TaxBreakdownItem,
	CustomExpenseTitles,
} from "~/types";
import {
	Box,
	Button,
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
import ResetButton from "./ResetButton";
import { ResetIcon } from "@radix-ui/react-icons";

type BudgetCalculatorProps = {
	data: CombinedData;
	expenseItems: ExpenseItems;
};

const EXCHANGE_RATE_CACHE_KEY = "exchangeRateCache";

export default function BudgetCalculator({
	data,
	expenseItems: initialExpenseItems,
}: BudgetCalculatorProps) {
	const isBrowser = typeof window !== "undefined";
	const { t } = useTranslation();

	const resetToInitialState = () => {
		setExpenses(data.expenses);
		setExpenseItems(initialExpenseItems);
		setCustomExpenseTitles({});
		setBtcPurchasePrice(data.btcPurchasePrice);
		setBtcSalePrice(data.btcSalePrice);
		setYearlyIncome(data.yearlyIncome);
		setTotalExpenses(data.totalExpenses || 0);
		setTaxAmount(data.taxAmount || 0);
		setTaxBreakdown(data.taxBreakdown || []);
		setStartingBracket(data.startingBracket || "");
		setExchangeRate(data.exchangeRate);
		setForeignCurrency(data.foreignCurrency);
		setLoanAmountJPY(data.loanAmountJPY);
		setLoanAmountForeign(data.loanAmountForeign);
		setRemovedExpenses([]);
		setDeactivatedExpenses([]);

		// Selectively clear localStorage
		if (isBrowser) {
			const exchangeRateCache = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);
			localStorage.clear();
			if (exchangeRateCache) {
				localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, exchangeRateCache);
			}
		}
	};

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
	const [removedExpenses, setRemovedExpenses] = useState<string[]>(
		getInitialState("removedExpenses", []),
	);
	const [deactivatedExpenses, setDeactivatedExpenses] = useState<string[]>(
		getInitialState("deactivatedExpenses", []),
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
			localStorage.setItem("removedExpenses", JSON.stringify(removedExpenses));
			localStorage.setItem(
				"deactivatedExpenses",
				JSON.stringify(deactivatedExpenses),
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
		removedExpenses,
		deactivatedExpenses,
		isBrowser,
	]);

	useEffect(() => {
		const activeExpenses = Object.fromEntries(
			Object.entries(expenses).filter(
				([key]) =>
					!removedExpenses.includes(key) && !deactivatedExpenses.includes(key),
			),
		);
		const monthlyTotal = Object.values(activeExpenses).reduce<number>(
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
		removedExpenses,
		deactivatedExpenses,
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
		setRemovedExpenses((prev) => prev.filter((item) => item !== key));
		setDeactivatedExpenses((prev) => prev.filter((item) => item !== key));
	};

	const handleRemoveExpense = (key: string) => {
		setRemovedExpenses((prev) => [...prev, key]);
	};

	const handleToggleExpense = (key: string) => {
		setDeactivatedExpenses((prev) =>
			prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
		);
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
											onReset={resetToInitialState}
										/>
										<LanguageSettings />
										<Button
											onClick={resetToInitialState}
											color="red"
											variant="soft"
										>
											<ResetIcon />
											{t("reset.button")}
										</Button>
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
										onRemoveExpense={handleRemoveExpense}
										removedExpenses={removedExpenses}
										deactivatedExpenses={deactivatedExpenses}
										onToggleExpense={handleToggleExpense}
									/>
									<Separator size="4" my="6" />
									<ExpenseDistribution
										expenses={Object.fromEntries(
											Object.entries(expenses).filter(
												([key]) =>
													!removedExpenses.includes(key) &&
													!deactivatedExpenses.includes(key),
											),
										)}
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
