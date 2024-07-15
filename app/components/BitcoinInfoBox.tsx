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
};

const BitcoinInfoBox: React.FC<BitcoinInfoBoxProps> = ({
	totalExpenses,
	taxAmount,
	btcSalePrice,
	btcPurchasePrice,
	exchangeRate,
	foreignCurrency,
}) => {
	const btcForExpenses = totalExpenses / (btcSalePrice * exchangeRate);
	const btcForTaxes = taxAmount / (btcSalePrice * exchangeRate);
	const totalBtcNeeded = btcForExpenses + btcForTaxes;

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
							BTC needed for 5 years of expenses:
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
							{totalBtcNeeded.toFixed(4)} BTC
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
							{formatCurrency(totalBtcNeeded * btcSalePrice, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell
							style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
						>
							Potential profit:
						</Table.Cell>
						<Table.Cell
							style={{
								border: "1px solid var(--gray-6)",
								padding: "8px",
								textAlign: "right",
							}}
						>
							{formatCurrency(
								(btcSalePrice - btcPurchasePrice) * totalBtcNeeded,
								foreignCurrency,
							)}
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default BitcoinInfoBox;
