import type { Expense, ExpenseItems } from "../types";

export const initialExpenses: Expense = {
	rent: 250000,
	utilities: 30000,
	food: 100000,
	carLease: 50000,
	carExpenses: 30000,
	publicTransport: 20000,
	healthcare: 30000,
	childcare: 50000,
	petCare: 10000,
	travel: 41667,
	personalCare: 30000,
	entertainment: 30000,
	communication: 15000,
	miscellaneous: 30000,
};

export const expenseItems: ExpenseItems = {
	rent: ["Apartment"],
	utilities: ["Electricity", "Gas", "Water", "Internet"],
	food: ["Groceries", "Occasional dining out", "Pet food for two cats"],
	carLease: ["Monthly car lease payments"],
	carExpenses: ["Car insurance", "Fuel", "Maintenance", "Parking fees"],
	publicTransport: ["Train and bus fares"],
	healthcare: [
		"Health insurance premiums",
		"Medical visits",
		"Dental care",
		"Prescriptions",
	],
	childcare: [
		"Childcare or preschool costs",
		"Baby supplies",
		"Educational materials",
	],
	petCare: ["Veterinary check-ups", "Pet supplies"],
	travel: [
		"Annual trips to Germany",
		"Airfare",
		"Accommodation",
		"Local transportation",
	],
	personalCare: ["Clothing", "Shoes", "Personal care products and services"],
	entertainment: ["Family outings", "Subscriptions", "Hobbies"],
	communication: ["Mobile phone plans"],
	miscellaneous: ["Home furnishings", "Gifts", "Emergency fund"],
};
