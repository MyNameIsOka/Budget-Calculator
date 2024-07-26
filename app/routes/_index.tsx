import type {
	MetaFunction,
	LoaderFunction,
	ActionFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BudgetCalculator from "~/components/BudgetCalculator";
import type { CombinedData, ExpenseItems } from "~/types";
import { initialExpenses, expenseItems } from "~/data/expenseData";
import invariant from "tiny-invariant";
export const meta: MetaFunction = () => {
	return [
		{ title: "Bitcoin Drawdown Calculator for Japan" },
		{
			name: "description",
			content:
				"Plan your long-term Bitcoin liquidation strategy for living in Japan. Calculate optimal BTC sell-off, estimate living expenses, and forecast tax implications based on Japan's tax system.",
		},
		{
			name: "keywords",
			content:
				"Bitcoin, Japan, tax calculator, crypto liquidation, living expenses, long-term planning, BTC to JPY, Japanese tax system",
		},
		{ property: "og:title", content: "Bitcoin Drawdown Calculator for Japan" },
		{
			property: "og:description",
			content:
				"Optimize your Bitcoin exit strategy for long-term living in Japan. Calculate sell-off amounts, estimate expenses, and forecast taxes.",
		},
		{ property: "og:type", content: "website" },
	];
};

export const loader: LoaderFunction = async () => {
	console.log("Loader function called");

	invariant(
		process.env.INITIAL_BTC_PURCHASE_PRICE,
		"INITIAL_BTC_PURCHASE_PRICE must be set",
	);
	invariant(
		process.env.INITIAL_BTC_SALE_PRICE,
		"INITIAL_BTC_SALE_PRICE must be set",
	);
	invariant(
		process.env.INITIAL_YEARLY_INCOME,
		"INITIAL_YEARLY_INCOME must be set",
	);
	invariant(
		process.env.INITIAL_EXCHANGE_RATE,
		"INITIAL_EXCHANGE_RATE must be set",
	);
	invariant(
		process.env.INITIAL_FOREIGN_CURRENCY,
		"INITIAL_FOREIGN_CURRENCY must be set",
	);
	invariant(
		process.env.INITIAL_LOAN_AMOUNT_JPY,
		"INITIAL_LOAN_AMOUNT_JPY must be set",
	);
	invariant(
		process.env.INITIAL_LOAN_AMOUNT_FOREIGN,
		"INITIAL_LOAN_AMOUNT_FOREIGN must be set",
	);
	invariant(process.env.DONATION_LINK, "DONATION_LINK must be set");

	// In a real application, you might fetch these values from an API or environment variables
	const initialState: CombinedData = {
		expenses: initialExpenses,
		btcPurchasePrice: Number(process.env.INITIAL_BTC_PURCHASE_PRICE),
		btcSalePrice: Number(process.env.INITIAL_BTC_SALE_PRICE),
		yearlyIncome: Number(process.env.INITIAL_YEARLY_INCOME),
		exchangeRate: Number(process.env.INITIAL_EXCHANGE_RATE),
		foreignCurrency: process.env.INITIAL_FOREIGN_CURRENCY,
		loanAmountJPY: Number(process.env.INITIAL_LOAN_AMOUNT_JPY),
		loanAmountForeign: Number(process.env.INITIAL_LOAN_AMOUNT_FOREIGN),
	};

	return json({
		initialState,
		expenseItems,
		donationLink: process.env.DONATION_LINK,
	});
};

export default function Index() {
	const { initialState, expenseItems, donationLink } = useLoaderData<{
		initialState: CombinedData;
		expenseItems: ExpenseItems;
		donationLink: string;
	}>();

	const data = { ...initialState };

	return (
		<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
			<div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
				<div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
					<BudgetCalculator
						data={data}
						expenseItems={expenseItems}
						donationLink={donationLink}
					/>
				</div>
			</div>
		</div>
	);
}
