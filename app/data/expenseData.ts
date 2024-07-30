import type { Expense, ExpenseItems } from "../types";

export const initialExpenses = (timeFrame: number): Expense => {
	return {
		rent: 250000 * 12 * timeFrame,
		utilities: 30000 * 12 * timeFrame,
		food: 100000 * 12 * timeFrame,
		carLease: 50000 * 12 * timeFrame,
		carExpenses: 30000 * 12 * timeFrame,
		publicTransport: 20000 * 12 * timeFrame,
		healthcare: 30000 * 12 * timeFrame,
		childcare: 50000 * 12 * timeFrame,
		petCare: 10000 * 12 * timeFrame,
		travel: 41667 * 12 * timeFrame,
		personalCare: 30000 * 12 * timeFrame,
		entertainment: 30000 * 12 * timeFrame,
		communication: 15000 * 12 * timeFrame,
		miscellaneous: 30000 * 12 * timeFrame,
	};
};

export const expenseItems: ExpenseItems = {
	rent: [{ en: "Apartment", ja: "アパート" }],
	utilities: [
		{ en: "Electricity", ja: "電気" },
		{ en: "Gas", ja: "ガス" },
		{ en: "Water", ja: "水道" },
		{ en: "Internet", ja: "インターネット" },
	],
	food: [
		{ en: "Groceries", ja: "食料品" },
		{ en: "Occasional dining out", ja: "外食（時々）" },
		{ en: "Pet food for two cats", ja: "猫2匹分のペットフード" },
	],
	carLease: [{ en: "Monthly car lease payments", ja: "月々の車リース料" }],
	carExpenses: [
		{ en: "Car insurance", ja: "自動車保険" },
		{ en: "Fuel", ja: "燃料費" },
		{ en: "Maintenance", ja: "メンテナンス費" },
		{ en: "Parking fees", ja: "駐車場代" },
	],
	publicTransport: [{ en: "Train and bus fares", ja: "電車とバスの運賃" }],
	healthcare: [
		{ en: "Health insurance premiums", ja: "健康保険料" },
		{ en: "Medical visits", ja: "医療機関の受診" },
		{ en: "Dental care", ja: "歯科治療" },
		{ en: "Prescriptions", ja: "処方薬" },
	],
	childcare: [
		{ en: "Childcare or preschool costs", ja: "保育園または幼稚園の費用" },
		{ en: "Baby supplies", ja: "ベビー用品" },
		{ en: "Educational materials", ja: "教育教材" },
	],
	petCare: [
		{ en: "Veterinary check-ups", ja: "獣医の健康診断" },
		{ en: "Pet supplies", ja: "ペット用品" },
	],
	travel: [
		{ en: "Annual trips to Germany", ja: "年1回のドイツ旅行" },
		{ en: "Airfare", ja: "航空運賃" },
		{ en: "Accommodation", ja: "宿泊費" },
		{ en: "Local transportation", ja: "現地での交通費" },
	],
	personalCare: [
		{ en: "Clothing", ja: "衣服" },
		{ en: "Shoes", ja: "靴" },
		{
			en: "Personal care products and services",
			ja: "パーソナルケア製品とサービス",
		},
	],
	entertainment: [
		{ en: "Family outings", ja: "家族でのお出かけ" },
		{ en: "Subscriptions", ja: "サブスクリプション" },
		{ en: "Hobbies", ja: "趣味" },
	],
	communication: [{ en: "Mobile phone plans", ja: "携帯電話プラン" }],
	miscellaneous: [
		{ en: "Home furnishings", ja: "家具・インテリア" },
		{ en: "Gifts", ja: "ギフト" },
		{ en: "Emergency fund", ja: "緊急時の備え" },
	],
};
