import type React from "react";
import { Box, Heading, Table } from "@radix-ui/themes";
import { formatCurrency } from "~/utils/calculations";

type BitcoinInfoBoxProps = {
	totalExpenses: number;
	taxAmount: number;
	btcSalePrice: number;
	btcPurchasePrice: number;
	exchangeRate: number;
	foreignCurrency: string;
	loanAmountJPY: number;
};

const BitcoinInfoBox: React.FC<BitcoinInfoBoxProps> = ({
	totalExpenses,
	taxAmount,
	btcSalePrice,
	btcPurchasePrice,
	exchangeRate,
	foreignCurrency,
	loanAmountJPY,
}) => {
	const totalNeeded = totalExpenses + taxAmount - loanAmountJPY;
	const btcNeeded = totalNeeded / (btcSalePrice * exchangeRate);
	const btcForExpenses =
		(totalExpenses - loanAmountJPY) / (btcSalePrice * exchangeRate);
	const btcForTaxes = taxAmount / (btcSalePrice * exchangeRate);

	return (
		<Box>
			<Heading size="4" mb="3">
				Bitcoin Calculations
			</Heading>
			<Table.Root style={{ borderCollapse: "collapse", width: "100%" }}>
				<Table.Body>
					<Table.Row>
						<Table.Cell
							style={{
								border: "1px solid var(--gray-6)",
								padding: "8px",
								width: "50%",
							}}
						>
							BTC needed for 5 years of expenses (after loan):
						</Table.Cell>
						<Table.Cell
							style={{
								border: "1px solid var(--gray-6)",
								padding: "8px",
								width: "50%",
								textAlign: "right",
							}}
						>
							{btcForExpenses.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							BTC needed to pay for taxes:
						</Table.Cell>
						<Table.Cell
							style={{
								border: "1px solid var(--gray-6)",
								padding: "8px",
								textAlign: "right",
							}}
						>
							{btcForTaxes.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Total BTC needed to sell:
						</Table.Cell>
						<Table.Cell
							style={{
								border: "1px solid var(--gray-6)",
								padding: "8px",
								textAlign: "right",
							}}
						>
							{btcNeeded.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Equivalent in {foreignCurrency} (at sale price):
						</Table.Cell>
						<Table.Cell
							style={{
								border: "1px solid var(--gray-6)",
								padding: "8px",
								textAlign: "right",
							}}
						>
							{formatCurrency(btcNeeded * btcSalePrice, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default BitcoinInfoBox;
