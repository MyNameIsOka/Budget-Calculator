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

export const meta: MetaFunction = () => {
	return [
		{ title: "5-Year Budget Calculator for Japan" },
		{
			name: "description",
			content:
				"Calculate your 5-year budget in Japan with Bitcoin tax considerations",
		},
	];
};

export const loader: LoaderFunction = async () => {
	console.log("Loader function called");

	// In a real application, you might fetch these values from an API or environment variables
	const initialState: CombinedData = {
		expenses: initialExpenses,
		btcPurchasePrice: 10000,
		btcSalePrice: 50000,
		yearlyIncome: 0,
		exchangeRate: 110,
		foreignCurrency: "USD",
		loanAmountJPY: 0,
		loanAmountForeign: 0,
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

	const { totalTax, breakdown, startingBracket } = calculateTax(
		gain,
		yearlyIncome,
	);
	const municipalTax = gain * 0.1;
	const totalTaxAmount = totalTax + municipalTax;

	return json({
		totalExpenses: fiveYearTotal,
		taxAmount: totalTaxAmount,
		taxBreakdown: breakdown,
		startingBracket,
	});
};

export default function Index() {
	const { initialState, expenseItems } = useLoaderData<{
		initialState: CombinedData;
		expenseItems: ExpenseItems;
	}>();
	const actionData = useActionData<ActionData>();

	const data = { ...initialState, ...actionData };

	return (
		<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
			<div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
				<div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
					<BudgetCalculator data={data} expenseItems={expenseItems} />
				</div>
			</div>
		</div>
	);
}
