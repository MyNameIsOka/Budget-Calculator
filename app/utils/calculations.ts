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
		{ limit: 1950000, rate: 0.05 },
		{ limit: 3300000, rate: 0.1 },
		{ limit: 6950000, rate: 0.2 },
		{ limit: 9000000, rate: 0.23 },
		{ limit: 18000000, rate: 0.33 },
		{ limit: 40000000, rate: 0.4 },
		{ limit: Number.POSITIVE_INFINITY, rate: 0.45 },
	];

	let tax = 0;
	let remainingIncome = income;
	const taxBreakdown: TaxBreakdownItem[] = [];
	let startingBracket = "";

	// Find the starting bracket based on yearly income
	let startingBracketIndex = 0;
	for (let i = 0; i < brackets.length; i++) {
		if (yearlyIncome <= brackets[i].limit) {
			startingBracketIndex = i;
			startingBracket = `¥${brackets[i].limit.toLocaleString()} (${brackets[i].rate * 100}%)`;
			break;
		}
	}

	for (let i = startingBracketIndex; i < brackets.length; i++) {
		const bracket = brackets[i];
		const prevLimit = i > 0 ? brackets[i - 1].limit : 0;
		const taxableInThisBracket = Math.min(
			remainingIncome,
			bracket.limit - prevLimit,
		);

		if (taxableInThisBracket <= 0) break;

		const taxInThisBracket = taxableInThisBracket * bracket.rate;
		tax += taxInThisBracket;
		taxBreakdown.push({
			bracket: `¥${prevLimit.toLocaleString()} - ¥${bracket.limit.toLocaleString()}`,
			rate: `${(bracket.rate * 100).toFixed(0)}%`,
			taxableAmount: `¥${Math.round(taxableInThisBracket).toLocaleString()}`,
			taxAmount: `¥${Math.round(taxInThisBracket).toLocaleString()}`,
		});
		remainingIncome -= taxableInThisBracket;
	}

	return {
		totalTax: Math.round(tax),
		breakdown: taxBreakdown,
		startingBracket,
	};
};
