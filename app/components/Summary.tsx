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
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>JPY</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>{foreignCurrency}</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Total Expenses (5 years)</Table.Cell>
						<Table.Cell>{formatCurrency(totalExpenses)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalExpenses / exchangeRate, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Estimated Tax</Table.Cell>
						<Table.Cell>{formatCurrency(taxAmount)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(taxAmount / exchangeRate, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Total Amount Needed</Table.Cell>
						<Table.Cell>{formatCurrency(totalAmount)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalAmount / exchangeRate, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default Summary;
