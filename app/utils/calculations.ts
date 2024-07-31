import type { TaxBreakdownItem, TaxBracket, TaxResult } from "../types";

export const formatCurrency = (amount: number, currency = "JPY"): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		maximumFractionDigits: 0,
	}).format(Math.round(amount));
};

export const calculateTax = (
	gains: number,
	yearlyIncome: number,
): TaxResult => {
	const brackets: TaxBracket[] = [
		{ limit: 1950000, rate: 0.05, deduction: 0 },
		{ limit: 3300000, rate: 0.1, deduction: 97500 },
		{ limit: 6950000, rate: 0.2, deduction: 427500 },
		{ limit: 9000000, rate: 0.23, deduction: 636000 },
		{ limit: 18000000, rate: 0.33, deduction: 1536000 },
		{ limit: 40000000, rate: 0.4, deduction: 2796000 },
		{ limit: Number.POSITIVE_INFINITY, rate: 0.45, deduction: 4796000 },
	];

	const tax = 0;
	const taxBreakdown: TaxBreakdownItem[] = [];
	let startingBracket = "";

	// Find the starting bracket based on yearly gains
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

	// Calculate tax on total gains (yearly gains + capital gains)
	const totalIncome = yearlyIncome + gains;
	let applicableBracket = brackets[startingBracketIndex];

	for (let i = startingBracketIndex; i < brackets.length; i++) {
		if (totalIncome <= brackets[i].limit) {
			applicableBracket = brackets[i];
			break;
		}
	}

	// calculate tax on capital gains
	const capitalGainsTax = gains * applicableBracket.rate;
	const municipalTaxFromCapitalGains = gains * 0.1;

	// Calculate tax on yearly gains (for informational purposes)
	const yearlyIncomeTax = yearlyIncome * applicableBracket.rate;
	const municipalTaxFromIncome = yearlyIncome * 0.1;

	// Calculate total tax
	const totalTaxWithoutMunicipalTax =
		(yearlyIncome + gains - applicableBracket.deduction) *
		applicableBracket.rate;
	const totalMunicipalTax =
		municipalTaxFromCapitalGains + municipalTaxFromIncome;

	taxBreakdown.push({
		bracket: `¥${applicableBracket.limit.toLocaleString()}`,
		rate: `${(applicableBracket.rate * 100).toFixed(0)}%`,
		taxableAmount: `¥${Math.round(gains + yearlyIncome).toLocaleString()}`,
		deduction: `¥${applicableBracket.deduction.toLocaleString()}`,
		totalTaxWithoutMunicipalTax: `¥${Math.round(totalTaxWithoutMunicipalTax).toLocaleString()}`,
	});

	return {
		capitalGainsTax: Math.round(capitalGainsTax),
		municipalTaxFromCapitalGains: Math.round(municipalTaxFromCapitalGains),
		incomeTax: Math.round(yearlyIncomeTax),
		municipalTaxFromIncome: Math.round(municipalTaxFromIncome),
		totalMunicipalTax: Math.round(totalMunicipalTax),
		totalTaxWithoutMunicipalTax: Math.round(totalTaxWithoutMunicipalTax),
		breakdown: taxBreakdown,
		startingBracket,
	};
};
