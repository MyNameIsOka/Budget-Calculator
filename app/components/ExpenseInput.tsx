import type React from "react";
import { styled } from "@stitches/react";
import type { Expense, ExpenseItems } from "../types";
import { formatCurrency } from "../utils/calculations";

const ExpenseGrid = styled("div", {
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr)",
	gap: "1rem",
	marginBottom: "1rem",
});

const ExpenseCard = styled("div", {
	border: "1px solid #3498db",
	borderRadius: "8px",
	padding: "1rem",
	backgroundColor: "white",
	boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
	display: "flex",
	flexDirection: "column",
	height: "250px",
	overflow: "hidden",
});

const ExpenseTitle = styled("h3", {
	margin: 0,
	marginBottom: "0.5rem",
	color: "#3498db",
});

const ExpenseInputLine = styled("div", {
	display: "flex",
	alignItems: "center",
	marginBottom: "0.5rem",
	"& input": {
		width: "120px",
		padding: "0.25rem",
		border: "1px solid #3498db",
		borderRadius: "4px",
		marginRight: "0.5rem",
	},
	"& span": {
		fontSize: "0.9rem",
		color: "#666",
	},
});

const ExpenseItemsList = styled("ul", {
	listStyle: "disc",
	paddingLeft: "1.5rem",
	margin: "0.5rem 0",
	fontSize: "0.9rem",
	color: "#666",
	flexGrow: 1,
	overflowY: "auto",
});

const ExpenseSummary = styled("div", {
	fontSize: "0.9rem",
	color: "#666",
	marginTop: "auto",
	borderTop: "1px solid #e0e0e0",
	paddingTop: "0.5rem",
});

const SummaryLine = styled("div", {
	display: "flex",
	justifyContent: "space-between",
	"& span:first-child": {
		marginRight: "1rem",
	},
});

interface ExpenseInputProps {
	expenses: Expense;
	expenseItems: ExpenseItems;
	handleExpenseChange: (key: string, value: number) => void;
	exchangeRate: number;
	foreignCurrency: string;
}

const ExpenseInput: React.FC<ExpenseInputProps> = ({
	expenses,
	expenseItems,
	handleExpenseChange,
	exchangeRate,
	foreignCurrency,
}) => {
	return (
		<ExpenseGrid>
			{Object.entries(expenses).map(([key, value]) => (
				<ExpenseCard key={key}>
					<ExpenseTitle>
						{key.charAt(0).toUpperCase() + key.slice(1)}
					</ExpenseTitle>
					<ExpenseInputLine>
						<input
							type="text"
							value={value.toLocaleString()}
							onChange={(e) =>
								handleExpenseChange(
									key,
									Number.parseFloat(e.target.value.replace(/,/g, "")) || 0,
								)
							}
						/>
						<span>JPY/month</span>
					</ExpenseInputLine>
					<ExpenseItemsList>
						{expenseItems[key].map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ExpenseItemsList>
					<ExpenseSummary>
						<SummaryLine>
							<span>Yearly:</span>
							<span>
								{formatCurrency(value * 12)} |{" "}
								{formatCurrency((value * 12) / exchangeRate, foreignCurrency)}
							</span>
						</SummaryLine>
						<SummaryLine>
							<span>5 Years:</span>
							<span>
								{formatCurrency(value * 12 * 5)} |{" "}
								{formatCurrency(
									(value * 12 * 5) / exchangeRate,
									foreignCurrency,
								)}
							</span>
						</SummaryLine>
					</ExpenseSummary>
				</ExpenseCard>
			))}
		</ExpenseGrid>
	);
};

export default ExpenseInput;
