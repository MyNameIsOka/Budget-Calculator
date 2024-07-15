import type React from "react";
import { Box, Heading, Table } from "@radix-ui/themes";
import { formatCurrency } from "~/utils/calculations";

type SummaryProps = {
	totalExpenses: number;
	loanAmountJPY: number;
	btcSalePrice: number;
	exchangeRate: number;
	foreignCurrency: string;
	taxAmount: number;
};

const Summary: React.FC<SummaryProps> = ({
	totalExpenses,
	loanAmountJPY,
	btcSalePrice,
	exchangeRate,
	foreignCurrency,
	taxAmount,
}) => {
	const amountToSell = totalExpenses - loanAmountJPY;
	const btcToSell = amountToSell / (btcSalePrice * exchangeRate);
	const btcForTaxes = taxAmount / (btcSalePrice * exchangeRate);
	const totalBtcNeeded = btcToSell + btcForTaxes;
	const effectiveTaxRate = (taxAmount / amountToSell) * 100;

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
						<Table.ColumnHeaderCell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							BTC
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
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{(totalExpenses / (btcSalePrice * exchangeRate)).toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Loan amount
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(loanAmountJPY)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(loanAmountJPY / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{(loanAmountJPY / (btcSalePrice * exchangeRate)).toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Amount to sell (after loan)
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(amountToSell)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(amountToSell / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{btcToSell.toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Taxes from selling BTC
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
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{btcForTaxes.toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Total BTC needed
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(totalBtcNeeded * btcSalePrice * exchangeRate)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{formatCurrency(totalBtcNeeded * btcSalePrice, foreignCurrency)}
						</Table.Cell>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{totalBtcNeeded.toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Effective Tax Rate
						</Table.Cell>
						<Table.Cell
							colSpan={3}
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							{effectiveTaxRate.toFixed(2)}%
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default Summary;
