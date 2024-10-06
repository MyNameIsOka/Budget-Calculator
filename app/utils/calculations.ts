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

    const taxBreakdown: TaxBreakdownItem[] = [];
    let capitalGainsTax = 0;
    let incomeTax = 0;

    // Calculate income tax without applying deduction
    let remainingIncome = yearlyIncome;
    for (let i = 0; i < brackets.length; i++) {
        const bracket = brackets[i];
        const previousLimit = i > 0 ? brackets[i-1].limit : 0;
        const taxableInThisBracket = Math.min(bracket.limit - previousLimit, remainingIncome);
        
        if (taxableInThisBracket > 0) {
            incomeTax += taxableInThisBracket * bracket.rate;
            remainingIncome -= taxableInThisBracket;
        }
        if (remainingIncome <= 0) break;
    }

    // Find the starting bracket for capital gains
    const startingBracketIndex = brackets.findIndex(b => b.limit > yearlyIncome);
    const startingBracket = `¥${brackets[startingBracketIndex].limit.toLocaleString()} (${(brackets[startingBracketIndex].rate * 100).toFixed(0)}%)`;

    // Calculate capital gains tax
    let remainingGains = gains;
    let totalIncome = yearlyIncome;
    for (let i = startingBracketIndex; i < brackets.length; i++) {
        const bracket = brackets[i];
        const taxableInThisBracket = Math.min(bracket.limit - totalIncome, remainingGains);
        
        if (taxableInThisBracket > 0) {
            const taxForThisBracket = taxableInThisBracket * bracket.rate;
            capitalGainsTax += taxForThisBracket;

            taxBreakdown.push({
                bracket: `¥${bracket.limit.toLocaleString()}`,
                rate: `${(bracket.rate * 100).toFixed(0)}%`,
                taxableAmount: `¥${Math.round(taxableInThisBracket).toLocaleString()}`,
                deduction: `¥${bracket.deduction.toLocaleString()}`,
                totalTaxWithoutMunicipalTax: `¥${Math.round(taxForThisBracket).toLocaleString()}`,
            });

            remainingGains -= taxableInThisBracket;
            totalIncome += taxableInThisBracket;
        }
        if (remainingGains <= 0) break;
    }

    // Apply the deduction to capital gains tax only
    const finalBracket = brackets.find(b => b.limit > totalIncome) || brackets[brackets.length - 1];
    capitalGainsTax = Math.max(0, capitalGainsTax - finalBracket.deduction);

    const totalTaxWithoutMunicipalTax = incomeTax + capitalGainsTax;

    const municipalTaxRate = 0.1;
    const municipalTaxFromCapitalGains = gains * municipalTaxRate;
    const municipalTaxFromIncome = yearlyIncome * municipalTaxRate;
    const totalMunicipalTax = municipalTaxFromCapitalGains + municipalTaxFromIncome;

    return {
        capitalGainsTax: Math.round(capitalGainsTax),
        municipalTaxFromCapitalGains: Math.round(municipalTaxFromCapitalGains),
        incomeTax: Math.round(incomeTax),
        municipalTaxFromIncome: Math.round(municipalTaxFromIncome),
        totalMunicipalTax: Math.round(totalMunicipalTax),
        totalTaxWithoutMunicipalTax: Math.round(totalTaxWithoutMunicipalTax),
        breakdown: taxBreakdown,
        startingBracket,
    };
};
