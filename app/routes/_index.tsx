import type {
	MetaFunction,
	LoaderFunction,
	ActionFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import BudgetCalculator from "~/components/BudgetCalculator";
import { calculateTax } from "~/utils/calculations";
import type { ActionData, CombinedData, Expense, ExpenseItems } from "~/types";
import { initialExpenses, expenseItems } from "~/data/expenseData";
import assert from "node:assert";

// ... (keep existing meta function)

export const loader: LoaderFunction = async () => {
	console.log("Loader function called");
	assert(
		process.env.INITIAL_BTC_PURCHASE_PRICE,
		"INITIAL_BTC_PURCHASE_PRICE is required",
	);
	assert(
		process.env.INITIAL_BTC_SALE_PRICE,
		"INITIAL_BTC_SALE_PRICE is required",
	);
	assert(
		process.env.INITIAL_YEARLY_INCOME,
		"INITIAL_YEARLY_INCOME is required",
	);
	assert(
		process.env.INITIAL_EXCHANGE_RATE,
		"INITIAL_EXCHANGE_RATE is required",
	);
	assert(
		process.env.INITIAL_FOREIGN_CURRENCY,
		"INITIAL_FOREIGN_CURRENCY is required",
	);
	assert(
		process.env.INITIAL_LOAN_AMOUNT_JPY,
		"INITIAL_LOAN_AMOUNT_JPY is required",
	);
	assert(
		process.env.INITIAL_LOAN_AMOUNT_FOREIGN,
		"INITIAL_LOAN_AMOUNT_FOREIGN is required",
	);

	const initialState: CombinedData = {
		expenses: initialExpenses,
		btcPurchasePrice: Number(process.env.INITIAL_BTC_PURCHASE_PRICE) || 10000,
		btcSalePrice: Number(process.env.INITIAL_BTC_SALE_PRICE) || 50000,
		yearlyIncome: Number(process.env.INITIAL_YEARLY_INCOME) || 0,
		exchangeRate: Number(process.env.INITIAL_EXCHANGE_RATE) || 160,
		foreignCurrency: process.env.INITIAL_FOREIGN_CURRENCY || "USD",
		loanAmountJPY: Number(process.env.INITIAL_LOAN_AMOUNT_JPY) || 0,
		loanAmountForeign: Number(process.env.INITIAL_LOAN_AMOUNT_FOREIGN) || 0,
	};

	return json({ initialState, expenseItems });
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const expenses = JSON.parse(formData.get("expenses") as string) as Expense;
	const btcPurchasePrice = Number(formData.get("btcPurchasePrice"));
	const btcSalePrice = Number(formData.get("btcSalePrice"));
	const yearlyIncome = Number(formData.get("yearlyIncome"));
	const exchangeRate = Number(formData.get("exchangeRate"));
	const foreignCurrency = formData.get("foreignCurrency") as string;
	const loanAmountJPY = Number(formData.get("loanAmountJPY"));
	const loanAmountForeign = Number(formData.get("loanAmountForeign"));

	const monthlyTotal = Object.values(expenses).reduce<number>(
		(sum, value) => sum + value,
		0,
	);
	const yearlyTotal = monthlyTotal * 12;
	const fiveYearTotal = yearlyTotal * 5;

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

	return json({
		totalExpenses: fiveYearTotal,
		taxAmount: totalTaxAmount,
		taxBreakdown: breakdown,
		startingBracket: bracket,
	});
};

export default function Index() {
	const { initialState, expenseItems } = useLoaderData<{
		initialState: CombinedData;
		expenseItems: ExpenseItems;
	}>();
	const actionData = useActionData<ActionData>();

	const data = { ...initialState, ...actionData };

	return <BudgetCalculator data={data} expenseItems={expenseItems} />;
}
