import type React from "react";
import { Box, Heading, Table } from "@radix-ui/themes";
import { formatCurrency } from "~/utils/calculations";

type SummaryProps = {
	totalExpenses: number;
	taxAmount: number;
	totalAmount: number;
	exchangeRate: number;
	foreignCurrency: string;
};

const Summary: React.FC<SummaryProps> = ({
	totalExpenses,
	taxAmount,
	totalAmount,
	exchangeRate,
	foreignCurrency,
}) => {
	return (
		<Box>
			<Heading size="5" mb="3">
				Summary
			</Heading>
			<Table.Root style={{ borderCollapse: "collapse", width: "100%" }}>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Item
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							JPY
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{foreignCurrency}
						</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Total Expenses (5 years)
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(totalExpenses)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(totalExpenses / exchangeRate, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Estimated Tax
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(taxAmount)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(taxAmount / exchangeRate, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Total Amount Needed
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(totalAmount)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(totalAmount / exchangeRate, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default Summary;
