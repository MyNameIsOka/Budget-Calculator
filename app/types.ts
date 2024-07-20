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
