export type ExpenseItems = {
	[key: string]: string[];
};

export type TaxBracket = {
	limit: number;
	rate: number;
};

export type Expense = {
	[key: string]: number;
};

export type TaxBreakdownItem = {
	bracket: string;
	rate: string;
	taxableAmount: string;
	taxAmount: string;
};

export type LoaderData = {
	expenses: Expense;
	btcPurchasePrice: number;
	btcSalePrice: number;
	yearlyIncome: number;
	exchangeRate: number;
	foreignCurrency: string;
	loanAmountJPY: number;
	loanAmountForeign: number;
};

export type ActionData = {
	totalExpenses: number;
	taxAmount: number;
	taxBreakdown: TaxBreakdownItem[];
	startingBracket: string;
};

export type CombinedData = LoaderData & Partial<ActionData>;

export type Language = "en" | "ja";

export type TranslationKeys = {
	title: string;
	subtitle: string;
	financialInputs: {
		title: string;
		yearlyIncome: string;
		btcPurchasePrice: string;
		btcSalePrice: string;
		loanAmountJPY: string;
		loanAmountForeign: string;
	};
	currencySettings: {
		title: string;
		exchangeRate: string;
	};
	languageSettings: {
		title: string;
		en: string;
		ja: string;
	};
	expenseDistribution: {
		title: string;
	};
	summary: {
		title: string;
		totalExpenses: string;
		loanAmount: string;
		amountToSell: string;
		taxesFromSelling: string;
		totalBTCNeeded: string;
		effectiveTaxRate: string;
	};
	bitcoinInfo: {
		title: string;
		btcForExpenses: string;
		btcForTaxes: string;
		totalBTCToSell: string;
		equivalentInForeignCurrency: string;
	};
	taxBreakdown: {
		title: string;
		startingBracket: string;
		notCalculated: string;
		bracket: string;
		rate: string;
		taxableAmount: string;
		taxAmount: string;
		municipalTax: string;
		noData: string;
	};
};

export type Translations = {
	[key in Language]: TranslationKeys;
};
