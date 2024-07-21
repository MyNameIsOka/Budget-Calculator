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
	t: (key: string, placeholders?: Record<string, string>) => string;
};

const Summary: React.FC<SummaryProps> = ({
	totalExpenses,
	loanAmountJPY,
	btcSalePrice,
	exchangeRate,
	foreignCurrency,
	taxAmount,
	t,
}) => {
	const amountToSell = totalExpenses - loanAmountJPY;
	const btcToSell = amountToSell / (btcSalePrice * exchangeRate);
	const btcForTaxes = taxAmount / (btcSalePrice * exchangeRate);
	const totalBtcNeeded = btcToSell + btcForTaxes;
	const effectiveTaxRate = (taxAmount / amountToSell) * 100;

	return (
		<Box>
			<Heading size="5" mb="3">
				{t("summary.title")}
			</Heading>
			<Table.Root style={{ borderCollapse: "collapse", width: "100%" }}>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>{t("summary.item")}</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>JPY</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>{foreignCurrency}</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>BTC</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell>{t("summary.totalExpenses")}</Table.Cell>
						<Table.Cell>{formatCurrency(totalExpenses)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalExpenses / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>
							{(totalExpenses / (btcSalePrice * exchangeRate)).toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>{t("summary.loanAmount")}</Table.Cell>
						<Table.Cell>{formatCurrency(loanAmountJPY)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(loanAmountJPY / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>
							{(loanAmountJPY / (btcSalePrice * exchangeRate)).toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>{t("summary.amountToSell")}</Table.Cell>
						<Table.Cell>{formatCurrency(amountToSell)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(amountToSell / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>{btcToSell.toFixed(4)}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>{t("summary.taxesFromSelling")}</Table.Cell>
						<Table.Cell>{formatCurrency(taxAmount)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(taxAmount / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>{btcForTaxes.toFixed(4)}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>{t("summary.totalBTCNeeded")}</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalBtcNeeded * btcSalePrice * exchangeRate)}
						</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalBtcNeeded * btcSalePrice, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>{totalBtcNeeded.toFixed(4)}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>{t("summary.effectiveTaxRate")}</Table.Cell>
						<Table.Cell colSpan={3}>{effectiveTaxRate.toFixed(2)}%</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default Summary;
