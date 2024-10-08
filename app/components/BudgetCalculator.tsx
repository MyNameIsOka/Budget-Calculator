import type {
	Expense,
	ExpenseItems,
	CustomExpenseTitles,
	LoaderData,
	TaxResult,
} from "~/types";
import { Box, Flex, Text, Separator, Button, Heading } from "@radix-ui/themes";
import { useState, useEffect, useCallback } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import ExpenseInput from "./ExpenseInput";
import ExpenseDistribution from "./ExpenseDistribution";
import FinancialInputs from "./FinancialInputs";
import TimeFrameInput from "./TimeFrameInput";
import Summary from "./Summary";
import BitcoinInfoBox from "./BitcoinInfoBox";
import TaxBreakdown from "./TaxBreakdown";
import SettingsDrawer from "./SettingsDrawer";
import LanguageSettings from "./LanguageSettings";
import ResetButton from "./ResetButton";
import { calculateTax } from "~/utils/calculations";
import { useTranslation } from "react-i18next";
import { getExchangeRates } from "~/utils/exchangeRate";
import ContactNote from "./ContactNote";
import { useOutletContext } from "@remix-run/react";
import ThemeToggle from "./ThemeToggle";
import DonateButton from "./DonateButton";

// Custom hook for media query
function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) {
			setMatches(media.matches);
		}
		const listener = () => setMatches(media.matches);
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, [matches, query]);

	return matches;
}

type BudgetCalculatorProps = {
	data: LoaderData;
	expenseItems: ExpenseItems;
	donationLink: string;
	isInitialLoad: boolean;
};

const EXCHANGE_RATE_CACHE_KEY = "exchangeRateCache";

const initialTaxResult: TaxResult = {
	capitalGainsTax: 0,
	municipalTaxFromCapitalGains: 0,
	incomeTax: 0,
	municipalTaxFromIncome: 0,
	totalMunicipalTax: 0,
	totalTaxWithoutMunicipalTax: 0,
	breakdown: [],
	startingBracket: "",
};

export default function BudgetCalculator({
	data,
	expenseItems: initialExpenseItems,
	donationLink,
	isInitialLoad,
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
		setTotalExpenses(0);
		setTaxResults(initialTaxResult);
		setExchangeRate(data.exchangeRate);
		setForeignCurrency(data.foreignCurrency);
		setLoanAmountJPY(data.loanAmountJPY);
		setLoanAmountForeign(data.loanAmountForeign);
		setRemovedExpenses([]);
		setDeactivatedExpenses([]);
		setTimeFrame(data.timeFrame);

		// Selectively clear localStorage
		if (isBrowser) {
			const exchangeRateCache = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);
			localStorage.clear();
			if (exchangeRateCache) {
				localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, exchangeRateCache);
			}
		}
	};

	const getInitialState = <T,>(key: string, fallback: T): T => {
		if (isBrowser && !isInitialLoad) {
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
		getInitialState("totalExpenses", 0),
	);

	const [taxResults, setTaxResults] = useState<TaxResult>(
		getInitialState("taxResult", initialTaxResult),
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
	const [timeFrame, setTimeFrame] = useState<number>(
		getInitialState("timeFrame", data.timeFrame),
	);

	const [gains, setGains] = useState<number>(0);

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
			localStorage.setItem("taxResults", JSON.stringify(taxResults));
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
			localStorage.setItem("timeFrame", JSON.stringify(timeFrame));
		}
	}, [
		expenses,
		expenseItems,
		customExpenseTitles,
		btcPurchasePrice,
		btcSalePrice,
		yearlyIncome,
		totalExpenses,
		taxResults,
		exchangeRate,
		foreignCurrency,
		loanAmountJPY,
		loanAmountForeign,
		removedExpenses,
		deactivatedExpenses,
		timeFrame,
		isBrowser,
	]);

	useEffect(() => {
		const activeExpenses = Object.fromEntries(
			Object.entries(expenses).filter(
				([key]) =>
					!removedExpenses.includes(key) && !deactivatedExpenses.includes(key),
			),
		);
		const totalForTimeFrame = Object.values(activeExpenses).reduce<number>(
			(sum, value) => sum + value,
			0,
		);

		setTotalExpenses(totalForTimeFrame);

		const amountToSell = totalForTimeFrame - loanAmountJPY;
		const btcToSell = amountToSell / (btcSalePrice * exchangeRate);
		const gain = (btcSalePrice - btcPurchasePrice) * btcToSell * exchangeRate;

		setGains(gain);

		const taxResults = calculateTax(gain, yearlyIncome);
		setTaxResults(taxResults);
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

	const handleUpdateExpenseTitle = useCallback(
		(key: string, title: { en: string; ja: string }) => {
			setCustomExpenseTitles((prev) => ({
				...prev,
				[key]: title,
			}));
		},
		[],
	);

	useEffect(() => {
		localStorage.setItem(
			"customExpenseTitles",
			JSON.stringify(customExpenseTitles),
		);
	}, [customExpenseTitles]);

	const handleUpdateExpenseItems = useCallback(
		(key: string, items: Array<{ en: string; ja: string }>) => {
			setExpenseItems((prev) => ({
				...prev,
				[key]: items,
			}));
		},
		[],
	);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const moveSettingsDrawer = useMediaQuery("(max-width: 1300px)");
	const isSmallScreen = useMediaQuery("(max-width: 1050px)");

	const { theme, setTheme } = useOutletContext<{
		theme: "light" | "dark";
		setTheme: (theme: "light" | "dark") => void;
	}>();

	return (
		<Box className="relative">
			<Box className="text-center mb-6">
				<Heading size="8" mb="2">
					{t("title")}
				</Heading>
				<Text size="3">{t("subtitle", { currency: foreignCurrency })}</Text>
			</Box>
			{moveSettingsDrawer && (
				<Button
					size="3"
					variant="soft"
					onClick={() => setIsDrawerOpen(true)}
					className="fixed top-4 left-4 z-50"
				>
					<GearIcon />
				</Button>
			)}
			<Flex gap="6" direction={moveSettingsDrawer ? "column" : "row"}>
				<SettingsDrawer
					isOpen={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
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
					timeFrame={timeFrame}
					setTimeFrame={setTimeFrame}
					onReset={resetToInitialState}
				>
					<LanguageSettings />
					<ThemeToggle theme={theme} setTheme={setTheme} />
					<ResetButton onReset={resetToInitialState} />
					<DonateButton donationLink={donationLink} />
				</SettingsDrawer>
				{!moveSettingsDrawer && (
					<Box style={{ width: "300px", flexShrink: 0 }}>
						<Flex
							direction="column"
							gap="4"
							style={{ position: "sticky", top: "20px" }}
						>
							<TimeFrameInput
								timeFrame={timeFrame}
								setTimeFrame={setTimeFrame}
							/>
							<FinancialInputs
								totalExpenses={totalExpenses}
								timeFrame={timeFrame}
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
							<ThemeToggle theme={theme} setTheme={setTheme} />
							<ResetButton onReset={resetToInitialState} />
							<DonateButton donationLink={donationLink} />
						</Flex>
					</Box>
				)}
				<Box style={{ flexGrow: 1, textAlign: "center" }}>
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
						timeFrame={timeFrame}
						onUpdateExpenseItems={handleUpdateExpenseItems}
						onUpdateExpenseTitle={handleUpdateExpenseTitle}
						isSmallScreen={isSmallScreen}
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
						capitalGainsTax={taxResults.capitalGainsTax}
						municipalTaxFromCapitalGains={
							taxResults.municipalTaxFromCapitalGains
						}
						timeFrame={timeFrame}
						gains={gains}
					/>
					<Separator size="4" my="6" />
					<BitcoinInfoBox
						totalExpenses={totalExpenses}
						capitalGainsTax={taxResults.capitalGainsTax}
						municipalTaxFromCapitalGains={
							taxResults.municipalTaxFromCapitalGains
						}
						btcSalePrice={btcSalePrice}
						exchangeRate={exchangeRate}
						foreignCurrency={foreignCurrency}
						loanAmountJPY={loanAmountJPY}
						timeFrame={timeFrame}
					/>
					<Separator size="4" my="6" />
					<TaxBreakdown
						taxBreakdown={taxResults.breakdown}
						totalMunicipalTax={taxResults.totalMunicipalTax}
						startingBracket={taxResults.startingBracket}
						exchangeRate={exchangeRate}
						foreignCurrency={foreignCurrency}
						yearlyIncomeTax={taxResults.incomeTax}
					/>

					<ContactNote
						socialMediaLink="https://primal.net/p/npub1hatdj5gp9y9373pczfnzf8pr8gz24we24yw0566fpm3y7mx333gqvksxe9"
						socialMediaPlatform="primal.net"
						donationLink={donationLink}
					/>
				</Box>
			</Flex>
		</Box>
	);
}
