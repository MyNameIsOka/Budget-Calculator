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
			<Table.Root>
				<Table.Body>
					<Table.Row>
						<Table.Cell>BTC needed for 5 years of expenses:</Table.Cell>
						<Table.Cell align="right">
							{btcForExpenses.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>BTC needed to pay for taxes:</Table.Cell>
						<Table.Cell align="right">{btcForTaxes.toFixed(4)} BTC</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Total BTC needed to sell:</Table.Cell>
						<Table.Cell align="right">
							{totalBtcNeeded.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>
							Equivalent in {foreignCurrency} (at sale price):
						</Table.Cell>
						<Table.Cell align="right">
							{formatCurrency(totalBtcNeeded * btcSalePrice, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Potential profit:</Table.Cell>
						<Table.Cell align="right">
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
