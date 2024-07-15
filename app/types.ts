export type Expense = {
	[key: string]: number;
};

export type ExpenseItems = {
	[key: string]: string[];
};

export type TaxBracket = {
	limit: number;
	rate: number;
};

export type TaxBreakdownItem = {
	bracket: string;
	rate: string;
	taxableAmount: string;
	taxAmount: string;
};
