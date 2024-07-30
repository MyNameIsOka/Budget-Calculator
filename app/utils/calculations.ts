import type { TaxBreakdownItem, TaxBracket } from "../types";

export const formatCurrency = (amount: number, currency = "JPY"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		maximumFractionDigits: 0,
	}).format(Math.round(amount));
};

export const calculateTax = (
	income: number,
	yearlyIncome: number,
): {
	totalTax: number;
	breakdown: TaxBreakdownItem[];
	startingBracket: string;
} => {
	const brackets: TaxBracket[] = [
		{ limit: 1950000, rate: 0.05, deduction: 0 },
		{ limit: 3300000, rate: 0.1, deduction: 97500 },
		{ limit: 6950000, rate: 0.2, deduction: 427500 },
		{ limit: 9000000, rate: 0.23, deduction: 636000 },
		{ limit: 18000000, rate: 0.33, deduction: 1536000 },
		{ limit: 40000000, rate: 0.4, deduction: 2796000 },
		{ limit: Number.POSITIVE_INFINITY, rate: 0.45, deduction: 4796000 },
	];

	let tax = 0;
	const taxBreakdown: TaxBreakdownItem[] = [];
	let startingBracket = "";

	// Find the starting bracket based on yearly income
	let startingBracketIndex = 0;
	for (let i = 0; i < brackets.length; i++) {
		if (yearlyIncome <= brackets[i].limit) {
			startingBracketIndex = i;
			startingBracket = `¥${brackets[i].limit.toLocaleString()} (${
				brackets[i].rate * 100
			}%)`;
			break;
		}
	}

	// Calculate tax on total income (yearly income + capital gains)
	const totalIncome = yearlyIncome + income;
	let applicableBracket = brackets[startingBracketIndex];

	for (let i = startingBracketIndex; i < brackets.length; i++) {
		if (totalIncome <= brackets[i].limit) {
			applicableBracket = brackets[i];
			break;
		}
	}

	tax = totalIncome * applicableBracket.rate - applicableBracket.deduction;

	// Calculate tax on yearly income (for informational purposes)
	const yearlyIncomeTax =
		yearlyIncome * applicableBracket.rate - applicableBracket.deduction;

	// The additional tax due to capital gains
	const capitalGainsTax = tax - yearlyIncomeTax;

	taxBreakdown.push({
		bracket: `¥${applicableBracket.limit.toLocaleString()}`,
		rate: `${(applicableBracket.rate * 100).toFixed(0)}%`,
		taxableAmount: `¥${Math.round(income).toLocaleString()}`,
		deduction: `¥${applicableBracket.deduction.toLocaleString()}`,
		taxAmount: `¥${Math.round(capitalGainsTax).toLocaleString()}`,
	});

	return {
		totalTax: Math.round(capitalGainsTax),
		breakdown: taxBreakdown,
		startingBracket,
	};
};
