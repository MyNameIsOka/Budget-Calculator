import type React from "react";
import { styled } from "@stitches/react";
import { formatCurrency } from "../utils/calculations";

const SummaryTable = styled("table", {
	width: "100%",
	borderCollapse: "collapse",
	marginBottom: "1rem",
	"& th, & td": {
		border: "1px solid #3498db",
		padding: "0.5rem",
		textAlign: "left",
	},
	"& th": {
		backgroundColor: "#f0f8ff",
		fontWeight: "bold",
	},
});

interface SummaryProps {
	totalExpenses: number;
	taxAmount: number;
	totalAmount: number;
	exchangeRate: number;
	foreignCurrency: string;
}

const Summary: React.FC<SummaryProps> = ({
	totalExpenses,
	taxAmount,
	totalAmount,
	exchangeRate,
	foreignCurrency,
}) => {
	return (
		<>
			<h2>Summary</h2>
			<SummaryTable>
				<thead>
					<tr>
						<th>Item</th>
						<th>JPY</th>
						<th>{foreignCurrency}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Total Expenses (5 years)</td>
						<td>{formatCurrency(totalExpenses)}</td>
						<td>
							{formatCurrency(totalExpenses / exchangeRate, foreignCurrency)}
						</td>
					</tr>
					<tr>
						<td>Estimated Tax</td>
						<td>{formatCurrency(taxAmount)}</td>
						<td>{formatCurrency(taxAmount / exchangeRate, foreignCurrency)}</td>
					</tr>
					<tr>
						<td>Total Amount Needed</td>
						<td>{formatCurrency(totalAmount)}</td>
						<td>
							{formatCurrency(totalAmount / exchangeRate, foreignCurrency)}
						</td>
					</tr>
				</tbody>
			</SummaryTable>
		</>
	);
};

export default Summary;
