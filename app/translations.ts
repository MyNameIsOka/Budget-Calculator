import type { Translations } from "./types";

export const translations: Translations = {
	en: {
		title: "5-Year Budget Calculator for Japan",
		subtitle: "with Bitcoin Tax and {currency} Conversion",
		financialInputs: {
			title: "Financial Inputs",
			yearlyIncome: "Yearly Income (JPY)",
			btcPurchasePrice: "BTC Purchase Price ({currency})",
			btcSalePrice: "BTC Sale Price ({currency})",
			loanAmountJPY: "Loan Amount (JPY)",
			loanAmountForeign: "Loan Amount ({currency})",
		},
		currencySettings: {
			title: "Currency Settings",
			exchangeRate: "{currency} to JPY Exchange Rate",
		},
		languageSettings: {
			title: "Language",
			en: "English",
			ja: "日本語",
		},
		expenseDistribution: {
			title: "Expense Distribution",
		},
		summary: {
			title: "Summary",
			totalExpenses: "Total Expenses (5 years)",
			loanAmount: "Loan amount",
			amountToSell: "Amount to sell (after loan)",
			taxesFromSelling: "Taxes from selling BTC",
			totalBTCNeeded: "Total BTC needed",
			effectiveTaxRate: "Effective Tax Rate",
		},
		bitcoinInfo: {
			title: "Bitcoin Calculations",
			btcForExpenses: "BTC needed for 5 years of expenses (after loan):",
			btcForTaxes: "BTC needed to pay for taxes:",
			totalBTCToSell: "Total BTC needed to sell:",
			equivalentInForeignCurrency: "Equivalent in {currency} (at sale price):",
		},
		taxBreakdown: {
			title: "Tax Breakdown",
			startingBracket: "Starting tax bracket: {bracket}",
			notCalculated: "Not calculated yet",
			bracket: "Bracket",
			rate: "Rate",
			taxableAmount: "Taxable Amount",
			taxAmount: "Tax Amount",
			municipalTax: "Municipal Tax (10% flat rate)",
			noData:
				"Not enough data to calculate tax breakdown. Please enter all required information.",
		},
	},
	ja: {
		title: "日本の5年間予算計算機",
		subtitle: "ビットコイン税金と{currency}換算付き",
		financialInputs: {
			title: "財務入力",
			yearlyIncome: "年収（円）",
			btcPurchasePrice: "ビットコイン購入価格（{currency}）",
			btcSalePrice: "ビットコイン売却価格（{currency}）",
			loanAmountJPY: "ローン金額（円）",
			loanAmountForeign: "ローン金額（{currency}）",
		},
		currencySettings: {
			title: "通貨設定",
			exchangeRate: "{currency}から円への為替レート",
		},
		languageSettings: {
			title: "言語",
			en: "English",
			ja: "日本語",
		},
		expenseDistribution: {
			title: "経費分布",
		},
		summary: {
			title: "概要",
			totalExpenses: "総経費（5年間）",
			loanAmount: "ローン金額",
			amountToSell: "売却金額（ローン後）",
			taxesFromSelling: "ビットコイン売却による税金",
			totalBTCNeeded: "必要な総ビットコイン量",
			effectiveTaxRate: "実効税率",
		},
		bitcoinInfo: {
			title: "ビットコイン計算",
			btcForExpenses: "5年間の経費に必要なBTC（ローン後）：",
			btcForTaxes: "税金支払いに必要なBTC：",
			totalBTCToSell: "売却が必要な総BTC：",
			equivalentInForeignCurrency: "{currency}相当額（売却価格で）：",
		},
		taxBreakdown: {
			title: "税金内訳",
			startingBracket: "開始税率区分：{bracket}",
			notCalculated: "まだ計算されていません",
			bracket: "区分",
			rate: "税率",
			taxableAmount: "課税対象額",
			taxAmount: "税額",
			municipalTax: "住民税（10%固定税率）",
			noData:
				"税金内訳を計算するのに十分なデータがありません。必要な情報をすべて入力してください。",
		},
	},
};
